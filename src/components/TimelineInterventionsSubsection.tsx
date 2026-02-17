import { useMemo, useState, useCallback } from 'react'
import { ChevronRight } from 'lucide-react'
import { ExpandableCardShell } from './ExpandableCardShell'
import { useDetailPanel } from '@/contexts/DetailPanelContext'
import { timelineEntities, timelineConsultations } from '@/data/timeline'
import { getExperienceEducationUICopy } from '@/lib/profile-content'
import type { TimelineEntity } from '@/types/pmr'
import { hexToRgba } from '@/lib/utils'

interface TimelineInterventionItemProps {
  entity: TimelineEntity
  isExpanded: boolean
  isHighlightedFromGraph: boolean
  isDimmedByFocus: boolean
  isEducationAnchor: boolean
  onToggle: () => void
  onViewFull: () => void
  onHighlight?: (id: string | null) => void
}

function TimelineInterventionItem({
  entity,
  isExpanded,
  isHighlightedFromGraph,
  isDimmedByFocus,
  isEducationAnchor,
  onToggle,
  onViewFull,
  onHighlight,
}: TimelineInterventionItemProps) {
  const experienceEducationCopy = getExperienceEducationUICopy()
  const isEducation = entity.kind === 'education'
  const interventionLabel = isEducation ? experienceEducationCopy.educationLabel : experienceEducationCopy.employmentLabel

  return (
    <ExpandableCardShell
      isExpanded={isExpanded}
      isHighlighted={isHighlightedFromGraph}
      isDimmedByFocus={isDimmedByFocus}
      accentColor={entity.orgColor}
      onToggle={onToggle}
      ariaLabel={`${entity.title} at ${entity.organization}, ${entity.dateRange.display}. Click to ${isExpanded ? 'collapse' : 'expand'} details.`}
      headerPadding="8px 8px"
      className={isEducation ? 'timeline-intervention-item timeline-intervention-item--education' : 'timeline-intervention-item'}
      dataTileId={isEducationAnchor ? 'section-education' : undefined}
      onMouseEnter={() => onHighlight?.(entity.id)}
      onMouseLeave={() => onHighlight?.(null)}
      renderHeader={() => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span className={isEducation ? 'timeline-intervention-pill timeline-intervention-pill--education' : 'timeline-intervention-pill'}>
                {interventionLabel}
              </span>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  lineHeight: 1.3,
                }}
              >
                {entity.title}
              </div>
            </div>
            <div
              style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                marginTop: '2px',
              }}
            >
              {entity.organization}
              <span
                style={{
                  fontSize: '11px',
                  paddingLeft: '6px',
                  fontFamily: 'var(--font-geist-mono)',
                  color: 'var(--text-tertiary)',
                  marginTop: '3px',
                }}
              >
                {entity.dateRange.display}
              </span>
            </div>
          </div>
          {(entity.band || entity.employmentBasis) && (
            <div
              style={{
                display: 'flex',
                flexShrink: 0,
                alignItems: 'center',
                gap: '5px',
              }}
            >
              {entity.band && (
                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-geist-mono)',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    background: hexToRgba(entity.orgColor, 0.1),
                    color: entity.orgColor,
                    border: `1px solid ${hexToRgba(entity.orgColor, 0.25)}`,
                    lineHeight: 1.4,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Band {entity.band.toUpperCase()}
                </span>
              )}
              {entity.employmentBasis && (
                <span
                  title={entity.contextNote}
                  style={{
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    background: 'rgba(245, 158, 11, 0.1)',
                    color: '#b45309',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    cursor: 'default',
                    lineHeight: 1.4,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {entity.employmentBasis}
                </span>
              )}
            </div>
          )}
        </div>
      )}
      renderBody={() => (
        <>
          {entity.contextNote && (
            <div
              style={{
                fontSize: '12px',
                fontStyle: 'italic',
                color: 'var(--text-tertiary)',
                marginBottom: '10px',
              }}
            >
              {entity.contextNote}
            </div>
          )}
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
            {entity.details.map((detail, i) => (
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
                    background: entity.orgColor,
                    opacity: 0.5,
                  }}
                />
                {detail}
              </li>
            ))}
          </ul>

          {!!entity.codedEntries?.length && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                marginBottom: '10px',
              }}
            >
              {entity.codedEntries.map((entry) => (
                <span
                  key={entry.code}
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-geist-mono)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    background: hexToRgba(entity.orgColor, 0.08),
                    color: entity.orgColor,
                    border: `1px solid ${hexToRgba(entity.orgColor, 0.2)}`,
                  }}
                >
                  {entry.code}: {entry.description}
                </span>
              ))}
            </div>
          )}

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
              color: entity.orgColor,
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
            {experienceEducationCopy.viewFullRecordLabel}
            <ChevronRight size={12} />
          </button>
        </>
      )}
    />
  )
}

interface TimelineInterventionsSubsectionProps {
  onNodeHighlight?: (id: string | null) => void
  highlightedRoleId?: string | null
  focusRelatedIds?: Set<string> | null
}

export function TimelineInterventionsSubsection({ onNodeHighlight, highlightedRoleId, focusRelatedIds }: TimelineInterventionsSubsectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { openPanel } = useDetailPanel()

  const consultationsById = useMemo(
    () => new Map(timelineConsultations.map((consultation) => [consultation.id, consultation])),
    [],
  )

  const firstEducationId = useMemo(
    () => timelineEntities.find((entity) => entity.kind === 'education')?.id ?? null,
    [],
  )

  const handleToggle = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }, [])

  const handleViewFull = useCallback((entity: TimelineEntity) => {
    const consultation = consultationsById.get(entity.id)
    if (!consultation) return
    openPanel({ type: 'career-role', consultation })
  }, [consultationsById, openPanel])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {timelineEntities.map((entity) => (
        <TimelineInterventionItem
          key={entity.id}
          entity={entity}
          isExpanded={expandedId === entity.id}
          isHighlightedFromGraph={highlightedRoleId === entity.id}
          isDimmedByFocus={focusRelatedIds !== null && focusRelatedIds !== undefined && !focusRelatedIds.has(entity.id)}
          isEducationAnchor={entity.id === firstEducationId}
          onToggle={() => handleToggle(entity.id)}
          onViewFull={() => handleViewFull(entity)}
          onHighlight={onNodeHighlight}
        />
      ))}
    </div>
  )
}
