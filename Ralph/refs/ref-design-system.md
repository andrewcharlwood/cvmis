# Reference: Visual Design System

> The SINGLE SOURCE OF TRUTH for colors, typography, spacing, surfaces, and motion throughout the Clinical Record PMR. Follows the **Clinical Luxury** direction in CLAUDE.md.

---

## Design Philosophy

A **premium portfolio** that uses the structure and metaphor of a GP clinical system — not a faithful NHS software clone. Real clinical systems (EMIS Web, SystmOne) are dense, border-heavy, and purely functional. We keep their *structure* (patient banner, sidebar navigation, record sections, tables, status indicators) but elevate the *execution* with refined typography, atmospheric depth, and considered whitespace.

The goal is contrast: clinical precision married to luxury refinement. The "wow" comes from recognizing the clinical metaphor while being surprised by how good it looks.

---

## Color Palette

**Light-mode only.** The metaphor demands it — clinical systems operate under bright consulting room lights. No dark mode.

**Backgrounds:**
- Main content area: `#F5F7FA` — cool light gray base. Add atmospheric depth — a faint noise/grain texture overlay or a subtle warm tint — so the surface feels like quality paper, not a flat spreadsheet.
- Card/panel surfaces: `#FFFFFF` — clean white. Cards float above the content surface via layered shadows (see Surfaces section).
- Sidebar: `#1E293B` — dark blue-gray. The gravitas anchor — dark chrome that reads as serious software.
- Patient banner: `#334155` — lighter blue-gray with white text. Subtle drop shadow below to separate from content.
- Login screen background: `#1E293B` — same as sidebar. Carries through to PMR entrance seamlessly.

**Text:**
- Primary: `#111827` (gray-900) — near-black for maximum readability
- Secondary: `#6B7280` (gray-500) — labels, metadata, supporting text
- Muted: `#94A3B8` (slate-400) — timestamps, tertiary info
- On dark surfaces: `#FFFFFF` (white primary), `#94A3B8` (slate-400 secondary)

**Accent and status colors:**
- **NHS Blue `#005EB8`** — THE accent color. Buttons, active nav states, links, interactive elements. The actual NHS brand blue — instantly recognizable, the strongest signal of the clinical metaphor. Use it confidently but not everywhere.
- Green `#22C55E` — active/resolved/current states. Status dots, current role indicators.
- Amber `#F59E0B` — alerts, in-progress items. The clinical alert banner background.
- Red `#EF4444` — urgent/critical. Used very sparingly — only genuinely important items.
- Gray `#6B7280` — inactive/historical items.

**Traffic light system (used throughout):**
- Green dot: Active / Resolved / Current
- Amber dot: In progress / Alert / Notable
- Red dot: Urgent / Critical (rare)
- Gray dot: Inactive / Historical
- **Always paired with text labels.** Color is never the sole signifier (WCAG compliance).

---

## Typography

See Claude.md for info on font choice. Typography carries the premium feel. The font choice must feel *designed* — intentional and distinctive — while reading cleanly at small clinical-system sizes (11-14px).

**Type scale (tight, clinical):**
- Patient banner name: [UI font] 600, 20px
- Patient banner details: [UI font] 400, 14px
- Sidebar navigation labels: [UI font] 500, 14px, white
- Section headings (main area): [UI font] 600, 15-18px
- Consultation entry titles: [UI font] 600, 15-16px
- Body text / descriptions: [UI font] 400, 13-14px, line-height 1.6
- Table headers: [UI font] 600, 12-13px, uppercase, letter-spacing 0.03-0.05em
- Table data cells: [UI font] 400, 13-14px
- Labels / metadata: [UI font] 500, 11-12px
- Coded entries / data values: Geist Mono 400, 12-13px
- Clinical codes (SNOMED-style): Geist Mono 400, 11-12px, gray-400
- Timestamps: Geist Mono 400, 11-12px
- Alert banner text: [UI font] 500, 14px

**Hierarchy through weight, not size.** Use 400/500/600/700 weight variations within a narrow size range. Bold section headers, medium labels, regular body. This keeps the clinical density while creating clear, scannable hierarchy.

---

## Spacing and Layout

More generous than real clinical software. The clinical metaphor provides structure; the extra breathing room provides luxury.

