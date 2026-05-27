# Job Finder

Track job applications with a pipeline Sankey diagram and build a resume with PDF download. Roadmap: **multi-tenant SaaS** on PostgreSQL (free tier now, Stripe Pro later).

## Documentation

| Doc | Description |
|-----|-------------|
| [docs/PLAN.md](docs/PLAN.md) | Master phase list and route map |
| [docs/SAAS.md](docs/SAAS.md) | SaaS direction, Postgres, auth/billing decisions |
| [docs/DATABASE.md](docs/DATABASE.md) | **Prisma Postgres** setup (Vercel + local) |
| [docs/AGENT.md](docs/AGENT.md) | One-phase-per-chat playbook |
| [docs/phases/](docs/phases/) | Checklists for phases 6–12 |
| [docs/ASSETS.md](docs/ASSETS.md) | Icons & illustration licenses |

**Next implementation step:** [Phase 9 — Polish](docs/phases/phase-09-polish.md)

## Local setup (Prisma Postgres)

Uses the same database as Vercel (no Docker required). Full steps: [docs/DATABASE.md](docs/DATABASE.md).

### 1. Vercel + Prisma Postgres

1. Vercel project → **Storage** → **Create Database** → **Prisma Postgres**.
2. **Storage** → your DB → **Connect** → select this project (`DATABASE_URL` is set automatically).
3. [Prisma Console](https://console.prisma.io/) → copy **direct** URL → add as `DIRECT_URL` in Vercel env vars.

### 2. Local `.env`

```bash
cp .env.example .env
```

Paste `DATABASE_URL` and `DIRECT_URL` from Vercel / Prisma Console into `.env`.

### 3. App

```bash
npm install
npm run db:migrate:deploy   # once: create tables
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Health: `GET /api/health`.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:migrate` | Create migrations locally (`migrate dev`) |
| `npm run db:migrate:deploy` | Apply migrations (prod / first setup) |
| `npm run db:studio` | Open Prisma Studio |

## Routes

- `/` — marketing landing (public)
- `/login`, `/signup` — account access
- `/privacy`, `/terms` — legal placeholders
- `/dashboard` — signed-in home overview
- `/pipeline` — job application pipeline
- `/pipeline/analytics` — Sankey flow
- `/resume` — resume library (built resumes + PDF uploads)
- `/settings` — profile and account

Full route map: [docs/PLAN.md](docs/PLAN.md).

## Auth rate limiting (production)

Protect `/api/auth/*` on Vercel with **Firewall** rules or an edge rate limiter (e.g. Upstash). A simple starting point: limit sign-in/sign-up POSTs per IP in the Vercel dashboard under **Security → Firewall**.

## Deploy to Vercel

1. Push to GitHub and import on [Vercel](https://vercel.com/new).
2. **Storage** → **Prisma Postgres** → **Connect** to the project.
3. Set `DIRECT_URL` (direct connection from Prisma Console) if not present.
4. Run migrations once locally: `npm run db:migrate:deploy` (or add `prisma migrate deploy &&` to the build script).
5. Redeploy and check `GET /api/health`.

`prisma generate` runs via `postinstall`.

## Resume uploads (Vercel Blob)

Uploaded PDFs use [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) with a private store.

1. In the Vercel project, open **Storage** → create or connect a **Blob** store.
2. Copy the `BLOB_READ_WRITE_TOKEN` into Vercel env vars and local `.env`.
3. Restart `npm run dev` after setting the token.

Without the token, built resumes still work; PDF upload fails with a clear error.

## Tech

- Next.js 16, React 19, MUI (Material UI)
- Prisma 7 + **Prisma Postgres** (`@prisma/adapter-pg`)
- SaaS phases: Auth.js (7), Stripe (11) — see [docs/SAAS.md](docs/SAAS.md)
