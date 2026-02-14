import Fuse, { type FuseResult } from 'fuse.js'
import type { ViewId } from '@/types/pmr'

import { consultations } from '@/data/consultations'
import { medications } from '@/data/medications'
import { problems } from '@/data/problems'
import { investigations } from '@/data/investigations'
import { documents } from '@/data/documents'
import { skills } from '@/data/skills'
import { kpis } from '@/data/kpis'
import type { DetailPanelContent } from '@/types/pmr'

export type PaletteSection = 'Experience' | 'Core Skills' | 'Active Projects' | 'Achievements' | 'Education' | 'Quick Actions'

export type PaletteAction =
  | { type: 'scroll'; tileId: string }
  | { type: 'expand'; tileId: string; itemId: string }
  | { type: 'link'; url: string }
  | { type: 'download' }
  | { type: 'panel'; panelContent: DetailPanelContent }

export type IconColorVariant = 'teal' | 'green' | 'amber' | 'purple'

export interface PaletteItem {
  id: string
  title: string
  subtitle: string
  section: PaletteSection
  iconVariant: IconColorVariant
  iconType: 'role' | 'skill' | 'project' | 'achievement' | 'edu' | 'action'
  keywords: string
  action: PaletteAction
}

// Build the full palette dataset matching the concept HTML structure
export function buildPaletteData(): PaletteItem[] {
  const items: PaletteItem[] = []

  // Experience — matching concept HTML entries
  const experienceEntries: Array<{ title: string; sub: string; keywords: string; activityId: string }> = [
    {
      title: 'Interim Head, Population Health & Data Analysis',
      sub: 'NHS Norfolk & Waveney ICB \u00b7 2024\u20132025',
      keywords: 'head interim population health data analysis nhs norfolk waveney icb 2024 2025 latest current',
      activityId: 'interim-head',
    },
    {
      title: 'Senior Data Analyst \u2014 Medicines Optimisation',
      sub: 'NHS Norfolk & Waveney ICB \u00b7 2021\u20132024',
      keywords: 'senior data analyst medicines optimisation nhs norfolk waveney icb 2021 2024',
      activityId: 'senior-analyst',
    },
    {
      title: 'Prescribing Data Pharmacist',
      sub: 'NHS Norwich CCG \u00b7 2018\u20132021',
      keywords: 'prescribing data pharmacist nhs norwich ccg 2018 2021',
      activityId: 'prescribing-pharmacist',
    },
    {
      title: 'Community Pharmacist',
      sub: 'Boots UK \u00b7 2016\u20132018',
      keywords: 'community pharmacist boots uk 2016 2018',
      activityId: 'community-pharmacist',
    },
  ]

  experienceEntries.forEach((entry, i) => {
    items.push({
      id: `exp-${i}`,
      title: entry.title,
      subtitle: entry.sub,
      section: 'Experience',
      iconVariant: 'teal',
      iconType: 'role',
      keywords: entry.keywords,
      action: { type: 'expand', tileId: 'career-activity', itemId: entry.activityId },
    })
  })

  // Core Skills — all ~21 skills from skills.ts, opening detail panel on select
  skills.forEach((skill) => {
    items.push({
      id: `skill-${skill.id}`,
      title: `${skill.name} \u2014 ${skill.proficiency}%`,
      subtitle: `${skill.frequency} \u00b7 Since ${skill.startYear} \u00b7 ${skill.category}`,
      section: 'Core Skills',
      iconVariant: 'green',
      iconType: 'skill',
      keywords: `${skill.name.toLowerCase()} ${skill.proficiency} ${skill.frequency.toLowerCase()} ${skill.category.toLowerCase()}`,
      action: { type: 'panel', panelContent: { type: 'skill', skill } },
    })
  })

  // Active Projects — matching concept HTML entries
  const projectEntries: Array<{ name: string; sub: string; keywords: string; investigationId: string }> = [
    {
      name: '\u00a3220M Prescribing Budget',
      sub: 'Budget oversight & analytical accountability \u00b7 2024',
      keywords: '220m prescribing budget oversight analytical accountability 2024',
      investigationId: 'inv-pharmetrics',
    },
    {
      name: 'SQL Analytics Transformation',
      sub: 'Legacy migration to modern data stack \u00b7 2025',
      keywords: 'sql analytics transformation legacy migration modern data stack 2025',
      investigationId: 'inv-switching-algorithm',
    },
    {
      name: 'Team Data Literacy Programme',
      sub: 'Upskilling 30+ non-technical staff \u00b7 2024',
      keywords: 'team data literacy programme upskilling non-technical staff 2024 training',
      investigationId: 'inv-blueteq-gen',
    },
  ]

  projectEntries.forEach((entry) => {
    const investigation = investigations.find(inv => inv.id === entry.investigationId)
    items.push({
      id: `proj-${entry.investigationId}`,
      title: entry.name,
      subtitle: entry.sub,
      section: 'Active Projects',
      iconVariant: 'amber',
      iconType: 'project',
      keywords: entry.keywords,
      action: investigation
        ? { type: 'panel', panelContent: { type: 'project', investigation } }
        : { type: 'scroll', tileId: 'projects' },
    })
  })

  // Achievements — open corresponding KPI detail panel
  const achievementEntries: Array<{ title: string; sub: string; keywords: string; kpiId: string }> = [
    {
      title: '\u00a314.6M Efficiency Savings Identified',
      sub: 'Data-driven prescribing interventions',
      keywords: '14.6m efficiency savings identified data-driven prescribing interventions money cost',
      kpiId: 'savings',
    },
    {
      title: '\u00a3220M Budget Oversight',
      sub: 'Full analytical accountability to ICB board',
      keywords: '220m budget oversight analytical accountability icb board',
      kpiId: 'budget',
    },
    {
      title: 'Power BI Dashboards for 200+ Users',
      sub: 'Clinicians & commissioners across ICB',
      keywords: 'power bi dashboards 200 users clinicians commissioners',
      kpiId: 'years',
    },
    {
      title: '1.2M Population Served',
      sub: 'Norfolk & Waveney Integrated Care System',
      keywords: '1.2m population served norfolk waveney ics integrated care system',
      kpiId: 'population',
    },
  ]

  achievementEntries.forEach((entry, i) => {
    const kpi = kpis.find(k => k.id === entry.kpiId)
    items.push({
      id: `ach-${i}`,
      title: entry.title,
      subtitle: entry.sub,
      section: 'Achievements',
      iconVariant: 'amber',
      iconType: 'achievement',
      keywords: entry.keywords,
      action: kpi
        ? { type: 'panel', panelContent: { type: 'kpi', kpi } }
        : { type: 'scroll', tileId: 'latest-results' },
    })
  })

  // Education — matching concept HTML entries
  const educationEntries: Array<{ title: string; sub: string; keywords: string }> = [
    {
      title: 'MPharm (Hons) \u2014 2:1',
      sub: 'University of East Anglia \u00b7 2011\u20132015',
      keywords: 'mpharm hons 2:1 university east anglia uea 2011 2015 pharmacy degree',
    },
    {
      title: 'GPhC Registration',
      sub: 'General Pharmaceutical Council \u00b7 August 2016',
      keywords: 'gphc registration general pharmaceutical council 2016 registered',
    },
    {
      title: 'Power BI Data Analyst Associate',
      sub: 'Microsoft Certified \u00b7 2023',
      keywords: 'power bi data analyst associate microsoft certified 2023 certification',
    },
    {
      title: 'Clinical Pharmacy Diploma',
      sub: 'Professional development \u00b7 2019',
      keywords: 'clinical pharmacy diploma professional development 2019',
    },
  ]

  educationEntries.forEach((entry, i) => {
    items.push({
      id: `edu-${i}`,
      title: entry.title,
      subtitle: entry.sub,
      section: 'Education',
      iconVariant: 'purple',
      iconType: 'edu',
      keywords: entry.keywords,
      action: { type: 'scroll', tileId: 'education' },
    })
  })

  // Quick Actions
  const quickActions: Array<{ title: string; sub: string; keywords: string; action: PaletteAction }> = [
    {
      title: 'Download CV',
      sub: 'Export as PDF',
      keywords: 'download cv export pdf resume',
      action: { type: 'download' },
    },
    {
      title: 'Send Email',
      sub: 'andy@charlwood.xyz',
      keywords: 'send email contact andy charlwood',
      action: { type: 'link', url: 'mailto:andy@charlwood.xyz' },
    },
    {
      title: 'View LinkedIn',
      sub: 'Professional profile',
      keywords: 'view linkedin professional profile social',
      action: { type: 'link', url: 'https://linkedin.com/in/andycharlwood' },
    },
    {
      title: 'View Projects',
      sub: 'GitHub & portfolio',
      keywords: 'view projects github portfolio code repositories',
      action: { type: 'link', url: 'https://github.com/andycharlwood' },
    },
  ]

  quickActions.forEach((entry, i) => {
    items.push({
      id: `action-${i}`,
      title: entry.title,
      subtitle: entry.sub,
      section: 'Quick Actions',
      iconVariant: 'teal',
      iconType: 'action',
      keywords: entry.keywords,
      action: entry.action,
    })
  })

  return items
}

