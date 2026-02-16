# Requirements Specification: Adding Depth to the GP Clinical Record

> Brainstorm session output — Feb 2026
> Source of truth for content: `References/CV_v4.md`
> ATS PDF is supplementary context only, not to be included wholesale.

---

## 1. Problem Statement

The current dashboard feels flat and light on information. Content is thin, sections feel like footnotes rather than showcases, and there's no mechanism to drill into detail. Projects are buried at the bottom. KPI numbers don't hit hard enough. Skills show only 5 items with no way to see more. The whole experience lacks depth, interactivity, and the sense that there's rich content behind every surface.

---

## 2. Core UX Patterns

### 2.1 Right-Side Detail Panel

A slide-in panel from the right edge of the screen — the primary mechanism for depth.

- **Trigger:** "View more" buttons, clickable career items, skills, KPIs, projects
- **Entrance:** Slides in from the right. Dashboard content blurs slightly behind via backdrop-filter.
- **Adaptive width:**
  - **Narrow (~400px):** For simple items — individual skills, education entries, single KPI stories
  - **Wide (~60% viewport):** For complex items — career roles with achievement lists, projects with screenshots/outcomes/tech stacks
- **Close:** Click outside the panel, press Escape, or click a close button
- **Animation:** 250ms ease-out slide, 150ms backdrop blur transition
- **Accessibility:** Focus trap when open, Escape to close, ARIA role="dialog"

### 2.2 Sub-Navigation Bar

A fixed navigation strip below the TopBar for section jumping.

- **Position:** Immediately below TopBar, above the card grid content area
- **Labels:** `Overview` | `Skills` | `Experience` | `Projects` | `Education`
- **Behaviour:**
  - Click → smooth-scroll to that section
  - Active tab highlights based on scroll position (IntersectionObserver)
  - Sticky — stays visible as user scrolls
- **Style:** Clean, understated. Matches GP system tab row aesthetic. Teal underline for active tab.

### 2.3 Hover + Click Interaction Model

Everything should feel alive and reactive:

- **Hover:** Items lift slightly — shadow deepens, subtle border colour shift. Cursor changes to pointer.
- **Click:** Opens the detail panel with full content for that item.
- **Career activity items:** Expand a small amount inline on hover (preview), then full detail via click → panel.

---

## 3. Revised Dashboard Layout

Tile order changes to prioritise what matters. Projects move up to be prominent. Skills get full width above career history.

```
┌───────────────────────────────────────────────────────┐
│  TopBar (fixed, 48px)                                 │
│  Brand | Search (Ctrl+K) | Session: a.recruiter       │
├───────────────────────────────────────────────────────┤
│  Sub-Nav Bar (fixed/sticky)                           │
│  Overview | Skills | Experience | Projects | Education│
├───────────┬───────────────────────────────────────────┤
│           │                                           │
│  Sidebar  │  1. Patient Summary         (full width)  │
│  (272px)  │     CV_v4.md profile text                 │
│           │                                           │
│  Person   │  2. Latest Results | Projects             │
│  Header   │     (KPIs, left)  | (card grid, right)    │
│           │                                           │
│  Tags     │  3. Repeat Medications      (full width)  │
│           │     Categorised skill groups               │
│  Alerts   │                                           │
│           │  4. Last Consultation       (full width)  │
│           │                                           │
│           │  5. Career Activity         (full width)  │
│           │     Timeline + Career Constellation        │
│           │                                           │
│           │  6. Education               (full width)  │
│           │                                           │
└───────────┴───────────────────────────────────────────┘
```

### Changes from current:
- **Projects move from bottom → half-width right column** (row 2, alongside KPIs)
- **Skills move from half-width right → full-width** (row 3, above career history)
- **Sub-nav bar added** between TopBar and content
- **TopBar session info** shows `a.recruiter` post-login

---

## 4. Section Requirements

### 4.1 Patient Summary (Profile)

**Content source:** The `## Profile` section from `CV_v4.md`:

> "Healthcare leader combining clinical pharmacy expertise with proficiency in Python, SQL, and data analytics, self-taught over the past decade through a drive to find root causes in data and build the most efficient solutions to complex problems. Currently leading population health analytics for NHS Norfolk & Waveney ICB, serving a population of 1.2 million..."

