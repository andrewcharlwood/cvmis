import Fuse from 'fuse.js'

import { documents } from '@/data/documents'
import { investigations } from '@/data/investigations'
import { skills } from '@/data/skills'
import { kpis } from '@/data/kpis'
import { timelineConsultations } from '@/data/timeline'
import {
  getAchievementEntries,
  getEducationEntries,
  getSearchQuickActions,
} from '@/lib/profile-content'
import type { DetailPanelContent } from '@/types/pmr'

export type PaletteSection = 'Experience' | 'Core Skills' | 'Significant Interventions' | 'Achievements' | 'Education' | 'Quick Actions'

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
  timelineConsultations.forEach((c) => {
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

  // Significant Interventions — all 5 investigations from investigations.ts
  investigations.forEach((inv) => {
    items.push({
      id: `proj-${inv.id}`,
      title: inv.name,
      subtitle: `${inv.methodology.split('.')[0]} \u00b7 ${inv.requestedYear}`,
      section: 'Significant Interventions',
      iconVariant: 'amber',
      iconType: 'project',
      keywords: `${inv.name.toLowerCase()} ${inv.methodology.toLowerCase()} ${inv.techStack.join(' ').toLowerCase()} ${inv.requestedYear}`,
      action: { type: 'panel', panelContent: { type: 'project', investigation: inv } },
    })
  })

  // Achievements — open corresponding KPI detail panel
  getAchievementEntries().forEach((entry, i) => {
    const kpi = kpis.find(k => k.id === entry.kpiId)
    items.push({
      id: `ach-${i}`,
      title: entry.title,
      subtitle: entry.subtitle,
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
  getEducationEntries().forEach((entry, i) => {
    items.push({
      id: `edu-${i}`,
      title: entry.title,
      subtitle: entry.subtitle,
      section: 'Education',
      iconVariant: 'purple',
      iconType: 'edu',
      keywords: entry.keywords,
      action: { type: 'scroll', tileId: 'patient-pathway' },
    })
  })

  // Quick Actions
  getSearchQuickActions().forEach((entry, i) => {
    const action: PaletteAction = entry.type === 'download'
      ? { type: 'download' }
      : { type: 'link', url: entry.url }

    items.push({
      id: `action-${i}`,
      title: entry.title,
      subtitle: entry.subtitle,
      section: 'Quick Actions',
      iconVariant: 'teal',
      iconType: 'action',
      keywords: entry.keywords,
      action,
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
  'Significant Interventions',
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

  // Consultations (Experience) — enriched with plan outcomes, employer classification, clinical specialties
  timelineConsultations.forEach((c) => {
    const isNHS = c.organization.includes('NHS') || c.organization.includes('ICB')
    const employer = isNHS
      ? `NHS employer: ${c.organization}`
      : `Private sector employer: ${c.organization} (not NHS)`
    const examBullets = c.examination.join('. ')
    const planOutcomes = c.plan.join('. ')
    const codedDescriptions = c.codedEntries.map(e => e.description).join('. ')

    // Role-specific enrichment for clinical specialties and methodology
    let roleContext = ''
    if (c.id === 'high-cost-drugs-2022') {
      roleContext = ' Clinical specialties covered: rheumatology, ophthalmology (wet AMD, DMO, RVO), dermatology, gastroenterology, neurology, and migraine. Wrote most of the system\'s high-cost drug pathways, implementing NICE technology appraisals while balancing legal requirements against financial costs and local clinical preferences.'
    } else if (c.id === 'deputy-head-2024') {
      roleContext = ' Created dm+d medicines data table integrating all dictionary of medicines and devices products with standardised strengths, morphine equivalents, and Anticholinergic Burden scoring — single source of truth for all medicines analytics. Supported tirzepatide commissioning (NICE TA1026) with financial projections and authored executive paper advocating primary care model, driving system shift to GP-led delivery.'
    } else if (c.id === 'interim-head-2025') {
      roleContext = ' Built Python switching algorithm using real-world GP prescribing data to identify patients eligible for cost-effective alternatives — compressed months of manual analysis into 3 days. Created novel GP payment system linking incentive rewards to prescribing savings.'
    } else if (c.id === 'pharmacy-manager-2017') {
      roleContext = ' Community pharmacy role at Tesco PLC, a private sector employer. Served as Local Pharmaceutical Committee (LPC) representative for Norfolk. Full HR responsibilities including recruitment, performance management, grievances.'
    }

    texts.push({
      id: `exp-${c.id}`,
      text: `${c.role} at ${c.organization}, ${c.duration}. ${employer}. ${c.history} Key achievements: ${examBullets}. Outcomes: ${planOutcomes}. ${codedDescriptions}.${roleContext}`,
    })
  })

  // Skills — enriched with role context and practical application
  const skillContextMap: Record<string, string> = {
    'data-analysis': 'Applied across NHS medicines optimisation, identifying £14.6M efficiency programme. Used for prescribing pattern analysis, budget forecasting, and population health analytics serving 1.2M people.',
    'python': 'Used to build switching algorithms (14,000 patients, £2.6M savings), controlled drug monitoring systems, Blueteq form automation, and Sankey chart visualisation tools. Self-taught.',
    'sql': 'Core tool for patient-level analytics, dm+d data integration, and transforming practice-level data to patient-level SQL analysis. Used across all NHS data roles.',
    'power-bi': 'Built PharMetrics interactive dashboard tracking £220M prescribing budget. Created dashboards used by 200+ clinicians and commissioners across Norfolk & Waveney ICB.',
    'javascript-typescript': 'Used for web development including this portfolio website. Built with React, TypeScript, and Vite.',
    'excel': 'Used for financial modelling, data validation, and ad-hoc analysis. Foundational tool across all roles from community pharmacy to NHS ICB.',
    'algorithm-design': 'Designed patient switching algorithm and automated incentive scheme analysis. Applied to real-world GP prescribing data at population scale.',
    'data-pipelines': 'Built automated data processing pipelines for medicines analytics, enabling self-serve models for team data fluency.',
    'medicines-optimisation': 'Core domain expertise spanning community pharmacy through to NHS ICB-level population health. Led efficiency programmes worth £14.6M+.',
    'population-health': 'Leading population health analytics for 1.2M people across Norfolk & Waveney ICS. Developing patient-level datasets from real-world GP prescribing data.',
    'nice-ta': 'Led NICE technology appraisal implementation across high-cost drug pathways. Covered rheumatology, ophthalmology, dermatology, gastroenterology, neurology, and migraine.',
    'health-economics': 'Financial modelling for DOAC switching programmes, tirzepatide commissioning, and pharmaceutical rebate negotiations.',
    'clinical-pathways': 'Wrote most of the Norfolk & Waveney ICB high-cost drug pathways. Created Sankey chart tool for patient pathway visualisation and trust compliance auditing.',
    'controlled-drugs': 'Built Python-based population-scale monitoring system calculating oral morphine equivalents (OME) across all opioid prescriptions. Enables high-risk patient identification and potential diversion detection.',
    'budget-management': 'Managed £220M NHS prescribing budget with sophisticated forecasting models, variance analysis, and monthly financial reporting to the ICB executive team.',
    'stakeholder-engagement': 'Presented to Chief Medical Officer bimonthly. Engaged with GP practices, trusts, commissioners, and pharmaceutical companies across the integrated care system.',
    'pharma-negotiation': 'Renegotiated pharmaceutical rebate terms ahead of patent expiry, securing improved commercial position for the ICB.',
    'team-development': 'Improved team data fluency through training and documentation. Supervised staff through NVQ3 to pharmacy technician registration. Created national induction training at Tesco.',
    'change-management': 'Completed NHS Mary Seacole Programme (2018, 78%). Led transformation to patient-level SQL analytics and self-serve analytical models.',
    'financial-modelling': 'Built interactive DOAC switching dashboard with rebate mechanics, workforce constraints, and patent expiry timelines. Financial projections for tirzepatide commissioning.',
    'executive-comms': 'Authored executive papers for ICB board including tirzepatide commissioning advocacy. Presented evidence-based recommendations to CMO bimonthly.',
  }

  skills.forEach((skill) => {
    const context = skillContextMap[skill.id] ?? ''
    texts.push({
      id: `skill-${skill.id}`,
      text: `${skill.name} is a ${skill.category.toLowerCase()} skill used ${skill.frequency.toLowerCase()}, with ${skill.proficiency}% proficiency and ${skill.yearsOfExperience} years of experience since ${skill.startYear}. ${context}`,
    })
  })

  // KPI-backed Achievements — enriched with full story context and outcomes
  getAchievementEntries().forEach((entry, index) => {
    const id = `ach-${index}`
    const kpi = kpis.find(k => k.id === entry.kpiId)
    const explanation = kpi?.explanation ?? ''
    const storyParts: string[] = []
    if (kpi?.story) {
      storyParts.push(kpi.story.context)
      storyParts.push(kpi.story.role)
      if (kpi.story.period) storyParts.push(`Period: ${kpi.story.period}.`)
      storyParts.push(`Outcomes: ${kpi.story.outcomes.join('. ')}.`)
    }
    texts.push({
      id,
      text: `Achievement: ${entry.title}. ${entry.subtitle}. ${explanation} ${storyParts.join(' ')}`,
    })
  })

  // Investigations (Significant Interventions) — enriched with role context and cross-references
  const projectContextMap: Record<string, string> = {
    'inv-pharmetrics': 'Built during Deputy Head role at NHS Norfolk & Waveney ICB. Provides self-serve analytics for budget holders across the integrated care system. Live at medicines.charlwood.xyz.',
    'inv-switching-algorithm': 'Built during Interim Head role at NHS Norfolk & Waveney ICB. Uses real-world GP prescribing data to auto-identify patients on expensive drugs suitable for cost-effective alternatives. Compressed months of manual analysis into 3 days. Includes novel GP payment system linking incentive rewards to prescribing savings.',
    'inv-blueteq-gen': 'Built during High-Cost Drugs & Interface Pharmacist role at NHS Norfolk & Waveney ICB. Automates prior approval form creation for high-cost drug pathways spanning rheumatology, ophthalmology, dermatology, gastroenterology, neurology, and migraine.',
    'inv-cd-monitoring': 'Built during Deputy Head role at NHS Norfolk & Waveney ICB. Calculates oral morphine equivalents (OME) across all opioid prescriptions at population scale. Enables previously impossible population-level controlled drug analysis. Related to controlled drugs skill.',
    'inv-sankey-tool': 'Built during High-Cost Drugs & Interface Pharmacist role at NHS Norfolk & Waveney ICB. Visualises patient journeys through high-cost drug pathways. Enables trust-level compliance auditing across multiple clinical specialties.',
  }

  investigations.forEach((inv) => {
    const techList = inv.techStack.join(', ')
    const resultList = inv.results.join('. ')
    const context = projectContextMap[inv.id] ?? ''
    texts.push({
      id: `proj-${inv.id}`,
      text: `Project: ${inv.name} (${inv.status}, ${inv.requestedYear}). ${inv.methodology} Tech stack: ${techList}. Results: ${resultList}. ${context}`,
    })
  })

  // Education — enriched with research grades and specific subject details
  const educationItems: Array<{ id: string; docId: string }> = [
    { id: 'edu-0', docId: 'doc-mary-seacole' },
    { id: 'edu-1', docId: 'doc-mpharm' },
    { id: 'edu-2', docId: 'doc-alevels' },
    { id: 'edu-3', docId: 'doc-gphc' },
  ]

  educationItems.forEach((entry, index) => {
    const fallback = getEducationEntries()[index]
    const doc = documents.find(d => d.id === entry.docId)
    if (doc) {
      const research = doc.researchDetail ? ` Research: ${doc.researchDetail}.` : ''
      const researchGrade = doc.researchGrade ? ` Research grade: ${doc.researchGrade}.` : ''
      const classification = doc.classification ? ` Classification: ${doc.classification}.` : ''
      texts.push({
        id: entry.id,
        text: `Education: ${doc.title}. ${doc.type} from ${doc.institution ?? doc.source}, ${doc.duration ?? doc.date}.${classification}${research}${researchGrade} ${doc.notes ?? ''}`,
      })
    } else {
      texts.push({
        id: entry.id,
        text: `Education: ${fallback?.title ?? ''}. ${fallback?.subtitle ?? ''}.`,
      })
    }
  })

  // Quick Actions
  getSearchQuickActions().forEach((entry, index) => {
    texts.push({
      id: `action-${index}`,
      text: `${entry.title}. ${entry.subtitle}.`,
    })
  })

  return texts
}
