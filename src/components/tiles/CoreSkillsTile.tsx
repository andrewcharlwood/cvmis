import React, { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BarChart3, Code2, Database, PieChart, FileCode2 } from 'lucide-react'
import { Card, CardHeader } from '../Card'
import { skills } from '@/data/skills'
import { medications } from '@/data/medications'
import type { SkillMedication } from '@/types/pmr'

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const iconMap = {
  BarChart3,
  Code2,
  Database,
  PieChart,
  FileCode2,
}

interface SkillItemProps {
  skill: SkillMedication
  isExpanded: boolean
  onToggle: () => void
}

function SkillItem({ skill, isExpanded, onToggle }: SkillItemProps) {
  const IconComponent = iconMap[skill.icon as keyof typeof iconMap]

  // Find matching medication for prescribing history
  const medication = medications.find((m) => m.name === skill.name)

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onToggle()
      } else if (e.key === 'Escape' && isExpanded) {
        e.preventDefault()
        onToggle()
      }
    },
    [isExpanded, onToggle],
  )

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      style={{
        display: 'flex',
        flexDirection: 'column',
        fontSize: '12.5px',
        background: 'var(--bg-dashboard)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-light)',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
        ...(isExpanded && {
          borderColor: 'var(--accent-border)',
        }),
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent-border)'
      }}
      onMouseLeave={(e) => {
        if (!isExpanded) {
          e.currentTarget.style.borderColor = 'var(--border-light)'
        }
      }}
    >
      {/* Item header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 12px',
        }}
      >
        {/* Icon container */}
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            background: 'var(--accent-light)',
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {IconComponent && <IconComponent size={14} />}
        </div>

        {/* Text block */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '2px',
            }}
          >
            {skill.name}
          </div>
          <div
            style={{
              fontSize: '11px',
              color: 'var(--text-tertiary)',
              fontFamily: '"Geist Mono", monospace',
            }}
          >
            {skill.frequency} · Since {skill.startYear} · {skill.yearsOfExperience} yrs
          </div>
        </div>

        {/* Status badge */}
        <div
          style={{
            fontSize: '10px',
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
      </div>

      {/* Expanded content: prescribing history timeline */}
      <AnimatePresence initial={false}>
        {isExpanded && medication && medication.prescribingHistory && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.2, ease: 'easeOut' }
            }
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                marginLeft: '12px',
                marginRight: '12px',
                marginBottom: '12px',
                paddingLeft: '14px',
                paddingTop: '4px',
                borderLeft: '2px solid var(--accent)',
              }}
            >
              {/* Timeline entries */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {medication.prescribingHistory.map((entry, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'flex-start',
                    }}
                  >
                    {/* Timeline dot */}
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'var(--accent)',
                        flexShrink: 0,
                        marginTop: '4px',
                      }}
                    />

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          fontFamily: '"Geist Mono", monospace',
                          color: 'var(--text-primary)',
                          marginBottom: '2px',
                        }}
                      >
                        {entry.year}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                          lineHeight: 1.4,
                        }}
                      >
                        {entry.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function CoreSkillsTile() {
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null)

  const handleToggle = useCallback(
    (id: string) => {
      setExpandedItemId((prev) => (prev === id ? null : id))
    },
    [],
  )

  return (
    <Card>
      <CardHeader dotColor="amber" title="REPEAT MEDICATIONS" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {skills.map((skill) => (
          <SkillItem
            key={skill.id}
            skill={skill}
            isExpanded={expandedItemId === skill.id}
            onToggle={() => handleToggle(skill.id)}
          />
        ))}
      </div>
    </Card>
  )
}
