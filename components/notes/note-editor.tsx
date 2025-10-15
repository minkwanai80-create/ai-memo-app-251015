'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { AutoResizeTextarea } from './auto-resize-textarea'
import { SaveStatus } from './save-status'
import { BackButton } from '@/components/ui/back-button'
import { DeleteNoteButton } from './delete-note-button'
import { MarkdownPreview } from './markdown-preview'
import { useAutoSave } from '@/lib/notes/hooks'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Eye, Edit3 } from 'lucide-react'
import { CuteBackground } from '@/components/layout/cute-background'
import type { Note } from '@/lib/db/schema/notes'

interface NoteEditorProps {
    note: Note
    className?: string
}

export function NoteEditor({ note, className }: NoteEditorProps) {
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit')

    const {
        title,
        content,
        saveStatus,
        lastSavedAt,
        hasChanges,
        handleTitleChange,
        handleContentChange,
        saveImmediately
    } = useAutoSave({
        noteId: note.id,
        initialTitle: note.title,
        initialContent: note.content || ''
    })

    const handleTitleClick = () => {
        setIsEditingTitle(true)
    }

    const handleTitleBlur = () => {
        setIsEditingTitle(false)
    }

    const handleTitleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setIsEditingTitle(false)
        } else if (e.key === 'Escape') {
            setIsEditingTitle(false)
        }
    }

    return (
        <>
            <CuteBackground />
            <div
                className={cn(
                    'min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative',
                    className
                )}
            >
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                {/* 헤더 영역 */}
                <div className="flex items-center justify-between mb-6">
                    <BackButton />
                    <div className="flex items-center gap-3">
                        {/* 편집/미리보기 토글 */}
                        <div className="flex items-center gap-1 border-2 border-purple-200 bg-white rounded-xl p-1 shadow-sm">
                            <Button
                                variant={viewMode === 'edit' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('edit')}
                                className={cn(
                                    viewMode === 'edit' &&
                                        'bg-gradient-to-r from-pink-500 to-purple-500'
                                )}
                            >
                                <span className="text-lg mr-1">✏️</span>
                                편집
                            </Button>
                            <Button
                                variant={
                                    viewMode === 'preview' ? 'default' : 'ghost'
                                }
                                size="sm"
                                onClick={() => setViewMode('preview')}
                                className={cn(
                                    viewMode === 'preview' &&
                                        'bg-gradient-to-r from-purple-500 to-blue-500'
                                )}
                            >
                                <span className="text-lg mr-1">👁️</span>
                                미리보기
                            </Button>
                        </div>
                        <DeleteNoteButton
                            noteId={note.id}
                            noteTitle={note.title}
                            variant="outline"
                            size="sm"
                            redirectAfterDelete={true}
                        />
                        <SaveStatus
                            status={saveStatus}
                            lastSavedAt={lastSavedAt}
                            onRetry={saveImmediately}
                        />
                    </div>
                </div>

                {/* 편집 영역 */}
                <div className="bg-white rounded-2xl shadow-lg border-2 border-pink-200 overflow-hidden">
                    {/* 제목 영역 */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        {isEditingTitle ? (
                            <Input
                                value={title}
                                onChange={e =>
                                    handleTitleChange(e.target.value)
                                }
                                onBlur={handleTitleBlur}
                                onKeyDown={handleTitleKeyDown}
                                className="text-2xl font-bold border-none p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                placeholder="제목을 입력하세요"
                                autoFocus
                            />
                        ) : (
                            <h1
                                onClick={handleTitleClick}
                                className="text-2xl font-bold cursor-text p-2 -m-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                role="button"
                                tabIndex={0}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        setIsEditingTitle(true)
                                    }
                                }}
                            >
                                {title || '제목을 클릭하여 편집하세요'}
                            </h1>
                        )}
                    </div>

                    {/* 내용 영역 */}
                    <div className="p-6 min-h-[400px]">
                        {viewMode === 'edit' ? (
                            <AutoResizeTextarea
                                value={content}
                                onChange={handleContentChange}
                                placeholder="내용을 입력하세요... (마크다운 지원)"
                                className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base leading-relaxed"
                                minRows={10}
                                maxRows={50}
                            />
                        ) : (
                            <MarkdownPreview content={content} />
                        )}
                    </div>
                </div>

                {/* 키보드 단축키 안내 */}
                <div className="mt-6 text-sm text-muted-foreground text-center space-y-2">
                    <div>
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                            {navigator.platform.toLowerCase().includes('mac')
                                ? 'Cmd'
                                : 'Ctrl'}
                        </kbd>
                        {' + '}
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                            S
                        </kbd>{' '}
                        로 즉시 저장 • 변경사항은 3초 후 자동 저장됩니다
                    </div>
                    <div className="text-xs text-gray-500">
                        📝 마크다운 문법 지원: **굵게**, *기울임*, `코드`, 
                        [링크](url), # 제목, - 리스트, &gt; 인용구
                    </div>
                </div>

                {/* 변경사항 표시 */}
                {hasChanges && saveStatus === 'idle' && (
                    <div className="mt-4 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800 rounded-md text-sm">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                            저장되지 않은 변경사항이 있습니다
                        </div>
                    </div>
                )}
                </div>
            </div>
        </>
    )
}
