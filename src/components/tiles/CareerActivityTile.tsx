import React from 'react'
import { Card, CardHeader } from '../Card'
import { documents } from '@/data/documents'

type ActivityType = 'role' | 'project' | 'cert' | 'edu'

interface ActivityEntry {
  id: string
  type: ActivityType
  title: string
  meta: string
  date: string
  sortYear: number
}

/**
 * Build timeline from multiple data sources
 * Matches the concept HTML entries exactly
 */
function buildTimeline(): ActivityEntry[] {
  const entries: ActivityEntry[] = []

  // Roles from consultations
  // Entry 1: Interim Head (2024-2025)
  entries.push({
    id: 'interim-head-2025',
    type: 'role',
    title: 'Interim Head, Population Health & Data Analysis',
    meta: 'NHS Norfolk & Waveney ICB',
    date: '2024 – 2025',
    sortYear: 2024,
  })

  // Entry 3: Senior Data Analyst (2021-2024) - concept calls this "Senior Data Analyst — Medicines Optimisation"
  entries.push({
    id: 'deputy-head-2024',
    type: 'role',
    title: 'Senior Data Analyst — Medicines Optimisation',
    meta: 'NHS Norfolk & Waveney ICB',
    date: '2021 – 2024',
    sortYear: 2021,
  })

  // Entry 6: Prescribing Data Pharmacist (2018-2021)
  entries.push({
    id: 'high-cost-drugs-2022',
    type: 'role',
    title: 'Prescribing Data Pharmacist',
    meta: 'NHS Norwich CCG',
    date: '2018 – 2021',
    sortYear: 2018,
  })

  // Entry 8: Community Pharmacist (2016-2018) - from Tesco roles
  entries.push({
    id: 'pharmacy-manager-2017',
    type: 'role',
    title: 'Community Pharmacist',
    meta: 'Boots UK',
    date: '2016 – 2018',
    sortYear: 2016,
  })

  // Projects from investigations
  // Entry 2: £220M Prescribing Budget Oversight (2024)
  entries.push({
    id: 'inv-budget',
    type: 'project',
    title: '£220M Prescribing Budget Oversight',
    meta: 'Lead analyst & budget owner',
    date: '2024',
    sortYear: 2024,
  })

  // Entry 4: SQL Analytics Transformation (2025)
  entries.push({
    id: 'inv-sql-transform',
    type: 'project',
    title: 'SQL Analytics Transformation',
    meta: 'Legacy migration project lead',
    date: '2025',
    sortYear: 2025,
  })

  // Certifications from documents
  // Entry 5: Power BI Data Analyst Associate (2023)
  entries.push({
    id: 'cert-powerbi',
    type: 'cert',
    title: 'Power BI Data Analyst Associate',
    meta: 'Microsoft Certified',
    date: '2023',
    sortYear: 2023,
  })

  // Entry 7: Clinical Pharmacy Diploma (2019)
  entries.push({
    id: 'cert-diploma',
    type: 'cert',
    title: 'Clinical Pharmacy Diploma',
    meta: 'Professional development',
    date: '2019',
    sortYear: 2019,
  })

  // Entry 10: GPhC Registration (2016)
  entries.push({
    id: 'doc-gphc',
    type: 'cert',
    title: 'GPhC Registration',
    meta: 'General Pharmaceutical Council',
    date: 'August 2016',
    sortYear: 2016,
  })

  // Education from documents
  // Entry 9: MPharm (2011-2015)
  const mpharm = documents.find((d) => d.id === 'doc-mpharm')
  if (mpharm) {
    entries.push({
      id: mpharm.id,
      type: 'edu',
      title: 'MPharm (Hons) — 2:1',
      meta: 'University of East Anglia',
      date: '2011 – 2015',
      sortYear: 2011,
    })
  }

  // Sort newest-first by sortYear (descending), then by entry order for same year
  return entries.sort((a, b) => {
    if (b.sortYear !== a.sortYear) return b.sortYear - a.sortYear
    // For same year, preserve insertion order (stable sort)
    return 0
  })
}

const dotColorMap: Record<ActivityType, string> = {
  role: '#0D6E6E', // teal (--accent)
  project: '#D97706', // amber
  cert: '#059669', // green (--success)
  edu: '#7C3AED', // purple
}

interface ActivityItemProps {
  entry: ActivityEntry
}

const ActivityItem: React.FC<ActivityItemProps> = ({ entry }) => {
  const dotColor = dotColorMap[entry.type]

  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        padding: '10px 12px',
        background: 'var(--bg-dashboard)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-light)',
        fontSize: '12px',
        transition: 'border-color 0.15s',
        cursor: 'default',
      }}
    >
      {/* Dot */}
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: dotColor,
          flexShrink: 0,
          marginTop: '2px', // align with text baseline
        }}
      />

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 600,
            color: 'var(--text-primary)',
            lineHeight: 1.3,
          }}
        >
          {entry.title}
        </div>
        <div
          style={{
            fontSize: '11px',
            color: 'var(--text-secondary)',
            marginTop: '2px',
          }}
        >
          {entry.meta}
        </div>
        <div
          style={{
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-tertiary)',
            marginTop: '3px',
          }}
        >
          {entry.date}
        </div>
      </div>
    </div>
  )
}

export const CareerActivityTile: React.FC = () => {
  const timeline = buildTimeline()

  return (
    <Card full>
      <CardHeader dotColor="teal" title="CAREER ACTIVITY" rightText="Full timeline" />

      {/* Activity grid - 2 columns on desktop, 1 on mobile */}
      <div className="activity-grid">
        {timeline.map((entry) => (
          <ActivityItem key={entry.id} entry={entry} />
        ))}
      </div>
    </Card>
  )
}
