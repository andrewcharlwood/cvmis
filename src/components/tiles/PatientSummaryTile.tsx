import React from 'react'
import { Card, CardHeader } from '../Card'
import { personalStatement } from '@/data/profile'

export function PatientSummaryTile() {
  const bodyStyles: React.CSSProperties = {
    fontSize: '13px',
    lineHeight: '1.6',
    color: 'var(--text-primary)',
  }

  return (
    <Card full>
      <CardHeader dotColor="teal" title="PATIENT SUMMARY" />
      <div style={bodyStyles}>{personalStatement}</div>
    </Card>
  )
}
