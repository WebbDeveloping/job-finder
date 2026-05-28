"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import type { SxProps, Theme } from "@mui/material/styles";
import Image from "next/image";
import type { ReactNode } from "react";
import { RESUME_TEMPLATE_EXAMPLES } from "@/lib/marketing/resume-template-examples";

type HubPanelFrameProps = {
  imageAlt: string;
  primaryIndex: number;
  overlaySrc: string;
  children?: ReactNode;
  primaryWidth?: { xs: string; sm: string };
  borderColor?: string;
  /** When false, only floating cards + overlay render (tracker, analytics). */
  showPrimary?: boolean;
};

export function HubPanelFrame({
  imageAlt,
  primaryIndex,
  overlaySrc,
  children,
  primaryWidth = { xs: "44%", sm: "42%" },
  borderColor = "primary.light",
  showPrimary = true,
}: HubPanelFrameProps) {
  const primary = RESUME_TEMPLATE_EXAMPLES[primaryIndex % RESUME_TEMPLATE_EXAMPLES.length]!;

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 520,
        aspectRatio: "648 / 494",
        borderRadius: 1,
        overflow: "hidden",
        bgcolor: "grey.900",
        background:
          "radial-gradient(ellipse 80% 70% at 50% 45%, color-mix(in srgb, var(--mui-palette-primary-main) 22%, transparent), transparent 70%)",
      }}
    >
      {children}

      {showPrimary ? (
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: primaryWidth,
            aspectRatio: "549 / 778",
            zIndex: 3,
          }}
        >
          <Paper
            elevation={8}
            sx={{
              position: "relative",
              width: "100%",
              overflow: "hidden",
              borderRadius: 1.5,
              border: 2,
              borderColor,
              bgcolor: "background.paper",
              lineHeight: 0,
            }}
          >
            <Image
              src={primary.src}
              alt={imageAlt}
              width={549}
              height={778}
              sizes="(max-width: 900px) 42vw, 240px"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                objectFit: "cover",
                objectPosition: "top",
              }}
            />
          </Paper>
        </Box>
      ) : null}

      <Box
        aria-hidden
        component="img"
        src={overlaySrc}
        alt=""
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 4,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          pointerEvents: "none",
        }}
      />
    </Box>
  );
}

export function HubBackResume({
  exampleIndex,
  sx,
}: {
  exampleIndex: number;
  sx?: SxProps<Theme>;
}) {
  const example = RESUME_TEMPLATE_EXAMPLES[exampleIndex % RESUME_TEMPLATE_EXAMPLES.length]!;

  return (
    <Paper
      elevation={3}
      sx={{
        position: "absolute",
        overflow: "hidden",
        borderRadius: 1.5,
        bgcolor: "grey.100",
        border: 1,
        borderColor: "divider",
        opacity: 0.5,
        zIndex: 1,
        aspectRatio: "549 / 778",
        ...sx,
      }}
    >
      <Image
        src={example.src}
        alt=""
        width={549}
        height={778}
        sizes="120px"
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          objectFit: "cover",
          objectPosition: "top",
        }}
      />
    </Paper>
  );
}

export function HubFloatingCard({
  children,
  sx,
}: {
  children: ReactNode;
  sx?: SxProps<Theme>;
}) {
  return (
    <Paper
      elevation={4}
      sx={{
        position: "absolute",
        zIndex: 2,
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        borderRadius: 1.5,
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
}
