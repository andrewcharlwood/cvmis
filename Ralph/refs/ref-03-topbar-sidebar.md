# Reference: Tasks 4-6 — TopBar and Sidebar

## Concept Reference

All specs below are derived from `References/GPSystemconcept.html`. Open it in a browser for visual reference.

---

## Task 4: TopBar Component

### File: `src/components/TopBar.tsx`

### Structure
```
┌─────────────────────────────────────────────────────────────┐
│ [🏠] Headhunt Medical Center  Remote  │  [🔍 Search... Ctrl+K]  │  Dr. A.CHARLWOOD · Active Session · 12:23  [Ctrl+K] │
└─────────────────────────────────────────────────────────────┘
```

### Specs

**Container:**
- `position: fixed`, `top: 0`, `left: 0`, `right: 0`
- `height: var(--topbar-height)` (48px)
- `background: var(--surface)` (#FFFFFF)
- `border-bottom: 1px solid var(--border)` (#D4E0DE)
- `display: flex`, `align-items: center`, `justify-content: space-between`
- `padding: 0 20px`
- `z-index: 100`

**Brand (left):**
- `Home` icon from lucide-react (18px, accent color)
- Text: "Headhunt Medical Center" — 13px, font-ui, 600 weight, text-primary
- Version badge: "Remote" — 11px, 400 weight, text-tertiary, margin-left 2px

**Search bar (center):**
- Wrapper: `max-width: 560px`, `min-width: 400px`
- Container: `height: 42px`, `border: 1.5px solid var(--border)`, `border-radius: var(--radius)` (8px), `padding: 0 14px`, white bg
- Search icon (16px, tertiary) + input + "Ctrl+K" kbd badge
- Input: 13px, font-body, placeholder "Search records, experience, skills... (Ctrl+K)"
- Hover: `border-color: var(--accent-border)`
- Focus: `border-color: var(--accent)`, `box-shadow: 0 0 0 3px rgba(13,110,110,0.12)`
- **On click/focus: opens Command Palette** (Task 18). Does NOT do inline search.
- Kbd badge: mono font, 10px, tertiary, bg: var(--bg), border, padding 2px 6px, radius 4px

**Session info (right):**
- Text: "Dr. A.CHARLWOOD · Active Session · [time]" — 12px, text-secondary
- Session pill: mono 11px, tertiary, `background: var(--accent-light)`, `padding: 3px 10px`, radius 4px, `border: 1px solid var(--accent-border)`
- Ctrl+K shortcut badge (same style as search bar badge)

**Responsive:**
- Mobile (<768px): hide center search bar. Show only brand + session info (or hamburger).
- Tablet: search bar may shrink.

---

## Task 5: Sidebar — PersonHeader

### File: `src/components/Sidebar.tsx`

### Overall Sidebar Container
- `width: var(--sidebar-width)` (272px)
- `min-width: var(--sidebar-width)`
- `background: var(--sidebar-bg)` (#F7FAFA)
- `border-right: 1px solid var(--border)` (#D4E0DE)
- `overflow-y: auto`, custom scrollbar (4px width, transparent track, border-colored thumb)
- `padding: 20px 16px`
- `display: flex`, `flex-direction: column`, `gap: 2px`

### PersonHeader Section
Bordered below: `border-bottom: 2px solid var(--accent)`, `padding-bottom: 16px`, `margin-bottom: 6px`

**Avatar:**
- 52px × 52px circle
- `background: linear-gradient(135deg, var(--accent), #0A8080)`
- White text "AC", 700 weight, 18px, centered
- `box-shadow: 0 2px 8px rgba(13,110,110,0.25)`
- `margin-bottom: 12px`

**Name:**
- "CHARLWOOD, Andrew"
- 15px, 700 weight, text-primary, `letter-spacing: -0.01em`

**Title:**
- "Pharmacy Data Technologist"
- 11.5px, mono font, 400 weight, text-secondary
- `margin-top: 2px`

**Status badge:**
- Inline-flex, gap 5px
- `margin-top: 8px`
- 11px, 500 weight, success color (#059669)
- `background: var(--success-light)`, `border: 1px solid var(--success-border)`
- `padding: 3px 9px`, `border-radius: 20px` (pill)
- Animated dot: 6px circle, success color, `animation: pulse 2s infinite` (opacity 1→0.4→1)
- Text: "Open to Opportunities"

**Details grid:**
- `display: grid`, `grid-template-columns: 1fr`, `gap: 6px`, `margin-top: 12px`
- Each row: `display: flex`, `justify-content: space-between`, `align-items: center`, 11.5px, `padding: 2px 0`
- Label: text-tertiary, 400 weight
- Value: text-primary, 500 weight, text-align right
- GPhC No. value: mono font, 11px, `letter-spacing: 0.12em` → "2211810"
- Education value: "MPharm 2.1 (Hons)"
- Location: "Norwich, Norfolk"
- Phone: link in accent color, `text-decoration: none`, underline on hover → "07795 553 088"
- Email: link → "andy@charlwood.xyz"
- Registered: "August 2016"

**Data source:** `src/data/patient.ts`

---

## Task 6: Sidebar — Tags + Alerts

### Section Title Component
Reusable within sidebar. Used for "Tags", "Alerts / Highlights", and any future sections.

- `font-size: 10px`, `font-weight: 600`, `text-transform: uppercase`, `letter-spacing: 0.08em`
- Color: text-tertiary
- `margin-bottom: 10px`
- Flex row with `::after` pseudo-element: `flex: 1`, `height: 1px`, `background: var(--border-light)`, `gap: 6px`

### Tags Section
- Container: `display: flex`, `flex-wrap: wrap`, `gap: 5px`
- Each tag: 10.5px, 500 weight, `padding: 3px 8px`, `border-radius: 4px`, inline-flex, `line-height: 1.3`
- **Color variants:**
  - `teal`: `background: var(--accent-light)`, `color: var(--accent)`, `border: 1px solid var(--accent-border)`
  - `amber`: `background: var(--amber-light)`, `color: var(--amber)`, `border: 1px solid var(--amber-border)`
  - `green`: `background: var(--success-light)`, `color: var(--success)`, `border: 1px solid var(--success-border)`
- **Data source:** `src/data/tags.ts`

### Alerts / Highlights Section
- Container: `display: flex`, `flex-direction: column`, `gap: 6px`
- Each flag item: `display: flex`, `align-items: center`, `gap: 8px`
  - 11px, 700 weight, `padding: 7px 10px`, `border-radius: var(--radius-sm)` (6px), `letter-spacing: 0.02em`
- **Alert variant** (red):
  - `background: var(--alert-light)`, `color: var(--alert)`, `border: 1px solid var(--alert-border)`
  - Icon: `AlertTriangle` from lucide-react (14px, 2.5 stroke-width)
- **Amber variant:**
  - `background: var(--amber-light)`, `color: var(--amber)`, `border: 1px solid var(--amber-border)`
  - Icon: `AlertCircle` from lucide-react (14px, 2.5 stroke-width)
- Icon container: 16px square, flex center, flex-shrink-0
- **Data source:** `src/data/alerts.ts`

### Section Padding
Each sidebar section: `padding: 14px 0 6px`
