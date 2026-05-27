# Phase 14 — Resume per job application

**Status:** Pending  
**Depends on:** Phase 13 (`Resume` library)  
**Blocks:** None (Phase 10 public resume does not require this, but complements the product)

## Goal

When creating or editing a job application, the user can **select which resume** they used (built or uploaded), or leave it unset. The application detail view shows the linked resume with a download action.

## Do NOT (this phase)

- New resume types or upload formats
- Analytics ("which resume gets more offers") — future enhancement
- Requiring a resume on every application (optional field)
- Public pipeline or resume exposure
- Bulk-edit resume across many applications
- Auto-suggest resume by job description / AI

## Schema

```prisma
model Application {
  // ...existing fields
  resumeId  String?
  resume    Resume?  @relation(fields: [resumeId], references: [id], onDelete: SetNull)
}

model Resume {
  // ...existing fields
  applications Application[]
}
```

- [ ] Migration: add nullable `resumeId` + FK + index on `Application.resumeId`
- [ ] `onDelete: SetNull` so deleting a resume does not delete applications (history preserved without file)

### Optional snapshot (v1 skip unless needed)

If you want a label after resume delete, add later:

```prisma
resumeLabelSnapshot String?  // set when resumeId cleared on delete
```

Not required for Phase 14 v1.

## Server

- [ ] `createApplication` — read optional `resumeId` from form; validate resume belongs to `userId`
- [ ] `updateApplication` — same; allow clearing (`""` → `null`)
- [ ] `getApplication` / list queries — `include: { resume: true }` where UI needs it
- [ ] Helper: `assertResumeOwnedByUser(resumeId, userId)` used by create/update

### Default on create

- [ ] If form omits `resumeId` and user has a **default** resume (`isDefault`), pre-fill is a **UI** concern only; server may accept explicit id from form
- [ ] Document: server does not auto-assign default unless product chooses — recommended: **client pre-selects** default in create form, user can change

## UI

### Create — `/pipeline/new`

- [ ] `ApplicationForm`: MUI `Select` (or Autocomplete) **Resume used (optional)**
- [ ] Options: "None" + each resume (`label` + kind hint, e.g. "PDF")
- [ ] Default selected: user's `isDefault` resume if any
- [ ] Link: "Manage resumes" → `/resume`

### Edit — `/pipeline/[id]`

- [ ] Same select, bound to `application.resumeId`
- [ ] Show current resume name when set

### Detail — `/pipeline/[id]`

- [ ] Section or inline row: **Resume used** — label + Download button
  - BUILT → link to `/api/resume/pdf?resumeId=...`
  - UPLOADED → link to `/api/resume/file/[id]`
- [ ] If none: "No resume linked" + optional link to attach via edit form

### Pipeline list — `/pipeline` (optional v1)

- [ ] Small secondary line or chip with resume label (skip if crowded on mobile — Phase 9 polish may already constrain layout)
- [ ] If skipped, detail page is sufficient for v1

## Dashboard

- [ ] No required change; optional: show count of applications without a resume (skip for v1)

## Verification

- [ ] Create application with resume A → detail shows A → download works
- [ ] Update application to resume B → persists
- [ ] Clear resume → `resumeId` null
- [ ] Submitting another user's `resumeId` fails safely (not found / forbidden)
- [ ] Delete resume used by application → application remains, `resumeId` null
- [ ] Create with invalid `resumeId` returns clear error

## Done criteria

- [ ] `docs/PLAN.md` Phase 14 → **Done**
- [ ] No remaining references to linking jobs to `ResumeProfile` (only `Resume`)

## Handoff

- **Phase 10:** Add `isPublic`, `publicSlug` on `Resume` (BUILT only for public HTML view; uploaded files stay private unless product decides otherwise)
- **Phase 11:** Optional entitlement: max resumes on free tier — enforce in Phase 13 actions when billing exists
