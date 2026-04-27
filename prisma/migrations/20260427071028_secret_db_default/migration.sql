-- AlterTable
ALTER TABLE "courses" ALTER COLUMN "secret" SET DEFAULT gen_random_uuid()::text;
