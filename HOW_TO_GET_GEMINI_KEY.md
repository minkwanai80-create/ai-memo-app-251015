# Gemini API 키 발급 가이드

## 1. Google AI Studio 접속
https://aistudio.google.com/apikey

## 2. 새 API 키 생성
1. "Create API Key" 버튼 클릭
2. 프로젝트 선택:
   - 기존 Google Cloud 프로젝트 선택
   - 또는 "Create API key in new project" 선택 (권장)

## 3. API 키 복사
- 생성된 API 키를 복사합니다
- 형식: AIzaSy... (약 39자)

## 4. 주의사항
- API 키는 한 번만 표시되므로 안전하게 저장하세요
- 키를 공개 저장소에 커밋하지 마세요
- .env.local 파일은 .gitignore에 포함되어 있어야 합니다

## 5. API 키 제한 설정 (선택사항)
1. Google Cloud Console 접속
2. "APIs & Services" > "Credentials" 
3. 생성한 API 키 클릭
4. "API restrictions" 설정
   - "Restrict key" 선택
   - "Generative Language API" 선택

## 6. 할당량 확인
- 무료 티어: 분당 15 요청
- 일일 1,500 요청
- 자세한 내용: https://ai.google.dev/pricing



