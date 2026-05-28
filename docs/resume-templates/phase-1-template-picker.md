# RT-1 — Template picker + second layout

**Status:** Done  
**Depends on:** RT-0  
**Blocks:** RT-2, RT-3

## Goal

Users **choose a template** when creating a built resume (starting point). Ship **two** layouts: `classic` (current) and one distinct alternative (recommended: **`sidebar`** — contact/skills in a left column, experience/education in main column). Persist `templateId` on save.

## Do NOT (this phase)

- Color/font pickers or section reorder UI (RT-2)
- More than two templates (RT-3)
- Client-side live preview (optional static thumbnails only)
- Template change confirmation polish beyond basic alert (RT-3)
- Uploaded PDF template detection

## Product rules

| Rule | Detail |
|------|--------|
| Create flow | New built resume: template selection before or as first step of wizard |
| Edit flow | Editing existing resume keeps saved `templateId`; optional “Change template” entry point OK if minimal |
| Content | Switching template does not delete content fields |
| Theme | New resume gets `theme: null` (template defaults only) until RT-2 |
| Thumbnails | Static images acceptable (pre-rendered PNG/SVG) |

## UI — template gallery

### Components

- [ ] `src/components/resume/ResumeTemplateGallery.tsx`
  - MUI `Grid` / cards: thumbnail, name, short description
  - Selected state (`templateId`)
  - Keyboard accessible (card button or radio group)

### Create page flow

Update `src/app/(app)/resume/create/page.tsx` and/or `ResumeEditorForm`:

**Option A (implemented):** Step 0 **“Template”** before “Basics” in stepper.

**Option B:** Dedicated `/resume/create/template` route then redirect to editor with `?template=`.

- [x] **Option A** — template step in `ResumeEditorForm` stepper; new resumes start at step 0, edits start at Basics (step 1)
- [ ] Pass selected `templateId` into form (hidden input or React state → `templateId` field on save)
- [ ] New resume without explicit pick defaults to `classic`

### Thumbnail assets

- [ ] `public/resume-templates/classic.png` (and `@2x` optional)
- [ ] `public/resume-templates/sidebar.png`
- [ ] Alt text per template; reasonable file size (&lt; 200 KB each)

## Second template — `sidebar`

- [ ] `src/components/resume/pdf/templates/SidebarTemplate.tsx`
- [ ] Register in `RESUME_TEMPLATES` with `defaultTheme` (may differ accent color from classic for visual distinction in gallery)
- [ ] Layout requirements:
  - Left column (~30%): name smaller or stacked, contact, links, skills
  - Right column: summary, experience, education
  - Same section data as classic; respect `hiddenSections` / `sectionOrder` from RT-0 if implemented
- [ ] Page break / `wrap` tested with long experience lists

## Server

- [ ] `saveBuiltResume` / `createBuiltResume` accept `templateId` from form
- [ ] Validate `templateId` against registry keys; fallback `classic`
- [ ] `toResumeFormData` unchanged; ensure create page loads `templateId` when editing

## Editor integration

- [ ] `ResumeEditorForm` — hidden `templateId` or controlled state synced on submit
- [ ] Review step shows selected template name (read-only chip)
- [ ] Optional: link “Change template” → back to step 0 (same session state)

## Library / preview

- [ ] `ResumeLibrary` list optional subtitle: template label (nice-to-have)
- [ ] PDF preview/download uses stored `templateId` automatically (via RT-0 API)

## Verification

- [ ] Create resume with **Classic** → PDF matches RT-0 classic output
- [ ] Create resume with **Sidebar** → visibly different layout; same content fills correctly
- [ ] Edit existing classic resume → still classic after save
- [ ] User A cannot set arbitrary template on User B’s resume (server validation + `userId`)
- [ ] Empty sections hidden in both templates
- [ ] `npm run build` passes

## Done criteria

- [ ] Two templates in registry + gallery on create
- [ ] RT-1 marked **Done** in `docs/resume-templates/README.md`

## Handoff to RT-2

Users can pick layout; RT-2 adds **theme** editing (colors, fonts, section controls) on top of chosen template.
