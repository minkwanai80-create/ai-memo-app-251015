# 사용자 ID 확인 방법

노트 목업 데이터를 생성하려면 먼저 사용자 ID가 필요합니다.

## 방법 1: 브라우저에서 확인 (가장 쉬움)

### A. 개발자 도구 사용
1. 로그인한 상태로 http://localhost:3000 접속
2. `F12` 또는 `Ctrl+Shift+I`로 개발자 도구 열기
3. `Console` 탭 클릭
4. 다음 코드 입력 후 엔터:

```javascript
// Supabase 쿠키에서 사용자 정보 추출
document.cookie.split('; ')
  .find(row => row.startsWith('sb-'))
  ?.split('=')[1]
  ?.split('.')[1]
  |> (token => token ? JSON.parse(atob(token)) : null)
  |> (payload => payload?.sub || '사용자 ID를 찾을 수 없습니다')
```

또는 더 간단한 방법:

```javascript
// 간단한 방법
const cookies = document.cookie
console.log('쿠키:', cookies)
```

### B. Application 탭 사용
1. 개발자 도구(F12) 열기
2. `Application` 탭 클릭
3. 좌측 메뉴: Storage → Cookies → `http://localhost:3000`
4. `sb-darmcclkjplxwxmtectr-auth-token` 쿠키 찾기
5. Value 복사 → JWT 디코더로 확인

## 방법 2: Supabase Dashboard 사용

1. https://supabase.com/dashboard 접속
2. 프로젝트 선택
3. 좌측 메뉴: `Authentication` → `Users`
4. 가입한 이메일 찾기
5. UID 컬럼의 값 복사

예시: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`

## 방법 3: 간단한 API 엔드포인트 추가

임시로 사용자 ID를 확인하는 페이지를 만들 수 있습니다.

파일: `app/api/me/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    return NextResponse.json({ 
        id: user.id,
        email: user.email 
    })
}
```

그런 다음 브라우저에서:
```
http://localhost:3000/api/me
```

## 목업 데이터 생성 명령어

사용자 ID를 확인한 후:

```bash
npx tsx scripts/seed-notes.ts <확인한-사용자-ID>
```

예시:
```bash
npx tsx scripts/seed-notes.ts a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

## 빠른 방법: UI로 확인

아래 페이지를 만들면 더 쉽게 확인할 수 있습니다!

