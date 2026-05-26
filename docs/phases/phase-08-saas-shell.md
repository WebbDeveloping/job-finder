# Phase 8 — SaaS product shell (free tier)

**Status:** Done  
**Depends on:** Phase 7  
**Blocks:** Phase 9+

## Goal

The product feels like a **free SaaS**, not a personal tool: landing page, settings, onboarding, account lifecycle.

## Do NOT (this phase)

- Stripe Checkout or webhooks
- Public resume sharing (`/r/[slug]`)
- Enforced numeric limits (optional placeholder UI for "Pro coming soon" is OK)
- Mobile polish (Phase 9)

## Routing structure

Use route groups where helpful:

```
src/app/
  (marketing)/
    page.tsx              → public landing /
    privacy/page.tsx
    terms/page.tsx
  (auth)/
    login/page.tsx
    signup/page.tsx
  (app)/
    layout.tsx            → requires session; AppShell (dashboard)
    dashboard/page.tsx
    pipeline/...
    resume/...
    settings/
      page.tsx            → profile, delete account
```

- [x] Move authenticated pages under `(app)` with shared layout
- [x] Marketing layout without app nav (minimal header with Sign in / Get started)

## Landing page `/`

- [x] Value proposition, feature bullets (pipeline, Sankey, resume PDF)
- [x] CTAs: Sign up, Sign in
- [x] Logged-in visit → redirect to `/dashboard`

## Settings `/settings`

- [x] Display name, email (read-only)
- [x] **Delete account** — confirm dialog; cascade delete user data (Prisma `onDelete: Cascade`)
- [x] Link placeholder for "Billing" (disabled or "Coming soon" until Phase 11)

## Onboarding

- [x] First session after sign-up: show empty pipeline CTA (banner on dashboard/pipeline)
- [x] Empty states: no applications, no resume saved yet (basic copy + buttons)

## Navigation

- [x] App shell sidebar: Dashboard, Pipeline, Analytics, Resume, Settings, Sign out
- [x] Marketing header: Logo, Sign in, Get started

## Error handling

- [x] Friendly `error.tsx` / `not-found.tsx` in `(app)` group
- [x] Auth errors on login form

## Rate limiting (light)

- [x] Document basic protection on `/api/auth/*` in README (Vercel firewall)

## Verification

- [ ] New user: land → sign up → see onboarding/empty pipeline → add job
- [ ] Delete account removes all applications and resume
- [ ] `/privacy` and `/terms` reachable without login

## Done criteria

- [x] `docs/PLAN.md` Phase 8 → **Done**
- [x] Metadata: update `layout.tsx` title/description for marketing vs app if split

## Handoff to Phase 9

Functional SaaS shell; polish mobile and UX next.
