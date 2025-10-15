// app/api/me/route.ts
// 현재 로그인한 사용자 정보 확인 API
// 사용자 ID 확인용 임시 엔드포인트
// 관련 파일: lib/supabase/server.ts

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = await createClient()
    const {
        data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json(
            { error: '로그인이 필요합니다.' },
            { status: 401 }
        )
    }

    return NextResponse.json({
        id: user.id,
        email: user.email,
        emailConfirmed: !!user.email_confirmed_at,
        createdAt: user.created_at
    })
}

