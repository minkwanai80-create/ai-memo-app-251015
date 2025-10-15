// components/layout/navigation.tsx
// 전역 네비게이션 컴포넌트
// AI 기능 및 노트 기능 메뉴
// 관련 파일: app/layout.tsx, app/notes/page.tsx

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogoutDialog } from '@/components/auth/logout-dialog'
import {
    Home,
    FileText,
    PlusCircle,
    Sparkles,
    Image as ImageIcon,
    TestTube,
    Database
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function Navigation() {
    const pathname = usePathname()

    const navItems = [
        {
            href: '/notes',
            label: '📚 노트',
            icon: Home,
            emoji: '📚'
        },
        {
            href: '/notes/new',
            label: '✏️ 새 노트',
            icon: PlusCircle,
            highlight: true,
            emoji: '✏️'
        }
    ]

    const aiItems = [
        {
            href: '/test-ai',
            label: '🧪 AI 테스트',
            icon: TestTube,
            emoji: '🧪'
        },
        {
            href: '/generate-image',
            label: '🎨 이미지 생성',
            icon: ImageIcon,
            emoji: '🎨'
        },
        {
            href: '/seed-data',
            label: '🌱 목업 데이터',
            icon: Database,
            emoji: '🌱'
        }
    ]

    return (
        <nav className="bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 border-b-4 border-pink-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* 로고 */}
                    <Link
                        href="/notes"
                        className="flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                        <div className="text-3xl">🌈</div>
                        <span className="text-xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                            ✨ AI 메모장 ✨
                        </span>
                    </Link>

                    {/* 메인 메뉴 */}
                    <div className="hidden md:flex items-center gap-2">
                        {navItems.map(item => {
                            const isActive = pathname === item.href
                            return (
                                <Link key={item.href} href={item.href}>
                                    <Button
                                        variant={isActive ? 'default' : 'ghost'}
                                        size="sm"
                                        className={cn(
                                            isActive &&
                                                'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600',
                                            !isActive &&
                                                item.highlight &&
                                                'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white',
                                            !isActive &&
                                                !item.highlight &&
                                                'hover:bg-purple-100 hover:text-purple-700'
                                        )}
                                    >
                                        <span className="text-lg mr-1">
                                            {item.emoji}
                                        </span>
                                        {item.label}
                                    </Button>
                                </Link>
                            )
                        })}

                        {/* AI 기능 드롭다운 */}
                        <div className="relative group">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-purple-100 hover:text-purple-700"
                            >
                                <span className="text-lg mr-1">✨</span>
                                AI 기능
                            </Button>
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border-2 border-purple-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                <div className="py-2">
                                    {aiItems.map(item => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-purple-50 transition-colors"
                                        >
                                            <span className="text-xl">
                                                {item.emoji}
                                            </span>
                                            <span className="font-medium">
                                                {item.label}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <LogoutDialog />
                    </div>

                    {/* 모바일 메뉴 */}
                    <div className="flex md:hidden items-center gap-2">
                        <Link href="/notes/new">
                            <Button size="sm">
                                <PlusCircle className="h-4 w-4" />
                            </Button>
                        </Link>
                        <LogoutDialog />
                    </div>
                </div>
            </div>

            {/* 모바일 하단 메뉴 */}
            <div className="md:hidden border-t border-gray-200 bg-white">
                <div className="flex items-center justify-around py-2">
                    {navItems.map(item => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex flex-col items-center gap-1 px-3 py-1 text-xs',
                                    isActive
                                        ? 'text-blue-600'
                                        : 'text-gray-600'
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        )
                    })}
                    {aiItems.slice(0, 2).map(item => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex flex-col items-center gap-1 px-3 py-1 text-xs',
                                    isActive
                                        ? 'text-blue-600'
                                        : 'text-gray-600'
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        )
                    })}
                </div>
            </div>
        </nav>
    )
}
