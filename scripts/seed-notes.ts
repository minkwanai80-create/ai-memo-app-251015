// scripts/seed-notes.ts
// 노트 목업 데이터 생성 스크립트
// 테스트용 샘플 노트를 DB에 추가
// 사용법: npx tsx scripts/seed-notes.ts

import { config } from 'dotenv'
import { resolve } from 'path'
import { db } from '../lib/db/connection'
import { notes } from '../lib/db/schema/notes'

// .env.local 파일 로드
config({ path: resolve(process.cwd(), '.env.local') })

// 목업 노트 데이터
const mockNotes = [
    {
        title: '회의록 - 프로젝트 킥오프',
        content: `오늘 오전 10시에 새로운 AI 메모장 프로젝트 킥오프 미팅을 진행했습니다.

주요 안건:
- 프로젝트 목표 및 범위 설정
- 기술 스택 결정 (Next.js, Supabase, Gemini API)
- 팀 역할 분담
- 1차 스프린트 계획 수립

결정 사항:
1. MVP 기능은 노트 CRUD와 AI 요약/태그 생성으로 결정
2. 디자인은 미니멀하고 직관적으로
3. 2주 내 베타 버전 출시 목표

다음 미팅: 10월 20일 오후 2시`
    },
    {
        title: 'React 성능 최적화 팁',
        content: `React 애플리케이션의 성능을 향상시키는 방법들을 정리합니다.

1. useMemo와 useCallback 활용
- 복잡한 연산 결과 캐싱
- 불필요한 리렌더링 방지

2. React.memo로 컴포넌트 메모이제이션
- props가 변경되지 않으면 리렌더링 스킵

3. Code Splitting
- 동적 import()로 번들 크기 줄이기
- React.lazy와 Suspense 활용

4. Virtual Scrolling
- 긴 리스트는 react-window 사용

5. 이미지 최적화
- Next.js Image 컴포넌트 활용
- WebP 포맷 사용`
    },
    {
        title: '오늘의 일기',
        content: `날씨가 정말 좋은 하루였다. 아침에 일찍 일어나서 산책을 다녀왔는데, 
상쾌한 공기가 기분을 좋게 만들어주었다. 

점심에는 새로 오픈한 이탈리안 레스토랑에 가봤는데, 
파스타가 정말 맛있었다. 특히 까르보나라가 일품이었다.

오후에는 책을 읽으며 여유로운 시간을 보냈다. 
요즘 읽고 있는 SF 소설이 너무 재미있어서 시간 가는 줄 모르겠다.

내일은 친구들과 영화를 보러 가기로 했다. 기대된다!`
    },
    {
        title: 'TypeScript 타입 가드 패턴',
        content: `TypeScript에서 타입을 안전하게 좁히는 방법들을 정리합니다.

typeof 가드:
- 원시 타입 체크
- string, number, boolean 등

instanceof 가드:
- 클래스 인스턴스 체크
- Error, Date, Array 등

in 연산자:
- 객체의 속성 존재 여부 체크

사용자 정의 타입 가드:
- is 키워드 사용
- 복잡한 타입 체크 로직 캡슐화

discriminated union:
- type 필드로 타입 구분
- Redux action 패턴에 유용`
    },
    {
        title: '독서 노트: 클린 코드',
        content: `로버트 마틴의 "클린 코드"를 읽고 중요한 내용을 정리합니다.

의미있는 이름:
- 의도를 분명히 밝히는 이름
- 그릇된 정보를 피하라
- 의미있게 구분하라

함수:
- 작게 만들어라
- 한 가지만 해라
- 서술적인 이름을 사용하라

주석:
- 주석은 나쁜 코드를 보완하지 못한다
- 코드로 의도를 표현하라
- 좋은 주석: 법적 주석, 정보 제공, 의도 설명

형식 맞추기:
- 신문 기사처럼 작성하라
- 개념은 빈 행으로 분리하라`
    },
    {
        title: '장보기 목록',
        content: `이번 주말 장보기 리스트:

채소:
- 양파 2개
- 당근 3개
- 브로콜리 1개
- 상추 1봉지

과일:
- 사과 6개
- 바나나 1송이
- 오렌지 4개

기타:
- 우유 2개
- 계란 1판
- 식빵 1개
- 요거트 4개`
    },
    {
        title: 'Next.js App Router 마이그레이션',
        content: `Pages Router에서 App Router로 마이그레이션 시 주의사항을 정리합니다.

주요 변경점:
1. 파일 기반 라우팅이 폴더 기반으로
2. getServerSideProps → async 컴포넌트
3. getStaticProps → 기본적으로 SSG
4. API Routes → Route Handlers

데이터 페칭:
- Server Components에서 직접 fetch
- use client 없이는 모두 서버 컴포넌트
- Suspense와 streaming 지원

메타데이터:
- metadata export로 SEO 설정
- generateMetadata로 동적 메타데이터

주의사항:
- 'use client' 최소화
- Server와 Client 컴포넌트 분리
- 환경변수 접두사 주의 (NEXT_PUBLIC_)`
    },
    {
        title: '운동 루틴',
        content: `주 3회 운동 계획:

월요일 - 상체:
- 벤치프레스 3세트
- 덤벨 플라이 3세트
- 숄더프레스 3세트
- 삼두 익스텐션 3세트

수요일 - 하체:
- 스쿼트 4세트
- 레그프레스 3세트
- 런지 3세트
- 레그컬 3세트

금요일 - 전신:
- 풀업 3세트
- 데드리프트 3세트
- 플랭크 1분 3세트
- 유산소 20분

각 세트는 8-12회 반복, 세트 간 휴식 1분`
    },
    {
        title: 'Supabase RLS 정책 가이드',
        content: `Supabase Row Level Security 설정 방법 정리:

RLS 활성화:
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

기본 정책 패턴:

SELECT (읽기):
CREATE POLICY "Users can view own data"
ON table_name FOR SELECT
USING (auth.uid() = user_id);

INSERT (생성):
CREATE POLICY "Users can create own data"
ON table_name FOR INSERT
WITH CHECK (auth.uid() = user_id);

UPDATE (수정):
CREATE POLICY "Users can update own data"
ON table_name FOR UPDATE
USING (auth.uid() = user_id);

DELETE (삭제):
CREATE POLICY "Users can delete own data"
ON table_name FOR DELETE
USING (auth.uid() = user_id);

주의사항:
- 정책 이름은 명확하게
- USING과 WITH CHECK 구분
- 성능 고려한 인덱스 생성`
    },
    {
        title: '프로젝트 아이디어 브레인스토밍',
        content: `새로운 프로젝트 아이디어들:

1. AI 기반 학습 도우미
- 개인 맞춤형 학습 계획
- 진도 추적 및 분석
- 퀴즈 자동 생성

2. 습관 트래커 앱
- 일일 습관 체크
- 통계 및 분석
- 동기부여 알림

3. 레시피 공유 플랫폼
- 요리 레시피 업로드
- 재료별 검색
- 난이도 필터링

4. 독서 기록 앱
- 읽은 책 관리
- 독서 노트 작성
- 독서 목표 설정

5. 개인 재무 관리
- 수입/지출 기록
- 예산 관리
- 저축 목표 추적`
    }
]

