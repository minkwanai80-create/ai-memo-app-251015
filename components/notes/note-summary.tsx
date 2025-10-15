// components/notes/note-summary.tsx
// 노트 AI 요약 컴포넌트
// AI 생성 요약 표시 및 재생성 기능
// 관련 파일: app/notes/[id]/ai-actions.ts

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { generateNoteSummary } from '@/app/notes/[id]/ai-actions'
import { Loader2, Sparkles } from 'lucide-react'

interface NoteSummaryProps {
    noteId: string
    initialSummary?: string | null
}

export function NoteSummary({ noteId, initialSummary }: NoteSummaryProps) {
    const [summary, setSummary] = useState(initialSummary)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>()

    const handleGenerate = async () => {
        setLoading(true)
        setError(undefined)

        const result = await generateNoteSummary(noteId)

        setLoading(false)

        if (result.success && result.summary) {
            setSummary(result.summary)
        } else {
            setError(result.error)
        }
    }

    if (summary) {
        return (
            <Card className="p-4 mb-4 bg-blue-50 border-blue-200">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        AI 요약
                    </h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleGenerate}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                생성 중...
                            </>
                        ) : (
                            '🔄 다시 생성'
                        )}
                    </Button>
                </div>
                <div className="text-sm text-blue-800 whitespace-pre-wrap leading-relaxed">
                    {summary}
                </div>
            </Card>
        )
    }

    return (
        <div className="mb-4">
            <Button
                onClick={handleGenerate}
                disabled={loading}
                variant="outline"
                size="sm"
            >
                {loading ? (
                    <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        요약 생성 중...
                    </>
                ) : (
                    <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        AI 요약 생성
                    </>
                )}
            </Button>
            {error && (
                <p className="text-sm text-red-600 mt-2">⚠️ {error}</p>
            )}
        </div>
    )
}

