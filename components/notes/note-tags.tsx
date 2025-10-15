// components/notes/note-tags.tsx
// 노트 AI 태그 컴포넌트
// AI 생성 태그 표시 및 관리 기능
// 관련 파일: app/notes/[id]/ai-actions.ts

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Loader2, Sparkles } from 'lucide-react'
import {
    generateNoteTags,
    updateNoteTags
} from '@/app/notes/[id]/ai-actions'

interface NoteTagsProps {
    noteId: string
    initialTags?: string | null
}

export function NoteTags({ noteId, initialTags }: NoteTagsProps) {
    const [tags, setTags] = useState<string[]>(
        initialTags ? initialTags.split(', ').filter(Boolean) : []
    )
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>()

    const handleGenerate = async () => {
        setLoading(true)
        setError(undefined)

        const result = await generateNoteTags(noteId)

        setLoading(false)

        if (result.success && result.tags) {
            setTags(result.tags)
        } else {
            setError(result.error)
        }
    }

    const handleRemoveTag = async (tagToRemove: string) => {
        const newTags = tags.filter(tag => tag !== tagToRemove)
        setTags(newTags)
        await updateNoteTags(noteId, newTags)
    }

    return (
        <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                    🏷️ 태그
                </h3>
                <Button
                    onClick={handleGenerate}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            생성 중...
                        </>
                    ) : (
                        <>
                            <Sparkles className="h-3 w-3 mr-1" />
                            AI 태그 생성
                        </>
                    )}
                </Button>
            </div>

            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                        <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center gap-1 px-3 py-1"
                        >
                            {tag}
                            <button
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-1 hover:text-red-600 transition-colors"
                                aria-label={`${tag} 태그 제거`}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}

            {error && (
                <p className="text-sm text-red-600 mt-2">⚠️ {error}</p>
            )}
        </div>
    )
}

