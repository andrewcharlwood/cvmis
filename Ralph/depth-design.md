# Component Architecture Design: Adding Depth

> Design document — Feb 2026
> Follows requirements in `Ralph/depth-requirements.md`
> Based on audit of current codebase architecture

---

## 1. Architecture Overview

### Current Component Tree
```
App.tsx (Phase: boot → ecg → login → pmr)
└── AccessibilityProvider
    ├── BootSequence (locked)
    ├── ECGAnimation (locked)
    ├── LoginScreen
    └── DashboardLayout
        ├── TopBar
        ├── Sidebar
        ├── Main Content Grid
        │   ├── PatientSummaryTile
        │   ├── LatestResultsTile + CoreSkillsTile
        │   ├── LastConsultationTile
        │   ├── CareerActivityTile
        │   ├── EducationTile
        │   └── ProjectsTile
        └── CommandPalette
```

### Proposed Component Tree
```
App.tsx (Phase: boot → ecg → login → pmr)
└── AccessibilityProvider
    ├── BootSequence (locked)
    ├── ECGAnimation (locked)
    ├── LoginScreen ← MODIFIED (visual refresh, a.recruiter, connection status)
    └── DetailPanelProvider ← NEW (context for panel state)
        └── DashboardLayout ← MODIFIED (sub-nav, new tile order)
            ├── TopBar ← MODIFIED (session shows a.recruiter)
            ├── SubNav ← NEW (section jump bar)
            ├── Sidebar (unchanged)
            ├── Main Content Grid ← REORDERED
            │   ├── PatientSummaryTile ← MODIFIED (CV_v4.md profile)
            │   ├── LatestResultsTile ← MODIFIED (bigger numbers, panel trigger)
            │   ├── ProjectsTile ← MOVED UP (card grid with thumbnails)
            │   ├── CoreSkillsTile ← MOVED, FULL WIDTH (categorised groups)
            │   ├── LastConsultationTile ← MODIFIED (panel trigger)
            │   ├── CareerActivityTile ← MODIFIED (constellation embedded)
            │   │   └── CareerConstellation ← NEW (D3.js force graph)
            │   └── EducationTile ← MODIFIED (richer content, panel trigger)
            ├── DetailPanel ← NEW (slide-in from right)
            └── CommandPalette ← UPDATED (new panel actions)
```

---

## 2. New Components

### 2.1 DetailPanel (`src/components/DetailPanel.tsx`)

The primary mechanism for depth. A slide-in panel from the right edge.

**Props Interface:**
```typescript
interface DetailPanelProps {
  isOpen: boolean
  onClose: () => void
  width: 'narrow' | 'wide'     // narrow: 400px, wide: 60vw
  title: string                  // Header text
  dotColor: CardHeaderProps['dotColor']  // Matches tile dot color
  children: React.ReactNode      // Content rendered inside
}
```

**Behaviour:**
- Renders a full-screen backdrop (`rgba(26,43,42,0.15)` + `backdrop-filter: blur(4px)`) and a panel div
- Panel slides in from `translateX(100%)` → `translateX(0)` over 250ms ease-out
- Backdrop fades in over 150ms
- Close: click backdrop, press Escape, or click X button
- Focus trap: first focusable element receives focus on open; Tab cycles within panel; focus returns to trigger element on close
- `aria-modal="true"`, `role="dialog"`, `aria-labelledby` pointing to title
- `prefers-reduced-motion`: skip slide animation, instant appear

**Layout:**
```
┌─────────────────────────────────────────────────┐
│ Blurred backdrop (click to close)               │
│                    ┌────────────────────────────┐│
│                    │ ── X close button ──────── ││
│                    │                            ││
│                    │ [dot] SECTION TITLE        ││
│                    │                            ││
│                    │ {children}                 ││
│                    │                            ││
│                    │ (scrollable)               ││
│                    │                            ││
│                    └────────────────────────────┘│
└─────────────────────────────────────────────────┘
```

**CSS Custom Properties to add (index.css):**
```css
--panel-narrow: 400px;
--panel-wide: 60vw;
--backdrop-blur: 4px;
--backdrop-bg: rgba(26,43,42,0.15);
```

