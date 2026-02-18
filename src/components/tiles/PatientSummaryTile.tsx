import React from 'react'
import { FileText, ChevronRight, Mail, Linkedin, Github, Download } from 'lucide-react'
import { CardHeader } from '../Card'
import { ParentSection } from '../ParentSection'
import { kpis } from '@/data/kpis'
import type { KPI } from '@/types/pmr'
import { useDetailPanel } from '@/contexts/DetailPanelContext'
import { getLatestResultsCopy, getProfileSectionTitle, getStructuredProfile } from '@/lib/profile-content'
import { KPI_COLORS } from '@/lib/theme-colors'
import { useIsMobileNav } from '@/hooks/useIsMobileNav'
import { ProjectsCarousel } from './ProjectsTile'

interface MetricCardProps {
  kpi: KPI
}

function MetricCard({ kpi }: MetricCardProps) {
  const { openPanel } = useDetailPanel()
  const latestResultsCopy = getLatestResultsCopy()

  const handleClick = () => {
    openPanel({ type: 'kpi', kpi })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openPanel({ type: 'kpi', kpi })
    }
  }

  const buttonStyles: React.CSSProperties = {
    width: '100%',
    textAlign: 'left',
    padding: '16px 16px 14px',
    background: 'var(--surface)',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'border-color 160ms ease-out, box-shadow 160ms ease-out, transform 120ms ease-out',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  }

  const valueStyles: React.CSSProperties = {
    fontSize: 'clamp(22px, 6vw, 30px)',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
    color: KPI_COLORS[kpi.colorVariant],
  }

  const labelStyles: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-primary)',
    marginTop: '4px',
  }

  const subStyles: React.CSSProperties = {
    fontSize: '11px',
    color: 'var(--text-tertiary)',
    fontFamily: 'var(--font-geist-mono)',
    marginTop: '2px',
  }

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={buttonStyles}
      className="metric-card"
      aria-label={`${kpi.label}: ${kpi.value}. Click to view details.`}
    >
      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          color: 'var(--accent)',
          opacity: 0.85,
        }}
        aria-hidden="true"
      >
        <FileText size={13} />
      </div>
      <div style={valueStyles}>{kpi.value}</div>
      <div style={labelStyles}>{kpi.label}</div>
      <div style={subStyles}>{kpi.sub}</div>
      <div
        style={{
          marginTop: '8px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--accent)',
          fontFamily: 'var(--font-geist-mono)',
        }}
      >
        {latestResultsCopy.evidenceCta}
        <ChevronRight size={12} />
      </div>
    </button>
  )
}

const ACTION_LINKS = [
  { label: 'Email', href: 'mailto:andy@charlwood.xyz', icon: Mail, external: false },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/andycharlwood', icon: Linkedin, external: true },
  { label: 'GitHub', href: 'https://github.com/andycharlwood', icon: Github, external: true },
  { label: 'Download CV', href: '/References/CV_v4.md', icon: Download, external: true },
] as const

const actionButtonStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 12px',
  fontSize: '12px',
  fontWeight: 600,
  fontFamily: 'var(--font-geist-mono)',
  letterSpacing: '0.03em',
  textTransform: 'uppercase',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border)',
  background: 'var(--surface)',
  color: 'var(--accent)',
  cursor: 'pointer',
  transition: 'background-color 150ms, border-color 150ms',
  textDecoration: 'none',
}

export function PatientSummaryTile() {
  const structuredProfile = getStructuredProfile()
  const latestResultsCopy = getLatestResultsCopy()
  const sectionTitle = getProfileSectionTitle()
  const isMobile = useIsMobileNav()

  const profileTextStyles: React.CSSProperties = {
    fontSize: '15px',
    lineHeight: '1.65',
    color: 'var(--text-primary)',
  }

  const fieldsGridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'auto 1fr',
    gap: isMobile ? '2px 0' : '6px 16px',
    borderTop: '1px solid var(--border-light)',
    paddingTop: '14px',
    marginTop: '14px',
  }

  const fieldLabelStyles: React.CSSProperties = {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'var(--text-tertiary)',
    fontFamily: 'var(--font-geist-mono)',
  }

  const fieldValueStyles: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: isMobile ? '8px' : undefined,
  }

  const kpiGridStyles: React.CSSProperties = {
    display: 'grid',
    gap: '10px',
  }

  return (
    <ParentSection title={sectionTitle} tileId="patient-summary">
      {/* Presenting complaint */}
      <div style={profileTextStyles}>{structuredProfile.presentingComplaint}</div>

      {/* Structured profile fields */}
      <div style={fieldsGridStyles}>
        {structuredProfile.fields.map((field) => (
          <React.Fragment key={field.label}>
            <span style={fieldLabelStyles}>{field.label}</span>
            <span style={fieldValueStyles}>{field.value}</span>
          </React.Fragment>
        ))}
      </div>

      {/* Contact / CTA action bar */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
        {ACTION_LINKS.map((action) => (
          <a
            key={action.label}
            href={action.href}
            {...(action.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            style={actionButtonStyles}
          >
            <action.icon size={13} aria-hidden="true" />
            {action.label}
          </a>
        ))}
      </div>

      {/* Latest Results subsection */}
      <div style={{ marginTop: '28px' }}>
        <div className="latest-results-header">
          <CardHeader dotColor="teal" title={latestResultsCopy.title} rightText={latestResultsCopy.rightText} />
          <p
            style={{
              margin: 0,
              fontSize: '12px',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-geist-mono)',
            }}
          >
            {latestResultsCopy.helperText}
          </p>
        </div>
        <div className="kpi-grid latest-results-grid" style={kpiGridStyles}>
          {kpis.map((kpi) => (
            <MetricCard key={kpi.id} kpi={kpi} />
          ))}
        </div>
      </div>

      {/* Projects carousel */}
      <ProjectsCarousel />
    </ParentSection>
  )
}
