"use client";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Image from "next/image";
import { MarketingSectionHeader } from "@/components/ui/MarketingSectionHeader";
import { MarketingSection } from "@/components/ui/MarketingSection";
import {
  RESUME_TEMPLATE_EXAMPLES,
  type ResumeTemplateExample,
} from "@/lib/marketing/resume-template-examples";

const CARD_WIDTH = 200;
const IMAGE_HEIGHT = 260;
const MARQUEE_DURATION_S = 48;

const marqueeItems = [
  ...RESUME_TEMPLATE_EXAMPLES,
  ...RESUME_TEMPLATE_EXAMPLES,
];

function TemplateMarqueeCard({
  example,
  decorative,
  fullWidth,
}: {
  example: ResumeTemplateExample;
  decorative?: boolean;
  fullWidth?: boolean;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        flexShrink: 0,
        width: fullWidth ? "100%" : CARD_WIDTH,
        maxWidth: fullWidth ? CARD_WIDTH : undefined,
        mx: fullWidth ? "auto" : undefined,
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          position: "relative",
          height: IMAGE_HEIGHT,
          bgcolor: "grey.100",
        }}
      >
        <Image
          src={example.src}
          alt={decorative ? "" : example.alt}
          fill
          sizes={`${CARD_WIDTH}px`}
          style={{ objectFit: "cover", objectPosition: "top" }}
        />
      </Box>
    </Paper>
  );
}

function StaticTemplateGrid() {
  return (
    <Grid container spacing={2} sx={{ justifyContent: "center" }}>
      {RESUME_TEMPLATE_EXAMPLES.map((example) => (
        <Grid key={example.id} size={{ xs: 6, sm: 4, md: 3 }}>
          <TemplateMarqueeCard example={example} fullWidth />
        </Grid>
      ))}
    </Grid>
  );
}

export function TemplateMarqueeSection() {
  return (
    <MarketingSection
      headingId="template-marquee-heading"
      py="compact"
      sx={{ overflow: "hidden", pb: { xs: 3, md: 4 } }}
      containerSx={{ mb: 4 }}
    >
      <Stack spacing={4}>
        <MarketingSectionHeader
          titleId="template-marquee-heading"
          title="Professional resume templates"
          lead="Pick a layout that fits your style, customize it, and export a polished PDF when you apply."
          align="center"
        />

        <Box
          sx={{
            display: "none",
            "@media (prefers-reduced-motion: reduce)": {
              display: "block",
            },
          }}
        >
          <StaticTemplateGrid />
        </Box>
      </Stack>

      <Box
        sx={{
          width: "100vw",
          position: "relative",
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw",
          "@media (prefers-reduced-motion: reduce)": {
            display: "none",
          },
          maskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        }}
      >
        <Box
          aria-hidden
          sx={{
            display: "flex",
            width: "max-content",
            gap: 3,
            px: 3,
            animation: `template-marquee ${MARQUEE_DURATION_S}s linear infinite`,
            "@keyframes template-marquee": {
              from: { transform: "translateX(0)" },
              to: { transform: "translateX(-50%)" },
            },
            "&:hover": {
              animationPlayState: "paused",
            },
          }}
        >
          {marqueeItems.map((example, index) => (
            <TemplateMarqueeCard
              key={`${example.id}-${index}`}
              example={example}
              decorative
            />
          ))}
        </Box>
      </Box>
    </MarketingSection>
  );
}
