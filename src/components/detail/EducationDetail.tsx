import { GraduationCap, Award, BookOpen, FlaskConical, type LucideIcon } from 'lucide-react'
import type { Document } from '@/types/pmr'
import { educationExtras } from '@/data/educationExtras'

interface EducationDetailProps {
  document: Document
}

const sectionHeaderStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '8px',
}

const typeIconMap: Record<string, LucideIcon> = {
  Certificate: GraduationCap,
  Registration: Award,
  Results: BookOpen,
  Research: FlaskConical,
}

export function EducationDetail({ document }: EducationDetailProps) {
  const extra = educationExtras.find((e) => e.documentId === document.id)
  const Icon = typeIconMap[document.type] || GraduationCap

  return (
    <div
      style={{
        fontFamily: 'var(--font-ui)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      {/* Header */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '8px',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--purple-light, rgba(124,58,237,0.08))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={18} />
          </div>
          <div>
            <div
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                lineHeight: '1.3',
              }}
            >
              {document.title}
            </div>
          </div>
        </div>

        {document.institution && (
          <div
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#7C3AED',
              marginBottom: '4px',
            }}
          >
            {document.institution}
          </div>
        )}

        <div
          style={{
            fontSize: '12px',
            fontFamily: 'var(--font-geist)',
            color: 'var(--text-tertiary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {document.duration && <span>{document.duration}</span>}
          {document.classification && (
            <span
              style={{
                padding: '2px 8px',
                backgroundColor: 'var(--purple-light, rgba(124,58,237,0.08))',
                color: '#7C3AED',
                fontSize: '10px',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
              }}
            >
              {document.classification}
            </span>
          )}
        </div>
      </div>

      {/* Research project (MPharm) */}
      {extra?.researchDescription && (
        <div>
          <h3 style={sectionHeaderStyle}>Research Project</h3>
          <p
            style={{
              fontSize: '14px',
              lineHeight: '1.6',
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            {extra.researchDescription}
          </p>
        </div>
      )}

      {/* OSCE score (MPharm) */}
      {extra?.osceScore && (
        <div>
          <h3 style={sectionHeaderStyle}>OSCE Performance</h3>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              backgroundColor: 'var(--success-light)',
              border: '1px solid var(--success-border)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <span
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: 'var(--success)',
              }}
            >
              {extra.osceScore}
            </span>
            <span
              style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
              }}
            >
              Objective Structured Clinical Examination
            </span>
          </div>
        </div>
      )}

      {/* Extracurricular activities (MPharm) */}
      {extra?.extracurriculars && extra.extracurriculars.length > 0 && (
        <div>
          <h3 style={sectionHeaderStyle}>Extracurricular Activities</h3>
          <ul
            style={{
              margin: 0,
              paddingLeft: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {extra.extracurriculars.map((activity, index) => (
              <li
                key={index}
                style={{
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: 'var(--text-primary)',
                }}
              >
                {activity}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Programme detail (Mary Seacole) */}
      {extra?.programmeDetail && (
        <div>
          <h3 style={sectionHeaderStyle}>Programme Overview</h3>
          <p
            style={{
              fontSize: '14px',
              lineHeight: '1.6',
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            {extra.programmeDetail}
          </p>
        </div>
      )}

      {/* Notes */}
      {document.notes && (
        <div>
          <h3 style={sectionHeaderStyle}>Notes</h3>
          <p
            style={{
              fontSize: '14px',
              lineHeight: '1.6',
              color: 'var(--text-secondary)',
              margin: 0,
              fontStyle: 'italic',
            }}
          >
            {document.notes}
          </p>
        </div>
      )}
    </div>
  )
}
