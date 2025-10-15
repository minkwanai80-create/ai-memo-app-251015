// app/seed-data/layout.tsx
// 목업 데이터 생성 페이지 레이아웃

import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: '목업 데이터 생성 - AI 메모장',
    description: '테스트용 샘플 노트 생성'
}

export default function SeedDataLayout({
    children
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

