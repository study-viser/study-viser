-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_code_fkey";

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "listingCode" TEXT;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_listingCode_fkey" FOREIGN KEY ("listingCode") REFERENCES "listings"("code") ON DELETE SET NULL ON UPDATE CASCADE;
