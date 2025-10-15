// components/notes/markdown-preview.tsx
// 마크다운 미리보기 컴포넌트
// react-markdown으로 마크다운 렌더링
// 관련 파일: components/notes/note-editor.tsx

'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'

interface MarkdownPreviewProps {
    content: string
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
    if (!content || content.trim().length === 0) {
        return (
            <div className="text-gray-400 italic py-8 text-center">
                내용이 없습니다. 편집 모드로 전환하여 작성해주세요.
            </div>
        )
    }

    return (
        <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                components={{
                    // 코드 블록 스타일링
                    code({ node, className, children, ...props }) {
                        const inline = !className
                        return inline ? (
                            <code
                                className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono"
                                {...props}
                            >
                                {children}
                            </code>
                        ) : (
                            <code
                                className={`${className} block p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto`}
                                {...props}
                            >
                                {children}
                            </code>
                        )
                    },
                    // 링크 스타일링
                    a({ node, children, ...props }) {
                        return (
                            <a
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                                target="_blank"
                                rel="noopener noreferrer"
                                {...props}
                            >
                                {children}
                            </a>
                        )
                    },
                    // 체크박스 스타일링
                    input({ node, ...props }) {
                        if (props.type === 'checkbox') {
                            return (
                                <input
                                    className="mr-2 rounded"
                                    {...props}
                                    disabled={false}
                                />
                            )
                        }
                        return <input {...props} />
                    },
                    // 테이블 스타일링
                    table({ node, children, ...props }) {
                        return (
                            <div className="overflow-x-auto my-4">
                                <table
                                    className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                                    {...props}
                                >
                                    {children}
                                </table>
                            </div>
                        )
                    },
                    // 인용구 스타일링
                    blockquote({ node, children, ...props }) {
                        return (
                            <blockquote
                                className="border-l-4 border-blue-500 pl-4 py-2 my-4 italic bg-blue-50 dark:bg-blue-950/30"
                                {...props}
                            >
                                {children}
                            </blockquote>
                        )
                    }
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}

