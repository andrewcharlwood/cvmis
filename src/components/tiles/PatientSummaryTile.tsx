import React from 'react'
import { Card, CardHeader } from '../Card'

export function PatientSummaryTile() {
  // Key statistics from CV_v4.md
  const highlights = [
    { label: '9+ Years', sublabel: 'Professional Experience' },
    { label: '1.2M', sublabel: 'Population Served' },
    { label: '£220M', sublabel: 'Budget Managed' },
    { label: '£14.6M+', sublabel: 'Savings Identified' },
  ]

  const highlightStripStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '12px',
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '1px solid var(--border-light)',
  }

  const highlightItemStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  }

  const highlightValueStyles: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--accent)',
    fontFamily: 'var(--font-ui)',
  }

  const highlightLabelStyles: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
  }

  const profileTextStyles: React.CSSProperties = {
    fontSize: '13px',
    lineHeight: '1.6',
    color: 'var(--text-primary)',
  }

  // Split profile text into structured sections with bold key phrases
  const renderProfileWithHierarchy = () => {
    return (
      <div style={profileTextStyles}>
        <strong>Healthcare leader</strong> combining clinical pharmacy expertise with proficiency in{' '}
        <strong>Python, SQL, and data analytics</strong>, self-taught over the past decade through a drive to find root causes in data and build the most efficient solutions to complex problems. Currently{' '}
        <strong>leading population health analytics for NHS Norfolk & Waveney ICB</strong>, serving a population of 1.2 million. Experienced in working with messy, real-world prescribing data at scale to deliver actionable insights—from{' '}
        <strong>financial scenario modelling</strong> and <strong>pharmaceutical rebate negotiation</strong> to{' '}
        <strong>algorithm design</strong> and <strong>population-level pathway development</strong>. Proven track record of identifying and prioritising efficiency programmes worth{' '}
        <strong>£14.6M+</strong> through automated, data-driven analysis. Skilled at translating complex clinical, financial, and analytical requirements into clear recommendations for{' '}
        <strong>executive stakeholders</strong>.
      </div>
    )
  }

  return (
    <Card full tileId="patient-summary">
      <CardHeader dotColor="teal" title="PATIENT SUMMARY" />

      {/* Highlight strip with key stats */}
      <div style={highlightStripStyles}>
        {highlights.map((highlight, idx) => (
          <div key={idx} style={highlightItemStyles}>
            <div style={highlightValueStyles}>{highlight.label}</div>
            <div style={highlightLabelStyles}>{highlight.sublabel}</div>
          </div>
        ))}
      </div>

      {/* Profile text with visual hierarchy through bold key phrases */}
      {renderProfileWithHierarchy()}
    </Card>
  )
}
