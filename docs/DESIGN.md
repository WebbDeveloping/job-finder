# Job Finder Design System

MUI-based design system for marketing pages and the authenticated app. One theme ([`src/theme/theme.ts`](../src/theme/theme.ts)), two usage modes.

## Brand overview

- **Font:** Geist Sans (`var(--font-geist-sans)`)
- **Border radius:** 8px
- **Primary:** MUI default blue — CTAs, links, nav selection
- **App canvas:** `background.app` (`grey.50`)
- **Marketing canvas:** `background.default` (white)
- **Dark bands:** `background.dark` (`grey.900`)
- **Finale CTA band:** `primary.dark` (`darkAccent` tone)

## Shared foundations

- **Spacing:** MUI 8px grid (`theme.spacing(1) === 8px`)
- **Colors:** Use palette keys or `var(--mui-palette-*)` only — never hex/rgb in components
- **Typography:** Use named variants — never inline `fontWeight`
- **Buttons:** `disableElevation` globally; one primary `contained` per view
- **Surfaces:** Outlined `Paper`, no elevation in app

## Marketing mode

### Section types

| Type | Component | Tone |
|------|-----------|------|
| Hero | `MarketingSection` | `hero` |
| Feature / content | `MarketingSection` | `light` |
| Tinted band | `MarketingSection` | `tint` |
| Dark feature | `MarketingSection` | `dark` |
| Finale CTA | `MarketingSection` | `darkAccent` |

### Typography variants

| Variant | Use |
|---------|-----|
| `marketingHeroTitle` | Page hero H1 |
| `marketingSectionTitle` | Section H2 |
| `marketingFeatureTitle` | Feature row H3 |
| `marketingLead` | Section intro copy |
| `marketingStat` | Stat numbers |

### Section padding (`marketingTokens.sectionPy`)

- `default`: `{ xs: 5, md: 8 }`
- `hero`: `{ xs: 6, md: 10 }`
- `compact`: `{ xs: 4, md: 6 }`

### Canonical examples

- [`LandingHero.tsx`](../src/components/marketing/LandingHero.tsx) — hero
- [`HowItHelpsSection.tsx`](../src/components/marketing/HowItHelpsSection.tsx) — feature section template
- [`AtsSection.tsx`](../src/components/marketing/AtsSection.tsx) — dark band

## App mode

### Page anatomy

```
PageHeader (title, subtitle, back?, actions?)
  → PageSection(s) or content
  → AppCard / EmptyStatePanel / FormColumn
```

### Typography variants

| Variant | Use |
|---------|-----|
| `appPageTitle` | Page H1 |
| `appSectionTitle` | Section H2 |
| `appFormGroupTitle` | Form group labels |
| `appAuthTitle` | Auth card title |

### Layout tokens (`appTokens`)

- `mainPadding`: `{ xs: 2, md: 3 }`
- `pageHeaderGap`: 3
- `sectionGap`: 4
- `formMaxWidth`: 480
- `formWideMaxWidth`: 560

## Component catalog (`src/components/ui/`)

| Component | When to use |
|-----------|-------------|
| `MarketingSection` | All marketing sections |
| `MarketingSectionHeader` | Section title + lead |
| `FeatureBulletList` | Icon bullet lists |
| `StarRating` | Review stars |
| `InvertedButton` | White CTA on dark bands |
| `TintSurface` | Tinted card backgrounds |
| `PageHeader` | App page titles |
| `PageSection` | App in-page sections |
| `AppCard` | Outlined surfaces |
| `EmptyStatePanel` | Dashed empty state wrapper |
| `FormColumn` | Constrained form width |
| `DangerZone` | Destructive actions |
| `BackLink` | `← Back to …` |
| `StatCard` | Dashboard stat tiles |
| `EmptyState` | Illustration empty state |
| `IconBadge` | Icon in colored square |

## Do / Don't

**Do**

- Compose from `src/components/ui/` primitives
- Use `MarketingSection` + typography variants on landing pages
- Use `PageHeader` on every app page
- One `h1` per page

**Don't**

- Hard-code colors (`#`, `rgb()`)
- Inline `fontWeight` on Typography
- Create one-off `Button` styles for dark bands — use `InvertedButton`
- Duplicate `StarRating` — import from ui

## New feature checklist

- [ ] Uses theme typography variants
- [ ] Uses existing ui primitive or extracts one if pattern repeats twice
- [ ] No hex/rgb in component files
- [ ] `npm run build` passes

See also [`src/components/marketing/AGENTS.md`](../src/components/marketing/AGENTS.md) and [`.cursor/rules/mui-design.mdc`](../.cursor/rules/mui-design.mdc).
