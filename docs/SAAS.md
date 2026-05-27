# Job Finder — SaaS direction

This app is evolving from a **personal single-tenant tool** into a **multi-tenant SaaS**: free tier now, paid tier later. Each implementation phase is documented separately so it can be built in **one chat per phase**.

## Product goals

| Goal | Notes |
|------|--------|
| Multi-user | Each account sees only their pipeline, analytics, and resume |
| Free for now | No payment required at launch; all core features on free tier |
| Paid later | Stripe subscriptions; `plan` field on `User` from Phase 7 onward |
| Public optional | Marketing site + opt-in public resume share (Phase 10) |
| Private by default | Job applications, notes, and Sankey data are never public |

## Database decision: PostgreSQL

**Production and local development target PostgreSQL** (not SQLite).

| Environment | Recommendation |
|-------------|----------------|
| Local dev | **Prisma Postgres** (same URLs as Vercel) — see [DATABASE.md](./DATABASE.md); optional Docker/Neon for a separate dev DB |
| Production | **Prisma Postgres** via Vercel Storage ([setup guide](https://www.prisma.io/docs/guides/postgres/vercel)) |
| ORM | Prisma 7 + `@prisma/adapter-pg`; env: `DATABASE_URL`, `DIRECT_URL`, or Vercel’s `PRISMA_DATABASE_URL` / `POSTGRES_URL` |

Phase 6 removed SQLite from the runtime path. Old SQLite migrations are archived under `prisma/migrations-sqlite-archive/`.

Connection string format:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
```

For serverless (Vercel), prefer a **pooled** URL for the app (`?pgbouncer=true` or provider-specific pooler) and a **direct** URL for migrations if your host documents one (`DIRECT_URL`).

See [DATABASE.md](./DATABASE.md) for setup, migrations, and Vercel env vars.

## Auth decision (Phase 7+)

**Default:** [Auth.js](https://authjs.dev/) (NextAuth v5) with **Prisma adapter** — users live in Postgres; **JWT session strategy** with Credentials sign-in (Phase 7).

Alternatives (document if you switch): Clerk, WorkOS. Do not mix two auth systems.

## Billing decision (Phase 11+)

**Default:** [Stripe](https://stripe.com) Checkout + Customer Portal + webhooks updating `User.plan`.

Plans (initial):

| Plan | Slug | Purpose |
|------|------|---------|
| Free | `free` | Default; full core product at launch |
| Pro | `pro` | Paid; limits lifted + extras TBD in Phase 11 |

Add `plan`, `stripeCustomerId`, and `stripeSubscriptionId` (nullable) on `User` in Phase 7 even if billing is not wired yet.

## Architecture after SaaS phases

```mermaid
flowchart TB
  subgraph public [Public routes]
    Landing["/"]
    Legal["/privacy, /terms"]
    AuthPages["/login, /signup"]
    PublicResume["/r/slug — Phase 10"]
  end

  subgraph app [Authenticated app]
    Pipeline["/pipeline/*"]
    Resume["/resume"]
    Settings["/settings — Phase 8"]
    Billing["/settings/billing — Phase 11"]
  end

  subgraph data [PostgreSQL]
    User
    Application
    StageEvent
    Resume
  end

  AuthPages --> User
  app --> data
  PublicResume --> Resume
```

## Authorization rule (all phases after 7)

Every read/write of tenant data must:

1. Resolve the current user from the session (or reject).
2. Query with `userId` in the `where` clause (or join through `Application.userId`).
3. Return **404** for missing or wrong-owner records (not 403), to avoid ID enumeration.

Never trust route params (`/pipeline/[id]`) without an ownership check.

## Phase map

| Phase | Doc | Depends on |
|-------|-----|------------|
| 0–4 | [PLAN.md](./PLAN.md) | — (done) |
| 5 | Merged into **9** | — |
| **6** | [phases/phase-06-postgres.md](./phases/phase-06-postgres.md) | — |
| **7** | [phases/phase-07-auth-tenancy.md](./phases/phase-07-auth-tenancy.md) | 6 |
| **8** | [phases/phase-08-saas-shell.md](./phases/phase-08-saas-shell.md) | 7 |
| **9** | [phases/phase-09-polish.md](./phases/phase-09-polish.md) | 8 |
| **10** | [phases/phase-10-public.md](./phases/phase-10-public.md) | 9, **13** (public share on `Resume`) |
| **11** | [phases/phase-11-billing.md](./phases/phase-11-billing.md) | 10 (or 9 if skipping public share) |
| **12** | [phases/phase-12-hardening.md](./phases/phase-12-hardening.md) | 11 |
| **13** | [phases/phase-13-resume-library.md](./phases/phase-13-resume-library.md) | 9 |
| **14** | [phases/phase-14-application-resume.md](./phases/phase-14-application-resume.md) | 13 |

**Resume library:** Prefer **13 → 14** before **10** so public routes target `Resume`, not `ResumeProfile`.

## Files that touch tenant data today

When scoping by user (Phase 7), update every file in this list:

| File | Operations |
|------|------------|
| `src/lib/application.ts` | `findMany`, `findUnique` |
| `src/lib/sankey/queries.ts` | `stageEvent.findMany`, `application.findMany` |
| `src/lib/auth.ts` | `auth()`, `getCurrentUserId()`, `requireUserId()`, registration |
| `src/lib/resume.ts` | `resumeProfile` find/upsert by `userId` |
| `src/app/pipeline/actions.ts` | create, update, stage events |
| `src/app/resume/actions.ts` | via `upsertResumeProfile` |
| `src/app/api/resume/pdf/route.ts` | GET PDF |
| `src/app/pipeline/[id]/page.tsx` | uses `getApplication` |
| `src/app/pipeline/page.tsx` | uses `listApplications` |
| `src/app/pipeline/analytics/page.tsx` | Sankey queries |
| `src/app/resume/page.tsx` | `getResumeProfile` |

## Agent chat guidance

1. Read [PLAN.md](./PLAN.md) and the **single** phase doc for the task.
2. State which phases are already done in the PR/commit history or `PLAN.md` status column.
3. Implement **only** that phase; do not add Stripe in Phase 7, etc.
4. Update the phase **Status** row in `PLAN.md` when complete.
5. Follow [AGENT.md](./AGENT.md) for the standard opening prompt template.
