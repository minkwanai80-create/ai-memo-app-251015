import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { NotesList } from '@/components/notes/notes-list'
import { SearchInput } from '@/components/notes/search-input'
import { NotesSort } from '@/components/notes/notes-sort'
import { LogoutDialog } from '@/components/auth/logout-dialog'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { getUserNotes } from '@/lib/notes/queries'

export default async function HomePage({
    searchParams
}: {
    searchParams: Promise<{ q?: string; sort?: string }>
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

    // 검색 및 정렬 파라미터
    const params = await searchParams
    const query = params.q || ''
    const sort = params.sort || 'newest'

    // 노트 가져오기
    const allNotes = await getUserNotes()

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* 헤더 */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                AI 메모장
                            </h1>
                            <p className="text-gray-600 mt-1">
                                안녕하세요, {user.email}님! 👋
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href="/notes/new">
                                <Button>
                                    <PlusCircle className="mr-2 h-4 w-4" />새
                                    메모 작성
                                </Button>
                            </Link>
                            <LogoutDialog />
                        </div>
                    </div>
                </div>

                {/* 검색 및 정렬 */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <SearchInput initialValue={query} />
                    </div>
                    <NotesSort currentSort={sort} />
                </div>

                {/* 노트 목록 */}
                <NotesList notes={allNotes} searchQuery={query} sortBy={sort} />
            </div>
        </div>
    )
}

export const metadata = {
    title: 'AI 메모장 - 똑똑한 메모 관리',
    description: 'AI의 도움을 받아 효율적으로 메모를 관리하세요'
}
