import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema/notes'

// Database connection
const connectionString = process.env.DATABASE_URL!

// Supabase 데이터베이스 연결 설정 (재시도 로직 포함)
const client = postgres(connectionString, {
    // 기본 설정
    max: 10, // 최대 연결 수
    idle_timeout: 20, // 유휴 타임아웃 (초)
    connect_timeout: 30, // 연결 타임아웃 (초) - 증가
    
    // 재시도 설정
    max_lifetime: 60 * 30, // 연결 최대 수명 (30분)
    connection: {
        application_name: 'ai-memo-app'
    },
    
    // 오류 처리
    onnotice: () => {}, // notice 무시
    debug: false,
    
    // Direct Connection의 경우 prepare 활성화 가능
    prepare: !connectionString.includes(':6543')
})

export const db = drizzle(client, { schema })

export type Database = typeof db
