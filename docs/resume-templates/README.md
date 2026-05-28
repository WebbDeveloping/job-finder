# Resume templates & design system

Multi-phase feature: **template selection** (starting layouts) + **per-resume customization** (colors, fonts, section order, visibility). Built resumes only (`ResumeKind.BUILT`); uploaded PDFs are unchanged.

**Approach:** Option A — multiple `@react-pdf/renderer` layout components + shared content blocks + JSON **theme** tokens merged with per-template defaults.

**Depends on:** [Phase 13 — Resume library](../phases/phase-13-resume-library.md) (done)

**Blocks:** [Phase 10 — Public resume](../phases/phase-10-public.md) should reuse `templateId` + `theme` when public HTML/PDF sharing ships.

## Phases (implement one per chat)

| Phase | File | Scope |
|-------|------|--------|
| **RT-0** | [phase-0-foundation.md](./phase-0-foundation.md) | **Done** — Schema, types, theme tokens, refactor current PDF → `classic` template, registry, API |
| **RT-1** | [phase-1-template-picker.md](./phase-1-template-picker.md) | **Done** — Template gallery on create, second layout, thumbnails, persistence |
| **RT-2** | [phase-2-customization-panel.md](./phase-2-customization-panel.md) | **Done** — Design step: colors, fonts, margins, section toggles & order, validation |
| **RT-3** | [phase-3-more-templates-polish.md](./phase-3-more-templates-polish.md) | **Done** — Additional templates, per-template options, template switch UX |
| **RT-4** | [phase-4-advanced-optional.md](./phase-4-advanced-optional.md) | Stretch: live preview tuning, photos, public share parity, etc. |

**Order:** RT-0 → RT-1 → RT-2 → RT-3. RT-4 only when product needs it.

```text
RT-0 Foundation ──► RT-1 Picker + 2 templates ──► RT-2 Customization ──► RT-3 Polish
                                                      │
                                                      └──► RT-4 (optional)
```

## Architecture (reference)

```text
Content (ResumeProfileFormData)
        │
        ├── templateId ──► Template registry ──► Pdf layout component
        │
        └── theme (JSON) ──► merge(template.defaults, user overrides) ──► createStyles()
                                        │
                                        ▼
                              generateResumePdf(data, design)
```

| Concern | Location (target) |
|---------|-------------------|
| Template registry | `src/lib/resume-templates/registry.ts` |
| Theme types & merge | `src/lib/resume-templates/theme.ts` |
| Shared PDF blocks | `src/components/resume/pdf/blocks/` |
| Per-template layouts | `src/components/resume/pdf/templates/` |
| Font registration | `src/lib/resume-templates/fonts.ts` |
| Thumbnail assets | `public/resume-templates/` |

## Current codebase (pre-feature)

| Piece | Path |
|-------|------|
| PDF router + classic template | `src/components/resume/pdf/ResumePdfDocument.tsx`, `pdf/templates/ClassicTemplate.tsx` |
| Shared PDF blocks | `src/components/resume/pdf/blocks/` |
| Template registry & theme | `src/lib/resume-templates/` |
| PDF generation | `src/lib/resume-pdf.tsx` |
| Content types | `src/lib/resume-types.ts`, `src/lib/resume-design.ts` |
| CRUD / parse | `src/lib/resume.ts`, `src/app/(app)/resume/actions.ts` |
| PDF API | `src/app/api/resume/pdf/route.ts` |
| Editor | `src/components/resume/ResumeEditorForm.tsx` |
| Create page | `src/app/(app)/resume/create/page.tsx` |

## Opening prompt template

```
Implement Resume Templates phase RT-{N} for Job Finder per docs/resume-templates/phase-{N}-*.md.

Context:
- Phases RT-0..RT-{N-1}: {status}
- Resume library (Phase 13) is done; BUILT resumes use Resume model + @react-pdf
- Stack: Next.js 16 App Router, MUI only, Prisma 7, PostgreSQL

Rules:
- One RT phase only; do not implement future RT phases
- Match existing resume code style; minimal diff outside scope
- Every tenant query filters by userId
- UPLOADED resumes: no template/theme fields

Do NOT: {copy "Do NOT" section from the phase doc}
```

## Master plan index

[../PLAN.md](../PLAN.md) · [../phases/](../phases/) · [../AGENT.md](../AGENT.md)
