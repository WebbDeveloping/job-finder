# RT-2 — Customization panel (theme editor)

**Status:** Done  
**Depends on:** RT-1  
**Blocks:** RT-3

## Goal

Users customize **appearance** within the chosen template: colors, typography (from allowlist), page margins, **section visibility**, and **section order**. Changes persist in `Resume.theme` and apply to PDF export and preview.

## Do NOT (this phase)

- New template layouts (RT-3)
- Drag-and-drop block positioning
- Per-section font sizes or custom CSS
- DOCX export
- Real-time preview on every keystroke in content steps (preview scoped to Design step or debounced)

## Product rules

| Rule | Detail |
|------|--------|
| Scope | Options apply only to `ResumeKind.BUILT` |
| Merge | Saved `theme` merges over template `defaultTheme` (RT-0 `mergeTheme`) |
| Reset | “Reset to template defaults” clears user `theme` (set `null`) |
| Template switch | Changing template (RT-1) may reset or keep theme — document choice; recommend **keep colors, re-validate section order** |

## Customization surface (v1)

| Control | Theme key | Notes |
|---------|-----------|--------|
| Primary / accent color | `primaryColor` | Links, rules |
| Heading color | `headingColor` | Name, section titles |
| Body text | `textColor` | |
| Muted text | `mutedColor` | Dates, contact |
| Heading font | `headingFont` | Allowlist |
| Body font | `bodyFont` | Allowlist |
| Base size | `fontSize` | Slider or preset S/M/L |
| Page margins | `pageMargin` | `compact` \| `normal` \| `relaxed` |
| Section order | `sectionOrder` | Reorder content sections (not header) |
| Hide section | `hiddenSections` | Checkboxes |

## Fonts

- [ ] `src/lib/resume-templates/fonts.ts` — `Font.register` for 2–4 open fonts (e.g. Inter, Lora) + keep Helvetica as default
- [ ] Font files under `public/fonts/` or `src/assets/fonts/` (document license in README)
- [ ] `ALLOWED_RESUME_FONTS` constant; server rejects others

## UI — design panel

### Placement

**Option A:** New stepper step **“Design”** (e.g. after Education, before Review).

**Option B:** Collapsible **Design** panel on Review step + sticky on desktop.

- [ ] Implement one; MUI `ColorPicker` or native `<input type="color">` + hex text field
- [ ] `ResumeDesignPanel.tsx` — controlled props: `templateId`, `theme`, `onChange`
- [ ] Section list: MUI `List` + move up/down or drag handle (`@dnd-kit` only if already in project — else buttons)

### Form submit

- [ ] Serialize `theme` as `themeJson` hidden field (mirror `experienceJson` pattern in `actions.ts`)
- [ ] `parseBuiltFormData` parses and validates theme
- [ ] `updateBuiltResume` / `createBuiltResume` write `theme` column

## Preview (debounced)

Choose one:

- [ ] **A.** `ResumeDesignPreview.tsx` — client `PDFViewer` from `@react-pdf/renderer` with sample or live content (debounce 400ms)
- [ ] **B.** Debounced `fetch(/api/resume/pdf?...)` with draft — only if A is too heavy

- [ ] Preview uses same `ResumePdfDocument` + `mergeTheme` as server
- [ ] Loading and error states (MUI `CircularProgress`, `Alert`)

## PDF templates

- [ ] `ClassicTemplate` and `SidebarTemplate` consume `createPdfStyles(resolved)` only — no raw hex in components
- [ ] `pageMargin` maps to padding constants in `createPdfStyles`
- [ ] `sectionOrder` / `hiddenSections` implemented in both templates

## Server validation

- [ ] `validateResumeTheme(theme, templateId)` — template may restrict options later (RT-3); for RT-2 same rules for all
- [ ] Invalid color → action error message
- [ ] Invalid section id in order → strip or error

## Verification

- [ ] Change primary color → PDF links/rules update
- [ ] Hide Skills → skills absent in PDF for both templates
- [ ] Reorder sections → PDF order matches
- [ ] Reset defaults → matches template out-of-box
- [ ] Save, reload editor → theme restored
- [ ] Preview ≈ downloaded PDF (same component path)
- [ ] `npm run build` passes; client bundle size acceptable

## Done criteria

- [ ] Design step/panel shipped with persistence
- [ ] At least 2 web fonts registered and selectable
- [ ] RT-2 **Done** in README

## Handoff to RT-3

Add more templates and per-template option metadata; polish template-switch UX.