async function seedNotes() {
    console.log('🌱 노트 목업 데이터 생성 시작...\n')

    try {
        // 사용자 ID 입력 받기
        const userId = process.argv[2]

        if (!userId) {
            console.error('❌ 사용자 ID를 인자로 제공해주세요.')
            console.log('\n사용법:')
            console.log('  npx tsx scripts/seed-notes.ts <user-id>')
            console.log('\n사용자 ID 확인 방법:')
            console.log('  1. 로그인 후 브라우저 개발자도구(F12) 열기')
            console.log('  2. Application 탭 → Cookies → supabase-auth-token')
            console.log('  3. 또는 Supabase Dashboard → Authentication → Users')
            process.exit(1)
        }

        console.log(`사용자 ID: ${userId}\n`)

        // 노트 삽입
        let successCount = 0
        let errorCount = 0

        for (const note of mockNotes) {
            try {
                await db.insert(notes).values({
                    userId,
                    title: note.title,
                    content: note.content,
                    createdAt: new Date(),
                    updatedAt: new Date()
                })

                console.log(`✅ "${note.title}" 생성 완료`)
                successCount++
            } catch (error) {
                console.error(`❌ "${note.title}" 생성 실패:`, error)
                errorCount++
            }
        }

        console.log(`\n📊 결과:`)
        console.log(`   성공: ${successCount}개`)
        console.log(`   실패: ${errorCount}개`)
        console.log(`\n✨ 목업 데이터 생성 완료!`)
        console.log(`\n🌐 http://localhost:3000/notes 에서 확인하세요.`)
    } catch (error) {
        console.error('\n❌ 스크립트 실행 실패:', error)
        process.exit(1)
    }

    process.exit(0)
}

seedNotes()

