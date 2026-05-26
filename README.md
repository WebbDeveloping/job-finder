# Job Finder

Track job applications with a pipeline Sankey diagram and build a resume with PDF download.

## Local setup

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — home redirects to `/pipeline`.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:migrate` | Run migrations (dev) |
| `npm run db:studio` | Open Prisma Studio |

### Health check

`GET /api/health` — returns `{ ok: true, db: "connected" }` when SQLite is reachable.

## Routes

- `/pipeline` — job application pipeline (Phase 1+)
- `/resume` — resume builder (Phase 3–4)

See [docs/PLAN.md](docs/PLAN.md) for the full phased roadmap.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com/new).
3. Set `DATABASE_URL` in project settings when you add models (Phase 1+).

**Note:** SQLite on the filesystem does not persist on Vercel serverless. Phase 0 deploys as a shell; before storing real data in production, switch to [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) or [Turso](https://turso.tech/).

Build command: `npm run build` (runs `prisma generate` via `postinstall`).

## Tech

- Next.js 16, React 19, Tailwind CSS 4
- Prisma 7 + SQLite (`better-sqlite3` adapter)
