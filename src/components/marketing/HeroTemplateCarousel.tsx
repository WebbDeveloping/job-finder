"use client";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { NextLinkButton } from "@/components/NextLinkButton";
import { RESUME_TEMPLATE_EXAMPLES } from "@/lib/marketing/resume-template-examples";

const SLIDES_VISIBLE = { xs: 1.15, sm: 2.2, md: 3.5, lg: 5 };

function TemplateSlide({ templateIndex }: { templateIndex: number }) {
  const example = RESUME_TEMPLATE_EXAMPLES[templateIndex % RESUME_TEMPLATE_EXAMPLES.length]!;

  return (
    <Box
      component="article"
      sx={{
        flex: `0 0 calc(100% / var(--slides-visible))`,
        minWidth: 0,
        px: 1,
      }}
    >
      <Box
        component={Link}
        href="/signup"
        sx={{
          display: "block",
          textDecoration: "none",
          color: "inherit",
          borderRadius: 1,
          overflow: "hidden",
          "&:hover .hero-template-cta": {
            opacity: 1,
            transform: "translateY(0)",
          },
          "&:hover .hero-template-image": {
            transform: "scale(1.02)",
          },
          "&:focus-visible": {
            outline: "2px solid",
            outlineColor: "primary.main",
            outlineOffset: 2,
          },
        }}
      >
        <Paper
          variant="outlined"
          sx={{
            position: "relative",
            overflow: "hidden",
            bgcolor: "background.paper",
          }}
        >
          <Box
            className="hero-template-image"
            sx={{
              position: "relative",
              aspectRatio: "549 / 778",
              bgcolor: "grey.100",
              transition: "transform 0.25s ease",
            }}
          >
            <Image
              src={example.src}
              alt={example.alt}
              fill
              sizes="(max-width: 600px) 80vw, (max-width: 900px) 40vw, 220px"
              style={{ objectFit: "cover", objectPosition: "top" }}
            />
          </Box>

          <Box
            className="hero-template-cta"
            sx={{
              position: "absolute",
              left: 12,
              right: 12,
              bottom: 12,
              opacity: { xs: 1, sm: 0 },
              transform: { xs: "none", sm: "translateY(8px)" },
              transition: "opacity 0.25s ease, transform 0.25s ease",
              pointerEvents: "none",
            }}
          >
            <Box
              sx={{
                py: 1.25,
                px: 2,
                borderRadius: 1,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                textAlign: "center",
                typography: "button",
              }}
            >
              Start with this template
            </Box>
          </Box>
        </Paper>
      </Box>
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
      spacing={0.75}
      sx={{ justifyContent: "center", mt: 2, flexWrap: "wrap" }}
      role="tablist"
      aria-label="Template slides"
    >
      {Array.from({ length: count }, (_, index) => {
        const active = index === activeIndex;
        const near = Math.abs(index - activeIndex) === 1;

        return (
          <Box
            key={index}
            component="button"
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={`Show template ${index + 1}`}
            onClick={() => onSelect(index)}
            sx={{
              width: near ? 8 : 10,
              height: near ? 8 : 10,
              p: 0,
              border: 0,
              borderRadius: "50%",
              cursor: "pointer",
              bgcolor: active ? "primary.main" : "grey.400",
              opacity: active ? 1 : near ? 0.75 : 0.45,
              transition: "background-color 0.2s ease, opacity 0.2s ease, transform 0.2s ease",
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

function StaticTemplateRow() {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        overflowX: "auto",
        pb: 1,
        px: 1,
        scrollSnapType: "x mandatory",
        "& > *": { scrollSnapAlign: "start", minWidth: 180, flex: "0 0 auto" },
      }}
    >
      {RESUME_TEMPLATE_EXAMPLES.map((example, index) => (
        <Paper key={example.id} variant="outlined" sx={{ overflow: "hidden", width: 180 }}>
          <Box sx={{ position: "relative", aspectRatio: "549 / 778", bgcolor: "grey.100" }}>
            <Image
              src={example.src}
              alt={example.alt}
              fill
              sizes="180px"
              style={{ objectFit: "cover", objectPosition: "top" }}
            />
          </Box>
          <Box sx={{ p: 1.5 }}>
            <NextLinkButton href="/signup" variant="contained" fullWidth size="small">
              Start with this template
            </NextLinkButton>
          </Box>
        </Paper>
      ))}
    </Stack>
  );
}

export function HeroTemplateCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const slideCount = RESUME_TEMPLATE_EXAMPLES.length;

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;

    const clamped = Math.max(0, Math.min(index, slideCount - 1));
    const slideWidth = track.scrollWidth / slideCount;
    track.scrollTo({ left: slideWidth * clamped, behavior: "smooth" });
    setActiveIndex(clamped);
  }, [slideCount]);

  const handlePrev = useCallback(() => {
    scrollToIndex(activeIndex - 1);
  }, [activeIndex, scrollToIndex]);

  const handleNext = useCallback(() => {
    scrollToIndex(activeIndex + 1);
  }, [activeIndex, scrollToIndex]);

  return (
    <Box sx={{ mt: { xs: 6, md: 8, lg: 10 } }}>
      <Typography
        id="hero-template-carousel-heading"
        variant="marketingSectionTitle"
        component="h2"
        sx={{
          textAlign: "center",
          mb: { xs: 3, md: 4 },
          px: { xs: 1, sm: 0 },
        }}
      >
        Pick a template and build your resume in minutes!
      </Typography>

      <Box
        sx={{
          display: "none",
          "@media (prefers-reduced-motion: reduce)": {
            display: "block",
          },
        }}
      >
        <StaticTemplateRow />
      </Box>

      <Box
        sx={{
          position: "relative",
          "@media (prefers-reduced-motion: reduce)": {
            display: "none",
          },
          "@media (prefers-reduced-motion: no-preference)": {
            animation: "hero-carousel-fade-in 0.7s ease-out 0.2s both",
            "@keyframes hero-carousel-fade-in": {
              from: {
                opacity: 0,
                transform: "translateY(16px)",
              },
              to: {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          },
        }}
      >
        <IconButton
          aria-label="Previous templates"
          onClick={handlePrev}
          disabled={activeIndex === 0}
          sx={{
            display: { xs: "none", md: "flex" },
            position: "absolute",
            left: { md: -20, lg: -48 },
            top: "42%",
            zIndex: 2,
            bgcolor: "background.paper",
            boxShadow: 2,
            "&:hover": { bgcolor: "grey.100" },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>

        <Box
          sx={{
            overflow: "hidden",
            width: "100vw",
            position: "relative",
            left: "50%",
            right: "50%",
            marginLeft: "-50vw",
            marginRight: "-50vw",
            "--slides-visible": SLIDES_VISIBLE.xs,
            "@media (min-width: 600px)": {
              "--slides-visible": SLIDES_VISIBLE.sm,
            },
            "@media (min-width: 900px)": {
              "--slides-visible": SLIDES_VISIBLE.md,
            },
            "@media (min-width: 1200px)": {
              "--slides-visible": SLIDES_VISIBLE.lg,
            },
          }}
        >
          <Box
            ref={trackRef}
            onScroll={() => {
              const track = trackRef.current;
              if (!track) return;
              const slideWidth = track.scrollWidth / slideCount;
              if (slideWidth <= 0) return;
              const nextIndex = Math.round(track.scrollLeft / slideWidth);
              setActiveIndex(Math.max(0, Math.min(nextIndex, slideCount - 1)));
            }}
            sx={{
              display: "flex",
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              scrollBehavior: "smooth",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
              px: { xs: 1, sm: 0 },
            }}
          >
            {RESUME_TEMPLATE_EXAMPLES.map((_, index) => (
              <TemplateSlide key={index} templateIndex={index} />
            ))}
          </Box>
        </Box>

        <IconButton
          aria-label="Next templates"
          onClick={handleNext}
          disabled={activeIndex >= slideCount - 1}
          sx={{
            display: { xs: "none", md: "flex" },
            position: "absolute",
            right: { md: -20, lg: -48 },
            top: "42%",
            zIndex: 2,
            bgcolor: "background.paper",
            boxShadow: 2,
            "&:hover": { bgcolor: "grey.100" },
          }}
        >
          <ChevronRightIcon />
        </IconButton>

        <CarouselDots
          count={slideCount}
          activeIndex={activeIndex}
          onSelect={scrollToIndex}
        />
      </Box>
    </Box>
  );
}
