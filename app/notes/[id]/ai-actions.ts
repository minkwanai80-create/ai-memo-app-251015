// app/notes/[id]/ai-actions.ts
// 노트 AI 기능 Server Actions
// 요약 생성 및 태그 생성 기능
// 관련 파일: lib/ai/summarize.ts, lib/ai/generate-tags.ts

'use server'

import { summarizeNote } from '@/lib/ai/summarize'
import { generateTags } from '@/lib/ai/generate-tags'
import { db } from '@/lib/db/connection'
import { notes } from '@/lib/db/schema/notes'
import { eq } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * 노트 요약 생성
 */
export async function generateNoteSummary(noteId: string) {
    try {
        // 인증 확인
        const supabase = await createClient()
        const {
            data: { user }
        } = await supabase.auth.getUser()

        if (!user) {
            return { success: false, error: '로그인이 필요합니다.' }
        }

        // 노트 조회
        const [note] = await db
            .select()
            .from(notes)
            .where(eq(notes.id, noteId))
            .limit(1)

        if (!note) {
            return { success: false, error: '노트를 찾을 수 없습니다.' }
        }

        if (note.userId !== user.id) {
            return { success: false, error: '권한이 없습니다.' }
        }

        // 요약 생성
        const summary = await summarizeNote(note.content || '')

        // TODO: DB 마이그레이션 후 활성화
        // DB 업데이트
        // await db
        //     .update(notes)
        //     .set({
        //         summary,
        //         updatedAt: new Date()
        //     })
        //     .where(eq(notes.id, noteId))

        // 페이지 재검증
        revalidatePath(`/notes/${noteId}`)
        revalidatePath('/notes')

        return { success: true, summary }
    } catch (error) {
        console.error('Summary generation error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : '요약 생성 실패'
        }
    }
}

/**
 * 노트 태그 생성
 */
export async function generateNoteTags(noteId: string) {
    try {
        const supabase = await createClient()
        const {
            data: { user }
        } = await supabase.auth.getUser()

        if (!user) {
            return { success: false, error: '로그인이 필요합니다.' }
        }

        // 노트 조회
        const [note] = await db
            .select()
            .from(notes)
            .where(eq(notes.id, noteId))
            .limit(1)

        if (!note) {
            return { success: false, error: '노트를 찾을 수 없습니다.' }
        }

        if (note.userId !== user.id) {
            return { success: false, error: '권한이 없습니다.' }
        }

        // 태그 생성
        const tagsArray = await generateTags(note.content || '')
        // const tagsString = tagsArray.join(', ')

        // TODO: DB 마이그레이션 후 활성화
        // DB 업데이트
        // await db
        //     .update(notes)
        //     .set({
        //         tags: tagsString,
        //         updatedAt: new Date()
        //     })
        //     .where(eq(notes.id, noteId))

        // 페이지 재검증
        revalidatePath(`/notes/${noteId}`)
        revalidatePath('/notes')

        return { success: true, tags: tagsArray }
    } catch (error) {
        console.error('Tags generation error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : '태그 생성 실패'
        }
    }
}

/**
 * 노트 태그 수동 업데이트
 */
export async function updateNoteTags(noteId: string, _tags: string[]) {
    try {
        const supabase = await createClient()
        const {
            data: { user }
        } = await supabase.auth.getUser()

        if (!user) {
            return { success: false, error: '로그인이 필요합니다.' }
        }

        // 권한 확인
        const [note] = await db
            .select()
            .from(notes)
            .where(eq(notes.id, noteId))
            .limit(1)

        if (!note || note.userId !== user.id) {
            return { success: false, error: '권한이 없습니다.' }
        }

        // const tagsString = tags.join(', ')

        // TODO: DB 마이그레이션 후 활성화
        // await db
        //     .update(notes)
        //     .set({
        //         tags: tagsString,
        //         updatedAt: new Date()
        //     })
        //     .where(eq(notes.id, noteId))

        revalidatePath(`/notes/${noteId}`)
        revalidatePath('/notes')

        return { success: true }
    } catch (_error) {
        return { success: false, error: '태그 업데이트 실패' }
    }
}

