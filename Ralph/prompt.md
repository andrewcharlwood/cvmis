# Significant Interventions Carousel (Ralph Prompt)

## Goal
Replace the current one-column **Active Projects** list with a **Significant Interventions** carousel that supports thumbnail cards and auto-scroll behavior (Embla-based), while preserving panel-open behavior on card click.

## Scope
- Rename all relevant UI/content references from **Active Projects** to **Significant Interventions**.
- Replace `ProjectsTile` list layout with an Embla carousel.
- Use auto-scroll as the default carousel behavior.
- Keep room for thumbnails now; real thumbnail assets will be added later.

## Implementation Task List

- [ ] Install carousel dependencies:
  - `embla-carousel-react`
  - `embla-carousel-autoplay`
- [ ] Update tile heading in `src/components/tiles/ProjectsTile.tsx`:
  - `ACTIVE PROJECTS` -> `SIGNIFICANT INTERVENTIONS`
- [ ] Refactor `ProjectsTile` in `src/components/tiles/ProjectsTile.tsx`:
  - Replace vertical list container with Embla viewport/container/slides
  - Convert each project item to a carousel slide card
  - Add thumbnail region in each slide (use placeholder block/image container for now)
  - Keep keyboard activation (`Enter`/`Space`) and click-to-open detail panel
- [ ] Implement auto-scroll behavior:
  - Use Embla autoplay plugin with sensible defaults (continuous feel, pauses on hover/focus)
  - Respect reduced motion (`prefers-reduced-motion`) by disabling autoplay
- [ ] Responsive behavior:
  - Mobile: single-card view
  - Tablet/Desktop: multi-card visible area (based on available width)
  - Ensure overflow clipping and smooth transitions
- [ ] Update navigation/search labels to match naming:
  - `src/components/SubNav.tsx`: `Projects` -> `Significant Interventions`
  - `src/lib/search.ts`: `Active Projects` -> `Significant Interventions` (section type and related labels/comments)
- [ ] Keep detail panel integration unchanged:
  - Clicking a carousel card still calls `openPanel({ type: 'project', investigation: project })`
- [ ] Styling pass:
  - Align with current dashboard tokens (`--surface`, `--border-light`, `--accent`, etc.)
  - Ensure cards remain readable without thumbnails

## Acceptance Criteria

- The dashboard section title displays **Significant Interventions**.
- The old one-column projects list is replaced by a working carousel.
- Carousel auto-scrolls by default and pauses appropriately on interaction.
- In reduced-motion environments, carousel does not auto-scroll.
- Clicking or keyboard-activating a card opens the existing project detail panel.
- Layout works on mobile and desktop without overflow bugs.
- Search/navigation language no longer references **Active Projects**.

## Notes for Implementation

- Thumbnail assets are intentionally deferred; implement with placeholders now.
- Keep the component name `ProjectsTile` for this pass to minimize refactor risk; rename component/file in a later cleanup task if desired.
