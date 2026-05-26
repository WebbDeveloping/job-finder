# Phase 9 — UX polish and mobile

**Status:** Pending  
**Depends on:** Phase 8  
**Replaces:** Original Phase 5 (polish) — merged here

## Goal

Ship-quality UI on desktop and mobile before broader launch or public resume features.

## Do NOT (this phase)

- Stripe / billing
- New data models (unless tiny fixes for polish)
- Public share routes

## Mobile layout

- [ ] `AppNav` — usable on narrow screens (scroll, drawer, or stacked)
- [ ] `/pipeline` — list readable; actions reachable
- [ ] `/pipeline/new`, `/pipeline/[id]` — forms stack; no horizontal overflow
- [ ] `/pipeline/analytics` — Sankey scrolls or scales; filters usable on mobile
- [ ] `/resume` — editor sections stack; repeatable experience/education rows usable
- [ ] `/settings` — forms full width
- [ ] Marketing `/` — responsive hero and CTAs

## Empty and loading states

- [ ] Pipeline: no applications
- [ ] Analytics: no stage events / insufficient data for Sankey
- [ ] Resume: no profile yet
- [ ] Consistent MUI `Skeleton` or progress where server components load slowly

## Accessibility

- [ ] Form labels and `aria-invalid` on errors
- [ ] Focus order on modals/dialogs (delete account)
- [ ] Color contrast for stage badges and Sankey (don't rely on color alone where possible)

## SEO (marketing)

- [ ] `metadata` on `/` — title, description, Open Graph basics
- [ ] Optional `robots` — allow indexing of marketing; noindex app routes if desired

## Quality

- [ ] Run through full flow on 375px viewport
- [ ] `npm run build` && `npm run lint`

## Done criteria

- [ ] `docs/PLAN.md` Phase 9 → **Done**; original Phase 5 marked **Merged → 9**

## Handoff to Phase 10

Ready for optional public resume and legal polish, or launch after 9 if skipping Phase 10 initially.