**Presentation:**
- Use the full profile paragraph from CV_v4.md
- Structured — consider pulling out key highlights (years of experience, population served, budget managed) as a visual strip alongside the narrative
- Not a wall of text — break it up with hierarchy

---

### 4.2 Latest Results (KPIs) — Left Column

**Problem:** Current flip cards feel like footnotes. £220M should be a headline.

**Dashboard display:**
- 4 KPI cards with **bold, large headline numbers** — visually dominant
- Stronger contrast, larger type than current implementation
- Each card is clearly clickable

**Click → Detail Panel (narrow):**
- Opens with the **story behind the number**
- Structure per KPI:
  - Headline number + label
  - Context: what it covers, scope, significance
  - Your role: what you did with this number
  - Key decisions or outcomes
  - Optional: supporting visual (mini chart, comparison, timeline)

**KPIs from CV_v4.md:**
1. **£220M** — Prescribing budget managed with sophisticated forecasting models
2. **£14.6M** — Efficiency programme identified through data analysis; over-target by Oct 2025
3. **9+ Years** — Professional experience (Aug 2016–present)
4. **1.2M** — Population served (Norfolk & Waveney ICS)

---

### 4.3 Projects (Investigations) — Right Column (NEW POSITION)

**Problem:** Currently buried at the bottom as small expandable items.

**Dashboard display:**
- Card grid with **thumbnails/screenshots**, title, status badge, tech tags
- Prominent placement alongside KPIs draws immediate attention
- Each card is clickable

**Click → Detail Panel (wide):**
- Full project description
- Outcome metrics and results
- Tech stack with tags
- Live link / GitHub link where available
- Screenshot or demo visual

**Projects from current data:**
1. PharMetrics Interactive Platform (2024, Live) — with external link
2. Patient Switching Algorithm (2025, Complete)
3. Blueteq Generator (2023, Complete)
4. CD Monitoring System (2024, Complete)
5. Sankey Chart Analysis Tool (2023, Complete)

---

### 4.4 Skills / Repeat Medications — Full Width (NEW POSITION)

**Problem:** Only 5 skills, no categorisation, no view more.

**Dashboard display:**
- **Categorised groups** (like BNF chapters in a real formulary):
  - **Technical:** Python, SQL, Power BI, JavaScript/TypeScript, Real-world data analysis, Dashboard/tool development, Algorithm design, Data pipeline development
  - **Healthcare Domain:** Medicines optimisation, Population health analytics, NICE TA implementation, Health economics & outcomes, Clinical pathway development, Controlled drug assurance
  - **Strategic & Leadership:** Budget management (£220M), Stakeholder engagement, Pharmaceutical negotiation, Team development & training, Change management, Financial scenario modelling, Executive communication
- **Display:** Top 3-5 per category visible on the dashboard tile, with medication-style frequency/dosing metaphor
- **"View all" button** per category or for the whole section

**Click → Detail Panel (narrow):**
- Full categorised list of all skills
- Each skill with: proficiency level, years of experience, frequency metaphor (daily, twice daily, when required, etc.)
- Skills are interactive — clicking a skill could show which roles/projects used it

---

### 4.5 Last Consultation — Full Width

**Dashboard display:**
- Most recent role with headline info (title, organisation, dates, type)
- Brief preview of key achievements (2-3 bullets)

**Click → Detail Panel (wide):**
- Full role description from CV_v4.md
- All achievement bullets
- Technical environment
- Coded entries (if applicable)

---

### 4.6 Career Activity + Career Constellation — Full Width

#### Timeline (existing, enhanced)
- Colour-coded timeline: teal (roles), amber (projects), green (certifications), purple (education)
- **Extended back to school (2009)** — Highworth Grammar through university through career
- Role entries expand slightly on hover with preview text
- Click → detail panel for full role information

