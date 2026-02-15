import Fuse from 'fuse.js'

import { consultations } from '@/data/consultations'
import { documents } from '@/data/documents'
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

// Build rich natural-language text representations for semantic embedding.
// IDs match PaletteItem IDs so embeddings can be correlated back to palette entries.
export function buildEmbeddingTexts(): Array<{ id: string; text: string }> {
  const texts: Array<{ id: string; text: string }> = []

  // Consultations (Experience)
  consultations.forEach((c) => {
    const examBullets = c.examination.join('. ')
    const codedDescriptions = c.codedEntries.map(e => e.description).join('. ')
    texts.push({
      id: `exp-${c.id}`,
      text: `${c.role} at ${c.organization}, ${c.duration}. ${c.history} Key achievements: ${examBullets}. ${codedDescriptions}.`,
    })
  })

  // Skills
  skills.forEach((skill) => {
    texts.push({
      id: `skill-${skill.id}`,
      text: `${skill.name} is a ${skill.category.toLowerCase()} skill used ${skill.frequency.toLowerCase()}, with ${skill.proficiency}% proficiency and ${skill.yearsOfExperience} years of experience since ${skill.startYear}.`,
    })
  })

  // KPI-backed Achievements
  const achievementMap: Array<{ id: string; title: string; subtitle: string; kpiId: string }> = [
    { id: 'ach-0', title: '£14.6M Efficiency Savings Identified', subtitle: 'Data-driven prescribing interventions', kpiId: 'savings' },
    { id: 'ach-1', title: '£220M Budget Oversight', subtitle: 'Full analytical accountability to ICB board', kpiId: 'budget' },
    { id: 'ach-2', title: 'Power BI Dashboards for 200+ Users', subtitle: 'Clinicians & commissioners across ICB', kpiId: 'years' },
    { id: 'ach-3', title: '1.2M Population Served', subtitle: 'Norfolk & Waveney Integrated Care System', kpiId: 'population' },
  ]

  achievementMap.forEach((entry) => {
    const kpi = kpis.find(k => k.id === entry.kpiId)
    const storyContext = kpi?.story
      ? ` ${kpi.story.context} ${kpi.story.role} Outcomes: ${kpi.story.outcomes.join('. ')}.`
      : ''
    texts.push({
      id: entry.id,
      text: `Achievement: ${entry.title}. ${entry.subtitle}. ${kpi?.explanation ?? ''}${storyContext}`,
    })
  })

  // Investigations (Active Projects)
  investigations.forEach((inv) => {
    const techList = inv.techStack.join(', ')
    const resultList = inv.results.join('. ')
    texts.push({
      id: `proj-${inv.id}`,
      text: `Project: ${inv.name}. ${inv.methodology} Tech stack: ${techList}. Results: ${resultList}.`,
    })
  })

  // Education
  const educationItems: Array<{ id: string; docId: string; fallbackTitle: string; fallbackSub: string }> = [
    { id: 'edu-0', docId: 'doc-mary-seacole', fallbackTitle: 'NHS Leadership Academy — Mary Seacole Programme', fallbackSub: 'NHS Leadership Academy · 2018' },
    { id: 'edu-1', docId: 'doc-mpharm', fallbackTitle: 'MPharm (Hons) — 2:1', fallbackSub: 'University of East Anglia · 2011–2015' },
    { id: 'edu-2', docId: 'doc-alevels', fallbackTitle: 'A-Levels', fallbackSub: 'Highworth Grammar School · 2009–2011' },
    { id: 'edu-3', docId: 'doc-gphc', fallbackTitle: 'GPhC Registration', fallbackSub: 'General Pharmaceutical Council · August 2016' },
  ]

  educationItems.forEach((entry) => {
    const doc = documents.find(d => d.id === entry.docId)
    if (doc) {
      const research = doc.researchDetail ? ` Research: ${doc.researchDetail}.` : ''
      const classification = doc.classification ? ` Classification: ${doc.classification}.` : ''
      texts.push({
        id: entry.id,
        text: `Education: ${doc.title}. ${doc.type} from ${doc.institution ?? doc.source}, ${doc.duration ?? doc.date}.${classification}${research} ${doc.notes ?? ''}`,
      })
    } else {
      texts.push({
        id: entry.id,
        text: `Education: ${entry.fallbackTitle}. ${entry.fallbackSub}.`,
      })
    }
  })

  // Quick Actions
  const quickActionTexts: Array<{ id: string; title: string; subtitle: string }> = [
    { id: 'action-0', title: 'Download CV', subtitle: 'Export as PDF' },
    { id: 'action-1', title: 'Send Email', subtitle: 'andy@charlwood.xyz' },
    { id: 'action-2', title: 'View LinkedIn', subtitle: 'Professional profile' },
    { id: 'action-3', title: 'View Projects', subtitle: 'GitHub & portfolio' },
  ]

  quickActionTexts.forEach((entry) => {
    texts.push({
      id: entry.id,
      text: `${entry.title}. ${entry.subtitle}.`,
    })
  })

  return texts
}

