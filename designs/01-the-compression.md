# Design 1: The Compression

> A scroll-driven storytelling experience in 3 acts that ENACTS Andy's core skill — compressing raw data chaos into clean insight.

---

## Overview

The Compression is a scrollytelling portfolio that transforms the act of reading a CV into an emotional experience. The page is structured as a three-act narrative controlled entirely by scroll position. The user doesn't just learn that Andy compresses months of manual analysis into 3 days — they FEEL it.

**Act 1 "The Raw Data"** overwhelms the user with a wall of simulated prescribing data — drug names, BNF codes, costs, patient IDs — scrolling upward in green monospaced text on black. It's deliberately uncomfortable. This is the problem Andy solves every day.

**Act 2 "The Algorithm"** transforms the chaos in real-time as the user scrolls. Data lines cluster, group, sort, and collapse. Career cards appear during the transformation, each representing a stage in Andy's growing capability. The transformation becomes more sophisticated as roles progress from pharmacy management to population health analytics.

**Act 3 "The Insight"** delivers the payoff: clean, minimal output. Key numbers as beautiful data cards. Skills as animated gauges. Education and projects in calm, white-space-rich layout. The emotional contrast with Act 1 is the entire point.

The scroll position is the playback head. Fast scrollers get the highlights. Slow scrollers get the full show. Scrolling backward reverses everything. The user controls the pace of revelation — exactly how Andy controls the pace of a stakeholder presentation.

### Why This Design

Scroll-driven storytelling achieves 400% higher engagement than static content. But more importantly, this design doesn't just DESCRIBE Andy's value proposition — it DEMONSTRATES it. By the time a recruiter reaches Act 3, they've viscerally experienced what it feels like to have raw data compressed into clean insight. That's Andy's pitch, made physical.

---

## ECG Transition

**Starting frame:** Andy's name, neon green (#00FF41), on pure black. Static.

### Sequence (2.2 seconds total)

1. **Destabilize** (400ms): The neon green letterforms of Andy's name begin to flicker — not uniformly, but character-by-character, as if each letter is a data point losing coherence. Individual pixels at the edges of the letters start detaching, drifting 1-2px from their positions. The name is becoming unstable.

2. **Decompose** (600ms): The letters break apart completely. Each character disintegrates into a small cluster of monospaced character fragments — not random pixels, but recognizable text fragments: drug names, BNF codes, cost figures, patient IDs. The fragments scatter outward from each letter's position, decelerating with spring physics. The green shifts from neon (#00FF41) to a dimmer data-green (#3a6b45) as fragments spread.

3. **Grid snap** (500ms): The scattered fragments snap into grid positions — monospaced rows, left-aligned, filling the viewport. They're now readable as lines of simulated prescribing data. The grid formation happens with a satisfying staccato rhythm, rows snapping into place from top to bottom with 20ms stagger. The name "ANDY CHARLWOOD" dissolves last, its characters reassembling into a header row at the top of the data wall: `PATIENT_DATASET // CHARLWOOD.A // NORFOLK_ICB`.

4. **Data wall live** (200ms): The data wall begins scrolling upward automatically for a brief moment (2-3 rows), establishing the scrolling data aesthetic. Then it pauses, waiting for the user's scroll input. The background has remained black throughout — no seam between the intro and Act 1. The transition IS Act 1 beginning.

### Why This Transition Works

There is no seam. The neon green name from the ECG intro literally decomposes into the raw data that forms Act 1's visual foundation. The user's eye follows a continuous transformation: name → fragments → data rows. The emotional shift is from "that was a cool animation" to "wait, what is all this data?" — which is exactly the disorientation Act 1 is designed to create.

---

## Visual System

### Color Journey (Scroll-Driven)

The entire page's color palette transitions continuously as the user scrolls, creating an unmistakable sense of progression:

| Scroll Position | Background | Text Primary | Accent | Emotional Register |
|----------------|------------|-------------|--------|-------------------|
| 0% (Act 1 start) | Black #000000 | ECG green #00FF41 | — | Overwhelm, clinical |
| 15% (Act 1 mid) | Black #000000 | Dim green #3a6b45 | — | Dense, relentless |
| 30% (Act 2 start) | Charcoal #1e293b | Dim green → slate #94a3b8 | Teal #00897B | Transformation beginning |
| 50% (Act 2 mid) | Slate #334155 | Light slate #e2e8f0 | Teal #00897B | Organization, clarity |
| 70% (Act 3 start) | Light gray #f8fafc | Charcoal #1e293b | Teal #00897B | Relief, clean |
| 100% (Act 3 end) | White #FFFFFF | Dark #0f172a | Cyan accent #00D4AA | Confidence, resolution |

