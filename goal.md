# Design 7: The Clinical Record

## Overview

Andy's CV is presented as a **Patient Medical Record (PMR) system** — the kind of GP clinical software (EMIS Web, SystmOne, Vision) that Andy and every pharmacist in the UK interacts with daily. The "patient" is Andy's career. The user navigates the interface exactly as a clinician would navigate a patient record, and each section of the PMR reveals a different facet of Andy's professional life.

This is NOT a handwritten prescription pad or a clinical "theme" loosely applied. This is a **faithful digital clinical information system** — structured, database-driven, tabular, with the distinctive UI patterns of actual NHS clinical software: patient banner at the top, tabbed clinical views, consultation history as a reverse-chronological journal, medications list with dosage columns, coded entries with SNOMED-style references, traffic-light status indicators, and action buttons styled as clinical system controls.

The concept works on two levels simultaneously:

1. **For clinicians and pharmacists**: Immediate recognition. They will see a system they use every day and understand the navigation instinctively. The joke lands because of its fidelity — this isn't a parody, it's a faithful reproduction repurposed for a CV. They'll smile.

2. **For recruiters and hiring managers**: A novel, highly navigable interface. Clinical record systems are designed for rapid information retrieval under time pressure — exactly what a recruiter needs. The tabbed views, the structured data, the alert banners — all make it fast to find what matters.

**Key characteristics:**
- Sidebar navigation with clinical record categories (Summary, Consultations, Medications, Problems, Investigations, Documents, Referrals)
- Patient banner with persistent demographic context
- Consultation-journal format for experience (History / Examination / Plan)
- Tabular medications list for skills with proficiency "dosages"
- Clinical alert system for standout achievements
- Light-mode only — clinical systems are light-mode by design
- Border-heavy, table-heavy, functional — zero decorative flourish

---

## ECG Transition

**Starting point:** "ANDREW CHARLWOOD" is on screen in neon green (`#00ff41`) on black. The heartbeat trace is complete. The name is fully formed and glowing.

**Then...**

### Phase 1: The Flatline (600ms)

The neon green name holds for a beat (300ms). Then the glow around the letters begins to fade. Simultaneously, from the right edge of the name, a flatline trace extends rightward — a perfectly horizontal green line drawn at the baseline, extending across the remaining viewport width over 300ms. The visual reads as a patient monitor flatline. This is deliberate: the "patient" (the animation phase) is ending. A new record is about to open.

The flatline has a subtle audio-visual implication without actual sound — the green line is steady and unbroken, the glow around the name letters reduces to zero. The entire canvas is now: a fading green name with a horizontal flatline extending to the right edge. All on black.

### Phase 2: Screen Clear (400ms)

The entire canvas fades to black over 200ms (the name and flatline dissolve into darkness). Then, from black, the background transitions to a dark blue-gray (`#1E293B`) over 200ms. This is the color of a clinical system login screen — the dark institutional background that every NHS worker recognizes from their Monday morning.

### Phase 3: Login Sequence (1200ms)

A login panel materializes center-screen: a white card (320px wide, 12px border-radius, subtle shadow) on the dark blue-gray background. The card contains:

- A small NHS-blue shield icon or generic clinical system logo at the top
- **Username field**: Empty text input with label "Username". After 200ms, a cursor appears and types `A.CHARLWOOD` character by character (30ms per character, ~350ms total). The typing uses Geist Mono / monospace font.
- **Password field**: After a 150ms pause, dots fill the password field in rapid succession (8 dots, 20ms each, ~160ms total).
- **"Log In" button**: NHS blue (`#005EB8`), full width. After another 150ms pause, the button receives a subtle pressed state (darkens slightly, 100ms) as if clicked.

The login card holds for 200ms in its "submitted" state, then...

### Phase 4: Interface Materialization (500ms)

The login card scales up slightly (103%) and fades out (200ms). As it fades, the full PMR interface fades in behind it:

1. **Patient banner** slides down from the top edge (200ms, ease-out)
2. **Sidebar** slides in from the left edge (250ms, ease-out, starting 50ms after the banner)
3. **Main content area** (Summary view) fades in (300ms, starting 100ms after sidebar begins)
4. **Clinical alert banner** slides down from beneath the patient banner (250ms, spring easing, starting 200ms after main content appears)

### Phase 5: Final State

The full PMR interface is visible: patient banner at top, dark sidebar on left, Summary view in the main content area, and the clinical alert banner demanding attention. The user is now "logged in" to Andy's career record.

**Total transition duration:** ~2.7 seconds

**Why this works:** The login sequence is the most immersive transition of all six designs. Every NHS worker, every pharmacist, every GP has typed their credentials into a clinical system at 8am on a Monday. This transition puts them right there. It's specific, it's authentic, and it immediately establishes the metaphor: you are opening a patient record. The "patient" happens to be a career.

---

## Visual System

### Color Palette

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

### Typography

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

### Spacing and Layout

- **Sidebar width:** 220px (fixed, desktop). Collapses to 56px (icon-only) on tablet.
- **Patient banner height:** 80px (full), 48px (condensed/sticky)
- **Main content max-width:** No max-width — clinical systems fill available space. Content flows within the area between sidebar and viewport edge.
- **Main content padding:** 24px
- **Card padding:** 16px (clinical systems are more compact than marketing sites)
- **Border radius:** 4px for cards and inputs (clinical systems use minimal rounding — 4px, not 12px or 16px)
- **Table row height:** 40px
- **Section spacing:** 24px between content blocks
- **Base unit:** 4px — tighter spacing than the Dashboard design, reflecting clinical system density

### Borders and Surfaces

Borders are the dominant visual structuring element. Clinical systems do not rely on shadows or negative space — they use explicit borders to delineate every element.

- **All cards:** `1px solid #E5E7EB` (gray-200) border, `4px` border-radius, no shadow (or at most `0 1px 2px rgba(0,0,0,0.03)`)
- **Table cells:** `1px solid #E5E7EB` borders (all sides)
- **Sidebar border:** `1px solid #334155` (subtle right border in a slightly lighter shade)
- **Patient banner border:** `1px solid #475569` bottom border
- **Input fields:** `1px solid #D1D5DB` border, `4px` radius, `#FFFFFF` background, `8px 12px` padding
- **Active/selected rows:** `#EFF6FF` background (very subtle blue tint) — this is how EMIS highlights the selected row

### Motion

Clinical systems are fast and functional. Animations are minimal and purposeful — no spring physics, no bouncy transitions. Everything is immediate or uses simple ease-out.

