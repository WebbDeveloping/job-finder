"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  RESUME_TEMPLATE_EXAMPLES,
  nextExampleIndex,
  type ResumeTemplateExample,
} from "@/lib/marketing/resume-template-examples";

const FOLD_DURATION_S = 7;
const CARD_MAX_WIDTH = 420;

function ResumeThumbnail({
  example,
  priority,
  sx,
}: {
  example: ResumeTemplateExample;
  priority?: boolean;
  sx?: object;
}) {
  return (
    <Paper
      elevation={6}
      sx={{
        position: "absolute",
        overflow: "hidden",
        borderRadius: 1,
        bgcolor: "grey.100",
        ...sx,
      }}
    >
      <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
        <Image
          src={example.src}
          alt={example.alt}
          fill
          priority={priority}
          loading={priority ? undefined : "eager"}
          sizes={`(max-width: 900px) 85vw, ${CARD_MAX_WIDTH}px`}
          style={{ objectFit: "cover", objectPosition: "top" }}
        />
      </Box>
    </Paper>
  );
}

function FoldFace({
  primary,
  secondary,
  priority,
}: {
  primary: ResumeTemplateExample;
  secondary: ResumeTemplateExample;
  priority?: boolean;
}) {
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        backfaceVisibility: "hidden",
      }}
    >
      <ResumeThumbnail
        example={primary}
        priority={priority}
        sx={{
          width: "72%",
          aspectRatio: "8.5 / 11",
          top: "4%",
          left: "0%",
          zIndex: 2,
        }}
      />
      <ResumeThumbnail
        example={secondary}
        sx={{
          width: "58%",
          aspectRatio: "8.5 / 11",
          top: "12%",
          right: "-2%",
          zIndex: 1,
          transform: "rotate(4deg)",
        }}
      />
    </Box>
  );
}

function FoldCard({ frontIndex }: { frontIndex: number }) {
  const examples = RESUME_TEMPLATE_EXAMPLES;
  const primary = examples[frontIndex]!;
  const secondary = examples[nextExampleIndex(frontIndex)]!;
  const backPrimary = examples[nextExampleIndex(frontIndex, 2)]!;
  const backSecondary = examples[nextExampleIndex(frontIndex, 3)]!;

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        transformStyle: "preserve-3d",
        animation: `hero-resume-fold ${FOLD_DURATION_S}s ease-in-out infinite`,
        "@keyframes hero-resume-fold": {
          "0%": { transform: "rotateY(0deg) scale(1)" },
          "38%": { transform: "rotateY(8deg) scale(1)" },
          "48%": { transform: "rotateY(172deg) scale(1.02)" },
          "88%": { transform: "rotateY(184deg) scale(1.02)" },
          "100%": { transform: "rotateY(360deg) scale(1)" },
        },
      }}
    >
      <FoldFace primary={primary} secondary={secondary} priority={frontIndex === 0} />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          transform: "rotateY(180deg)",
          backfaceVisibility: "hidden",
        }}
      >
        <ResumeThumbnail
          example={backPrimary}
          sx={{
            width: "68%",
            aspectRatio: "8.5 / 11",
            top: "8%",
            left: "8%",
            zIndex: 2,
            transform: "rotate(-3deg)",
          }}
        />
        <ResumeThumbnail
          example={backSecondary}
          sx={{
            width: "54%",
            aspectRatio: "8.5 / 11",
            top: "18%",
            right: "0%",
            zIndex: 1,
            transform: "rotate(6deg)",
          }}
        />
      </Box>
    </Box>
  );
}

function StaticResumeStack() {
  const examples = RESUME_TEMPLATE_EXAMPLES;
  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
      <ResumeThumbnail
        example={examples[0]!}
        priority
        sx={{
          width: "72%",
          aspectRatio: "8.5 / 11",
          top: "4%",
          left: "0%",
          zIndex: 2,
        }}
      />
      <ResumeThumbnail
        example={examples[1]!}
        sx={{
          width: "58%",
          aspectRatio: "8.5 / 11",
          top: "12%",
          right: "-2%",
          zIndex: 1,
          transform: "rotate(4deg)",
        }}
      />
    </Box>
  );
}

export function HeroResumeFold() {
  const [frontIndex, setFrontIndex] = useState(0);

  useEffect(() => {
    const cycleMs = FOLD_DURATION_S * 1000;
    const swapMs = cycleMs * 0.48;
    let swapTimer: ReturnType<typeof setTimeout>;

    const startCycle = () => {
      swapTimer = setTimeout(() => {
        setFrontIndex((index) => nextExampleIndex(index));
      }, swapMs);
    };

    startCycle();
    const interval = setInterval(startCycle, cycleMs);
    return () => {
      clearInterval(interval);
      clearTimeout(swapTimer);
    };
  }, []);

  return (
    <Box
      sx={{
        mx: "auto",
        width: "100%",
        maxWidth: CARD_MAX_WIDTH,
        aspectRatio: "4 / 5",
        perspective: { xs: 800, md: 1100 },
        "@media (prefers-reduced-motion: no-preference)": {
          animation: "hero-resume-zoom-in 0.8s ease-out",
          "@keyframes hero-resume-zoom-in": {
            from: {
              opacity: 0,
              transform: "scale(0.92)",
            },
            to: {
              opacity: 1,
              transform: "scale(1)",
            },
          },
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          "@media (prefers-reduced-motion: reduce)": {
            display: "none",
          },
        }}
      >
        <FoldCard frontIndex={frontIndex} />
      </Box>
      <Box
        sx={{
          display: "none",
          position: "relative",
          width: "100%",
          height: "100%",
          "@media (prefers-reduced-motion: reduce)": {
            display: "block",
          },
        }}
      >
        <StaticResumeStack />
      </Box>
    </Box>
  );
}
