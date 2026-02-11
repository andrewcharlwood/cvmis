# Reference: Interactions, Responsive Design, and Accessibility

> Extracted from goal.md — Interactions, Responsive Strategy, and Accessibility sections.

---

## Interactions and Micro-interactions

### Sidebar Navigation
- Clicking a sidebar item instantly swaps the main content area. No crossfade, no transition — just an immediate swap. This matches clinical system behavior exactly: navigation is instant.
- The active sidebar item updates its left border (3px, NHS blue) and background tint simultaneously, with no animation (instant state change).

### Consultation Expand / Collapse
- Clicking a consultation entry toggles between collapsed and expanded states.
- The expand animation: height grows from 0 to content height over 200ms, ease-out. Content opacity transitions from 0 to 1 over the same duration.
- Only one consultation can be expanded at a time. Expanding a new entry collapses the previous one.
- The expand chevron rotates 180 degrees (pointing up when expanded).

### Medication Row Hover
- Hovering a medication table row changes its background to `#EFF6FF` (subtle blue tint).
- No transform, no elevation change. Just color.

### Table Column Sorting
- Clicking a table column header sorts by that column. An arrow indicator (up/down) appears in the header.
- Clicking the same header again reverses sort direction.
- Sorting is instant (no animation on row reordering).

### Patient Banner Scroll Condensation
- As the user scrolls past 100px of content, the patient banner smoothly transitions from full (80px) to condensed (48px) over 200ms.
- The condensed banner shows only: name, NHS number, status dot, and action buttons.
- Scrolling back to top restores the full banner.
- Uses `position: sticky` with an `IntersectionObserver` to trigger the condensation.

### Alert Acknowledge
- Clicking "Acknowledge" on a clinical alert:
  1. The warning icon cross-fades to a green checkmark (200ms)
  2. After a 200ms hold, the alert's height animates to 0 (200ms, ease-out)
  3. Content below shifts upward to fill the space (same 200ms timing)

### Search
- A search input in the sidebar header ("Search record...") provides fuzzy matching across all PMR sections.
- Typing shows a dropdown of results grouped by section (Consultations, Medications, Problems, etc.).
- Each result shows the section icon, the matching text, and a relevance indicator.
- Pressing Enter or clicking a result navigates to that section with the matching item highlighted/expanded.
- Implementation: fuse.js for fuzzy search across a pre-built index of all content.

### Context Menus
- Right-clicking (desktop) or long-pressing (mobile) on certain elements reveals a context menu:
  - On a consultation entry: "Expand", "Copy to clipboard", "View coded entries"
  - On a medication row: "View prescribing history", "Copy to clipboard"
  - On a problem entry: "View linked consultations", "Copy to clipboard"
- Context menus styled: white background, `1px solid #E5E7EB` border, 4px radius, `box-shadow: 0 4px 12px rgba(0,0,0,0.1)`. Items in Inter 400, 14px, 36px row height.

### Login Screen Typing
- The username types character-by-character (30ms per character).
- The password dots appear faster (20ms per dot).
- A blinking cursor appears in the active field (530ms blink interval).
- The "Log In" button shows a brief active/pressed state before the interface materializes.

---

## Responsive Strategy

### Desktop (>1024px)
The full PMR experience. This is the design's primary target — clinical systems are desktop applications.
- Sidebar: 220px, always visible, dark blue-gray
- Patient banner: full width, 80px height, condensing to 48px on scroll
- Main content: fills remaining width (no max-width constraint)
- Tables: full column display, alternating row colors, sort controls
- Consultations: full History/Examination/Plan expanded view
- Search: integrated in sidebar header

### Tablet (768-1024px)
Sidebar collapses to icon-only mode (56px width). Hovering or tapping an icon shows the label as a tooltip.
- Patient banner: condensed to single-line format always (no full/condensed toggle)
- Main content: nearly full width
- Tables: may horizontally scroll if columns exceed available width
- Context menus: triggered by long-press instead of right-click

