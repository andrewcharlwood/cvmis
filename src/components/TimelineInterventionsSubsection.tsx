import React, { useMemo, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { useDetailPanel } from '@/contexts/DetailPanelContext'
import { timelineEntities, timelineConsultations } from '@/data/timeline'
import { getExperienceEducationUICopy } from '@/lib/profile-content'
import type { TimelineEntity } from '@/types/pmr'
import { hexToRgba, motionSafeTransition } from '@/lib/utils'

interface TimelineInterventionItemProps {
  entity: TimelineEntity
  isExpanded: boolean
  isHighlightedFromGraph: boolean
  isEducationAnchor: boolean
  onToggle: () => void
  onViewFull: () => void
  onHighlight?: (id: string | null) => void
}

function TimelineInterventionItem({
  entity,
  isExpanded,
  isHighlightedFromGraph,
  isEducationAnchor,
  onToggle,
  onViewFull,
  onHighlight,
}: TimelineInterventionItemProps) {
  const experienceEducationCopy = getExperienceEducationUICopy()
  const isEducation = entity.kind === 'education'
  const interventionLabel = isEducation ? experienceEducationCopy.educationLabel : experienceEducationCopy.employmentLabel

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onToggle()
      }
      if (e.key === 'Escape' && isExpanded) {
        e.preventDefault()
        onToggle()
      }
    },
    [isExpanded, onToggle],
  )

  return (
    <div
      data-tile-id={isEducationAnchor ? 'section-education' : undefined}
      className={isEducation ? 'timeline-intervention-item timeline-intervention-item--education' : 'timeline-intervention-item'}
      onMouseEnter={() => onHighlight?.(entity.id)}
      onMouseLeave={() => onHighlight?.(null)}
    >
      <div
        style={{
          background: isHighlightedFromGraph ? hexToRgba(entity.orgColor, 0.03) : 'var(--bg-dashboard)',
          borderRadius: 'var(--radius-sm)',
          border: `1px solid ${isExpanded || isHighlightedFromGraph ? hexToRgba(entity.orgColor, 0.2) : 'var(--border-light)'}`,
          transition: 'border-color 0.15s, box-shadow 0.15s, background-color 0.15s',
          overflow: 'hidden',
        }}
      >
        <div
          role="button"
          tabIndex={0}
          onClick={onToggle}
          onKeyDown={handleKeyDown}
          aria-expanded={isExpanded}
          aria-label={`${entity.title} at ${entity.organization}, ${entity.dateRange.display}. Click to ${isExpanded ? 'collapse' : 'expand'} details.`}
          style={{
            display: 'flex',
            gap: '10px',
            padding: '8px 8px',
            cursor: 'pointer',
            
            alignItems: 'flex-start',
          }}
          onMouseEnter={(e) => {
            if (!isExpanded) {
              e.currentTarget.parentElement!.style.borderColor = hexToRgba(entity.orgColor, 0.2)
              e.currentTarget.parentElement!.style.boxShadow = 'var(--shadow-md)'
            }
          }}
          onMouseLeave={(e) => {
            if (!isExpanded) {
              e.currentTarget.parentElement!.style.borderColor = 'var(--border-light)'
              e.currentTarget.parentElement!.style.boxShadow = 'none'
            }
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: '9px',
              height: '9px',
              borderRadius: '50%',
              background: entity.orgColor,
              flexShrink: 0,
              marginTop: '4px',
            }}
          />

          <div style={{ flex: 1, minWidth: 0 }}>
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

          <ChevronRight
            size={14}
            style={{
              color: 'var(--text-tertiary)',
              flexShrink: 0,
              marginTop: '2px',
              transform: isExpanded ? 'rotate(90deg)' : 'none',
              transition: 'transform 0.15s ease-out',
              
            }}
          />
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={motionSafeTransition(0.2)}
              style={{ overflow: 'hidden' }}
            >
              <div
                style={{
                  padding: '0 12px 12px 30px',
                  borderTop: '1px solid var(--border-light)',
                  paddingTop: '12px',
                  borderLeft: `2px solid ${entity.orgColor}`,
                  marginLeft: '12px',
                }}
              >
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

interface TimelineInterventionsSubsectionProps {
  onNodeHighlight?: (id: string | null) => void
  highlightedRoleId?: string | null
}

export function TimelineInterventionsSubsection({ onNodeHighlight, highlightedRoleId }: TimelineInterventionsSubsectionProps) {
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
          isEducationAnchor={entity.id === firstEducationId}
          onToggle={() => handleToggle(entity.id)}
          onViewFull={() => handleViewFull(entity)}
          onHighlight={onNodeHighlight}
        />
      ))}
    </div>
  )
}
