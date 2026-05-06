/*
  Warnings:

  - A unique constraint covering the columns `[courseCRN,word]` on the table `terms` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "terms_courseCRN_word_key" ON "terms"("courseCRN", "word");
