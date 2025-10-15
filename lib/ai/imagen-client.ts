// lib/ai/imagen-client.ts
// Google Imagen API 클라이언트
// AI 이미지 생성 기능 담당
// 관련 파일: lib/ai/gemini-client.ts, lib/ai/types.ts, lib/ai/errors.ts

import { GoogleGenAI } from '@google/genai'
import { getGeminiConfig } from './config'
import { parseGeminiError } from './errors'
import { logAPIUsage, withTimeout } from './utils'

/**
 * 이미지 생성 파라미터
 */
export interface GenerateImageParams {
    prompt: string
    numberOfImages?: number
    aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4'
    imageSize?: string
}

/**
 * 이미지 생성 응답
 */
export interface GenerateImageResponse {
    images: string[] // base64 data URLs
    raiFilteredReason?: string
    latencyMs: number
}

/**
 * Imagen API 클라이언트 클래스
 */
export class ImagenClient {
    private ai: GoogleGenAI
    private timeout: number
    private debug: boolean

    constructor() {
        const config = getGeminiConfig()

        this.ai = new GoogleGenAI({
            apiKey: config.apiKey
        })

        this.timeout = 30000 // 30초
        this.debug = config.debug

        if (this.debug) {
            console.log('[ImagenClient] 초기화 완료')
        }
    }

    /**
     * 이미지 생성
     */
    async generateImage(
        params: GenerateImageParams
    ): Promise<GenerateImageResponse> {
        const { prompt, numberOfImages = 1, aspectRatio = '1:1', imageSize } = params
        const startTime = Date.now()

        try {
            // 프롬프트 검증
            if (!prompt || prompt.trim().length === 0) {
                throw new Error('프롬프트를 입력해주세요.')
            }

            if (prompt.length > 500) {
                throw new Error('프롬프트는 최대 500자까지 가능합니다.')
            }

            if (this.debug) {
                console.log('[ImagenClient] 이미지 생성 시작:', {
                    prompt: prompt.substring(0, 50),
                    numberOfImages,
                    aspectRatio
                })
            }

            // 타임아웃 포함하여 API 호출
            const response = await withTimeout(
                this.ai.models.generateImages({
                    model: 'imagen-3.0-generate-002',
                    prompt,
                    config: {
                        numberOfImages,
                        aspectRatio,
                        includeRaiReason: true,
                        ...(imageSize && { imageSize })
                    }
                }),
                this.timeout,
                '이미지 생성 시간 초과 (30초)'
            )

            const latencyMs = Date.now() - startTime

            // 이미지 추출
            const images: string[] = []
            let raiFilteredReason: string | undefined

            if (response.generatedImages) {
                for (const img of response.generatedImages) {
                    if (img.image?.imageBytes) {
                        // base64를 data URL로 변환
                        const base64 = img.image.imageBytes
                        images.push(`data:image/png;base64,${base64}`)
                    }
                    if (img.raiFilteredReason) {
                        raiFilteredReason = img.raiFilteredReason
                    }
                }
            }

            if (images.length === 0) {
                throw new Error('이미지가 생성되지 않았습니다.')
            }

            // 사용량 로깅
            logAPIUsage({
                timestamp: new Date(),
                model: 'imagen-3.0-generate-002',
                inputTokens: Math.ceil(prompt.length / 4),
                outputTokens: images.length * 1000, // 대략적인 추정
                latencyMs,
                success: true
            })

            return {
                images,
                raiFilteredReason,
                latencyMs
            }
        } catch (error) {
            const latencyMs = Date.now() - startTime
            const geminiError = parseGeminiError(error)

            // 실패 로깅
            logAPIUsage({
                timestamp: new Date(),
                model: 'imagen-3.0-generate-002',
                inputTokens: Math.ceil(prompt.length / 4),
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
let imagenClientInstance: ImagenClient | null = null

/**
 * Imagen 클라이언트 인스턴스 가져오기
 */
export function getImagenClient(): ImagenClient {
    if (!imagenClientInstance) {
        imagenClientInstance = new ImagenClient()
    }

    return imagenClientInstance
}



