# Phase 15 — Cover letter library + editor + PDF

**Status:** Done  
**Depends on:** Phase 7 (auth/tenancy), Phase 8 (app shell)  
**Blocks:** Phase 16 (link cover letter per application)

## Goal

Users manage a **library of cover letters**: structured editor fields, PDF download, rename/duplicate/delete. Mirrors the resume library pattern without uploads or template gallery.

## Do NOT (this phase)

- `Application.coverLetterId` or application form changes (Phase 16)
- Upload storage / blob fields
- AI, merge-field wizard, version history
- Matching resume `templateId` / `theme`
- Copy plain text to clipboard

## Product rules

| Rule | Detail |
|------|--------|
| Tenancy | Every `CoverLetter` row belongs to `userId`; all reads/writes filter by session user |
| Required fields | `label`, `fullName`, `email`, `body` |
| Delete account | Cascade delete `CoverLetter` rows via User `onDelete: Cascade` |

## Schema

See `CoverLetter` model in `prisma/schema.prisma`.

## Routes

| Route | Purpose |
|-------|---------|
| `/cover-letters` | Library list |
| `/cover-letters/create` | Create; `?id=` edit; `?applicationId=` seed company (optional) |
| `/api/cover-letter/pdf` | PDF download (`?coverLetterId=`) |

## Verification

- [ ] Create → save → library → edit → duplicate → delete
- [ ] PDF download works; 401/404 for other users
- [ ] `npm run build` passes

## Done criteria

- [ ] `docs/PLAN.md` Phase 15 → **Done**
