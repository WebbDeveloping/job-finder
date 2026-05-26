import type { Stage } from "@/generated/prisma/client";

export const PIPELINE_STAGES: Stage[] = [
  "Saved",
  "Applied",
  "Recruiter",
  "Technical",
  "Onsite",
  "Offer",
];

export const TERMINAL_STAGES: Stage[] = ["Rejected", "Withdrawn", "Accepted"];

export const ALL_STAGES: Stage[] = [...PIPELINE_STAGES, ...TERMINAL_STAGES];

export function isTerminalStage(stage: Stage): boolean {
  return TERMINAL_STAGES.includes(stage);
}

export function formatStage(stage: Stage | null): string {
  if (stage === null) return "—";
  return stage;
}
