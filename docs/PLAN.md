# Job Finder — build plan

Personal app to track software job applications (Sankey pipeline) and build a resume with PDF download.

## Phases

| Phase | Status | Scope |
|-------|--------|--------|
| **0** | Done | Next.js shell, nav (`/pipeline`, `/resume`), Prisma + SQLite stub, health check |
| **1** | Pending | `Application` + `StageEvent` models, pipeline CRUD |
| **2** | Pending | Sankey diagram from stage events |
| **3** | Pending | Resume profile editor |
| **4** | Pending | Resume PDF download |
| **5** | Pending | Polish (empty states, mobile, production DB) |

## Default pipeline stages (Phase 1+)

`Saved` → `Applied` → `Recruiter` → `Technical` → `Onsite` → `Offer`

Terminals: `Rejected`, `Withdrawn`, `Accepted`

## Stack

- Next.js (App Router), TypeScript, Tailwind
- Prisma 7 + SQLite (local); migrate to Vercel Postgres or Turso before relying on production data on Vercel

## Routes

- `/` → redirects to `/pipeline`
- `/pipeline` — applications (Phase 1+)
- `/resume` — resume builder (Phase 3–4)
- `/api/health` — DB connectivity check

## Agent chat guidance

Implement **one phase per chat**. Reference this file and state what is already done. Do not build features from future phases.
