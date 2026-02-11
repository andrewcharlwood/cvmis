# Reference: Medications View (= Skills)

> Extracted from goal.md — Medications View section. Skills presented as an active medications list.

---

## Overview

Skills presented as an active medications list — the format every pharmacist and GP reads daily.

## Full Table Layout

```
+--[ Active Medications ]-------------------------------------------------+
| Drug Name          | Dose  | Frequency  | Start    | Status            |
|--------------------+-------+------------+----------+-------------------|
| Python             | 90%   | Daily      | 2017     | Active (green)    |
| SQL                | 88%   | Daily      | 2017     | Active (green)    |
| Power BI           | 92%   | Daily      | 2019     | Active (green)    |
| Data Analysis      | 95%   | Daily      | 2016     | Active (green)    |
| JavaScript / TS    | 70%   | Weekly     | 2020     | Active (green)    |
| Dashboard Dev      | 88%   | Weekly     | 2019     | Active (green)    |
| Algorithm Design   | 82%   | Weekly     | 2022     | Active (green)    |
| Data Pipelines     | 80%   | Weekly     | 2022     | Active (green)    |
+-------------------------------------------------------------------------+

+--[ Clinical Medications ]-----------------------------------------------+
| Drug Name               | Dose  | Frequency  | Start  | Status         |
|-------------------------+-------+------------+--------+----------------|
| Medicines Optimisation  | 95%   | Daily      | 2016   | Active (green) |
| Pop. Health Analytics   | 90%   | Daily      | 2022   | Active (green) |
| NICE TA Implementation  | 85%   | Weekly     | 2022   | Active (green) |
| Health Economics         | 80%   | Monthly    | 2023   | Active (green) |
| Clinical Pathways        | 82%   | Weekly     | 2022   | Active (green) |
| CD Assurance             | 88%   | Weekly     | 2024   | Active (green) |
+-------------------------------------------------------------------------+

+--[ PRN (As Required) ]--------------------------------------------------+
| Drug Name                | Dose  | Frequency  | Start  | Status         |
|-------------------------+-------+------------+--------+----------------|
| Budget Management        | 90%   | As needed  | 2024   | Active (green) |
| Stakeholder Engagement   | 88%   | As needed  | 2022   | Active (green) |
| Pharma Negotiation       | 85%   | As needed  | 2024   | Active (green) |
| Team Development         | 82%   | As needed  | 2017   | Active (green) |
+-------------------------------------------------------------------------+
```

## Column Definitions

| Column | PMR Meaning | CV Mapping |
|--------|------------|------------|
| Drug Name | Medication name | Skill name |
| Dose | Dosage strength | Proficiency percentage |
| Frequency | How often taken | How often the skill is used (Daily / Weekly / Monthly / As needed) |
| Start | Date prescribed | Year Andy started using this skill (approximate) |
| Status | Active / Stopped | Active (green dot) for current skills, Historical (gray dot) for deprecated skills |

## Medication Categories (tabs within the view)

Skills are grouped into three "medication types," mimicking how clinical systems separate regular, acute, and PRN medications:

- **Active Medications** = Technical skills (the "regular medications" — taken daily, core to function)
- **Clinical Medications** = Healthcare domain skills (the specialist prescriptions)
- **PRN (As Required)** = Strategic & leadership skills (used situationally, not daily)

## Table Styling

- Table headers: Inter 600, 13px, uppercase, gray-400, `#F9FAFB` background
- Table rows: alternating `#FFFFFF` / `#F9FAFB` backgrounds
- Row height: 40px
- All borders: `1px solid #E5E7EB`
- Hover state: row background changes to `#EFF6FF` (subtle blue tint)
- Status dots: 6px circles, inline with status text

## Interaction — Prescribing History

Clicking any medication/skill row expands it downward to show a "prescribing history" — a mini-timeline of how the skill developed:

```
Python | 90% | Daily | 2017 | Active (green)
  |-- Prescribing History:
     2017  Started: Self-taught for data analysis automation
     2019  Increased: Dashboard development, data pipeline work
     2022  Specialist use: Blueteq automation, Sankey analysis tools
     2024  Advanced: Switching algorithm (14,000 patients), CD monitoring
     2025  Current: Population-level analytics, incentive scheme automation
```

The history entries are styled in Geist Mono, 12px, with year markers as bold anchors and descriptions in regular weight. This "prescribing history" shows skill progression in a format that clinicians understand intuitively.

## Sortable Columns

Table columns are sortable by clicking the header. Clicking "Dose" sorts by proficiency descending. Clicking "Start" sorts chronologically. A small sort indicator arrow appears in the active sort column header. Default sort: by category grouping.

---

## Design Guidance (from /frontend-design)

### Aesthetic Direction

**Clinical-Utilitarian / NHS PMR Fidelity**

This implementation follows the Clinical Record (Design 7) medications-as-skills metaphor with absolute fidelity to the specification. The aesthetic is clinical-utilitarian: light-mode only, border-heavy, table-driven, zero decorative flourish. Every design decision mirrors real NHS PMR systems (EMIS Web, SystmOne). The component is not themed loosely -- it is a faithful reproduction of how medications lists appear in actual GP clinical software, repurposed to present skills as active prescriptions.

**Purpose:** Present 18 professional skills as an active medications list that clinicians will instantly recognize and recruiters will find navigable and information-dense.

**Tone:** Institutional, functional, border-heavy. No shadows, no rounded corners beyond 4px, no gradients. Clinical systems are designed for rapid information retrieval under time pressure -- that same quality makes this an efficient skills display.

