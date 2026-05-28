"use client";

import { useCallback, useState } from "react";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Fade from "@mui/material/Fade";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { InvertedButton } from "@/components/ui/InvertedButton";
import { MarketingDarkText, MarketingSection } from "@/components/ui/MarketingSection";
import { StarRating } from "@/components/ui/StarRating";
import { TintSurface } from "@/components/ui/TintSurface";
import {
  AGGREGATE_RATING,
  REVIEW_COUNT,
} from "@/lib/marketing/social-proof";

type Quote = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  avatarSrc: string;
};

const quotes: Quote[] = [
  {
    id: "jordan",
    quote:
      "I've recommended Job Finder to everyone in my network. I still update my resume here even after landing a role—it keeps everything aligned with my application tracker.",
    name: "Jordan M.",
    role: "Software Engineer",
    company: "Series B startup",
    avatarSrc: "/testimonials/jordan.jpg",
  },
  {
    id: "priya",
    quote:
      "Tailoring my resume for each application used to take hours. Now I duplicate, tweak, and track—all without leaving one workspace.",
    name: "Priya K.",
    role: "Product Manager",
    company: "Enterprise SaaS",
    avatarSrc: "/testimonials/priya.jpg",
  },
  {
    id: "marcus",
    quote:
      "The pipeline view finally replaced my spreadsheet. I know exactly where every application stands and what to follow up on next.",
    name: "Marcus T.",
    role: "Career switcher",
    company: "Finance to tech",
    avatarSrc: "/testimonials/marcus.jpg",
  },
];

function BackgroundEllipse() {
  return (
    <Box
      aria-hidden
      sx={{
        display: { xs: "none", lg: "block" },
        position: "absolute",
        left: { lg: -40, xl: 0 },
        top: "50%",
        transform: "translateY(-50%)",
        width: 600,
        height: 638,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          bgcolor: "primary.main",
          opacity: 0.35,
          filter: "blur(60px)",
        }}
      />
    </Box>
  );
}

function MobileBackgroundEllipse() {
  return (
    <Box
      aria-hidden
      sx={{
        display: { xs: "block", lg: "none" },
        position: "absolute",
        left: "50%",
        top: 120,
        transform: "translateX(-50%)",
        width: 280,
        height: 280,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          bgcolor: "primary.main",
          opacity: 0.3,
          filter: "blur(40px)",
        }}
      />
    </Box>
  );
}

function QuoteMarks() {
  return (
    <FormatQuoteIcon
      aria-hidden
      sx={{ fontSize: 28, color: "primary.main", opacity: 0.45, transform: "scaleX(-1)" }}
    />
  );
}

function QuoteCard({ quote }: { quote: Quote }) {
  return (
    <Box sx={{ position: "relative", pt: 6, px: { xs: 2, sm: 4 } }}>
      <Avatar
        alt={quote.name}
        src={quote.avatarSrc}
        sx={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
          width: { xs: 120, sm: 140 },
          height: { xs: 120, sm: 140 },
          border: 4,
          borderColor: "background.paper",
          boxShadow: 3,
        }}
      />

      <TintSurface
        tint="custom"
        sx={{
          position: "relative",
          zIndex: 1,
          bgcolor: "background.paper",
          pt: { xs: 8, sm: 9 },
          pb: 3,
          px: { xs: 2.5, sm: 3 },
          borderRadius: 3,
          boxShadow: 4,
        }}
      >
        <QuoteMarks />

        <Typography
          variant="subtitle1"
          component="blockquote"
          color="text.primary"
          sx={{
            m: 0,
            mt: 1.5,
            mb: 2,
            lineHeight: 1.55,
          }}
        >
          {quote.quote}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Box sx={{ transform: "rotate(180deg)" }}>
            <QuoteMarks />
          </Box>
        </Box>

        <Typography
          variant="subtitle1"
          color="text.primary"
          sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
        >
          {quote.name}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 0.25 }}>
          {quote.role}
        </Typography>

        <Divider sx={{ my: 2, borderColor: "divider" }} />

        <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.4 }}>
          {quote.company}
        </Typography>
      </TintSurface>
    </Box>
  );
}

function CarouselDots({
  count,
  activeIndex,
  onSelect,
}: {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ justifyContent: "center", mt: 3 }}
      role="tablist"
      aria-label="Testimonial slides"
    >
      {Array.from({ length: count }, (_, index) => {
        const active = index === activeIndex;

        return (
          <Box
            key={index}
            component="button"
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={`Show testimonial ${index + 1}`}
            onClick={() => onSelect(index)}
            sx={{
              width: 10,
              height: 10,
              p: 0,
              border: 0,
              borderRadius: "50%",
              cursor: "pointer",
              bgcolor: active ? "common.white" : "grey.500",
              opacity: active ? 1 : 0.6,
              transition: "background-color 0.2s ease, opacity 0.2s ease",
              "&:hover": {
                opacity: 1,
              },
            }}
          />
        );
      })}
    </Stack>
  );
}

export function QuoteCarouselSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeQuote = quotes[activeIndex]!;

  const handleSelect = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  return (
    <MarketingSection
      headingId="quote-carousel-heading"
      tone="darkAccent"
      sx={{ position: "relative", overflow: "hidden" }}
      containerSx={{ position: "relative" }}
    >
      <BackgroundEllipse />
      <MobileBackgroundEllipse />

      <Grid
        container
        spacing={{ xs: 4, md: 2 }}
        sx={{
          position: "relative",
          zIndex: 1,
          alignItems: "center",
          pt: { xs: 0, md: 3 },
        }}
      >
        <Grid
          size={{ xs: 12, md: 5 }}
          sx={{ position: "relative", px: { xs: 0, md: 2 } }}
        >
          <Box role="tabpanel" aria-live="polite" aria-atomic="true">
            <Fade in key={activeQuote.id} timeout={400}>
              <div>
                <QuoteCard quote={activeQuote} />
              </div>
            </Fade>
          </Box>
          <CarouselDots
            count={quotes.length}
            activeIndex={activeIndex}
            onSelect={handleSelect}
          />
        </Grid>

        <Grid
          size={{ xs: 12, md: 7 }}
          sx={{
            order: { xs: -1, md: 0 },
            textAlign: { xs: "center", md: "left" },
            pl: { md: 4, lg: 6 },
          }}
        >
          <MarketingDarkText>
            <Typography
              id="quote-carousel-heading"
              variant="marketingSectionTitle"
              component="h2"
              sx={{
                mb: 3,
                maxWidth: 520,
                mx: { xs: "auto", md: 0 },
              }}
            >
              Your resume is an extension of yourself — make one that&apos;s truly you
            </Typography>

            <InvertedButton href="/signup" size="large" sx={{ mb: 4, px: 4 }}>
              Build your resume
            </InvertedButton>

            <Stack
              direction="row"
              spacing={{ xs: 1.5, sm: 2 }}
              sx={{
                alignItems: "center",
                justifyContent: { xs: "center", md: "flex-start" },
                flexWrap: "wrap",
              }}
            >
              <Typography variant="subtitle1">Excellent</Typography>
              <StarRating rating={AGGREGATE_RATING} color="white" />
              <Typography variant="subtitle2">
                {REVIEW_COUNT} reviews
              </Typography>
            </Stack>
          </MarketingDarkText>
        </Grid>
      </Grid>
    </MarketingSection>
  );
}
