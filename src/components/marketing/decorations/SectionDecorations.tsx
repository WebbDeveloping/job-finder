import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";

type DecorationSx = SxProps<Theme>;

/** Absolute wrapper for section-level accents (parent needs position: relative, overflow: hidden). */
function DecorationLayer({
  children,
  sx,
  breathe,
  breatheKeyframes,
}: {
  children?: ReactNode;
  sx?: DecorationSx;
  breathe?: boolean;
  breatheKeyframes?: string;
}) {
  return (
    <Box
      aria-hidden
      sx={{
        pointerEvents: "none",
        ...(breathe && breatheKeyframes
          ? {
              "@media (prefers-reduced-motion: no-preference)": {
                animation: `${breatheKeyframes} 6s ease-in-out infinite`,
              },
            }
          : {}),
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

/** Flowing curves with nodes — inspired by SaaS dark-band accents; paths are hand-authored in-repo. */
export function SectionFlowLines({
  sx,
  color = "primary.light",
  opacity = 0.35,
}: {
  sx?: DecorationSx;
  color?: string;
  opacity?: number;
}) {
  return (
    <DecorationLayer
      breathe
      breatheKeyframes="section-flow-lines-breath"
      sx={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        "@media (prefers-reduced-motion: no-preference)": {
          "@keyframes section-flow-lines-breath": {
            "0%, 100%": { opacity: opacity * 0.8, transform: "scale(1)" },
            "50%": { opacity: Math.min(opacity * 1.2, 0.5), transform: "scale(1.02)" },
          },
        },
        ...sx,
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 630 544"
        sx={{ width: "min(92%, 630px)", height: "auto", color }}
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          d="M40 420 C 120 280, 200 180, 320 140 S 520 100, 590 60"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.7"
          d="M20 460 C 140 340, 260 240, 400 200 S 560 160, 610 120"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.5"
          d="M80 500 C 180 380, 300 300, 440 260 S 580 220, 620 180"
        />
        <circle cx="320" cy="140" r="6" fill="currentColor" opacity="0.6" />
        <circle cx="400" cy="200" r="4" fill="currentColor" opacity="0.45" />
        <circle cx="520" cy="100" r="5" fill="currentColor" opacity="0.5" />
      </Box>
    </DecorationLayer>
  );
}

/** Compact flow lines for dark section corners (e.g. job search hub). */
export function SectionFlowLinesCorner({
  sx,
  color = "primary.light",
  opacity = 0.22,
}: {
  sx?: DecorationSx;
  color?: string;
  opacity?: number;
}) {
  return (
    <DecorationLayer
      sx={{
        position: "absolute",
        left: { xs: -80, md: -40 },
        bottom: { xs: -20, md: 0 },
        width: { xs: 280, md: 360 },
        opacity,
        ...sx,
      }}
    >
      <Box component="svg" viewBox="0 0 400 320" sx={{ width: "100%", height: "auto", color }}>
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          d="M0 280 C 80 200, 160 120, 280 80 S 380 40, 400 20"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.6"
          d="M20 300 C 100 220, 200 160, 320 120"
        />
        <circle cx="280" cy="80" r="5" fill="currentColor" opacity="0.55" />
        <circle cx="360" cy="48" r="3.5" fill="currentColor" opacity="0.4" />
      </Box>
    </DecorationLayer>
  );
}

/** Dot grid behind feature visuals. */
export function SectionDotGrid({
  sx,
  color = "primary.main",
  opacity = 0.08,
  breathe,
}: {
  sx?: DecorationSx;
  color?: string;
  opacity?: number;
  breathe?: boolean;
}) {
  return (
    <DecorationLayer
      breathe={breathe}
      breatheKeyframes={breathe ? "section-dot-grid-breath" : undefined}
      sx={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        color,
        opacity,
        ...(breathe
          ? {
              "@media (prefers-reduced-motion: no-preference)": {
                "@keyframes section-dot-grid-breath": {
                  "0%, 100%": { opacity: opacity * 0.75, transform: "scale(1)" },
                  "50%": { opacity: Math.min(opacity * 1.5, 0.14), transform: "scale(1.03)" },
                },
              },
            }
          : {}),
        ...sx,
      }}
    >
      <Box component="svg" viewBox="0 0 648 388" sx={{ width: "100%", height: "100%" }}>
        {Array.from({ length: 12 }, (_, row) =>
          Array.from({ length: 18 }, (_, col) => (
            <circle
              key={`${row}-${col}`}
              cx={24 + col * 34}
              cy={24 + row * 30}
              r="2.5"
              fill="currentColor"
            />
          )),
        )}
      </Box>
    </DecorationLayer>
  );
}

/** Sparse corner dots for plain icon/text bands. */
export function SectionCornerDots({
  corner = "top-right",
  sx,
  color = "primary.main",
  opacity = 0.1,
}: {
  corner?: "top-right" | "top-left" | "bottom-right";
  sx?: DecorationSx;
  color?: string;
  opacity?: number;
}) {
  const position =
    corner === "top-right"
      ? { right: { xs: -8, md: 24 }, top: { xs: 0, md: 8 } }
      : corner === "top-left"
        ? { left: { xs: -8, md: 24 }, top: { xs: 0, md: 8 } }
        : { right: { xs: -8, md: 24 }, bottom: { xs: 0, md: 8 } };

  return (
    <DecorationLayer
      sx={{
        position: "absolute",
        width: { xs: 100, md: 140 },
        height: "auto",
        color,
        opacity,
        ...position,
        ...sx,
      }}
    >
      <Box component="svg" viewBox="0 0 140 140" sx={{ width: "100%", height: "auto" }}>
        <circle cx="20" cy="24" r="3" fill="currentColor" />
        <circle cx="52" cy="12" r="2" fill="currentColor" opacity="0.7" />
        <circle cx="88" cy="28" r="3.5" fill="currentColor" opacity="0.85" />
        <circle cx="118" cy="56" r="2.5" fill="currentColor" opacity="0.6" />
        <circle cx="72" cy="48" r="2" fill="currentColor" opacity="0.5" />
        <circle cx="108" cy="92" r="3" fill="currentColor" opacity="0.75" />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.35"
          d="M20 24 L52 12 L88 28 L118 56"
        />
      </Box>
    </DecorationLayer>
  );
}

/** Vertical constellation accent for centered sections. */
export function SectionConstellationLeft({ sx }: { sx?: DecorationSx }) {
  return (
    <DecorationLayer
      sx={{
        display: { xs: "none", sm: "block" },
        position: "absolute",
        left: { sm: -24, md: -40 },
        top: 40,
        width: 80,
        height: "auto",
        color: "primary.main",
        opacity: 0.2,
        ...sx,
      }}
    >
      <Box component="svg" viewBox="0 0 100 368" sx={{ width: "100%", height: "auto" }}>
        {[
          [20, 40],
          [50, 120],
          [30, 200],
          [70, 280],
          [40, 340],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={i % 2 === 0 ? 4 : 2.5} fill="currentColor" />
        ))}
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.5"
          d="M20 40 L50 120 L30 200 L70 280"
        />
      </Box>
    </DecorationLayer>
  );
}

export function SectionConstellationRight({ sx }: { sx?: DecorationSx }) {
  return (
    <DecorationLayer
      sx={{
        display: { xs: "none", sm: "block" },
        position: "absolute",
        right: { sm: -60, md: -80 },
        top: 80,
        width: 180,
        height: "auto",
        color: "secondary.main",
        opacity: 0.15,
        ...sx,
      }}
    >
      <Box component="svg" viewBox="0 0 293 311" sx={{ width: "100%", height: "auto" }}>
        {[
          [40, 50],
          [120, 90],
          [200, 60],
          [250, 150],
          [180, 240],
          [80, 260],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={3} fill="currentColor" />
        ))}
      </Box>
    </DecorationLayer>
  );
}

/** Center radial glow behind focused content. */
export function SectionCenterGlow({ sx }: { sx?: DecorationSx }) {
  return (
    <DecorationLayer
      sx={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -45%)",
        width: { xs: "100%", md: 496 },
        height: { xs: 320, md: 450 },
        background:
          "radial-gradient(ellipse at center, color-mix(in srgb, var(--mui-palette-primary-main) 18%, transparent) 0%, transparent 72%)",
        zIndex: 0,
        ...sx,
      }}
    />
  );
}

