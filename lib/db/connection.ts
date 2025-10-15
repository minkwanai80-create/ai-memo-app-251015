import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema/notes'

// Database connection
const connectionString = process.env.DATABASE_URL!

// Supabase Transaction Pooler 최적화 설정
const client = postgres(connectionString, {
    prepare: false, // Transaction Pooler에서 필수
    max: 1, // Serverless 환경에서 연결 수 제한
    idle_timeout: 20, // 유휴 연결 타임아웃 (초)
    connect_timeout: 10, // 연결 타임아웃 (초)
    max_lifetime: 60 * 30 // 연결 최대 수명 (30분)
})

export const db = drizzle(client, { schema })

export type Database = typeof db
