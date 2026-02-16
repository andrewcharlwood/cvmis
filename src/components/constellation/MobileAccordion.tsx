import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { TimelineEntity } from '@/types/pmr'
import { prefersReducedMotion } from './constants'

interface MobileAccordionProps {
  pinnedCareerEntity: TimelineEntity | null
  show: boolean
}

export const MobileAccordion: React.FC<MobileAccordionProps> = ({ pinnedCareerEntity, show }) => {
  const [accordionShowMore, setAccordionShowMore] = useState(false)

  useEffect(() => {
    setAccordionShowMore(false)
  }, [pinnedCareerEntity?.id])

  return (
    <AnimatePresence>
      {show && pinnedCareerEntity && (
        <motion.div
          key={pinnedCareerEntity.id}
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          exit={{ height: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' }}
          style={{ overflow: 'hidden' }}
        >
          <div
            style={{
              padding: '12px 16px',
              borderTop: `1px solid ${pinnedCareerEntity.orgColor ?? 'var(--border-light)'}`,
              fontFamily: 'var(--font-ui)',
            }}
          >
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: pinnedCareerEntity.orgColor ?? 'var(--accent)',
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {pinnedCareerEntity.title}
                </span>
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-geist-mono)',
                  paddingLeft: '14px',
                }}
              >
                {pinnedCareerEntity.organization} · {pinnedCareerEntity.dateRange.display}
              </div>
            </div>

            <ul style={{ margin: 0, paddingLeft: '14px', listStyle: 'none' }}>
              {(accordionShowMore ? pinnedCareerEntity.details : pinnedCareerEntity.details.slice(0, 3)).map((item, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.5',
                    marginBottom: '4px',
                    display: 'flex',
                    gap: '8px',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: pinnedCareerEntity.orgColor ?? 'var(--accent)',
                      opacity: 0.5,
                      flexShrink: 0,
                      marginTop: '7px',
                    }}
                  />
                  {item}
                </li>
              ))}
            </ul>

            {accordionShowMore && (pinnedCareerEntity.outcomes ?? []).length > 0 && (
              <ul style={{ margin: '8px 0 0', paddingLeft: '14px', listStyle: 'none' }}>
                {(pinnedCareerEntity.outcomes ?? []).map((item, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-tertiary)',
                      lineHeight: '1.5',
                      marginBottom: '4px',
                      display: 'flex',
                      gap: '8px',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--text-tertiary)',
                        opacity: 0.4,
                        flexShrink: 0,
                        marginTop: '7px',
                      }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {pinnedCareerEntity.details.length > 3 && (
              <button
                type="button"
                onClick={() => setAccordionShowMore(prev => !prev)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px 14px',
                  fontSize: '11px',
                  fontFamily: 'var(--font-geist-mono)',
                  color: pinnedCareerEntity.orgColor ?? 'var(--accent)',
                  fontWeight: 500,
                  marginTop: '4px',
                }}
              >
                {accordionShowMore ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
