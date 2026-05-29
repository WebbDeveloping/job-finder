# Phase 16 — Cover letter per job application

**Status:** Done  
**Depends on:** Phase 15 (`CoverLetter` library)  
**Blocks:** None

## Goal

When creating or editing a job application, the user can **select which cover letter** they used (optional). The application detail view shows the linked letter with a download action.

## Do NOT (this phase)

- Require a cover letter on every application
- Analytics, bulk assign, AI suggest
- Auto-link on save (optional; user links via form select)

## Schema

```prisma
model Application {
  coverLetterId String?
  coverLetter   CoverLetter? @relation(..., onDelete: SetNull)
}
```

## UI

- Application form: **Cover letter (optional)** select + manage link
- Application detail: **Cover letter** section with download
- Empty state links to `/cover-letters/create?applicationId={id}`

## Verification

- [ ] Link on create/edit → detail shows download
- [ ] Clear selection → `coverLetterId` null
- [ ] Delete cover letter → application remains, FK null
- [ ] Cross-tenant `coverLetterId` rejected

## Done criteria

- [ ] `docs/PLAN.md` Phase 16 → **Done**
