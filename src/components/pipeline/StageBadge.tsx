import type { Stage } from "@/generated/prisma/client";
import Chip from "@mui/material/Chip";
import type { ChipProps } from "@mui/material/Chip";
import { formatStage, isTerminalStage } from "@/lib/stages";

type StageBadgeProps = {
  stage: Stage;
};

function chipColor(stage: Stage): ChipProps["color"] {
  if (stage === "Accepted") return "success";
  if (stage === "Rejected" || stage === "Withdrawn") return "error";
  if (stage === "Offer") return "success";
  if (isTerminalStage(stage)) return "warning";
  return "default";
}

export function StageBadge({ stage }: StageBadgeProps) {
  return <Chip label={formatStage(stage)} size="small" color={chipColor(stage)} />;
}
