import React from 'react'
import { ChevronRight } from 'lucide-react'
import { CardHeader } from './Card'
import { useDetailPanel } from '@/contexts/DetailPanelContext'
import { timelineConsultations } from '@/data/timeline'
import { hexToRgba } from '@/lib/utils'
import { DEFAULT_ORG_COLOR } from '@/lib/theme-colors'

interface LastConsultationCardProps {
  highlightedRoleId?: string | null
  focusRelatedIds?: Set<string> | null
}

export function LastConsultationCard({ highlightedRoleId, focusRelatedIds }: LastConsultationCardProps) {
  const { openPanel } = useDetailPanel()
  const consultation = timelineConsultations.find(c => c.isCurrent) ?? timelineConsultations[0]
  if (!consultation) {
    return null
  }
  const isHighlighted = highlightedRoleId === consultation.id
  const isDimmed = focusRelatedIds != null && !focusRelatedIds.has(consultation.id)

  const handleOpenPanel = () => {
    openPanel({ type: 'consultation', consultation })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleOpenPanel()
    }
  }

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  }

  const getEmploymentType = (): string => {
    if (consultation.organization.includes('ICB')) {
      return 'Permanent · Full-time'
    }
    return 'Permanent'
  }

  const getBand = (): string => {
    return consultation.band ?? '—'
  }

  const fieldLabelStyle: React.CSSProperties = {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'var(--text-tertiary)',
    marginBottom: '3px',
  }

  const fieldValueStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  }

  return (
    <div
      style={{
        marginTop: '24px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid',
        borderColor: isHighlighted ? hexToRgba(consultation.orgColor ?? DEFAULT_ORG_COLOR, 0.2) : 'transparent',
        background: isHighlighted ? hexToRgba(consultation.orgColor ?? DEFAULT_ORG_COLOR, 0.03) : 'transparent',
        transition: 'border-color 150ms ease-out, background-color 150ms ease-out, opacity 150ms ease-out',
        padding: '8px',
        margin: '-8px',
        opacity: isDimmed ? 0.25 : 1,
      }}
    >
      <CardHeader dotColor="green" title="LAST CONSULTATION" rightText="Current role" />

      <div
        role="button"
        tabIndex={0}
        onClick={handleOpenPanel}
        onKeyDown={handleKeyDown}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '10px',
          paddingBottom: '14px',
          borderBottom: '1px solid var(--border-light)',
          cursor: 'pointer',
          borderRadius: 'var(--radius-sm)',
          padding: '8px',
          margin: '-8px -8px 14px -8px',
          transition: 'background-color 150ms ease-out',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = hexToRgba(consultation.orgColor ?? DEFAULT_ORG_COLOR, 0.04)
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
        aria-label={`View full details for ${consultation.role}`}
      >
        <div>
          <div style={fieldLabelStyle}>Date</div>
          <div style={fieldValueStyle}>{formatDate(consultation.date)}</div>
        </div>
        <div>
          <div style={fieldLabelStyle}>Organisation</div>
          <div style={fieldValueStyle}>{consultation.organization}</div>
        </div>
        <div>
          <div style={fieldLabelStyle}>Type</div>
          <div style={fieldValueStyle}>{getEmploymentType()}</div>
        </div>
        <div>
          <div style={fieldLabelStyle}>Band</div>
          <div style={fieldValueStyle}>{getBand()}</div>
        </div>
      </div>

      <div
        style={{
          fontSize: '15px',
          fontWeight: 600,
          color: consultation.orgColor ?? 'var(--accent)',
          marginBottom: '4px',
        }}
      >
        {consultation.role}
      </div>

      <button
        onClick={handleOpenPanel}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          fontWeight: 500,
          color: consultation.orgColor ?? 'var(--accent)',
          background: 'transparent',
          border: 'none',
          padding: '6px 0',
          minHeight: '44px',
          cursor: 'pointer',
          transition: 'opacity 150ms ease-out',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.7'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1'
        }}
        aria-label="View full consultation record"
      >
        <span>View full record</span>
        <ChevronRight size={15} strokeWidth={2.5} />
      </button>
    </div>
  )
}
