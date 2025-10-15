// app/generate-image/actions.ts
// 이미지 생성 Server Actions
// Imagen API를 통한 이미지 생성
// 관련 파일: app/generate-image/page.tsx, lib/ai/imagen-client.ts

'use server'

import { getImagenClient } from '@/lib/ai/imagen-client'
import type {
    GenerateImageParams,
    GenerateImageResponse
} from '@/lib/ai/imagen-client'

/**
 * 이미지 생성
 */
export async function generateImageAction(
    params: GenerateImageParams
): Promise<{
    success: boolean
    data?: GenerateImageResponse
    error?: string
}> {
    try {
        const client = getImagenClient()
        const result = await client.generateImage(params)

        return {
            success: true,
            data: result
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : '이미지 생성 실패'
        }
    }
}