- **Navigation switches:** Instant content swap. No crossfade, no slide. When you click a sidebar item, the main content area replaces immediately — just like clicking a tab in EMIS.
- **Consultation expand/collapse:** Height animation, 200ms, `ease-out`. No opacity fade — the content simply grows/shrinks.
- **Alert banner entrance:** Slide down from top, 250ms, with a subtle spring overshoot (this is the one exception — alerts are meant to demand attention).
- **Alert acknowledge:** The alert shrinks in height to zero (200ms) with a small green checkmark that flashes briefly.
- **Hover states:** Background-color transitions, 100ms. No transforms, no lifts. Just color.
- **Login typing:** Character-by-character reveal using `setInterval` (30ms per character for username, 20ms per dot for password).
- **Patient banner scroll condensation:** Smooth height transition (200ms) from full (80px) to condensed (48px) as user scrolls past the first 100px of content.
- **`prefers-reduced-motion`:** Typing animation completes instantly (full text appears), alert slides are replaced with fade-in, expand/collapse is instant.

---

## Section-by-Section Design

### Patient Banner (Persistent Top Chrome)

The patient banner is the most recognizable element of any PMR system. It spans the full viewport width above the main content area and provides constant demographic context.

**Full banner (80px height, visible at top of page):**

```
+---------------------------------------------------------------------------+
| CHARLWOOD, Andrew (Mr)                        Active ●  Open to opps.    |
| DOB: 14/02/1993  |  NHS No: 2211810  |  Norwich, NR1                     |
| 07795553088  |  andy@charlwood.xyz    [Download CV] [Email] [LinkedIn]    |
+---------------------------------------------------------------------------+
```

**Content mapping:**

| PMR Field | Actual Content | Notes |
|-----------|---------------|-------|
| Patient name | CHARLWOOD, Andrew (Mr) | Surname first, comma-separated — exactly as in clinical systems |
| DOB | 14/02/1993 | DD/MM/YYYY format (UK clinical standard) |
| NHS Number | 221 181 0 | Andy's GPhC registration number formatted like an NHS number (with spaces). Hover tooltip: "GPhC Registration Number" |
| GP Practice | Self-Referred | Tongue-in-cheek — Andy referred himself to this record |
| Address | Norwich, NR1 | Abbreviated postcode area |
| Phone | 07795553088 | Clickable (tel: link) |
| Email | andy@charlwood.xyz | Clickable (mailto: link) |
| Status | Active (green dot) | Like the "registered" status in a PMR |
| Badge | Open to opportunities | Styled as a clinical banner tag (blue background, white text, small pill shape) |

**Action buttons (top right of banner):**

| Button | PMR Equivalent | Action |
|--------|---------------|--------|
| Download CV | Print Summary | Downloads PDF version of CV |
| Email | Send Letter | Opens mailto: link |
| LinkedIn | External Link | Opens LinkedIn profile in new tab |

Buttons are styled as small outlined rectangles with NHS blue text and 1px NHS blue border, 4px radius. On hover: filled NHS blue background with white text.

**Condensed banner (48px, sticky after scroll):**

When the user scrolls past 100px of content, the banner smoothly condenses to show only the essential information on a single line:

```
CHARLWOOD, Andrew (Mr) | NHS No: 2211810 | Active ●     [Download CV] [Email]
```

The condensed banner sticks to the top of the viewport (`position: sticky`) with a `z-index` above the content area but below modals/alerts.

---

### Left Sidebar — Clinical Navigation

The sidebar replicates the dark navigation panel found in EMIS Web and similar clinical systems. It provides category-based access to different "record views."

**Width:** 220px (desktop), dark blue-gray (`#1E293B`) background.

**Navigation items:**

| Icon | Label | Maps To | Description |
|------|-------|---------|-------------|
| `ClipboardList` | Summary | Profile overview | Demographics, active problems, current meds, recent consultation |
| `FileText` | Consultations | Experience | Reverse-chronological journal of roles |
| `Pill` | Medications | Skills | Active medications list = skills with dosages |
| `AlertTriangle` | Problems | Achievements | Problem list = challenges resolved and ongoing |
| `FlaskConical` | Investigations | Projects | Investigation results = project outcomes |
| `FolderOpen` | Documents | Education | Attached documents = certificates and qualifications |
| `Send` | Referrals | Contact | Referral form = contact/message form |

**Styling:**
- Each item: 44px height, 16px left padding, icon (18px, `lucide-react`) + label in Inter 500, 14px
- Default state: white text at 70% opacity, transparent background
- Hover state: white text at 100% opacity, background `rgba(255,255,255,0.08)`
- Active state: white text at 100%, NHS blue left border (3px), background `rgba(255,255,255,0.12)`, label in Inter 600
- A thin horizontal separator line (`1px solid rgba(255,255,255,0.1)`) appears between "Summary" and "Consultations" (separating the overview from the detail views)

**Sidebar footer:**
At the bottom of the sidebar, in small text (Inter 400, 11px, `#64748B`):
```
Session: A.CHARLWOOD
Logged in: [current time]
```
This updates with the actual current time on mount, reinforcing the "logged in" metaphor.

**Sidebar header:**
At the top, above the navigation items, a small logo or system name:
```
CareerRecord PMR
v1.0.0
```
In Inter 500, 13px, white at 50% opacity. Styled like the "EMIS Web" branding that appears in the top-left of the real system.

---

### Summary View

The landing view after login. This mimics the "Patient Summary" screen — the first screen a clinician sees when opening a patient record, showing the most important information at a glance.

**Layout:** A grid of summary cards arranged in a 2-column layout on desktop, single column on mobile. Each card has a header bar with the card title in Inter 600, 14px, uppercase, on a `#F9FAFB` background with `1px solid #E5E7EB` bottom border.

**Card 1: Patient Demographics (spans full width)**

```
+--[ Patient Demographics ]------------------------------------------+
| Name:         Andrew Charlwood          Status:    Active ●         |
| DOB:          14 February 1993          Location:  Norwich, UK      |
| Registration: GPhC 2211810              Since:     August 2016      |
| Qualification: MPharm (Hons) 2:1        University: UEA, 2015      |
+---------------------------------------------------------------------+
```

A two-column key-value table. Labels in Inter 500, 13px, gray-500. Values in Inter 400, 14px, gray-900. Labels right-aligned, values left-aligned — mimicking clinical system demographics layout.

**Card 2: Active Problems (left column)**

```
+--[ Active Problems ]-----------------------------------------------+
| ● Deputy Head, Pop. Health & Data Analysis       Jul 2024–Present   |
|   NHS Norfolk & Waveney ICB                                         |
| ● £220M prescribing budget management            Ongoing            |
| ● Patient-level SQL analytics transformation     In progress        |
+---------------------------------------------------------------------+
```

A list with green dots for active/current items, amber dots for in-progress items. Each entry has a title in Inter 500, 14px, and a date range or status in Geist Mono, 12px, right-aligned. Click an entry to navigate to the corresponding Consultation.