// Build a fuse.js search index from palette items
export function buildSearchIndex(items: PaletteItem[]): Fuse<PaletteItem> {
  return new Fuse(items, {
    keys: [
      { name: 'title', weight: 2 },
      { name: 'subtitle', weight: 1 },
      { name: 'keywords', weight: 1.5 },
    ],
    threshold: 0.3,
    includeScore: true,
    minMatchCharLength: 2,
  })
}

// Section ordering for grouped display
const SECTION_ORDER: PaletteSection[] = [
  'Experience',
  'Core Skills',
  'Active Projects',
  'Achievements',
  'Education',
  'Quick Actions',
]

// Group palette items by section, maintaining defined order
export function groupBySection(items: PaletteItem[]): Array<{ section: PaletteSection; items: PaletteItem[] }> {
  const groups = new Map<PaletteSection, PaletteItem[]>()

  for (const item of items) {
    const existing = groups.get(item.section)
    if (existing) {
      existing.push(item)
    } else {
      groups.set(item.section, [item])
    }
  }

  return SECTION_ORDER
    .filter(section => groups.has(section))
    .map(section => ({ section, items: groups.get(section)! }))
}

// ===== LEGACY EXPORTS =====
// Used by ClinicalSidebar.tsx (old component, will be removed in Task 21)

