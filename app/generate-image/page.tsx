// app/generate-image/page.tsx
// AI 이미지 생성 페이지
// Imagen API로 텍스트에서 이미지 생성
// 관련 파일: app/generate-image/actions.ts

'use client'

import { useState } from 'react'
import { generateImageAction } from './actions'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4'

export default function GenerateImagePage() {
    const [prompt, setPrompt] = useState('')
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1')
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState<string[]>([])
    const [error, setError] = useState<string>()
    const [latency, setLatency] = useState<number>()

    // 이미지 생성
    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('프롬프트를 입력해주세요.')
            return
        }

        setLoading(true)
        setError(undefined)
        setImages([])

        const result = await generateImageAction({
            prompt,
            numberOfImages: 1,
            aspectRatio
        })

        setLoading(false)

        if (result.success && result.data) {
            setImages(result.data.images)
            setLatency(result.data.latencyMs)
            if (result.data.raiFilteredReason) {
                setError(
                    `경고: ${result.data.raiFilteredReason}`
                )
            }
        } else {
            setError(result.error || '이미지 생성 실패')
        }
    }

    // 이미지 다운로드
    const handleDownload = (imageUrl: string, index: number) => {
        const link = document.createElement('a')
        link.href = imageUrl
        link.download = `generated-image-${Date.now()}-${index}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    // 엔터 키 처리
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            handleGenerate()
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* 헤더 */}
                <div className="text-center">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                        🎨✨ AI 이미지 생성
                    </h1>
                    <p className="text-purple-600 font-medium text-lg">
                        💭 텍스트로 귀여운 이미지를 만들어보세요 🌸
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 입력 섹션 */}
                    <Card>
                        <CardHeader>
                            <CardTitle>프롬프트 입력</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* 프롬프트 */}
                            <div className="space-y-2">
                                <Label htmlFor="prompt">
                                    원하는 이미지를 설명해주세요
                                </Label>
                                <Textarea
                                    id="prompt"
                                    value={prompt}
                                    onChange={e => setPrompt(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="예: A cute cat playing with a ball in a sunny garden"
                                    className="min-h-[120px]"
                                    disabled={loading}
                                    maxLength={500}
                                />
                                <p className="text-xs text-gray-500">
                                    {prompt.length}/500 글자 | Ctrl+Enter로 생성
                                </p>
                            </div>

                            {/* 비율 선택 */}
                            <div className="space-y-2">
                                <Label>이미지 비율</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['1:1', '16:9', '9:16', '4:3', '3:4'] as AspectRatio[]).map(
                                        ratio => (
                                            <Button
                                                key={ratio}
                                                variant={
                                                    aspectRatio === ratio
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                onClick={() =>
                                                    setAspectRatio(ratio)
                                                }
                                                disabled={loading}
                                                className="text-sm"
                                            >
                                                {ratio}
                                            </Button>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* 생성 버튼 */}
                            <Button
                                onClick={handleGenerate}
                                disabled={loading || !prompt.trim()}
                                className="w-full"
                                size="lg"
                            >
                                {loading ? '생성 중...' : '🎨 이미지 생성'}
                            </Button>

                            {/* 에러 메시지 */}
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-sm text-red-800">
                                        ⚠️ {error}
                                    </p>
                                </div>
                            )}

                            {/* 예시 프롬프트 */}
                            <div className="space-y-2">
                                <Label className="text-sm text-gray-600">
                                    💡 프롬프트 예시
                                </Label>
                                <div className="space-y-1">
                                    {[
                                        'A serene mountain landscape at sunset',
                                        'Modern minimalist office design',
                                        'Abstract colorful geometric patterns',
                                        'A cute robot reading a book'
                                    ].map((example, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setPrompt(example)}
                                            disabled={loading}
                                            className="text-xs text-blue-600 hover:text-blue-800 hover:underline block w-full text-left"
                                        >
                                            {example}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 결과 섹션 */}
                    <Card>
                        <CardHeader>
                            <CardTitle>생성된 이미지</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading && (
                                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                                    <p className="text-sm text-gray-600">
                                        이미지를 생성하는 중... (최대 30초)
                                    </p>
                                </div>
                            )}

                            {!loading && images.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                    <svg
                                        className="w-24 h-24 mb-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <p className="text-sm">
                                        프롬프트를 입력하고 이미지를 생성하세요
                                    </p>
                                </div>
                            )}

                            {images.length > 0 && (
                                <div className="space-y-4">
                                    {images.map((imageUrl, index) => (
                                        <div
                                            key={index}
                                            className="space-y-3"
                                        >
                                            <div className="relative rounded-lg overflow-hidden border border-gray-200">
                                                <img
                                                    src={imageUrl}
                                                    alt={`Generated ${index + 1}`}
                                                    className="w-full h-auto"
                                                />
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() =>
                                                        handleDownload(
                                                            imageUrl,
                                                            index
                                                        )
                                                    }
                                                    variant="outline"
                                                    className="flex-1"
                                                >
                                                    💾 다운로드
                                                </Button>
                                                <Button
                                                    onClick={() =>
                                                        navigator.clipboard.writeText(
                                                            imageUrl
                                                        )
                                                    }
                                                    variant="outline"
                                                    className="flex-1"
                                                >
                                                    📋 복사
                                                </Button>
                                            </div>
                                        </div>
                                    ))}

                                    {latency && (
                                        <div className="text-xs text-gray-500 text-center">
                                            생성 시간: {(latency / 1000).toFixed(1)}초
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* 안내 */}
                <Card>
                    <CardHeader>
                        <CardTitle>📌 사용 안내</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-gray-600">
                        <p>• 영어 프롬프트가 더 정확한 결과를 제공합니다</p>
                        <p>• 구체적으로 설명할수록 원하는 이미지에 가깝습니다</p>
                        <p>• 부적절한 콘텐츠는 자동으로 필터링됩니다</p>
                        <p>• API 사용량 제한이 있을 수 있습니다</p>
                        <p>
                            • 생성된 이미지의 저작권은 사용자에게 있습니다
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}



