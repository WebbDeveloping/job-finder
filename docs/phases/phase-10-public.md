# Phase 10 — Public surface and optional resume sharing

**Status:** Pending  
**Depends on:** Phase 9 (or Phase 8 if skipping polish temporarily — not recommended); **Phase 13** (`Resume` model — do not implement against `ResumeProfile`)  
**Blocks:** Phase 11 (billing can parallelize after 9 if 10 skipped)

## Goal

Public marketing and legal pages are complete. Users may **opt in** to a public resume link. **Pipeline and job data stay private.**

## Do NOT (this phase)

- Public pipeline, application list, or Sankey
- Stripe
- Exposing email/phone on public resume by default

## Public routes (no auth)

| Route | Purpose |
|-------|---------|
| `/` | Landing (if not done in Phase 8, finalize here) |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/login`, `/signup` | Auth entry |

## Optional public resume

Public sharing applies to **BUILT** resumes only (structured HTML view + optional PDF). **Uploaded** PDF files stay private unless product explicitly changes that later.

### Schema

Add to `Resume` (from Phase 13):

```prisma
model Resume {
  // ...existing Phase 13 fields
  isPublic    Boolean   @default(false)
  publicSlug  String?   @unique  // e.g. nanoid; unguessable
  publishedAt DateTime?
  showEmailOnPublic Boolean @default(false)
  showPhoneOnPublic Boolean @default(false)
}
```

- [ ] Migration for new fields
- [ ] Generate unique `publicSlug` on publish (collision-safe)

### Settings UI

- [ ] Toggle "Publish resume"
- [ ] Copy public URL button
- [ ] Unpublish clears or retains slug per product choice (document behavior)
- [ ] Warning: what fields are visible

### Public pages

- [ ] `GET /r/[slug]` — server component; read-only resume view (MUI, print-friendly)
- [ ] `GET /api/public/resume/[slug]/pdf` — only if `isPublic === true`; rate limit

### Field visibility (default safe)

Public view includes: name, summary, skills, experience, education, website, LinkedIn, GitHub  
Hidden unless user opts in per field (Phase 10 minimum: hide **email** and **phone**):

- [ ] `showEmailOnPublic`, `showPhoneOnPublic` booleans OR fixed hide for v1

## Security

- [ ] No session required for `/r/[slug]` but slug must be unguessable (cuid/nanoid)
- [ ] 404 for unpublished or wrong slug
- [ ] Do not leak user id in HTML

## Verification

- [ ] Unpublished resume → `/r/slug` 404
- [ ] User A's slug does not show User B's data
- [ ] Private PDF route still requires login; public PDF only via public API

## Done criteria

- [ ] `docs/PLAN.md` Phase 10 → **Done**

## Handoff to Phase 11

Monetization: Stripe and plan enforcement.
