// lib/ai/generate-tags.ts
// 노트 내용 기반 AI 태그 생성
// Gemini API로 최대 6개의 관련 태그 생성
// 관련 파일: lib/ai/gemini-client.ts, app/notes/[id]/actions.ts

import { getGeminiClient } from './gemini-client'

/**
 * 노트 내용을 분석하여 관련 태그 생성
 */
export async function generateTags(content: string): Promise<string[]> {
    // 최소 길이 검증
    if (!content || content.trim().length < 30) {
        throw new Error('노트가 너무 짧아 태그를 생성할 수 없습니다. (최소 30자)')
    }

    // 최대 길이 제한
    const maxContentLength = 5000
    const truncatedContent =
        content.length > maxContentLength
            ? content.substring(0, maxContentLength) + '...'
            : content

    const client = getGeminiClient()

    const prompt = `다음 노트 내용을 분석하여 관련된 태그를 최대 6개까지 생성해주세요.

규칙:
- 최대 6개까지만 생성
- 한글 또는 영문 단어
- 각 태그는 2-15자
- 중복 없이
- 관련성 높은 순서로
- 쉼표로 구분

노트 내용:
${truncatedContent}

태그만 출력해주세요 (예시: 개발, AI, 프로그래밍, 기술, 학습)`

    const result = await client.generateText({
        prompt,
        config: {
            maxOutputTokens: 100,
            temperature: 0.5,
            topP: 0.9
        }
    })

    // 태그 파싱 및 정제
    const rawTags = result.text
        .replace(/["\[\]]/g, '') // 따옴표, 대괄호 제거
        .split(/[,，]/) // 쉼표로 분리 (한글 쉼표 포함)
        .map(tag => tag.trim())
        .filter(tag => {
            // 유효성 검증
            return (
                tag.length > 0 &&
                tag.length <= 15 &&
                !/[.!?:]/.test(tag) // 특수문자 제외
            )
        })
        .slice(0, 6) // 최대 6개

    // 중복 제거 (대소문자 구분 없이)
    const uniqueTags = [...new Set(rawTags.map(tag => tag.toLowerCase()))]
    
    // 원래 케이스로 복원
    return uniqueTags
        .map(lowerTag => rawTags.find(tag => tag.toLowerCase() === lowerTag))
        .filter((tag): tag is string => tag !== undefined)
        .slice(0, 6)
}

