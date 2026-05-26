# Phase 11 — Stripe billing and plans

**Status:** Pending  
**Depends on:** Phase 7 (`User.plan`, Stripe id fields); Phase 9+ recommended  
**Blocks:** Phase 12

## Goal

Users can upgrade to **Pro** via Stripe. Webhooks keep `User.plan` in sync. Free tier remains fully usable.

## Do NOT (this phase)

- Teams / seat-based billing
- Usage-based metering
- Multiple paid tiers (stick to Free + Pro for v1)

## Stripe setup

- [ ] Stripe account (test mode for dev)
- [ ] Product **Job Finder Pro** with monthly (and optional yearly) price
- [ ] Env vars in `.env.example`:

```env
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRO_PRICE_ID=       # price_...
```

## Server

- [ ] `src/lib/stripe.ts` — Stripe SDK singleton
- [ ] `POST /api/stripe/checkout` — create Checkout Session (mode: subscription); attach `client_reference_id` or metadata `userId`
- [ ] `POST /api/stripe/portal` — Customer Portal session for manage/cancel
- [ ] `POST /api/stripe/webhook` — verify signature; handle:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
- [ ] On subscribe: set `plan = "pro"`, store `stripeCustomerId`, `stripeSubscriptionId`
- [ ] On cancel/expiry: set `plan = "free"`, clear subscription id

## Entitlements

- [ ] `src/lib/plan.ts` — `getPlanLimits(plan)`, `requirePro(user)` helpers
- [ ] Define v1 limits, e.g.:

| Feature | Free | Pro |
|---------|------|-----|
| Applications | 100 (example) | Unlimited |
| PDF download | Yes | Yes |
| Public resume | Yes | Yes |
| Branding on PDF | "Job Finder" footer | Remove footer (optional) |

- [ ] Enforce limits in **server actions** (not only UI)
- [ ] Upgrade CTA when limit hit

## UI

- [ ] `/settings/billing` — current plan, Upgrade, Manage subscription (Portal)
- [ ] Success/cancel return URLs after Checkout

## Webhook locally

- [ ] Document `stripe listen --forward-to localhost:3000/api/stripe/webhook`

## Verification

- [ ] Test card completes Checkout → `plan` is `pro`
- [ ] Portal cancel → webhook → `plan` is `free`
- [ ] Free user over limit cannot create application (clear error)

## Done criteria

- [ ] `docs/PLAN.md` Phase 11 → **Done**
- [ ] README section: Stripe test mode setup

## Handoff to Phase 12

Ops, email, monitoring, compliance.
