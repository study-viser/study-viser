/*
  Warnings:

  - The primary key for the `_StudentCourses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `courses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `courseId` on the `terms` table. All the data in the column will be lost.
  - Changed the type of `A` on the `_StudentCourses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `crn` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `definition` to the `submissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseCRN` to the `terms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `word` to the `terms` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_StudentCourses" DROP CONSTRAINT "_StudentCourses_A_fkey";

-- DropForeignKey
ALTER TABLE "terms" DROP CONSTRAINT "terms_courseId_fkey";

-- AlterTable
ALTER TABLE "_StudentCourses" DROP CONSTRAINT "_StudentCourses_AB_pkey",
DROP COLUMN "A",
ADD COLUMN     "A" INTEGER NOT NULL,
ADD CONSTRAINT "_StudentCourses_AB_pkey" PRIMARY KEY ("A", "B");

-- AlterTable
ALTER TABLE "courses" DROP CONSTRAINT "courses_pkey",
DROP COLUMN "id",
ADD COLUMN     "crn" INTEGER NOT NULL,
ADD CONSTRAINT "courses_pkey" PRIMARY KEY ("crn");

-- AlterTable
ALTER TABLE "submissions" ADD COLUMN     "definition" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "terms" DROP COLUMN "courseId",
ADD COLUMN     "courseCRN" INTEGER NOT NULL,
ADD COLUMN     "word" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "terms" ADD CONSTRAINT "terms_courseCRN_fkey" FOREIGN KEY ("courseCRN") REFERENCES "courses"("crn") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentCourses" ADD CONSTRAINT "_StudentCourses_A_fkey" FOREIGN KEY ("A") REFERENCES "courses"("crn") ON DELETE CASCADE ON UPDATE CASCADE;