**Responsive:**
- On mobile (< 768px), both `narrow` and `wide` become full-width (100vw)

---

### 2.2 DetailPanelContext (`src/contexts/DetailPanelContext.tsx`)

Manages what content is displayed in the detail panel. Any tile can trigger it.

**Interface:**
```typescript
// Union type for all possible detail panel content
type DetailPanelContent =
  | { type: 'kpi'; kpi: KPI }
  | { type: 'skill'; skill: SkillMedication }
  | { type: 'skills-all'; category?: SkillCategory }
  | { type: 'consultation'; consultation: Consultation }
  | { type: 'project'; investigation: Investigation }
  | { type: 'education'; document: Document }
  | { type: 'career-role'; consultation: Consultation }  // from constellation click

interface DetailPanelContextValue {
  content: DetailPanelContent | null
  openPanel: (content: DetailPanelContent) => void
  closePanel: () => void
  isOpen: boolean
}
```

**Width mapping** (deterministic from content type):
```typescript
const widthMap: Record<DetailPanelContent['type'], 'narrow' | 'wide'> = {
  'kpi': 'narrow',
  'skill': 'narrow',
  'skills-all': 'narrow',
  'consultation': 'wide',
  'project': 'wide',
  'education': 'narrow',
  'career-role': 'wide',
}
```

**Title mapping** (from content type + data):
```typescript
function getPanelTitle(content: DetailPanelContent): string {
  switch (content.type) {
    case 'kpi': return content.kpi.label
    case 'skill': return content.skill.name
    case 'skills-all': return 'All Medications'
    case 'consultation': return content.consultation.role
    case 'project': return content.investigation.name
    case 'education': return content.document.title
    case 'career-role': return content.consultation.role
  }
}
```

**Integration:** Wraps `DashboardLayout` in `App.tsx`. The `DetailPanel` component reads from this context and renders the appropriate content.

---

### 2.3 SubNav (`src/components/SubNav.tsx`)

Section jump bar positioned between TopBar and content.

**Props Interface:**
```typescript
interface SubNavProps {
  activeSection: string
  onSectionClick: (sectionId: string) => void
}

interface NavSection {
  id: string
  label: string
  tileId: string  // data-tile-id to scroll to
}
```

**Sections:**
```typescript
const sections: NavSection[] = [
  { id: 'overview', label: 'Overview', tileId: 'patient-summary' },
  { id: 'skills', label: 'Skills', tileId: 'core-skills' },
  { id: 'experience', label: 'Experience', tileId: 'career-activity' },
  { id: 'projects', label: 'Projects', tileId: 'projects' },
  { id: 'education', label: 'Education', tileId: 'education' },
]
```

**Behaviour:**
- Fixed/sticky position below TopBar (top: 48px)
- Click → smooth-scroll to `[data-tile-id="${tileId}"]`
- Active section determined by `useActiveSection` hook (IntersectionObserver on tile elements)
- Active tab: teal underline (2px), text colour shifts to `var(--accent)`
- Inactive tabs: `var(--text-secondary)`

**Style:**
- Height: 36px
- Background: `var(--surface)` with bottom border `var(--border-light)`
- Tabs: 13px, font-weight 500, horizontal gap 24px, centred text
- Teal underline on active (2px, slides with 200ms transition)
- z-index: 99 (below TopBar at 100, above content)

**Existing hook to extend:** `src/hooks/useActiveSection.ts` — currently exists but may need updating to observe the correct tile IDs.

**CSS to add (index.css):**
```css
--subnav-height: 36px;
```

**Layout impact:** `marginTop` on the flex container below TopBar changes from `var(--topbar-height)` to `calc(var(--topbar-height) + var(--subnav-height))`.

---

### 2.4 CareerConstellation (`src/components/CareerConstellation.tsx`)

D3.js force-directed network graph embedded in the CareerActivityTile.

**Props Interface:**
```typescript
interface CareerConstellationProps {
  onRoleClick: (consultationId: string) => void
  onSkillClick: (skillId: string) => void
}
```

