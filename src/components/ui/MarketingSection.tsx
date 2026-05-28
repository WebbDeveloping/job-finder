import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import type { ContainerProps } from "@mui/material/Container";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";
import { SectionShell } from "@/components/ui/SectionShell";
import { marketingTokens, surfaceTints } from "@/theme/tokens";

type MarketingTone = "light" | "dark" | "darkAccent" | "tint" | "hero";
type SectionPyKey = keyof typeof marketingTokens.sectionPy;

type MarketingSectionProps = {
  children: ReactNode;
  id?: string;
  headingId?: string;
  tone?: MarketingTone;
  py?: SectionPyKey;
  maxWidth?: ContainerProps["maxWidth"];
  background?: string;
  sx?: SxProps<Theme>;
  containerSx?: SxProps<Theme>;
};

const toneBackgrounds: Record<MarketingTone, string | undefined> = {
  light: undefined,
  hero: undefined,
  tint: undefined,
  dark: "background.dark",
  darkAccent: "primary.dark",
};

export function MarketingSection({
  children,
  id,
  headingId,
  tone = "light",
  py = tone === "hero" ? "hero" : "default",
  maxWidth = "lg",
  background,
  sx,
  containerSx,
}: MarketingSectionProps) {
  const ariaLabelledBy = headingId ? headingId : undefined;
  const sectionPy = marketingTokens.sectionPy[py];

  const toneSx: SxProps<Theme> = background
    ? { background }
    : tone === "hero"
      ? { background: surfaceTints.heroGradient }
      : tone === "tint"
        ? { bgcolor: surfaceTints.primarySubtle }
        : toneBackgrounds[tone]
          ? { bgcolor: toneBackgrounds[tone] }
          : {};

  return (
    <SectionShell id={id} aria-labelledby={ariaLabelledBy} sx={{ py: sectionPy, ...toneSx, ...sx }}>
      <Container maxWidth={maxWidth} sx={containerSx}>
        {children}
      </Container>
    </SectionShell>
  );
}

export function MarketingDarkText({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ color: "common.white", "& .MuiTypography-root": { color: "inherit" } }}>
      {children}
    </Box>
  );
}
