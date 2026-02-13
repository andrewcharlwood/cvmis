import React, { useState, useCallback } from 'react'
import { Card, CardHeader } from '../Card'
import { documents } from '@/data/documents'
import { consultations } from '@/data/consultations'
import { useDetailPanel } from '@/contexts/DetailPanelContext'

type ActivityType = 'role' | 'project' | 'cert' | 'edu'

interface ActivityEntry {
  id: string
  type: ActivityType
  title: string
  meta: string
  date: string
  sortYear: number
  /** ID of the corresponding consultation in consultations.ts (role entries only) */
  consultationId?: string
}

/**
 * Build timeline from multiple data sources
 * Matches the concept HTML entries exactly
 */
function buildTimeline(): ActivityEntry[] {
  const entries: ActivityEntry[] = []

  // Roles from consultations
  entries.push({
    id: 'interim-head-2025',
    type: 'role',
    title: 'Interim Head, Population Health & Data Analysis',
    meta: 'NHS Norfolk & Waveney ICB',
    date: '2024 – 2025',
    sortYear: 2024,
    consultationId: 'interim-head-2025',
  })

  entries.push({
    id: 'deputy-head-2024',
    type: 'role',
    title: 'Senior Data Analyst — Medicines Optimisation',
    meta: 'NHS Norfolk & Waveney ICB',
    date: '2021 – 2024',
    sortYear: 2021,
    consultationId: 'deputy-head-2024',
  })

  entries.push({
    id: 'high-cost-drugs-2022',
    type: 'role',
    title: 'Prescribing Data Pharmacist',
    meta: 'NHS Norwich CCG',
    date: '2018 – 2021',
    sortYear: 2018,
    consultationId: 'pharmacy-manager-2017',
  })

  entries.push({
    id: 'community-pharmacist-2016',
    type: 'role',
    title: 'Community Pharmacist',
    meta: 'Boots UK',
    date: '2016 – 2018',
    sortYear: 2016,
    consultationId: 'duty-pharmacist-2016',
  })

  // Projects
  entries.push({
    id: 'inv-budget',
    type: 'project',
    title: '£220M Prescribing Budget Oversight',
    meta: 'Lead analyst & budget owner',
    date: '2024',
    sortYear: 2024,
  })

  entries.push({
    id: 'inv-sql-transform',
    type: 'project',
    title: 'SQL Analytics Transformation',
    meta: 'Legacy migration project lead',
    date: '2025',
    sortYear: 2025,
  })

  // Certifications
  entries.push({
    id: 'cert-powerbi',
    type: 'cert',
    title: 'Power BI Data Analyst Associate',
    meta: 'Microsoft Certified',
    date: '2023',
    sortYear: 2023,
  })

  entries.push({
    id: 'cert-diploma',
    type: 'cert',
    title: 'Clinical Pharmacy Diploma',
    meta: 'Professional development',
    date: '2019',
    sortYear: 2019,
  })

  entries.push({
    id: 'doc-gphc',
    type: 'cert',
    title: 'GPhC Registration',
    meta: 'General Pharmaceutical Council',
    date: 'August 2016',
    sortYear: 2016,
  })

  // Education
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

  return entries.sort((a, b) => {
    if (b.sortYear !== a.sortYear) return b.sortYear - a.sortYear
    return 0
  })
}

const dotColorMap: Record<ActivityType, string> = {
  role: '#0D6E6E',
  project: '#D97706',
  cert: '#059669',
  edu: '#7C3AED',
}

interface ActivityItemProps {
  entry: ActivityEntry
  onItemClick: () => void
}

const ActivityItem: React.FC<ActivityItemProps> = ({ entry, onItemClick }) => {
  const [isHovered, setIsHovered] = useState(false)
  const dotColor = dotColorMap[entry.type]
  const isClickable = entry.type === 'role' && entry.consultationId

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isClickable) return
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onItemClick()
      }
    },
    [isClickable, onItemClick],
  )

  // Get consultation data for preview text
  const consultation = isClickable
    ? consultations.find((c) => c.id === entry.consultationId)
    : null

  // Get preview text (first 1-2 lines from examination)
  const previewText =
    consultation && consultation.examination.length > 0
      ? consultation.examination[0]
      : null

  return (
    <div
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? onItemClick : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-dashboard)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-light)',
        fontSize: '12px',
        transition: 'all 0.15s ease-out',
        cursor: isClickable ? 'pointer' : 'default',
        transform: isHovered && isClickable ? 'translateY(-1px)' : 'none',
        boxShadow: isHovered && isClickable
          ? '0 2px 8px rgba(26,43,42,0.08)'
          : '0 1px 2px rgba(26,43,42,0.05)',
        borderColor: isHovered && isClickable ? 'var(--accent-border)' : 'var(--border-light)',
      }}
    >
      {/* Item header row */}
      <div style={{ display: 'flex', gap: '10px', padding: '10px 12px' }}>
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: dotColor,
            flexShrink: 0,
            marginTop: '2px',
          }}
          aria-hidden="true"
        />
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

          {/* Hover preview text for roles */}
          {isHovered && previewText && (
            <div
              style={{
                fontSize: '11px',
                color: 'var(--text-secondary)',
                marginTop: '6px',
                lineHeight: 1.4,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {previewText}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const CareerActivityTile: React.FC = () => {
  const timeline = buildTimeline()
  const { openPanel } = useDetailPanel()

  const handleItemClick = useCallback(
    (entry: ActivityEntry) => {
      if (entry.type === 'role' && entry.consultationId) {
        const consultation = consultations.find((c) => c.id === entry.consultationId)
        if (consultation) {
          openPanel({ type: 'career-role', consultation })
        }
      }
    },
    [openPanel],
  )

  return (
    <Card full tileId="career-activity">
      <CardHeader dotColor="teal" title="CAREER ACTIVITY" rightText="Full timeline" />

      {/* Placeholder for CareerConstellation component (to be added later) */}
      <div
        style={{
          minHeight: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-dashboard)',
          borderRadius: 'var(--radius-sm)',
          border: '1px dashed var(--border-light)',
          marginBottom: '20px',
          color: 'var(--text-tertiary)',
          fontSize: '12px',
          fontStyle: 'italic',
        }}
      >
        Career Constellation visualization (to be implemented)
      </div>

      <div className="activity-grid">
        {timeline.map((entry) => (
          <ActivityItem
            key={entry.id}
            entry={entry}
            onItemClick={() => handleItemClick(entry)}
          />
        ))}
      </div>
    </Card>
  )
}