**Data Model:**
```typescript
interface ConstellationNode {
  id: string
  type: 'role' | 'skill'
  label: string
  // Role-specific:
  organization?: string
  startYear?: number
  endYear?: number
  orgColor?: string
  // Skill-specific:
  domain?: 'clinical' | 'technical' | 'leadership'
}

interface ConstellationLink {
  source: string  // node id
  target: string  // node id
  strength: number // 0-1, how strongly connected
}
```

**Node Data (from consultations + skills + new mapping data):**

Role nodes (6, positioned chronologically):
1. Pre-Reg Pharmacist, Paydens (2015-2016)
2. Duty Pharmacy Manager, Tesco (2016-2017)
3. Pharmacy Manager, Tesco (2017-2022)
4. High-Cost Drugs Pharmacist, NHS (2022-2024)
5. Deputy Head, NHS (2024-present)
6. Interim Head, NHS (2025)

Skill nodes (drawn from skills.ts + new expanded skills data):
- Technical: Python, SQL, Power BI, JavaScript/TypeScript, Data Analysis, Algorithm Design, Excel
- Clinical: Medicines Optimisation, Clinical Pathways, Controlled Drugs, NICE TAs, Patient Safety
- Leadership: Budget Management, Team Development, Stakeholder Engagement, Change Management

Links connect skills to the roles where they were used/developed.

**D3 Integration Pattern:**
- Use a `useRef<SVGSVGElement>` to get the SVG container
- D3 operates on the SVG imperatively via `useEffect`
- React handles the wrapper container, D3 handles the graph rendering
- No React state for individual node positions (performance)
- Tooltip/hover state managed via D3 event handlers dispatching to React state for the detail panel

**Force Simulation Configuration:**
```typescript
d3.forceSimulation(nodes)
  .force('charge', d3.forceManyBody().strength(-200))
  .force('link', d3.forceLink(links).distance(80).strength(d => d.strength))
  .force('x', d3.forceX(d => xScale(d.startYear)).strength(0.3))  // chronological
  .force('y', d3.forceY(height / 2).strength(0.1))
  .force('collision', d3.forceCollide(30))
```

The `forceX` with a time scale ensures roles flow left-to-right chronologically. Skill nodes cluster around their associated roles.

**Visual Design:**
- Role nodes: 24px radius circles, filled with `orgColor`, white text label
- Skill nodes: 10px radius, colour-coded by domain (clinical=`var(--success)`, technical=`var(--accent)`, leadership=`var(--amber)`)
- Links: thin lines (1px), `var(--border)` colour, opacity 0.3
- Hover role: connected skill nodes scale up, links brighten to `var(--accent)`, non-connected nodes fade to 0.15 opacity
- Hover skill: all connected role nodes highlight, link paths illuminate
- Click: dispatches to `onRoleClick` / `onSkillClick` → opens detail panel

**Container:**
- Full width of the CareerActivityTile
- Height: 400px (desktop), 300px (tablet), 250px (mobile)
- Background: subtle radial gradient from `var(--bg-dashboard)` centre to `var(--surface)` edge
- SVG fills the container with viewBox for responsiveness

**New dependency:** `d3` (specifically `d3-force`, `d3-selection`, `d3-scale`, `d3-transition`)

**New data file:** `src/data/constellation.ts` — defines the role-skill mapping:
```typescript
export interface RoleSkillMapping {
  roleId: string         // matches consultation.id
  skillIds: string[]     // matches skill IDs
}

export const roleSkillMappings: RoleSkillMapping[] = [
  {
    roleId: 'duty-pharmacist-2016',
    skillIds: ['patient-care', 'medicines-optimisation', 'team-development'],
  },
  {
    roleId: 'pharmacy-manager-2017',
    skillIds: ['patient-care', 'medicines-optimisation', 'team-development', 'data-analysis', 'excel', 'change-management', 'budget-management'],
  },
  // ... etc for all roles
]
```

**Accessibility:**
- `role="img"` on SVG with `aria-label="Career constellation showing roles and skills across career timeline"`
- Screen-reader-only text description of the graph structure
- Keyboard navigation: Tab through role nodes, Enter to open detail panel
- `prefers-reduced-motion`: disable force simulation animation, render static layout

---

## 3. Modified Components

### 3.1 DashboardLayout — Modifications

