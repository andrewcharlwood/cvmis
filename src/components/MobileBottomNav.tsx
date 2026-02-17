import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  Search,
  UserRound,
  Workflow,
  Wrench,
  X,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react'
import { CvmisLogo } from './CvmisLogo'
import { PhoneCaptcha } from './PhoneCaptcha'
import { patient } from '@/data/patient'
import { tags } from '@/data/tags'
import { alerts } from '@/data/alerts'
import { getSidebarCopy } from '@/lib/profile-content'
import type { Tag, Alert } from '@/types/pmr'
import { prefersReducedMotion } from '@/lib/utils'
import { useIsMobileNav } from '@/hooks/useIsMobileNav'

interface MobileBottomNavProps {
  activeSection: string
  onNavigate: (tileId: string) => void
  onSearchClick: () => void
}

const navItems = [
  { id: 'overview', label: 'Overview', tileId: 'patient-summary', Icon: UserRound },
  { id: 'experience', label: 'Experience', tileId: 'section-experience', Icon: Workflow },
  { id: 'skills', label: 'Skills', tileId: 'section-skills', Icon: Wrench },
]

function TagPill({ tag }: { tag: Tag }) {
  const styles: Record<Tag['colorVariant'], React.CSSProperties> = {
    teal: {
      background: 'var(--accent-light)',
      color: 'var(--accent)',
      border: '1px solid var(--accent-border)',
    },
    amber: {
      background: 'var(--amber-light)',
      color: 'var(--amber)',
      border: '1px solid var(--amber-border)',
    },
    green: {
      background: 'var(--success-light)',
      color: 'var(--success)',
      border: '1px solid var(--success-border)',
    },
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        fontSize: '12px',
        fontWeight: 500,
        padding: '4px 10px',
        borderRadius: '4px',
        lineHeight: 1.3,
        ...styles[tag.colorVariant],
      }}
    >
      {tag.label}
    </span>
  )
}

function AlertFlag({ alert }: { alert: Alert }) {
  const Icon = alert.icon === 'AlertTriangle' ? AlertTriangle : AlertCircle

  const styles: Record<Alert['severity'], React.CSSProperties> = {
    alert: {
      background: 'var(--alert-light)',
      color: 'var(--alert)',
      border: '1px solid var(--alert-border)',
    },
    amber: {
      background: 'var(--amber-light)',
      color: 'var(--amber)',
      border: '1px solid var(--amber-border)',
    },
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '13px',
        fontWeight: 700,
        padding: '8px 12px',
        borderRadius: 'var(--radius-sm)',
        letterSpacing: '0.02em',
        ...styles[alert.severity],
      }}
    >
      <div style={{ width: '18px', height: '18px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={16} strokeWidth={2.5} />
      </div>
      <span>{alert.message}</span>
    </div>
  )
}

