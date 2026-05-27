# Phase 13 — Resume library (built + upload)

**Status:** Done  
**Depends on:** Phase 9 (recommended) or Phase 8 minimum  
**Blocks:** Phase 14, Phase 10 (public resume should use `Resume`, not legacy `ResumeProfile`)

## Goal

Users manage a **library of resumes**: one or more **built** resumes (structured editor + generated PDF) and **uploaded** files (PDF v1). They can label resumes, set a default, and download either kind. This replaces the single `ResumeProfile` per user.

## Do NOT (this phase)

- Linking a resume to a job application (Phase 14)
- PDF/DOCX parsing into the structured editor
- DOCX upload (PDF only for v1 uploads)
- Public resume sharing `/r/[slug]` (Phase 10)
- Stripe / plan limits on resume count (Phase 11 — optional hook only)
- Pipeline or Sankey changes
- Multiple concurrent built-resume editors beyond what the UI needs for the library list (keep editor UX simple)

## Product rules

| Rule | Detail |
|------|--------|
| Tenancy | Every `Resume` row and blob belongs to `userId`; all reads/writes filter by session user |
| Default | At most one `isDefault` per user; new users may have zero resumes until they create or upload |
| Built vs uploaded | `kind` enum distinguishes structured profile vs stored file |
| Delete account | Cascade delete `Resume` rows and remove blobs from object storage (extend existing delete flow) |

## Schema

Replace `ResumeProfile` with `Resume` (migrate existing data).

```prisma
enum ResumeKind {
  BUILT
  UPLOADED
}

model Resume {
  id        String     @id @default(cuid())
  userId    String
  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  kind      ResumeKind
  label     String     // display name, e.g. "Default", "Staff engineer", "resume-2024.pdf"
  isDefault Boolean    @default(false)

  // BUILT — same shape as current ResumeProfile (nullable when kind = UPLOADED)
  fullName   String?
  email      String?
  phone      String?
  location   String?
  website    String?
  linkedIn   String?
  github     String?
  summary    String?
  skills     String?
  experience Json?
  education  Json?

  // UPLOADED
  fileName   String?
  mimeType   String?
  fileSize   Int?
  storageKey String?   @unique  // provider object key

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
  @@index([userId, isDefault])
}

model User {
  // ...
  resumes Resume[]  // replaces resumeProfile ResumeProfile?
}
```

### Migration

- [ ] Create `ResumeKind` enum and `Resume` table
- [ ] For each existing `ResumeProfile` row: insert `Resume` with `kind = BUILT`, copy fields, `label = "Default"`, `isDefault = true`
- [ ] Drop `ResumeProfile` table
- [ ] Update Prisma client imports/usages across the app

### Default resume invariant

- [ ] Server helper: `setDefaultResume(userId, resumeId)` clears other defaults then sets one
- [ ] On first BUILT save or first UPLOAD, auto-set default if user has none

## Object storage (uploaded files)

**Default:** [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) (fits Vercel deploys). Alternative: S3-compatible (document in README if swapped).

Env vars (add to `.env.example`):

```env
# Phase 13 — resume file uploads
BLOB_READ_WRITE_TOKEN=
```

- [ ] `src/lib/resume-storage.ts` — upload, delete, get buffer/stream by `storageKey`
- [ ] Store keys as `resumes/{userId}/{resumeId}/{sanitizedFileName}` or provider-generated path with `resumeId` in metadata
- [ ] Max file size (e.g. 5 MB) and `application/pdf` only for v1
- [ ] Do not expose raw blob URLs without auth; serve via authenticated API route

## Server / API

- [ ] `src/lib/resume.ts` — refactor: `listResumes`, `getResume`, `getDefaultResume`, `createBuiltResume`, `updateBuiltResume`, `deleteResume`, validation (reuse existing parsers for BUILT fields)
- [ ] `saveResumeProfile` action → `saveBuiltResume(resumeId?)` (create new built resume or update existing)
- [ ] `uploadResume` server action — validate file, write blob, create `UPLOADED` row
- [ ] `deleteResume` server action — delete row + blob if UPLOADED; block or warn if resume is default (reassign default first)
- [ ] `setDefaultResume` server action
- [ ] `renameResume` server action (label only)
- [ ] `GET /api/resume/pdf?resumeId=` — generate PDF for BUILT resume (default: user's default BUILT or explicit id); 404 for UPLOADED kind
- [ ] `GET /api/resume/file/[id]` — stream UPLOADED file; verify `userId` owns resume

## UI — `/resume`

- [ ] Page title/copy: resume **library**, not only builder
- [ ] List all resumes (MUI list/cards): kind icon, label, default chip, updated date
- [ ] Actions per row: Edit (BUILT), Download, Set as default, Rename, Delete
- [ ] Primary CTA: **New built resume** | **Upload PDF**
- [ ] Built editor: works on selected resume id (route query `?id=` or dedicated `/resume/[id]` — pick one and document)
- [ ] Upload: file input + label field; on success refresh list
- [ ] Empty state when no resumes (keep illustration; update copy)
- [ ] `ResumeDownloadButton` — uses selected/default BUILT resume id

## Refactors (grep `ResumeProfile` / `resumeProfile`)

- [ ] `src/app/(app)/resume/page.tsx` and actions
- [ ] `src/app/(app)/dashboard/page.tsx` — onboarding: "create a resume" if `listResumes` empty
- [ ] `src/components/app/OnboardingBanner.tsx`
- [ ] `src/app/(app)/pipeline/page.tsx` (resume exists check — may stay coarse until Phase 14)
- [ ] `src/app/api/resume/pdf/route.ts`
- [ ] `src/components/settings/DeleteAccountButton.tsx` — delete all blobs for user
- [ ] Marketing copy only if it claims "one resume" — optional tweak

## Verification

- [ ] Existing users after migration: one BUILT resume, default set, PDF still downloads
- [ ] Upload PDF → appears in library → download returns same bytes
- [ ] User A cannot download User B's file or PDF by id
- [ ] Delete UPLOADED resume removes blob and DB row
- [ ] Delete account removes all resumes and blobs
- [ ] Two defaults cannot exist (server enforces)

## Done criteria

- [ ] `docs/PLAN.md` Phase 13 → **Done**
- [ ] `.env.example` documents `BLOB_READ_WRITE_TOKEN`
- [ ] README: short "Resume uploads" section (local Blob token)

## Handoff to Phase 14

Resume library is complete; applications still have no `resumeId`. Phase 14 adds per-application selection.
