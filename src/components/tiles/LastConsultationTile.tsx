import React from 'react'
import { Card, CardHeader } from '../Card'
import { consultations } from '@/data/consultations'

export const LastConsultationTile: React.FC = () => {
  // Use the most recent consultation (first in array)
  const consultation = consultations[0]

  // Format date to "May 2025" format
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  }

  // Extract employment type from duration string (e.g., "May 2025 — Nov 2025")
  const getEmploymentType = (): string => {
    // All ICB roles are Permanent · Full-time (from CV context)
    if (consultation.organization.includes('ICB')) {
      return 'Permanent · Full-time'
    }
    return 'Permanent'
  }

  // Extract band from role context - ICB senior roles are typically Band 8a
  const getBand = (): string => {
    if (consultation.role.includes('Head')) {
      return '8a'
    }
    return '—'
  }

  return (
    <Card full>
      <CardHeader dotColor="green" title="LAST CONSULTATION" rightText="Most recent role" />

      {/* Header info row */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '14px',
          paddingBottom: '14px',
          borderBottom: '1px solid var(--border-light)',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-tertiary)',
              marginBottom: '3px',
            }}
          >
            Date
          </div>
          <div
            style={{
              fontSize: '11.5px',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            {formatDate(consultation.date)}
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-tertiary)',
              marginBottom: '3px',
            }}
          >
            Organisation
          </div>
          <div
            style={{
              fontSize: '11.5px',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            {consultation.organization}
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-tertiary)',
              marginBottom: '3px',
            }}
          >
            Type
          </div>
          <div
            style={{
              fontSize: '11.5px',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            {getEmploymentType()}
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-tertiary)',
              marginBottom: '3px',
            }}
          >
            Band
          </div>
          <div
            style={{
              fontSize: '11.5px',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            {getBand()}
          </div>
        </div>
      </div>

      {/* Role title */}
      <div
        style={{
          fontSize: '13.5px',
          fontWeight: 600,
          color: 'var(--accent)',
          marginBottom: '12px',
        }}
      >
        {consultation.role}
      </div>

      {/* Bullet list */}
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '7px',
        }}
      >
        {consultation.examination.map((bullet, index) => (
          <li
            key={index}
            style={{
              fontSize: '12.5px',
              color: 'var(--text-primary)',
              paddingLeft: '16px',
              lineHeight: '1.5',
              position: 'relative',
            }}
          >
            {/* Bullet dot */}
            <span
              style={{
                position: 'absolute',
                left: '0',
                top: '7px',
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent)',
                opacity: 0.5,
              }}
            />
            {bullet}
          </li>
        ))}
      </ul>
    </Card>
  )
}
