import { SignUpForm } from '@/components/auth/signup-form'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CuteBackground } from '@/components/layout/cute-background'

export default async function SignUpPage() {
    // 이미 로그인된 사용자는 대시보드로 리다이렉트
    const supabase = await createClient()
    const {
        data: { user },
        error
    } = await supabase.auth.getUser()

    if (user && !error) {
        redirect('/')
    }

    return (
        <>
            <CuteBackground />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 relative">
                <div className="w-full max-w-md space-y-8 relative z-10">
                <div className="text-center">
                    <div className="text-6xl mb-4">🌈✨</div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
                        AI 메모장
                    </h1>
                    <p className="text-purple-600 font-medium">
                        🎀 똑똑하고 귀여운 메모 관리의 시작 💕
                    </p>
                </div>
                <SignUpForm />
                </div>
            </div>
        </>
    )
}

export const metadata = {
    title: '회원가입 - AI 메모장',
    description: 'AI 메모장에 새 계정을 만들어보세요'
}
