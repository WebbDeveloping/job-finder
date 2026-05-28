"use client";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { NextLinkButton } from "@/components/NextLinkButton";
import { MarketingSection } from "@/components/ui/MarketingSection";
import { StarRating } from "@/components/ui/StarRating";
import { TintSurface } from "@/components/ui/TintSurface";
import { surfaceTints } from "@/theme/tokens";
import {
  AGGREGATE_RATING,
  REVIEW_COUNT,
} from "@/lib/marketing/social-proof";

type Testimonial = {
  rating: number;
  date: string;
  quote: string;
  name: string;
};

const leftColumn: Testimonial[] = [
  {
    rating: 5,
    date: "1 day ago",
    quote:
      "Really helpful to get started with building resumes. The pipeline view keeps every application organized.",
    name: "Jordan M.",
  },
  {
    rating: 5,
    date: "2 days ago",
    quote:
      "Clean templates and easy PDF export. I updated my resume in an afternoon and felt ready to apply.",
    name: "Priya K.",
  },
];

const centerColumn: Testimonial[] = [
  {
    rating: 5,
    date: "2 days ago",
    quote:
      "Love tailoring my resume for each role without starting from scratch every time.",
    name: "Marcus T.",
  },
];

const rightColumn: Testimonial[] = [
  {
    rating: 5,
    date: "3 days ago",
    quote:
      "Finally replaced my spreadsheet. Tracking stages and notes per company is a game changer.",
    name: "Elena R.",
  },
  {
    rating: 4,
    date: "4 days ago",
    quote: "Simple, focused, and free. Exactly what I needed during my job search.",
    name: "David L.",
  },
];

function TestimonialCard({ rating, date, quote, name }: Testimonial) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 2, sm: 2.5 },
        pt: 2,
        pb: 3,
        borderRadius: 0,
        bgcolor: "background.paper",
      }}
    >
      <Stack spacing={0.5}>
        <StarRating rating={rating} />
        <Typography variant="caption" color="text.secondary">
          {date}
        </Typography>
      </Stack>

      <Typography variant="body1" sx={{ mt: 2, mb: 2, lineHeight: 1.55 }}>
        {quote}
      </Typography>

      <Typography variant="subtitle2">
        <Box component="span" sx={{ color: "text.secondary", mr: 0.75 }}>
          —
        </Box>
        {name}
      </Typography>
    </Paper>
  );
}

function RatingSummary() {
  return (
    <TintSurface
      component="paper"
      tint="primarySubtle"
      sx={{
        p: { xs: 2, sm: 2.5 },
        mb: { xs: 3, md: 6 },
        mr: { md: 6 },
        borderRadius: 0,
        border: 0,
        boxShadow: 0,
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1, sm: 2 }}
        sx={{ alignItems: { sm: "center" }, mb: 1.5 }}
      >
        <StarRating rating={AGGREGATE_RATING} size="medium" />
        <Typography variant="subtitle2">
          {AGGREGATE_RATING} Rating
        </Typography>
      </Stack>

      <Typography variant="subtitle1" sx={{ mb: 2, lineHeight: 1.4 }}>
        {REVIEW_COUNT} job seekers shared their experience.
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ display: { xs: "block", md: "none" } }}>
        Ready to try it yourself?
      </Typography>
      <NextLinkButton
        href="/signup"
        variant="text"
        sx={{
          display: { xs: "inline-flex", md: "none" },
          p: 0,
          minWidth: 0,
          justifyContent: "flex-start",
        }}
      >
        Create a free account
      </NextLinkButton>
    </TintSurface>
  );
}

function SignupPrompt({ sx }: { sx?: object }) {
  return (
    <Box sx={{ textAlign: "center", py: 2, ...sx }}>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
        Ready to try it yourself?
      </Typography>
      <NextLinkButton href="/signup" variant="text">
        Create a free account
      </NextLinkButton>
    </Box>
  );
}

export function TestimonialsSection() {
  return (
    <MarketingSection
      headingId="testimonials-heading"
      sx={{
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background: surfaceTints.heroGradient,
        },
      }}
      containerSx={{ position: "relative", zIndex: 1 }}
    >
      <Typography
        id="testimonials-heading"
        variant="marketingSectionTitle"
        component="h2"
        sx={{
          mb: { xs: 3, md: 4 },
          maxWidth: { xl: "58%" },
          pr: { xl: 6 },
        }}
      >
        Trusted by job seekers &{" "}
        <Box component="span" sx={{ display: { xs: "inline", sm: "block" } }}>
          career changers
        </Box>
      </Typography>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid size={{ xs: 12, md: 4 }} sx={{ pr: { md: 2 } }}>
          <Stack spacing={{ xs: 2, md: 3 }}>
            <TestimonialCard {...leftColumn[0]} />
            <Box sx={{ ml: { md: 4 } }}>
              <TestimonialCard {...leftColumn[1]} />
            </Box>
          </Stack>
        </Grid>

        <Grid
          size={{ xs: 12, md: 4 }}
          sx={{ order: { xs: -1, md: 0 }, mt: { md: 2.5 } }}
        >
          <RatingSummary />
          <Stack spacing={{ xs: 2, md: 3 }}>
            {centerColumn.map((testimonial) => (
              <TestimonialCard key={testimonial.name} {...testimonial} />
            ))}
          </Stack>
          <SignupPrompt sx={{ display: { xs: "none", md: "block" } }} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }} sx={{ pl: { md: 2 } }}>
          <Stack spacing={{ xs: 2, md: 3 }}>
            {rightColumn.map((testimonial) => (
              <TestimonialCard key={testimonial.name} {...testimonial} />
            ))}
          </Stack>
          <SignupPrompt sx={{ display: { xs: "block", md: "none" } }} />
        </Grid>
      </Grid>
    </MarketingSection>
  );
}