- **Sidebar width:** 220px (fixed, desktop). Collapses to 56px (icon-only) on tablet.
- **Patient banner height:** 80px (full), 48px (condensed/sticky)
- **Main content max-width:** None — fills available space between sidebar and viewport edge.
- **Main content padding:** 24px (desktop), 16px (mobile)
- **Card padding:** 16-24px — more generous than real clinical systems. Content should breathe inside cards.
- **Border radius:** 4px default for cards, inputs, buttons (clinical precision). 12px exception for the login card only.
- **Table row height:** 40px
- **Section spacing:** 24px between content blocks
- **Base unit:** 4px grid — applied more generously than in real clinical systems

---

## Surfaces & Depth

Our biggest departure from real clinical software. Real systems are flat and border-heavy; we use **shadows and layering** for depth — while keeping borders where they're authentically clinical (tables, input fields).

**Cards:**
- Border: `1px solid #E5E7EB` (keep the clinical border — it's authentic)
- Shadow: Multi-layered — `0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)`. Gentle float, not Material Design dramatic.
- Border-radius: `4px`
- Hover: Cards may lift very slightly — 1-2px translateY + shadow deepens to `0 2px 4px rgba(0,0,0,0.06), 0 8px 16px rgba(0,0,0,0.04)`. Restrained, not bouncy.
- Card headers: Light gray `#F9FAFB` background with `1px solid #E5E7EB` bottom border. Uppercase title in [UI font] 600, 12-13px. The most "clinical" element — keep it precise.

**Tables:**
- Full `<table>` markup with styled headers — where clinical authenticity lives.
- Table headers: `#F9FAFB` background, `1px solid #E5E7EB` borders.
- Alternating rows: `#FFFFFF` / `#F9FAFB` — subtle but scannable.
- Row hover: `#EFF6FF` background (blue tint).
- Cell borders: `1px solid #E5E7EB` — keep full borders on tables. Authentic.

**Sidebar:**
- Background: `#1E293B`
- Right edge: `1px solid #334155` + optional very subtle glow/shadow where it meets the content area.
- The sidebar should feel solid and authoritative against the lighter content.

**Patient banner:**
- Background: `#334155`
- Bottom: Subtle drop shadow `0 2px 8px rgba(0,0,0,0.12)` to separate from content below.
- Bottom border: `1px solid #475569`

**Input fields:**
- Border: `1px solid #D1D5DB`, `4px` radius, `#FFFFFF` background, `8px 12px` padding
- Focus: NHS blue border + `box-shadow: 0 0 0 3px rgba(0,94,184,0.15)` — refined focus ring.

---

## Motion

Motion should feel **considered and premium** — never flashy, never gratuitous. Every animation has a purpose: to orient the user, to reward interaction, or to create a moment of polish.

**PMR entrance sequence (login → PMR transition):**
- Patient banner slides down: 200ms, ease-out
- Sidebar slides from left: 250ms, ease-out, 50ms delay
- Content fades in: 300ms, 100ms delay after sidebar
- The staggered materialization — the most impactful animation.

**Navigation switches:** Instant content swap. No crossfade, no slide. This preserves the "software application" feel — clinical systems switch tabs instantly.

**Expandable content:** Height-only animation, 200ms, `ease-out`. Content grows/shrinks — no opacity fade.

**Clinical alert entrance:** Spring animation (Framer Motion `type: "spring"`, moderate damping). The one element that *demands attention* — the spring overshoot is earned here.

**Alert acknowledge:** Warning icon cross-fades to green checkmark (200ms) → hold 200ms → alert height collapses (200ms ease-out).

**Hover states:** Subtle and immediate. Background-color transitions at 100ms. Card lifts are 1-2px max with shadow deepening. Think: OS-level responsiveness, not playful bouncing.

**Login typing:** Character-by-character reveal at a natural pace: 80ms/char for username, 60ms/dot for password. Cursor blink at 530ms. After typing completes, "Log In" button becomes interactive — user clicks to proceed (not auto-triggered).

**Patient banner condensation:** Height transition (200ms) from 80px → 48px as user scrolls past 100px. Buttery smooth, no jank.

**`prefers-reduced-motion`:** All animations skip to final state instantly. Typing completes immediately. Alert appears without slide. Expand/collapse is instant. No exceptions.

---

## What Makes This Design Distinctive

The design stands on **contrasts**:
- Dark, serious sidebar next to warm, airy content
- Small, precise monospace data in generous whitespace fields
- NHS blue punching through an otherwise muted, restrained palette
- Clinical structure (tables, status dots, coded entries) executed with luxury refinement (shadows, spacing, typography)
- The boot → ECG → login theatrical sequence, then suddenly: a premium application

If any component could be dropped into a generic SaaS dashboard without looking out of place, it needs more character.
