-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_code_fkey" FOREIGN KEY ("code") REFERENCES "listings"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
