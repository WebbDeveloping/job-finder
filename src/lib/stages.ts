import type { Stage } from "@/generated/prisma/client";

/** Active funnel stages in typical order (SWE job search). */
export const PIPELINE_STAGES: Stage[] = [
  "Wishlist",
  "Applied",
  "Recruiter",
  "TakeHome",
  "Technical",
  "Onsite",
  "Offer",
];

export const TERMINAL_STAGES: Stage[] = ["Rejected", "Withdrawn", "Accepted"];

export const ALL_STAGES: Stage[] = [...PIPELINE_STAGES, ...TERMINAL_STAGES];

export const STAGE_LABELS: Record<Stage, string> = {
  Wishlist: "Wishlist",
  Applied: "Applied",
  Recruiter: "Recruiter screen",
  TakeHome: "Take-home",
  Technical: "Technical interview",
  Onsite: "Onsite / loop",
  Offer: "Offer",
  Rejected: "Rejected",
  Withdrawn: "Withdrawn",
  Accepted: "Accepted",
};

export function isTerminalStage(stage: Stage): boolean {
  return TERMINAL_STAGES.includes(stage);
}

export function formatStage(stage: Stage | null): string {
  if (stage === null) return "Created";
  return STAGE_LABELS[stage] ?? stage;
}
