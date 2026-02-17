import React, { useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { hexToRgba, motionSafeTransition } from '@/lib/utils'

interface ExpandableCardShellProps {
  isExpanded: boolean
  isHighlighted: boolean
  accentColor: string
  onToggle: () => void
  ariaLabel: string
  headerPadding?: string
  className?: string
  dataTileId?: string
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  renderHeader: () => React.ReactNode
  renderBody: () => React.ReactNode
}

export function ExpandableCardShell({
  isExpanded,
  isHighlighted,
  accentColor,
  onToggle,
  ariaLabel,
  headerPadding = '12px 14px',
  className,
  dataTileId,
  onMouseEnter,
  onMouseLeave,
  renderHeader,
  renderBody,
}: ExpandableCardShellProps) {
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
      data-tile-id={dataTileId}
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        style={{
          background: isHighlighted ? hexToRgba(accentColor, 0.03) : 'var(--bg-dashboard)',
          borderRadius: 'var(--radius-sm)',
          border: `1px solid ${isExpanded || isHighlighted ? hexToRgba(accentColor, 0.2) : 'var(--border-light)'}`,
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
          aria-label={ariaLabel}
          style={{
            display: 'flex',
            gap: '10px',
            padding: headerPadding,
            cursor: 'pointer',
            minHeight: '44px',
            alignItems: 'flex-start',
          }}
          onMouseEnter={(e) => {
            if (!isExpanded) {
              e.currentTarget.parentElement!.style.borderColor = hexToRgba(accentColor, 0.2)
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
              background: accentColor,
              flexShrink: 0,
              marginTop: '4px',
            }}
          />

          <div style={{ flex: 1, minWidth: 0 }}>
            {renderHeader()}
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
                  borderLeft: `2px solid ${accentColor}`,
                  marginLeft: '12px',
                }}
              >
                {renderBody()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
