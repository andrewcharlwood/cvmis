import React, { useState, useCallback } from 'react'
import { Card, CardHeader } from '../Card'
import { documents } from '@/data/documents'
import { consultations } from '@/data/consultations'
import { skills } from '@/data/skills'
import { useDetailPanel } from '@/contexts/DetailPanelContext'
import CareerConstellation from '../CareerConstellation'

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

  // Roles from consultations (matching CV_v4.md)
  entries.push({
    id: 'interim-head-2025',
    type: 'role',
    title: 'Interim Head, Population Health & Data Analysis',
    meta: 'NHS Norfolk & Waveney ICB',
    date: 'May – Nov 2025',
    sortYear: 2025,
    consultationId: 'interim-head-2025',
  })

  entries.push({
    id: 'deputy-head-2024',
    type: 'role',
    title: 'Deputy Head, Population Health & Data Analysis',
    meta: 'NHS Norfolk & Waveney ICB',
    date: 'Jul 2024 – Present',
    sortYear: 2024,
    consultationId: 'deputy-head-2024',
  })

  entries.push({
    id: 'high-cost-drugs-2022',
    type: 'role',
    title: 'High-Cost Drugs & Interface Pharmacist',
    meta: 'NHS Norfolk & Waveney ICB',
    date: 'May 2022 – Jul 2024',
    sortYear: 2022,
    consultationId: 'high-cost-drugs-2022',
  })

  entries.push({
    id: 'pharmacy-manager-2017',
    type: 'role',
    title: 'Pharmacy Manager',
    meta: 'Tesco PLC',
    date: 'Nov 2017 – May 2022',
    sortYear: 2017,
    consultationId: 'pharmacy-manager-2017',
  })

  // Certifications (matching CV_v4.md)
  entries.push({
    id: 'doc-gphc',
    type: 'cert',
    title: 'GPhC Registration',
    meta: 'General Pharmaceutical Council',
    date: 'August 2016',
    sortYear: 2016,
  })

  entries.push({
    id: 'cert-mary-seacole',
    type: 'cert',
    title: 'NHS Leadership Academy — Mary Seacole Programme',
    meta: 'NHS leadership qualification',
    date: '2018',
    sortYear: 2018,
  })

  // Education (matching CV_v4.md)
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

  entries.push({
    id: 'edu-alevels',
    type: 'edu',
    title: 'A-Levels: Mathematics (A*), Chemistry (B), Politics (C)',
    meta: 'Highworth Grammar School',
    date: '2009 – 2011',
    sortYear: 2009,
  })

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

  const handleRoleClick = useCallback(
    (roleId: string) => {
      const consultation = consultations.find((c) => c.id === roleId)
      if (consultation) {
        openPanel({ type: 'career-role', consultation })
      }
    },
    [openPanel],
  )

  const handleSkillClick = useCallback(
    (skillId: string) => {
      const skill = skills.find((s) => s.id === skillId)
      if (skill) {
        openPanel({ type: 'skill', skill })
      }
    },
    [openPanel],
  )

  const handleItemClick = useCallback(
    (entry: ActivityEntry) => {
      if (entry.type === 'role' && entry.consultationId) {
        handleRoleClick(entry.consultationId)
      }
    },
    [handleRoleClick],
  )

  return (
    <Card full tileId="career-activity">
      <CardHeader dotColor="teal" title="CAREER ACTIVITY" rightText="Full timeline" />

      <div style={{ marginBottom: '20px' }}>
        <CareerConstellation
          onRoleClick={handleRoleClick}
          onSkillClick={handleSkillClick}
        />
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
