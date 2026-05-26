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
| **7** | Pending | [phase-07-auth-tenancy](./phases/phase-07-auth-tenancy.md) | Auth.js, `userId` on all tenant data |
| **8** | Pending | [phase-08-saas-shell](./phases/phase-08-saas-shell.md) | Landing, settings, onboarding, delete account |
| **9** | Pending | [phase-09-polish](./phases/phase-09-polish.md) | Mobile, empty states, a11y, SEO |
| **10** | Pending | [phase-10-public](./phases/phase-10-public.md) | Privacy/terms, opt-in public resume `/r/[slug]` |
| **11** | Pending | [phase-11-billing](./phases/phase-11-billing.md) | Stripe Free / Pro |
| **12** | Pending | [phase-12-hardening](./phases/phase-12-hardening.md) | Sentry, email, backups, admin, export |

**Database target:** PostgreSQL only after Phase 6. See [DATABASE.md](./DATABASE.md).

## Default pipeline stages

`Saved` → `Applied` → `Recruiter` → `Technical` → `Onsite` → `Offer`

Terminals: `Rejected`, `Withdrawn`, `Accepted`

## Stack

- Next.js (App Router), TypeScript, MUI — no Tailwind
- Prisma 7 + **PostgreSQL** (after Phase 6)
- Auth.js + Prisma adapter (Phase 7+)
- Stripe (Phase 11+)

## Routes (current — pre–Phase 7)

| Route | Access | Notes |
|-------|--------|--------|
| `/` | Public | Redirects to `/pipeline` today; landing in Phase 8 |
| `/pipeline` | Open | → auth required Phase 7 |
| `/pipeline/analytics` | Open | Sankey |
| `/pipeline/new` | Open | Create application |
| `/pipeline/[id]` | Open | Detail + stage history |
| `/resume` | Open | Resume builder |
| `/api/health` | Public | DB check |
| `/api/resume/pdf` | Open | → auth required Phase 7 |

### Routes (target — after SaaS phases)

| Route | Access |
|-------|--------|
| `/` | Public landing |
| `/login`, `/signup` | Public |
| `/privacy`, `/terms` | Public |
| `/pipeline`, `/resume`, `/settings` | Authenticated |
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