**Card 3: Current Medications — Quick View (right column)**

```
+--[ Current Medications (Quick View) ]-------------------------------+
| Python          | 90%  | Daily     | Active ●                      |
| SQL             | 88%  | Daily     | Active ●                      |
| Power BI        | 92%  | Daily     | Active ●                      |
| Data Analysis   | 95%  | Daily     | Active ●                      |
| JS / TypeScript | 70%  | Weekly    | Active ●                      |
|                                          [View Full List →]          |
+---------------------------------------------------------------------+
```

A compact 4-column table showing the top 5 skills. "View Full List" links to the Medications view. Table headers are uppercase, 12px, gray-400. Table rows alternate between `#FFFFFF` and `#F9FAFB` backgrounds.

**Card 4: Last Consultation (spans full width)**

```
+--[ Last Consultation ]----------------------------------------------+
| Date: May 2025   Clinician: A. Charlwood   Location: NHS N&W ICB    |
|                                                                      |
| Interim Head, Population Health & Data Analysis                      |
| Led strategic delivery of population health initiatives and          |
| data-driven medicines optimisation across Norfolk & Waveney ICS...   |
|                                            [View Full Record →]      |
+---------------------------------------------------------------------+
```

A preview of the most recent role, truncated to 2-3 lines. "View Full Record" navigates to Consultations with that entry expanded.

**Card 5: Alerts (full width, positioned above all other cards)**

This is the **Clinical Alert** — see the dedicated section below.

---

### Consultations View (= Experience)

Each role is a "consultation entry" in a reverse-chronological journal. This is the core content view and the most detailed section.

**Journal list layout:**

Entries are stacked vertically, most recent at top. Each entry has a collapsed state and an expanded state.

**Collapsed entry:**

```
+------------------------------------------------------------------+
| ● 14 May 2025 | NHS Norfolk & Waveney ICB                        |
|   Interim Head, Population Health & Data Analysis                 |
|   Key: £14.6M efficiency programme identified and delivered       |
|                                                    [▼ Expand]     |
+------------------------------------------------------------------+
```

- Date in Geist Mono, 13px, gray-500 (left-aligned)
- Organization in Inter 400, 13px, NHS blue
- Role title in Inter 600, 15px, gray-900
- Key coded entry: a single-line summary of the most notable achievement, prefixed with "Key:" in Inter 500, gray-500
- Expand chevron button (right-aligned)
- Status dot: green for current roles, gray for historical

**Expanded entry (click to expand):**

```
+------------------------------------------------------------------+
| ● 14 May 2025 | NHS Norfolk & Waveney ICB              [▲ Close] |
|   Interim Head, Population Health & Data Analysis                 |
|   Duration: May 2025 — Nov 2025                                  |
|                                                                    |
|   HISTORY                                                         |
|   Returned to substantive Deputy Head role following              |
|   commencement of ICB-wide organisational consultation.           |
|   Led strategic delivery of population health initiatives         |
|   and data-driven medicines optimisation across Norfolk &         |
|   Waveney ICS, reporting to Associate Director of Pharmacy.       |
|                                                                    |
|   EXAMINATION                                                     |
|   - Identified £14.6M efficiency programme through                |
|     comprehensive data analysis                                    |
|   - Built Python-based switching algorithm: 14,000 patients       |
|     identified, £2.6M annual savings                              |
|   - Automated incentive scheme analysis: 50% reduction            |
|     in targeted prescribing within 2 months                       |
|                                                                    |
|   PLAN                                                            |
|   - Achieved over-target performance by October 2025              |
|   - £2M on target for delivery this financial year                |
|   - Presented to CMO bimonthly with evidence-based                |
|     recommendations                                                |
|   - Led transformation to patient-level SQL analytics             |
|                                                                    |
|   CODED ENTRIES                                                   |
|   [EFF001] Efficiency programme: £14.6M identified               |
|   [ALG001] Algorithm: 14,000 patients, £2.6M savings             |
|   [AUT001] Automation: 50% prescribing reduction in 2mo          |
|   [SQL001] Data transformation: practice→patient level            |
+------------------------------------------------------------------+
```

**The History / Examination / Plan structure:**

This is a direct mapping from the clinical consultation format (SOAP notes: Subjective, Objective, Assessment, Plan) to career content:

| Clinical Term | CV Mapping | What Goes Here |
|--------------|------------|----------------|
| **History** | Context / Background | Why this role existed, what situation Andy walked into, reporting lines |
| **Examination** | Analysis / Findings | What Andy discovered, built, or analyzed — the technical and analytical work |
| **Plan** | Outcomes / Delivery | What was achieved, what impact was measured, what's ongoing |

Section headers ("HISTORY", "EXAMINATION", "PLAN") are styled in Inter 600, 12px, uppercase, letter-spacing 0.05em, gray-400 — exactly like the section dividers in a clinical consultation record.

**Coded entries:**

At the bottom of each expanded consultation, "coded entries" appear — short-form tagged achievements with bracket codes. These mimic SNOMED CT / Read codes used in clinical systems. The codes are fictional but consistent (EFF = efficiency, ALG = algorithm, AUT = automation, SQL = data, etc.). Styled in Geist Mono, 12px, gray-500, with the code in brackets and the description after.

**Color coding by employer:**

Each consultation entry has a subtle left border (3px) indicating the employer:
- NHS Norfolk & Waveney ICB: NHS blue (`#005EB8`)
- Tesco PLC: Teal (`#00897B`)

This visual grouping helps the user quickly scan which organization each entry belongs to, without reading the text.

**Full consultation journal (all roles mapped):**

| Date | Organization | Role | Key Coded Entry |
|------|-------------|------|-----------------|
| May 2025 | NHS N&W ICB | Interim Head, Pop. Health & Data Analysis | [EFF001] £14.6M efficiency programme |
| Jul 2024 | NHS N&W ICB | Deputy Head, Pop. Health & Data Analysis | [BUD001] £220M budget management |
| May 2022 | NHS N&W ICB | High-Cost Drugs & Interface Pharmacist | [AUT002] Blueteq automation: 70% reduction |
| Nov 2017 | Tesco PLC | Pharmacy Manager | [INN001] Asthma screening: ~£1M national revenue |
| Aug 2016 | Tesco PLC | Duty Pharmacy Manager | [REG001] GPhC registration commenced |

---

### Medications View (= Skills)

Skills presented as an active medications list — the format every pharmacist and GP reads daily.

**Full table layout:**

