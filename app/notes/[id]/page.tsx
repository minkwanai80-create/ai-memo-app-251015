import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getNoteById } from '@/lib/notes/queries'
import { NoteEditor } from '@/components/notes/note-editor'
import { NoteSummary } from '@/components/notes/note-summary'
import { NoteTags } from '@/components/notes/note-tags'

export default async function NoteDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const supabase = await createClient()
    const {
        data: { user },
        error
    } = await supabase.auth.getUser()

    if (error || !user) {
        redirect('/signin')
    }

    const { id } = await params
    const note = await getNoteById(id)
    if (!note) {
        notFound()
    }

    return (
        <div>
            <NoteSummary noteId={note.id} initialSummary={note.summary} />
            <NoteTags noteId={note.id} initialTags={note.tags} />
            <NoteEditor note={note} />
        </div>
    )
}

export const metadata = {
    title: '노트 상세 - AI 메모장',
    description: '노트 상세 보기'
}
