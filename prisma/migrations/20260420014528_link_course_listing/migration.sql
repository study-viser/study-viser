/*
  Warnings:

  - You are about to drop the column `listingCode` on the `courses` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_listingCode_fkey";

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "listingCode",
ADD COLUMN     "listingId" TEXT;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listings"("code") ON DELETE SET NULL ON UPDATE CASCADE;