**Changes:**
1. **Import and render SubNav** between TopBar and content flex container
2. **Reorder tiles:** PatientSummary → LatestResults + Projects → CoreSkills → LastConsultation → CareerActivity → Education
3. **Wrap in DetailPanelProvider** (or this wraps from App.tsx)
4. **Render DetailPanel** alongside CommandPalette
5. **Adjust marginTop** to account for SubNav height

**Updated grid in DashboardLayout:**
```tsx
<div className="dashboard-grid">
  <PatientSummaryTile />          {/* full width */}
  <LatestResultsTile />           {/* half width (left) */}
  <ProjectsTile />                {/* half width (right) — MOVED UP */}
  <CoreSkillsTile />              {/* full width — MOVED, was half */}
  <LastConsultationTile />        {/* full width */}
  <CareerActivityTile />          {/* full width — now includes constellation */}
  <EducationTile />               {/* full width */}
</div>
```

**SubNav integration:**
```tsx
<motion.div initial="hidden" animate="visible" variants={topbarVariants}>
  <TopBar onSearchClick={handleSearchClick} />
</motion.div>
<SubNav activeSection={activeSection} onSectionClick={handleSectionClick} />
{/* ... rest of layout with adjusted marginTop */}
```

**New CSS variable reference:**
- Content area `marginTop`: `calc(var(--topbar-height) + var(--subnav-height))`
- Content area `height`: `calc(100vh - var(--topbar-height) - var(--subnav-height))`

---

### 3.2 TopBar — Modifications

**Changes:**
1. Session user name: `Dr. A.CHARLWOOD` → `A.RECRUITER`
2. No structural changes otherwise

**Specific change:**
```tsx
// Line ~172: Change display name
<span ...>A.RECRUITER</span>
```

---

### 3.3 LoginScreen — Modifications

**Changes:**
1. **Username:** `A.CHARLWOOD` → `A.RECRUITER`
2. **Visual refresh:** Teal accents replacing NHS blue (`#005EB8` → `var(--accent)` / `#0D6E6E`)
3. **Connection status indicator:** New state machine below the login button
4. **Post-login loading state:** Brief "System loading..." before dashboard materialises
5. **Background colour:** `#1E293B` → consider matching `var(--bg-dashboard)` or a darker variant

**New state additions:**
```typescript
type ConnectionState = 'connecting' | 'connected'

const [connectionState, setConnectionState] = useState<ConnectionState>('connecting')
const [isLoading, setIsLoading] = useState(false)  // post-click loading state
```

**Connection status flow:**
1. On mount + 400ms: start typing animation (existing)
2. After ~2000ms: `connectionState` transitions to `'connected'`
3. Login button is disabled until BOTH `typingComplete` AND `connectionState === 'connected'`
4. On login click: `isLoading = true`, show "System loading..." state for ~600ms, then `onComplete()`

**Connection indicator JSX (below login button, above footer):**
```tsx
<div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
  <div style={{
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: connectionState === 'connected' ? 'var(--success)' : 'var(--alert)',
    transition: 'background-color 300ms ease-out',
  }} />
  <span style={{ fontSize: '10px', fontFamily: 'var(--font-geist-mono)', color: 'var(--text-tertiary)' }}>
    {connectionState === 'connected' ? 'Secure connection established' : 'Awaiting secure connection...'}
  </span>
</div>
```

**Loading state (replaces card content after click):**
```tsx
{isLoading && (
  <div className="flex flex-col items-center gap-3">
    <div className="loading-spinner" /> {/* CSS animated spinner */}
    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
      Loading clinical records...
    </span>
  </div>
)}
```

**Colour changes throughout LoginScreen:**
- `#005EB8` → `#0D6E6E` (accent colour for shield icon bg, active field border, cursor, button)
- `#004D9F` → `#0A8080` (button hover)
- `#004494` → `#085858` (button pressed)
- Background: `#1E293B` → keep as-is or lighten slightly to `#1A2B2A` (matches `--text-primary`)

---

### 3.4 CoreSkillsTile — Modifications (now full-width, categorised)

**Changes:**
1. **Full width** (add `full` prop to Card)
2. **Categorised display** with 3 groups: Technical, Healthcare Domain, Strategic & Leadership
3. **Show top 3-5 per category** on the dashboard
4. **"View all" button** triggers detail panel with full list
5. **Individual skill click** → detail panel for that skill