export function MobileBottomNav({ activeSection, onNavigate, onSearchClick }: MobileBottomNavProps) {
  const isMobileNav = useIsMobileNav()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const sidebarCopy = getSidebarCopy()

  useEffect(() => {
    if (!isMobileNav) setDrawerOpen(false)
  }, [isMobileNav])

  const handleDrawerKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setDrawerOpen(false)
  }, [])

  if (!isMobileNav) return null

  const handleNav = (tileId: string) => {
    onNavigate(tileId)
    setDrawerOpen(false)
  }

  return (
    <>
      {/* Bottom tab bar */}
      <nav
        aria-label="Mobile navigation"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '56px',
          background: 'var(--sidebar-bg)',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          zIndex: 100,
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {navItems.map((item) => {
          const isActive = activeSection === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item.tileId)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                width: '44px',
                height: '44px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: isActive ? 'var(--accent)' : 'var(--text-tertiary)',
                transition: 'color 150ms',
              }}
            >
              <item.Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
              <span style={{ fontSize: '10px', fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
            </button>
          )
        })}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px',
            width: '44px',
            height: '44px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-tertiary)',
            transition: 'color 150ms',
          }}
        >
          <Menu size={20} strokeWidth={2} />
          <span style={{ fontSize: '10px', fontWeight: 400 }}>More</span>
        </button>
      </nav>

      {/* Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
              onClick={() => setDrawerOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(26,43,42,0.28)',
                border: 'none',
                cursor: 'pointer',
                zIndex: 200,
              }}
            />
            <motion.div
              initial={prefersReducedMotion ? { y: 0 } : { y: '100%' }}
              animate={{ y: 0 }}
              exit={prefersReducedMotion ? { y: 0 } : { y: '100%' }}
              transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', damping: 28, stiffness: 300 }}
              className="pmr-scrollbar"
              onKeyDown={handleDrawerKeyDown}
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                maxHeight: '70vh',
                background: 'var(--sidebar-bg)',
                borderTop: '1px solid var(--border)',
                borderRadius: '16px 16px 0 0',
                overflowY: 'auto',
                padding: '16px',
                zIndex: 201,
              }}
            >
              {/* Drawer handle */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'var(--border)' }} />
              </div>

              {/* Close button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close menu"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '44px',
                    height: '44px',
                    background: 'transparent',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Logo + search */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', marginBottom: '12px' }}>
                <CvmisLogo cssHeight="40px" />
                <button
                  type="button"
                  onClick={() => { onSearchClick(); setDrawerOpen(false) }}
                  className="sidebar-control"
                  aria-label={sidebarCopy.searchAriaLabel}
                  style={{
                    width: '100%',
                    minHeight: '44px',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--surface)',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '0 10px',
                    cursor: 'pointer',
                  }}
                >
                  <Search size={16} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                  <span style={{ flex: 1, textAlign: 'left', fontSize: '13px' }}>{sidebarCopy.searchLabel}</span>
                </button>
              </div>

              {/* Patient info */}
              <section style={{ borderBottom: '2px solid var(--accent)', paddingBottom: '12px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--accent), #0A8080)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontSize: '16px',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    AC
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      CHARLWOOD, Andrew
                    </div>
                    <div style={{ fontSize: '12px', fontFamily: 'Geist Mono, monospace', color: 'var(--text-secondary)' }}>
                      {sidebarCopy.roleTitle}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '6px' }}>
                  {[
                    { label: sidebarCopy.gphcLabel, value: patient.nhsNumber.replace(/\s/g, ''), mono: true },
                    { label: sidebarCopy.educationLabel, value: patient.qualification },
                    { label: sidebarCopy.locationLabel, value: patient.address },
                    { label: sidebarCopy.registeredLabel, value: patient.registrationYear },
                  ].map(({ label, value, mono }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', padding: '2px 0' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>{label}</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500, textAlign: 'right', fontFamily: mono ? 'Geist Mono, monospace' : undefined, fontSize: mono ? '12px' : undefined, letterSpacing: mono ? '0.12em' : undefined }}>
                        {value}
                      </span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', padding: '2px 0' }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>{sidebarCopy.phoneLabel}</span>
                    <PhoneCaptcha phone={patient.phone} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', padding: '2px 0' }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>{sidebarCopy.emailLabel}</span>
                    <a
                      href={`mailto:${patient.email}`}
                      style={{ color: 'var(--accent)', fontWeight: 500, textDecoration: 'none', textAlign: 'right' }}
                    >
                      {patient.email}
                    </a>
                  </div>
                </div>
              </section>

              {/* Tags */}
              <section style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
                  {sidebarCopy.tagsTitle}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {tags.map((tag) => (
                    <TagPill key={tag.label} tag={tag} />
                  ))}
                </div>
              </section>

              {/* Alerts */}
              <section>
                <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
                  {sidebarCopy.alertsTitle}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {alerts.map((alert, index) => (
                    <AlertFlag key={index} alert={alert} />
                  ))}
                </div>
              </section>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