```
+--[ Active Medications ]-------------------------------------------------+
| Drug Name          | Dose  | Frequency  | Start    | Status            |
|--------------------+-------+------------+----------+-------------------|
| Python             | 90%   | Daily      | 2017     | Active ●          |
| SQL                | 88%   | Daily      | 2017     | Active ●          |
| Power BI           | 92%   | Daily      | 2019     | Active ●          |
| Data Analysis      | 95%   | Daily      | 2016     | Active ●          |
| JavaScript / TS    | 70%   | Weekly     | 2020     | Active ●          |
| Dashboard Dev      | 88%   | Weekly     | 2019     | Active ●          |
| Algorithm Design   | 82%   | Weekly     | 2022     | Active ●          |
| Data Pipelines     | 80%   | Weekly     | 2022     | Active ●          |
+-------------------------------------------------------------------------+

+--[ Clinical Medications ]-----------------------------------------------+
| Drug Name               | Dose  | Frequency  | Start  | Status         |
|-------------------------+-------+------------+--------+----------------|
| Medicines Optimisation  | 95%   | Daily      | 2016   | Active ●       |
| Pop. Health Analytics   | 90%   | Daily      | 2022   | Active ●       |
| NICE TA Implementation  | 85%   | Weekly     | 2022   | Active ●       |
| Health Economics         | 80%   | Monthly    | 2023   | Active ●       |
| Clinical Pathways        | 82%   | Weekly     | 2022   | Active ●       |
| CD Assurance             | 88%   | Weekly     | 2024   | Active ●       |
+-------------------------------------------------------------------------+

+--[ PRN (As Required) ]--------------------------------------------------+
| Drug Name                | Dose  | Frequency  | Start  | Status         |
|-------------------------+-------+------------+--------+----------------|
| Budget Management        | 90%   | As needed  | 2024   | Active ●       |
| Stakeholder Engagement   | 88%   | As needed  | 2022   | Active ●       |
| Pharma Negotiation       | 85%   | As needed  | 2024   | Active ●       |
| Team Development         | 82%   | As needed  | 2017   | Active ●       |
+-------------------------------------------------------------------------+
```

**Column definitions:**

| Column | PMR Meaning | CV Mapping |
|--------|------------|------------|
| Drug Name | Medication name | Skill name |
| Dose | Dosage strength | Proficiency percentage |
| Frequency | How often taken | How often the skill is used (Daily / Weekly / Monthly / As needed) |
| Start | Date prescribed | Year Andy started using this skill (approximate) |
| Status | Active / Stopped | Active (green dot) for current skills, Historical (gray dot) for deprecated skills |

**Medication categories (tabs within the view):**

Skills are grouped into three "medication types," mimicking how clinical systems separate regular, acute, and PRN medications:

- **Active Medications** = Technical skills (the "regular medications" — taken daily, core to function)
- **Clinical Medications** = Healthcare domain skills (the specialist prescriptions)
- **PRN (As Required)** = Strategic & leadership skills (used situationally, not daily)

**Table styling:**
- Table headers: Inter 600, 13px, uppercase, gray-400, `#F9FAFB` background
- Table rows: alternating `#FFFFFF` / `#F9FAFB` backgrounds
- Row height: 40px
- All borders: `1px solid #E5E7EB`
- Hover state: row background changes to `#EFF6FF` (subtle blue tint)
- Status dots: 6px circles, inline with status text

**Interaction — Prescribing History:**

Clicking any medication/skill row expands it downward to show a "prescribing history" — a mini-timeline of how the skill developed:

```
Python | 90% | Daily | 2017 | Active ●
  └─ Prescribing History:
     2017  Started: Self-taught for data analysis automation
     2019  Increased: Dashboard development, data pipeline work
     2022  Specialist use: Blueteq automation, Sankey analysis tools
     2024  Advanced: Switching algorithm (14,000 patients), CD monitoring
     2025  Current: Population-level analytics, incentive scheme automation
```

The history entries are styled in Geist Mono, 12px, with year markers as bold anchors and descriptions in regular weight. This "prescribing history" shows skill progression in a format that clinicians understand intuitively.

**Sortable columns:**

Table columns are sortable by clicking the header. Clicking "Dose" sorts by proficiency descending. Clicking "Start" sorts chronologically. A small sort indicator arrow appears in the active sort column header. Default sort: by category grouping.

---

### Problems View (= Achievements / Challenges)

The "Problems" list in a clinical record tracks diagnoses — conditions that were identified, treated, and either resolved or require ongoing management. This maps perfectly to career achievements: challenges that Andy identified and resolved.

**Two sections: Active Problems and Resolved Problems.**

**Active Problems (current / ongoing):**

```
+--[ Active Problems ]----------------------------------------------------+
| Status | Code      | Problem                              | Since      |
|--------+-----------+--------------------------------------+------------|
| ● AMB  | [MGT001]  | £220M prescribing budget oversight   | Jul 2024   |
| ● GRN  | [TRN001]  | Patient-level SQL transformation     | 2025       |
| ● AMB  | [LEA001]  | Team data literacy programme         | Jul 2024   |
+-------------------------------------------------------------------------+
```

**Resolved Problems (past achievements):**

```
+--[ Resolved Problems ]--------------------------------------------------+
| Status | Code      | Problem                        | Resolved  | Outcome                                  |
|--------+-----------+--------------------------------+-----------+------------------------------------------|
| ● GRN  | [EFF001]  | Manual prescribing analysis    | Oct 2025  | Python algorithm: 14,000 pts, £2.6M/yr   |
|        |           | inefficiency                   |           |                                          |
| ● GRN  | [EFF002]  | £14.6M efficiency target       | Oct 2025  | Over-target performance achieved          |
| ● GRN  | [AUT001]  | Blueteq form creation backlog  | 2023      | 70% reduction, 200hrs saved              |
| ● GRN  | [INN001]  | Asthma screening scalability   | 2019      | National rollout: ~300 branches, ~£1M    |
| ● GRN  | [AUT002]  | Incentive scheme manual calc.  | 2025      | Automated: 50% Rx reduction in 2 months  |
| ● GRN  | [DAT001]  | HCD spend tracking gaps        | 2023      | Blueteq-secondary care data integration  |
| ● GRN  | [VIS001]  | Patient pathway opacity        | 2023      | Sankey chart analysis tool               |
| ● GRN  | [MON001]  | Population opioid exposure     | 2024      | CD monitoring system: OME tracking       |
|        |           | monitoring                     |           |                                          |
+-------------------------------------------------------------------------+
```

**Column definitions:**

| Column | Meaning |
|--------|---------|
| Status | Traffic light: Green (resolved), Amber (in progress / active), Red (urgent — unused, reserved) |
| Code | SNOMED-style reference code. Fictional but internally consistent. Formatted in Geist Mono. |
| Problem | The challenge or opportunity Andy identified |
| Resolved | Date or year the problem was resolved |
| Outcome | Brief description of the resolution and its measurable impact |

