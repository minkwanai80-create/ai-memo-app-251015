// lib/ai/index.ts
// AI 서비스 모듈 진입점
// Gemini 클라이언트 및 유틸리티 함수 export
// 관련 파일: lib/ai/gemini-client.ts, lib/ai/types.ts, lib/ai/errors.ts

export { GeminiClient, getGeminiClient } from './gemini-client'
export { ImagenClient, getImagenClient } from './imagen-client'
export { summarizeNote } from './summarize'
export { generateTags } from './generate-tags'
export { getGeminiConfig, getEnvironment, isDebugMode } from './config'
export {
    GeminiError,
    GeminiErrorType,
    parseGeminiError,
    isRetryableError
} from './errors'
export {
    estimateTokens,
    validateTokenLimit,
    withRetry,
    sleep,
    logAPIUsage,
    withTimeout
} from './utils'
export type {
    GeminiConfig,
    GenerateTextParams,
    GenerateTextResponse,
    APIUsageLog,
    HealthCheckResponse
} from './types'
export type {
    GenerateImageParams,
    GenerateImageResponse
} from './imagen-client'

