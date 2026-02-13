import type { KPI } from '@/types/pmr'

export const kpis: KPI[] = [
  {
    id: 'budget',
    value: '£220M',
    label: 'Budget Oversight',
    sub: 'NHS prescribing',
    colorVariant: 'green',
    explanation: 'Managed the ICB\'s total prescribing budget with sophisticated forecasting models identifying cost pressures and enabling proactive financial planning across Norfolk & Waveney.',
  },
  {
    id: 'savings',
    value: '£14.6M',
    label: 'Efficiency Savings',
    sub: 'Identified & tracked',
    colorVariant: 'amber',
    explanation: 'Identified and prioritised a £14.6M efficiency programme through comprehensive data analysis; achieved over-target performance through targeted, evidence-based interventions across the integrated care system.',
  },
  {
    id: 'years',
    value: '9+',
    label: 'Years in NHS',
    sub: 'Since 2016',
    colorVariant: 'teal',
    explanation: 'Continuous NHS service since August 2016, progressing from community pharmacy through prescribing data analysis to system-level population health data leadership.',
  },
  {
    id: 'team',
    value: '12',
    label: 'Team Size Led',
    sub: 'Cross-functional',
    colorVariant: 'green',
    explanation: 'Led a cross-functional team of 12 spanning data analysts, population health specialists, and pharmacists across data, analytics, and population health workstreams.',
  },
]