#### Career Constellation (NEW — D3.js)
- **Embedded within the Career Activity section** as a large visual (not a separate view)
- **Force-directed network graph** built with D3.js:
  - **Role nodes:** Large, positioned chronologically left-to-right
    - Pre-Registration Pharmacist, Paydens (2015-2016)
    - Duty Pharmacy Manager, Tesco (2016-2017)
    - Pharmacy Manager, Tesco (2017-2022)
    - High-Cost Drugs & Interface Pharmacist, NHS (2022-2024)
    - Deputy Head, Population Health & Data Analysis, NHS (2024-present)
    - Interim Head, Population Health & Data Analysis, NHS (2025)
  - **Skill nodes:** Smaller, orbit around the roles they belong to
    - Colour-coded by domain: clinical (green), technical (teal), leadership (amber)
  - **Bridge connections:** Skills spanning multiple roles create visible links between eras
    - e.g., Python connects Tesco-era self-teaching → NHS data work
    - e.g., Clinical pathway knowledge bridges community pharmacy → NHS HCD role
  - **Interactions:**
    - Hover role → its skill cluster highlights and radiates outward
    - Hover skill → all roles that used it illuminate, showing the through-line
    - Click role/skill → detail panel
  - **Purpose:** Demonstrates D3.js/data-vis capability as portfolio content itself

---

### 4.7 Education — Full Width

**Dashboard display:**
- Education entries with more detail than current:
  1. MPharm (Hons) 2:1 — University of East Anglia, 2011-2015
     - Research project: Drug delivery & cocrystals, 75.1% (Distinction)
     - 4th year OSCE: 80%
  2. Mary Seacole Programme — NHS Leadership Academy, 2018, 78%
  3. A-Levels — Highworth Grammar School, 2009-2011
     - Mathematics (A*), Chemistry (B), Politics (C)

**Click → Detail Panel (narrow):**
- Full education detail including extracurriculars (Pharmacy Society President, Ultimate Frisbee VP, Alzheimer's Society)
- Research project description
- Mary Seacole programme detail (change management, healthcare leadership, system-level thinking)

---

## 5. Login Page Refresh

### 5.1 Visual Overhaul
- Restyle the login card to match the GP dashboard aesthetic:
  - Teal accents (not the current colour scheme)
  - Elvaro Grotesque font
  - Refined shadows matching the three-tier system
  - Warm palette cohesive with the dashboard it leads into
- Background should feel like the system's pre-authenticated state

### 5.2 Username Change
- **Username typed:** `a.recruiter` (the recruiter is logging into your clinical records)
- **TopBar post-login:** Session shows `a.recruiter` as the logged-in user
- Password typing remains as dots

### 5.3 "Awaiting Secure Connection" Polish
- Below the login button: a status indicator area
- **Initial state:** Red dot + "Awaiting secure connection..."
- **After ~2 seconds:** Dot transitions to green + "Secure connection established"
- **Login button** becomes clearly interactive only after the green state (was previously greyed/inactive)
- Optional: subtle smart card or security authentication visual cue (e.g., a small chip card icon or lock icon animating)

### 5.4 Post-Login Transition
- On button click: brief "System loading..." state with a clinical-style progress indicator
- Slight delay (500-800ms) to feel purposeful
- Then dashboard materialises with the existing staggered entrance animation (TopBar → Sidebar → Content)

---

## 6. Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Career Constellation | D3.js | Industry standard. Most impressive as portfolio piece. Demonstrates serious data-vis skill. |
| Detail Panel | Custom React component | Slide-in panel with backdrop blur. Adaptive width based on content type. |
| Sub-Nav | IntersectionObserver + scroll | Scroll-spy for active state, smooth scroll on click. |
| Content source | CV_v4.md | Primary source of truth for all factual content. |

---

## 7. Content Source Hierarchy

1. **`References/CV_v4.md`** — Primary source of truth for all roles, dates, achievements, numbers
2. **`References/Andy_Charlwood_CV_ATS_Optimised.pdf`** — Supplementary context only. Do NOT include wholesale. Use only when CV_v4.md lacks specific detail.
3. **`cv-website` data** — Reference for interactivity patterns and content structure, not content itself

---

## 8. What This Specification Does NOT Cover

Per `/sc:brainstorm` boundaries, this document covers requirements only:

- **No architecture decisions** — use `/sc:design` for component architecture
- **No implementation code** — use `/sc:implement` for building
- **No database schemas or API contracts** — N/A (static SPA)
- **No technical specifications beyond requirements** — implementation details deferred

### Recommended Next Steps
1. `/sc:design` — Design component architecture for detail panel, sub-nav, constellation
2. `/sc:workflow` — Generate implementation task breakdown
3. Implementation — Build in phases (core UX patterns → section depth → constellation → login refresh)
