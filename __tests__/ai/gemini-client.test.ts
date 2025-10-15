// __tests__/ai/gemini-client.test.ts
// Gemini 클라이언트 단위 테스트
// 클라이언트 초기화, 에러 핸들링, 토큰 제한 테스트
// 관련 파일: lib/ai/gemini-client.ts, lib/ai/utils.ts, lib/ai/errors.ts

import { describe, test, expect, beforeEach } from '@jest/globals'
import { GeminiClient, getGeminiClient } from '@/lib/ai/gemini-client'
import { estimateTokens, validateTokenLimit } from '@/lib/ai/utils'
import { GeminiErrorType } from '@/lib/ai/errors'

describe('GeminiClient', () => {
    let client: GeminiClient

    beforeEach(() => {
        // 환경변수 설정
        process.env.GEMINI_API_KEY = 'test-api-key-123'
        process.env.GEMINI_MODEL = 'gemini-2.0-flash-001'
        client = new GeminiClient()
    })

    test('should initialize with correct config', () => {
        expect(client).toBeDefined()
        expect(client).toBeInstanceOf(GeminiClient)
    })

    test('should throw error if API key is missing', () => {
        process.env.GEMINI_API_KEY = ''

        expect(() => {
            new GeminiClient()
        }).toThrow('GEMINI_API_KEY')
    })

    test('getGeminiClient should return singleton instance', () => {
        const instance1 = getGeminiClient()
        const instance2 = getGeminiClient()

        expect(instance1).toBe(instance2)
    })
})

describe('Token Utilities', () => {
    test('should estimate tokens correctly', () => {
        const shortText = 'Hello'
        const longText = 'a'.repeat(1000)

        expect(estimateTokens(shortText)).toBeGreaterThan(0)
        expect(estimateTokens(longText)).toBe(250) // 1000 / 4
    })

    test('should validate token limits', () => {
        const withinLimit = 5000
        const exceedsLimit = 10000

        expect(validateTokenLimit(withinLimit, 8192)).toBe(true)
        expect(validateTokenLimit(exceedsLimit, 8192)).toBe(false)
    })

    test('should respect reserved tokens for response', () => {
        // maxTokens 8192, reserved 2000
        // 최대 입력: 6192
        expect(validateTokenLimit(6000, 8192)).toBe(true)
        expect(validateTokenLimit(6500, 8192)).toBe(false)
    })
})

describe('Error Handling', () => {
    test('should handle token limit exceeded error', async () => {
        const client = new GeminiClient()
        const veryLongText = 'a'.repeat(50000)

        try {
            await client.generateText({
                prompt: veryLongText
            })
            fail('Should have thrown error')
        } catch (error: any) {
            expect(error.type).toBe(GeminiErrorType.TOKEN_LIMIT_EXCEEDED)
        }
    })
})