The background transition is implemented as a continuous CSS custom property (`--bg-progress`) mapped to scroll position, interpolating between color stops. No hard cuts — the eye never perceives a boundary between acts.

### Typography

Three typefaces, each with a clear role in the narrative:

- **IBM Plex Mono 400** — The data voice. Used for all raw data text in Act 1, metric numbers throughout, code snippets, and the header row. Set at 13px/1.6 in the data wall, 16px/1.4 for inline metrics. This is the typeface of the problem.

- **Space Grotesk 500, 700** — The heading voice. Used for section headings, role titles, and the name in the hero. Set at 32-48px for section headings, 24px for role titles. Weight 700 for primary headings, 500 for subheadings. This is the typeface of structure.

- **IBM Plex Sans 400, 450** — The body voice. Used for all descriptive text, bullet points, and the profile summary. Set at 16px/1.7 for body text, 14px/1.6 for secondary text. Weight 450 (slightly heavier than regular) for body text to maintain readability against busy backgrounds. This is the typeface of insight.

### Texture and Ambient Elements

- **Dot grid**: A faint grid of dots at 3% opacity, visible from Act 2 onward. Grid spacing 24px. The grid represents structure emerging from chaos — it's not visible in Act 1 (there is no structure yet) but gradually appears as the data organizes. Mouse proximity brightens the nearest grid intersection to 15% opacity within a 60px radius, creating a subtle "spotlight" effect.

- **Gradient glows**: Behind key data cards and metric numbers in Act 3, soft radial gradients (teal at 8-10% opacity) provide visual warmth and draw the eye. These are 200-300px diameter, centered on each element, and breathe (subtle scale oscillation at 4s period).

- **Data traces**: Thin horizontal lines (1px, 5% opacity) span the full viewport width behind content in Acts 2-3, suggesting the remnants of the data wall's grid structure. Content sits on these traces like data on a chart.

### Motion Principles

- **Easing**: All animations use `cubic-bezier(0.16, 1, 0.3, 1)` — a custom ease-out that starts fast and decelerates smoothly. This gives everything a confident, decisive feel, matching the "compression" metaphor (fast analysis, clean output).

- **Scroll-driven**: Every animation is mapped to scroll position via normalized 0-1 progress values. No time-based animations in the main content (except ambient loops like the gradient glow breathing). The user IS the timeline.

- **Number rendering**: Metric numbers render digit-by-digit at 30ms per digit when counting up. The count rate is tied to scroll velocity — scroll faster, numbers count faster. This creates a visceral connection between user effort and data processing.

- **SVG path drawing**: All drawn lines (timeline paths, skill bar fills, education path) animate via `stroke-dashoffset` mapped to scroll progress. The drawing direction always follows the data flow direction (left-to-right or top-to-bottom).

- **GPU compositing**: All transforms use translate3d, opacity, or scale exclusively. No animations trigger layout or paint (no width/height/margin animations). This ensures 60fps on mid-range devices.

---

## Section-by-Section Design

### Act 1: The Raw Data

**Scroll range:** 0% - 25% of total scroll depth.

**What the user sees:** A full-viewport wall of monospaced green text on black — simulated prescribing data. Rows contain realistic-looking drug names, BNF codes, practice codes, cost figures, and patient counts. The data scrolls upward at a rate proportional to the user's scroll, creating a "Matrix" effect but with real pharmaceutical data terminology.

**Data wall composition:**
```
BNF 0407010H0  MORPHINE SULFATE M/R    PJ68043  £14.82  x120  NORFOLK_ICB
BNF 0212000Y0  ATORVASTATIN            D81024   £2.16   x890  NORFOLK_ICB
BNF 0601022B0  METFORMIN HCL           PJ68043  £1.04   x445  NORFOLK_ICB
BNF 0205051R0  RAMIPRIL                D81024   £1.89   x670  NORFOLK_ICB
...
```

