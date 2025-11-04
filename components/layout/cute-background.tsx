// components/layout/cute-background.tsx
// 귀여운 배경 데코레이션
// 웃는 여자아이와 귀여운 이모지들
// 관련 파일: app/notes/page.tsx

export function CuteBackground() {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {/* 큰 웃는 얼굴들 */}
            <div className="absolute top-20 left-10 text-9xl opacity-10 animate-bounce">
                🥰
            </div>
            <div className="absolute top-40 right-20 text-8xl opacity-10 animate-pulse">
                😊
            </div>
            <div className="absolute bottom-40 left-1/4 text-7xl opacity-10">
                🌸
            </div>
            <div className="absolute bottom-20 right-1/3 text-8xl opacity-10 animate-bounce">
                💕
            </div>
            <div className="absolute top-1/3 right-10 text-6xl opacity-10">
                ✨
            </div>
            <div className="absolute bottom-1/3 left-20 text-7xl opacity-10 animate-pulse">
                🌈
            </div>
            
            {/* 작은 데코레이션들 */}
            <div className="absolute top-60 left-1/3 text-4xl opacity-20">⭐</div>
            <div className="absolute top-80 right-1/4 text-3xl opacity-20">💝</div>
            <div className="absolute bottom-60 left-1/2 text-4xl opacity-20">🎀</div>
            <div className="absolute top-1/2 left-10 text-3xl opacity-20">🦋</div>
            <div className="absolute bottom-1/4 right-20 text-4xl opacity-20">🌺</div>
        </div>
    )
}
