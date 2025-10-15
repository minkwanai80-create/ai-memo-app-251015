// Jest 설정 파일
// 테스트 환경 초기화

// 환경변수 설정
process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'test-api-key'
process.env.GEMINI_MODEL = 'gemini-2.0-flash-001'
process.env.GEMINI_MAX_TOKENS = '8192'
process.env.GEMINI_TIMEOUT_MS = '10000'
process.env.NODE_ENV = 'test'



