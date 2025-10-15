// app/seed-data/page.tsx
// 목업 데이터 생성 페이지
// 테스트용 샘플 노트를 간편하게 생성
// 관련 파일: app/seed-data/actions.ts

'use client'

import { useState, useEffect } from 'react'
import { seedMockNotes, getUserInfo } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function SeedDataPage() {
    const [userInfo, setUserInfo] = useState<{
        id: string
        email: string
    } | null>(null)
    const [loading, setLoading] = useState(true)
    const [seeding, setSeeding] = useState(false)
    const [result, setResult] = useState<{
        success?: boolean
        message?: string
        count?: number
    }>()

    useEffect(() => {
        async function fetchUser() {
            const info = await getUserInfo()
            setUserInfo(info)
            setLoading(false)
        }
        fetchUser()
    }, [])

    const handleSeed = async () => {
        setSeeding(true)
        setResult(undefined)

        const response = await seedMockNotes()

        setSeeding(false)
        setResult(response)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        )
    }

    if (!userInfo) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle>로그인 필요</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 mb-4">
                            목업 데이터를 생성하려면 먼저 로그인해주세요.
                        </p>
                        <Button asChild>
                            <a href="/signin">로그인하기</a>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        🌱 목업 데이터 생성
                    </h1>
                    <p className="text-gray-600">
                        테스트용 샘플 노트를 생성합니다
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>사용자 정보</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">이메일:</span>
                            <span className="font-mono">{userInfo.email}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">사용자 ID:</span>
                            <span className="font-mono text-xs">
                                {userInfo.id}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>생성될 노트 (10개)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm">
                            <li>📝 회의록 - 프로젝트 킥오프</li>
                            <li>⚛️ React 성능 최적화 팁</li>
                            <li>📔 오늘의 일기</li>
                            <li>💻 TypeScript 타입 가드 패턴</li>
                            <li>📚 독서 노트: 클린 코드</li>
                            <li>🛒 장보기 목록</li>
                            <li>🚀 Next.js App Router 마이그레이션</li>
                            <li>💪 운동 루틴</li>
                            <li>🔒 Supabase RLS 정책 가이드</li>
                            <li>💡 프로젝트 아이디어 브레인스토밍</li>
                        </ul>
                    </CardContent>
                </Card>

                <Button
                    onClick={handleSeed}
                    disabled={seeding}
                    className="w-full"
                    size="lg"
                >
                    {seeding ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            생성 중...
                        </>
                    ) : (
                        '🌱 목업 데이터 생성'
                    )}
                </Button>

                {result && (
                    <Card
                        className={
                            result.success
                                ? 'border-green-200 bg-green-50'
                                : 'border-red-200 bg-red-50'
                        }
                    >
                        <CardContent className="pt-6">
                            <p
                                className={
                                    result.success
                                        ? 'text-green-800'
                                        : 'text-red-800'
                                }
                            >
                                {result.success ? '✅' : '❌'} {result.message}
                            </p>
                            {result.count && (
                                <p className="text-sm text-gray-600 mt-2">
                                    생성된 노트: {result.count}개
                                </p>
                            )}
                            {result.success && (
                                <Button asChild className="w-full mt-4">
                                    <a href="/notes">노트 목록 보기</a>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}

                <div className="text-center text-sm text-gray-500">
                    <p>💡 이미 노트가 있다면 추가로 생성됩니다.</p>
                    <p className="mt-1">개발/테스트 환경에서만 사용하세요.</p>
                </div>
            </div>
        </div>
    )
}

