# Job Finder — build plan

Track job applications (Sankey pipeline) and build a resume with PDF download. Evolving to a **multi-tenant SaaS** (free now, paid later) on **PostgreSQL**.

## Documentation index

| Doc | Purpose |
|-----|---------|
| [SAAS.md](./SAAS.md) | Product direction, Postgres, auth/billing decisions |
| [DATABASE.md](./DATABASE.md) | Postgres setup, migrations, Vercel |
| [AGENT.md](./AGENT.md) | How to run one phase per chat |
| [phases/](./phases/) | Per-phase implementation checklists |
| [resume-templates/](./resume-templates/) | Resume templates & design (RT-0–RT-4) |

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
| **13** | Done | [phase-13-resume-library](./phases/phase-13-resume-library.md) | Resume library: built + PDF upload, default resume |
| **14** | Done | [phase-14-application-resume](./phases/phase-14-application-resume.md) | Select resume per job application |

**Recommended order:** Complete **Phase 13** (and **14** if tracking per job) **before Phase 10** so public sharing uses the `Resume` model instead of legacy `ResumeProfile`.

## Resume templates & design (RT phases)

Separate from main phase numbers. **One RT phase per chat.** See [resume-templates/README.md](./resume-templates/README.md).

| Phase | Status | Doc | Scope |
|-------|--------|-----|--------|
| **RT-0** | Pending | [phase-0-foundation](./resume-templates/phase-0-foundation.md) | Schema, theme tokens, refactor PDF → `classic` + registry |
| **RT-1** | Pending | [phase-1-template-picker](./resume-templates/phase-1-template-picker.md) | Template gallery, second layout (`sidebar`) |
| **RT-2** | Pending | [phase-2-customization-panel](./resume-templates/phase-2-customization-panel.md) | Colors, fonts, margins, section order/visibility |
| **RT-3** | Pending | [phase-3-more-templates-polish](./resume-templates/phase-3-more-templates-polish.md) | More templates, change-template UX |
| **RT-4** | Optional | [phase-4-advanced-optional](./resume-templates/phase-4-advanced-optional.md) | Live preview, photos, public share parity, etc. |

**Order:** RT-0 → RT-1 → RT-2 → RT-3. Prefer completing **RT-0–RT-2** before **Phase 10** public resume so sharing can reuse `templateId` + `theme`.

**Database target:** PostgreSQL only after Phase 6. See [DATABASE.md](./DATABASE.md).

## Default pipeline stages

`Jobs applied to` → `Replies` → `Initial Interview` → `Interview 2` → `Interview 3` → `Task Requested` → `Final Interview` → `Offer received`

Terminals: `Rejection`, `No Reply`, `Replied too late`, `No task requested`, `Rejected by Me`, `Rejected by Company`, `Rejected before offer`, `Accepted`, `Rejected`

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
| `/resume` | Authenticated | Resume library (built + uploads); `?id=` / `?new=built` for editor |
| `/settings` | Authenticated | Profile, delete account |
| `/api/health` | Public | DB check |
| `/api/auth/*` | Public | Auth.js handlers |
| `/api/resume/pdf` | Authenticated | Resume PDF download (BUILT; Phase 13 adds `?resumeId=`) |

### Routes (future SaaS phases)

| Route | Access |
|-------|--------|
| `/resume/[id]` or `/resume?id=` | Authenticated (Phase 13) — edit a specific built resume |
| `/api/resume/file/[id]` | Authenticated (Phase 13) — download uploaded PDF |
| `/settings/billing` | Authenticated (Phase 11) |
| `/r/[slug]` | Public if resume published (Phase 10; targets `Resume`) |

## Agent chat guidance

1. Implement **one phase per chat** — read [AGENT.md](./AGENT.md) and the phase doc in `docs/phases/`.
2. State completed phases at the start of the chat.
3. Do not implement features from future phases.
4. Mark phase **Done** in this table when complete.

### Suggested next chat prompt (Phase 9)

```
Implement Phase 9 per docs/phases/phase-09-polish.md.
Phases 0–8 are done. No new data models or Stripe.
Update docs/PLAN.md Phase 9 status when done.
```

### Suggested chat prompt (Phase 13 — resume library)

```
Implement Phase 13 per docs/phases/phase-13-resume-library.md.
Phases 0–9 done (or note if 9 skipped). No application resume linking (Phase 14).
Update docs/PLAN.md Phase 13 status when done.
```
