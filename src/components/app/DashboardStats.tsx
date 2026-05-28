"use client";

import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import Grid from "@mui/material/Grid";
import { StatCard } from "@/components/ui/StatCard";
import { appTokens } from "@/theme/tokens";

type DashboardStatsProps = {
  applicationCount: number;
  hasResume: boolean;
};

export function DashboardStats({ applicationCount, hasResume }: DashboardStatsProps) {
  return (
    <Grid container spacing={2} sx={{ mb: appTokens.sectionGap }}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <StatCard
          icon={<WorkOutlineOutlinedIcon />}
          label="Applications"
          value={applicationCount}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <StatCard
          icon={<DescriptionOutlinedIcon />}
          label="Resume"
          value={hasResume ? "Saved" : "Not started"}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <StatCard
          icon={<StarOutlineOutlinedIcon />}
          label="Plan"
          value="Free"
        />
      </Grid>
    </Grid>
  );
}
