# PostgreSQL — setup and operations

Job Finder uses **Prisma Postgres** on Vercel (pooled `DATABASE_URL` + direct `DIRECT_URL` for migrations). Local dev can use the same URLs as production.

Official guide: [Prisma Postgres on Vercel](https://www.prisma.io/docs/guides/postgres/vercel)

## Connection URLs

| Variable | Used by | Purpose |
|----------|---------|---------|
| `DATABASE_URL` | App runtime (`src/lib/prisma.ts`) | Pooled connection (`pooled.db.prisma.io`) |
| `DIRECT_URL` | Prisma CLI (`prisma.config.ts`) | Direct connection (`db.prisma.io`) for `migrate`, `studio` |

Example (from Prisma Console):

```env
DATABASE_URL="postgres://USER:PASSWORD@pooled.db.prisma.io:5432/postgres?sslmode=require"
DIRECT_URL="postgres://USER:PASSWORD@db.prisma.io:5432/postgres?sslmode=require"
```

## Prisma Postgres on Vercel (setup)

### 1. Create the database

1. Vercel project → **Storage** → **Create Database**.
2. Choose **Prisma Postgres** → **Continue**.
3. Pick **region** and **pricing plan** → **Continue**.
4. Name it (e.g. `job-finder`) → **Create**.

### 2. Connect to your app

1. **Storage** → select the database → **Connect**.
2. Choose your **job-finder** Vercel project.
3. Vercel sets **`DATABASE_URL`** automatically (pooled).

### 3. Add `DIRECT_URL` (for migrations)

Vercel usually only injects the pooled URL. For `prisma migrate` / `studio`:

1. Open [Prisma Console](https://console.prisma.io/) → your database.
2. Copy the **direct** connection string (`db.prisma.io`, not `pooled.db.prisma.io`).
3. Vercel → **Settings** → **Environment Variables** → add:
   - Key: `DIRECT_URL`
   - Value: direct connection string
   - Environments: Production (and Preview if you use previews)

### 4. Local `.env`

Copy the same values into `.env` (never commit):

```bash
cp .env.example .env
# Paste DATABASE_URL and DIRECT_URL from Vercel / Prisma Console
```

### 5. Create tables (once)

```bash
npm run db:migrate:deploy
```

### 6. Run the app

```bash
npm run dev
curl http://localhost:3000/api/health
# → {"ok":true,"db":"connected"}
```

Restart dev after changing `.env`.

### 7. Deploy

Redeploy after env vars are set. Optionally run migrations on each deploy:

```json
"build": "prisma migrate deploy && next build"
```

Verify production: `https://<your-app>.vercel.app/api/health`

## Prisma configuration

**`prisma/schema.prisma`**

```prisma
datasource db {
  provider = "postgresql"
}
```

**`src/lib/prisma.ts`** — runtime uses pooled `DATABASE_URL`:

```typescript
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

**`prisma.config.ts`** — CLI prefers `DIRECT_URL`:

```typescript
datasource: {
  url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
},
```

## Migrations

| Command | When |
|---------|------|
| `npm run db:migrate` | Local only: create new migrations (`prisma migrate dev`) — avoid on shared prod DB |
| `npm run db:migrate:deploy` | Apply pending migrations (prod, first setup, CI) |
| `npm run db:generate` | After schema changes |
| `npm run db:studio` | Inspect data (uses `DIRECT_URL` via config) |

## Local Postgres (Docker) — optional

Only if you want a separate local database instead of sharing Prisma Postgres:

```bash
docker run --name job-finder-db \
  -e POSTGRES_USER=jobfinder \
  -e POSTGRES_PASSWORD=jobfinder \
  -e POSTGRES_DB=jobfinder \
  -p 5432:5432 \
  -d postgres:16
```

Use the same `DATABASE_URL` / `DIRECT_URL` pattern with `localhost:5432`.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `ECONNREFUSED` | `.env` still points at `localhost` — paste Prisma Postgres URLs and restart dev |
| `relation "Application" does not exist` | Run `npm run db:migrate:deploy` |
| Migration errors / pooler issues | Ensure `DIRECT_URL` uses `db.prisma.io`, not `pooled.db.prisma.io` |
| `DATABASE_URL is not set` | Add env var in Vercel and local `.env` |
| SSL errors | Connection string must include `sslmode=require` |

## Related docs

- Phase 6: [phases/phase-06-postgres.md](./phases/phase-06-postgres.md)
- Phase 7: [phases/phase-07-auth-tenancy.md](./phases/phase-07-auth-tenancy.md)
