import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function HomePage() {
    // 로그인 확인
    const supabase = await createClient()
    const {
        data: { user },
        error
    } = await supabase.auth.getUser()

    if (error || !user) {
        redirect('/signin')
    }

    // 로그인된 사용자는 노트 페이지로 리다이렉트
    redirect('/notes')
}

export const metadata = {
    title: 'AI 메모장 - 똑똑한 메모 관리',
    description: 'AI의 도움을 받아 효율적으로 메모를 관리하세요'
}
