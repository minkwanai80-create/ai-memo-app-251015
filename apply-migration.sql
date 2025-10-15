-- apply-migration.sql
-- notes 테이블에 summary와 tags 컬럼 추가

ALTER TABLE "notes" ADD COLUMN IF NOT EXISTS "summary" text;
ALTER TABLE "notes" ADD COLUMN IF NOT EXISTS "tags" text;

-- 확인 쿼리
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'notes' 
ORDER BY ordinal_position;