**New internal structure:**
```tsx
<Card full tileId="core-skills">
  <CardHeader dotColor="amber" title="REPEAT MEDICATIONS" rightText="Active prescriptions" />

  {/* Category tabs or grouped sections */}
  {categories.map(category => (
    <div key={category.id}>
      <CategoryHeader label={category.label} count={category.skills.length} />
      {category.skills.slice(0, 4).map(skill => (
        <SkillItem
          key={skill.id}
          skill={skill}
          onClick={() => openPanel({ type: 'skill', skill })}
        />
      ))}
      {category.skills.length > 4 && (
        <ViewMoreButton
          count={category.skills.length - 4}
          onClick={() => openPanel({ type: 'skills-all', category: category.id })}
        />
      )}
    </div>
  ))}
</Card>
```

**CategoryHeader sub-component (inline):**
- Thin divider line with category label
- Styled like sidebar section dividers: 10px, uppercase, tertiary, with extending line

---

### 3.5 LatestResultsTile — Modifications

**Changes:**
1. **Bigger headline numbers** — increase value font size from 22px to 28-32px
2. **Remove flip animation** — replace with click → detail panel
3. **Each KPI card is clickable** → `openPanel({ type: 'kpi', kpi })`
4. **Visual enhancement:** stronger contrast, bolder presentation

**KPI card redesign (no more flip):**
```tsx
<button
  onClick={() => openPanel({ type: 'kpi', kpi })}
  className="text-left w-full"
  style={{
    padding: '16px',
    background: 'var(--surface)',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'border-color 150ms, box-shadow 150ms',
  }}
>
  <div style={{ fontSize: '28px', fontWeight: 700, color: colorMap[kpi.colorVariant] }}>
    {kpi.value}
  </div>
  <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)', marginTop: '4px' }}>
    {kpi.label}
  </div>
  <div style={{ fontSize: '10px', fontFamily: 'var(--font-geist-mono)', color: 'var(--text-tertiary)', marginTop: '2px' }}>
    {kpi.sub}
  </div>
</button>
```

**CSS cleanup:** Remove `.metric-card`, `.metric-card-inner`, `.metric-card-front`, `.metric-card-back` classes from `index.css` (no longer needed once flip is removed).

---

### 3.6 ProjectsTile — Modifications (now half-width, card grid)

**Changes:**
1. **Half width** (remove `full` prop) — positioned in right column alongside LatestResults
2. **Card grid layout** with thumbnails, title, status, tech tags
3. **Click → detail panel (wide)** for full project info
4. **Compact display** to fit in half-width tile

**New layout:**
```tsx
<Card tileId="projects">
  <CardHeader dotColor="amber" title="ACTIVE PROJECTS" rightText="Investigations" />
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    {investigations.map(inv => (
      <ProjectCard
        key={inv.id}
        investigation={inv}
        onClick={() => openPanel({ type: 'project', investigation: inv })}
      />
    ))}
  </div>
</Card>
```

**ProjectCard sub-component:**
- Compact row: status dot + name + year (right-aligned)
- Tech stack as small inline tags
- Hover: border colour shift, shadow deepens
- Click: opens wide detail panel

---

### 3.7 CareerActivityTile — Modifications

**Changes:**
1. **Embed CareerConstellation** component within the tile
2. **Timeline items click → detail panel** (instead of in-place accordion)
3. **Extended timeline** back to school (2009)
4. **Hover preview** on timeline items (slight expand with preview text)

**New structure:**
```tsx
<Card full tileId="career-activity">
  <CardHeader dotColor="teal" title="CAREER ACTIVITY" rightText="Full timeline" />

  {/* Career Constellation D3 graph */}
  <CareerConstellation
    onRoleClick={(id) => {
      const consultation = consultations.find(c => c.id === id)
      if (consultation) openPanel({ type: 'career-role', consultation })
    }}
    onSkillClick={(id) => {
      const skill = allSkills.find(s => s.id === id)
      if (skill) openPanel({ type: 'skill', skill })
    }}
  />

  {/* Existing timeline below */}
  <div className="activity-grid" style={{ marginTop: '24px' }}>
    {/* ... timeline items, now with click → panel instead of accordion */}
  </div>
</Card>
```