**Constraints followed:**
- Light-mode ONLY (clinical systems are light-mode by design)
- NHS blue `#005EB8` as the sole accent color
- Border radius capped at 4px
- Inter for all text, Geist Mono for prescribing history data
- All borders `1px solid #E5E7EB`
- No decorative elements whatsoever

**Differentiation:** The medications-as-skills mapping provides richer data than any traditional "skills list." Dose maps to proficiency, Frequency maps to usage patterns, Start maps to when the skill was acquired, and prescribing history shows the skill's evolution over time. This is not decoration -- it is genuinely useful information architecture.

### Key Design Decisions

#### 1. Three Category Tabs
- **"Active Medications"** (8 technical skills), **"Clinical Medications"** (6 healthcare domain skills), **"PRN (As Required)"** (4 strategic/leadership skills)
- Active tab: white background + NHS blue (`#005EB8`) 2px bottom border
- Inactive tabs: `#F9FAFB` background, gray text, hover brightens
- Count badges show the number of items per category
- Full ARIA `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls` semantics

#### 2. Semantic HTML Table
- Proper `<table>`, `<thead>`, `<th scope="col">`, `<tbody>`, `<tr>`, `<td>` markup
- Five columns: Drug Name, Dose, Frequency, Start, Status
- Headers: Inter 600, 13px, uppercase, 0.03em tracking, `#F9FAFB` background
- Row height: 40px
- Alternating `#FFFFFF` / `#F9FAFB` row backgrounds via CSS `:nth-child(even)`
- Hover state: `#EFF6FF` (subtle blue tint) -- **no transform, no lift, no shadow**
- Status dots: 6px green circles inline with "Active" text
- All borders: `1px solid #E5E7EB`

#### 3. Sortable Columns
- Click any header to sort (ascending/descending toggle)
- ChevronUp, ChevronDown, or ChevronsUpDown indicator in header
- Sorting logic handles string, numeric (dose %), and date (year) columns
- Default: no sort (original order preserved)

#### 4. Expandable Prescribing History
- Click any row (or arrow at row end) to expand
- Uses Framer Motion `<AnimatePresence>` for smooth height animation (0.2s)
- History entries styled in Geist Mono 12px
- Year markers bold, descriptions regular weight
- Format: `2017 Started: Self-taught for data analysis automation`
- Vertical timeline with connecting line on left

#### 5. Mobile: Card Layout
- Below 640px: Table hidden, cards displayed
- Each card is a bordered block with stacked key-value pairs
- No horizontal scroll required
- Same expandable history behavior

### Implementation Patterns / Code Snippets

#### Types
```typescript
interface MedicationEntry {
  drugName: string
  dose: string
  frequency: string
  start: string
  status: 'Active'
  prescribingHistory: PrescribingEvent[]
}

interface PrescribingEvent {
  year: string
  label: string
  description: string
}

type MedicationCategory = 'active' | 'clinical' | 'prn'
```

#### Tab Implementation
```typescript
const tabs: { key: MedicationCategory; label: string }[] = [
  { key: 'active', label: 'Active Medications' },
  { key: 'clinical', label: 'Clinical Medications' },
  { key: 'prn', label: 'PRN (As Required)' },
]

{tabs.map(({ key, label }) => (
  <button
    key={key}
    role="tab"
    aria-selected={category === key}
    aria-controls={`${key}-panel`}
    onClick={() => setCategory(key)}
    className={cn(
      'px-4 py-2 font-inter text-sm font-medium transition-colors',
      category === key
        ? 'bg-white text-[#005EB8] border-b-2 border-[#005EB8]'
        : 'bg-[#F9FAFB] text-gray-600 hover:bg-white'
    )}
  >
    {label}
  </button>
))}
```

#### Table Row with Expand
```typescript
<tr
  onClick={() => toggleExpanded(drugName)}
  className="h-[40px] border-b border-[#E5E7EB] cursor-pointer transition-colors hover:bg-[#EFF6FF]"
>
  <td className="px-4 py-2 text-sm font-medium text-gray-900">
    {drugName}
  </td>
  {/* ... other cells ... */}
</tr>

<AnimatePresence>
  {isExpanded && (
    <motion.tr
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <td colSpan={5} className="px-4 py-3 bg-[#F9FAFB]">
        <div className="font-mono text-xs space-y-1">
          {prescribingHistory.map((event) => (
            <div key={event.year} className="flex gap-3">
              <span className="font-bold text-gray-700">{event.year}</span>
              <span className="text-gray-600">{event.label}:</span>
              <span className="text-gray-500">{event.description}</span>
            </div>
          ))}
        </div>
      </td>
    </motion.tr>
  )}
</AnimatePresence>
```

#### Sort Indicator
```typescript
const SortIndicator = ({ column }: { column: SortColumn }) => {
  if (sort.column !== column) {
    return <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400" />
  }
  return sort.direction === 'asc'
    ? <ChevronUp className="w-3.5 h-3.5 text-[#005EB8]" />
    : <ChevronDown className="w-3.5 h-3.5 text-[#005EB8]" />
}
```

#### Status Dot
```typescript
<div className="flex items-center gap-2">
  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
  <span className="text-sm text-gray-700">Active</span>
</div>
```

#### Tailwind Classes Summary
- **Container:** `border border-[#E5E7EB] rounded`
- **Table headers:** `bg-[#F9FAFB] text-xs font-semibold uppercase tracking-wide text-gray-600`
- **Row hover:** `hover:bg-[#EFF6FF]`
- **Alternating rows:** `even:bg-[#F9FAFB] bg-white`
- **Tab active:** `bg-white text-[#005EB8] border-b-2 border-[#005EB8]`
- **Tab inactive:** `bg-[#F9FAFB] text-gray-600 hover:bg-white`
- **Mono text:** `font-mono text-xs`
