# Carousel Redesign — Design Debate V2 (Agent-Driven Ideas)

> Round 2: Each agent proposes their OWN original design for the "Significant Interventions" project showcase.
> Priority constraint: Must not look displaced from the GP clinical system theme (EMIS/SystmOne aesthetic).

---

## Context from Round 1

In the previous debate, agents critiqued a user-proposed center-focus carousel and unanimously rejected it. However, they converged too quickly on "keep the current layout with minor tweaks" without exploring enough novel alternatives. This round, each agent brings their OWN original design concept.

### Current implementation
- Desktop (>=1024px): Continuous auto-scroll carousel showing 4 project cards at once
- Each card: thumbnail (16:9), title + year + live pill, result summary, tech stack tags, skills tags
- Hover overlay: "Intervention Outcomes" list with results
- Click opens detail panel
- Mobile (<1024px): Embla slide-by-slide carousel

### Data: 6 projects
Each has: `name`, `requestedYear`, `status` (Complete/Ongoing/Live), `resultSummary`, `methodology` (24-73 words), `results[]` (3-5 items), `techStack[]` (2-8 items), `skills[]` (2-6 items), optional `externalUrl`/`demoUrl`/`thumbnail`

### Design system
- Primary: Teal #00897B / Accent: Coral #FF6B6B
- PMR palette: GP system-inspired greens, teals, greys
- Font tokens: --font-ui (Elvaro Grotesque), --font-geist-mono (Geist Mono/Fira Code), --font-primary (Plus Jakarta Sans), --font-secondary (Inter Tight)
- Sidebar width: --sidebar-width: 304px (affects content area)
- Breakpoints: xs 480, sm 640, md 768, lg 1024, xl 1280

---

## Agent Proposals

### UX Designer (bencium-innovative-ux-designer skill)

#### Proposal: "Investigation Results Flowsheet"

**Core concept:** Replace the carousel entirely with a pattern directly lifted from GP clinical systems — the **investigation results flowsheet**. In EMIS Web, when a clinician views lab results (blood tests, imaging, etc.), they see a **compact horizontal grid** where each column is a test date/panel and each row is a parameter. The user scans across columns to see trends. I'm adapting this pattern for project showcase.

**Why this fits:** The section is literally called "Significant Interventions" with data typed as `Investigation[]`. A flowsheet is the native presentation for investigation results in GP software. This is the one pattern that would make a clinician (or anyone familiar with EMIS/SystmOne) instantly recognize the metaphor.

---

##### Layout Structure

**Desktop (>=1024px):**

```
┌─────────────────────────────────────────────────────────────┐
│ ● SIGNIFICANT INTERVENTIONS                    6 of 6 shown │
├──────────────┬──────────┬──────────┬──────────┬─────────────┤
│              │ PharMe.. │ Patient  │ Blueteq  │  ► scroll   │
│              │   2025   │ Switch.. │   2023   │             │
│              │  [Live]  │   2025   │          │             │
├──────────────┼──────────┼──────────┼──────────┼─────────────┤
│  Thumbnail   │  [img]   │  [img]   │  [img]   │             │
├──────────────┼──────────┼──────────┼──────────┼─────────────┤
│  Key Result  │ Live at  │ 14,000   │ 70%      │             │
│              │ medici.. │ patients │ reduction│             │
├──────────────┼──────────┼──────────┼──────────┼─────────────┤
│  Status      │  ● Live  │ ● Done   │ ● Done   │             │
├──────────────┼──────────┼──────────┼──────────┼─────────────┤
│  Tech Stack  │ React,   │ Python,  │ Python,  │             │
│              │ TS, D3.. │ Pandas.. │ SQL      │             │
├──────────────┼──────────┼──────────┼──────────┼─────────────┤
│  Domain      │ Health   │ Med Opt  │ High-    │             │
│              │ Econ..   │ Prescr.. │ Cost..   │             │
└──────────────┴──────────┴──────────┴──────────┴─────────────┘
                          Click any column → Detail Panel
```

**Anatomy:**
- **Fixed left column (~110px):** Row labels ("Thumbnail", "Key Result", "Status", "Tech Stack", "Domain") styled as field names, like the parameter names in a lab results flowsheet. Font: `--font-geist-mono`, 10px, uppercase, `var(--text-tertiary)`.
- **Project columns (~155-180px each):** Each project occupies one column. The column header shows project name (truncated with tooltip), year, and optional Live pill. Below, each row cell shows the corresponding data.
- **Horizontal scroll:** At 1024px with ~720px content, the label column + 4 project columns fit. The remaining 2 projects are reached via horizontal scroll or arrow buttons. At 1280px+, all 6 columns may fit without scrolling.
- **Column header row:** Project name in `--font-ui` at 13px/600, year in `--font-geist-mono` at 11px. Sticky so it stays visible during any vertical overflow scenario.

**Interaction model:**
- **Column hover:** The entire column highlights with a subtle `var(--accent-light)` background wash (2px left/right border in `var(--accent-border)`). This is exactly how EMIS highlights a selected result column.
- **Column click:** Opens the detail panel for that project. The entire column is the click target (generous hit area).
- **Keyboard:** Tab moves between columns. Enter/Space opens detail panel. Arrow left/right navigates columns.
- **No auto-scroll, no animation loop.** Static grid. Scroll position is user-controlled.

