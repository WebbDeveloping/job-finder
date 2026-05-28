-- AlterTable
ALTER TABLE "Resume" ADD COLUMN "templateId" TEXT NOT NULL DEFAULT 'classic';
ALTER TABLE "Resume" ADD COLUMN "theme" JSONB;
