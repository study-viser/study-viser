/*
  Warnings:

  - You are about to drop the column `instructorId` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the `enrollments` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'ADMIN';

-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_instructorId_fkey";

-- DropForeignKey
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_courseId_fkey";

-- DropForeignKey
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_userId_fkey";

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "instructorId",
ADD COLUMN     "userId" TEXT;

-- DropTable
DROP TABLE "enrollments";

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
