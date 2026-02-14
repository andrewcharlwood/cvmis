import React from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  BarChart3, Code2, Database, PieChart, FileCode2,
  Sheet, GitBranch, Workflow, Pill, Users, FileCheck,
  TrendingUp, Route, ShieldAlert, Banknote, Handshake,
  MessageSquare, UserPlus, RefreshCw, Calculator, Presentation,
  ChevronRight,
} from 'lucide-react'
import { CardHeader } from './Card'
import { skills } from '@/data/skills'
import { useDetailPanel } from '@/contexts/DetailPanelContext'
import type { SkillMedication, SkillCategory } from '@/types/pmr'

const iconMap: Record<string, LucideIcon> = {
  BarChart3, Code2, Database, PieChart, FileCode2,
  Sheet, GitBranch, Workflow, Pill, Users, FileCheck,
  TrendingUp, Route, ShieldAlert, Banknote, Handshake,
  MessageSquare, UserPlus, RefreshCw, Calculator, Presentation,
}

const SKILLS_PER_CATEGORY = 4

const categoryConfig: { id: SkillCategory; label: string }[] = [
  { id: 'Technical', label: 'Technical' },
  { id: 'Domain', label: 'Healthcare Domain' },
  { id: 'Leadership', label: 'Strategic & Leadership' },
]

interface SkillRowProps {
  skill: SkillMedication
  onClick: () => void
  onHighlight?: (id: string | null) => void
}

function SkillRow({ skill, onClick, onHighlight }: SkillRowProps) {
  const IconComponent = iconMap[skill.icon]

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={`${skill.name}: ${skill.frequency}, ${skill.yearsOfExperience} years experience. Click for details.`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 12px',
        minHeight: '44px',
        background: 'var(--bg-dashboard)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-light)',
        cursor: 'pointer',
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent-border)'
        e.currentTarget.style.boxShadow = 'var(--shadow-md)'
        onHighlight?.(skill.id)
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-light)'
        e.currentTarget.style.boxShadow = 'none'
        onHighlight?.(null)
      }}
    >
      <div
        style={{
          width: '30px',
          height: '30px',
          borderRadius: '6px',
          background: 'var(--accent-light)',
          color: 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {IconComponent && <IconComponent size={15} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            lineHeight: 1.3,
          }}
        >
          {skill.name}
        </div>
        <div
          style={{
            fontSize: '12px',
            color: 'var(--text-tertiary)',
            fontFamily: '"Geist Mono", monospace',
          }}
        >
          {skill.frequency} · {skill.yearsOfExperience} yrs
        </div>
      </div>
      <div
        style={{
          fontSize: '11px',
          fontWeight: 500,
          padding: '3px 8px',
          borderRadius: '20px',
          background: 'var(--success-light)',
          color: 'var(--success)',
          border: '1px solid var(--success-border)',
          flexShrink: 0,
        }}
      >
        {skill.status}
      </div>
      <ChevronRight
        size={14}
        style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}
      />
    </div>
  )
}

interface CategorySectionProps {
  label: string
  categoryId: SkillCategory
  skills: SkillMedication[]
  onSkillClick: (skill: SkillMedication) => void
  onViewAll: (category: SkillCategory) => void
  isFirst: boolean
  onNodeHighlight?: (id: string | null) => void
}

function CategorySection({
  label,
  categoryId,
  skills: categorySkills,
  onSkillClick,
  onViewAll,
  isFirst,
  onNodeHighlight,
}: CategorySectionProps) {
  const visibleSkills = categorySkills.slice(0, SKILLS_PER_CATEGORY)
  const remainingCount = categorySkills.length - SKILLS_PER_CATEGORY

  return (
    <div style={{ marginTop: isFirst ? 0 : '16px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '10px',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--text-tertiary)',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
        <div
          style={{
            flex: 1,
            height: '1px',
            background: 'var(--border-light)',
          }}
        />
        <span
          style={{
            fontSize: '11px',
            color: 'var(--text-tertiary)',
            fontFamily: '"Geist Mono", monospace',
            whiteSpace: 'nowrap',
          }}
        >
          {categorySkills.length} items
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {visibleSkills.map((skill) => (
          <SkillRow
            key={skill.id}
            skill={skill}
            onClick={() => onSkillClick(skill)}
            onHighlight={onNodeHighlight}
          />
        ))}
      </div>
      {remainingCount > 0 && (
        <button
          onClick={() => onViewAll(categoryId)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '8px',
            padding: '4px 0',
            minHeight: '44px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 500,
            color: 'var(--accent)',
            fontFamily: 'inherit',
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--accent-hover)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--accent)'
          }}
          aria-label={`View all ${categorySkills.length} ${label} skills`}
        >
          View all ({categorySkills.length})
          <ChevronRight size={12} />
        </button>
      )}
    </div>
  )
}

interface RepeatMedicationsSubsectionProps {
  onNodeHighlight?: (id: string | null) => void
}

export function RepeatMedicationsSubsection({ onNodeHighlight }: RepeatMedicationsSubsectionProps) {
  const { openPanel } = useDetailPanel()

  const groupedSkills = categoryConfig.map(({ id, label }) => ({
    id,
    label,
    skills: skills
      .filter((s) => s.category === id)
      .sort((a, b) => b.proficiency - a.proficiency),
  }))

  const handleSkillClick = (skill: SkillMedication) => {
    openPanel({ type: 'skill', skill })
  }

  const handleViewAll = (category: SkillCategory) => {
    openPanel({ type: 'skills-all', category })
  }

  return (
    <div>
      <CardHeader
        dotColor="amber"
        title="REPEAT MEDICATIONS"
        rightText="Active prescriptions"
      />
      {groupedSkills.map((group, index) => (
        <CategorySection
          key={group.id}
          label={group.label}
          categoryId={group.id}
          skills={group.skills}
          onSkillClick={handleSkillClick}
          onViewAll={handleViewAll}
          isFirst={index === 0}
          onNodeHighlight={onNodeHighlight}
        />
      ))}
    </div>
  )
}