**Click to expand:** Each problem row can be expanded to show a full narrative: what the problem was, how Andy approached it, what tools/methods were used, and the quantified outcome. The expanded state also shows "linked consultations" — clicking a link navigates to the relevant entry in Consultations view.

**Traffic light status indicators:**

Traffic lights are 8px circles with the status colors (green, amber, red, gray). They appear inline before the code column. This is exactly how clinical systems indicate problem severity/status — it's an immediately scannable visual language.

---

### Investigations View (= Projects)

Projects presented as diagnostic investigations — tests that were ordered, performed, and returned results.

**Investigation list:**

```
+--[ Investigation Results ]----------------------------------------------+
| Test Name                    | Requested | Status   | Result            |
|------------------------------+-----------+----------+-------------------|
| PharMetrics Interactive      | 2024      | Complete | Live ●            |
|   Platform                   |           |          |                   |
| Patient Switching Algorithm  | 2025      | Complete | 14,000 pts found  |
| Blueteq Generator            | 2023      | Complete | 70% reduction     |
| CD Monitoring System         | 2024      | Complete | Population-scale  |
| Sankey Chart Analysis Tool   | 2023      | Complete | Pathway audit     |
| Patient Pathway Analysis     | 2024      | Ongoing  | In development    |
+-------------------------------------------------------------------------+
```

**Status badges:**

Styled like laboratory result status indicators:
- **Complete** (green dot): Investigation finished, results available
- **Ongoing** (amber dot): Investigation still in progress
- **Live** (pulsing green dot): Results are actively being used (for PharMetrics, which is a live URL)

**Expanded investigation view:**

Clicking an investigation row reveals a detailed "results panel" below the row:

```
PharMetrics Interactive Platform
├─ Date Requested:  2024
├─ Date Reported:   2024
├─ Status:          Complete — Live at medicines.charlwood.xyz
├─ Requesting Clinician: A. Charlwood
├─ Methodology:
│    Real-time medicines expenditure dashboard providing
│    actionable analytics for NHS decision-makers. Built with
│    Power BI and SQL, tracking expenditure across the £220M
│    prescribing budget.
├─ Results:
│    - Real-time tracking of medicines expenditure
│    - Actionable analytics for budget holders
│    - Self-serve model for wider team
├─ Tech Stack:     Power BI, SQL, DAX
└─ [View Results →]  (external link to medicines.charlwood.xyz)
```

The expanded view uses a tree-like indented structure (with box-drawing characters in monospace) to present the investigation report. This mirrors how lab results and imaging reports appear in clinical systems — structured, indented, with labelled fields.

**"View Results" link:**

For PharMetrics (the only project with a live URL), a "View Results" button appears styled as an NHS blue action button. For internal projects, this button is absent.

---

### Documents View (= Education & Certifications)

Education and certifications presented as attached documents in the patient record — the scanned letters, certificates, and reports that get filed into a patient's record.

**Document list:**

```
+--[ Attached Documents ]-------------------------------------------------+
| Type           | Document                         | Date    | Source     |
|----------------+----------------------------------+---------+------------|
| 📄 Certificate | MPharm (Hons) 2:1                | 2015    | UEA        |
| 📄 Registration| GPhC Pharmacist Registration     | 2016    | GPhC       |
| 📄 Certificate | Mary Seacole Programme (78%)     | 2018    | NHS LA     |
| 📄 Results     | A-Levels: Maths A*, Chem B,     | 2011    | Highworth  |
|                | Politics C                       |         | Grammar    |
| 📄 Research    | Drug Delivery & Cocrystals       | 2015    | UEA        |
|                | (75.1% Distinction)              |         |            |
+-------------------------------------------------------------------------+
```

**Document type icons:** Small document icons (from Lucide: `FileText` for certificates, `Award` for registrations, `GraduationCap` for academic results, `FlaskConical` for research). These replace the generic emoji in the actual implementation.

**Click to expand:** Each document reveals a "preview" panel:

```
MPharm (Hons) 2:1 — University of East Anglia
├─ Type:           Academic Qualification
├─ Date Awarded:   2015
├─ Institution:    University of East Anglia, Norwich
├─ Classification: Upper Second-Class Honours (2:1)
├─ Duration:       2011 — 2015 (4 years)
├─ Research:       Drug delivery and cocrystals
│                  Grade: 75.1% (Distinction)
└─ Notes:          MPharm is a 4-year integrated Master's degree
                   required for pharmacist registration in the UK.
```

The preview panel uses the same tree-indented structure as the Investigations expanded view, maintaining visual consistency across the PMR interface.

---

### Referrals View (= Contact)

Contact information presented as a clinical referral form — the mechanism for "referring" a patient (Andy) to another service.

**Referral form layout:**

```
+--[ New Referral ]-------------------------------------------------------+
|                                                                          |
|  Referring to:  CHARLWOOD, Andrew (Mr)                                  |
|  NHS Number:    221 181 0                                               |
|                                                                          |
|  Priority:      ○ Urgent    ● Routine    ○ Two-Week Wait               |
|                                                                          |
|  Referrer Name:     [________________________]                          |
|  Referrer Email:    [________________________]                          |
|  Referrer Org:      [________________________]  (optional)              |
|                                                                          |
|  Reason for Referral:                                                   |
|  [                                                                ]     |
|  [                                                                ]     |
|  [                                                                ]     |
|                                                                          |
|  Contact Method:    ○ Email    ○ Phone    ○ LinkedIn                    |
|                                                                          |
|                                          [ Cancel ]  [ Send Referral ]  |
+-------------------------------------------------------------------------+
```

**Priority toggle (tongue-in-cheek):**

Three radio options styled like clinical referral priorities:
- **Urgent**: Red label, red dot. Selectable but the tooltip reads "All enquiries are welcome, urgent or not."
- **Routine**: Blue label, blue dot. Default selected.
- **Two-Week Wait**: Amber label. Tooltip: "NHS cancer referral pathway — this isn't that, but the spirit of promptness applies."

This is the design's main moment of humor. The priority options are visually authentic to clinical referral forms, and the tongue-in-cheek tooltips reward exploration without undermining the professional tone.

**Form fields:**

Standard clinical form inputs: `1px solid #D1D5DB` border, `4px` radius, `8px 12px` padding. Labels in Inter 500, 13px, gray-600, positioned above inputs. Focus state: border changes to NHS blue, subtle blue glow (`box-shadow: 0 0 0 3px rgba(0, 94, 184, 0.15)`).

**Submit button:**

"Send Referral" in NHS blue (`#005EB8`), white text, full width of the right half of the form. On hover: darkens to `#004494`. On click: brief loading state (spinner icon), then a success message:

```
✓ Referral sent successfully
  Reference: REF-2026-0210-001
  Expected response time: 24-48 hours
```

