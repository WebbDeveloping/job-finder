-- AlterTable
ALTER TABLE "Application" ADD COLUMN "coverLetterId" TEXT;

-- CreateIndex
CREATE INDEX "Application_coverLetterId_idx" ON "Application"("coverLetterId");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_coverLetterId_fkey" FOREIGN KEY ("coverLetterId") REFERENCES "CoverLetter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
