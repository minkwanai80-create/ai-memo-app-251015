// app/auth/callback/route.ts
// Supabase 인증 콜백 처리 라우트
// 이메일 인증 링크 클릭 시 코드를 세션으로 교환
// 관련 파일: lib/supabase/server.ts, lib/auth/actions.ts

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/onboarding'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // 인증 성공 시 온보딩 페이지로 리다이렉트
            return NextResponse.redirect(`${origin}${next}`)
        }

        // 에러 메시지와 함께 로그인 페이지로 리다이렉트
        const errorMessage = encodeURIComponent(
            '인증 링크가 만료되었거나 유효하지 않습니다. 다시 시도해주세요.'
        )
        return NextResponse.redirect(
            `${origin}/signin?error=${errorMessage}`
        )
    }

    // 코드가 없는 경우 로그인 페이지로 리다이렉트
    const errorMessage = encodeURIComponent(
        '인증 코드가 없습니다. 이메일의 링크를 다시 확인해주세요.'
    )
    return NextResponse.redirect(`${origin}/signin?error=${errorMessage}`)
}