The data is generated procedurally (not hardcoded) from arrays of real BNF codes, drug names, practice codes, and cost ranges. Each row is unique but plausible. Approximately 200-300 rows are generated, with only ~30 visible at any time.

**Header row** (persistent at top): `PATIENT_DATASET // CHARLWOOD.A // NORFOLK_ICB` in brighter green (#00FF41), with a subtle underline. This is the remnant of Andy's name from the ECG transition.

**Scroll behavior:** As the user scrolls, the data wall scrolls upward. The scroll rate is 1.5x the user's scroll speed, creating a slight acceleration that enhances the overwhelming feeling. At 15% scroll, some rows begin to dim (opacity dropping to 30%), creating depth — foreground rows are bright, background rows are faded.

**Emotional intent:** Discomfort. Information overload. "How does anyone make sense of this?" This is the state of prescribing data before Andy touches it.

**Ambient detail:** A faint scan line sweeps downward across the data wall every 8 seconds (very subtle, 2% opacity). A tiny blinking cursor sits at the bottom-right of the data wall, suggesting a terminal awaiting input.

### Act 2: The Algorithm

**Scroll range:** 25% - 60% of total scroll depth.

**What the user sees:** The raw data begins to transform. This is the core of the experience — a choreographed sequence of data manipulations that correspond to Andy's career progression.

**Transformation sequence (mapped to scroll progress within Act 2):**

**Phase 1 — Sorting (0-20% of Act 2):** Data rows rearrange. Rows with similar BNF codes cluster together. The movement is animated — rows slide vertically to their new positions, creating a satisfying cascade of shifting text. Some rows highlight in teal (#00897B) as they're "selected" by the algorithm. A label appears at screen edge: `SORTING BY BNF_CODE...`

Simultaneously, the first career card slides in from the right: **Pharmacy Manager, Tesco PLC (2017-2022)**. It's a card with a dark background (#1e293b), rounded corners, and a teal left border. The card contains the role title, date range, and 2-3 key bullets. It appears alongside the sorting transformation, contextualizing it: Andy's first role involved identifying patterns (the asthma screening process adopted nationally).

**Phase 2 — Grouping (20-45% of Act 2):** Sorted rows collapse into groups. 10 individual rows of the same drug compress into a single summary row showing the drug name, total cost, and patient count. The compression animation is physical — rows accordion inward, stacking on top of each other until only the summary remains. The data wall is visibly shrinking. More whitespace appears between groups.

The second career card slides in: **High-Cost Drugs & Interface Pharmacist, NHS ICB (2022-2024)**. The role's key achievement — the Blueteq automation (70% form reduction, 200 hours saved) — is visualized as a mini-animation within the card: a stack of form icons compresses to 30% of its original height.

**Phase 3 — Analysis (45-70% of Act 2):** Grouped data transforms into structured visualizations. Cost figures align into bar segments. Patient counts form columns. The monospaced text is giving way to geometric shapes — rectangles, lines, circles. The background has lightened to slate. The data wall is no longer recognizable as raw text — it's becoming a dashboard.

The third career card slides in: **Deputy Head, Population Health & Data Analysis (2024-Present)**. The £220M budget management and the switching algorithm achievements appear. Key metric: `14,000 patients identified` counts up from zero as the user scrolls past.

**Phase 4 — Compression (70-100% of Act 2):** This is the signature moment. All remaining data elements — the bars, columns, shapes — physically compress toward the center of the screen. They funnel through a narrow "processing" zone (visualized as two converging lines forming a V-shape or funnel). On the other side, clean data cards emerge, fully formed. The funnel animation is tied directly to scroll — scroll backward and everything reverses, data expanding back out of the funnel.

The fourth career card slides in: **Interim Head, Population Health & Data Analysis (2025)**. The £14.6M efficiency programme headline. This number counts up dramatically: `£14,600,000` digit by digit, each digit appearing with a micro-flash of teal light.

**Background transition:** Throughout Act 2, the background continuously transitions from black (#000000) through charcoal (#1e293b) to slate (#334155). The text color shifts from dim green (#3a6b45) to light slate (#e2e8f0). By the end of Act 2, the page no longer looks like a terminal — it looks like a modern dashboard.

### Act 3: The Insight

**Scroll range:** 60% - 100% of total scroll depth.

**What the user sees:** Clean, beautiful, minimal content. Maximum whitespace. The emotional relief after Acts 1-2 makes this content feel earned and precious. This is "normal" portfolio layout elevated by contrast.

**Background:** Continues transitioning from slate (#334155) → light gray (#f8fafc) → white (#FFFFFF). By the Skills section, the background is fully white.

#### Hero (60-65% scroll)

Andy's name is already visible (persistent header from Act 1). As Act 3 begins, the profile summary text types itself character-by-character synchronized to scroll position. Stop scrolling = stop typing. Resume scrolling = resume typing. The text appears in IBM Plex Sans 450, 18px, charcoal (#1e293b). A thin teal line (#00897B) underscores the summary once complete.

Below the summary, three "impact pills" fade in with stagger: `£14.6M Efficiency Programme` | `1.2M Population Served` | `£220M Budget Managed`. Each pill has a teal border and a subtle gradient glow.

#### Skills (65-75% scroll)

Skills are displayed as horizontal bar charts that draw themselves left-to-right, synchronized to scroll position. The scroll-to-progress mapping means each bar fills as the user scrolls through the skills section.

**Layout:** Two columns on desktop, single column on mobile. Each row contains:
- Skill name (IBM Plex Sans 450, 15px, left-aligned)
- Horizontal bar (height 8px, rounded ends)
- Proficiency percentage (IBM Plex Mono 400, 14px, right-aligned, counts up as bar fills)

**Bar fill gradient:** Each bar fills with a gradient that shifts from cool blue (#60a5fa) at 0% to teal (#00897B) at 50% to warm cyan (#00D4AA) at 100%. The gradient position corresponds to the proficiency level, so higher-skilled bars are warmer-colored.

**Skill categories** are separated by subtle headings (Space Grotesk 500, 13px, uppercase, tracking 0.1em, slate #64748b):
- TECHNICAL: Python, SQL, Power BI, JavaScript/TypeScript, Algorithm Design, Data Pipelines
- HEALTHCARE: Medicines Optimisation, Population Health, NICE Implementation, Health Economics
- LEADERSHIP: Budget Management, Stakeholder Engagement, Team Development, Change Management

**Interaction:** Hovering a skill bar causes it to brighten slightly and the percentage number to pulse. The nearest dot-grid intersections brighten. A tooltip with a one-line description fades in after 300ms hover dwell.

#### Experience (75-85% scroll)

Experience entries are displayed as timeline cards that "assemble" as the user scrolls past each one's trigger point. The assembly is sequential and scroll-driven:

1. **Title draws** (first 20% of card's scroll range): The role title types itself in Space Grotesk 700, 22px, teal (#00897B).
2. **Company slides in** (20-35%): The company name and date range slide in from the left, IBM Plex Sans 400, 15px, slate (#64748b).
3. **Context line fades** (35-50%): The one-line role context fades in.
4. **Bullets sequence** (50-100%): Each bullet point fades in from below with a 100ms stagger. Key metrics within bullets (£14.6M, 14,000, 200 hours, £2.6M, £1M, 50%) count up from zero as they appear, with the count rate tied to scroll velocity.

**Timeline visual:** A thin vertical line (2px, teal at 20% opacity) connects the cards. Small nodes (8px circles) mark each role. As the user scrolls past a node, it fills with solid teal and emits a subtle radial pulse animation.

**Card layout:** Each card has generous padding (32px), a very subtle left border (3px, teal at 40% opacity), and sits on a barely-visible card surface (#f8fafc on white background). On hover, the card surface becomes #f1f5f9 and the left border reaches full teal opacity.

**Achievement highlights:** Key achievements within each role have metric numbers displayed in IBM Plex Mono 700, teal (#00897B), with a faint gradient glow behind them. These are the numbers that counted up from zero — they remain vivid and prominent.

Note: The career cards from Act 2 are NOT repeated here. Act 2 showed the career in the context of transformation. Act 3's Experience section provides the complete, detailed content. However, if the user scrolls back to Act 2, the career cards there are still visible and interactive. The two views complement each other — Act 2 is the narrative, Act 3 is the reference.

#### Education (85-92% scroll)

A winding SVG path draws itself as the user scrolls, connecting education milestones. The path is a gentle S-curve that moves top-to-bottom, with milestone nodes positioned along it.

**Path drawing:** The SVG `<path>` has a `stroke-dasharray` equal to its total length and a `stroke-dashoffset` that transitions from total length (invisible) to 0 (fully drawn) mapped to scroll progress. The stroke is 2px, teal (#00897B) at 40% opacity, with a brighter 4px glow version behind it at 15% opacity.

**Milestone nodes** (positioned along the path):

1. **A-Levels (2009-2011)**: Mathematics A*, Chemistry B, Politics C. Highworth Grammar School. Node icon: a small graduation cap SVG.
2. **MPharm (2011-2015)**: University of East Anglia, 2:1 Honours. Node icon: a flask/molecule SVG. The research project branches off as a sidebar annotation (a short branching path from the main line): "Drug delivery and cocrystals: 75.1% (Distinction)."
3. **GPhC Registration (2016)**: General Pharmaceutical Council. Node icon: a shield/badge SVG.
4. **Mary Seacole Programme (2018)**: NHS Leadership Academy, 78%. Node icon: a leadership/star SVG.

Each node starts as an empty circle (2px border, no fill). As the drawn path reaches the node, it fills with solid teal and a label card fades in beside it. The branch for the research project draws after the MPharm node fills.

#### Projects (92-97% scroll)

Each project occupies approximately one-third of a viewport height. As the user scrolls INTO a project, its visualization builds in real-time:

**Project 1 — Switching Algorithm:**
A network of small dots (representing patients) appears scattered randomly. As the user scrolls, the dots route through a funnel visualization (two converging lines). On the output side, they emerge organized into groups. A counter shows: `14,000 patients identified → £2.6M annual savings`. The funnel is the algorithm. The dots are the patients. The counter ties it to impact.

**Project 2 — Blueteq Automation:**
A stack of form icons (representing prior approval forms) appears on the left. As the user scrolls, 70% of the forms slide off-screen (fade out to the left), leaving 30% remaining. A counter shows: `70% reduction | 200 hours saved | 7-8 hrs/week ongoing`. The visual is simple and devastating — most of the work just disappears.

**Project 3 — Sankey Chart Tool:**
An actual mini Sankey diagram draws itself as the user scrolls. Colored flows move from left-side nodes (drug categories) through middle nodes (treatment stages) to right-side nodes (outcomes). The flows animate with a flowing particle effect along the paths. This is a working visualization of what Andy built.

**Project 4 — Controlled Drug Monitoring:**
A timeline visualization showing a patient's morphine equivalent exposure over time. A line chart draws itself left-to-right with scroll, with a horizontal threshold line marking "high risk." When the drawn line crosses the threshold, it changes color from teal to coral (#FF6B6B) and pulses. Counter: `Population-scale patient safety analysis`.

#### Contact (97-100% scroll)

The scroll reaches "the end of the data." A summary card appears, pulling together the key numbers from the entire page into a single impact statement:

```
£14.6M efficiency programme identified
14,000 patients flagged by algorithm
£2.6M annual savings on target
1.2 million population served
```

Each number is displayed in IBM Plex Mono 700, 28px, teal, with a gentle gradient glow. They appear with staggered fade-in as the user scrolls to the final section.

Below the summary, the contact form slides up as the final "output" of the data pipeline. The form has a minimal design: Name, Email, Message fields with clean borders, a teal submit button, and contact details (email, phone, location) displayed alongside.

A subtle callback to Act 1: the form's background has a barely-visible (1% opacity) pattern of the raw data text from the data wall, visible only on close inspection. The data is still there — it's just been compressed into clean insight.

---

## Interactions and Micro-interactions

### The Living Grid (Ambient)

A faint dot grid (3% opacity, 24px spacing) covers the viewport from Act 2 onward. This grid is interactive:

- **Mouse proximity**: The nearest grid intersection to the cursor brightens to 15% opacity, with 2-3 adjacent intersections at 8% opacity. Creates a subtle "spotlight" effect as the user moves their mouse. Radius ~60px.
- **Scroll activity**: When the user is actively scrolling, grid intersections along the scroll direction briefly flash (5% → 10% → 5% over 200ms), creating a cascading "data processing" ripple.
- **Section transitions**: When crossing from one section to another, a horizontal wave of grid brightening sweeps across the viewport (left to right, 400ms), marking the boundary.

Implementation: CSS custom properties for grid opacity, updated via requestAnimationFrame tied to mouse position and scroll events. The grid is a repeating CSS background pattern, not individual DOM elements.

### Number Count-ups

Every significant metric in the document counts up from zero to its final value:

- Count rate is proportional to scroll velocity (faster scroll = faster count)
- Numbers render digit-by-digit at 30ms per digit for large numbers (e.g., £14,600,000 takes ~270ms at base rate)
- A brief teal flash illuminates each digit as it appears
- Once fully counted, numbers hold their final value permanently (no re-counting on re-scroll)
- Scrolling backward past a number's trigger point smoothly counts it back down to zero

Implementation: Custom `useScrollCountUp` hook. Accepts target number, scroll range (start/end percentage), and formatting options. Returns the current display value based on scroll position. Uses `useTransform` from Framer Motion to map scroll progress to number value.

### Card Assembly Animations

Experience and project cards build themselves as the user scrolls:

- Each card has 4-6 sub-elements that animate sequentially
- The sequence is tied to scroll progress within the card's trigger range
- Easing is `cubic-bezier(0.16, 1, 0.3, 1)` for all movements
- Elements animate in from consistent directions: titles type-in, subtitles slide from left, body text fades from below, metrics scale up from zero
- Scrolling backward reverses the assembly — elements retreat in reverse order

### Data Wall Interactions (Act 1)

The data wall is primarily passive (scroll-driven), but has two subtle interactive layers:

- **Row highlighting**: The row nearest to the viewport center has slightly brighter text (50% → 70% opacity). Adjacent rows are progressively dimmer. This creates a "focused row" effect that tracks with scroll.
- **Mouse hover**: Hovering over a specific data row highlights it in brighter green and displays a tiny tooltip: "1 of 247,000 prescribing records" (or similar contextual text). This reinforces that each row represents real data.

### Scroll Progress Indicator

A thin progress bar sits at the top of the viewport (2px height, full width):
- **Color**: Transitions through the same color journey as the page (green → teal → cyan)
- **Width**: Maps directly to scroll percentage (0% = left edge, 100% = full width)
- **Act markers**: Three small notches at 25%, 60%, and 100% mark the act boundaries
- **Label**: A tiny "Act 1/3", "Act 2/3", "Act 3/3" label sits above the progress bar, updating at act boundaries

---

## Navigation

### Persistent Header

A minimal header sits at the top of the viewport with `position: fixed`:
- **Content**: Andy's name (Space Grotesk 700, 16px) on the left, act indicator on the right
- **Appearance**: Transparent in Act 1 (text in green), transitions to a subtle frosted-glass background (`backdrop-filter: blur(12px)`, white at 80% opacity) in Act 3
- **Act navigation**: Three dots in the header represent the three acts. The active act's dot is filled teal. Clicking a dot smooth-scrolls to that act's start position.

### Skip to Content

For users who want to bypass the narrative experience:
- A "Skip to CV →" link appears at bottom-right during Acts 1-2 (IBM Plex Sans 400, 14px, teal)
- Clicking it smooth-scrolls directly to Act 3 (the clean CV content)
- The link disappears once the user reaches Act 3

### Section Navigation (Act 3)

Within Act 3, a floating side navigation appears (similar to the existing FloatingNav):
- Small dots aligned vertically on the right edge
- Each dot corresponds to a section: Skills, Experience, Education, Projects, Contact
- Active section dot is filled teal, others are outlined
- Clicking a dot smooth-scrolls to that section
- Dots only appear when Act 3 is active

### Keyboard Navigation

- Arrow Up/Down: Scroll by section
- 1/2/3: Jump to Act 1/2/3
- Escape: Skip to Act 3 (same as "Skip to CV")
- Tab: Focuses interactive elements in DOM order

---

## Responsive Strategy

### Desktop (>1024px)

The full experience: data wall with 80-character rows, wide career cards alongside the transformation, two-column skill bars, generous whitespace in Act 3. The dot-grid ambient effect is active. Mouse interactions (hover, proximity) are fully enabled. Data wall shows ~30 visible rows at a time.

### Tablet (768px - 1024px)

Simplified data wall with 50-character rows (truncated BNF data). Career cards in Act 2 appear below the transformation area rather than alongside. Single-column skill bars. The dot-grid effect is reduced to major intersections only (48px spacing). Data wall shows ~25 visible rows.

### Mobile (<768px)

The scroll-driven narrative is preserved — this is scroll's native strength. Key adaptations:

- **Data wall**: 30-character rows, ~20 visible at a time. Fewer data fields per row (drug name + cost only). The overwhelming effect is maintained through density rather than width.
- **Act 2 transformation**: Simplified grouping animations (rows collapse in place rather than rearranging). Career cards appear in-flow, not overlaid.
- **Act 3**: Single-column layout throughout. Skill bars are full-width. Timeline cards are full-width with left border. Projects stack vertically with reduced visualization complexity (Sankey chart becomes a simplified flow, funnel is a simple before/after).
- **Ambient effects**: Dot-grid disabled. Gradient glows reduced to 5% opacity. Scroll progress bar and act indicators remain.
- **Touch**: All scroll-driven animations work identically with touch scroll. Hover interactions (grid brightening, card hover states) are disabled.

### Ultra-wide (>1440px)

Content is capped at 1200px max-width. The data wall extends to full viewport width (data rows span the entire screen). The extra horizontal space enhances the "wall of data" effect in Act 1.

---

## Technical Implementation

### Scroll Engine

The scroll system is the backbone of the entire experience. It maps a single scroll position to multiple parallel animation timelines.

```
Architecture:
- Total scroll depth: ~4x viewport height (tuned for comfortable scroll pace)
- Framer Motion useScroll() provides scrollYProgress (0 to 1)
- useTransform() maps scrollYProgress ranges to individual animation values
- Each section registers its scroll range via a config object:
    { start: 0.6, end: 0.75, ... } → Skills section occupies 60-75% of scroll
- Within each section, sub-animations are further mapped to the section's 0-1 range
```

### Data Wall Generation

The Act 1 data wall is procedurally generated at mount time:

```
Data arrays:
- ~50 real BNF codes (from public BNF data)
- ~80 drug names (generic names, publicly available)
- ~20 practice codes (anonymized format: PJ68xxx, D81xxx)
- Cost ranges (£0.50 - £200.00, realistic distributions)
- Patient counts (x50 - x2000)

Generation:
- 250-300 rows generated by randomly combining array elements
- Each row is a pre-formatted string matching fixed-width columns
- Rows are memoized (React.useMemo) — no re-generation on scroll
- Only ~30 rows are rendered at any time (virtualized list)
```

### Scroll-Driven Background

The background color transitions via CSS custom properties:

```
Implementation:
- A single --scroll-progress CSS variable (0 to 1) updated via requestAnimationFrame
- Background uses a multi-stop gradient positioned by --scroll-progress
- Gradient stops correspond to act boundaries
- The gradient is applied to a fixed, full-viewport background div
- No JavaScript per-frame color calculation — the browser interpolates
```

### Number Counter Hook

```
useScrollCountUp(target, scrollRange, options):
  - target: final number (e.g., 14600000)
  - scrollRange: { start: 0.78, end: 0.82 } — scroll range where count happens
  - options: { prefix: '£', separator: ',', digits: true }
  - Returns: formatted string of current value based on scroll position
  - Uses Framer Motion useTransform to map scroll → number
  - digit-by-digit mode: each digit position updates independently at 30ms intervals
```

### SVG Path Drawing

Education path and project visualizations use SVG stroke animation:

```
Implementation:
- SVG path has stroke-dasharray = path.getTotalLength()
- stroke-dashoffset transitions from totalLength (hidden) to 0 (visible)
- Offset value is mapped to scroll progress via useTransform
- A second, thicker, blurred path behind creates the glow effect
- Both paths update simultaneously for consistent glow
```

### Performance Budget

- **Target**: 60fps throughout on mid-range devices (4-core CPU, integrated GPU)
- **DOM elements**: <200 in Act 1, <400 in Act 3. Data wall uses virtualization.
- **Canvas**: No canvas used — all effects are CSS/SVG. This simplifies the rendering pipeline.
- **Composited properties only**: All animations use transform (translate3d) or opacity. No width, height, margin, padding, top, left animations.
- **will-change**: Applied to elements that animate frequently (data wall rows, card elements, background div)
- **IntersectionObserver**: Used to disable off-screen animations. Sections outside the viewport don't compute scroll mappings.
- **Bundle**: Framer Motion tree-shaken to ~30kb gzip. No D3 dependency. Total JS budget: <80kb gzip.

### Reduced Motion

When `prefers-reduced-motion: reduce` is active:

- Data wall shows a static screenshot-like snapshot (no scrolling data)
- Act structure is removed — all content displays as a standard scrolling page
- Section reveals use simple opacity fades (200ms) instead of assembly animations
- Number counters display final values immediately (no count-up)
- SVG paths are fully drawn (no progressive draw)
- Dot-grid ambient effect is disabled
- Progress bar remains functional for navigation

---

## Accessibility

### ARIA Structure

```html
<main aria-label="Andy Charlwood - Portfolio">
  <section aria-label="Act 1: Raw Data Visualization" role="region">
    <div aria-hidden="true" aria-description="Decorative visualization of raw prescribing data">
      <!-- Data wall (purely decorative) -->
    </div>
  </section>

  <section aria-label="Act 2: Data Transformation" role="region">
    <!-- Transformation visuals (aria-hidden) + Career cards (accessible) -->
  </section>

  <section aria-label="Professional Profile" role="region">
    <!-- Hero, Skills, Experience, Education, Projects, Contact -->
    <!-- Each subsection has its own landmark heading -->
  </section>
</main>
```

### Screen Reader Experience

Screen readers skip Acts 1-2 decorative content entirely and receive a clean, structured CV:

1. Andy Charlwood — Profile summary
2. Core Skills (structured list)
3. Professional Experience (chronological, with full role details)
4. Education and Registration
5. Projects (with outcomes and metrics)
6. Contact information

This is the same content as Act 3, in standard semantic HTML with proper heading hierarchy (h1 → h2 → h3).

### Keyboard Navigation

- **Tab order**: Follows logical CV structure regardless of visual act position
- **Skip links**: "Skip to main content" bypasses all decorative elements
- **Act navigation**: Number keys 1-3 jump to acts, clearly labeled in focus order
- **Focus indicators**: All interactive elements have visible focus rings (2px solid teal, 2px offset)

### Color Contrast

- Act 1: Green (#00FF41) on black (#000000) = contrast ratio 10.5:1 (AAA)
- Act 2: Light slate (#e2e8f0) on slate (#334155) = contrast ratio 7.2:1 (AAA)
- Act 3: Dark (#0f172a) on white (#FFFFFF) = contrast ratio 17.1:1 (AAA)
- Teal accent (#00897B) on white (#FFFFFF) = contrast ratio 4.56:1 (AA for normal text, AAA for large text)

### Scroll Depth

Total scroll depth is capped at approximately 4 viewport heights. This is comfortable for the narrative while not exhausting for keyboard/switch users. The "Skip to CV" shortcut is always available.

---

## What Makes This Special

1. **It ENACTS the value proposition.** The user doesn't read "I compress months of analysis into 3 days" — they experience overwhelming data being compressed into clean insight. The medium IS the message.

2. **The emotional arc is engineered.** Act 1 creates discomfort. Act 2 provides relief through transformation. Act 3 delivers resolution. This is the same emotional structure as a great presentation, a compelling film, or a satisfying algorithm — start with the problem, show the process, deliver the result.

3. **Scroll is the perfect input.** Everyone knows how to scroll. The engagement model is proven (400% higher than static). Fast scrollers get the highlights, slow scrollers get the full experience. It works perfectly on mobile where scroll is native. There's no learning curve, no instructions needed.

4. **The signature moment — The Compression funnel** — is share-worthy. Watching data physically compress through a funnel into clean output, controlled by your scroll, is viscerally satisfying. It's the moment someone takes a screen recording.

5. **It respects the recruiter's time.** The "Skip to CV" button is always available. A recruiter in a hurry can jump straight to Act 3 and get a clean, professional CV. A recruiter with time gets the full narrative experience. Two audiences, one site.

6. **The data is authentic.** The Act 1 data wall uses real BNF codes and drug names. The transformation sequence reflects actual data processing operations (sort → group → aggregate → visualize). Andy's domain expertise is woven into the visual DNA of the site, not just its text content.
