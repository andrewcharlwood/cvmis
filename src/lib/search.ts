import Fuse, { type FuseResult } from 'fuse.js'
import type { ViewId } from '@/types/pmr'

// Import all data sources
import { consultations } from '@/data/consultations'
import { medications } from '@/data/medications'
import { problems } from '@/data/problems'
import { investigations } from '@/data/investigations'
import { documents } from '@/data/documents'

export interface SearchResult {
  id: string
  title: string
  section: ViewId
  sectionLabel: string
  highlight: string
  score?: number
}

// Build a unified search index from all PMR content
export function buildSearchIndex(): Fuse<SearchResult> {
  const searchableItems: SearchResult[] = []

  // Index consultations (Experience)
  consultations.forEach(consultation => {
    searchableItems.push({
      id: consultation.id,
      title: consultation.role,
      section: 'consultations',
      sectionLabel: 'Experience',
      highlight: `${consultation.role} at ${consultation.organization} — ${consultation.history}`,
    })
  })

  // Index medications (Skills)
  medications.forEach(medication => {
    searchableItems.push({
      id: medication.id,
      title: medication.name,
      section: 'medications',
      sectionLabel: 'Skills',
      highlight: `${medication.name} — ${medication.frequency} use since ${medication.startYear}`,
    })
  })

  // Index problems (Achievements)
  problems.forEach(problem => {
    searchableItems.push({
      id: problem.id,
      title: problem.description,
      section: 'problems',
      sectionLabel: 'Achievements',
      highlight: `[${problem.code}] ${problem.description} — ${problem.narrative}`,
    })
  })

  // Index investigations (Projects)
  investigations.forEach(investigation => {
    searchableItems.push({
      id: investigation.id,
      title: investigation.name,
      section: 'investigations',
      sectionLabel: 'Projects',
      highlight: `${investigation.name} — ${investigation.methodology}`,
    })
  })

  // Index documents (Education)
  documents.forEach(document => {
    searchableItems.push({
      id: document.id,
      title: document.title,
      section: 'documents',
      sectionLabel: 'Education',
      highlight: `${document.title} from ${document.source} (${document.date})`,
    })
  })

  // Fuse.js configuration for fuzzy search
  const fuseOptions = {
    keys: [
      { name: 'title', weight: 2 }, // Primary match on title
      { name: 'highlight', weight: 1 }, // Secondary match on full text
    ],
    threshold: 0.3, // 0 = exact match, 1 = match anything
    includeScore: true,
    minMatchCharLength: 2,
  }

  return new Fuse(searchableItems, fuseOptions)
}

// Group search results by section
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
