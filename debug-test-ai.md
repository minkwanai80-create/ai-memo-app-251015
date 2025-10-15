# /test-ai 페이지 디버깅 가이드

## 현재 상태
- ✅ 서버 실행 중 (포트 3000)
- ✅ 파일 존재 확인
- ✅ 경로: `app/test-ai/page.tsx`

## 접속 방법

### 올바른 URL
```
http://localhost:3000/test-ai
```

### 잘못된 URL (접속 안됨)
```
❌ http://localhost:3000/test-ai/
❌ http://localhost:3000/testai
❌ http://localhost:3000/test_ai
```

## 문제 해결

### 1. 브라우저 캐시 클리어
- Chrome/Edge: Ctrl + Shift + R
- Firefox: Ctrl + Shift + Delete

### 2. 개발자 도구 확인 (F12)
- Console 탭: JavaScript 에러 확인
- Network 탭: 요청 상태 확인

### 3. 서버 로그 확인
터미널에서 에러 메시지 찾기:
- "Error" 키워드 검색
- "Failed to compile" 메시지 확인

### 4. 다른 페이지 테스트
정상 작동하는 페이지:
- http://localhost:3000 (메인)
- http://localhost:3000/signin (로그인)

## 예상 원인

### A. 빌드 에러
- 터미널에 "Failed to compile" 메시지
- 해결: 파일 저장 후 자동 재컴파일

### B. 환경변수 문제
- GEMINI_API_KEY 누락
- 해결: .env.local 파일 확인

### C. 브라우저 문제
- 캐시 문제
- 해결: 시크릿 모드로 접속

## 정상 동작 시 화면

페이지 제목: "🤖 Gemini API 테스트"

섹션:
1. API 헬스체크
   - "헬스체크 실행" 버튼
2. 텍스트 생성 테스트
   - 프롬프트 입력란
   - "텍스트 생성" 버튼
3. 환경 설정
   - 모델, 토큰, API 키 정보

## 추가 도움

문제가 계속되면 다음 정보를 알려주세요:
1. 브라우저 종류 (Chrome, Firefox 등)
2. 에러 메시지 (있다면)
3. 터미널 로그의 마지막 10줄