export interface SearchResult {
  id: string
  title: string
  section: ViewId
  sectionLabel: string
  highlight: string
  score?: number
}

/** @deprecated Use buildPaletteData() + buildSearchIndex() instead */
export function buildLegacySearchIndex(): Fuse<SearchResult> {
  const searchableItems: SearchResult[] = []

  consultations.forEach(c => {
    searchableItems.push({ id: c.id, title: c.role, section: 'consultations', sectionLabel: 'Experience', highlight: `${c.role} at ${c.organization} — ${c.history}` })
  })
  medications.forEach(m => {
    searchableItems.push({ id: m.id, title: m.name, section: 'medications', sectionLabel: 'Skills', highlight: `${m.name} — ${m.frequency} use since ${m.startYear}` })
  })
  problems.forEach(p => {
    searchableItems.push({ id: p.id, title: p.description, section: 'problems', sectionLabel: 'Achievements', highlight: `[${p.code}] ${p.description} — ${p.narrative}` })
  })
  investigations.forEach(inv => {
    searchableItems.push({ id: inv.id, title: inv.name, section: 'investigations', sectionLabel: 'Projects', highlight: `${inv.name} — ${inv.methodology}` })
  })
  documents.forEach(doc => {
    searchableItems.push({ id: doc.id, title: doc.title, section: 'documents', sectionLabel: 'Education', highlight: `${doc.title} from ${doc.source} (${doc.date})` })
  })

  return new Fuse(searchableItems, {
    keys: [
      { name: 'title', weight: 2 },
      { name: 'highlight', weight: 1 },
    ],
    threshold: 0.3,
    includeScore: true,
    minMatchCharLength: 2,
  })
}

/** @deprecated Use groupBySection() instead */
export function groupResultsBySection(results: FuseResult<SearchResult>[]): Map<string, FuseResult<SearchResult>[]> {
  const grouped = new Map<string, FuseResult<SearchResult>[]>()
  results.forEach(result => {
    const sectionLabel = result.item.sectionLabel
    if (!grouped.has(sectionLabel)) {
      grouped.set(sectionLabel, [])
    }
    grouped.get(sectionLabel)!.push(result)
  })
  return grouped
}