The reference number is generated from the current date. The success state mimics the confirmation screen shown after submitting a clinical referral in EMIS.

**Alternative contact methods (below the form):**

```
+--[ Direct Contact ]-----------------------------------------------------+
| Email:     andy@charlwood.xyz              [Send Email →]               |
| Phone:     07795553088                     [Call →]                      |
| LinkedIn:  linkedin.com/in/andycharlwood   [View Profile →]            |
| Location:  Norwich, UK                                                  |
+-------------------------------------------------------------------------+
```

Styled as a simple key-value table, same format as the Patient Demographics card in Summary view.

---

### The Clinical Alert (Signature Interaction)

When the user first loads the Summary view (immediately after the login transition), a clinical alert banner slides down from beneath the patient banner.

**Alert styling:**

```
+--[ ⚠ CLINICAL ALERT ]--------------------------------------------------+
| ⚠  ALERT: This patient has identified £14.6M in prescribing            |
|    efficiency savings across Norfolk & Waveney ICS.                     |
|                                                         [Acknowledge]   |
+-------------------------------------------------------------------------+
```

- Background: amber (`#FEF3C7` — amber-100, light amber)
- Left border: 4px solid `#F59E0B` (amber-500)
- Warning icon: `AlertTriangle` from Lucide, amber-600
- Text: Inter 500, 14px, `#92400E` (amber-800)
- "Acknowledge" button: small outlined button, amber border and text

**Behavior:**
1. The alert slides down from beneath the patient banner with a spring animation (250ms, slight overshoot) after the PMR interface finishes materializing.
2. It pushes the Summary content downward, so it's impossible to miss.
3. Clicking "Acknowledge" triggers a brief animation: a green checkmark replaces the warning icon (200ms), then the alert collapses upward (200ms, ease-out) and is gone.
4. The dismiss state is stored in React state (session-only) — refreshing the page shows the alert again.

**Why this works:** Clinical alerts are the mechanism that clinical systems use to put critical information in front of clinicians before they do anything else. They are the highest-priority information in the system. By framing Andy's most impressive metric ("£14.6M") as a clinical alert, it gets the same treatment — it's the first thing the user reads, it demands acknowledgment, and its format gives the number institutional weight. This is not a boast in a paragraph; it's a system-generated alert based on data. The framing makes the achievement feel objective.

**Second alert (optional, on Consultations view):**

When the user first navigates to Consultations, a secondary alert could appear:

```
⚠  NOTE: Patient has developed a Python-based switching algorithm
   identifying 14,000 patients for cost-effective medication alternatives.
   £2.6M annual savings potential. Review recommended.
```

This second alert reinforces the key technical achievement in clinical language. It appears only once (on first navigation to Consultations) and is dismissible with the same "Acknowledge" interaction.

---

## Interactions and Micro-interactions

### Sidebar Navigation
- Clicking a sidebar item instantly swaps the main content area. No crossfade, no transition — just an immediate swap. This matches clinical system behavior exactly: navigation is instant.
- The active sidebar item updates its left border (3px, NHS blue) and background tint simultaneously, with no animation (instant state change).

### Consultation Expand / Collapse
- Clicking a consultation entry toggles between collapsed (single-line summary) and expanded (full History/Examination/Plan) states.
- The expand animation: height grows from 0 to content height over 200ms, ease-out. Content opacity transitions from 0 to 1 over the same duration.
- Only one consultation can be expanded at a time. Expanding a new entry collapses the previous one.
- The expand chevron rotates 180 degrees (pointing up when expanded).

### Medication Row Hover
- Hovering a medication table row changes its background to `#EFF6FF` (subtle blue tint) — exactly how EMIS highlights the hovered row.
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
- Context menus are implemented with Headless UI `Menu` component for accessibility.
- Styled: white background, `1px solid #E5E7EB` border, 4px radius, `box-shadow: 0 4px 12px rgba(0,0,0,0.1)`. Items in Inter 400, 14px, 36px row height.

### Login Screen Typing
- The username types character-by-character (30ms per character).
- The password dots appear faster (20ms per dot).
- A blinking cursor appears in the active field (530ms blink interval).
- The "Log In" button shows a brief active/pressed state before the interface materializes.

---

## Navigation

### Primary Navigation: Left Sidebar

The sidebar is always visible on desktop — this is how clinical systems work. There is no floating nav, no hamburger menu on desktop, and no scroll-based navigation. The sidebar provides persistent, direct access to any record section.

**Navigation items and keyboard shortcuts:**

| Sidebar Item | Section | Shortcut |
|-------------|---------|----------|
| Summary | Profile overview | `Alt+1` |
| Consultations | Experience | `Alt+2` |
| Medications | Skills | `Alt+3` |
| Problems | Achievements | `Alt+4` |
| Investigations | Projects | `Alt+5` |
| Documents | Education | `Alt+6` |
| Referrals | Contact | `Alt+7` |

**URL hash routing:** Each sidebar item updates the URL hash (`#summary`, `#consultations`, `#medications`, etc.) for direct linking. On page load, the app reads the hash and navigates to the corresponding view.

### Secondary Navigation: Within-View Interactions

- **Summary:** Clicking "View Full List" or "View Full Record" links navigates to the corresponding sidebar section.
- **Consultations:** Expand/collapse individual entries. "Linked consultations" in Problems view can deep-link to specific consultation entries.
- **Medications:** Category tabs (Active, Clinical, PRN) within the view. Click to expand prescribing history.
- **Problems:** Click to expand. "Linked consultations" navigate to Consultations view.
- **Investigations:** Click to expand results.
- **Documents:** Click to expand preview.
- **Referrals:** No sub-navigation.

### Breadcrumb

A breadcrumb appears at the top of the main content area:

```
Patient Record > Consultations > Interim Head, Population Health
```

The breadcrumb updates as the user navigates deeper (e.g., expanding a consultation). Clicking "Patient Record" returns to Summary. Clicking "Consultations" collapses any expanded entries and shows the full journal list. The breadcrumb is styled in Inter 400, 13px, gray-400, with chevron separators.

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

Sidebar collapses to icon-only mode (56px width). Hovering (desktop) or tapping an icon shows the label as a tooltip. The sidebar can be expanded to full width by clicking a hamburger/expand button at its top.

- Patient banner: condensed to single-line format always (no full/condensed toggle)
- Main content: nearly full width
- Tables: may horizontally scroll if columns exceed available width. A scroll indicator appears.
- Consultations: full expand/collapse behavior preserved
- Context menus: triggered by long-press instead of right-click

### Mobile (<768px)

The sidebar becomes a **bottom navigation bar** with 7 icon buttons. This mirrors mobile clinical apps (EMIS Mobile, the NHS App) where bottom tabs replace the sidebar.

**Bottom nav layout:**

