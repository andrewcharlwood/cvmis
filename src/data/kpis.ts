import type { KPI } from '@/types/pmr'

export const kpis: KPI[] = [
  {
    id: 'budget',
    value: '£220M',
    label: 'Budget Oversight',
    sub: 'NHS prescribing',
    colorVariant: 'green',
    explanation: 'Full analytical accountability for the ICB\'s total prescribing budget, with sophisticated forecasting models identifying cost pressures and enabling proactive financial planning across Norfolk & Waveney.',
    story: {
      context: 'Total primary care prescribing budget for NHS Norfolk & Waveney ICB, covering prescriptions for a population of 1.2 million across the integrated care system. Expenditure driven by GP prescribing patterns, NICE technology appraisal mandates, patent expiry timelines, and pharmaceutical pricing changes.',
      role: 'Full analytical accountability to ICB board for budget oversight and variance analysis. Built sophisticated forecasting models integrating prescribing trend data, cost pressure drivers, and efficiency programme trajectories. Delivered monthly financial reporting to the executive team and presented budget position to Chief Medical Officer bimonthly.',
      outcomes: [
        'Forecasting models identifying cost pressures ahead of materialisation',
        'Proactive financial planning embedded across the medicines optimisation programme',
        'Interactive Power BI dashboard tracking expenditure patterns against plan',
        'Monthly variance analysis and financial reporting to executive team and ICB board',
      ],
      period: 'Jul 2024 – Present',
    },
  },
  {
    id: 'savings',
    value: '£14.6M',
    label: 'Efficiency Savings',
    sub: 'Identified & tracked',
    colorVariant: 'amber',
    explanation: 'Identified and prioritised a £14.6M efficiency programme through comprehensive prescribing data analysis; achieved over-target performance through targeted, evidence-based interventions across the integrated care system.',
    story: {
      context: 'System-wide efficiency programme identified through comprehensive analysis of real-world GP prescribing data, targeting high-cost medicines with cost-effective alternatives, generic switching opportunities, and evidence-based formulary optimisation across all practices in the integrated care system.',
      role: 'Led the data analysis to identify, quantify, and prioritise efficiency opportunities. Built automated analytical tools compressing months of manual work into days. Designed the programme structure, set targets, and tracked delivery against plan. Created a novel GP incentive scheme linking payment to demonstrated savings.',
      outcomes: [
        'Identified and prioritised £14.6M efficiency programme through automated prescribing data analysis',
        'Achieved over-target performance by October 2025',
        'Built Python-based switching algorithm identifying 14,000 patients and £2.6M in annual savings',
        'Automated incentive scheme with novel GP payment system: 50% prescribing reduction in 2 months',
      ],
      period: 'May 2025 – Nov 2025',
    },
  },
  {
    id: 'algorithm',
    value: '£2.6M',
    label: 'Algorithm Savings',
    sub: '14,000 patients in 3 days',
    colorVariant: 'teal',
    explanation: 'Built a Python-based switching algorithm using real-world GP prescribing data to automatically identify patients on expensive drugs suitable for cost-effective alternatives, compressing months of manual analysis into 3 days.',
    story: {
      context: 'The annual medicines switching scheme previously required the optimisation team to spend months manually searching for opportunities across hundreds of thousands of prescriptions, identifying generic availability, price changes, and clinically appropriate alternatives one drug at a time.',
      role: 'Designed and built a Python algorithm ingesting real-world GP prescribing data, cross-referencing dm+d product information, clinical safety rules, and cost-effectiveness thresholds to automatically identify the optimal set of patient switches for maximum savings with minimum clinical intervention. Created the accompanying GP incentive payment system linking rewards to delivered savings.',
      outcomes: [
        '14,000 patients identified for cost-effective switching in 3 days versus months manually',
        '£2.6M in annual savings identified, with £2M on target for delivery',
        'Novel GP payment system linking incentive rewards to actual savings delivered',
        '50% reduction in targeted prescribing within the first two months of deployment',
      ],
      period: '2025',
    },
  },
  {
    id: 'population',
    value: '1.2M',
    label: 'Population Served',
    sub: 'Norfolk & Waveney ICS',
    colorVariant: 'teal',
    explanation: 'Leading population health analytics and data-driven medicines optimisation for Norfolk & Waveney Integrated Care System, serving 1.2 million people across the region.',
    story: {
      context: 'Norfolk & Waveney Integrated Care System serves a population of 1.2 million people across Norfolk and parts of Suffolk, coordinating health and care services across primary care, secondary care, community services, and mental health provision.',
      role: 'Lead population health analytics for the medicines optimisation function, developing patient-level datasets and analytical frameworks from real-world GP prescribing data to identify efficiency opportunities, monitor medicines safety, address health inequalities, and support evidence-based decision-making at system scale.',
      outcomes: [
        'Transformed analytics from practice-level aggregate reporting to patient-level SQL analysis',
        'Built comprehensive dm+d medicines data table: standardised strengths, morphine equivalents, Anticholinergic Burden scoring',
        'Developed population-scale controlled drug monitoring system tracking patient-level opioid exposure',
        'Created self-serve Power BI tools improving data fluency across the wider team',
      ],
      period: 'Jul 2024 – Present',
    },
  },
]