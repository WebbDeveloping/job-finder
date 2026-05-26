# Agent implementation playbook

Use this when starting a **new chat** to implement one SaaS phase.

## Before you code

1. Read [PLAN.md](./PLAN.md) — confirm phase status.
2. Read [SAAS.md](./SAAS.md) — product rules (Postgres, auth, no scope creep).
3. Read the **phase doc** under `docs/phases/` for that phase only.
4. If the phase touches the DB, read [DATABASE.md](./DATABASE.md).

## Opening prompt template

Copy and fill in for the implementing chat:

```
Implement Phase {N} for Job Finder per docs/phases/phase-{NN}-*.md.

Context:
- Phases 0–{N-1} status: {list done phases}
- Database: PostgreSQL per docs/DATABASE.md (Phase 6+)
- Stack: Next.js 16 App Router, MUI only, Prisma 7, src/lib/prisma.ts

Rules:
- One phase only; do not implement future phases
- Update docs/PLAN.md phase status when done
- Match existing code style; minimal diff
- Every tenant query must filter by userId after Phase 7

Do NOT: {phase-specific exclusions from phase doc}
```

## Phase-specific exclusions (quick reference)

| Phase | Do NOT |
|-------|--------|
| 6 | Add auth, User model, Stripe, or public routes |
| 7 | Add Stripe, landing page, public resume, or hard usage limits |
| 8 | Add Stripe Checkout; optional soft `plan` field only |
| 9 | Add billing or new features |
| 10 | Make pipeline or Sankey public |
| 11 | Add teams/workspaces or enterprise SSO |
| 12 | Large feature work — ops and compliance only |

## Definition of done (every phase)

- [ ] Scope in phase doc is complete
- [ ] `npm run build` passes
- [ ] `npm run lint` passes (if configured)
- [ ] `docs/PLAN.md` status updated for this phase
- [ ] README or `.env.example` updated if env vars changed
- [ ] No secrets committed

## Conventions (unchanged)

- UI: **MUI only** — no Tailwind
- DB access: only via `src/lib/prisma.ts`
- Import client from `@/generated/prisma/client`
- Server Actions for mutations where the app already uses them
- See `.cursor/rules/project.mdc`

## Postgres reminder

Phases 7+ assume **PostgreSQL** is in place (Phase 6 complete).
