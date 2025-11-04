import { SignInForm } from '@/components/auth/signin-form'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { CuteBackground } from '@/components/layout/cute-background'

async function SuccessMessage({
    searchParams
}: {
    searchParams: Promise<{ message?: string }>
}) {
    const params = await searchParams
    if (params.message === 'password-updated') {
        return (
            <div className="mb-4 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                ✅ 비밀번호가 성공적으로 변경되었습니다. 새 비밀번호로
                로그인해주세요.
            </div>
        )
    }
    return null
}

async function ErrorMessage({
    searchParams
}: {
    searchParams: Promise<{ error?: string }>
}) {
    const params = await searchParams
    if (params.error) {
        return (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                ⚠️ {decodeURIComponent(params.error)}
            </div>
        )
    }
    return null
}

export default async function SignInPage({
    searchParams
}: {
    searchParams: Promise<{ message?: string; error?: string }>
}) {
    // 이미 로그인된 사용자는 대시보드로 리다이렉트
    const supabase = await createClient()
    const {
        data: { user }
    } = await supabase.auth.getUser()

    if (user) {
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
                        💝 다시 만나서 반가워요! 🎀
                    </p>
                </div>
                <Suspense fallback={null}>
                    <SuccessMessage searchParams={searchParams} />
                </Suspense>
                <Suspense fallback={null}>
                    <ErrorMessage searchParams={searchParams} />
                </Suspense>
                <SignInForm />
                </div>
            </div>
        </>
    )
}

export const metadata = {
    title: '로그인 - AI 메모장',
    description: 'AI 메모장에 로그인하세요'
}
