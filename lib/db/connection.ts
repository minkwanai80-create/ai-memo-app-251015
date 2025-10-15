import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema/notes'

// Database connection
const connectionString = process.env.DATABASE_URL!

// Supabase 데이터베이스 연결 설정
// Direct Connection은 prepare=true 사용 가능 (성능 향상)
const client = postgres(connectionString, {
    // Direct Connection에서는 prepare 활성화 가능
    prepare: !connectionString.includes('pooler'),
    
    // 연결 풀 설정
    max: 10, // 최대 연결 수
    idle_timeout: 20, // 유휴 연결 타임아웃 (초)
    connect_timeout: 30, // 연결 타임아웃 (초)
    max_lifetime: 60 * 30, // 연결 최대 수명 (30분)
    
    // 애플리케이션 식별
    connection: {
        application_name: 'ai-memo-app'
    },
    
    // SSL 설정 (Supabase는 SSL 필수)
    ssl: 'require',
    
    // 디버깅
    onnotice: () => {}, // PostgreSQL notice 무시
    debug: false
})

export const db = drizzle(client, { schema })

export type Database = typeof db