**Key Result row — the hero row:**
- This is the `resultSummary` field, rendered in `--font-geist-mono` at 13px bold, color `var(--accent)` (#FF6B6B). It's the visual anchor of each column — the equivalent of an abnormal lab result flagged in red.
- In GP flowsheets, abnormal results get color-flagged. Here, the result summary plays that role — it's the "headline number" that catches the eye.

**Thumbnail row:**
- 16:9 aspect ratio, border-radius 4px, `border: 1px solid var(--border-light)`.
- Compact but recognizable. At ~155px column width, the thumbnail is 155x87px — enough to see "it's a dashboard" or "it's a video" without needing to read tiny text.

**Tech Stack / Domain rows:**
- Pill tags, same styling as current. At column width, show 2 tags max with `+N` overflow. All tags visible simultaneously across all projects — the scanning advantage the Portfolio Expert identified in Round 1.

---

##### Why This Is Better Than the Current Carousel

1. **All 6 projects visible at once** (at 1280px+) or 4 visible + 2 scrollable (at 1024px). No carousel pagination, no auto-scroll, no dots.

2. **Comparison is native.** A flowsheet is literally a comparison tool. A hiring manager can scan the "Tech Stack" row horizontally and see Python appears 4 times, React twice. They can scan "Key Result" and see quantified outcomes side by side. The carousel forces sequential viewing; the flowsheet enables parallel scanning.

3. **The clinical metaphor is airtight.** This IS how investigation results are displayed in EMIS Web. The section is called "Significant Interventions" and the data type is `Investigation`. A flowsheet is the canonical presentation.

4. **Information density is maximized.** Every row shows all projects simultaneously. The carousel shows 4 cards but requires hover to see results. The flowsheet shows results, tech stack, domain, status, AND thumbnail for all visible projects without any interaction.

5. **No interaction overhead for discovery.** The carousel needs hover to reveal outcomes. The flowsheet shows everything in the resting state. The only interaction is clicking to open the detail panel for the deep dive.

---

##### Responsive Strategy

- **>=1280px:** All 6 columns visible. No horizontal scroll needed. Label column + 6 project columns.
- **1024-1279px:** Label column + 4 columns visible. Horizontal scroll indicator (subtle fade mask on right edge, like the current carousel). Arrow buttons for scrolling.
- **768-1023px:** Switch to a **card list** — vertical stack of compact horizontal cards (thumbnail left, metadata right), one per project. No table/grid. This is similar to EMIS's mobile/tablet investigation list view.
- **<768px:** Same card list but full-width cards stacked vertically. Thumbnail on top, metadata below.

---

##### Motion Spec

- **Column hover:** Background color transition 150ms ease. Border-left/right appear at 120ms.
- **Horizontal scroll (if needed):** CSS `scroll-behavior: smooth` with `scroll-snap-type: x mandatory` and `scroll-snap-align: start` on each column. No JS animation.
- **Detail panel open:** Existing slide-in animation (already implemented).
- **Reduced motion:** All transitions set to 0ms. Scroll-behavior: auto.

---

##### Accessibility

- `role="grid"` on the container, `role="row"` on each horizontal row, `role="columnheader"` on column headers, `role="gridcell"` on data cells.
- `aria-label="Investigation results for 6 projects"` on the grid.
- Column headers get `aria-sort` if we add any sorting (future consideration).
- Each column is a focusable group. Arrow keys navigate the grid (standard grid navigation pattern per WAI-ARIA).
- Screen reader announces: "PharMetrics, 2025, Live. Key Result: Live at medicines.charlwood.xyz. Tech Stack: React, TypeScript, D3 and 4 more. Domain: Health Economics and 2 more."

---

##### Risks and Tradeoffs

- **Visual drama:** A flowsheet grid is utilitarian. It won't have the visual impact of cards with large thumbnails. But that's the point — the portfolio's aesthetic IS utilitarian clinical software. The drama comes from the data density and the recognition of the pattern.
- **Thumbnail size:** At ~155px wide, thumbnails are smaller than the current card thumbnails (~171px). This is a minor reduction and the thumbnails still serve their purpose (showing "I built a real thing").
- **Novelty:** This is a genuinely unusual pattern for a portfolio. It could read as too clinical for someone unfamiliar with GP software. But the ENTIRE portfolio is GP software aesthetic — if someone has gotten this far, they're already bought into the metaphor.
- **Horizontal scroll at 1024px:** Having 2 columns off-screen is a mild UX cost. Mitigated by scroll snap, arrow buttons, and a visible fade mask indicating more content.

### Portfolio Expert (interactive-portfolio skill)

**Proposal: "Outcomes Dashboard" — KPI-Led Project Grid with Inline Evidence**

#### Core concept

Stop thinking of this as a "project showcase" and start thinking of it as an **outcomes dashboard**. The most compelling thing about these 6 projects isn't what they look like — it's what they achieved. A hiring manager doesn't care about carousel animations or thumbnail compositions. They care about: "Can this person deliver measurable results?"

The design leads with **quantified outcomes as the primary visual element** — large, bold numbers in the style of KPI/metric cards already used in the `PatientSummaryTile` — with project details accessible through a compact expandable row beneath each metric. This mirrors the pattern used throughout GP clinical software where key clinical values (BP, HbA1c, eGFR) are shown prominently with the investigation details available on drill-down.

#### Why "outcomes first" is the right hierarchy

Andy's portfolio has an unusual strength: **every single project has a quantifiable result.** Most developer portfolios say "built a website" or "created an API." Andy's says "14,000 patients identified" and "70% reduction in forms" and "£2.6M savings." This is the killer differentiator. The design should make these numbers impossible to miss.

The current carousel buries the `resultSummary` — it's a small 12px bold line below the project name, competing with the 16:9 thumbnail above it and the tech tags below it. The outcome is one of five visual elements per card. It should be the ONLY thing a visitor reads first.

#### Layout structure (desktop >= 1024px)

```
┌──────────────────────────────────────────────────────────────────┐
│ ● SIGNIFICANT INTERVENTIONS                          6 results   │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ 14,000          │  │ 70%             │  │ £2.6M           │  │
│  │ patients         │  │ reduction        │  │ savings          │  │
│  │ identified       │  │ in forms         │  │ potential        │  │
│  │                  │  │                  │  │                  │  │
│  │ Patient Switch.. │  │ Blueteq Gen..   │  │ (same project-  │  │
│  │ 2025  Python SQL │  │ 2023  Python SQL│  │  detail line)    │  │
│  │ ● Complete       │  │ ● Complete       │  │ ● Complete       │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ Live            │  │ Population      │  │ 9 chart types   │  │
│  │ medicines.      │  │ -scale          │  │ sub-50ms        │  │
│  │ charlwood.xyz   │  │ OME tracking    │  │ responses       │  │
│  │                  │  │                  │  │                  │  │
│  │ PharMetrics     │  │ CD Monitoring   │  │ Pathway Analys. │  │
│  │ 2025  React TS  │  │ 2024  Python SQL│  │ 2024  Python... │  │
│  │ ● Live          │  │ ● Complete       │  │ ● Demo          │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Each cell is a project card with this anatomy:**

1. **Hero metric** (top ~60% of card): The `resultSummary` parsed into its numeric/quantified component, rendered at ~24-28px bold `--font-geist-mono`, color `var(--accent)`. This is the visual anchor — like the KPI value in `MetricCard` but applied to projects.
   - "14,000 patients identified" → **14,000** (large) + "patients identified" (small subtitle)
   - "70% reduction in forms" → **70%** (large) + "reduction in forms" (small subtitle)
   - "Live at medicines.charlwood.xyz" → **Live** (large) + "medicines.charlwood.xyz" (small, teal link)
   - "Population-scale OME tracking" → **Population-scale** (large) + "OME tracking" (small subtitle)
   - "9 interactive chart types, sub-50ms" → **9 chart types** (large) + "sub-50ms responses" (small subtitle)
   - "Shared nationally" → **Nationally shared** (large) + "across Tesco Pharmacy" (small subtitle)

2. **Project identity** (bottom ~40% of card): Project name (13px, `--font-ui`, 500 weight), year + primary tech tags (11px mono), status indicator.

3. **No thumbnail in the default grid view.** Thumbnails appear in the detail panel on click. The metrics ARE the visual hook — they're more compelling than screenshots.

#### The 30-second test — this design wins it

**0-3 seconds (passive scan):** Six large numbers/phrases jump out: 14,000 — 70% — £2.6M — Live — Population-scale — 9 chart types. The visitor's brain immediately registers: "This person delivers measurable, quantified results." This is the strongest possible first impression.

**3-10 seconds (reading):** The subtitles explain the numbers: patients identified, reduction in forms, savings potential. The tech tags show Python/React/SQL breadth. The status dots show most are complete.

**10-30 seconds (engagement):** The visitor clicks the most impressive metric card. Detail panel opens with full methodology, results list, thumbnail, and links.

Compare to the current carousel at 0-3 seconds: visitor sees 4 thumbnail images of dashboards (requires visual parsing), reads 4 project titles (generic), then may notice the small 12px result summaries. The "wall of outcomes" in my proposal is immediately more impactful.

#### Why this fits the GP clinical system theme

GP clinical software has a well-established pattern of "key clinical values displayed prominently in a summary view":

- **EMIS Web's Patient Summary**: Shows key values (BP: 128/82, BMI: 24.3, HbA1c: 52) as large numbers with date stamps and trend indicators
- **SystmOne's Clinical Dashboard**: Uses metric tiles for key measurements — exactly the pattern in `PatientSummaryTile`
- **Both systems**: The "latest results" view shows the most recent investigation value prominently, with the investigation name and date secondary

My proposal applies this same pattern: the **outcome value is the hero** (like a clinical measurement), the **project name is the investigation source** (like the test name), and the **detail panel is the full report** (like clicking through to the lab report).

This is also consistent within the portfolio itself. The `PatientSummaryTile` already uses `MetricCard` components showing KPIs as large numbers (7+ years, 3 domains, etc.). My proposal extends that same visual language to projects. The dashboard would have a natural visual rhythm: KPI metrics → Project outcome metrics → Timeline → Skills.

#### Grid layout specifics

- **3 columns x 2 rows** = 6 cells, all visible without scrolling
- At 1024px (720px content): each cell ~226px wide, ~140px tall. Comfortable.
- At 1280px (976px content): each cell ~312px wide. Very spacious.
- At 1440px+: each cell ~362px wide. Luxurious.
- Gap: 12px (matches existing `gap` in carousel)
- Card styling: `var(--surface)` background, `1px solid var(--border-light)` border, `var(--radius-sm)` corners — identical to existing `MetricCard` styling

#### Interaction model

- **Hover**: Border color shifts to `var(--accent-border)`, subtle shadow appears. The hero metric number pulses to `var(--accent)` if it wasn't already (minor emphasis). A "View investigation →" CTA fades in at the bottom right (11px mono, same style as `MetricCard`'s "View evidence →").
- **Click**: Opens existing detail panel with full project details, thumbnail, methodology, results, links.
- **Keyboard**: Tab navigates between cards (standard grid), Enter/Space opens detail panel.

#### Responsive behavior

- **>= 1024px**: 3x2 grid. All 6 visible. Zero interaction required to see everything.
- **768-1023px**: 2x3 grid. All 6 still visible, just reorganized. Cards are ~340px wide — very comfortable.
- **480-767px**: 2x3 grid with smaller cards (~220px wide). Still all visible.
- **< 480px**: 1-column stack. 6 cards vertically. Scroll to see all, but each card is compact (~80px tall) so all 6 fit in roughly 540px of scroll — less than one mobile viewport height.

No carousel at ANY breakpoint. No pagination. No arrows. No dots. Just a grid.

#### What this sacrifices — and why it's worth it

1. **Thumbnails in the default view.** Gone. They live in the detail panel. The metrics are more compelling than dashboard screenshots at any size. This was established in Round 1: 5 of 6 thumbnails are busy tool UIs that don't work as marketing imagery.

2. **Visual variety between cards.** Every card has the same structure (big number + project details). This creates uniformity. But uniformity IS the clinical aesthetic — EMIS shows every investigation result in the same format. Consistency is a feature, not a bug.

3. **The "cool factor" of animation.** A static 3x2 grid has no motion, no scroll, no dynamism. Countered by: the Career Constellation provides all the visual dynamism the dashboard needs. The projects section's job is to convert, not to entertain.

4. **Embla carousel dependency.** If this is the only consumer of embla-carousel-react, removing the carousel removes a dependency. Simpler build, fewer node_modules.

#### Sorting and the "best foot forward" problem

The grid's 3x2 layout creates a natural reading order: top-left → top-right → bottom-left → bottom-right (Z-pattern). The first three cells get the most attention.

I'd sort by **impact magnitude**, not chronologically:
1. **14,000 patients identified** (top-left — biggest number)
2. **£2.6M savings** (top-center — biggest financial figure; note: this is the SAME project as #1, Patient Switching Algorithm, so we'd use the £2.6M framing instead)
3. **70% reduction in forms** (top-right — impressive percentage)

Wait — the Patient Switching Algorithm has TWO headline numbers (14,000 patients AND £2.6M savings). This is actually an argument for leading with £2.6M since it's the financial outcome that health-tech hiring managers understand immediately.

Revised sort for maximum first-row impact:
1. **£2.6M** savings potential — Patient Switching Algorithm
2. **70%** reduction in forms — Blueteq Generator
3. **Live** at medicines.charlwood.xyz — PharMetrics

Second row:
4. **9** interactive chart types — Patient Pathway Analysis
5. **Population-scale** OME tracking — CD Monitoring System
6. **Nationally shared** — NMS Training Video

This puts the strongest financial outcomes top-left and top-center, where eye tracking shows the most attention.

#### Implementation estimate

- ~120-150 lines of JSX + styles
- One component: `ProjectsOutcomesGrid` (replaces `ProjectsCarousel`)
- No external dependencies (drop Embla)
- Reuses `CardHeader`, `openPanel({ type: 'project', investigation })`, `PROJECT_STATUS_COLORS`
- Result parsing: a small utility to split `resultSummary` into hero number + subtitle (could be a `heroMetric` field on the data, or a parser function)
- Estimated LOC reduction: current ~490 lines → ~150 lines

### Frontend Design Expert (frontend-design skill)

**Proposal: "Investigation Results Grid" — 3x2 Card Grid with Inline Row Expansion**

#### Core Concept

Replace the carousel with a **static 3x2 card grid** on desktop. Same card design as today — thumbnail, title, resultSummary, tags — rendered in CSS Grid instead of a carousel track. Click a card to expand it inline across the full row (`gridColumn: 1 / -1`), revealing methodology, full results list, full tags, and a "View Full Record" link. Escape or click collapses.

No carousel, no auto-scroll, no pagination, no Embla, no rAF loop, no DOM duplication. All 6 projects visible at every breakpoint.

**Design move:** Keep the existing card aesthetic (it works, it matches the clinical theme), kill the carousel container (which doesn't). The cards were never the problem — the sequential-discovery mechanics were.

#### Why a Grid, Not a Flowsheet, Not KPI Tiles

**vs. Flowsheet:** Requires ~1050px minimum for all 6 columns. At 1024px (720px content), 2 projects hidden behind horizontal scroll — same flaw as carousels. Label column wastes ~110px on self-evident row names. Flowsheets optimize for cross-item comparison (trend tracking); hiring managers need scan-and-select (find the most impressive thing). Wrong cognitive task.

**vs. KPI tiles:** Only 2 of 6 projects have clean numeric resultSummaries. "Population-scale OME tracking" at 24-28px bold mono looks like a design compromise. Removing thumbnails removes proof-of-work. 6 more metric cards below 4 existing MetricCards = ~10 identical boxes = monotony.

**My proposal:** Cards keep thumbnails (proof-of-work) AND show resultSummary prominently (outcome visibility), no text parsing fragility, all 6 scannable without horizontal scroll or carousel arrows.

#### Layout

**Desktop >= 1024px: 3 x 2 grid**

```
┌─────────────────────────────────────────────────────────┐
│ ● SIGNIFICANT INTERVENTIONS             6 investigations│
├─────────────────┬─────────────────┬─────────────────────┤
│ [  thumbnail  ] │ [  thumbnail  ] │ [   thumbnail    ]  │
│ PharMetrics     │ Patient Switch  │ Blueteq Gen         │
│ 2025  [Live]    │ 2025            │ 2023                │
│ "Live at med.." │ "14,000 pat.."  │ "70% reduction"     │
│ React TS D3 +4  │ Python Pandas+1 │ Python SQL           │
│ HealthEcon +2   │ MedsOpt +2      │ HighCost +2          │
├─────────────────┼─────────────────┼─────────────────────┤
│ [  thumbnail  ] │ [  thumbnail  ] │ [   thumbnail    ]  │
│ CD Monitoring   │ NMS Video       │ Pathway Analysis     │
│ 2024            │ 2018            │ 2023                │
│ "Pop-scale OME" │ "Shared nat.."  │ "9 chart types"     │
│ Python SQL      │ Video Prod      │ Python Dash +6       │
│ ContDrugs +2    │ Training +2     │ HealthEcon +5        │
└─────────────────┴─────────────────┴─────────────────────┘
```

**Inline expansion on click** — card spans full row, side-by-side detail:

```
┌─────────────────────────────────────────────────────────┐
│ ┌───────────────────────────────────────────────────┐   │
│ │ [   large thumbnail  ] │ Patient Switching Algo   │   │
│ │        ~40%            │ 2025 · ● Complete        │   │
│ │                        │ "14,000 patients"        │   │
│ │                        │ Python-based algo using  │   │
│ │                        │ real-world GP data...    │   │
│ │                        │ ● 14,000 patients..     │   │
│ │                        │ ● £2.6M savings..       │   │
│ │                        │ ● £2M on target..       │   │
│ │                        │ Python Pandas SQL        │   │
│ │                        │ HealthEcon MedsOpt +1   │   │
│ │                        │ ▸ View Full Record →    │   │
│ └───────────────────────────────────────────────────┘   │
├─────────────────┬─────────────────┬─────────────────────┤
│ CD Monitoring   │ NMS Video       │ Pathway Analysis     │
└─────────────────┴─────────────────┴─────────────────────┘
```

Accordion-within-grid pattern — mirrors `TimelineInterventionsSubsection`. Users already understand expand/collapse. "View Full Record" mirrors "View evidence" in MetricCard.

#### Pixel Specifications

| Viewport | Content | Card width | Thumb h | Grid height |
|---------|---------|-----------|---------|------------|
| 1280px | 976px | 317px | 178px | ~582px |
| 1024px | 720px | 232px | 131px | ~532px |
| 768px | 768px | 378px (2-col) | 213px | ~864px |
| <480px | full | full (1-col) | 270px | stacked |

At 1024px: **232px** per card vs. **171px** current (4-per-view) — 36% wider. Less truncation.

Expanded at 1280px: `gridColumn: 1 / -1` = 976px. Thumb 40% / content 60%. Height auto ~280-340px. Framer Motion `layout` + `AnimatePresence`.

#### Responsive Behavior

| Breakpoint | Cols | All visible? | Expansion |
|-----------|-----|-------------|-----------|
| >= 1024px | 3 | Yes | Spans 3 cols |
| 768-1023px | 2 | Yes | Spans 2 cols |
| 480-767px | 2 | Yes | Spans 2 cols |
| < 480px | 1 | Yes (scroll) | Inline |

One component, all breakpoints. No mode switching. No two-carousel maintenance.

#### Implementation

**Delete:** `EmblaProjectsCarousel` (~120 lines), `ContinuousScrollCarousel` (~250 lines), `ProjectsCarousel` (~20 lines) = **~390 lines.**
**Add:** `ProjectsGrid` (~40 lines), `ExpandedProjectCard` (~80-100 lines), CSS rules (~10 lines) = **~130 lines.**
**Net: -260 lines.** Embla + Autoplay removable.

Existing `ProjectItem` stays with minor prop changes. Hover overlay removed — replaced by simple border/shadow. Progressive disclosure: grid (scan) → expand (details) → detail panel (deep dive).

#### Accessibility

- Cards: `role="button"`, `tabIndex={0}`, descriptive `aria-label`
- Expanded: `aria-expanded`, `aria-live="polite"`
- Enter/Space expand, Escape collapse
- No auto-content — WCAG 2.2.2 satisfied by default

#### What This Sacrifices

1. **Vertical space:** ~532-582px vs. ~285px carousel. Pushes timeline down.
2. **Motion on load:** No auto-scroll. ECG + Constellation provide dashboard motion.
3. **Novelty:** A card grid is not novel. Scannability and theme coherence matter more.

---

## Debate Log

### Round 1: Initial critiques

**Portfolio Expert → UX Designer's Flowsheet:**

I like that we both independently abandoned the carousel. The flowsheet is authentically clinical and the metaphor is strong. But I have three concerns:

1. **Horizontal scroll at 1024px is a deal-breaker.** Your layout needs ~110px label column + 6 x ~155px project columns + gaps = ~1050px minimum. At 1024px viewport (720px content), you can only show 4 columns. That means 2 projects are hidden behind a scroll. We argued in Round 1 that hiding projects behind interaction is the carousel's weakness. Your flowsheet has the same problem at the most common laptop viewport.

2. **The flowsheet pattern prioritizes comparison over conversion.** A clinician uses a flowsheet to compare values across dates — "is the HbA1c trending up or down?" But a hiring manager isn't comparing projects against each other. They're scanning for "is any of this impressive enough to investigate further?" That's a different cognitive task. The flowsheet optimizes for the wrong scan pattern.

3. **The fixed label column wastes space.** 110px for row labels like "Thumbnail," "Key Result," "Status," "Tech Stack," "Domain" — these are obvious from context. A hiring manager doesn't need a label to know that "14,000 patients identified" is a result or that "Python, SQL" is a tech stack. That 110px could be redistributed to project columns, potentially eliminating the horizontal scroll.

4. **Thumbnail rows in a flowsheet create visual noise.** Six small thumbnails in a row, separated by grid lines, will look like a filmstrip. At 155x87px, each thumbnail shows a tiny, hard-to-parse dashboard screenshot. This adds visual weight without information value. Compare to my proposal where thumbnails are removed entirely from the default view — cleaner, and the detail panel shows them at a usable size.

Where we agree strongly: abandoning the carousel, showing all projects simultaneously, leading with outcomes, and maintaining clinical theme fidelity. Our proposals are actually much closer to each other than either is to the current carousel or the Round 1 focus-carousel proposal.

**UX Designer → Portfolio Expert's Outcomes Dashboard:**

Strong proposal. The "outcomes first" hierarchy is the best insight either of us has had — the `resultSummary` IS the most compelling content per project and the current design buries it. The 3x2 grid showing all 6 at 1024px is a genuine advantage over my flowsheet. Sorting by impact magnitude is excellent.

Four concerns:

1. **The metric parsing problem is fragile.** You need to split `resultSummary` into "hero number" + "subtitle." But only 2 of 6 projects have clean numeric metrics:
   - "14,000 patients identified" → clean: **14,000** / "patients identified"
   - "70% reduction in forms" → clean: **70%** / "reduction in forms"
   - "£2.6M savings potential" → clean-ish but this is the SAME project as 14,000 (Patient Switching Algorithm)
   - "Live at medicines.charlwood.xyz" → **Live** as a hero metric is weak at 24-28px bold
   - "Population-scale OME tracking" → no number at all. **Population-scale** is a description, not a KPI
   - "Shared nationally across Tesco Pharmacy" → **Nationally shared** — also not a metric
   - "9 interactive chart types, sub-50ms responses" → two metrics competing

   A KPI dashboard where 3 of 6 cards show bolded words instead of numbers looks inconsistent. The typographic treatment (huge mono font) designed for "14,000" and "70%" creates awkward visual weight on "Live" and "Population-scale."

2. **Removing thumbnails entirely removes proof-of-work.** Your own Round 1 argument: thumbnails prove "I built real software." Without them, the grid is pure text. A hiring manager sees "14,000 patients identified, Python, SQL" but no visual evidence anything was built. Thumbnails — even small — show dashboards, UIs, data visualizations. That's evidence the detail panel won't reach for visitors who don't click through.

3. **Visual monotony.** Six identical metric cards in 3x2 creates flat texture. The dashboard already has `PatientSummaryTile` with metric cards. Adding 6 more in the same style gives the page ~10 same-shaped metric cards. That's repetition, not cohesion. My flowsheet avoids this with different row types (thumbnail, text, tags) creating visual variety.

4. **NMS Training Video as a metric card.** "Nationally shared" at 24-28px bold mono font, next to "14,000" and "70%"? The visual weight mismatch between quantitative and qualitative outcomes would make the grid look uneven.

**Where I concede to the Portfolio Expert's critique of my flowsheet:**

- The **horizontal scroll at 1024px** IS a real problem. I concede this. If 2 projects are hidden, the flowsheet has the same weakness I criticized in carousels.
- The **fixed label column wasting 110px** is a valid point. The row labels ARE self-evident from context. Dropping them would free ~110px, but then the grid loses its "flowsheet" identity and becomes... just a table. Which may actually be fine.
- The **comparison vs. conversion** framing is the strongest critique. Flowsheets optimize for "track trends across time" — a hiring manager needs "find the most impressive thing quickly." That's a scan-and-select pattern, not a compare pattern.

**My counter-proposal — hybrid:**

Take the Portfolio Expert's 3x2 grid (solves horizontal scroll) but restructure each card to keep what both proposals get right:
- **Hero result** at the top of each card (Portfolio Expert's insight) — but keep `resultSummary` as a single styled string rather than parsing into number + subtitle. Just render the full string at ~14-16px bold mono in `var(--accent)`. Avoids the fragile parsing problem while still leading with outcomes.
- **Compact thumbnail** below the result (my argument for proof-of-work). At ~226px card width and 16:9 ratio, that's 226x127px — small but functional. Crop to 3:2 or 4:3 if vertical space is tight.
- **Project name + year + status** below thumbnail.
- **Tech/domain tags** at the bottom.
- Click opens detail panel as before.

This gives us: outcomes-first (Portfolio Expert), proof-of-work thumbnails (UX Designer), all 6 visible (both), no metric parsing fragility (UX Designer), 3x2 grid at 1024px (Portfolio Expert), and clinical aesthetic (both).

**Portfolio Expert response to UX Designer's critique + hybrid:**

I'll take the concessions first, then push back on one point, then address the hybrid.

**What I concede:**

1. **Metric parsing fragility — you're right.** I was so taken with the KPI visual that I didn't honestly assess the data. Only 2 of 6 (`14,000` and `70%`) have clean numeric heroes. `£2.6M` is technically a third but it belongs to the same project as `14,000`. "Population-scale" and "Nationally shared" rendered at 24-28px bold mono would look like an awkward design compromise, not a deliberate choice. The inconsistency between quantitative metrics (14,000, 70%) and qualitative descriptions (Population-scale, Live) would undermine the visual system. I withdraw the large-type parsed metric approach.

2. **Visual monotony — valid.** I looked at `PatientSummaryTile` again. It already renders 4 `MetricCard` components (7+, 3, 15+, 55+). Adding 6 more same-shaped metric cards directly below creates a wall of ~10 identical boxes. That's not cohesion, it's monotony. The dashboard needs texture variation between sections.

3. **Thumbnails — I'm partially reversing my position.** My Round 1 argument was that 5 of 6 thumbnails are busy dashboard screenshots that don't work as hero images. That's still true at hero scale. But at 226x127px inside a compact card, thumbnails serve a different function: they're proof-of-work icons. You don't need to read the tiny chart labels — you just need to see "this is a real application with a real UI." That visual evidence matters at the browse layer. Removing it entirely was too aggressive.

**Where I push back — the result summary rendering:**

Your hybrid proposes rendering `resultSummary` "as a single styled string at ~14-16px bold mono." This is safer than my parsed approach, but it still has a sizing problem:

- "Live at medicines.charlwood.xyz" = 30 characters
- "9 interactive chart types, sub-50ms responses" = 46 characters
- "Shared nationally across Tesco Pharmacy" = 40 characters

At 14-16px mono in a 226px card (minus padding = ~194px usable), the longest result wraps to 3 lines. The shortest ("14,000 patients identified" = 27 chars) fits in ~1.5 lines. That's a 1.5-3 line height variance in the hero element, which creates ragged card tops in the grid.

**Two fixes:**
- (a) Truncate all result summaries to ~30 characters with ellipsis in the card, full string in the detail panel. This is lossy.
- (b) Use a fixed height for the result area (e.g., 48px = ~3 lines at 14px) and let shorter results have whitespace below them. Vertically align them to the top so the text anchors consistently. This creates even card tops at the cost of some empty space.

I'd go with (b). The whitespace is acceptable — it's how clinical systems handle variable-length values in fixed-height cells.

**On the hybrid overall — I'm 80% sold:**

The hybrid card structure (result → thumbnail → name/year → tags) is genuinely better than either of our original proposals. It takes the strongest elements from each:

- Outcomes-first hierarchy (mine): visitors see "14,000 patients" and "70% reduction" before they see project names or thumbnails
- Proof-of-work thumbnails (yours): visual evidence that real software was built
- 3x2 grid / all 6 visible (mine): no hidden content, no carousel interaction
- No fragile parsing (yours): render the full resultSummary string, just style it prominently
- Clinical aesthetic (both): metric-led cards with structured data below

My remaining question is about vertical height. Quick estimate at 1024px (226px card width):

| Element | Height |
|---------|--------|
| Result summary (14px mono, 3 lines max) | ~48px |
| Gap | 8px |
| Thumbnail (226x127px, 16:9) | 127px |
| Gap | 8px |
| Project name + year + status | ~20px |
| Gap | 6px |
| Tech + domain tags (one row each) | ~40px |
| Card padding (12px top + 12px bottom) | 24px |
| **Total per card** | **~281px** |

Two rows + 12px gap = ~574px total section height. That's significant but within reason for a dashboard section. The current carousel is ~250px tall at desktop, so this is roughly 2.3x the height. The tradeoff: 2.3x height but ALL 6 projects visible vs. 4 visible + interaction required.

Is that height increase acceptable, or should we compress? Options:
- Drop thumbnail to 4:3 (226x170px → saves nothing, 4:3 is taller)
- Drop thumbnail to a smaller fixed height, say 80px, with `object-fit: cover; object-position: top` — saves 47px per card, total becomes ~480px
- Compress tags to a single row of mixed tech+domain pills — saves ~20px per card

I'd suggest the smaller thumbnail (80px fixed height). At 226x80px, you still see the general shape of a dashboard but you're not asking it to be visually impressive. It becomes a proof-of-work stamp rather than a showcase image. Total section height drops to ~480px — more reasonable.

**Pending:** Frontend expert's proposal and critique. Their pixel-budget analysis will be decisive on the height question.

**UX Designer response to Portfolio Expert's hybrid refinements:**

We're close to alignment. Responding to the two open items:

**1. Fixed 48px result area — agreed with a refinement.**

Option (b) (fixed height, top-aligned) is the right call. 48px gives 3 lines at 14px, which accommodates the longest `resultSummary` (46 chars). Shorter results get whitespace below — and as you noted, that's exactly how clinical systems handle variable-length values in structured layouts. EMIS flowsheet cells have consistent row heights regardless of content length.

One refinement: I'd set the result text at **13px** (not 14-16px as I originally proposed). Reason: at 13px `--font-geist-mono` bold, the longest result ("9 interactive chart types, sub-50ms responses") wraps to ~2.5 lines in 194px usable width. The fixed 48px area accommodates this cleanly with minimal whitespace variance. And 13px is the same size as the `CardHeader` title — it reads as "prominent data" rather than "oversized heading," which fits the clinical vocabulary better. The accent color (`var(--accent)` / #FF6B6B) carries the visual weight instead of raw font size.

**2. Thumbnail compression to 80px — agreed, with one condition.**

80px fixed height with `object-fit: cover; object-position: top` is the right move. At 226x80px the thumbnails function as proof-of-work stamps: you see "dashboard with charts," "data table," "video player" — enough to register "real software" without asking the viewer to parse any detail. The `object-position: top` is essential because most of these screenshots have navigation/headers at top and data content below; cropping from the bottom preserves the most recognizable visual structure.

The one condition: if ANY project lacks a thumbnail (`thumbnail` is optional on the `Investigation` type), the 80px slot should show the existing gradient placeholder (`linear-gradient(135deg, rgba(19, 94, 94, 0.12), rgba(212, 171, 46, 0.18))`) with a subtle "SCREENSHOT PENDING" label in `--font-geist-mono` 9px. This maintains consistent card height even if a thumbnail is missing. Currently all 6 projects have thumbnails, but the data schema allows for the absence.

**Revised card anatomy at 1024px (226px card width):**

| Element | Height | Notes |
|---------|--------|-------|
| Result summary (13px mono bold, accent color) | 48px (fixed) | Top-aligned, 3-line max |
| Gap | 8px | |
| Thumbnail (object-fit: cover) | 80px (fixed) | Proof-of-work stamp |
| Gap | 8px | |
| Project name + year + status | ~20px | `--font-ui` 13px / `--font-geist-mono` 11px |
| Gap | 4px | |
| Tech + domain tags | ~24px | Single row, 2+2 tags max with `+N` overflow |
| Card padding | 24px | 12px top + 12px bottom |
| **Total per card** | **~216px** | |

Two rows + 12px gap = **~444px total section height.** That's down from your 574px estimate and roughly 1.8x the current carousel height (~250px). For a section that now shows ALL 6 projects with outcomes, thumbnails, and metadata — no hover, no interaction — that's a good trade.

The 24px reduction per card came from: compressing the tag area to a single row (saving ~16px) and tightening the gap before tags (6px → 4px). At 226px card width, fitting tech + domain tags on a single row means ~4 pills max total (2 tech + 2 domain) with `+N` overflow. That's tight but matches the current carousel's tag truncation behavior.

**Where we now stand:**

Both of us agree on:
- 3x2 static grid, all 6 visible at 1024px+
- Card structure: result summary (top, 13px mono bold accent) → thumbnail (80px stamp) → name/year/status → tags
- No carousel, no auto-scroll, no pagination
- Click opens existing detail panel
- Clinical aesthetic via structured, uniform card layout

Remaining for Frontend Expert to weigh in on:
- Is ~444px section height acceptable for the dashboard flow?
- CSS Grid implementation specifics (gap handling, responsive breakpoints)
- Their own design proposal if they have one
- Any pixel-budget concerns we've missed

### Round 2: UX Designer responds to Frontend Expert's proposal

**What I like:**

1. **The inline expansion is a genuinely good idea.** It solves a problem I hadn't addressed: the current hover overlay is ephemeral and keyboard-inaccessible. An expand-in-place mechanic replaces that with a persistent, accessible intermediate view. And it mirrors the accordion pattern in `TimelineInterventionsSubsection`, so users already understand the interaction. The three-tier disclosure (scan → expand → detail panel) is textbook progressive disclosure done right.

2. **The pixel analysis validates the 3x2 grid.** At 1024px, cards are 232px wide — 36% wider than the current carousel cards. This is important because it means less tag truncation and more readable thumbnails.

3. **Implementation math is compelling.** Net -260 lines, dropping Embla entirely. One component across all breakpoints. That's a real engineering win.

**Where I push back:**

1. **Thumbnail height: 16:9 (131px) vs. 80px fixed.** The Frontend Expert wants to keep 16:9 aspect ratio. I understand the argument — wider cards mean thumbnails are actually a useful size. But the height cost is real:

   | Approach | Thumb height | Card height | Section height |
   |----------|-------------|-------------|----------------|
   | 80px fixed (UX + Portfolio) | 80px | ~216px | ~444px |
   | 16:9 ratio (Frontend) | 131px | ~267px | ~546px |

   That's 102px more section height. At 1024px viewport (~768px visible above fold minus header), ~546px is a significant chunk of vertical real estate. The remaining ~222px shows the top of the next section (timeline) — barely a header peek. With 80px thumbnails, you get ~324px showing the timeline section, which gives the visitor a clear signal that more content exists below.

   **My position: 80px fixed, but I'll compromise at 100px.** At 232x100px, the thumbnails are still clearly recognizable as screenshots (you see navigation bars, chart areas, color schemes) while keeping total section height at ~484px. This preserves more below-fold visibility than 16:9 while being larger than our original 80px. The 100px height also creates a pleasant ~2.3:1 aspect ratio that reads as a "letterbox crop" rather than "squished image."

2. **The inline expansion adds complexity to what is otherwise a clean design.** The hybrid that the Portfolio Expert and I agreed on is elegant in its simplicity: static grid → click → detail panel. Two layers. The expansion adds a third layer, which means:
   - More animation code (Framer Motion layout + AnimatePresence)
   - The expanded card spanning `gridColumn: 1 / -1` causes the grid to reflow, pushing adjacent cards. This is a layout shift that needs careful animation to avoid jank.
   - The expanded state shows methodology + results + tags + "View Full Record" — but the detail panel ALSO shows all this. So the expansion is showing a subset of what the detail panel shows. Is the intermediate layer earning its keep?
   - Mobile: the expand mechanic on a 1-column grid is just... opening a taller card. The benefit of the side-by-side thumbnail + content layout only works at >= 768px (2+ columns).

   **However**, I recognize the value proposition: the expansion replaces the hover overlay, which IS inaccessible. And it provides a way to see methodology + results without losing grid context (the detail panel slides in from the right and obscures the grid). So the expansion IS earning its keep — it answers "what did this project achieve in detail?" without forcing a context switch.

   **My position: accept the inline expansion, but make it optional — not the primary path.** The card click should still open the detail panel directly. Add a small expand chevron/button (like `TimelineInterventionsSubsection` has) that triggers the inline expansion. This way: casual browsers click the card → detail panel (fast path), while methodical browsers who want to compare methodology across projects use the expand chevron → inline view (thorough path).

**Revised hybrid proposal (incorporating Frontend Expert's input):**

- 3x2 static CSS grid, all 6 visible at 1024px+
- Card structure (top to bottom):
  - `resultSummary` at 13px `--font-geist-mono` bold, `var(--accent)`, 48px fixed height, top-aligned
  - Thumbnail at 100px fixed height, `object-fit: cover; object-position: top`
  - Project name + year + status dot + Live pill
  - Tech tags (2 max + overflow) + domain tags (2 max + overflow) — single row
  - Card padding: 12px
- **Card click → detail panel** (primary interaction)
- **Expand chevron → inline row expansion** (secondary interaction, replaces hover overlay)
  - Expanded card spans full row, shows thumbnail (larger) + methodology + results list + full tags + "View Full Record" link
  - Framer Motion AnimatePresence for smooth open/close
  - Escape or clicking the chevron again collapses
- Hover: border color shift + shadow only (no overlay)
- Keyboard: Tab between cards, Enter/Space opens detail panel, specific key (e.g., right arrow or a designated key) expands inline
- No carousel, no auto-scroll, no Embla dependency

**Total section height at 1024px: ~484px** (two rows of ~230px + 12px gap + CardHeader ~28px)

**Frontend Expert responds to UX Designer's Round 2:**

On the three open items:

**1. Thumbnail height — I accept 100px.** The math is persuasive. 100px gives enough to read as "dashboard with charts" without the full 16:9 commitment. At 232x100px you get the navigation bar and first row of content, which is the identity-establishing region for all 6 screenshots. The NMS video still (centered composition) is the worst case, but it still shows the blue overlay and text, which is recognizable. 100px it is.

**2. Inline expansion as secondary action (chevron) — I accept.** The split interaction model is better than what I proposed:
- **Card body click → detail panel** (primary, fast path — satisfies casual browsers)
- **Expand chevron → inline expansion** (secondary, thorough path — satisfies methodical browsers)

This has three advantages over my "click to expand" proposal:
- No extra click before the detail panel for most users
- The expansion is discoverable but not mandatory
- It matches the `TimelineInterventionsSubsection` interaction exactly (the card body and expand chevron serve different functions there too)

The expand chevron should be positioned like the existing `ChevronDown`/`ChevronRight` in the timeline items — small, subtle, bottom-right or top-right of the card. 24x24px hit area minimum, using `ChevronDown` from Lucide when collapsed, `ChevronUp` when expanded.

**3. Result-summary at 13px, 48px fixed area — confirmed.** No further pushback. This is the right balance.

**My final position — I'm fully aligned with the revised hybrid:**

All three agents now agree on:

1. **3x2 static CSS Grid** — `repeat(3, 1fr)` at >= 1024px, `repeat(2, 1fr)` at 768-1023px, `1fr` at < 480px
2. **Card structure (top to bottom):** resultSummary (13px mono bold accent, 48px fixed) → thumbnail (100px fixed, object-fit cover) → name/year/status → tags (single row, 2+2 max)
3. **Card click → detail panel** (primary interaction)
4. **Expand chevron → inline row expansion** (secondary, optional)
5. **No carousel, no auto-scroll, no Embla**
6. **Hover: border + shadow only** (no overlay)
7. **~484px section height** at 1024px

I'm ready to write the consensus section if the Portfolio Expert confirms.

**Portfolio Expert confirms alignment.** The frontend expert's summary above accurately captures my position. I'm ready for consensus.

One addition to the consensus: **sorting order**. I raised this in my original proposal and it hasn't been contested. The 3x2 grid should be sorted by impact magnitude, not chronologically:

Row 1 (top, highest attention):
1. **Patient Switching Algorithm** — "14,000 patients identified" (or lead with £2.6M framing)
2. **Blueteq Generator** — "70% reduction in forms"
3. **PharMetrics** — "Live at medicines.charlwood.xyz"

Row 2:
4. **Patient Pathway Analysis** — "9 interactive chart types, sub-50ms responses"
5. **CD Monitoring System** — "Population-scale OME tracking"
6. **NMS National Training Video** — "Shared nationally across Tesco Pharmacy"

This puts the strongest quantified outcomes (14,000 patients, 70% reduction) in the top-left and top-center positions where eye-tracking shows the most attention in a grid layout (F-pattern / Z-pattern reading).

---

## Consensus

### Unanimous: Replace the carousel with a 3x2 static grid

All three agents agree to replace the `ContinuousScrollCarousel` and `EmblaProjectsCarousel` with a single static CSS Grid component. The carousel pattern is inappropriate for 6 items, adds unnecessary interaction overhead, and the auto-scroll violates WCAG 2.2.2.

### Agreed design specification

**Layout: 3x2 CSS Grid**
- `display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px` at >= 1024px
- `repeat(2, 1fr)` at 768-1023px
- `1fr` at < 480px
- All 6 projects visible at every desktop/tablet breakpoint without scrolling or pagination

**Card structure (top to bottom):**

| Element | Spec | Height |
|---------|------|--------|
| `resultSummary` | 13px `--font-geist-mono` bold, `var(--accent)` (#FF6B6B), top-aligned | 48px fixed |
| Gap | | 8px |
| Thumbnail | `object-fit: cover; object-position: top`, gradient placeholder if missing | 100px fixed |
| Gap | | 8px |
| Project name + year + status | `--font-ui` 13px / `--font-geist-mono` 11px, status dot or Live/Demo pill | ~20px |
| Gap | | 4px |
| Tech + domain tags | Single row, 2 tech + 2 domain max, `+N` overflow | ~24px |
| Card padding | 12px top + 12px bottom | 24px |
| **Total** | | **~236px** |

Two rows + 12px gap + CardHeader (~28px) = **~512px section height** at 1024px. Approximately 2x the current carousel height — acceptable trade for all 6 visible without interaction.

**Interaction model:**
- **Card body click → opens detail panel** (primary path, existing `openPanel({ type: 'project', investigation })`)
- **Expand chevron → inline row expansion** (secondary path, optional)
  - Expanded card spans `gridColumn: 1 / -1`
  - Shows: larger thumbnail (40%) + methodology text + results list + full tags + "View Full Record →"
  - Framer Motion `AnimatePresence` for open/close
  - Escape or chevron click collapses
  - Mirrors `TimelineInterventionsSubsection` accordion pattern
- **Hover**: `border-color: var(--accent-border)` + `box-shadow: var(--shadow-md)` — no overlay
- **Keyboard**: Tab between cards, Enter/Space opens detail panel, chevron focusable separately

**Card ordering: by impact magnitude, not chronological:**
1. Patient Switching Algorithm — "14,000 patients identified"
2. Blueteq Generator — "70% reduction in forms"
3. PharMetrics — "Live at medicines.charlwood.xyz"
4. Patient Pathway Analysis — "9 interactive chart types, sub-50ms responses"
5. CD Monitoring System — "Population-scale OME tracking"
6. NMS National Training Video — "Shared nationally across Tesco Pharmacy"

**Responsive breakpoints:**

| Breakpoint | Columns | All visible? | Expansion |
|-----------|---------|-------------|-----------|
| >= 1024px | 3 | Yes | Spans 3 cols |
| 768-1023px | 2 | Yes | Spans 2 cols |
| 480-767px | 2 | Yes | Spans 2 cols |
| < 480px | 1 | Yes (scroll) | Inline (full width) |

**Accessibility:**
- Cards: `role="button"`, `tabIndex={0}`, `aria-label="Project name: resultSummary. Click for details."`
- Expand chevron: `aria-expanded`, `aria-controls`
- Expanded region: `aria-live="polite"`
- No auto-advancing content — WCAG 2.2.2 satisfied by default

### Implementation plan

**Delete (~390 lines):**
- `EmblaProjectsCarousel` function (~120 lines)
- `ContinuousScrollCarousel` function (~250 lines)
- `ProjectsCarousel` export (~20 lines)

**Add (~180 lines):**
- `ProjectsGrid` component (~50 lines) — CSS grid container, responsive columns
- `ProjectGridCard` component (~80 lines) — result-first card with expand chevron
- `ExpandedProjectRow` component (~50 lines) — inline expansion view

**Keep:**
- `ProjectItem` — adapt for new card structure (rename, reorder elements)
- `CardHeader` — reuse for section header
- `openPanel({ type: 'project', investigation })` — unchanged
- `PROJECT_STATUS_COLORS` — unchanged

**Dependencies removed:** `embla-carousel-react`, `embla-carousel-autoplay` (verify no other consumers first)

**Net change: approximately -210 lines.**

### Key design decisions and rationale

1. **Result-first card ordering** — the `resultSummary` is the most compelling content per project. Moving it above the thumbnail ensures the quantified outcomes ("14,000 patients", "70% reduction") are the first thing scanned. This is the single most impactful change from the current design. (Portfolio Expert insight, unanimously adopted)

2. **100px fixed thumbnail height** — compromise between proof-of-work visibility (80px too small to read as "a real application") and section height control (131px/16:9 too expensive at +102px total). At 232x100px, thumbnails show navigation bars and top content — enough for visual evidence. (UX Designer compromise, unanimously accepted)

3. **Dual interaction: click vs. expand** — card click goes directly to detail panel (fast path for casual browsers). Expand chevron opens inline expansion (thorough path for methodical comparison). This replaces the hover overlay, which was ephemeral and keyboard-inaccessible. (Frontend Expert insight, refined by UX Designer, unanimously adopted)

4. **Impact-sorted rather than chronological** — top-left position gets the strongest metric (14,000 patients / £2.6M savings), following F-pattern eye tracking. (Portfolio Expert proposal, uncontested)
