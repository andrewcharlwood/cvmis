# Reference: Tasks 8-11 — Card Component and Top Tiles

## Task 8: Reusable Card Component

### File: `src/components/Card.tsx`

### Base Card
```typescript
interface CardProps {
  children: React.ReactNode
  full?: boolean       // spans both grid columns
  className?: string
}
```

**Styling:**
- `background: var(--surface)` (#FFFFFF)
- `border: 1px solid var(--border-light)` (#E4EDEB)
- `border-radius: var(--radius)` (8px)
- `padding: 20px`
- `box-shadow: var(--shadow-sm)` (0 1px 2px rgba(26,43,42,0.05))
- Hover: `box-shadow: var(--shadow-md)`, `border-color: var(--border)` (#D4E0DE)
- `transition: box-shadow 0.2s, border-color 0.2s`
- Full variant: `grid-column: 1 / -1`

### CardHeader Sub-component
```typescript
interface CardHeaderProps {
  dotColor: 'teal' | 'amber' | 'green' | 'alert' | 'purple'
  title: string
  rightText?: string
}
```

**Styling:**
- `display: flex`, `align-items: center`, `gap: 8px`, `margin-bottom: 16px`
- Dot: 8px circle, `border-radius: 50%`, flex-shrink-0
  - teal: `#0D6E6E`, amber: `#D97706`, green: `#059669`, alert: `#DC2626`, purple: `#7C3AED`
- Title: 12px, 600 weight, uppercase, `letter-spacing: 0.06em`, text-secondary (#5B7A78)
- Right text (optional): 10px, 400 weight, normal case, no tracking, text-tertiary, mono font, `margin-left: auto`

---

## Task 9: PatientSummary Tile

### File: `src/components/tiles/PatientSummaryTile.tsx`

**Layout:** Full-width card, first in grid.

**Content:**
- CardHeader: teal dot + "PATIENT SUMMARY"
- Body: personal statement text from `src/data/profile.ts`
- Typography: 13px, font-ui, `line-height: 1.6` (leading-relaxed), text-primary
- No interactive elements — read-only

**Data:** `import { personalStatement } from '@/data/profile'`

This is a simple tile. No expansion, no interactivity.

---

## Task 10: LatestResults Tile

### File: `src/components/tiles/LatestResultsTile.tsx`

**Layout:** Half-width card (single grid column). Sits in the LEFT column.

**Content:**
- CardHeader: teal dot + "LATEST RESULTS" + right text "Updated May 2025"
- 2×2 metric grid inside

**Metric Grid:**
- `display: grid`, `grid-template-columns: 1fr 1fr`, `gap: 12px`

**Each Metric Card:**
- `padding: 14px`, `border-radius: var(--radius-sm)` (6px)
- `border: 1px solid var(--border-light)`, `background: var(--bg)` (#F0F5F4)
- Value: 22px, 700 weight, `letter-spacing: -0.02em`, `line-height: 1.2`
  - Color by variant: green=#059669, amber=#D97706, teal=#0D6E6E
- Label: 11px, text-secondary, 500 weight, `margin-top: 3px`
- Sub: 10px, text-tertiary, mono font, `margin-top: 4px`

**Data:** `import { kpis } from '@/data/kpis'`

**KPI flip prep:** Each metric card should accept a `data-kpi-id` or an `onClick` prop placeholder — Task 17 will add the flip interaction. For now, render as static display.

**Values:**
| Value | Label | Sub | Color |
|-------|-------|-----|-------|
| £220M | Budget Oversight | NHS prescribing | green |
| £14.6M | Efficiency Savings | Identified & tracked | amber |
| 9+ | Years in NHS | Since 2016 | teal |
| 12 | Team Size Led | Cross-functional | green |

---

## Task 11: CoreSkills Tile ("Repeat Medications")

### File: `src/components/tiles/CoreSkillsTile.tsx`

**Layout:** Half-width card (single grid column). Sits in the RIGHT column, next to LatestResults.

**Content:**
- CardHeader: amber dot + "REPEAT MEDICATIONS"
- Vertical list of skill items, `gap: 10px`

**Each Skill Item:**
Matches the concept's `.dev-item` pattern:
- `display: flex`, `align-items: center`, `gap: 10px`
- 12.5px font, `padding: 10px 12px`
- `background: var(--bg)` (#F0F5F4), `border-radius: var(--radius-sm)` (6px)
- `border: 1px solid var(--border-light)`

**Item structure:**
- **Icon container** (28px square, 6px radius):
  - `background: var(--accent-light)`, `color: var(--accent)` (teal)
  - Lucide icon inside (14px): `BarChart3` for Data Analysis, `Code2` for Python, `Database` for SQL, `PieChart` for Power BI, `FileCode2` for JS/TS
- **Text block** (flex: 1):
  - Name: 600 weight, text-primary (e.g., "Data Analysis")
  - Frequency + years: 11px, text-tertiary, mono font (e.g., "Twice daily · Since 2016 · 9 yrs")
- **Optional status badge**: 10px, 500 weight, pill shape (padding 3px 8px, border-radius 20px), flex-shrink-0
  - Could show proficiency or "Active" status

**Medication metaphor format:**
```
[📊] Data Analysis                     Active
     Twice daily · Since 2016 · 9 yrs

[💻] Python                            Active
     Daily · Since 2019 · 6 yrs

[🗄️] SQL                               Active
     Daily · Since 2018 · 7 yrs

[📈] Power BI                          Active
     Once weekly · Since 2020 · 5 yrs

[📝] JavaScript / TypeScript           Active
     When required · Since 2022 · 3 yrs
```

**Data:** `import { skills } from '@/data/skills'`

**Expansion prep:** Each item should accept an onClick prop placeholder — Task 16 will add expansion to show prescribing history (from existing medications data).