### Mobile (<768px)
The sidebar becomes a **bottom navigation bar** with 7 icon buttons.

**Bottom nav layout:**
```
[Summary] [Consult] [Meds] [Problems] [Invest] [Docs] [Refer]
```

Each icon from Lucide, 20px, with the active item highlighted in NHS blue with a label below. Height: 56px with safe area padding.

**Patient banner on mobile:** Minimal top bar: `CHARLWOOD, A (Mr) | 2211810 | (dot)` — action buttons collapse into "..." overflow menu.

**Content adaptations:**
- Tables switch to card layout: each row becomes a small card with fields stacked vertically
- Consultation entries: tap-to-expand pattern with larger tap targets (48px minimum height)
- Medications: table becomes stacked card list
- Referral form: full-width inputs, generous touch targets
- Search: moves to top of each view as a search bar

**Back navigation:** Each view has a back arrow returning to Summary.

### Breakpoint Summary

| Element | Desktop (>1024) | Tablet (768-1024) | Mobile (<768) |
|---------|-----------------|-------------------|---------------|
| Sidebar | 220px, full labels | 56px, icons only | Bottom nav bar |
| Patient banner | 80px full / 48px sticky | 48px always | Minimal top bar |
| Tables | Full columns, horizontal | Scroll if needed | Card layout (stacked) |
| Search | Sidebar header | Sidebar header | Top of each view |
| Context menus | Right-click | Long-press | Long-press |

---

## Accessibility

### Semantic HTML
- Sidebar: `<nav role="navigation" aria-label="Clinical record navigation">` with `<ul>` and `<li>` items. Active item uses `aria-current="page"`.
- Patient banner: `<header role="banner">` containing patient demographics.
- Main content area: `<main>` element with `aria-label` matching the current view name.
- Tables: Proper `<table>`, `<thead>`, `<th>`, `<tbody>`, `<tr>`, `<td>` markup. Column headers use `scope="col"`.
- Consultation entries: `<article>` elements with `<button>` for expand/collapse, `aria-expanded` attribute.

### Keyboard Navigation
- `Tab` moves between: sidebar items, patient banner buttons, main content interactive elements
- `ArrowUp` / `ArrowDown` within the sidebar moves between navigation items (roving tabindex)
- `Enter` / `Space` on sidebar items activates that view
- `Enter` / `Space` on consultation entries toggles expand/collapse
- `Alt+1` through `Alt+7` directly activates sidebar items
- `Escape` closes expanded items, context menus, and search dropdown
- Search input focusable with `/` key

### Screen Reader Experience
1. After login, announces: "Patient Record for Charlwood, Andrew. Summary view."
2. Clinical alert announced via `role="alert"`: full alert text
3. Tables announced with column headers
4. Expandable items announce expanded/collapsed state
5. Breadcrumb uses `<nav aria-label="Breadcrumb">`

### Alert Accessibility
- Uses `role="alert"` and `aria-live="assertive"`
- Acknowledge button: `aria-label="Acknowledge clinical alert"`
- Removal is smooth (element removes from accessibility tree)

### Focus Management
- After login: focus moves to first sidebar item (Summary)
- After navigating to new view: focus moves to first heading in main content
- After expanding consultation: focus moves to HISTORY heading
- After closing context menu: focus returns to trigger element
- After acknowledging alert: focus moves to main content first interactive element

### Color and Contrast
- All text meets WCAG 2.1 AA contrast requirements
- Traffic lights never sole communicator — always with text labels
- NHS blue on white: ~7.3:1 contrast ratio
- Amber alert text on amber bg: ~5.8:1 contrast ratio

### Motion Preferences
When `prefers-reduced-motion: reduce`:
- Login typing completes instantly
- Alert appears without slide
- Expand/collapse is instant
- Banner condensation is instant
- Hover background-color changes remain
