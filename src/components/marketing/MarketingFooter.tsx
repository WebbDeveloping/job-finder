import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { NextMuiLink } from "@/components/NextMuiLink";
import { StarRating } from "@/components/ui/StarRating";
import {
  AGGREGATE_RATING,
  REVIEW_COUNT,
} from "@/lib/marketing/social-proof";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
  featured?: boolean;
};

type FooterColumn = {
  id: string;
  title: string;
  links: FooterLink[];
  hideBelow?: "md" | "lg";
  hideAbove?: "sm";
};

const footerColumns: FooterColumn[] = [
  {
    id: "get-started",
    title: "Get started",
    links: [
      { label: "Create resume", href: "/signup", featured: true },
      { label: "Sign in", href: "/login" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
  {
    id: "contact-mobile",
    title: "Contact us",
    hideBelow: "lg",
    links: [
      { label: "support@jobfinder.app", href: "mailto:support@jobfinder.app" },
      { label: "Help center", href: "mailto:support@jobfinder.app" },
    ],
  },
  {
    id: "resume",
    title: "Resume",
    links: [
      { label: "Resume templates", href: "/#template-marquee-heading" },
      { label: "ATS-friendly resumes", href: "/#ats-section-heading" },
      { label: "PDF export", href: "/signup" },
      { label: "Resume builder", href: "/signup" },
      { label: "Pick a template", href: "/#resume-picker-heading" },
      { label: "Classic layouts", href: "/#template-marquee-heading" },
      { label: "How to write a resume", href: "/#how-it-helps-heading" },
    ],
  },
  {
    id: "job-search",
    title: "Job search",
    links: [
      { label: "Application pipeline", href: "/signup" },
      { label: "Pipeline tracker", href: "/#job-search-hub-heading" },
      { label: "Stage analytics", href: "/#stats-section-heading" },
      { label: "One workspace", href: "/#job-search-hub-heading" },
      { label: "Track every application", href: "/signup" },
    ],
  },
  {
    id: "resources",
    title: "Resources",
    links: [
      { label: "How Job Finder helps", href: "/#how-it-helps-heading" },
      { label: "Career path guides", href: "/#for-applicants-heading" },
      { label: "Job seeker reviews", href: "/#testimonials-heading" },
      { label: "Resume tips", href: "/#resume-builder-features-heading" },
    ],
  },
  {
    id: "about",
    title: "About us",
    links: [
      { label: "About Job Finder", href: "/" },
      { label: "User reviews", href: "/#testimonials-heading" },
      { label: "Why we built this", href: "/#how-it-helps-heading" },
    ],
  },
  {
    id: "contact-desktop",
    title: "Contact us",
    hideAbove: "sm",
    links: [
      { label: "support@jobfinder.app", href: "mailto:support@jobfinder.app" },
      { label: "Help center", href: "mailto:support@jobfinder.app" },
    ],
  },
];

function FooterLinkItem({ label, href, external, featured }: FooterLink) {
  return (
    <NextMuiLink
      href={href}
      underline="hover"
      variant={featured ? "subtitle2" : "body2"}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        color: featured ? "common.white" : "grey.400",
        lineHeight: 1.5,
        transition: "color 0.2s ease",
        "&:hover": {
          color: "common.white",
        },
      }}
    >
      {featured ? (
        <ArrowForwardIcon sx={{ fontSize: 16, opacity: 0.85 }} aria-hidden />
      ) : null}
      {label}
    </NextMuiLink>
  );
}

function FooterColumnBlock({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <Box>
      <Typography
        variant="subtitle2"
        sx={{
          color: "grey.300",
          mb: 1.5,
          mt: { xs: 1, md: 3 },
        }}
      >
        {title}
      </Typography>
      <Stack
        component="ul"
        spacing={1.25}
        sx={{ listStyle: "none", m: 0, p: 0 }}
      >
        {links.map((link) => (
          <Box component="li" key={link.label}>
            <FooterLinkItem {...link} />
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

function ReviewsWidget() {
  return (
    <Box sx={{ mt: { xs: 1, md: 3 } }}>
      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: { xs: "flex-start", sm: "center", lg: "flex-start" },
        }}
      >
        <StarRating rating={AGGREGATE_RATING} color="white" />
        <Typography variant="subtitle2" sx={{ color: "common.white" }}>
          {REVIEW_COUNT} reviews
        </Typography>
      </Stack>
      <Typography
        variant="caption"
        sx={{
          display: "block",
          mt: 1.5,
          color: "grey.500",
          maxWidth: 220,
          lineHeight: 1.5,
        }}
      >
        Trusted by job seekers building resumes and tracking applications.
      </Typography>
    </Box>
  );
}

function columnVisibility(column: FooterColumn) {
  const sx: Record<string, unknown> = {};

  if (column.hideBelow === "lg") {
    sx.display = { xs: "block", lg: "none" };
  }
  if (column.hideBelow === "md") {
    sx.display = { xs: "block", md: "none" };
  }
  if (column.hideAbove === "sm") {
    sx.display = { xs: "none", sm: "block" };
  }

  return sx;
}

export function MarketingFooter() {
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        bgcolor: "background.dark",
        color: "grey.400",
        pt: { xs: 4, md: 5, xl: 2 },
        pb: { xs: 5, md: 6, xl: 9 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
          {footerColumns.map((column) => (
            <Grid
              key={column.id}
              size={{ xs: 12, sm: 6, md: 3 }}
              sx={columnVisibility(column)}
            >
              <FooterColumnBlock title={column.title} links={column.links} />
            </Grid>
          ))}

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <ReviewsWidget />
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: "grey.800", mt: 3, mb: 4 }} />

        <Grid
          container
          spacing={2}
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack
              direction="row"
              spacing={0.75}
              sx={{
                alignItems: "center",
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              <WorkOutlineOutlinedIcon sx={{ fontSize: 22, color: "primary.light" }} aria-hidden />
              <Typography variant="subtitle2" sx={{ color: "grey.300" }}>
                Job Finder
              </Typography>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
                justifyContent: { xs: "center", md: "flex-end" },
                flexWrap: "wrap",
                rowGap: 0.5,
              }}
            >
              <Typography variant="caption" sx={{ color: "grey.500" }}>
                Made with care by people who care.
              </Typography>
              <Typography variant="caption" sx={{ color: "grey.500" }}>
                © {year}. All rights reserved.
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
