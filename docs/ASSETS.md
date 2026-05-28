# UI assets & attribution

## Icons — Material Icons (`@mui/icons-material`)

- **License:** [MIT](https://opensource.org/licenses/MIT)
- **Source:** [MUI Material Icons](https://mui.com/material-ui/material-icons/)
- **Usage:** Navigation, feature cards, dashboard stats, auth pages, empty-state accents

## Illustrations — `public/illustrations/*.svg`

- **License:** Project-owned (created for Job Finder)
- **Usage:** Marketing hero, How it helps feature rows, pipeline/resume empty states
- **Note:** Colors align with the default MUI primary palette (`#1976D2`). They are decorative (`aria-hidden`).

| File | Used in |
|------|---------|
| `hero-job-search.svg` | Marketing hero |
| `feature-pipeline.svg` | How it helps — pipeline row |
| `feature-resume-editor.svg` | How it helps — resume editor row |
| `feature-templates.svg` | Legacy; templates row uses composite + `templates-overlay.svg` |
| `templates-overlay.svg` | Badges and labels over templates composite |
| `hub-workspace-overlay.svg` | Hub — All-in-one workspace panel |
| `hub-resume-builder-overlay.svg` | Hub — Resume builder panel |
| `hub-templates-overlay.svg` | Hub — Templates panel |
| `hub-pdf-overlay.svg` | Hub — PDF export panel |
| `hub-notes-overlay.svg` | Hub — Application notes panel |
| `hub-tracker-overlay.svg` | Hub — Job tracker panel |
| `hub-analytics-overlay.svg` | Hub — Analytics panel |
| `feature-ats.svg` | How it helps — ATS row |
| `empty-pipeline.svg` | Applications / pipeline empty states |
| `empty-resume.svg` | Resume empty state |

## Optional external libraries (not bundled)

If you add more art later, these are common free options:

| Resource | License | Best for |
|----------|---------|----------|
| [unDraw](https://undraw.co/illustrations) | Free for commercial use | Marketing illustrations |
| [Heroicons](https://heroicons.com/) | MIT | Outline icons |
| [Phosphor Icons](https://phosphoricons.com/) | MIT | Flexible icon set |

When importing third-party SVGs, save them under `public/illustrations/` and add a row to this file.
