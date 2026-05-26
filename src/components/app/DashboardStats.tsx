"use client";

import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { IconBadge } from "@/components/ui/IconBadge";

type DashboardStatsProps = {
  applicationCount: number;
  hasResume: boolean;
};

export function DashboardStats({ applicationCount, hasResume }: DashboardStatsProps) {
  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <IconBadge icon={<WorkOutlineOutlinedIcon />} size={44} />
            <Box>
              <Typography variant="overline" color="text.secondary">
                Applications
              </Typography>
              <Typography variant="h3" component="p">
                {applicationCount}
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <IconBadge icon={<DescriptionOutlinedIcon />} size={44} />
            <Box>
              <Typography variant="overline" color="text.secondary">
                Resume
              </Typography>
              <Typography variant="h6" component="p">
                {hasResume ? "Saved" : "Not started"}
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <IconBadge icon={<StarOutlineOutlinedIcon />} size={44} />
            <Box>
              <Typography variant="overline" color="text.secondary">
                Plan
              </Typography>
              <Typography variant="h6" component="p">
                Free
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}
