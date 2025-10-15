// lib/ai/types.ts
// AI 서비스 관련 타입 정의
// Gemini API 요청/응답 타입 및 에러 타입 정의
// 관련 파일: lib/ai/gemini-client.ts, lib/ai/errors.ts, lib/ai/utils.ts

import type { GenerateContentConfig } from '@google/genai'

/**
 * Gemini API 설정 인터페이스
 */
export interface GeminiConfig {
    apiKey: string
    model: string
    maxTokens: number
    timeout: number
    debug: boolean
    rateLimitPerMinute: number
}

/**
 * AI 텍스트 생성 요청 파라미터
 */
export interface GenerateTextParams {
    prompt: string
    config?: Partial<GenerateContentConfig>
}

/**
 * AI 텍스트 생성 응답
 */
export interface GenerateTextResponse {
    text: string
    tokensUsed?: {
        input: number
        output: number
        total: number
    }
    finishReason?: string
    latencyMs: number
}

/**
 * API 사용량 로그
 */
export interface APIUsageLog {
    timestamp: Date
    model: string
    inputTokens: number
    outputTokens: number
    latencyMs: number
    success: boolean
    error?: string
}

/**
 * 헬스체크 응답
 */
export interface HealthCheckResponse {
    healthy: boolean
    latencyMs?: number
    error?: string
}



