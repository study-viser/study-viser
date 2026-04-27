/*
  Warnings:

  - A unique constraint covering the columns `[secret]` on the table `courses` will be added. If there are existing duplicate values, this will fail.
  - The required column `secret` was added to the `courses` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('Basic', 'Moderate', 'Advanced');

-- DropIndex
DROP INDEX "courses_code_key";

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "secret" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "terms" ADD COLUMN     "difficulty" "Difficulty" NOT NULL DEFAULT 'Basic',
ADD COLUMN     "imageRequired" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "courses_secret_key" ON "courses"("secret");
