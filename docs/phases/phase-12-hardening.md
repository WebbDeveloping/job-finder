# Phase 12 — SaaS hardening and operations

**Status:** Pending  
**Depends on:** Phase 11 (or Phase 9 if billing deferred — adjust scope)  

## Goal

Operate safely with real users: observability, email, backups, admin basics, compliance helpers.

## Do NOT (this phase)

- Major new product features
- Enterprise SSO (unless explicitly requested later)

## Observability

- [ ] [Sentry](https://sentry.io) (or similar) for Next.js client + server
- [ ] Structured logging for webhook failures
- [ ] Uptime check on `/api/health` (Vercel monitoring or external)

## Email (transactional)

- [ ] Provider: Resend, Postmark, or SendGrid
- [ ] Templates: welcome, password reset (if email auth), payment receipt (Stripe can also email)
- [ ] Env: `RESEND_API_KEY` etc. in `.env.example`

## Database operations

- [ ] Document backup policy for Vercel Postgres / Neon (PITR, snapshots)
- [ ] Runbook: restore procedure (link in `docs/DATABASE.md`)

## User data rights

- [ ] **Export my data** — JSON download of applications + resume (settings action)
- [ ] **Delete account** — verify Phase 8 cascade still complete with Stripe (cancel subscription in Portal first or webhook on delete)

## Admin (internal, minimal)

- [ ] `ADMIN_EMAILS` env allowlist
- [ ] `/admin` — list users, plan, createdAt (read-only); disable user flag optional
- [ ] Protect with session + allowlist (no separate admin product)

## Security pass

- [ ] Review all API routes for auth
- [ ] CAPTCHA on signup if abuse appears (document optional integration)
- [ ] Security headers via `next.config.ts` if not present
- [ ] Dependency audit in CI (`npm audit` or Dependabot)

## Legal / compliance (baseline)

- [ ] Privacy policy mentions: data collected, retention, third parties (Stripe, host)
- [ ] Cookie notice if analytics added
- [ ] GDPR: export + delete already in app

## CI (optional)

- [ ] GitHub Action: lint, build, `prisma migrate deploy` dry-run against ephemeral DB

## Done criteria

- [ ] `docs/PLAN.md` Phase 12 → **Done**
- [ ] `docs/OPERATIONS.md` created with runbooks (or section in DATABASE.md)

## Post-launch

Track feedback for: teams, API access, integrations (LinkedIn import), etc. — new phases as needed.
