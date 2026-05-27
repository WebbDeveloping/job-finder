# Job Finder — build plan

Track job applications (Sankey pipeline) and build a resume with PDF download. Evolving to a **multi-tenant SaaS** (free now, paid later) on **PostgreSQL**.

## Documentation index

| Doc | Purpose |
|-----|---------|
| [SAAS.md](./SAAS.md) | Product direction, Postgres, auth/billing decisions |
| [DATABASE.md](./DATABASE.md) | Postgres setup, migrations, Vercel |
| [AGENT.md](./AGENT.md) | How to run one phase per chat |
| [phases/](./phases/) | Per-phase implementation checklists |

## Phases — core product (done)

| Phase | Status | Scope |
|-------|--------|--------|
| **0** | Done | Next.js shell, nav, Prisma + SQLite stub, health check |
| **1** | Done | `Application` + `StageEvent`, pipeline CRUD |
| **2** | Done | Sankey diagram |
| **3** | Done | Resume profile editor |
| **4** | Done | Resume PDF download |
| **5** | Merged → **9** | Polish was split; see Phase 9 |

## Phases — SaaS (pending)

| Phase | Status | Doc | Scope |
|-------|--------|-----|--------|
| **6** | Done | [phase-06-postgres](./phases/phase-06-postgres.md) | Migrate to **PostgreSQL**; remove SQLite adapter |
| **7** | Done | [phase-07-auth-tenancy](./phases/phase-07-auth-tenancy.md) | Auth.js, `userId` on all tenant data |
| **8** | Done | [phase-08-saas-shell](./phases/phase-08-saas-shell.md) | Landing, settings, onboarding, delete account |
| **9** | Pending | [phase-09-polish](./phases/phase-09-polish.md) | Mobile, empty states, a11y, SEO |
| **10** | Pending | [phase-10-public](./phases/phase-10-public.md) | Privacy/terms, opt-in public resume `/r/[slug]` |
| **11** | Pending | [phase-11-billing](./phases/phase-11-billing.md) | Stripe Free / Pro |
| **12** | Pending | [phase-12-hardening](./phases/phase-12-hardening.md) | Sentry, email, backups, admin, export |

**Database target:** PostgreSQL only after Phase 6. See [DATABASE.md](./DATABASE.md).

## Default pipeline stages

`Wishlist` → `Applied` → `Recruiter` → `TakeHome` → `Technical` → `Onsite` → `Offer`

Terminals: `Rejected`, `Withdrawn`, `Accepted`

## Stack

- Next.js (App Router), TypeScript, MUI — no Tailwind
- Prisma 7 + **PostgreSQL** (after Phase 6)
- Auth.js + Prisma adapter (Phase 7+)
- Stripe (Phase 11+)

## Routes (current — after Phase 8)

| Route | Access | Notes |
|-------|--------|--------|
| `/` | Public | Marketing landing; signed-in → `/dashboard` |
| `/privacy`, `/terms` | Public | Placeholder legal pages |
| `/login`, `/signup` | Public | Credentials auth |
| `/dashboard` | Authenticated | Overview + quick actions |
| `/pipeline` | Authenticated | List applications |
| `/pipeline/analytics` | Authenticated | Sankey |
| `/pipeline/new` | Authenticated | Create application |
| `/pipeline/[id]` | Authenticated | Detail + stage history (owner only) |
| `/resume` | Authenticated | Resume builder |
| `/settings` | Authenticated | Profile, delete account |
| `/api/health` | Public | DB check |
| `/api/auth/*` | Public | Auth.js handlers |
| `/api/resume/pdf` | Authenticated | Resume PDF download |

### Routes (future SaaS phases)

| Route | Access |
|-------|--------|
| `/settings/billing` | Authenticated (Phase 11) |
| `/r/[slug]` | Public if resume published (Phase 10) |

## Agent chat guidance

1. Implement **one phase per chat** — read [AGENT.md](./AGENT.md) and the phase doc in `docs/phases/`.
2. State completed phases at the start of the chat.
3. Do not implement features from future phases.
4. Mark phase **Done** in this table when complete.

### Suggested next chat prompt (Phase 7)

```
Implement Phase 7 per docs/phases/phase-07-auth-tenancy.md.
PostgreSQL is live (Phase 6 done). No Stripe.
Update docs/PLAN.md Phase 7 status when done.
```