---

### 3.8 EducationTile — Modifications

**Changes:**
1. **Richer inline content** — show research project score, OSCE score, A-level grades
2. **Click → detail panel (narrow)** for full education detail
3. Each education entry is a clickable row

---

### 3.9 LastConsultationTile — Modifications

**Changes:**
1. **Click → detail panel (wide)** for full role details
2. Add a "View full record" link/button at the bottom

---

### 3.10 PatientSummaryTile — Modifications

**Changes:**
1. **Content:** Replace current personalStatement with the exact profile text from CV_v4.md
2. **Structured presentation:** Consider pulling highlight stats into a visual strip

The profile.ts data is already the CV_v4.md text, so this may just be a presentation change.

---

## 4. Type System Extensions

### 4.1 New types (`src/types/pmr.ts` additions)

```typescript
// Skill categories for grouped display
export type SkillCategory = 'Technical' | 'Domain' | 'Leadership'

// Extended KPI with story content for detail panel
export interface KPIStory {
  context: string       // What this number covers
  role: string          // Your role / what you did
  outcomes: string[]    // Key decisions or results
  period?: string       // Time period
}

// Extended KPI type (augment existing)
export interface KPI {
  id: string
  value: string
  label: string
  sub: string
  colorVariant: 'green' | 'amber' | 'teal'
  explanation: string
  story?: KPIStory      // NEW: rich detail for panel
}

// Constellation-specific types
export interface ConstellationNode {
  id: string
  type: 'role' | 'skill'
  label: string
  shortLabel?: string    // abbreviated for small nodes
  organization?: string
  startYear?: number
  endYear?: number | null
  orgColor?: string
  domain?: 'clinical' | 'technical' | 'leadership'
}

export interface ConstellationLink {
  source: string
  target: string
  strength: number
}

// Detail panel content union
export type DetailPanelContent =
  | { type: 'kpi'; kpi: KPI }
  | { type: 'skill'; skill: SkillMedication }
  | { type: 'skills-all'; category?: SkillCategory }
  | { type: 'consultation'; consultation: Consultation }
  | { type: 'project'; investigation: Investigation }
  | { type: 'education'; document: Document }
  | { type: 'career-role'; consultation: Consultation }

// Education extras (for detail panel)
export interface EducationExtra {
  documentId: string
  extracurriculars?: string[]
  researchDescription?: string
  programmeDetail?: string
}
```

---

## 5. Data Extensions

### 5.1 Extended Skills (`src/data/skills.ts`)

Expand from 5 → ~20 skills across 3 categories. Source: CV_v4.md Core Competencies.

```typescript
// Technical (8 skills)
'data-analysis', 'python', 'sql', 'power-bi', 'javascript-typescript',
'excel', 'algorithm-design', 'data-pipelines'

// Healthcare Domain (6 skills)
'medicines-optimisation', 'population-health', 'nice-ta',
'health-economics', 'clinical-pathways', 'controlled-drugs'

// Strategic & Leadership (7 skills)
'budget-management', 'stakeholder-engagement', 'pharma-negotiation',
'team-development', 'change-management', 'financial-modelling', 'executive-comms'
```

Each retains the medication metaphor: frequency, startYear, yearsOfExperience, proficiency, status.

### 5.2 KPI Stories (`src/data/kpis.ts`)

Add `story` field to each existing KPI:

```typescript
{
  id: 'budget',
  value: '£220M',
  // ... existing fields ...
  story: {
    context: 'Total prescribing budget for NHS Norfolk & Waveney ICB, covering primary care prescriptions for a population of 1.2 million across the integrated care system.',
    role: 'Managed with sophisticated forecasting models, identifying cost pressures and enabling proactive financial planning. Full analytical accountability to ICB board.',
    outcomes: [
      'Sophisticated forecasting models identifying cost pressures',
      'Proactive financial planning enabled across the system',
      'Interactive dashboard tracking expenditure in real-time',
    ],
    period: 'Jul 2024 — Present',
  },
}
```