```
[Summary] [Consult] [Meds] [Problems] [Invest] [Docs] [Refer]
```

Each icon is from Lucide, 20px, with the active item highlighted in NHS blue with a label appearing below the icon. The bottom nav is 56px height with safe area padding.

**Patient banner on mobile:**

Minimal top bar: `CHARLWOOD, A (Mr) | 2211810 | ●` — just enough to maintain the PMR metaphor. Action buttons collapse into a "..." overflow menu.

**Content adaptations:**

- Tables switch to a **card layout**: each row becomes a small card with fields stacked vertically. This avoids horizontal scrolling on narrow screens while preserving all data.
- Consultation entries show the collapsed view with a tap-to-expand pattern (same as desktop but optimized for touch — larger tap targets, 48px minimum height).
- Medications: the table becomes a stacked card list. Each "medication" card shows: Drug Name (large), Dose / Frequency / Status on a single line below.
- Referral form: full-width inputs, generous touch targets. Priority radio buttons become larger tap areas.
- Search: moves to the top of each view as a search bar (not in the bottom nav).

**Back navigation:** Each view has a back arrow in the top-left corner (beside the banner) that returns to Summary. This prevents the need for the bottom nav to have a dedicated "back" button.

### Breakpoint Summary

| Element | Desktop (>1024) | Tablet (768-1024) | Mobile (<768) |
|---------|-----------------|-------------------|---------------|
| Sidebar | 220px, full labels | 56px, icons only | Bottom nav bar |
| Patient banner | 80px full / 48px sticky | 48px always | Minimal top bar |
| Tables | Full columns, horizontal | Scroll if needed | Card layout (stacked) |
| Consultations | Expand inline | Expand inline | Expand inline (touch) |
| Search | Sidebar header | Sidebar header | Top of each view |
| Context menus | Right-click | Long-press | Long-press |
| Clinical alert | Full width banner | Full width banner | Full width banner |

---

## Technical Implementation

### Component Architecture

```
App.tsx
  BootSequence.tsx
  ECGAnimation.tsx (modified exit: flatline → login)
  ClinicalRecord.tsx (replaces current content phase)
    LoginScreen.tsx (animated login sequence)
    PMRInterface.tsx (main PMR layout after login)
      PatientBanner.tsx
        PatientBannerFull.tsx
        PatientBannerCondensed.tsx
        BannerActionButtons.tsx
      ClinicalAlert.tsx
      ClinicalSidebar.tsx
        SidebarItem.tsx
        SidebarSearch.tsx
        SidebarFooter.tsx
      MainContent.tsx (renders active view)
        SummaryView.tsx
          DemographicsCard.tsx
          ActiveProblemsCard.tsx
          QuickMedsCard.tsx
          LastConsultationCard.tsx
        ConsultationsView.tsx
          ConsultationEntry.tsx (expand/collapse)
          CodedEntries.tsx
        MedicationsView.tsx
          MedicationTable.tsx
          MedicationRow.tsx
          PrescribingHistory.tsx
        ProblemsView.tsx
          ProblemEntry.tsx
          TrafficLight.tsx
        InvestigationsView.tsx
          InvestigationEntry.tsx
          InvestigationResults.tsx
        DocumentsView.tsx
          DocumentEntry.tsx
          DocumentPreview.tsx
        ReferralsView.tsx
          ReferralForm.tsx
          PriorityToggle.tsx
          DirectContact.tsx
      Breadcrumb.tsx
      ContextMenu.tsx
```

### State Management

- **Active sidebar view:** React `useState` in `PMRInterface.tsx`. Updated on sidebar click. Synced to URL hash via `useEffect`.
- **Expanded consultation ID:** `useState` — only one can be expanded at a time. Expanding a new entry sets its ID and implicitly collapses the previous.
- **Expanded medication ID:** Separate `useState` for the prescribing history expansion.
- **Alert dismissed:** `useState` (session-only, resets on reload). Array of dismissed alert IDs.
- **Patient banner condensed:** Boolean state driven by `IntersectionObserver` on a sentinel element near the top of the content area.
- **Medication sort:** `useState` holding `{ column: string, direction: 'asc' | 'desc' }`.
- **Search query and results:** `useState` for query string, `useMemo` for filtered results using fuse.js.
- **Login complete:** `useState` boolean. Once login animation finishes, the login component unmounts and the PMR interface mounts.

### CSS Strategy

- Tailwind CSS for utilities, consistent with the existing project setup
- CSS custom properties for the PMR-specific color tokens (NHS blue, traffic light colors, surface colors) defined in `index.css` under a `.pmr-theme` class
- No dark mode implementation — this design is light-mode only, which simplifies the CSS significantly
- Tables use native `<table>` elements with Tailwind utilities for borders, padding, and alternating row colors (`even:bg-zinc-50`)
- Sidebar uses `position: fixed` with a defined width, main content uses `margin-left` to offset
- Patient banner uses `position: sticky` with dynamic height based on scroll state
- Bottom nav (mobile) uses `position: fixed` with `bottom: 0` and safe area insets via `env(safe-area-inset-bottom)`

### Login Animation Implementation

The login sequence is implemented as a separate component (`LoginScreen.tsx`) that runs before the PMR interface:

1. Component mounts with dark blue-gray background
2. Login card fades in (Framer Motion, 200ms)
3. Username typing: `setInterval` adds one character per 30ms to a state string
4. Password dots: `setInterval` adds one dot per 20ms
5. Button press: state change triggers visual pressed state, then 200ms delay
6. `onComplete` callback fires, parent component swaps to `PMRInterface.tsx`

The typing animation respects `prefers-reduced-motion` — with reduced motion, the full username appears instantly and the login completes in ~500ms total.

### Search Implementation

- **Index building:** On mount, a fuse.js index is built from all content data: consultation titles/bullets, medication names, problem descriptions, investigation names, document titles.
- **Search options:** `{ keys: ['title', 'description', 'bullets', 'name'], threshold: 0.3, includeScore: true }`
- **Results grouping:** Search results are grouped by section (Consultations, Medications, etc.) and displayed in a dropdown beneath the search input.
- **Navigation:** Clicking a result updates the active sidebar view and scrolls to / expands the matching item.

### Data Architecture

All PMR content is defined as typed data arrays in dedicated files:

```
src/data/
  consultations.ts    — ExperienceEntry[] mapped to consultation format
  medications.ts      — Skill[] mapped to medication format
  problems.ts         — Achievement[] with status and coded entries
  investigations.ts   — Project[] with results and methodology
  documents.ts        — Education[] with document metadata
```

Each data file exports typed arrays that the corresponding view components consume. This separation keeps data out of component files and makes it easy to update CV content.

### Performance Considerations

