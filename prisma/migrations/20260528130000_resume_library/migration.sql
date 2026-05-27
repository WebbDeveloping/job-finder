-- CreateEnum
CREATE TYPE "ResumeKind" AS ENUM ('BUILT', 'UPLOADED');

-- CreateTable
CREATE TABLE "Resume" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" "ResumeKind" NOT NULL,
    "label" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "fullName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "location" TEXT,
    "website" TEXT,
    "linkedIn" TEXT,
    "github" TEXT,
    "summary" TEXT,
    "skills" TEXT,
    "experience" JSONB,
    "education" JSONB,
    "fileName" TEXT,
    "mimeType" TEXT,
    "fileSize" INTEGER,
    "storageKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

-- Migrate existing ResumeProfile rows
INSERT INTO "Resume" (
    "id",
    "userId",
    "kind",
    "label",
    "isDefault",
    "fullName",
    "email",
    "phone",
    "location",
    "website",
    "linkedIn",
    "github",
    "summary",
    "skills",
    "experience",
    "education",
    "createdAt",
    "updatedAt"
)
SELECT
    "id",
    "userId",
    'BUILT'::"ResumeKind",
    'Default',
    true,
    "fullName",
    "email",
    "phone",
    "location",
    "website",
    "linkedIn",
    "github",
    "summary",
    "skills",
    "experience",
    "education",
    "createdAt",
    "updatedAt"
FROM "ResumeProfile";

-- DropTable
DROP TABLE "ResumeProfile";

-- CreateIndex
CREATE UNIQUE INDEX "Resume_storageKey_key" ON "Resume"("storageKey");

-- CreateIndex
CREATE INDEX "Resume_userId_idx" ON "Resume"("userId");

-- CreateIndex
CREATE INDEX "Resume_userId_isDefault_idx" ON "Resume"("userId", "isDefault");

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
