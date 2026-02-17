import { useState, useCallback } from 'react'
import { ChevronRight } from 'lucide-react'
import { CardHeader } from './Card'
import { ExpandableCardShell } from './ExpandableCardShell'
import { timelineConsultations } from '@/data/timeline'
import { useDetailPanel } from '@/contexts/DetailPanelContext'
import { hexToRgba } from '@/lib/utils'
import { DEFAULT_ORG_COLOR } from '@/lib/theme-colors'

interface RoleItemProps {
  consultation: typeof timelineConsultations[0]
  isExpanded: boolean
  isHighlightedFromGraph: boolean
  onToggle: () => void
  onViewFull: () => void
  onHighlight?: (id: string | null) => void
}

function RoleItem({ consultation, isExpanded, isHighlightedFromGraph, onToggle, onViewFull, onHighlight }: RoleItemProps) {
  const orgColor = consultation.orgColor ?? DEFAULT_ORG_COLOR

  return (
    <ExpandableCardShell
      isExpanded={isExpanded}
      isHighlighted={isHighlightedFromGraph}
      accentColor={orgColor}
      onToggle={onToggle}
      ariaLabel={`${consultation.role} at ${consultation.organization}, ${consultation.duration}. Click to ${isExpanded ? 'collapse' : 'expand'} details.`}
      headerPadding="12px 14px"
      onMouseEnter={() => onHighlight?.(consultation.id)}
      onMouseLeave={() => onHighlight?.(null)}
      renderHeader={() => (
        <>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              lineHeight: 1.3,
            }}
          >
            {consultation.role}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              marginTop: '2px',
            }}
          >
            {consultation.organization}
          </div>
          <div
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-geist-mono)',
              color: 'var(--text-tertiary)',
              marginTop: '3px',
            }}
          >
            {consultation.duration}
          </div>
        </>
      )}
      renderBody={() => (
        <>
          {/* Examination bullets */}
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
            {consultation.examination.map((bullet, i) => (
              <li
                key={i}
                style={{
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  lineHeight: 1.5,
                  paddingLeft: '12px',
                  position: 'relative',
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '6px',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: consultation.orgColor ?? 'var(--accent)',
                    opacity: 0.5,
                  }}
                />
                {bullet}
              </li>
            ))}
          </ul>

          {/* Coded entries */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              marginBottom: '10px',
            }}
          >
            {consultation.codedEntries.map((entry) => (
              <span
                key={entry.code}
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-geist-mono)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  background: hexToRgba(orgColor, 0.08),
                  color: consultation.orgColor ?? 'var(--accent)',
                  border: `1px solid ${hexToRgba(orgColor, 0.2)}`,
                }}
              >
                {entry.code}: {entry.description}
              </span>
            ))}
          </div>

          {/* View full record link */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onViewFull()
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              fontWeight: 500,
              color: consultation.orgColor ?? 'var(--accent)',
              background: 'transparent',
              border: 'none',
              padding: '4px 0',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.7'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1'
            }}
          >
            View full record
            <ChevronRight size={12} />
          </button>
        </>
      )}
    />
  )
}

interface WorkExperienceSubsectionProps {
  onNodeHighlight?: (id: string | null) => void
  highlightedRoleId?: string | null
}

export function WorkExperienceSubsection({ onNodeHighlight, highlightedRoleId }: WorkExperienceSubsectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { openPanel } = useDetailPanel()

  const handleToggle = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }, [])

  const handleViewFull = useCallback(
    (consultation: typeof timelineConsultations[0]) => {
      openPanel({ type: 'career-role', consultation })
    },
    [openPanel],
  )

  return (
    <div>
      <CardHeader dotColor="teal" title="WORK EXPERIENCE" rightText={`${timelineConsultations.length} roles`} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {timelineConsultations.map((c) => (
          <RoleItem
            key={c.id}
            consultation={c}
            isExpanded={expandedId === c.id}
            isHighlightedFromGraph={highlightedRoleId === c.id}
            onToggle={() => handleToggle(c.id)}
            onViewFull={() => handleViewFull(c)}
            onHighlight={onNodeHighlight}
          />
        ))}
      </div>
    </div>
  )
}
