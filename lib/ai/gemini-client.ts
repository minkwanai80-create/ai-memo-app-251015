// lib/ai/gemini-client.ts
// Google Gemini API 클라이언트
// AI 텍스트 생성, 헬스체크, 에러 핸들링 담당
// 관련 파일: lib/ai/types.ts, lib/ai/errors.ts, lib/ai/utils.ts, lib/ai/config.ts

import { GoogleGenAI } from '@google/genai'
import { getGeminiConfig } from './config'
import { parseGeminiError } from './errors'
import {
    estimateTokens,
    logAPIUsage,
    validateTokenLimit,
    withRetry,
    withTimeout
} from './utils'
import type {
    GenerateTextParams,
    GenerateTextResponse,
    HealthCheckResponse
} from './types'

/**
 * Gemini API 클라이언트 클래스
 */
export class GeminiClient {
    private ai: GoogleGenAI
    private model: string
    private maxTokens: number
    private timeout: number
    private debug: boolean

    constructor() {
        const config = getGeminiConfig()

        // GoogleGenAI 인스턴스 초기화
        this.ai = new GoogleGenAI({
            apiKey: config.apiKey
        })

        this.model = config.model
        this.maxTokens = config.maxTokens
        this.timeout = config.timeout
        this.debug = config.debug

        if (this.debug) {
            console.log('[GeminiClient] 초기화 완료:', {
                model: this.model,
                maxTokens: this.maxTokens,
                timeout: this.timeout
            })
        }
    }

    /**
     * 헬스체크 - API 연결 상태 확인
     */
    async healthCheck(): Promise<HealthCheckResponse> {
        const startTime = Date.now()

        try {
            const result = await this.generateText({
                prompt: 'Hello',
                config: {
                    maxOutputTokens: 10
                }
            })

            const latencyMs = Date.now() - startTime

            return {
                healthy: !!result.text,
                latencyMs
            }
        } catch (error) {
            const geminiError = parseGeminiError(error)

            return {
                healthy: false,
                error: geminiError.message
            }
        }
    }

    /**
     * 텍스트 생성
     */
    async generateText(
        params: GenerateTextParams
    ): Promise<GenerateTextResponse> {
        const { prompt, config = {} } = params
        const startTime = Date.now()

        // 토큰 제한 검증
        const estimatedTokens = estimateTokens(prompt)
        if (!validateTokenLimit(estimatedTokens, this.maxTokens)) {
            throw parseGeminiError(
                new Error(
                    `입력 텍스트가 너무 깁니다. (예상: ${estimatedTokens} 토큰, 최대: ${this.maxTokens - 2000} 토큰)`
                )
            )
        }

        try {
            // 재시도 로직 포함하여 API 호출
            const response = await withRetry(async () => {
                return await withTimeout(
                    this.ai.models.generateContent({
                        model: this.model,
                        contents: prompt,
                        config: {
                            maxOutputTokens: this.maxTokens,
                            temperature: 0.7,
                            topP: 0.9,
                            topK: 40,
                            ...config
                        }
                    }),
                    this.timeout,
                    'Gemini API 응답 시간 초과'
                )
            })

            const latencyMs = Date.now() - startTime

            // 응답 텍스트 추출
            const text = response.text
            if (!text) {
                throw new Error('생성된 텍스트가 없습니다.')
            }

            // 토큰 사용량 정보
            const usageMetadata = response.usageMetadata
            const tokensUsed = usageMetadata
                ? {
                      input: usageMetadata.promptTokenCount || 0,
                      output: usageMetadata.candidatesTokenCount || 0,
                      total: usageMetadata.totalTokenCount || 0
                  }
                : undefined

            // 사용량 로깅
            logAPIUsage({
                timestamp: new Date(),
                model: this.model,
                inputTokens: tokensUsed?.input || estimatedTokens,
                outputTokens: tokensUsed?.output || estimateTokens(text),
                latencyMs,
                success: true
            })

            return {
                text,
                tokensUsed,
                finishReason: response.candidates?.[0]?.finishReason,
                latencyMs
            }
        } catch (error) {
            const latencyMs = Date.now() - startTime
            const geminiError = parseGeminiError(error)

            // 실패 로깅
            logAPIUsage({
                timestamp: new Date(),
                model: this.model,
                inputTokens: estimatedTokens,
                outputTokens: 0,
                latencyMs,
                success: false,
                error: geminiError.message
            })

            throw geminiError
        }
    }
}

/**
 * 싱글톤 인스턴스
 */
let geminiClientInstance: GeminiClient | null = null

/**
 * Gemini 클라이언트 인스턴스 가져오기
 */
export function getGeminiClient(): GeminiClient {
    if (!geminiClientInstance) {
        geminiClientInstance = new GeminiClient()
    }

    return geminiClientInstance
}

