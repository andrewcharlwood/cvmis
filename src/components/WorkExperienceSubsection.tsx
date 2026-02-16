import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { CardHeader } from './Card'
import { consultations } from '@/data/consultations'
import { useDetailPanel } from '@/contexts/DetailPanelContext'

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${opacity})`
}

interface RoleItemProps {
  consultation: typeof consultations[0]
  isExpanded: boolean
  isHighlightedFromGraph: boolean
  onToggle: () => void
  onViewFull: () => void
  onHighlight?: (id: string | null) => void
}

function RoleItem({ consultation, isExpanded, isHighlightedFromGraph, onToggle, onViewFull, onHighlight }: RoleItemProps) {
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
    [onToggle, isExpanded],
  )

  return (
    <div
      style={{
        background: isHighlightedFromGraph ? hexToRgba(consultation.orgColor ?? '#0D6E6E', 0.03) : 'var(--bg-dashboard)',
        borderRadius: 'var(--radius-sm)',
        border: `1px solid ${isExpanded || isHighlightedFromGraph ? hexToRgba(consultation.orgColor ?? '#0D6E6E', 0.2) : 'var(--border-light)'}`,
        transition: 'border-color 0.15s, box-shadow 0.15s, background-color 0.15s',
        overflow: 'hidden',
      }}
      onMouseEnter={() => onHighlight?.(consultation.id)}
      onMouseLeave={() => onHighlight?.(null)}
    >
      {/* Clickable header */}
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        aria-expanded={isExpanded}
        aria-label={`${consultation.role} at ${consultation.organization}, ${consultation.duration}. Click to ${isExpanded ? 'collapse' : 'expand'} details.`}
        style={{
          display: 'flex',
          gap: '10px',
          padding: '12px 14px',
          cursor: 'pointer',
          minHeight: '44px',
          alignItems: 'flex-start',
        }}
        onMouseEnter={(e) => {
          if (!isExpanded) {
            e.currentTarget.parentElement!.style.borderColor = hexToRgba(consultation.orgColor ?? '#0D6E6E', 0.2)
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
        {/* Org colour dot */}
        <div
          aria-hidden="true"
          style={{
            width: '9px',
            height: '9px',
            borderRadius: '50%',
            background: consultation.orgColor ?? '#0D6E6E',
            flexShrink: 0,
            marginTop: '4px',
          }}
        />

        {/* Text content */}
        <div style={{ flex: 1, minWidth: 0 }}>
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
        </div>

        {/* Chevron */}
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

      {/* Expandable detail content */}
      <AnimatePresence>
        {isExpanded && (
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
                padding: '0 12px 12px 30px',
                borderTop: '1px solid var(--border-light)',
                paddingTop: '12px',
                borderLeft: `2px solid ${consultation.orgColor ?? 'var(--accent)'}`,
                marginLeft: '12px',
              }}
            >
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
                      background: hexToRgba(consultation.orgColor ?? '#0D6E6E', 0.08),
                      color: consultation.orgColor ?? 'var(--accent)',
                      border: `1px solid ${hexToRgba(consultation.orgColor ?? '#0D6E6E', 0.2)}`,
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
    (consultation: typeof consultations[0]) => {
      openPanel({ type: 'career-role', consultation })
    },
    [openPanel],
  )

  return (
    <div>
      <CardHeader dotColor="teal" title="WORK EXPERIENCE" rightText={`${consultations.length} roles`} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {consultations.map((c) => (
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
