// app/test-ai/page.tsx
// Gemini API 테스트 페이지
// AI 기능을 웹에서 직접 테스트
// 관련 파일: app/test-ai/actions.ts

'use client'

import { useState } from 'react'
import { checkGeminiHealth, generateTextWithGemini } from './actions'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestAIPage() {
    const [healthStatus, setHealthStatus] = useState<{
        loading: boolean
        result?: string
        error?: string
    }>({ loading: false })

    const [textGen, setTextGen] = useState<{
        loading: boolean
        prompt: string
        result?: string
        tokens?: string
        latency?: string
        error?: string
    }>({ loading: false, prompt: '' })

    // 헬스체크 실행
    const handleHealthCheck = async () => {
        setHealthStatus({ loading: true })

        const result = await checkGeminiHealth()

        if (result.success && result.data) {
            setHealthStatus({
                loading: false,
                result: result.data.healthy
                    ? `✅ API 정상 (응답시간: ${result.data.latencyMs}ms)`
                    : `❌ API 에러: ${result.data.error}`
            })
        } else {
            setHealthStatus({
                loading: false,
                error: result.error || '헬스체크 실패'
            })
        }
    }

    // 텍스트 생성 실행
    const handleGenerateText = async () => {
        if (!textGen.prompt.trim()) {
            setTextGen(prev => ({
                ...prev,
                error: '프롬프트를 입력해주세요.'
            }))
            return
        }

        setTextGen(prev => ({ ...prev, loading: true, error: undefined }))

        const result = await generateTextWithGemini(textGen.prompt)

        if (result.success && result.data) {
            setTextGen(prev => ({
                ...prev,
                loading: false,
                result: result.data.text,
                tokens: result.data.tokensUsed
                    ? `입력: ${result.data.tokensUsed.input}, 출력: ${result.data.tokensUsed.output}, 총합: ${result.data.tokensUsed.total}`
                    : '토큰 정보 없음',
                latency: `${result.data.latencyMs}ms`
            }))
        } else {
            setTextGen(prev => ({
                ...prev,
                loading: false,
                error: result.error || '텍스트 생성 실패'
            }))
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                        🤖✨ Gemini API 테스트
                    </h1>
                    <p className="text-purple-600 font-medium text-lg">
                        🌈 Google Gemini API 연동 상태를 확인하고 테스트하세요 💝
                    </p>
                </div>

                {/* 헬스체크 섹션 */}
                <Card>
                    <CardHeader>
                        <CardTitle>1️⃣ API 헬스체크</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600">
                            Gemini API 연결 상태를 확인합니다.
                        </p>

                        <Button
                            onClick={handleHealthCheck}
                            disabled={healthStatus.loading}
                            className="w-full sm:w-auto"
                        >
                            {healthStatus.loading
                                ? '확인 중...'
                                : '헬스체크 실행'}
                        </Button>

                        {healthStatus.result && (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                                <p className="text-sm text-green-800">
                                    {healthStatus.result}
                                </p>
                            </div>
                        )}

                        {healthStatus.error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm text-red-800">
                                    ❌ {healthStatus.error}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* 텍스트 생성 섹션 */}
                <Card>
                    <CardHeader>
                        <CardTitle>2️⃣ 텍스트 생성 테스트</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600">
                            프롬프트를 입력하고 AI 응답을 확인하세요.
                        </p>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                프롬프트 입력
                            </label>
                            <Textarea
                                value={textGen.prompt}
                                onChange={e =>
                                    setTextGen(prev => ({
                                        ...prev,
                                        prompt: e.target.value,
                                        error: undefined
                                    }))
                                }
                                placeholder="예: 인공지능에 대해 간단히 설명해주세요."
                                className="min-h-[100px]"
                                disabled={textGen.loading}
                            />
                        </div>

                        <Button
                            onClick={handleGenerateText}
                            disabled={textGen.loading || !textGen.prompt.trim()}
                            className="w-full sm:w-auto"
                        >
                            {textGen.loading ? '생성 중...' : '텍스트 생성'}
                        </Button>

                        {textGen.result && (
                            <div className="space-y-3">
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                                    <h4 className="text-sm font-semibold text-blue-900 mb-2">
                                        ✨ 생성된 텍스트
                                    </h4>
                                    <p className="text-sm text-blue-800 whitespace-pre-wrap">
                                        {textGen.result}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                                        <p className="text-xs text-gray-600 mb-1">
                                            토큰 사용량
                                        </p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {textGen.tokens}
                                        </p>
                                    </div>

                                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                                        <p className="text-xs text-gray-600 mb-1">
                                            응답 시간
                                        </p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {textGen.latency}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {textGen.error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm text-red-800">
                                    ❌ {textGen.error}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* 환경 정보 */}
                <Card>
                    <CardHeader>
                        <CardTitle>⚙️ 환경 설정</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">모델:</span>
                                <span className="font-mono text-gray-900">
                                    {process.env.GEMINI_MODEL ||
                                        'gemini-2.0-flash-001'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    최대 토큰:
                                </span>
                                <span className="font-mono text-gray-900">
                                    {process.env.GEMINI_MAX_TOKENS || '8192'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    타임아웃:
                                </span>
                                <span className="font-mono text-gray-900">
                                    {process.env.GEMINI_TIMEOUT_MS || '10000'}
                                    ms
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">API 키:</span>
                                <span className="font-mono text-gray-900">
                                    {process.env.GEMINI_API_KEY
                                        ? '설정됨 ✓'
                                        : '미설정 ✗'}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 안내 */}
                <div className="text-center text-sm text-gray-500">
                    <p>
                        💡 이 페이지는 개발/테스트용입니다. 프로덕션 배포 시
                        제거하세요.
                    </p>
                    <p className="mt-1">
                        경로:{' '}
                        <code className="px-2 py-1 bg-gray-100 rounded">
                            /test-ai
                        </code>
                    </p>
                </div>
            </div>
        </div>
    )
}

