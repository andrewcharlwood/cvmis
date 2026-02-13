# Reference: Task 2 — Data Files and Types

## Overview

Create new data files for dashboard-specific content and update the type system. All CV content must match `References/CV_v4.md` exactly.

## New Data Files

### `src/data/profile.ts`

```typescript
export const personalStatement = `Healthcare leader combining clinical pharmacy expertise with proficiency in Python, SQL, and data analytics, self-taught over the past decade through a drive to find root causes in data and build the most efficient solutions to complex problems. Currently leading population health analytics for NHS Norfolk & Waveney ICB, serving a population of 1.2 million. Experienced in working with messy, real-world prescribing data at scale to deliver actionable insights—from financial scenario modelling and pharmaceutical rebate negotiation to algorithm design and population-level pathway development. Proven track record of identifying and prioritising efficiency programmes worth £14.6M+ through automated, data-driven analysis. Skilled at translating complex clinical, financial, and analytical requirements into clear recommendations for executive stakeholders.`
```

### `src/data/tags.ts`

```typescript
import type { Tag } from '@/types/pmr'

export const tags: Tag[] = [
  { label: 'Pharmacist', colorVariant: 'teal' },
  { label: 'Data Lead', colorVariant: 'teal' },
  { label: 'NHS', colorVariant: 'teal' },
  { label: 'Population Health', colorVariant: 'amber' },
  { label: 'BI & Analytics', colorVariant: 'green' },
]
```

### `src/data/alerts.ts`

```typescript
import type { Alert } from '@/types/pmr'

export const alerts: Alert[] = [
  {
    message: '£14.6M SAVINGS IDENTIFIED',
    severity: 'alert',
    icon: 'AlertTriangle', // lucide-react icon name
  },
  {
    message: '£220M BUDGET OVERSIGHT',
    severity: 'amber',
    icon: 'AlertCircle', // lucide-react icon name
  },
]
```

### `src/data/kpis.ts`

```typescript
import type { KPI } from '@/types/pmr'

export const kpis: KPI[] = [
  {
    id: 'budget',
    value: '£220M',
    label: 'Budget Oversight',
    sub: 'NHS prescribing',
    colorVariant: 'green',
    explanation: 'Managed the ICB\'s total prescribing budget with sophisticated forecasting models identifying cost pressures and enabling proactive financial planning across Norfolk & Waveney.',
  },
  {
    id: 'savings',
    value: '£14.6M',
    label: 'Efficiency Savings',
    sub: 'Identified & tracked',
    colorVariant: 'amber',
    explanation: 'Identified and prioritised a £14.6M efficiency programme through comprehensive data analysis; achieved over-target performance through targeted, evidence-based interventions across the integrated care system.',
  },
  {
    id: 'years',
    value: '9+',
    label: 'Years in NHS',
    sub: 'Since 2016',
    colorVariant: 'teal',
    explanation: 'Continuous NHS service since August 2016, progressing from community pharmacy through prescribing data analysis to system-level population health data leadership.',
  },
  {
    id: 'team',
    value: '12',
    label: 'Team Size Led',
    sub: 'Cross-functional',
    colorVariant: 'green',
    explanation: 'Led a cross-functional team of 12 spanning data analysts, population health specialists, and pharmacists across data, analytics, and population health workstreams.',
  },
]
```

### `src/data/skills.ts`

Skills presented as "medications" with frequency (user-specified values) and years of experience.

```typescript
import type { SkillMedication } from '@/types/pmr'

export const skills: SkillMedication[] = [
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    frequency: 'Twice daily',
    startYear: 2016,
    yearsOfExperience: 9,
    proficiency: 95,
    category: 'Technical',
    status: 'Active',
    icon: 'BarChart3',
  },
  {
    id: 'python',
    name: 'Python',
    frequency: 'Daily',
    startYear: 2019,
    yearsOfExperience: 6,
    proficiency: 90,
    category: 'Technical',
    status: 'Active',
    icon: 'Code2',
  },
  {
    id: 'sql',
    name: 'SQL',
    frequency: 'Daily',
    startYear: 2018,
    yearsOfExperience: 7,
    proficiency: 88,
    category: 'Technical',
    status: 'Active',
    icon: 'Database',
  },
  {
    id: 'power-bi',
    name: 'Power BI',
    frequency: 'Once weekly',
    startYear: 2020,
    yearsOfExperience: 5,
    proficiency: 92,
    category: 'Technical',
    status: 'Active',
    icon: 'PieChart',
  },
  {
    id: 'javascript-typescript',
    name: 'JavaScript / TypeScript',
    frequency: 'When required',
    startYear: 2022,
    yearsOfExperience: 3,
    proficiency: 70,
    category: 'Technical',
    status: 'Active',
    icon: 'FileCode2',
  },
]
```

Note: Additional domain/leadership skills can be added later. Start with the 5 technical skills the user specified frequencies for.

## Type Updates (`src/types/pmr.ts`)

Add these interfaces (keep all existing types):

```typescript
export interface Tag {
  label: string
  colorVariant: 'teal' | 'amber' | 'green'
}

export interface Alert {
  message: string
  severity: 'alert' | 'amber'
  icon: string
}

export interface KPI {
  id: string
  value: string
  label: string
  sub: string
  colorVariant: 'green' | 'amber' | 'teal'
  explanation: string
}

export interface SkillMedication {
  id: string
  name: string
  frequency: string
  startYear: number
  yearsOfExperience: number
  proficiency: number
  category: 'Technical' | 'Domain' | 'Leadership'
  status: 'Active' | 'Historical'
  icon: string
}
```

## Existing Data — No Changes

These files remain untouched:
- `src/data/patient.ts`
- `src/data/consultations.ts`
- `src/data/medications.ts`
- `src/data/problems.ts`
- `src/data/investigations.ts`
- `src/data/documents.ts`
