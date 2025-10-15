// app/generate-image/layout.tsx
// 이미지 생성 페이지 레이아웃
// metadata 설정

import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'AI 이미지 생성 - AI 메모장',
    description: 'Gemini Imagen API로 텍스트에서 이미지를 생성하세요'
}

export default function GenerateImageLayout({
    children
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}



