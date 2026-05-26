# Phase 8 — SaaS product shell (free tier)

**Status:** Pending  
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
    layout.tsx            → requires session; AppNav
    pipeline/...
    resume/...
    settings/
      page.tsx            → profile, delete account
```

- [ ] Move authenticated pages under `(app)` with shared layout
- [ ] Marketing layout without app nav (or minimal header with Sign in)

## Landing page `/`

- [ ] Value proposition, feature bullets (pipeline, Sankey, resume PDF)
- [ ] CTAs: Sign up, Sign in
- [ ] Logged-in visit → redirect to `/pipeline`

## Settings `/settings`

- [ ] Display name, email (read-only if from OAuth)
- [ ] **Delete account** — confirm dialog; cascade delete user data (Prisma `onDelete: Cascade`)
- [ ] Link placeholder for "Billing" (disabled or "Coming soon" until Phase 11)

## Onboarding

- [ ] First session after sign-up: show empty pipeline CTA (banner or dedicated `/onboarding` once)
- [ ] Empty states: no applications, no resume saved yet (basic copy + buttons)

## Navigation

- [ ] `AppNav`: Pipeline, Analytics, Resume, Settings, Sign out
- [ ] Marketing header: Logo, Sign in, Get started

## Error handling

- [ ] Friendly `error.tsx` / `not-found.tsx` in `(app)` group
- [ ] Auth errors on login form

## Rate limiting (light)

- [ ] Document or add basic protection on `/api/auth/*` (Vercel firewall, Upstash, or middleware counter) — minimal acceptable: note in README for manual Vercel config

## Verification

- [ ] New user: land → sign up → see onboarding/empty pipeline → add job
- [ ] Delete account removes all applications and resume
- [ ] `/privacy` and `/terms` reachable without login

## Done criteria

- [ ] `docs/PLAN.md` Phase 8 → **Done**
- [ ] Metadata: update `layout.tsx` title/description for marketing vs app if split

## Handoff to Phase 9

Functional SaaS shell; polish mobile and UX next.
