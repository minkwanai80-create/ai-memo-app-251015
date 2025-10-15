// lib/ai/config.ts
// Gemini API 설정 관리
// 환경변수에서 설정을 로드하고 검증
// 관련 파일: lib/ai/gemini-client.ts, lib/ai/types.ts

import type { GeminiConfig } from './types'

/**
 * Gemini API 설정 가져오기
 */
export function getGeminiConfig(): GeminiConfig {
    const config: GeminiConfig = {
        apiKey: process.env.GEMINI_API_KEY || '',
        model: process.env.GEMINI_MODEL || 'gemini-2.0-flash-001',
        maxTokens: parseInt(process.env.GEMINI_MAX_TOKENS || '8192', 10),
        timeout: parseInt(process.env.GEMINI_TIMEOUT_MS || '10000', 10),
        debug: process.env.GEMINI_DEBUG === 'true',
        rateLimitPerMinute: parseInt(
            process.env.GEMINI_RATE_LIMIT || '60',
            10
        )
    }

    // 필수 설정 검증
    if (!config.apiKey) {
        throw new Error(
            'GEMINI_API_KEY 환경변수가 설정되지 않았습니다. .env.local 파일을 확인해주세요.'
        )
    }

    // 설정 값 검증
    if (config.maxTokens < 1 || config.maxTokens > 1000000) {
        throw new Error('GEMINI_MAX_TOKENS는 1에서 1,000,000 사이여야 합니다.')
    }

    if (config.timeout < 1000 || config.timeout > 60000) {
        throw new Error(
            'GEMINI_TIMEOUT_MS는 1,000에서 60,000 사이여야 합니다.'
        )
    }

    return config
}

/**
 * 환경별 설정 확인
 */
export function getEnvironment(): 'development' | 'staging' | 'production' {
    const env = process.env.NODE_ENV

    if (env === 'production') {
        return 'production'
    }

    if (env === 'staging') {
        return 'staging'
    }

    return 'development'
}

/**
 * 디버그 모드 확인
 */
export function isDebugMode(): boolean {
    return (
        process.env.GEMINI_DEBUG === 'true' ||
        process.env.NODE_ENV === 'development'
    )
}