/** Bottom arc on dark sections (mobile-friendly). */
export function SectionMobileArc({ sx }: { sx?: DecorationSx }) {
  return (
    <DecorationLayer
      sx={{
        display: { xs: "block", md: "none" },
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 120,
        overflow: "hidden",
        ...sx,
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 400 120"
        preserveAspectRatio="none"
        sx={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: "100%",
          color: "primary.dark",
        }}
      >
        <ellipse cx="200" cy="140" rx="280" ry="100" fill="currentColor" opacity="0.4" />
      </Box>
    </DecorationLayer>
  );
}

/** Hand-drawn arrow accent (resume examples picker). */
export function SectionDecorativeArrow({ sx }: { sx?: DecorationSx }) {
  return (
    <DecorationLayer
      sx={{
        display: { xs: "none", xl: "block" },
        position: "absolute",
        right: -24,
        bottom: 8,
        width: 140,
        height: "auto",
        color: "primary.main",
        opacity: 0.35,
        ...sx,
      }}
    >
      <Box component="svg" viewBox="0 0 165 126" sx={{ width: "100%", height: "auto" }}>
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          d="M8 100 C 50 40, 90 20, 150 16 M130 8 L 152 18 L 138 38"
        />
      </Box>
    </DecorationLayer>
  );
}
