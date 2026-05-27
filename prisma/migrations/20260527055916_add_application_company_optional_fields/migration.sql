/*
  Warnings:

  - The primary key for the `Session` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "companyWebsite" TEXT,
ADD COLUMN     "salaryRange" TEXT;

-- AlterTable
ALTER TABLE "Session" DROP CONSTRAINT "Session_pkey";