### 5.3 Constellation Mapping (`src/data/constellation.ts`)

New file mapping roles to skills for the D3 graph. Defines which skills connect to which roles.

### 5.4 Education Extras (`src/data/educationExtras.ts`)

New file with expanded detail for the education detail panel:

```typescript
export const educationExtras: EducationExtra[] = [
  {
    documentId: 'doc-mpharm',
    extracurriculars: [
      'President of UEA Pharmacy Society',
      'Secretary & Vice-President of UEA Ultimate Frisbee',
      'Publicity Officer for UEA Alzheimer\'s Society',
    ],
    researchDescription: 'Final year research project investigating cocrystal formation for improved drug delivery properties.',
  },
  {
    documentId: 'doc-mary-seacole',
    programmeDetail: 'Formal NHS leadership qualification providing theoretical grounding in healthcare leadership approaches, change management, and system-level thinking.',
  },
]
```

---

## 6. Detail Panel Content Renderers

The `DetailPanel` component delegates rendering to content-specific sub-components based on `content.type`:

### 6.1 KPIDetail (`src/components/detail/KPIDetail.tsx`)
- Headline number (large, coloured)
- Context paragraph
- "Your role" paragraph
- Outcome bullets
- Period badge

### 6.2 SkillDetail (`src/components/detail/SkillDetail.tsx`)
- Skill name + frequency + status badge
- Proficiency bar
- Years of experience
- Prescribing history timeline (reuse existing pattern from CoreSkillsTile)
- "Used in" section: list of roles that used this skill (from constellation mapping)

### 6.3 SkillsAllDetail (`src/components/detail/SkillsAllDetail.tsx`)
- Full categorised list of all skills
- Grouped by Technical / Healthcare Domain / Strategic & Leadership
- Each skill clickable to switch panel to individual skill detail

### 6.4 ConsultationDetail (`src/components/detail/ConsultationDetail.tsx`)
- Role title + organisation + dates
- History paragraph (from `consultation.history`)
- Achievement bullets (from `consultation.examination`)
- Plan/outcomes (from `consultation.plan`)
- Coded entries badges (from `consultation.codedEntries`)
- Technical environment list

### 6.5 ProjectDetail (`src/components/detail/ProjectDetail.tsx`)
- Project name + year + status
- Methodology description
- Tech stack tags
- Results bullets
- External link button (if available)

### 6.6 EducationDetail (`src/components/detail/EducationDetail.tsx`)
- Title + institution + dates + classification
- Research project description (if MPharm)
- Extracurricular activities
- Programme detail (if Mary Seacole)
- Notes

---

## 7. Hook Modifications

### 7.1 `useActiveSection` (existing, to update)

Currently may observe legacy view IDs. Update to observe the new tile `data-tile-id` attributes and map them to SubNav section IDs:

```typescript
const sectionTileMap: Record<string, string> = {
  'patient-summary': 'overview',
  'core-skills': 'skills',
  'career-activity': 'experience',
  'projects': 'projects',
  'education': 'education',
}
```

### 7.2 `useFocusTrap` (new hook, `src/hooks/useFocusTrap.ts`)

For the DetailPanel. Traps Tab key focus within the panel when open.

```typescript
export function useFocusTrap(containerRef: RefObject<HTMLElement>, isActive: boolean): void
```

---

## 8. New Dependency

```bash
npm install d3 @types/d3
```

Only `d3-force`, `d3-selection`, `d3-scale`, `d3-transition` are needed. Can import selectively:
```typescript
import { forceSimulation, forceManyBody, forceLink, forceX, forceY, forceCollide } from 'd3-force'
import { select } from 'd3-selection'
import { scaleLinear } from 'd3-scale'
```

---

## 9. CSS Additions (`src/index.css`)

```css
/* Sub-nav bar */
--subnav-height: 36px;

/* Detail panel */
--panel-narrow: 400px;
--panel-wide: 60vw;
--backdrop-blur: 4px;
--backdrop-bg: rgba(26,43,42,0.15);

/* Detail panel slide animation */
@keyframes panel-slide-in {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes panel-slide-out {
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
}

@keyframes backdrop-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  @keyframes panel-slide-in { from { transform: none; } to { transform: none; } }
  @keyframes panel-slide-out { from { transform: none; } to { transform: none; } }
  @keyframes backdrop-fade-in { from { opacity: 1; } to { opacity: 1; } }
}
```

