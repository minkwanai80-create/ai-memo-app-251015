// app/test-ai/layout.tsx
// Gemini API 테스트 페이지 레이아웃
// metadata 설정

import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Gemini API 테스트 - AI 메모장',
    description: 'Google Gemini API 연동 테스트 페이지'
}

export default function TestAILayout({
    children
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}



