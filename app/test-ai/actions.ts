// app/test-ai/actions.ts
// Gemini API 테스트를 위한 Server Actions
// 헬스체크 및 텍스트 생성 기능
// 관련 파일: app/test-ai/page.tsx, lib/ai/gemini-client.ts

'use server'

import { getGeminiClient } from '@/lib/ai/gemini-client'
import type { HealthCheckResponse, GenerateTextResponse } from '@/lib/ai/types'

/**
 * Gemini API 헬스체크
 */
export async function checkGeminiHealth(): Promise<{
    success: boolean
    data?: HealthCheckResponse
    error?: string
}> {
    try {
        const client = getGeminiClient()
        const result = await client.healthCheck()

        return {
            success: true,
            data: result
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : '알 수 없는 에러'
        }
    }
}

/**
 * Gemini API로 텍스트 생성
 */
export async function generateTextWithGemini(
    prompt: string
): Promise<{
    success: boolean
    data?: GenerateTextResponse
    error?: string
}> {
    try {
        if (!prompt || prompt.trim().length === 0) {
            return {
                success: false,
                error: '프롬프트를 입력해주세요.'
            }
        }

        const client = getGeminiClient()
        const result = await client.generateText({ prompt })

        return {
            success: true,
            data: result
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : '알 수 없는 에러'
        }
    }
}



