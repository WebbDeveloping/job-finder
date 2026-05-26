# Phase 7 — Auth and multi-tenant data

**Status:** Pending  
**Depends on:** Phase 6 (PostgreSQL)  
**Blocks:** Phase 8+

## Goal

Users sign up and sign in. All pipeline, analytics, and resume data is **scoped to the logged-in user**. Unauthenticated users cannot access private routes or APIs.

## Do NOT (this phase)

- Stripe or payment UI
- Marketing landing page (minimal `/login` only is OK)
- Public resume routes (`/r/[slug]`)
- Hard enforcement of plan limits (store `plan` field only)
- Teams / organizations

## Auth stack

- **Auth.js** v5 (`next-auth` / `@auth/prisma-adapter`)
- Session strategy: database sessions (Prisma adapter) or JWT — pick one and document in commit
- Providers (minimum): **Credentials** or **Email** (magic link); optional: Google, GitHub

Env vars (add to `.env.example`):

```env
AUTH_SECRET=          # openssl rand -base64 32
AUTH_URL=http://localhost:3000
# Provider-specific keys as needed
```

## Schema additions

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?
  name          String?
  image         String?
  plan          String    @default("free")  // "free" | "pro" — billing in Phase 11
  stripeCustomerId     String?  @unique
  stripeSubscriptionId String?  @unique
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  sessions      Session[]
  applications  Application[]
  resumeProfile ResumeProfile?
}

// Auth.js Prisma adapter models: Account, Session, VerificationToken
// See https://authjs.dev/getting-started/adapters/prisma
```

**Tenant fields:**

```prisma
model Application {
  // ...existing fields
  userId String
  user   User @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId])
}

model ResumeProfile {
  id     String @id @default(cuid())  // stop using fixed "default" id
  userId String @unique
  user   User   @relation(...)
  // ...existing profile fields
}
```

- [ ] Migration: add tables and `userId`; handle existing rows (dev: delete or assign to first user — document choice)
- [ ] Remove `RESUME_PROFILE_ID = "default"` from `src/lib/resume.ts`

## Middleware

- [ ] `src/middleware.ts` — protect:
  - `/pipeline`, `/pipeline/*`
  - `/resume`, `/resume/*`
  - `/api/resume/pdf` (private PDF)
- [ ] Allow: `/`, `/login`, `/signup`, `/api/auth/*`, `/api/health`
- [ ] Redirect unauthenticated users to `/login?callbackUrl=...`

## Session helper

- [ ] `src/lib/auth.ts` — `auth()`, `getCurrentUserId()`, `requireUser()`
- [ ] Use in Server Actions and server components

## Scope every data access

| File | Change |
|------|--------|
| `src/lib/application.ts` | `where: { userId }` on list/get |
| `src/lib/sankey/queries.ts` | filter events/apps by `userId` |
| `src/lib/resume.ts` | get/upsert by `userId` |
| `src/app/pipeline/actions.ts` | set `userId` on create; verify owner on update/stage |
| `src/app/resume/actions.ts` | ensure upsert uses session user |
| `src/app/api/resume/pdf/route.ts` | require session |
| Pages | rely on scoped libs; detail page 404 if wrong owner |

**Authorization pattern:**

```typescript
const userId = await requireUserId();
const app = await prisma.application.findFirst({
  where: { id, userId },
  include: { stageEvents: true },
});
if (!app) notFound();
```

## UI

- [ ] `/login`, `/signup` (or combined) — MUI forms
- [ ] `AppNav` — Sign out; hide Pipeline/Resume when logged out
- [ ] Root `/` — redirect: session → `/pipeline`, else → `/login` (landing comes Phase 8)

## Auth route handler

- [ ] `src/app/api/auth/[...nextauth]/route.ts` (or Auth.js v5 equivalent path per docs)

## Verification

- [ ] User A cannot open User B's `/pipeline/[id]`
- [ ] User A's Sankey does not include User B's events
- [ ] PDF returns 401 without session
- [ ] Sign up → empty pipeline → create app → persists for that user only

## Done criteria

- [ ] `docs/PLAN.md` Phase 7 → **Done**
- [ ] `.env.example` lists auth vars
- [ ] [SAAS.md](../SAAS.md) file list matches implemented scoping

## Handoff to Phase 8

Auth and isolation work. Next: marketing landing, settings, onboarding UX.
