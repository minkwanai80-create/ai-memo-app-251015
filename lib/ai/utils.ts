// lib/ai/utils.ts
// AI 서비스 유틸리티 함수
// 토큰 계산, 재시도 로직, 사용량 로깅 등
// 관련 파일: lib/ai/gemini-client.ts, lib/ai/types.ts, lib/ai/errors.ts

import { isRetryableError, type GeminiError } from './errors'
import type { APIUsageLog } from './types'

/**
 * 텍스트의 대략적인 토큰 수 추정
 * (1 토큰 ≈ 4 문자로 추정)
 */
export function estimateTokens(text: string): number {
    return Math.ceil(text.length / 4)
}

/**
 * 토큰 제한 검증
 */
export function validateTokenLimit(
    inputTokens: number,
    maxTokens: number = 8192
): boolean {
    // 응답용 토큰 여유분 확보 (2000 토큰)
    const reservedTokens = 2000
    return inputTokens <= maxTokens - reservedTokens
}

/**
 * 재시도 로직을 포함한 비동기 함수 실행
 */
export async function withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    backoffMs: number = 1000
): Promise<T> {
    let lastError: GeminiError

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await operation()
        } catch (error) {
            lastError = error as GeminiError

            // 재시도 불가능한 에러는 즉시 throw
            if (!isRetryableError(lastError)) {
                throw lastError
            }

            // 마지막 시도였으면 에러 throw
            if (attempt >= maxRetries) {
                throw lastError
            }

            // 지수 백오프로 대기
            const delay = backoffMs * Math.pow(2, attempt - 1)
            await sleep(delay)

            console.log(
                `[Gemini] 재시도 ${attempt}/${maxRetries} (${delay}ms 대기)`
            )
        }
    }

    throw lastError!
}

/**
 * 지연 함수
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * API 사용량 로깅
 */
export function logAPIUsage(log: APIUsageLog): void {
    // 개발 환경에서는 콘솔 출력
    if (process.env.NODE_ENV === 'development' || process.env.GEMINI_DEBUG === 'true') {
        console.log('[Gemini API Usage]', {
            timestamp: log.timestamp.toISOString(),
            model: log.model,
            tokens: {
                input: log.inputTokens,
                output: log.outputTokens,
                total: log.inputTokens + log.outputTokens
            },
            latency: `${log.latencyMs}ms`,
            success: log.success,
            error: log.error
        })
    }

    // TODO: 프로덕션에서는 실제 로깅 시스템으로 전송
    // 예: Datadog, CloudWatch, Sentry 등
}

/**
 * 타임아웃을 포함한 Promise 실행
 */
export async function withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
    errorMessage: string = 'Operation timed out'
): Promise<T> {
    let timeoutId: NodeJS.Timeout

    const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
            reject(new Error(errorMessage))
        }, timeoutMs)
    })

    try {
        return await Promise.race([promise, timeoutPromise])
    } finally {
        clearTimeout(timeoutId!)
    }
}



