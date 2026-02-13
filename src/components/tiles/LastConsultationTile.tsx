import React from 'react'
import { Card, CardHeader } from '../Card'
import { consultations } from '@/data/consultations'
import { useDetailPanel } from '@/contexts/DetailPanelContext'
import { ChevronRight } from 'lucide-react'

export const LastConsultationTile: React.FC = () => {
  const { openPanel } = useDetailPanel()

  // Use the most recent consultation (first in array)
  const consultation = consultations[0]

  const handleOpenPanel = () => {
    openPanel({ type: 'consultation', consultation })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleOpenPanel()
    }
  }

  // Format date to "May 2025" format
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  }

  // Extract employment type from duration string (e.g., "May 2025 — Nov 2025")
  const getEmploymentType = (): string => {
    // All ICB roles are Permanent · Full-time (from CV context)
    if (consultation.organization.includes('ICB')) {
      return 'Permanent · Full-time'
    }
    return 'Permanent'
  }

  // Extract band from role context - ICB senior roles are typically Band 8a
  const getBand = (): string => {
    if (consultation.role.includes('Head')) {
      return '8a'
    }
    return '—'
  }

  return (
    <Card full tileId="last-consultation">
      <CardHeader dotColor="green" title="LAST CONSULTATION" rightText="Most recent role" />

      {/* Header info row - clickable */}
      <div
        role="button"
        tabIndex={0}
        onClick={handleOpenPanel}
        onKeyDown={handleKeyDown}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '14px',
          paddingBottom: '14px',
          borderBottom: '1px solid var(--border-light)',
          cursor: 'pointer',
          borderRadius: 'var(--radius-sm)',
          padding: '8px',
          margin: '-8px -8px 14px -8px',
          transition: 'background-color 150ms ease-out',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(10,128,128,0.04)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
        aria-label={`View full details for ${consultation.role}`}
      >
        <div>
          <div
            style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-tertiary)',
              marginBottom: '3px',
            }}
          >
            Date
          </div>
          <div
            style={{
              fontSize: '11.5px',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            {formatDate(consultation.date)}
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-tertiary)',
              marginBottom: '3px',
            }}
          >
            Organisation
          </div>
          <div
            style={{
              fontSize: '11.5px',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            {consultation.organization}
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-tertiary)',
              marginBottom: '3px',
            }}
          >
            Type
          </div>
          <div
            style={{
              fontSize: '11.5px',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            {getEmploymentType()}
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-tertiary)',
              marginBottom: '3px',
            }}
          >
            Band
          </div>
          <div
            style={{
              fontSize: '11.5px',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            {getBand()}
          </div>
        </div>
      </div>

      {/* Role title */}
      <div
        style={{
          fontSize: '13.5px',
          fontWeight: 600,
          color: 'var(--accent)',
          marginBottom: '12px',
        }}
      >
        {consultation.role}
      </div>

      {/* Bullet list */}
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '7px',
          marginBottom: '16px',
        }}
      >
        {consultation.examination.map((bullet, index) => (
          <li
            key={index}
            style={{
              fontSize: '12.5px',
              color: 'var(--text-primary)',
              paddingLeft: '16px',
              lineHeight: '1.5',
              position: 'relative',
            }}
          >
            {/* Bullet dot */}
            <span
              style={{
                position: 'absolute',
                left: '0',
                top: '7px',
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent)',
                opacity: 0.5,
              }}
            />
            {bullet}
          </li>
        ))}
      </ul>

      {/* View full record button */}
      <button
        onClick={handleOpenPanel}
        onKeyDown={handleKeyDown}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          fontWeight: 500,
          color: 'var(--accent)',
          background: 'transparent',
          border: 'none',
          padding: '6px 0',
          cursor: 'pointer',
          transition: 'color 150ms ease-out',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--accent-hover)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--accent)'
        }}
        aria-label="View full consultation record"
      >
        <span>View full record</span>
        <ChevronRight size={14} strokeWidth={2.5} />
      </button>
    </Card>
  )
}
