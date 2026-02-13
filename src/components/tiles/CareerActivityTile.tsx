import React, { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Card, CardHeader } from '../Card'
import { documents } from '@/data/documents'
import { consultations } from '@/data/consultations'

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

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

const borderColorMap: Record<ActivityType, string> = {
  role: '#0D6E6E',
  project: '#D97706',
  cert: '#059669',
  edu: '#7C3AED',
}

interface ActivityItemProps {
  entry: ActivityEntry
  isExpanded: boolean
  onToggle: () => void
}

const ActivityItem: React.FC<ActivityItemProps> = ({ entry, isExpanded, onToggle }) => {
  const dotColor = dotColorMap[entry.type]
  const isExpandable = entry.type === 'role' && entry.consultationId

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isExpandable) return
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onToggle()
      } else if (e.key === 'Escape' && isExpanded) {
        e.preventDefault()
        onToggle()
      }
    },
    [isExpandable, isExpanded, onToggle],
  )

  // Get consultation data for expanded content
  const consultation = isExpandable
    ? consultations.find((c) => c.id === entry.consultationId)
    : null

  return (
    <div
      role={isExpandable ? 'button' : undefined}
      tabIndex={isExpandable ? 0 : undefined}
      aria-expanded={isExpandable ? isExpanded : undefined}
      onClick={isExpandable ? onToggle : undefined}
      onKeyDown={isExpandable ? handleKeyDown : undefined}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-dashboard)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-light)',
        fontSize: '12px',
        transition: 'border-color 0.15s',
        cursor: isExpandable ? 'pointer' : 'default',
        ...(isExpanded && {
          borderColor: 'var(--accent-border)',
        }),
      }}
      onMouseEnter={(e) => {
        if (isExpandable) {
          e.currentTarget.style.borderColor = 'var(--accent-border)'
        }
      }}
      onMouseLeave={(e) => {
        if (isExpandable && !isExpanded) {
          e.currentTarget.style.borderColor = 'var(--border-light)'
        }
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
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {isExpanded && consultation && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.2, ease: 'easeOut' }
            }
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                borderLeft: `2px solid ${borderColorMap[entry.type]}`,
                marginLeft: '16px',
                marginRight: '12px',
                marginBottom: '12px',
                paddingLeft: '14px',
                paddingTop: '4px',
              }}
            >
              {/* Role title */}
              <div
                style={{
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: 'var(--accent)',
                  marginBottom: '8px',
                }}
              >
                {consultation.role}
              </div>

              {/* Achievement bullets */}
              {consultation.examination.length > 0 && (
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '0 0 10px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                  }}
                >
                  {consultation.examination.map((item, i) => (
                    <li
                      key={i}
                      style={{
                        display: 'flex',
                        gap: '8px',
                        fontSize: '11.5px',
                        color: 'var(--text-primary)',
                        lineHeight: 1.45,
                      }}
                    >
                      <span
                        style={{
                          color: 'var(--accent)',
                          opacity: 0.5,
                          flexShrink: 0,
                          marginTop: '1px',
                        }}
                      >
                        •
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {/* Coded entries */}
              {consultation.codedEntries && consultation.codedEntries.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    marginTop: '4px',
                  }}
                >
                  {consultation.codedEntries.map((entry) => (
                    <span
                      key={entry.code}
                      style={{
                        fontSize: '10px',
                        fontFamily: 'var(--font-mono)',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        background: 'var(--accent-light)',
                        color: 'var(--accent)',
                        border: '1px solid var(--accent-border)',
                      }}
                    >
                      {entry.code}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export const CareerActivityTile: React.FC = () => {
  const timeline = buildTimeline()
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null)

  const handleToggle = useCallback(
    (id: string) => {
      setExpandedItemId((prev) => (prev === id ? null : id))
    },
    [],
  )

  return (
    <Card full tileId="career-activity">
      <CardHeader dotColor="teal" title="CAREER ACTIVITY" rightText="Full timeline" />

      <div className="activity-grid">
        {timeline.map((entry) => (
          <ActivityItem
            key={entry.id}
            entry={entry}
            isExpanded={expandedItemId === entry.id}
            onToggle={() => handleToggle(entry.id)}
          />
        ))}
      </div>
    </Card>
  )
}
