# Marketing UI

Compose landing sections from design system primitives — do not build bespoke section shells.

## Required imports

- `MarketingSection` — section wrapper with tone and padding
- `MarketingSectionHeader` — section title + lead
- `FeatureBulletList`, `StarRating`, `InvertedButton`, `TintSurface` as needed
- Social proof: `AGGREGATE_RATING`, `REVIEW_COUNT` from `@/lib/marketing/social-proof`

## Typography

Use variants only: `marketingHeroTitle`, `marketingSectionTitle`, `marketingFeatureTitle`, `marketingLead`, `marketingStat`.

Never inline `fontWeight`.

## Section tones

| Tone | Use |
|------|-----|
| `hero` | Landing hero |
| `light` | Default content sections |
| `tint` | Subtle tinted background |
| `dark` | `background.dark` bands (ATS, footer-style) |
| `darkAccent` | `primary.dark` finale CTA |

## Section decorations

Reusable SVG accents live in [`decorations/SectionDecorations.tsx`](./decorations/SectionDecorations.tsx). Import from `@/components/marketing/decorations` — do not duplicate inline SVG paths in section files.

## Canonical templates

- **Feature section:** [`HowItHelpsSection.tsx`](./HowItHelpsSection.tsx)
- **Hero:** [`LandingHero.tsx`](./LandingHero.tsx)
- **Dark band:** [`AtsSection.tsx`](./AtsSection.tsx)

Match spacing and structure from these before inventing new patterns.

## Rules

- NEVER use hex/rgb colors
- NEVER inline fontWeight
- ALWAYS `aria-labelledby` on sections with visible headings
- Container `maxWidth="lg"` unless narrow content (`md` for ForApplicants)

See [`docs/DESIGN.md`](../../docs/DESIGN.md).
