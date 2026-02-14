import React from 'react'
import { Card, CardHeader } from '../Card'
import { personalStatement } from '@/data/profile'

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

      {/* Profile text with improved readability */}
      <div style={profileTextStyles}>{personalStatement}</div>
    </Card>
  )
}
