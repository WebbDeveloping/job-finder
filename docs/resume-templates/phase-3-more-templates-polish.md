# RT-3 — More templates & polish

**Status:** Done  
**Depends on:** RT-2  
**Blocks:** RT-4 (optional)

## Goal

Expand the template library, refine **template switching** and gallery UX, and add **per-template capabilities** so the design panel only shows relevant controls.

## Do NOT (this phase)

- Free-form drag-and-drop layout (RT-4 / out of scope)
- Public resume page (Phase 10) unless explicitly paired in same chat
- Billing limits on template count (Phase 11)
- PDF parsing / import

## Product rules

| Rule | Detail |
|------|--------|
| Minimum | Ship **at least one** additional template beyond RT-1 pair (3+ total) |
| Switch template | Confirm dialog: “Layout will change; your content is kept.” |
| Theme on switch | Product choice: (a) keep merged theme, (b) reset theme to new template defaults — implement (a) unless UX testing says otherwise |
| Incompatible options | Strip invalid `theme` keys when switching templates |

## Per-template metadata

Extend registry:

```ts
export type ResumeTemplateDefinition = {
  id: string;
  label: string;
  description: string;
  defaultTheme: ResumeTheme;
  thumbnailSrc: string;
  supportedOptions?: {
    sectionOrder?: boolean;
    pageMargin?: boolean;
    sidebarWidth?: boolean; // sidebar template only
  };
};
```

- [x] Design panel reads `supportedOptions` to show/hide controls
- [x] `sidebar` may expose `sidebarWidth: "narrow" | "normal"` in theme (optional)

## New templates (pick 1–2 for this phase)

Examples (implement at least one):

| id | Description |
|----|-------------|
| `minimal` | Centered name, underline section headers, no sidebar |
| `accent-bar` | Colored top bar or left stripe using `primaryColor` |
| `compact` | Tighter spacing, smaller base font — good for long CVs |

- [x] Component under `src/components/resume/pdf/templates/`
- [x] Thumbnail in `public/resume-templates/`
- [x] Registry entry + QA PDF with long content

## Gallery polish

- [x] Filter or category tags (e.g. “Traditional”, “Modern”) — optional
- [x] “Popular” / default badge on `classic`
- [x] Edit flow: **Change template** opens gallery modal without losing draft content (client state) or navigates with save prompt
- [x] Responsive grid on mobile

## Library & applications

- [x] Resume library card shows template name + small thumbnail
- [x] Application resume picker (Phase 14) unchanged functionally; optional template hint in subtitle

## Duplicate resume (optional)

- [x] Action: **Duplicate** built resume — copy content + design, new `id`, label suffix “(copy)”

## Verification

- [x] 3+ templates render without runtime errors
- [x] Switch template on saved resume updates `templateId` and PDF
- [x] Theme options hidden when not supported by template
- [x] Long resume (10+ jobs) paginates acceptably in each new template
- [x] All templates respect `hiddenSections`
- [x] `npm run build` passes

## Done criteria

- [x] Template count ≥ 3
- [x] Change-template UX with confirmation
- [x] RT-3 **Done** in README

## Handoff to RT-4 / Phase 10

RT-4 covers stretch features. Phase 10 public resume should read `templateId` + `theme` and reuse registry (HTML renderer or PDF embed) — note dependency in Phase 10 doc when starting that work.
