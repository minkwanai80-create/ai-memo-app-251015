// lib/ai/errors.ts
// AI 서비스 에러 타입 및 에러 핸들링
// Gemini API 에러를 사용자 친화적 메시지로 변환
// 관련 파일: lib/ai/gemini-client.ts, lib/ai/types.ts

/**
 * Gemini API 에러 타입
 */
export enum GeminiErrorType {
    API_KEY_INVALID = 'API_KEY_INVALID',
    QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
    TIMEOUT = 'TIMEOUT',
    CONTENT_FILTERED = 'CONTENT_FILTERED',
    NETWORK_ERROR = 'NETWORK_ERROR',
    TOKEN_LIMIT_EXCEEDED = 'TOKEN_LIMIT_EXCEEDED',
    INVALID_REQUEST = 'INVALID_REQUEST',
    UNKNOWN = 'UNKNOWN'
}

/**
 * Gemini API 에러 클래스
 */
export class GeminiError extends Error {
    constructor(
        public type: GeminiErrorType,
        message: string,
        public originalError?: unknown
    ) {
        super(message)
        this.name = 'GeminiError'
    }
}

/**
 * 에러를 GeminiError로 변환
 */
export function parseGeminiError(error: unknown): GeminiError {
    if (error instanceof GeminiError) {
        return error
    }

    const errorMessage = error instanceof Error ? error.message : String(error)
    const lowerMessage = errorMessage.toLowerCase()
    console.log('lowerMessage', lowerMessage)

    // API 키 관련 에러
    if (
        lowerMessage.includes('api key') ||
        lowerMessage.includes('unauthorized') ||
        lowerMessage.includes('invalid key')
    ) {
        return new GeminiError(
            GeminiErrorType.API_KEY_INVALID,
            'API 키가 유효하지 않습니다. 환경변수를 확인해주세요.',
            error
        )
    }

    // 할당량 초과
    if (
        lowerMessage.includes('quota') ||
        lowerMessage.includes('rate limit') ||
        lowerMessage.includes('too many requests')
    ) {
        return new GeminiError(
            GeminiErrorType.QUOTA_EXCEEDED,
            'API 사용량 한도를 초과했습니다. 잠시 후 다시 시도해주세요.',
            error
        )
    }

    // 타임아웃
    if (
        lowerMessage.includes('timeout') ||
        lowerMessage.includes('timed out')
    ) {
        return new GeminiError(
            GeminiErrorType.TIMEOUT,
            'API 응답 시간이 초과되었습니다. 다시 시도해주세요.',
            error
        )
    }

    // 콘텐츠 필터링
    if (
        lowerMessage.includes('safety') ||
        lowerMessage.includes('blocked') ||
        lowerMessage.includes('filtered')
    ) {
        return new GeminiError(
            GeminiErrorType.CONTENT_FILTERED,
            '콘텐츠가 안전 정책에 의해 차단되었습니다.',
            error
        )
    }

    // 토큰 제한 초과
    if (
        lowerMessage.includes('token') ||
        lowerMessage.includes('너무 깁니다') ||
        lowerMessage.includes('예상:') ||
        lowerMessage.includes('최대:')
    ) {
        return new GeminiError(
            GeminiErrorType.TOKEN_LIMIT_EXCEEDED,
            '입력 텍스트가 너무 깁니다. 내용을 줄여주세요.',
            error
        )
    }

    // 네트워크 에러
    if (
        lowerMessage.includes('network') ||
        lowerMessage.includes('fetch') ||
        lowerMessage.includes('connection')
    ) {
        return new GeminiError(
            GeminiErrorType.NETWORK_ERROR,
            '네트워크 연결을 확인해주세요.',
            error
        )
    }

    // 잘못된 요청
    if (
        lowerMessage.includes('invalid') ||
        lowerMessage.includes('bad request')
    ) {
        return new GeminiError(
            GeminiErrorType.INVALID_REQUEST,
            '요청 형식이 올바르지 않습니다.',
            error
        )
    }

    // 알 수 없는 에러
    return new GeminiError(
        GeminiErrorType.UNKNOWN,
        `AI 처리 중 오류가 발생했습니다: ${errorMessage}`,
        error
    )
}

/**
 * 재시도 가능한 에러인지 확인
 */
export function isRetryableError(error: GeminiError): boolean {
    const retryableTypes = [
        GeminiErrorType.TIMEOUT,
        GeminiErrorType.NETWORK_ERROR,
        GeminiErrorType.QUOTA_EXCEEDED
    ]

    return retryableTypes.includes(error.type)
}

