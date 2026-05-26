# Phase 6 — PostgreSQL migration

**Status:** Done  
**Depends on:** Phases 0–4 (done)  
**Blocks:** Phase 7+

## Goal

Run the app on **PostgreSQL** locally and on Vercel. Remove SQLite adapter and file-based DB from the development path.

## Do NOT (this phase)

- Add `User` / auth tables
- Add `userId` to models
- Change route structure or middleware
- Stripe, landing page, billing

## Tasks

### 1. Prisma schema

- [ ] Change `datasource db` `provider` from `sqlite` to `postgresql`
- [ ] Keep existing models unchanged (`Application`, `StageEvent`, `ResumeProfile`)
- [ ] Confirm enums and `Json` fields are valid for Postgres

### 2. Dependencies

- [ ] Remove `better-sqlite3`, `@prisma/adapter-better-sqlite3`, `@types/better-sqlite3` from `package.json`
- [ ] `npm install`
- [ ] `prisma generate`

### 3. Prisma client (`src/lib/prisma.ts`)

- [ ] Replace adapter-based client with standard `PrismaClient` (see [DATABASE.md](../DATABASE.md))
- [ ] Simplify caching if the proxy was only for SQLite hot-reload; keep dev singleton pattern
- [ ] Update `MODEL_DELEGATES` list if still used

### 4. Migrations

- [ ] On empty Postgres: create migration(s) that match current schema
  - Option A: `prisma migrate dev --name init_postgres` on fresh DB
  - Option B: squash — archive old SQLite migrations in `prisma/migrations-sqlite-archive/` and new folder for Postgres baseline (document in commit)
- [ ] Document that existing `dev.db` data is not auto-migrated

### 5. Environment

- [ ] Update `.env.example` with Postgres `DATABASE_URL` and optional `DIRECT_URL`
- [ ] Update [README.md](../../README.md) local setup (Docker or Neon instructions)
- [ ] Update health route message if it says "SQLite"

### 6. Config

- [ ] `prisma.config.ts` — ensure `url` (and `directUrl` if needed) from env
- [ ] `.gitignore` — keep ignoring `*.db`; no change required

### 7. Vercel

- [ ] Document in README: create Vercel Postgres, set env vars
- [ ] `prisma migrate deploy` in build or documented manual step
- [ ] Deploy staging; verify `/api/health`

### 8. Scripts (optional)

- [ ] Add `"db:migrate:deploy": "prisma migrate deploy"` to `package.json`

## Verification

```bash
# Local
docker start job-finder-db   # or equivalent
npm run db:migrate
npm run dev
curl http://localhost:3000/api/health

# Production build
npm run build
```

- [ ] Create application, log stage, save resume, download PDF — all persist after server restart
- [ ] Redeploy on Vercel does not wipe data

## Done criteria

- [ ] No SQLite references in runtime code or README setup path
- [ ] `docs/PLAN.md` Phase 6 → **Done**
- [ ] `.cursor/rules/project.mdc` mentions PostgreSQL

## Handoff to Phase 7

Postgres is live; schema still has **no** `User` or `userId`. Next: Auth.js + tenant columns.
