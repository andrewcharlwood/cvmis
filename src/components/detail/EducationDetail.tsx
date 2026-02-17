import { GraduationCap, Award, BookOpen, FlaskConical, type LucideIcon } from 'lucide-react'
import type { Document } from '@/types/pmr'
import { educationExtras } from '@/data/educationExtras'
import { detailRootStyle, sectionHeadingStyle, bulletListStyle, bodyTextStyle, paragraphStyle } from './detail-styles'

interface EducationDetailProps {
  document: Document
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
    <div style={detailRootStyle}>
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
          <h3 style={sectionHeadingStyle}>Research Project</h3>
          <p style={paragraphStyle}>
            {extra.researchDescription}
          </p>
        </div>
      )}

      {/* OSCE score (MPharm) */}
      {extra?.osceScore && (
        <div>
          <h3 style={sectionHeadingStyle}>OSCE Performance</h3>
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
          <h3 style={sectionHeadingStyle}>Extracurricular Activities</h3>
          <ul style={bulletListStyle}>
            {extra.extracurriculars.map((activity, index) => (
              <li key={index} style={bodyTextStyle}>
                {activity}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Programme detail (Mary Seacole) */}
      {extra?.programmeDetail && (
        <div>
          <h3 style={sectionHeadingStyle}>Programme Overview</h3>
          <p style={paragraphStyle}>
            {extra.programmeDetail}
          </p>
        </div>
      )}

      {/* Notes */}
      {document.notes && (
        <div>
          <h3 style={sectionHeadingStyle}>Notes</h3>
          <p
            style={{
              ...paragraphStyle,
              color: 'var(--text-secondary)',
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
