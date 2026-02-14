import { useState } from 'react'
import { Card, CardHeader } from '../Card'
import { useDetailPanel } from '@/contexts/DetailPanelContext'
import { documents } from '@/data/documents'
import { educationExtras } from '@/data/educationExtras'

/**
 * Education tile - displays academic qualifications
 * Full-width card below Career Activity
 * Each entry is clickable to open detail panel
 */
export function EducationTile() {
  const { openPanel } = useDetailPanel()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Filter to main education entries in reverse chronological order
  const educationDocuments = [
    documents.find((d) => d.id === 'doc-mary-seacole')!,
    documents.find((d) => d.id === 'doc-mpharm')!,
    documents.find((d) => d.id === 'doc-alevels')!,
  ]

  // Look up education extras by document ID
  const getExtras = (docId: string) =>
    educationExtras.find((e) => e.documentId === docId)

  // Build rich inline content for each entry
  const getInlineDetails = (doc: (typeof educationDocuments)[0]) => {
    const extras = getExtras(doc.id)

    switch (doc.id) {
      case 'doc-mpharm':
        return {
          title: 'MPharm (Hons) — 2:1',
          institution: 'University of East Anglia',
          year: '2011–2015',
          details: [
            `Research project: Drug delivery & cocrystals, 75.1% (Distinction)`,
            ...(extras?.osceScore ? [`4th year OSCE: ${extras.osceScore}`] : []),
          ],
        }
      case 'doc-mary-seacole':
        return {
          title: 'NHS Leadership Academy — Mary Seacole Programme',
          institution: 'NHS Leadership Academy',
          year: '2018',
          details: [
            `Programme score: 78%`,
            ...(extras?.programmeDetail ? [extras.programmeDetail] : []),
          ],
        }
      case 'doc-alevels':
        return {
          title: 'A-Levels',
          institution: 'Highworth Grammar School',
          year: '2009–2011',
          details: ['Mathematics (A*) · Chemistry (B) · Politics (C)'],
        }
      default:
        return {
          title: doc.title,
          institution: doc.institution,
          year: doc.date,
          details: doc.classification ? [doc.classification] : [],
        }
    }
  }

  return (
    <Card full tileId="education">
      <CardHeader dotColor="purple" title="EDUCATION" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {educationDocuments.map((doc, index) => {
          const content = getInlineDetails(doc)
          const isHovered = hoveredIndex === index

          return (
            <button
              key={doc.id}
              onClick={() => openPanel({ type: 'education', document: doc })}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                padding: '10px 12px',
                background: 'var(--surface)',
                border: `1px solid ${isHovered ? 'var(--accent)' : 'var(--border-light)'}`,
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'border-color 150ms ease-out, box-shadow 150ms ease-out',
                boxShadow: isHovered
                  ? '0 2px 8px rgba(26,43,42,0.08)'
                  : '0 1px 2px rgba(26,43,42,0.05)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  gap: '12px',
                  marginBottom: '4px',
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '12.5px' }}>
                  {content.title}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-geist-mono)',
                    fontSize: '10px',
                    color: 'var(--text-tertiary)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {content.year}
                </span>
              </div>
              <div
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '11px',
                  marginBottom: content.details.length > 0 ? '6px' : '0',
                }}
              >
                {content.institution}
              </div>
              {content.details.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                  }}
                >
                  {content.details.map((detail, i) => (
                    <div
                      key={i}
                      style={{
                        color: 'var(--text-tertiary)',
                        fontSize: '10.5px',
                        fontFamily: 'var(--font-geist-mono)',
                      }}
                    >
                      {detail}
                    </div>
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </Card>
  )
}
