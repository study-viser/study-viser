-- CreateTable
CREATE TABLE "listings" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "credits" TEXT NOT NULL,
    "description" TEXT,
    "prerequisites" TEXT,
    "corequisites" TEXT,
    "genEd" TEXT,
    "gradeOption" TEXT,
    "repeatable" TEXT,
    "majorRestrictions" TEXT,
    "classStanding" TEXT,
    "crossListed" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "listings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "listings_code_key" ON "listings"("code");
