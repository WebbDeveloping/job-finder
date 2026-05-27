-- Replace Stage enum values with custom pipeline stages.
-- Safe for development: clears stage history before enum swap.
DELETE FROM "StageEvent";

ALTER TYPE "Stage" RENAME TO "Stage_old";

CREATE TYPE "Stage" AS ENUM (
  'JobsAppliedTo',
  'Replies',
  'Rejection',
  'NoReply',
  'InitialInterview',
  'Interview2',
  'Interview3',
  'RepliedTooLate',
  'TaskRequested',
  'NoTaskRequested',
  'RejectedByMe',
  'RejectedByCompany',
  'FinalInterview',
  'OfferReceived',
  'RejectedBeforeOffer',
  'Accepted',
  'Rejected'
);

ALTER TABLE "StageEvent"
  ALTER COLUMN "fromStage" TYPE "Stage"
  USING ("fromStage"::text::"Stage");

ALTER TABLE "StageEvent"
  ALTER COLUMN "toStage" TYPE "Stage"
  USING ("toStage"::text::"Stage");

DROP TYPE "Stage_old";
