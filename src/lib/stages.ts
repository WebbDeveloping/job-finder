import type { Stage } from "@/generated/prisma/client";

/** Active funnel stages in custom order for this app. */
export const PIPELINE_STAGES: Stage[] = [
  "JobsAppliedTo",
  "Replies",
  "InitialInterview",
  "Interview2",
  "Interview3",
  "TaskRequested",
  "FinalInterview",
  "OfferReceived",
];

export const TERMINAL_STAGES: Stage[] = [
  "Rejection",
  "NoReply",
  "RepliedTooLate",
  "NoTaskRequested",
  "RejectedByMe",
  "RejectedByCompany",
  "RejectedBeforeOffer",
  "Accepted",
  "Rejected",
];

export const ALL_STAGES: Stage[] = [...PIPELINE_STAGES, ...TERMINAL_STAGES];

export const STAGE_LABELS: Record<Stage, string> = {
  JobsAppliedTo: "Jobs applied to",
  Replies: "Replies",
  Rejection: "Rejection",
  NoReply: "No Reply",
  InitialInterview: "Initial Interview",
  Interview2: "Interview 2",
  Interview3: "Interview 3",
  RepliedTooLate: "Replied too late",
  TaskRequested: "Task Requested",
  NoTaskRequested: "No task requested",
  RejectedByMe: "Rejected by Me",
  RejectedByCompany: "Rejected by Company",
  FinalInterview: "Final Interview",
  OfferReceived: "Offer received",
  RejectedBeforeOffer: "Rejected before offer",
  Rejected: "Rejected",
  Accepted: "Accepted",
};

export function isTerminalStage(stage: Stage): boolean {
  return TERMINAL_STAGES.includes(stage);
}

export function formatStage(stage: Stage | null): string {
  if (stage === null) return "Created";
  return STAGE_LABELS[stage] ?? stage;
}
