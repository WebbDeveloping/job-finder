# RT-0 — Foundation (schema, theme, refactor to `classic`)

**Status:** Done  
**Depends on:** Phase 13 (Resume library)  
**Blocks:** RT-1, RT-2, RT-3

## Goal

Introduce **templateId** and **theme** on built resumes, extract shared PDF building blocks, and move today’s single layout into a **`classic`** template behind a registry. No user-facing gallery yet — behavior should match current PDF output when using defaults.

## Do NOT (this phase)

- Template gallery UI or thumbnails
- Second template layout (RT-1)
- Design customization panel (RT-2)
- Client-side live PDF preview
- Changes to `UPLOADED` resume flow
- Public `/r/[slug]` (Phase 10)
- Drag-and-drop layout editor

## Product rules

| Rule | Detail |
|------|--------|
| Tenancy | `templateId` / `theme` only on rows owned by `userId` |
| Defaults | Existing resumes migrate to `templateId = "classic"` and `theme = null` (use template defaults at render time) |
| UPLOADED | Ignore design fields; PDF download uses stored file only |
| Backward compat | Users with no `theme` see same visual as today via `classic` defaults |

## Schema

Add to `Resume` in `prisma/schema.prisma` (BUILT rows use these; nullable OK for UPLOADED):

```prisma
model Resume {
  // ... existing fields ...

  /// Built-resume layout key, e.g. "classic", "sidebar"
  templateId String @default("classic")

  /// User overrides merged onto template defaults (colors, fonts, section order, etc.)
  theme Json?
}
```

### Migration

- [ ] Add columns with defaults; backfill not required if `templateId` default is `classic`
- [ ] `prisma migrate dev` + deploy migration name e.g. `resume_template_theme`

## Types — `ResumeTheme` & design bundle

Create `src/lib/resume-templates/theme.ts` (or `src/lib/resume-types.ts` re-exports):

```ts
export type ResumeSectionId =
  | "summary"
  | "skills"
  | "experience"
  | "education";

export type ResumeTheme = {
  primaryColor?: string;      // links, accents
  headingColor?: string;
  textColor?: string;
  mutedColor?: string;
  headingFont?: string;       // registered font family name
  bodyFont?: string;
  fontSize?: number;          // base pt, 9–12
  pageMargin?: "compact" | "normal" | "relaxed";
  sectionOrder?: ResumeSectionId[];
  hiddenSections?: ResumeSectionId[];
};

export type ResumeDesign = {
  templateId: string;
  theme: ResumeTheme | null;
};
```

- [ ] `DEFAULT_CLASSIC_THEME` constant matching current `ResumePdfDocument.tsx` colors/fonts
- [ ] `mergeTheme(templateDefaults, userTheme | null): ResolvedTheme` — shallow merge; validate enums
- [ ] `createPdfStyles(resolved): StyleSheet` — returns react-pdf styles object (no hardcoded hex in templates)

### Validation

- [ ] `parseResumeTheme(unknown): ResumeTheme | { error }` — hex colors `#RGB`/`#RRGGBB`, allowed fonts, allowed section ids only
- [ ] Reject unknown keys in theme JSON (security / predictable PDF)

## Template registry

Create `src/lib/resume-templates/registry.ts`:

```ts
export type ResumeTemplateDefinition = {
  id: string;
  label: string;
  description: string;
  defaultTheme: ResumeTheme;
  // component wired in resume-pdf layer
};

export const RESUME_TEMPLATES: Record<string, ResumeTemplateDefinition> = {
  classic: { ... },
};

export function getTemplate(id: string): ResumeTemplateDefinition;
export function assertTemplateId(id: string): string; // fallback classic
```

- [ ] Export `DEFAULT_TEMPLATE_ID = "classic"`

## Refactor PDF layout

### Shared blocks

Extract from `ResumePdfDocument.tsx` into `src/components/resume/pdf/blocks/`:

- [ ] `ResumePdfHeader.tsx` — name, contact, links (props: data, styles)
- [ ] `ResumePdfSection.tsx` — titled section wrapper
- [ ] `ResumePdfExperience.tsx` — experience entries + bullets
- [ ] `ResumePdfEducation.tsx` — education entries
- [ ] `ResumePdfSkills.tsx` — skills line
- [ ] Keep formatting helpers in `src/lib/resume-pdf-format.ts`

### Classic template

- [ ] `src/components/resume/pdf/templates/ClassicTemplate.tsx` — same structure as current document
- [ ] `src/components/resume/pdf/ResumePdfDocument.tsx` — thin router:

```tsx
export function ResumePdfDocument({
  data,
  design,
}: {
  data: ResumeProfileFormData;
  design: ResumeDesign;
}) {
  const template = getTemplate(design.templateId);
  const resolved = mergeTheme(template.defaultTheme, design.theme);
  // dispatch to ClassicTemplate, etc.
}
```

- [ ] Section order / `hiddenSections` respected in classic (even if UI can’t edit until RT-2)

### Fonts (minimal)

- [ ] `src/lib/resume-templates/fonts.ts` — document built-in families (`Helvetica`, `Helvetica-Bold`) for v0; stub `registerResumeFonts()` for RT-2 custom fonts

## Data layer

- [ ] Extend `ResumeProfileFormData` **or** pass `ResumeDesign` alongside form data in server actions (prefer separate `ResumeDesign` to keep content form stable)
- [ ] `toResumeDesign(resume: Resume): ResumeDesign`
- [ ] `builtFieldData` / `createBuiltResume` / `updateBuiltResume` persist `templateId` + `theme`
- [ ] `parseBuiltFormData` — optional hidden fields `templateId`, `themeJson` (can be omitted in RT-0 if only defaults saved)

## PDF pipeline

- [ ] `generateResumePdf(data, design: ResumeDesign)` in `src/lib/resume-pdf.tsx`
- [ ] `GET /api/resume/pdf` — load resume, `toResumeFormData` + `toResumeDesign`, pass both to `generateResumePdf`
- [ ] `ResumeDownloadButton` / preview unchanged UX; output should match pre-migration for default resumes

## Verification

- [ ] Migration applies on fresh DB and existing data
- [ ] Default built resume PDF visually matches pre-RT-0 (spot-check: header, section spacing, link color)
- [ ] Invalid `templateId` in DB falls back to `classic` without 500
- [ ] Malformed `theme` JSON rejected on save (once parse wired) or ignored with server log — pick one and document
- [ ] UPLOADED resume PDF route still 404 / file route unchanged
- [ ] `npm run build` passes

## Done criteria

- [ ] README in `docs/resume-templates/` lists RT-0 as **Done** (or note in commit)
- [ ] No user-facing template UI required
- [ ] `grep` shows no duplicate hardcoded `#1565c0` outside theme defaults / `createPdfStyles`

## Handoff to RT-1

Foundation supports `templateId` + registry; RT-1 adds gallery UI and a second template component registered in the same registry.
