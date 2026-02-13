import type { KPI } from '@/types/pmr'

export const kpis: KPI[] = [
  {
    id: 'budget',
    value: '£220M',
    label: 'Budget Oversight',
    sub: 'NHS prescribing',
    colorVariant: 'green',
    explanation: 'Managed the ICB\'s total prescribing budget with sophisticated forecasting models identifying cost pressures and enabling proactive financial planning across Norfolk & Waveney.',
    story: {
      context: 'Total prescribing budget for NHS Norfolk & Waveney ICB, covering primary care prescriptions for a population of 1.2 million across the integrated care system.',
      role: 'Managed with sophisticated forecasting models, identifying cost pressures and enabling proactive financial planning. Full analytical accountability to ICB board for budget oversight and variance analysis.',
      outcomes: [
        'Sophisticated forecasting models identifying cost pressures ahead of time',
        'Proactive financial planning enabled across the system',
        'Interactive dashboard tracking expenditure patterns in real-time',
        'Monthly variance analysis and financial reporting to executive team',
      ],
      period: 'Jul 2024 — Present',
    },
  },
  {
    id: 'savings',
    value: '£14.6M',
    label: 'Efficiency Savings',
    sub: 'Identified & tracked',
    colorVariant: 'amber',
    explanation: 'Identified and prioritised a £14.6M efficiency programme through comprehensive data analysis; achieved over-target performance through targeted, evidence-based interventions across the integrated care system.',
    story: {
      context: 'System-wide efficiency programme identified through comprehensive analysis of real-world prescribing data, targeting high-cost medicines with cost-effective alternatives and evidence-based switching opportunities.',
      role: 'Led data analysis to identify, prioritise, and track the efficiency programme. Built automated analysis tools to compress months of manual work into days, enabling targeted interventions across the integrated care system.',
      outcomes: [
        'Identified £14.6M efficiency programme through automated data analysis',
        'Achieved over-target performance by October 2025',
        'Built Python switching algorithm identifying 14,000 patients and £2.6M savings',
        'Automated incentive scheme analysis with novel GP payment system',
      ],
      period: 'May 2025 — Nov 2025',
    },
  },
  {
    id: 'years',
    value: '9+',
    label: 'Years in NHS',
    sub: 'Since 2016',
    colorVariant: 'teal',
    explanation: 'Continuous NHS service since August 2016, progressing from community pharmacy through prescribing data analysis to system-level population health data leadership.',
    story: {
      context: 'Career journey spanning community pharmacy, hospital interface, and system-level population health analytics across NHS Norfolk & Waveney, demonstrating continuous progression and expanding scope of impact.',
      role: 'Progressed from frontline community pharmacy through prescribing data analysis roles to system-level population health leadership, consistently taking on greater analytical and strategic responsibility across the integrated care system.',
      outcomes: [
        'Community pharmacy foundation: patient care and medicines optimisation (2016-2022)',
        'High-cost drugs and interface: NICE implementation and pathway development (2022-2024)',
        'Population health leadership: data-driven decision making at system scale (2024-present)',
        'Self-taught Python, SQL, and analytics to solve complex problems at scale',
      ],
      period: 'Aug 2016 — Present',
    },
  },
  {
    id: 'population',
    value: '1.2M',
    label: 'Population Served',
    sub: 'Norfolk & Waveney ICS',
    colorVariant: 'teal',
    explanation: 'Leading population health analytics and data-driven medicines optimisation for Norfolk & Waveney Integrated Care System, covering 1.2 million people across the region.',
    story: {
      context: 'Norfolk & Waveney Integrated Care System serves a population of 1.2 million people across Norfolk and parts of Suffolk, with responsibility for coordinating health and care services across primary care, secondary care, and community services.',
      role: 'Lead population health analytics, developing patient-level datasets and analytical frameworks from real-world GP prescribing data to identify efficiency opportunities, address health inequalities, and support data-driven decision making at system scale.',
      outcomes: [
        'Transformed analytics from practice-level to patient-level SQL analysis',
        'Built comprehensive medicines data table integrating all dm+d products',
        'Developed population-scale controlled drug monitoring system',
        'Created self-serve analytical tools enabling wider team data fluency',
      ],
      period: 'Jul 2024 — Present',
    },
  },
]
