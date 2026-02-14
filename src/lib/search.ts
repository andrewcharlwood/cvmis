import Fuse from 'fuse.js'

import { consultations } from '@/data/consultations'
import { investigations } from '@/data/investigations'
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

  // Experience — all 4 roles from consultations.ts, open detail panel on select
  consultations.forEach((c) => {
    items.push({
      id: `exp-${c.id}`,
      title: c.role,
      subtitle: `${c.organization} \u00b7 ${c.duration}`,
      section: 'Experience',
      iconVariant: 'teal',
      iconType: 'role',
      keywords: `${c.role.toLowerCase()} ${c.organization.toLowerCase()} ${c.duration.toLowerCase()}`,
      action: { type: 'panel', panelContent: { type: 'career-role', consultation: c } },
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

  // Active Projects — all 5 investigations from investigations.ts
  investigations.forEach((inv) => {
    items.push({
      id: `proj-${inv.id}`,
      title: inv.name,
      subtitle: `${inv.methodology.split('.')[0]} \u00b7 ${inv.requestedYear}`,
      section: 'Active Projects',
      iconVariant: 'amber',
      iconType: 'project',
      keywords: `${inv.name.toLowerCase()} ${inv.methodology.toLowerCase()} ${inv.techStack.join(' ').toLowerCase()} ${inv.requestedYear}`,
      action: { type: 'panel', panelContent: { type: 'project', investigation: inv } },
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
        : { type: 'scroll', tileId: 'patient-summary' },
    })
  })

  // Education — matching actual entries in EducationSubsection
  const educationEntries: Array<{ title: string; sub: string; keywords: string }> = [
    {
      title: 'NHS Leadership Academy \u2014 Mary Seacole Programme',
      sub: 'NHS Leadership Academy \u00b7 2018',
      keywords: 'nhs leadership academy mary seacole programme 2018 qualification management',
    },
    {
      title: 'MPharm (Hons) \u2014 2:1',
      sub: 'University of East Anglia \u00b7 2011\u20132015',
      keywords: 'mpharm hons 2:1 university east anglia uea 2011 2015 pharmacy degree',
    },
    {
      title: 'A-Levels',
      sub: 'Highworth Grammar School \u00b7 2009\u20132011',
      keywords: 'a-levels mathematics chemistry politics highworth grammar school 2009 2011',
    },
    {
      title: 'GPhC Registration',
      sub: 'General Pharmaceutical Council \u00b7 August 2016',
      keywords: 'gphc registration general pharmaceutical council 2016 registered pharmacist',
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
      action: { type: 'scroll', tileId: 'patient-pathway' },
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

