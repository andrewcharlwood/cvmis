# Reference: Visual Design System

> Extracted from goal.md — Visual System section. This is the SINGLE SOURCE OF TRUTH for colors, typography, spacing, borders, and motion throughout the Clinical Record PMR.

---

## Color Palette

This design is **light-mode only**. Clinical record systems operate in light mode — high ambient lighting in consulting rooms demands white backgrounds and dark text. A dark mode would break the metaphor.

**Backgrounds:**
- Main content area: `#F5F7FA` (cool light gray — the content background of EMIS/SystmOne)
- Card/panel surfaces: `#FFFFFF` (white)
- Sidebar: `#1E293B` (dark blue-gray — EMIS-style dark navigation panel)
- Patient banner: `#334155` (lighter blue-gray with white text)
- Login screen background: `#1E293B` (same as sidebar — institutional dark blue-gray)

**Text:**
- Primary text: `#111827` (gray-900 — near-black for maximum readability)
- Secondary text: `#6B7280` (gray-500)
- On dark surfaces: `#FFFFFF` (white) and `#94A3B8` (slate-400 for secondary)

**Accent and status colors:**
- NHS blue: `#005EB8` — primary interactive color. Used for buttons, active nav states, links, column headers. This is the actual NHS brand blue and will be instantly recognized.
- Green: `#22C55E` — active/resolved/current states. "Active" status dots, resolved problems, current role indicators.
- Amber: `#F59E0B` — alerts, in-progress items, notable achievements. The clinical alert banner uses this as its background.
- Red: `#EF4444` — urgent/critical markers. Used sparingly — only for genuinely important items (e.g., a "priority" flag on the referral form).
- Gray: `#6B7280` — inactive/historical items. Past roles that are no longer current, historical "medications."

**Traffic light system (used throughout):**
- Green circle: Active / Resolved / Current
- Amber circle: In progress / Alert / Notable
- Red circle: Urgent / Critical (rare)
- Gray circle: Inactive / Historical

## Typography

Clinical systems use system fonts — Inter or Segoe UI for general text, monospace for coded entries and data values. No decorative fonts, no variable tracking. Functional typography optimized for scanning dense tables.

- **Patient banner name:** Inter 600, 20px (not huge — clinical systems don't emphasize the patient name with large type)
- **Patient banner details:** Inter 400, 14px
- **Sidebar navigation labels:** Inter 500, 14px, white
- **Section headings (within main area):** Inter 600, 18px
- **Consultation entry titles:** Inter 600, 16px
- **Body text / descriptions:** Inter 400, 14px, line-height 1.6
- **Table headers:** Inter 600, 13px, uppercase, letter-spacing 0.03em, gray-500
- **Table data cells:** Inter 400, 14px
- **Coded entries / data values:** Geist Mono 400, 13px
- **Clinical codes (SNOMED-style):** Geist Mono 400, 12px, gray-400
- **Timestamps:** Geist Mono 400, 12px
- **Alert banner text:** Inter 500, 14px

## Spacing and Layout

- **Sidebar width:** 220px (fixed, desktop). Collapses to 56px (icon-only) on tablet.
- **Patient banner height:** 80px (full), 48px (condensed/sticky)
- **Main content max-width:** No max-width — clinical systems fill available space. Content flows within the area between sidebar and viewport edge.
- **Main content padding:** 24px
- **Card padding:** 16px (clinical systems are more compact than marketing sites)
- **Border radius:** 4px for cards and inputs (clinical systems use minimal rounding — 4px, not 12px or 16px)
- **Table row height:** 40px
- **Section spacing:** 24px between content blocks
- **Base unit:** 4px — tighter spacing than typical, reflecting clinical system density

## Borders and Surfaces

Borders are the dominant visual structuring element. Clinical systems do not rely on shadows or negative space — they use explicit borders to delineate every element.

- **All cards:** `1px solid #E5E7EB` (gray-200) border, `4px` border-radius, no shadow (or at most `0 1px 2px rgba(0,0,0,0.03)`)
- **Table cells:** `1px solid #E5E7EB` borders (all sides)
- **Sidebar border:** `1px solid #334155` (subtle right border in a slightly lighter shade)
- **Patient banner border:** `1px solid #475569` bottom border
- **Input fields:** `1px solid #D1D5DB` border, `4px` radius, `#FFFFFF` background, `8px 12px` padding
- **Active/selected rows:** `#EFF6FF` background (very subtle blue tint) — this is how EMIS highlights the selected row

## Motion

Clinical systems are fast and functional. Animations are minimal and purposeful — no spring physics, no bouncy transitions. Everything is immediate or uses simple ease-out.

- **Navigation switches:** Instant content swap. No crossfade, no slide. When you click a sidebar item, the main content area replaces immediately — just like clicking a tab in EMIS.
- **Consultation expand/collapse:** Height animation, 200ms, `ease-out`. No opacity fade — the content simply grows/shrinks.
- **Alert banner entrance:** Slide down from top, 250ms, with a subtle spring overshoot (this is the one exception — alerts are meant to demand attention).
- **Alert acknowledge:** The alert shrinks in height to zero (200ms) with a small green checkmark that flashes briefly.
- **Hover states:** Background-color transitions, 100ms. No transforms, no lifts. Just color.
- **Login typing:** Character-by-character reveal using `setInterval` (30ms per character for username, 20ms per dot for password).
- **Patient banner scroll condensation:** Smooth height transition (200ms) from full (80px) to condensed (48px) as user scrolls past the first 100px of content.
- **`prefers-reduced-motion`:** Typing animation completes instantly (full text appears), alert slides are replaced with fade-in, expand/collapse is instant.
