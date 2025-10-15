// lib/ai/summarize.ts
// 노트 내용 AI 요약 생성
// Gemini API로 3-6개의 핵심 포인트 추출
// 관련 파일: lib/ai/gemini-client.ts, app/notes/[id]/actions.ts

import { getGeminiClient } from './gemini-client'

/**
 * 노트 내용을 3-6개의 핵심 포인트로 요약
 */
export async function summarizeNote(content: string): Promise<string> {
    // 최소 길이 검증
    if (!content || content.trim().length < 50) {
        throw new Error('노트가 너무 짧아 요약할 수 없습니다. (최소 50자)')
    }

    // 최대 길이 제한 (토큰 관리)
    const maxContentLength = 10000
    const truncatedContent =
        content.length > maxContentLength
            ? content.substring(0, maxContentLength) + '...'
            : content

    const client = getGeminiClient()

    const prompt = `다음 노트 내용을 분석하여 3-6개의 핵심 포인트로 요약해주세요.

요구사항:
- 각 포인트는 한 문장으로 작성
- 불릿 포인트(-)로 시작
- 중요한 내용 우선순위
- 간결하고 명확하게

노트 내용:
${truncatedContent}

요약 형식:
- 첫 번째 핵심 포인트
- 두 번째 핵심 포인트
- 세 번째 핵심 포인트`

    const result = await client.generateText({
        prompt,
        config: {
            maxOutputTokens: 500,
            temperature: 0.3, // 일관성을 위해 낮은 온도
            topP: 0.9,
            topK: 40
        }
    })

    // 요약 결과 정제
    let summary = result.text.trim()

    // 불릿 포인트가 없으면 추가
    if (!summary.includes('-') && !summary.includes('•')) {
        const lines = summary.split('\n').filter(line => line.trim())
        summary = lines.map(line => `- ${line.trim()}`).join('\n')
    }

    return summary
}

