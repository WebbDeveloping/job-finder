"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { SectionDotGrid } from "@/components/marketing/decorations";
import { RESUME_TEMPLATE_EXAMPLES } from "@/lib/marketing/resume-template-examples";

const PRIMARY_INDEX = 3;
const BACK_VARIANTS = [0, 5, 7] as const;

type TemplatesFeatureVisualProps = {
  imageAlt: string;
};

function BackResumeCard({
  exampleIndex,
  sx,
}: {
  exampleIndex: number;
  sx?: object;
}) {
  const example = RESUME_TEMPLATE_EXAMPLES[exampleIndex % RESUME_TEMPLATE_EXAMPLES.length]!;

  return (
    <Paper
      elevation={2}
      sx={{
        position: "absolute",
        overflow: "hidden",
        borderRadius: 1.5,
        bgcolor: "grey.100",
        border: 1,
        borderColor: "divider",
        opacity: 0.55,
        ...sx,
      }}
    >
      <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
        <Image
          src={example.src}
          alt=""
          fill
          sizes="140px"
          style={{ objectFit: "cover", objectPosition: "top" }}
        />
      </Box>
    </Paper>
  );
}

export function TemplatesFeatureVisual({ imageAlt }: TemplatesFeatureVisualProps) {
  const primary = RESUME_TEMPLATE_EXAMPLES[PRIMARY_INDEX]!;

  return (
    <Box sx={{ position: "relative", width: "100%", maxWidth: 520, mx: "auto" }}>
      <SectionDotGrid breathe />

      <Paper
        elevation={3}
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 2,
          bgcolor: "grey.50",
          aspectRatio: "520 / 400",
          background:
            "linear-gradient(165deg, color-mix(in srgb, var(--mui-palette-primary-main) 10%, var(--mui-palette-grey-50)) 0%, var(--mui-palette-grey-50) 45%, color-mix(in srgb, var(--mui-palette-success-main) 8%, var(--mui-palette-grey-50)) 100%)",
        }}
      >
        <BackResumeCard
          exampleIndex={BACK_VARIANTS[0]}
          sx={{
            width: "34%",
            aspectRatio: "549 / 778",
            left: "4%",
            top: "14%",
            transform: "rotate(-8deg)",
            zIndex: 1,
          }}
        />
        <BackResumeCard
          exampleIndex={BACK_VARIANTS[1]}
          sx={{
            width: "30%",
            aspectRatio: "549 / 778",
            right: "6%",
            top: "10%",
            transform: "rotate(7deg)",
            zIndex: 1,
          }}
        />
        <BackResumeCard
          exampleIndex={BACK_VARIANTS[2]}
          sx={{
            width: "28%",
            aspectRatio: "549 / 778",
            left: "18%",
            bottom: "8%",
            transform: "rotate(-4deg)",
            zIndex: 1,
            display: { xs: "none", sm: "block" },
          }}
        />

        <Paper
          elevation={6}
          sx={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -52%)",
            width: { xs: "52%", sm: "48%" },
            aspectRatio: "549 / 778",
            overflow: "hidden",
            borderRadius: 1.5,
            zIndex: 2,
            border: 2,
            borderColor: "primary.main",
            bgcolor: "background.paper",
          }}
        >
          <Image
            src={primary.src}
            alt={imageAlt}
            fill
            sizes="(max-width: 900px) 40vw, 260px"
            style={{ objectFit: "cover", objectPosition: "top" }}
            priority
          />
        </Paper>

        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
            pointerEvents: "none",
          }}
        >
          <Image
            src="/illustrations/templates-overlay.svg"
            alt=""
            fill
            sizes="520px"
            style={{ objectFit: "contain" }}
          />
        </Box>

        <Box
          aria-hidden
          sx={{
            position: "absolute",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 4,
            display: "flex",
            gap: 0.75,
            alignItems: "center",
            px: 1.5,
            py: 0.75,
            borderRadius: 999,
            bgcolor: "background.paper",
            boxShadow: 2,
            border: 1,
            borderColor: "divider",
          }}
        >
          {RESUME_TEMPLATE_EXAMPLES.slice(0, 4).map((example, index) => (
            <Box
              key={example.id}
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: index === PRIMARY_INDEX % 4 ? "primary.main" : "grey.300",
              }}
            />
          ))}
          <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 600, color: "text.secondary" }}>
            8 templates
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
