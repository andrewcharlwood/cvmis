import type { KPI } from '@/types/pmr'

export const kpis: KPI[] = [
  {
    id: 'budget',
    value: '£215M',
    label: 'Budget Oversight',
    sub: 'Bimonthly CMO financial reporting',
    colorVariant: 'green',
    explanation: 'Full analytical accountability for the ICB\'s primary care prescribing budget, building forecasting models that integrate prescribing trends, NICE mandate costs, patent expiry timelines, and efficiency programme trajectories to enable proactive financial planning.',
    story: {
      context: 'Total primary care prescribing budget for NHS Norfolk & Waveney ICB, serving 1.2 million people. Expenditure driven by GP prescribing patterns, NICE technology appraisal mandates, patent expiry timelines, and pharmaceutical pricing changes.',
      role: 'Full analytical accountability for budget monitoring and forecasting. Built models integrating multiple cost-pressure drivers to identify risks early and inform strategic decision-making. Presented budget position and evidence-based recommendations to Chief Medical Officer bimonthly.',
      outcomes: [
        'Forecasting models integrating prescribing trends, NICE mandates, and patent expiry timelines',
        'Proactive identification of cost pressures enabling early intervention',
        'Interactive Power BI dashboard tracking real-time expenditure against plan',
        'Bimonthly evidence-based financial reporting direct to CMO',
      ],
      period: 'Jul 2024 – Present',
    },
  },
  {
    id: 'savings',
    value: '£14.6M',
    label: 'Efficiency Programme',
    sub: 'Over-target delivery by Oct 2025',
    colorVariant: 'amber',
    explanation: 'Designed, prioritised, and tracked a £14.6M system-wide efficiency programme from prescribing data analysis through to GP-level delivery, achieving over-target performance within six months.',
    story: {
      context: 'System-wide efficiency programme requiring identification of cost-effective switching opportunities across hundreds of thousands of prescriptions, target-setting for individual GP practices, and a mechanism to incentivise and track delivery.',
      role: 'Led end-to-end programme design: identified and quantified opportunities through automated prescribing analysis, set practice-level targets, designed a novel GP incentive scheme linking payment directly to demonstrated savings, and tracked delivery against plan.',
      outcomes: [
        '£14.6M efficiency programme identified, prioritised, and structured for delivery',
        'Over-target performance achieved by October 2025',
        'Novel GP incentive scheme linking payment to verified savings',
        '50% reduction in targeted prescribing within first two months of deployment',
      ],
      period: 'May 2025 – Nov 2025',
    },
  },
    {
    id: 'prescriptions',
    value: '20M',
    label: 'Prescriptions decoded annually',
    sub: '90% coverage — free text to structured data',
    colorVariant: 'teal',
    explanation: 'Hybrid regex and AI pipeline parsing free-text prescription directions across 22M annual prescriptions, achieving 90% coverage (19.8M prescriptions) with structured daily quantities. Enables prescription duration calculations, adherence analysis, and over/underprescribing detection — now in production across the ICB\'s analytical infrastructure.',
    story: {
      context: 'NHS prescription directions are written as free text ("take one twice daily", "apply sparingly as needed", "two puffs morning and night"). With 22M prescriptions annually, determining how long a prescription should last, a fundamental clinical and financial question, was effectively unanswerable at population scale.',
      role: 'Designed and built the full parsing pipeline: regular expressions handling standard patterns, with AI inference for complex or ambiguous directions. Maps drug-direction combinations to structured daily quantities, enabling duration calculations from prescription quantity data. Deployed into the production database as a reusable lookup.',
      outcomes: [
        '90% coverage achieved — 19.8M of 22M annual prescriptions parsed into structured daily quantities',
        'Structured daily quantity data enabling prescription duration calculation at population scale',
        'Foundation for adherence analysis and over/underprescribing detection — currently under investigation',
        'Hybrid regex/AI approach handling both standard and complex direction formats',
      ],
      period: '2024 – Present',
    },
  },
  {
    id: 'algorithm',
    value: '£2.6M',
    label: 'Switching Algorithm',
    sub: 'Highest-opportunities identified, and clinically reviewed in 3 days',
    colorVariant: 'teal',
    explanation: 'Python algorithm that ingests real-world GP prescribing data, cross-references clinical safety rules and cost-effectiveness thresholds, and automatically identifies the optimal set of patient switches — compressing months of manual analysis into 3 days.',
    story: {
      context: 'The annual medicines switching programme previously required months of manual work to identify clinically appropriate, cost-effective alternatives one drug at a time. Usually resulting in needing to switch 30-40k patients to meet savings targets',
      role: 'Designed and built the algorithm from scratch, integrating dm+d product data, clinical safety rules, and cost-effectiveness thresholds. Reimplemented in DAX as a self-serve Power BI tool for the wider medicines optimisation team.',
      outcomes: [
        '14,000 patients identified with medicines for cost-effective switching, with switches clinically reviewed and approved in 3 days vs months manually',
        '£2.6M annual savings identified; £2M on target for delivery in-year',
        'Reimplemented in DAX as internal Power BI tool for team self-service',
        'Methodology reusable annually with updated prescribing data',
      ],
      period: '2025',
    },
  },
]