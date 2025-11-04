## 개요🔎

Resolved #1

Epic 4의 Gemini API 통합 및 마크다운 지원 기능을 구현했습니다.

## 작업사항✍🏻

### Gemini API 통합
- @google/genai 패키지 설치 및 설정
- GeminiClient 클래스 구현
- ImagenClient 클래스 구현
- AI 요약 및 태그 생성 함수
- 에러 핸들링 및 재시도 로직

### 마크다운 지원
- react-markdown 통합
- 편집/미리보기 모드 토글
- 코드, 테이블, 인용구 스타일링

### 테스트 페이지
- /test-ai - Gemini API 테스트
- /generate-image - AI 이미지 생성
- /seed-data - 목업 데이터 생성

### UI 개선
- Badge 컴포넌트 추가
- 메인 페이지를 노트 목록으로 변경

### 버그 수정
- 이메일 인증 에러 처리 개선

## 주의사항❗️

### DB 마이그레이션 필요
Supabase SQL Editor에서 실행:
```sql
ALTER TABLE notes ADD COLUMN summary text;
ALTER TABLE notes ADD COLUMN tags text;
```

### 환경변수 추가
```
GEMINI_API_KEY=your_key_here
```

### 현재 비활성화된 기능
- AI 요약 생성 (마이그레이션 후 활성화)
- AI 태그 생성 (마이그레이션 후 활성화)