- **View switching:** Only the active view renders. Inactive views are unmounted (not hidden). This keeps DOM weight low.
- **Table rendering:** For the Medications table (~18 rows), no virtualization is needed. If the data set grew significantly, `react-window` could be added.
- **Search index:** fuse.js index is built once on mount and memoized. Total content is small enough (~50 items) that search is effectively instant.
- **Login animation:** Uses `setInterval` for typing, cleaned up in the `useEffect` return. No memory leaks.
- **Scroll observer:** A single `IntersectionObserver` instance handles the patient banner condensation trigger. Created once, disconnected on unmount.

---

## Accessibility

### Semantic HTML

- Sidebar: `<nav role="navigation" aria-label="Clinical record navigation">` with `<ul>` and `<li>` items. Active item uses `aria-current="page"`.
- Patient banner: `<header role="banner">` containing patient demographics.
- Main content area: `<main>` element with `aria-label` matching the current view name ("Summary", "Consultations", etc.).
- Tables: Proper `<table>`, `<thead>`, `<th>`, `<tbody>`, `<tr>`, `<td>` markup. Column headers use `scope="col"`. This is critical — medication and problem tables must be navigable by screen readers as proper data tables.
- Consultation entries: `<article>` elements with `<button>` for expand/collapse, `aria-expanded` attribute.

### Keyboard Navigation

- `Tab` moves between: sidebar items, patient banner buttons, main content interactive elements
- `ArrowUp` / `ArrowDown` within the sidebar moves between navigation items (roving tabindex)
- `Enter` / `Space` on sidebar items activates that view
- `Enter` / `Space` on consultation entries toggles expand/collapse
- `Alt+1` through `Alt+7` directly activates sidebar items (matches clinical system keyboard shortcuts)
- `Escape` closes expanded items, context menus, and search dropdown
- Search input is focusable with `/` key (common pattern)

### Screen Reader Experience

1. On page load, after login animation, the screen reader announces: "Patient Record for Charlwood, Andrew. Summary view."
2. The clinical alert is announced immediately via `role="alert"`: "Alert: This patient has identified fourteen point six million pounds in prescribing efficiency savings across Norfolk and Waveney ICS."
3. Sidebar navigation items are announced with their label and active state.
4. Tables are announced with column headers — e.g., "Medications table. Row 1: Drug Name: Python. Dose: 90 percent. Frequency: Daily. Start: 2017. Status: Active."
5. Expandable items announce their expanded/collapsed state.
6. Breadcrumb uses `<nav aria-label="Breadcrumb">` with `<ol>` and `aria-current="page"` on the last item.

### Alert Accessibility

- Clinical alert uses `role="alert"` and `aria-live="assertive"` — screen readers announce it immediately on appearance.
- The "Acknowledge" button is clearly labeled: `aria-label="Acknowledge clinical alert"`.
- After acknowledgment, the removal is smooth (no jarring DOM change for screen readers — the element simply removes itself from the accessibility tree).

### Focus Management

- After login completes, focus moves to the first sidebar item (Summary).
- After navigating to a new view, focus moves to the first heading in the main content area.
- After expanding a consultation, focus moves to the "HISTORY" heading within the expanded content.
- After closing a context menu, focus returns to the element that triggered it.
- After acknowledging an alert, focus moves to the main content area's first interactive element.

### Color and Contrast

- All text meets WCAG 2.1 AA contrast requirements against its background.
- Traffic light indicators are never the sole communicator of state — they always accompany text labels ("Active", "Resolved", "In Progress").
- NHS blue (`#005EB8`) on white provides a contrast ratio of ~7.3:1 (exceeds AA).
- The amber alert text (`#92400E`) on amber background (`#FEF3C7`) provides a contrast ratio of ~5.8:1 (meets AA).

### Motion Preferences

When `prefers-reduced-motion: reduce` is active:
- Login typing animation completes instantly (full text appears at once)
- Clinical alert appears without slide animation (instant render)
- Consultation expand/collapse is instant (no height animation)
- Patient banner condensation is instant (no smooth transition)
- All hover background-color changes remain (they are not motion)

---

## What Makes This Special

**Absolute thematic fidelity.** This isn't a clinical "theme" loosely applied — it's a genuine PMR interface reimagined as a CV. The patient banner, the consultation journal format, the medications table, the coded entries, the traffic lights, the clinical alert, the login screen — every element is drawn from real NHS clinical software. The fidelity is what makes the concept work. A clinician visiting this site will immediately recognize the interface, and that recognition creates delight.

**The consultation format is actually better for career content.** The History / Examination / Plan structure maps perfectly to Context / Analysis / Outcome — arguably a better format for presenting career achievements than traditional bullet lists. "History" gives the reader context for why the role existed. "Examination" shows what Andy analyzed and built. "Plan" shows what was delivered and measured. This is how clinical thinking works, and it's also how impact-driven career narratives should work.

**The clinical alert is a guaranteed attention-grabber.** Framing "£14.6M in efficiency savings" as a system-generated clinical alert — with an amber background, a warning icon, and a required "Acknowledge" action — gives the number institutional weight. It doesn't feel like a boast; it feels like a data point flagged by a system. The user has to consciously dismiss it, which means they've read it, processed it, and engaged with it. No other portfolio design achieves this level of engagement with a single metric.

**The medications-as-skills mapping is clever and navigable.** Presenting skills as a medications list with dosage, frequency, and status columns provides more information than a typical skills section. "Python | 90% | Daily | 2017 | Active" tells the reader: proficiency level, current usage intensity, how long Andy has used it, and whether it's still actively in use. The "prescribing history" expansion shows skill progression over time. This is richer data than a grid of progress bars.

**Clinicians get the joke. Recruiters get the data.** The design works on two levels simultaneously. Healthcare professionals will recognize the PMR interface and appreciate the creativity (and the accuracy of the reproduction). Non-clinical recruiters won't know they're looking at a PMR clone, but they'll find the interface navigable, structured, and information-dense — because clinical systems are designed for efficient information retrieval under time pressure. Both audiences win.

**The login screen is the most immersive transition.** Every NHS worker has typed their credentials into a dark-blue login screen at 8am. This transition puts them right there. It's a shared institutional experience, and it establishes the metaphor instantly: you are opening a record. The "patient" happens to be a career. By the time the PMR interface materializes, the user is already thinking in clinical-system mode.

**Problem-oriented framing turns achievements into resolutions.** The Problems view reframes career achievements as "problems" that Andy identified and resolved. "Manual prescribing analysis inefficiency" is a problem statement. "Built Python switching algorithm, 14,000 patients identified, £2.6M annual savings" is the resolution. This narrative structure — problem followed by resolution followed by measurable outcome — is more compelling than a list of accomplishments because it shows the thinking that preceded the action. It reveals process, not just results.
