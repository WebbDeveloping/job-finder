# RT-4 — Advanced (optional stretch)

**Status:** Pending (optional)  
**Depends on:** RT-3  
**Blocks:** None

## Goal

Optional enhancements after the core template + customization system ships. **Do not start** until RT-0–RT-3 are done and product prioritizes these items.

## Candidate scope (pick per chat)

### Live preview everywhere

- [ ] Split editor: content left, debounced PDF preview right (desktop)
- [ ] Performance budget: max one PDF render in flight; cancel on unmount

### Rich blocks

- [ ] Profile photo / logo (`theme` or content field + storage)
- [ ] Custom section titles (e.g. “Technical skills” vs “Skills”)
- [ ] Additional section types: certifications, projects (schema + editor + PDF)

### Export & sharing

- [ ] Phase 10: public `/r/[slug]` HTML view using same `templateId` + `theme`
- [ ] Optional DOCX export (separate library — large effort)

### AI / smart layout

- [ ] Suggest template from industry or pasted JD
- [ ] Auto-hide empty sections

### Layout engine (high cost)

- [ ] Config-driven block tree instead of per-template components
- [ ] Drag-and-drop section blocks in browser

**Recommendation:** Avoid block drag-and-drop unless product commits to leaving `@react-pdf` or accepting PDF/HTML divergence.

## Do NOT (unless explicitly scoped)

- Stripe gating of premium templates without Phase 11 design
- Teams sharing templates across users
- Admin UI to upload template JSON

## Verification (per chosen slice)

- [ ] Define acceptance criteria in the implementing chat before coding
- [ ] `npm run build` passes
- [ ] No regression to RT-0–RT-3 PDF output for default resumes

## Done criteria

- [ ] Scoped slice complete per chat agreement
- [ ] RT-4 or sub-feature noted in README
