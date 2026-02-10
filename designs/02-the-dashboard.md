# Design 2: The Dashboard

## Overview

Andy's CV presented as a live operational dashboard — the kind of analytical interface he builds for the NHS, now turned on himself. The medium IS the message.

This is not a scrolling portfolio with dashboard "styling." It is a fundamentally different navigation paradigm: **tab-switching views** instead of vertical scroll. Each tab is a self-contained viewport with its own optimized layout — bento grids of metric cards, filterable skill panels, an interactive horizontal timeline, a project portfolio with status badges. The user navigates Andy's career the same way Andy navigates the data systems he builds: by switching views, drilling into detail, and reading quantitative signals at a glance.

This is the most data-dense of all six designs. It is designed for recruiters, hiring managers, and technical leads who appreciate information density and are comfortable with complex interfaces. It rewards exploration and communicates Andy's analytical mindset before a single word of content is read.

**Key characteristics:**
- Tab-based view switching replaces scroll-based navigation entirely
- High information density with multiple data points visible simultaneously
- Metric cards with large numbers as the primary content unit
- Adaptive light/dark mode respecting system preference
- Persistent status bar providing ambient context
- Quantitative achievements lead — numbers, not prose

---

## ECG Transition

**Starting point:** "ANDREW CHARLWOOD" is on screen in neon green (`#00ff41`) on black. The heartbeat trace is complete. The name is fully formed and glowing.

**Then...**

### Phase 1: The Name Dims, the Edges Pulse (400ms)

The neon green letters hold for a beat, then begin to dim — not disappearing, but reducing to approximately 30% opacity. They remain visible as ghosted characters. Simultaneously, the remnant flatline portions of the heartbeat trace (to the left and right of the name) start pulsing with small, rhythmic blips, as if the heartbeat hasn't stopped — it has migrated to the periphery.

### Phase 2: Multi-Channel Ignition (800ms)

Two additional horizontal traces draw themselves simultaneously across the full viewport width:

- **Upper trace** at ~30% viewport height in teal (`#00897B`): draws a steady, regular pulse pattern — the rhythm of structured data
- **Lower trace** at ~70% viewport height in coral (`#FF6B6B`): draws a slower, more organic waveform — the rhythm of clinical observation

For approximately one second, the screen displays three horizontal traces — teal on top, ghosted green name in the middle, coral on the bottom. The visual effect is a multi-channel patient monitor displaying three simultaneous vital signs. This is a deliberately surprising beat: the user expects the animation to end, and instead it multiplies, signaling that this is a data-rich environment.

### Phase 3: Simultaneous Flatline (200ms)

All three traces flatline at once. A synchronized moment of pure stillness. Three horizontal lines on black. The name is still faintly visible. This 200ms pause is deliberate silence — a beat of tension before the transformation.

### Phase 4: Grid Materialization (400ms)

From the flatline positions, a grid structure fades in. The three horizontal flatlines become the top edges of bento-grid rows. Vertical dividers descend from the top trace line downward, intersecting the middle and bottom traces, dividing the screen into a grid of cells (4 columns x 3 rows on desktop, adapting to viewport). The verticals draw downward over 400ms, staggered left-to-right at 80ms intervals. They use a dim teal (`rgba(0, 137, 123, 0.2)`).

The background simultaneously shifts from pure black to deep navy (`#0A1628`). The scanline overlay shifts from black to `rgba(10, 22, 40, 0.03)` — subtle dark-blue scanlines that become part of the dashboard texture rather than disappearing.

### Phase 5: Content Cascade (500ms)

The "ANDREW CHARLWOOD" text slides to the top-left corner, scales down, and transitions from ghosted green to clean white. It becomes the dashboard title. The tab bar materializes beside it — each tab label fading in with 80ms stagger. "Overview" receives an active-state underline that draws itself in teal from left to right.

Each grid cell brightens individually with staggered timing (50ms per cell, top-left to bottom-right). As each cell activates, its KPI value fades in: "10+ years", "14,000 patients", "14.6M", "220M budget", and so on. The cascade reveal takes approximately 500ms for all cells.

