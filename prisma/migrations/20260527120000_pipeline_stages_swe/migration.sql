-- Wipe test applications and replace Stage enum (Saved → Wishlist, add TakeHome).
DELETE FROM "StageEvent";
DELETE FROM "Application";

ALTER TABLE "StageEvent" ALTER COLUMN "fromStage" SET DATA TYPE TEXT;
ALTER TABLE "StageEvent" ALTER COLUMN "toStage" SET DATA TYPE TEXT;

DROP TYPE "Stage";

CREATE TYPE "Stage" AS ENUM (
  'Wishlist',
  'Applied',
  'Recruiter',
  'TakeHome',
  'Technical',
  'Onsite',
  'Offer',
  'Rejected',
  'Withdrawn',
  'Accepted'
);

ALTER TABLE "StageEvent"
  ALTER COLUMN "fromStage" TYPE "Stage" USING "fromStage"::"Stage",
  ALTER COLUMN "toStage" TYPE "Stage" USING "toStage"::"Stage";
