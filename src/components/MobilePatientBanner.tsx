import { useState, useEffect, useRef, useCallback } from 'react'
import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { patient } from '@/data/patient'
import { getSidebarCopy } from '@/lib/profile-content'
import { PhoneCaptcha } from './PhoneCaptcha'

function DataRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '13px',
        padding: '2px 0',
      }}
    >
      <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>{label}</span>
      {children}
    </div>
  )
}

export function MobilePatientBanner() {
  const sidebarCopy = getSidebarCopy()
  const [expanded, setExpanded] = useState(true)
  const expandedByClickRef = useRef(false)
  const clickExpandScrollRef = useRef(0)

  useEffect(() => {
    const scrollContainer = document.querySelector('.dashboard-main')
    if (!scrollContainer) return

    let prevScrollTop = scrollContainer.scrollTop

    const handleScroll = () => {
      const currentScroll = scrollContainer.scrollTop
      const delta = currentScroll - prevScrollTop
      prevScrollTop = currentScroll

      if (delta <= 0) return

      if (expandedByClickRef.current) {
        // After click-expand, collapse once user scrolls 20px from where they expanded
        const scrollSinceExpand = currentScroll - clickExpandScrollRef.current
        if (scrollSinceExpand > 20) {
          setExpanded(false)
          expandedByClickRef.current = false
        }
      } else if (currentScroll > 40) {
        // Initial collapse after scrolling 40px from top
        setExpanded(false)
      }
    }

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
    return () => scrollContainer.removeEventListener('scroll', handleScroll)
  }, [])

  const handleToggle = useCallback(() => {
    setExpanded((prev) => {
      if (!prev) {
        expandedByClickRef.current = true
        const container = document.querySelector('.dashboard-main')
        if (container) clickExpandScrollRef.current = container.scrollTop
        return true
      }
      return prev
    })
  }, [])

  return (
    <div
      className="-mx-3 xs:-mx-5 -mt-3 xs:-mt-5"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        marginBottom: '12px',
        overflow: 'hidden',
        boxShadow: expanded ? 'none' : '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'box-shadow 0.25s ease',
      }}
    >
      {/* Green header — always visible */}
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={expanded}
        aria-label={expanded ? 'Patient summary expanded' : 'Tap to view patient details'}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          background: 'var(--accent)',
          border: 'none',
          cursor: expanded ? 'default' : 'pointer',
          textAlign: 'left',
          color: '#FFFFFF',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              fontFamily: 'var(--font-ui)',
            }}
          >
            CHARLWOOD, Andrew
          </div>
          <div
            style={{
              fontSize: '11px',
              opacity: 0.75,
              fontFamily: 'var(--font-geist-mono)',
              letterSpacing: '0.02em',
            }}
          >
            Informatics Pharmacist · NHS Norfolk & Waveney ICB
          </div>
        </div>

        <motion.div
          animate={
            expanded
              ? { rotate: 180, opacity: 0.3 }
              : { rotate: 0, opacity: 0.65, y: [0, 2, 0] }
          }
          transition={
            expanded
              ? { duration: 0.2 }
              : {
                  rotate: { duration: 0.2 },
                  opacity: { duration: 0.2 },
                  y: { duration: 1.2, repeat: 2, ease: 'easeInOut', delay: 0.3 },
                }
          }
          style={{ flexShrink: 0, marginLeft: '8px', display: 'flex' }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </button>

      {/* Expandable patient data panel */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="patient-data-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                background: 'var(--surface)',
                borderTop: '1px solid var(--border-light)',
                padding: '10px 16px 12px',
                display: 'grid',
                gap: '4px',
              }}
            >
              <DataRow label={sidebarCopy.gphcLabel}>
                <span
                  style={{
                    color: 'var(--text-primary)',
                    fontWeight: 500,
                    fontFamily: 'Geist Mono, monospace',
                    fontSize: '12px',
                    letterSpacing: '0.12em',
                  }}
                >
                  {patient.nhsNumber.replace(/\s/g, '')}
                </span>
              </DataRow>

              <DataRow label={sidebarCopy.educationLabel}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                  {patient.qualification}
                </span>
              </DataRow>

              <DataRow label={sidebarCopy.locationLabel}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                  {patient.address}
                </span>
              </DataRow>

              <DataRow label={sidebarCopy.phoneLabel}>
                <PhoneCaptcha phone={patient.phone} />
              </DataRow>

              <DataRow label={sidebarCopy.emailLabel}>
                <a
                  href={`mailto:${patient.email}`}
                  style={{
                    color: 'var(--accent)',
                    fontWeight: 500,
                    textDecoration: 'none',
                    textAlign: 'right',
                  }}
                >
                  {patient.email}
                </a>
              </DataRow>

              <DataRow label={sidebarCopy.registeredLabel}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500, textAlign: 'right' }}>
                  {patient.registrationYear}
                </span>
              </DataRow>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
