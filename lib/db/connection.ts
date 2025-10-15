import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema/notes'

// Database connection
const connectionString = process.env.DATABASE_URL!

// Supabase 데이터베이스 연결 설정
const client = postgres(connectionString, {
    // Pooler 모드에서는 prepare를 비활성화해야 함
    prepare: false,
    
    // 연결 풀 설정
    max: 10, // 최대 연결 수
    idle_timeout: 20, // 유휴 연결 타임아웃 (초)
    connect_timeout: 30, // 연결 타임아웃 (초)
    max_lifetime: 60 * 30, // 연결 최대 수명 (30분)
    
    // 애플리케이션 식별
    connection: {
        application_name: 'ai-memo-app'
    },
    
    // 디버깅
    onnotice: () => {}, // PostgreSQL notice 무시
    debug: false
})

export const db = drizzle(client, { schema })

export type Database = typeof db