---

## 10. Implementation Phases

### Phase 1: Core Infrastructure
1. `DetailPanelContext` + `DetailPanel` component
2. `SubNav` component + `useActiveSection` update
3. `DashboardLayout` restructure (new tile order, SubNav, DetailPanel)
4. `useFocusTrap` hook
5. CSS additions (panel animations, sub-nav height)

### Phase 2: Tile Depth (iterative, per tile)
6. `LatestResultsTile` — remove flip, bigger numbers, panel trigger
7. `CoreSkillsTile` — full width, categorised, expanded data, "view all"
8. `ProjectsTile` — half width, card grid, panel trigger
9. `LastConsultationTile` — panel trigger
10. `CareerActivityTile` — timeline items → panel, hover preview
11. `EducationTile` — richer content, panel trigger
12. `PatientSummaryTile` — structured presentation

### Phase 3: Detail Panel Content
13. `KPIDetail` renderer + KPI stories data
14. `ConsultationDetail` renderer
15. `ProjectDetail` renderer
16. `SkillDetail` + `SkillsAllDetail` renderers
17. `EducationDetail` renderer + extras data
18. Update CommandPalette actions to use detail panel

### Phase 4: Career Constellation
19. Install d3, create `constellation.ts` data mapping
20. Build `CareerConstellation` component (D3 force graph)
21. Integrate into `CareerActivityTile`
22. Hover/click interactions → detail panel
23. Accessibility (keyboard nav, screen reader, reduced-motion)

### Phase 5: Login Refresh
24. Visual restyle (teal accents, fonts, shadows)
25. Username change to `a.recruiter`
26. Connection status indicator (red → green dot)
27. Post-login loading state
28. TopBar session name update

### Phase 6: Polish
29. Responsive testing (mobile: full-width panels, collapsed sub-nav)
30. `prefers-reduced-motion` audit across all new components
31. Command palette updates for new content/actions
32. Search index update for expanded skills data

---

## 11. File Inventory

### New Files (13)
```
src/contexts/DetailPanelContext.tsx
src/components/DetailPanel.tsx
src/components/SubNav.tsx
src/components/CareerConstellation.tsx
src/components/detail/KPIDetail.tsx
src/components/detail/SkillDetail.tsx
src/components/detail/SkillsAllDetail.tsx
src/components/detail/ConsultationDetail.tsx
src/components/detail/ProjectDetail.tsx
src/components/detail/EducationDetail.tsx
src/data/constellation.ts
src/data/educationExtras.ts
src/hooks/useFocusTrap.ts
```

### Modified Files (14)
```
src/App.tsx                           — wrap DashboardLayout with DetailPanelProvider
src/components/DashboardLayout.tsx    — SubNav, tile reorder, DetailPanel render
src/components/TopBar.tsx             — session name → A.RECRUITER
src/components/LoginScreen.tsx        — visual refresh, connection status, username
src/components/Card.tsx               — no changes needed (already supports full prop)
src/components/tiles/LatestResultsTile.tsx    — remove flip, bigger numbers, panel
src/components/tiles/CoreSkillsTile.tsx       — full width, categorised, view all
src/components/tiles/ProjectsTile.tsx         — half width, card grid, panel
src/components/tiles/LastConsultationTile.tsx — add panel trigger
src/components/tiles/CareerActivityTile.tsx   — constellation embed, panel triggers
src/components/tiles/EducationTile.tsx        — richer content, panel trigger
src/components/tiles/PatientSummaryTile.tsx   — structured presentation
src/data/skills.ts                    — expand to ~20 skills with categories
src/data/kpis.ts                      — add story fields
src/types/pmr.ts                      — new types
src/index.css                         — new CSS vars, animations
src/hooks/useActiveSection.ts         — update for new tile IDs
src/lib/search.ts                     — update palette for new panel actions
package.json                          — add d3 dependency
```

### Unchanged (locked)
```
src/components/BootSequence.tsx
src/components/ECGAnimation.tsx
```
