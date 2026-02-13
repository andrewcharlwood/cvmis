# Reference: Tasks 19-21 — Polish

## Task 19: Responsive Design

### Desktop (>1024px)
- Full sidebar (272px) + TopBar + 2-column card grid
- All tiles at full spec (as designed in Tasks 8-15)
- Command palette at 580px width

### Tablet (768–1024px)
- Sidebar: collapse to icon-only (56px) or hide entirely with toggle
- TopBar: full, but search bar may shrink (reduce min-width)
- Card grid: can stay 2-column if space permits, or switch to 1-column
- Activity grid inside CareerActivity tile: switch to 1-column

### Mobile (<768px)
- Sidebar: hidden entirely (off-canvas or removed)
- TopBar: simplified — brand text may truncate, hide search bar center section
- Navigation: consider a hamburger menu or bottom nav for key actions
- Card grid: single column
- All tiles stack vertically (full-width)
- Metric grid in LatestResults: stays 2x2 (compact enough)
- Activity grid in CareerActivity: single column
- Touch targets: all clickable elements 48px+ minimum
- Command palette: full-width with reduced padding

### Breakpoint Strategy
Use Tailwind responsive prefixes:
- `lg:` for desktop (>1024px)
- `md:` for tablet (>768px)
- Default styles for mobile-first

### Key responsive classes:
```
/* Card grid */
grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-[16px]

/* Sidebar visibility */
hidden lg:flex lg:flex-col

/* TopBar search */
hidden md:block

/* Activity grid */
grid grid-cols-1 md:grid-cols-2

/* Sidebar width */
lg:w-[272px] lg:min-w-[272px]
```

---

## Task 20: Accessibility Audit

### Semantic HTML
| Element | Tag | Notes |
|---------|-----|-------|
| TopBar | `<header>` | Fixed at top |
| Sidebar | `<aside>` or `<nav>` | Navigation/info panel |
| Main content | `<main>` | Card grid container |
| Individual tiles | `<article>` | Self-contained content sections |
| Tile sections | `<section>` | Within tiles (e.g., metric grid, bullet list) |
| Command palette | `<dialog>` or `div role="dialog"` | Modal overlay |

### Keyboard Navigation
| Key | Action |
|-----|--------|
| Tab | Move between interactive elements (tiles, buttons, links) |
| Enter/Space | Expand tile items, flip KPI cards, select palette results |
| Escape | Close expanded items, close command palette |
| Ctrl+K | Open command palette |
| Arrow Up/Down | Navigate command palette results |

### ARIA Attributes
- **Command palette search**: `role="combobox"`, `aria-expanded`, `aria-controls="palette-results"`, `aria-autocomplete="list"`
- **Palette results**: `role="listbox"`, each result `role="option"`
- **Palette overlay**: `role="dialog"`, `aria-modal="true"`, `aria-label="Search records"`
- **Expandable items**: `aria-expanded="true|false"` on trigger element
- **KPI flip cards**: `aria-label` describing front/back content, `role="button"`, `tabIndex={0}`
- **Status dots with text**: text labels present → dot can be `aria-hidden="true"`
- **Alert flags**: `role="status"` or decorative (visible text is sufficient)
- **Live region**: When palette opens/closes, announce via `aria-live="polite"` region
- **TopBar session info**: `aria-label="Active session information"`

### Focus Management
- **Command palette**: focus trap when open. Focus moves to search input on open. Returns to trigger element on close.
- **Focus visible**: `focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40` on all interactive elements (buttons, links, expandable items, KPI cards)
- **Skip to content**: Optional "Skip to main content" link (only visible on focus)
- **After tile expansion**: focus should remain on the trigger or move into expanded content

### `prefers-reduced-motion`
Every animation must check:
```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
```