The status bar slides up from the bottom edge of the viewport (the coral trace line becomes the status bar's top border).

### Phase 6: Final State

Deep navy dashboard (`#0A1628`) with bento grid of KPI cards, tab bar at top, status bar at bottom. The three ECG traces have literally become the structural lines of the dashboard layout. The heartbeat didn't end — it crystallized into information architecture.

**Total transition duration:** ~3 seconds

**Why this works:** The metaphor is precise. Andy takes raw clinical signals (vital signs, prescribing data) and transforms them into organized, actionable dashboards. The transition demonstrates this competency visually. The multi-channel moment is memorable, and the grid materialization provides a satisfying structural resolution.

---

## Visual System: Systematic Clarity

### Color Palette

**Adaptive mode** — the dashboard respects `prefers-color-scheme` and provides a manual toggle (persisted to `localStorage`).

**Light mode:**
- Background: cool white `#FAFAFA`
- Surface/cards: `#FFFFFF`
- Borders: `#E4E4E7` (zinc-200)
- Text primary: `#09090B` (zinc-950)
- Text secondary: `#71717A` (zinc-500)

**Dark mode:**
- Background: rich black `#09090B`
- Surface/cards: `#18181B` (zinc-900)
- Borders: `#27272A` (zinc-800)
- Text primary: `#FAFAFA` (zinc-50)
- Text secondary: `#A1A1AA` (zinc-400)

**Accent colors (consistent across modes):**
- Primary blue: `#2563EB` — the dominant interactive color. Used for active tab underlines, primary buttons, link states, and chart elements.
- Emerald: `#10B981` — health/active states. Used for "current" role indicators, active skills, live project badges, and positive metrics.
- Amber: `#F59E0B` — highlights and notable achievements. Used for standout numbers, awards, and attention-drawing callouts.
- Coral: `#FF6B6B` — inherited from the site's accent palette. Used sparingly for clinical-domain tagging in capabilities view.
- Teal: `#00897B` — inherited from the site's primary palette. Used for data/technical-domain tagging and hover states.

**Full zinc neutral scale** for all grays, ensuring consistent, harmonious neutral tones across both modes.

### Typography

**Single-family system** — Inter for all text, Geist Mono for numbers and data values.

- **Dashboard title / Hero name:** Inter 600, 48px, tracking `-0.025em`
- **Tab labels:** Inter 500, 14px, tracking `0.01em`, uppercase
- **Section headings (within tabs):** Inter 600, 24px, tracking `-0.015em`
- **Card KPI values:** Geist Mono 600, 48-72px (varies by card size), tracking `-0.02em`
- **Card labels:** Inter 500, 14px, zinc-500
- **Body text (bullets, descriptions):** Inter 400, 15px, line-height 1.7
- **Status bar text:** Inter 400, 13px
- **Timestamps/dates:** Geist Mono 400, 13px

Hierarchy is established through size, weight, and tracking only — no decorative font variations. Tight negative tracking at large sizes keeps the typographic texture dense and professional.

### Spacing and Grid

- **Grid system:** CSS Grid, 12-column, 24px gap
- **Max content width:** 1120px, centered with `auto` margins
- **Card internal padding:** 24px
- **Border radius:** 8px for small elements (badges, inputs), 12px for cards, 16px for containers/tab panels
- **Section spacing within tabs:** 32px between card groups
- **Consistent 8px base unit** — all spacing values are multiples of 8

### Motion

- **Primary easing:** `cubic-bezier(0.32, 0.72, 0, 1)` (Vercel easing) — fast entry, gentle settle
- **Reveal animation:** Elements enter with `opacity: 0, translateY: 8px, filter: blur(4px)` and resolve to `opacity: 1, translateY: 0, filter: blur(0)` over 300ms
- **Stagger interval:** 40ms between sequential elements
- **Spring parameters:** `{ stiffness: 300, damping: 30 }` for layout animations (card reflow, panel resize)
- **Tab crossfade:** 150ms fade out, 150ms fade in, with the incoming view's elements staggering in using the reveal animation
- **Number countup:** Metric card values animate from 0 to target over 800ms using `ease-out` timing, triggered on tab entry
- **Hover:** Cards lift 2px (`translateY: -2px`) with border color transitioning to blue-500 over 150ms

### Material and Surface Treatment

Clean, flat surfaces with precise borders defining all edges. This is not a skeuomorphic or glassmorphic design — it is systematic and structural.

- **Light mode:** Shadows are barely perceptible (`0 1px 2px rgba(0,0,0,0.04)`), used only on cards. Borders are the primary spatial separator.
- **Dark mode:** No shadows. Borders and subtle background-color differentiation define hierarchy.
- **No gradients on surfaces.** Gradients are reserved exclusively for the ECG transition animation and the occasional data visualization element.
- **Borders define everything:** card edges, tab underlines, status bar top edge, grid cell boundaries.

### Signature Visual: The Status Dot

Every section, skill, and experience item has a **6px colored dot** positioned consistently at the top-left of its container:

- **Emerald dot:** Current/active items — current role, current projects, skills actively in use
- **Blue dot:** Completed items — past roles, completed education, shipped projects
- **Amber dot:** Notable achievements — items with standout metrics (the 14.6M programme, the asthma screening revenue, the switching algorithm)

In the navigation tab bar, the active tab's dot **pulses subtly** (opacity oscillation between 0.6 and 1.0, 2s cycle) to indicate the current view. This pulse is the only continuously animated element in the resting state — everything else is still until interacted with, reinforcing the "precision instrument" feel.

---

## Section-by-Section Design

### Tab Bar (Persistent Navigation Chrome)

Fixed at the top of the viewport. Full width. Contains:

- **Left region:** "Andy Charlwood" in Inter 600, 18px. Below (or beside on wider screens): "Population Health & Data Analysis" in Inter 400, 13px, zinc-500.
- **Center region:** Tab labels — "Overview", "Capabilities", "Timeline", "Portfolio", "Connect". Each is a button with Inter 500, 14px, uppercase, tracking `0.01em`. Active tab has a 2px teal underline and slightly bolder weight. Inactive tabs are zinc-500 with hover-to-zinc-300 transition.
- **Right region:** Theme toggle (sun/moon icon, 20px), and a small "Download CV" link styled as a subtle outlined button.

The tab bar has a bottom border (`1px solid zinc-200` light / `zinc-800` dark). Background matches the page background with a `backdrop-filter: blur(12px)` for slight transparency when content scrolls behind it (relevant for tabs with scrollable content).

**Tab bar height:** 56px desktop, 48px mobile (when it becomes bottom nav).

---

### Tab 1: Overview

The landing view after the ECG transition. This is a **bento grid** — a CSS Grid with items of varying column spans, creating an asymmetric but balanced layout.

**Grid structure (desktop, 4 columns):**

```
[  Name & Title Card (2 cols)  ] [  Profile Summary (2 cols)  ]
[  Years Exp (1) ] [ Budget (1) ] [ Patients (1) ] [ Savings (1) ]
[  Tech Stack Card (2 cols)    ] [  Current Focus (2 cols)    ]
[  Location + GPhC (1 col)     ] [  Leadership (1 col)        ] [  Education Highlight (2 cols) ]
```

**Card types in Overview:**

1. **Name & Title Card** (2-col span): Andy Charlwood in Inter 600 48px. "Deputy Head, Population Health & Data Analysis" below. "NHS Norfolk & Waveney ICB" in teal. Emerald status dot (current role).

2. **Profile Summary Card** (2-col span): The CV profile text, but condensed to 2-3 sentences. Inter 400, 15px, line-height 1.7. This is the only prose-heavy card.

3. **Metric Cards** (1-col span each):
   - "10+" in Geist Mono 72px, "Years Experience" label below, blue dot
   - "220M" in Geist Mono 64px with "GBP" prefix in 24px, "Prescribing Budget" label, amber dot
   - "14,000" in Geist Mono 56px, "Patients Identified" label, emerald dot
   - "14.6M" in Geist Mono 64px with "GBP" prefix in 24px, "Efficiency Programme" label, amber dot

4. **Tech Stack Card** (2-col span): Horizontal row of technology badges: Python, SQL, Power BI, JS/TS, each as a pill with icon. Teal-tinted background on hover. This card serves as a quick-reference for technical keywords that ATS systems and recruiters scan for.

5. **Current Focus Card** (2-col span): 2-3 bullet points about current work direction, drawn from the most recent role. Emerald dot.

6. **Location + GPhC Card** (1-col): "Norwich, UK" with a subtle map pin icon. "GPhC Registered Pharmacist" with registration number. "Since August 2016" in Geist Mono.

7. **Leadership Card** (1-col): "Mary Seacole Programme" with "NHS Leadership Academy" below. "78%" score in Geist Mono. Blue dot (completed).

8. **Education Highlight Card** (2-col): "MPharm 2:1 Honours" in large type. "University of East Anglia, 2011-2015". "Research: 75.1% Distinction" as a highlighted callout with amber dot.

All cards have 12px border-radius, 24px internal padding, and the standard border treatment. On hover, cards lift 2px and the border transitions to blue-500.

**Click behavior:** Clicking a metric card reveals an expanded state (the card grows to fill 2 columns, pushing others down) showing contextual detail — e.g., clicking "14,000 Patients" expands to show a brief description of the switching algorithm and a link to the Portfolio tab.

---

### Tab 2: Capabilities

A two-panel layout for exploring skills.

**Left panel (sidebar, ~280px fixed width):**
A vertical list of skill categories styled as selectable list items:
- "Technical" (8 skills)
- "Clinical" (6 skills)
- "Strategic" (4 skills)

Each category shows its name, skill count, and a small bar chart preview (a thin horizontal bar showing relative skill level average for that category). The active category has a blue left border (3px) and slightly elevated background.

**Right panel (fluid width):**
Displays the selected category's skills as gauge visualizations.

Each skill is rendered as a card containing:
- Skill name in Inter 500, 16px
- Circular SVG gauge (same pattern as current implementation: `strokeDashoffset = circumference * (1 - level / 100)`, rotated -90deg to start from 12 o'clock)
- Percentage in Geist Mono 600, 24px, centered in the gauge
- Category-specific color: teal for Technical, coral for Clinical, blue for Strategic
- A status dot: emerald for skills actively used in current role, blue for all others

Skills are arranged in a responsive grid: 4 columns on desktop within the right panel, 3 on tablet, 2 on mobile.

**Gauge animation:** When switching categories, the gauges animate from 0 to their target value over 800ms with `ease-out` timing. This countup triggers every time a category is selected (not just on first view), reinforcing the "live data" feel.

**Interaction detail:** Hovering a skill gauge shows a tooltip with a one-line description of how Andy uses that skill (e.g., "Python: Built switching algorithms, controlled drug monitoring, data pipeline automation").

---

### Tab 3: Timeline

An interactive chronological view of Andy's career.

**Desktop layout — Horizontal timeline:**

A horizontal scrollable container with CSS scroll-snap. The X-axis represents years (2011-2026), with year markers at regular intervals. The timeline has two tracks:

**Track 1 (upper, primary):** Professional experience entries. Each entry is a card positioned at its start date, with width proportional to duration. Cards contain:
- Role title in Inter 600, 16px
- Organization in Inter 400, 14px, teal
- Date range in Geist Mono 400, 13px
- Status dot: emerald for current roles, blue for past

Cards are stacked vertically when roles overlap (e.g., Deputy Head and Interim Head at ICB).

**Track 2 (lower, secondary):** Education and professional development milestones. Rendered as smaller markers/pills:
- "MPharm, UEA" (2011-2015, spanning 4 years)
- "Mary Seacole Programme" (2018, point marker)
- "GPhC Registration" (2016, point marker)

**Timeline chrome:**
- A thin horizontal axis line in zinc-300 with year tick marks
- The "present" marker (2026) has a pulsing emerald dot
- A subtle gradient fade at the left edge indicates more content to scroll

**Expand interaction:** Clicking any experience card expands it downward to reveal the full bullet points for that role. The timeline adjusts layout smoothly (spring animation, 300ms). Only one card can be expanded at a time — expanding a new card collapses the previous one.

**Keyboard navigation:** Left/right arrow keys scroll the timeline by one year. Enter/Space expands the focused card.

---

### Tab 4: Portfolio

A card grid displaying Andy's projects with status metadata.

**Grid:** 2 columns on desktop, 1 on mobile. Each project card contains:

- Project title in Inter 600, 18px
- Description in Inter 400, 15px, 2-3 lines
- **Status badge** styled like a deployment indicator:
  - "Live" — emerald background, white text (for PharMetrics)
  - "Internal" — blue background, white text (for Blueteq Generator, CD Monitoring)
  - "Complete" — zinc-500 background, white text (for NMS Video)
- Tech tags: small pills showing technologies used (Python, Power BI, etc.)
- Impact metric: a single standout number for each project, displayed in Geist Mono
  - PharMetrics: "Real-time tracking"
  - Switching Algorithm: "14,000 patients / 2.6M savings"
  - Blueteq Generator: "70% reduction / 200hrs saved"
  - CD Monitoring: "Population-scale safety"
  - Sankey Analysis: "Patient pathway visualization"
- External link button (for PharMetrics)

**Hover preview:** On desktop, hovering a project card for 500ms shows an expanded preview with additional context — the full description and a technical implementation note. This preview slides out from the card's right edge (200ms, spring animation).

**Project data (from CV):**

1. **PharMetrics** — Real-time medicines expenditure dashboard for NHS decision-makers. Status: Live. Tech: Power BI, SQL. Impact: Real-time tracking across 220M budget.

2. **Switching Algorithm** — Python-based algorithm identifying patients on expensive drugs suitable for cost-effective alternatives. Status: Internal. Tech: Python, SQL. Impact: 14,000 patients identified, 2.6M annual savings.

3. **Blueteq Generator** — Automation tool for high-cost drug prior approval form creation. Status: Internal. Tech: Python. Impact: 70% reduction in forms, 200+ hours saved.

4. **Controlled Drug Monitoring** — System calculating oral morphine equivalents across all opioid prescriptions at population scale. Status: Internal. Tech: Python, SQL. Impact: Population-scale patient safety analysis.

5. **Sankey Chart Analysis** — Tool visualizing patient journeys through high-cost drug pathways. Status: Internal. Tech: Python. Impact: Trust-level compliance auditing.

6. **Patient Pathway Analysis** — Data-driven analysis of patient pathways to identify optimization opportunities. Status: Internal. Tech: Python, SQL. Impact: Clinical outcome improvements.

---

### Tab 5: Connect

Contact information and a simple message form.

**Layout:** Centered single column within the tab panel, max-width 600px. Clean and minimal — this tab has the lowest information density by design, creating visual breathing room after the data-heavy other tabs.

**Content:**
- "Get in Touch" heading, Inter 600, 32px
- Email: andy@charlwood.xyz as a clickable link, styled with the blue accent
- Location: Norwich, UK with a subtle map pin icon
- LinkedIn / GitHub links as icon buttons with labels

**Optional contact form:**
- Name input
- Email input
- Message textarea
- Submit button in blue accent, full-width

All form inputs use 12px border-radius, zinc-200 borders (light) / zinc-700 borders (dark), 16px internal padding. Focus state adds a blue border and subtle blue glow (`box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15)`).

---

### The Status Bar (Persistent Bottom Chrome)

Fixed at the bottom of the viewport, full width, 36px height.

**Content (left to right):**
- "Last updated: Feb 2026" in Geist Mono 400, 12px
- Vertical separator (1px, zinc-600)
- "Status: Open to opportunities" with a pulsing emerald dot
- Vertical separator
- "Norwich, UK" with a pin icon
- **Right-aligned:** "GPhC Registered" with a subtle badge

**Styling:**
- Light mode: `#F4F4F5` background (zinc-100), zinc-300 top border, zinc-600 text
- Dark mode: `#18181B` background (zinc-900), zinc-800 top border, zinc-400 text

The status bar provides ambient information that's always available regardless of which tab the user is viewing. It communicates "this person is available and current" without requiring the user to navigate to a contact page.

---

## Interactions and Micro-interactions

### Tab Switching
- Clicking a new tab triggers a crossfade: the current tab panel fades out (150ms, ease-out), then the new panel fades in (150ms, ease-in) with its child elements staggering via the reveal animation (40ms intervals).
- The active tab underline slides to the new tab position using a `layoutId` animation (Framer Motion), creating a smooth indicator transition rather than a discrete jump.

### Metric Card Countup
- When a metric card enters the viewport (on tab switch or initial load), its number value animates from 0 to the target over 800ms using `ease-out` timing.
- The "GBP" prefix and labels appear instantly — only the number animates.
- If the user switches away from a tab and returns, the countup replays, reinforcing the "live data refresh" metaphor.

### Card Hover States
- All cards: `translateY: -2px` lift, border color transition to `blue-500`, 150ms duration.
- Metric cards in Overview: the number subtly increases size by 2% on hover (a data-zoom effect).
- Project cards in Portfolio: the status badge pulses once on hover.

### Skill Gauge Interaction
- Category selection in Capabilities triggers all gauge animations simultaneously with 40ms stagger.
- Individual gauge hover: the gauge ring thickens from strokeWidth 5 to 7, and a tooltip appears.

### Timeline Card Expansion
- Click triggers a spring layout animation: the card's height expands to reveal bullet points. Other cards shift downward smoothly.
- The expanded card receives a left blue border (3px) and a slightly elevated shadow.
- A second click collapses the card.
- Only one card can be expanded at a time.

### Theme Toggle
- Clicking the sun/moon icon in the tab bar triggers a smooth crossfade of all color values (200ms). CSS custom properties handle the color swap, so no React re-render is needed for the transition.
- The icon itself rotates 180 degrees during the toggle (sun rotates out, moon rotates in).

### Status Dot Pulse
- The active tab's status dot and the "Open to opportunities" status bar dot share the same pulse animation: opacity oscillates between 0.6 and 1.0 on a 2-second cycle using `animation: pulse 2s ease-in-out infinite`.
- All other dots are static.

---

## Navigation

### Primary Navigation: Tab Bar

The tab bar is the only navigation mechanism. There is no scroll-based section jumping, no sidebar, no hamburger menu. This is a deliberate constraint: the dashboard metaphor demands that users switch views, not scroll through a document.

**Tab list:**

| Tab | Label | Keyboard | URL Hash |
|-----|-------|----------|----------|
| 1 | Overview | `1` or `Alt+1` | `#overview` |
| 2 | Capabilities | `2` or `Alt+2` | `#capabilities` |
| 3 | Timeline | `3` or `Alt+3` | `#timeline` |
| 4 | Portfolio | `4` or `Alt+4` | `#portfolio` |
| 5 | Connect | `5` or `Alt+5` | `#connect` |

**URL hash routing:** Each tab updates the URL hash on activation. On page load, the app reads the hash and activates the corresponding tab (defaulting to Overview if no hash or unrecognized hash). This enables direct linking to specific tabs — a recruiter can share `charlwood.xyz/#portfolio` to send someone directly to the projects view.

**Tab state persistence:** Within a session, each tab preserves its internal state. If the user expands a timeline card, switches to Portfolio, and returns to Timeline, the card is still expanded. This state is managed via React context (not URL), so it resets on page reload.

### Secondary Navigation: Within-Tab Interactions

- **Overview:** Card click expands for detail. No further navigation depth.
- **Capabilities:** Category sidebar acts as sub-navigation. Click a category to filter the skill display.
- **Timeline:** Horizontal scroll (mouse wheel, touch swipe, or arrow keys) navigates chronologically. Card click expands.
- **Portfolio:** Card click/hover reveals additional detail. External links navigate away.
- **Connect:** No navigation — static content.

---

## Responsive Strategy

### Desktop (>1024px)

The full dashboard experience. Multi-column bento grids, side-by-side capability panels, horizontal timeline, and the persistent tab bar + status bar chrome.

- Tab bar: horizontal, centered tabs with full text labels
- Overview: 4-column bento grid
- Capabilities: sidebar (280px) + skill grid (4 columns)
- Timeline: horizontal scroll with snap points
- Portfolio: 2-column card grid
- Status bar: full-width with all metadata items

### Tablet (768-1024px)

Dashboard bar becomes horizontally scrollable tabs (same visual style, but container scrolls if tabs exceed width). This prevents cramped labels.

- Overview: 2-column grid. Metric cards stack into 2x2 blocks. Larger cards remain 2-col span.
- Capabilities: Filter panel collapses to a horizontal selector (dropdown or scrollable pill bar) above the skill grid. Skills display in 3 columns.
- Timeline: Switches from horizontal to **vertical**. Entries stack chronologically top-to-bottom. Education items interleave with experience items in date order. Year markers appear as horizontal dividers.
- Portfolio: Remains 2-column or shifts to single column depending on card content.
- Status bar: Remains persistent at bottom, but "GPhC Registered" badge moves to a second line or hides behind a chevron.

### Mobile (<768px)

The dashboard bar transforms into a **bottom navigation** with 5 icon buttons (matching the 5 tabs). Each icon is from Lucide:
- Overview: `LayoutDashboard`
- Capabilities: `Gauge`
- Timeline: `Clock`
- Portfolio: `FolderOpen`
- Connect: `Mail`

The active tab has a teal dot above its icon and the label displayed below.

- Tab bar moves to bottom, 56px height, with safe area padding for devices with home indicators
- The top of the viewport shows the current tab title + theme toggle only
- Overview: Single-column stack. All metric cards are full-width. Name card at top, metrics below, then supporting cards.
- Capabilities: Category selector as a horizontal scrollable pill bar at top. Skills display in 2 columns below.
- Timeline: Vertical single-column. Full-width cards. Year markers as sticky section headers.
- Portfolio: Single-column card stack. Status badges are prominent.
- Connect: Full-width form, generous touch targets (48px minimum).
- Status bar: Moves to the top of each view as a collapsible banner (tap to expand). Shows only "Open to opportunities" by default with a chevron to reveal full metadata.

### Breakpoint Summary

| Element | Desktop (>1024) | Tablet (768-1024) | Mobile (<768) |
|---------|-----------------|-------------------|---------------|
| Tab bar | Top, horizontal | Top, scrollable | Bottom, icons |
| Status bar | Bottom, full | Bottom, condensed | Top, collapsible |
| Overview grid | 4 columns | 2 columns | 1 column |
| Capabilities | Sidebar + grid | Dropdown + grid | Pills + grid |
| Timeline | Horizontal scroll | Vertical stack | Vertical stack |
| Portfolio | 2 columns | 2 columns | 1 column |
| Card padding | 24px | 20px | 16px |
| Grid gap | 24px | 20px | 16px |

---

## Technical Implementation

### Component Architecture

```
App.tsx
  BootSequence.tsx
  ECGAnimation.tsx (modified exit: multi-trace → grid → cascade)
  Dashboard.tsx (replaces current content phase)
    DashboardTabBar.tsx
      TabButton.tsx
    DashboardContent.tsx (renders active tab panel)
      OverviewTab.tsx
        BentoGrid.tsx
        MetricCard.tsx
        ProfileCard.tsx
        TechStackCard.tsx
      CapabilitiesTab.tsx
        CategorySidebar.tsx
        SkillGaugeGrid.tsx
        SkillGauge.tsx
      TimelineTab.tsx
        TimelineTrack.tsx
        TimelineEntry.tsx
        TimelineMilestone.tsx
      PortfolioTab.tsx
        ProjectCard.tsx
        StatusBadge.tsx
      ConnectTab.tsx
        ContactForm.tsx
    StatusBar.tsx
    ThemeToggle.tsx
```

### State Management

- **Active tab:** React `useState` in `Dashboard.tsx`. Updated on tab click. Synced to URL hash via `useEffect` (writes on change, reads on mount).
- **Tab internal state:** React context (`DashboardContext`) holding: expanded timeline entry ID, selected skill category, expanded overview card ID. This context is not reset on tab switch, enabling state preservation.
- **Theme:** `useState` initialized from `localStorage`, falling back to `prefers-color-scheme` media query. Toggle writes to `localStorage` and applies a `data-theme="dark"` attribute to the document root. All colors reference CSS custom properties.

### CSS Strategy

- Tailwind CSS for utility classes, consistent with the existing project setup
- CSS custom properties for theme-aware colors (defined in `index.css` under `:root` and `[data-theme="dark"]` selectors)
- CSS Grid for bento layouts with explicit `grid-template-columns` and `grid-column: span N` on cards
- CSS `scroll-snap-type: x mandatory` for horizontal timeline on desktop
- `backdrop-filter: blur(12px)` on tab bar for the subtle transparency effect
- `@media (prefers-color-scheme: dark)` as the fallback when no manual toggle has been used

### Tab Transition Implementation

```
Tab switch flow:
1. User clicks new tab
2. Current tab panel: animate out (opacity 1→0, 150ms)
3. Update active tab state
4. New tab panel mounts
5. New tab panel: staggered reveal (each child: opacity 0→1, y 8→0, blur 4→0, 300ms, 40ms stagger)
6. If tab has countup elements (metric cards, skill gauges), countups trigger after reveal
```

Using Framer Motion's `AnimatePresence` with `mode="wait"` to manage the tab panel crossfade. Each tab panel is wrapped in a `motion.div` with `key={activeTab}` to trigger exit/enter animations.

### Performance Considerations

- **Tab panels:** Only the active tab renders its full content. Inactive tabs are unmounted (not hidden with `display: none`) to keep DOM light. State is preserved in context, not in DOM.
- **Metric countups:** Use `requestAnimationFrame`-based animation, not CSS — this allows precise easing control and avoids layout thrashing.
- **Timeline scroll:** Horizontal scrolling uses CSS-native scroll-snap, not JavaScript-controlled positioning.
- **Images:** If project screenshots are added later, use `loading="lazy"` and serve WebP with `<picture>` fallback.
- **Gauge SVGs:** Pre-computed `strokeDashoffset` values stored as constants. No recalculation on render.

### ECG Transition Modifications

The existing `ECGAnimation.tsx` needs modifications for the multi-trace and grid materialization:

1. After the name is complete (current `holdEndTime`), instead of the simple exit phase, the canvas draws two additional traces (teal and coral) at 30% and 70% viewport height.
2. The `bgTransitionedRef` logic changes: background transitions to `#0A1628` instead of `#FFFFFF`.
3. A new phase is added after the multi-trace flatline: vertical grid lines are drawn on the canvas, followed by content-cell placeholder rectangles.
4. The canvas fade-out timing is adjusted to overlap with the React dashboard mount, so the grid drawn on canvas aligns pixel-perfectly with the CSS Grid rendered by React.
5. The `onComplete` callback fires after the grid materialization, triggering the phase switch from `'ecg'` to `'content'`.

---

## Accessibility

### Keyboard Navigation

The tab-based interface maps naturally to the ARIA tabs pattern:

- `Tab` moves focus between the tab bar and the active tab panel
- `ArrowLeft` / `ArrowRight` moves between tabs when the tab bar is focused
- `Enter` / `Space` activates a focused tab
- Within the active panel, `Tab` navigates through interactive elements in document order
- In Timeline tab: `ArrowLeft` / `ArrowRight` scrolls the timeline by one year; `Enter` / `Space` expands the focused timeline entry
- Number keys `1`-`5` activate tabs directly (when tab bar is focused)

### ARIA Roles and Labels

- Tab bar: `role="tablist"`, each tab `role="tab"` with `aria-selected`, each panel `role="tabpanel"` with `aria-labelledby`
- Metric cards: `aria-label` with full context, e.g., `aria-label="14,000 patients identified for cost-effective switching through Python-based algorithm"`
- Skill gauges: `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`, `role="progressbar"`, `aria-label="Python proficiency: 90 percent"`
- Status bar: `aria-live="polite"` region, so dynamic updates (if any) are announced
- Timeline entries: `role="article"` with expandable content using `aria-expanded`
- Status dots: `aria-hidden="true"` (decorative; the semantic information is in adjacent text)

### Color and Contrast

- All text meets WCAG 2.1 AA contrast requirements in both light and dark modes
- The zinc neutral scale is specifically chosen for reliable contrast ratios
- Status dots are never the sole indicator of state — they always accompany text labels
- Focus indicators: 2px blue outline with 2px offset, visible in both themes
- The theme toggle is not required to use the site — both themes meet accessibility standards independently

### Motion and Preferences

- All animations respect `prefers-reduced-motion`. When reduced motion is preferred:
  - Tab crossfades become instant switches (no animation)
  - Metric countups display final values immediately
  - Gauge animations are disabled; gauges render at their target values
  - Card hover lifts are disabled
  - Status dot pulse is disabled
  - ECG transition skips to final state after a brief hold

### Screen Reader Experience

The tab-based navigation provides a clear, navigable structure for screen readers:
1. User encounters the tab bar with 5 clearly labeled tabs
2. Activating a tab announces the panel label
3. Within each panel, content is structured with headings (`h2` for section titles, `h3` for individual entries)
4. Metric cards read as: "[Value] [Label]. [Additional context from aria-label]"
5. The status bar is announced on page load and when content changes

---

## What Makes This Special

**The medium IS the message.** By presenting his CV as a dashboard, Andy demonstrates his analytical mindset through the navigation itself. A recruiter doesn't just read about Andy's ability to create data systems — they experience one. The information architecture of the site is itself a portfolio piece.

**Numbers lead.** Every other CV website puts prose first and numbers second. This design inverts that: the first thing you see is a grid of metric cards with large Geist Mono numbers. "14,000 patients." "14.6M programme." "220M budget." These numbers are more compelling than any paragraph of self-description, and presenting them in a dashboard context makes them feel quantitative and verifiable rather than resume-inflated.

**The density is the point.** Most portfolio sites are spacious, scrolling single-column affairs with generous whitespace. This design deliberately goes the other direction: high density, multiple data points visible simultaneously, information that rewards careful reading. This says "I am comfortable with complexity" in a way that minimal designs cannot.

**The ECG transition earns its keep.** The multi-trace multiplication and grid materialization aren't just visually interesting — they tell a story. Raw clinical signals (vital signs) transform into organized, structured data (dashboard grid). This is literally what Andy does: he takes messy prescribing data and turns it into actionable analytics. The transition is a 3-second visual metaphor for his career.

**Adaptive theming signals engineering maturity.** Supporting both light and dark modes with a manual toggle and `prefers-color-scheme` respect is a technical detail that fellow developers and technical recruiters will notice and appreciate. It signals awareness of modern frontend standards.

**The status bar adds ambient context.** "Open to opportunities" is visible on every single tab view without requiring the user to navigate to a contact page. It's a constant, low-key signal — like a system indicator light — that communicates availability without being pushy. This is a detail borrowed from actual operational dashboards, where system status is always visible.

**Tab persistence respects the user's exploration.** Preserving expanded state across tab switches communicates respect for the user's time and attention. It says: "I built this thoughtfully." It's a subtle UX detail that most portfolio sites don't consider, because most portfolio sites don't have this level of navigational complexity to manage.
