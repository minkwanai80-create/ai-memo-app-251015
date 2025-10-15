import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import {
    getUserNotesPaginated,
    searchUserNotes,
    type NotesSort
} from '@/lib/notes/queries'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { NotesSortControl } from '@/components/notes/notes-sort'
import { NotesList } from '@/components/notes/notes-list'
import { SearchInput } from '@/components/notes/search-input'
import { Navigation } from '@/components/layout/navigation'
import { CuteBackground } from '@/components/layout/cute-background'

export default async function NotesPage({
    searchParams
}: {
    searchParams: Promise<{ page?: string; sort?: string; search?: string }>
}) {
    // 로그인 확인
    const supabase = await createClient()
    const {
        data: { user },
        error
    } = await supabase.auth.getUser()

    if (error || !user) {
        redirect('/signin')
    }

    // URL 파라미터 파싱
    const PAGE_SIZE = 12
    const params = await searchParams
    const currentPage = Math.max(1, parseInt(params?.page || '1', 10) || 1)
    const sortParam = (params?.sort || 'newest') as NotesSort
    const searchQuery = params?.search || ''

    // 검색 또는 일반 노트 조회
    const { notes, totalCount } = searchQuery
        ? await searchUserNotes({
              query: searchQuery,
              page: currentPage,
              limit: PAGE_SIZE,
              sort: ['newest', 'oldest', 'title'].includes(sortParam)
                  ? sortParam
                  : 'newest'
          })
        : await getUserNotesPaginated({
              page: currentPage,
              limit: PAGE_SIZE,
              sort: ['newest', 'oldest', 'title'].includes(sortParam)
                  ? sortParam
                  : 'newest'
          })

    return (
        <>
            <Navigation />
            <CuteBackground />
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                    {/* 헤더 */}
                    <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
                            <span className="text-4xl">📝</span>
                            내 노트
                        </h1>
                        <p className="text-purple-600 mt-2 font-medium">
                            {searchQuery
                                ? `🔍 '${searchQuery}' 검색 결과 ${totalCount}개`
                                : `💝 총 ${totalCount}개의 소중한 노트`}
                        </p>
                    </div>
                    <Link href="/notes/new">
                        <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all">
                            <span className="text-lg mr-1">✨</span>
                            새 노트 작성
                        </Button>
                    </Link>
                </div>

                {/* 검색 및 정렬 */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <SearchInput className="max-w-md" />
                    </div>
                    <div className="flex items-center">
                        <NotesSortControl currentSort={sortParam} />
                    </div>
                </div>

                {/* 노트 목록 */}
                <NotesList initialNotes={notes} searchQuery={searchQuery} />

                {/* 페이지네이션 */}
                {totalCount > PAGE_SIZE && (
                    <div className="flex items-center justify-center mt-8 gap-2">
                        <Link
                            href={`/notes?page=${Math.max(
                                1,
                                currentPage - 1
                            )}&sort=${sortParam}${
                                searchQuery
                                    ? `&search=${encodeURIComponent(
                                          searchQuery
                                      )}`
                                    : ''
                            }`}
                        >
                            <Button
                                variant="outline"
                                disabled={currentPage === 1}
                            >
                                이전
                            </Button>
                        </Link>
                        {Array.from(
                            {
                                length: Math.max(
                                    1,
                                    Math.ceil(totalCount / PAGE_SIZE)
                                )
                            },
                            (_, idx) => idx + 1
                        ).map(pageNum => {
                            const href = `/notes?page=${pageNum}&sort=${sortParam}${
                                searchQuery
                                    ? `&search=${encodeURIComponent(
                                          searchQuery
                                      )}`
                                    : ''
                            }`
                            const isActive = pageNum === currentPage
                            return (
                                <Link key={pageNum} href={href}>
                                    <Button
                                        variant={
                                            isActive ? 'default' : 'outline'
                                        }
                                        className="min-w-10"
                                    >
                                        {pageNum}
                                    </Button>
                                </Link>
                            )
                        })}
                        <Link
                            href={`/notes?page=${
                                currentPage + 1
                            }&sort=${sortParam}${
                                searchQuery
                                    ? `&search=${encodeURIComponent(
                                          searchQuery
                                      )}`
                                    : ''
                            }`}
                        >
                            <Button
                                variant="outline"
                                disabled={
                                    currentPage >=
                                    Math.ceil(totalCount / PAGE_SIZE)
                                }
                            >
                                다음
                            </Button>
                        </Link>
                    </div>
                )}
                </div>
            </div>
        </>
    )
}

export const metadata = {
    title: '노트 목록 - AI 메모장',
    description: '내가 작성한 노트들을 확인하세요'
}