| Animation | Reduced Motion Behavior |
|-----------|------------------------|
| Dashboard entrance (topbar/sidebar/content) | Instant, no slide/fade |
| Tile expansion | Instant height change (duration: 0) |
| KPI flip | Instant content swap (no rotateY) |
| Palette entrance | Instant show (no scale/translate) |
| Status badge pulse | No animation |
| Hover transitions | Can keep (very brief) or disable |

### Color Contrast Verification
| Foreground | Background | Expected Ratio | Meets AA? |
|------------|-----------|-----------------|-----------|
| #0D6E6E (accent) | #FFFFFF (white) | ~5.5:1 | Yes |
| #1A2B2A (primary) | #FFFFFF | ~15:1 | Yes |
| #5B7A78 (secondary) | #FFFFFF | ~4.6:1 | Borderline — verify |
| #8DA8A5 (tertiary) | #FFFFFF | ~3.0:1 | Fails for body text — use only for decorative/supplementary |
| #0D6E6E (accent) | #F0F5F4 (bg) | ~4.8:1 | Yes for large text |

**Important:** Tertiary text (#8DA8A5) does NOT meet AA for body text. Use only for supplementary labels, dates, and decorative text where the information is also conveyed elsewhere (e.g., a date that's also in the title). For standalone readable text, use secondary (#5B7A78) or primary (#1A2B2A).

---

## Task 21: Clean Up and Final Polish

### Components to Remove (only after confirming unused)
- `src/components/PatientBanner.tsx` — replaced by TopBar
- `src/components/ClinicalSidebar.tsx` — replaced by Sidebar
- `src/components/Breadcrumb.tsx` — no longer needed (no view switching)
- `src/components/MobileBottomNav.tsx` — may be replaced or redesigned
- `src/components/PMRInterface.tsx` — replaced by DashboardLayout

### Views to Assess
The `src/components/views/` directory contains the old view components. Some may be reusable:
- **ConsultationsView.tsx**: Expanded entry rendering could be reused in CareerActivity expansion (Task 16). Check before removing.
- **MedicationsView.tsx**: Prescribing history rendering could be reused in CoreSkills expansion. Check before removing.
- **Other views**: If expansion (Task 16) doesn't reuse them, they can be removed.

**Rule: Only remove files that are confirmed unused.** Run a grep for imports before deleting.

### Hooks to Assess
- `src/hooks/useScrollCondensation.ts` — only used by PatientBanner. If PatientBanner is removed, this can go too.
- `src/hooks/useBreakpoint.ts` — may still be useful for responsive tile layouts. Check if any new dashboard component uses it. If not, remove.

### Context to Simplify
- `src/contexts/AccessibilityContext.tsx` — the existing context has `activeView`, `setActiveView`, `expandedItemId`, `setExpandedItem` designed for the old view-switching navigation. With the new single-page dashboard:
  - `activeView` / `setActiveView` are no longer relevant (no view switching)
  - `expandedItemId` / `setExpandedItem` may still be useful if tiles report their expanded item for accessibility announcements
  - Assess whether to simplify the context or remove it entirely and manage expansion state locally in each tile
  - **Note:** This context has 1 pre-existing ESLint warning — that's expected.

### Verification Checklist
- [ ] No dead imports (run `npm run lint` — ESLint catches unused imports)
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] Clean build (`npm run build`)
- [ ] Bundle size reasonable (should be similar to or smaller than current ~417KB)
- [ ] No console errors in dev mode

### Final Visual Review
Open `http://localhost:5173` and compare against `References/GPSystemconcept.html`:
- [ ] TopBar layout matches (brand, search, session)
- [ ] Sidebar matches (person header, tags, alerts)
- [ ] Card grid layout (2-column, full-width tiles span both)
- [ ] Each tile's visual treatment matches concept
- [ ] Shadows, borders, radius consistent
- [ ] Typography: Elvaro Grotesque (not DM Sans)
- [ ] Colors: teal accent (not NHS Blue)
- [ ] Hover states work (card shadow lift, border color change)
- [ ] Responsive: test at 1280px, 800px, 375px widths
