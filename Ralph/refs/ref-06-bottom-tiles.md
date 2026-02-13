# Reference: Tasks 12-15 — Bottom Tiles

## Task 12: LastConsultation Tile

### File: `src/components/tiles/LastConsultationTile.tsx`

**Layout:** Full-width card.

**Content:**
- CardHeader: green dot + "LAST CONSULTATION" + right text "Most recent role"

**Header info row:**
- `display: flex`, `flex-wrap: wrap`, `gap: 16px`
- `margin-bottom: 14px`, `padding-bottom: 14px`, `border-bottom: 1px solid var(--border-light)`
- Each field:
  - Label: 10px, uppercase, `letter-spacing: 0.06em`, text-tertiary
  - Value: 11.5px, 600 weight, text-primary

| Label | Value |
|-------|-------|
| Date | May 2025 |
| Organisation | NHS Norfolk & Waveney ICB |
| Type | Permanent · Full-time |
| Band | 8a |

**Role title:**
- "Interim Head, Population Health & Data Analysis"
- 13.5px, 600 weight, `color: var(--accent)` (#0D6E6E)
- `margin-bottom: 12px`

**Bullet list:**
- `list-style: none`, flex column, `gap: 7px`
- Each bullet: 12.5px, text-primary, `padding-left: 16px`, `line-height: 1.5`
- Pseudo `::before`: 5px circle, accent color (#0D6E6E), `opacity: 0.5`, positioned left at top 7px

**Bullets** (from first consultation's examination array):
- Led a cross-functional team of 12 across data, analytics, and population health workstreams
- Oversaw £220M prescribing budget with full analytical accountability and reporting to ICB board
- Identified £14.6M in efficiency savings through data-driven prescribing interventions
- Designed and deployed Power BI dashboards used by 200+ clinicians and commissioners
- Spearheaded SQL analytics transformation, migrating legacy Access databases to modern data stack
- Established team data literacy programme, upskilling 30+ non-technical staff in data interpretation

**Data:** `import { consultations } from '@/data/consultations'` — use `consultations[0]` (the most recent).

Map consultation fields:
- date → Date field
- organization → Organisation field
- role → Role title
- examination array → Bullet points

---

## Task 13: CareerActivity Tile

### File: `src/components/tiles/CareerActivityTile.tsx`

**Layout:** Full-width card.

**Content:**
- CardHeader: teal dot + "CAREER ACTIVITY" + right text "Full timeline"

**Activity grid:**
- `display: grid`, `grid-template-columns: 1fr 1fr`, `gap: 10px`
- Below 900px: `grid-template-columns: 1fr` (single column)

**Each activity item:**
- `display: flex`, `gap: 10px`
- `padding: 10px 12px`
- `background: var(--bg)` (#F0F5F4)
- `border-radius: var(--radius-sm)` (6px)
- `border: 1px solid var(--border-light)`
- 12px font
- `transition: border-color 0.15s`
- Hover: `border-color: var(--accent-border)`

**Dot (left):**
- 8px circle, flex-shrink-0, `margin-top: 2px` (aligns with text)
- Color by type:
  - Role: teal (#0D6E6E)
  - Project: amber (#D97706)
  - Certification: green (#059669)
  - Education: purple (#7C3AED)

**Content (right):**
- Title: 600 weight, text-primary, `line-height: 1.3`
- Meta: 11px, text-secondary, `margin-top: 2px`
- Date: 10px, mono font, text-tertiary, `margin-top: 3px`

**Building the timeline data:**

Merge entries from multiple data sources, sorted newest-first:

```typescript
type ActivityType = 'role' | 'project' | 'cert' | 'edu'

interface ActivityEntry {
  id: string
  type: ActivityType
  title: string
  meta: string
  date: string
  sortYear: number  // for sorting
}
```

Sources:
1. `consultations` → type "role": title=role, meta=organization, date=duration
2. `investigations` (selected key ones) → type "project": title=name, meta=short description, date=year
3. `documents` where type='Certificate' → type "cert": title=title, meta=source, date=date
4. `documents` where type='Results' (MPharm) → type "edu": title=title, meta=source, date=date

Match the concept HTML entries:
| Type | Title | Meta | Date |
|------|-------|------|------|
| role | Interim Head, Population Health & Data Analysis | NHS Norfolk & Waveney ICB | 2024 – 2025 |
| project | £220M Prescribing Budget Oversight | Lead analyst & budget owner | 2024 |
| role | Senior Data Analyst — Medicines Optimisation | NHS Norfolk & Waveney ICB | 2021 – 2024 |
| project | SQL Analytics Transformation | Legacy migration project lead | 2025 |
| cert | Power BI Data Analyst Associate | Microsoft Certified | 2023 |
| role | Prescribing Data Pharmacist | NHS Norwich CCG | 2018 – 2021 |
| cert | Clinical Pharmacy Diploma | Professional development | 2019 |
| role | Community Pharmacist | Boots UK | 2016 – 2018 |
| edu | MPharm (Hons) — 2:1 | University of East Anglia | 2011 – 2015 |
| cert | GPhC Registration | General Pharmaceutical Council | August 2016 |

**Expansion prep:** Activity items should accept onClick for Task 16 (expand to show full role/project detail).

---

## Task 14: Education Tile

### File: `src/components/tiles/EducationTile.tsx`

**Layout:** Full-width card, below Career Activity.

**Content:**
- CardHeader: purple dot (#7C3AED) + "EDUCATION"

**Education entries:**
Vertical stack of education items.

Each item:
- `padding: 7px 10px`
- `background: var(--surface)` (#FFFFFF)
- `border: 1px solid var(--border-light)`
- `border-radius: var(--radius-sm)` (6px)
- 11.5px, text-primary

Structure:
- Degree name: 600 weight, `display: block`
- Detail: text-secondary, 11px, `margin-top: 2px`

**Entries** (from CV):
| Degree | Detail |
|--------|--------|
| MPharm (Hons) — 2:1 | University of East Anglia · 2015 |
| NHS Leadership Academy — Mary Seacole Programme | 2018 · 78% |
| A-Levels: Mathematics (A*), Chemistry (B), Politics (C) | Highworth Grammar School · 2009–2011 |

**Data:** Filter `src/data/documents.ts` for education entries, or hardcode from CV since the documents data may not have all education entries.

Note: The concept HTML only shows the MPharm entry. But the CV has more education. Include all CV education entries.

---

## Task 15: Projects Tile

### File: `src/components/tiles/ProjectsTile.tsx`

**Layout:** Full-width card, prominent position.

**Content:**
- CardHeader: amber dot + "ACTIVE PROJECTS"

**Project entries:**
Vertical list, styled as interactive items.

Each project:
- `display: flex`, `align-items: flex-start`, `gap: 8px`
- `padding: 7px 10px`
- `background: var(--surface)`, `border: 1px solid var(--border-light)`
- `border-radius: var(--radius-sm)` (6px)
- 11.5px, text-primary
- Hover: `border-color: var(--accent-border)`
- `transition: border-color 0.15s`

Structure:
- **Status dot** (7px circle, flex-shrink-0, `margin-top: 4px`):
  - Complete: success (#059669)
  - Ongoing: accent (#0D6E6E)
  - Live: success with pulse animation
- **Project name**: text-primary, flex 1
- **Year badge**: 10px, mono font, text-tertiary, `margin-left: auto`, flex-shrink-0

**Data:** `import { investigations } from '@/data/investigations'`

Map investigations to projects:
- name → Project name
- status → dot color
- requestedYear → Year badge
- resultSummary → Available for expansion (Task 16)

**Expansion prep:** Each item should accept onClick for Task 16 (expand to show methodology, tech stack, results).
