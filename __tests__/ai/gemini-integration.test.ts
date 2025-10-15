// __tests__/ai/gemini-integration.test.ts
// Gemini API 통합 테스트
// 실제 API 호출 테스트 (API 키 필요)
// 관련 파일: lib/ai/gemini-client.ts

import { describe, test, expect } from '@jest/globals'
import { GeminiClient } from '@/lib/ai/gemini-client'

// 실제 API 키가 있을 때만 테스트 실행
const hasRealApiKey =
    process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'test-api-key'
const skipIfNoApiKey = hasRealApiKey ? test : test.skip

describe('Gemini API Integration', () => {
    skipIfNoApiKey('should successfully generate text', async () => {
        const client = new GeminiClient()
        const result = await client.generateText({
            prompt: 'What is 2+2? Answer with just the number.'
        })

        expect(result.text).toBeTruthy()
        expect(typeof result.text).toBe('string')
        expect(result.text.length).toBeGreaterThan(0)
        expect(result.latencyMs).toBeGreaterThan(0)
    })

    skipIfNoApiKey('should return token usage information', async () => {
        const client = new GeminiClient()
        const result = await client.generateText({
            prompt: 'Say hello in one word.'
        })

        expect(result.tokensUsed).toBeDefined()
        if (result.tokensUsed) {
            expect(result.tokensUsed.input).toBeGreaterThan(0)
            expect(result.tokensUsed.output).toBeGreaterThan(0)
            expect(result.tokensUsed.total).toBeGreaterThan(0)
        }
    })

    skipIfNoApiKey('should handle health check', async () => {
        const client = new GeminiClient()
        const health = await client.healthCheck()

        expect(health.healthy).toBe(true)
        expect(health.latencyMs).toBeGreaterThan(0)
    })

    skipIfNoApiKey('should respect custom config', async () => {
        const client = new GeminiClient()
        const result = await client.generateText({
            prompt: 'Write a short sentence.',
            config: {
                temperature: 0.5,
                maxOutputTokens: 50
            }
        })

        expect(result.text).toBeTruthy()
        expect(typeof result.text).toBe('string')
    })

    test('should fail health check with invalid API key', async () => {
        process.env.GEMINI_API_KEY = 'invalid-key-12345'
        const client = new GeminiClient()
        const health = await client.healthCheck()

        expect(health.healthy).toBe(false)
        expect(health.error).toBeDefined()
    })
})

describe('Performance Tests', () => {
    skipIfNoApiKey(
        'should complete within timeout',
        async () => {
            const client = new GeminiClient()
            const startTime = Date.now()

            await client.generateText({
                prompt: 'Say hello.'
            })

            const duration = Date.now() - startTime
            const timeout = parseInt(
                process.env.GEMINI_TIMEOUT_MS || '10000'
            )

            expect(duration).toBeLessThan(timeout)
        },
        15000
    )
})



