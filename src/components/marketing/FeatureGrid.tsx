"use client";

import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { IconBadge } from "@/components/ui/IconBadge";

const features = [
  {
    title: "Application pipeline",
    description:
      "Track every role from wishlist to offer. Log stage changes and see where each application stands.",
    icon: <TimelineOutlinedIcon />,
  },
  {
    title: "Sankey analytics",
    description:
      "Visualize how applications flow through your funnel. Spot bottlenecks and improve your process.",
    icon: <AnalyticsOutlinedIcon />,
  },
  {
    title: "Resume builder & PDF",
    description:
      "Keep one resume profile in sync with your search. Download a polished PDF when you need it.",
    icon: <DescriptionOutlinedIcon />,
  },
] as const;

export function FeatureGrid() {
  return (
    <Grid container spacing={3} sx={{ mt: 1 }}>
      {features.map(({ title, description, icon }) => (
        <Grid key={title} size={{ xs: 12, md: 4 }}>
          <Paper variant="outlined" sx={{ p: 3, height: "100%" }}>
            <Stack spacing={2}>
              <IconBadge icon={icon} />
              <Typography variant="h6" component="h3">
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
