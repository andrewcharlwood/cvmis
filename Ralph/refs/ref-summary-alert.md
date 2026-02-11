# Reference: Summary View + Clinical Alert

> Extracted from goal.md — Summary View and Clinical Alert sections. This is the landing view after login.

---

## Summary View

The landing view after login. This mimics the "Patient Summary" screen — the first screen a clinician sees when opening a patient record, showing the most important information at a glance.

**Layout:** A grid of summary cards arranged in a 2-column layout on desktop, single column on mobile. Each card has a header bar with the card title in Inter 600, 14px, uppercase, on a `#F9FAFB` background with `1px solid #E5E7EB` bottom border.

### Card 1: Patient Demographics (spans full width)

```
+--[ Patient Demographics ]------------------------------------------+
| Name:         Andrew Charlwood          Status:    Active (dot)    |
| DOB:          14 February 1993          Location:  Norwich, UK     |
| Registration: GPhC 2211810              Since:     August 2016     |
| Qualification: MPharm (Hons) 2:1        University: UEA, 2015     |
+---------------------------------------------------------------------+
```

A two-column key-value table. Labels in Inter 500, 13px, gray-500. Values in Inter 400, 14px, gray-900. Labels right-aligned, values left-aligned — mimicking clinical system demographics layout.

### Card 2: Active Problems (left column)

```
+--[ Active Problems ]-----------------------------------------------+
| (green dot) Deputy Head, Pop. Health & Data Analysis   Jul 2024-Present   |
|   NHS Norfolk & Waveney ICB                                         |
| (green dot) 220M prescribing budget management          Ongoing            |
| (amber dot) Patient-level SQL analytics transformation  In progress        |
+---------------------------------------------------------------------+
```

A list with green dots for active/current items, amber dots for in-progress items. Each entry has a title in Inter 500, 14px, and a date range or status in Geist Mono, 12px, right-aligned. Click an entry to navigate to the corresponding Consultation.

### Card 3: Current Medications — Quick View (right column)

```
+--[ Current Medications (Quick View) ]-------------------------------+
| Python          | 90%  | Daily     | Active (green dot)            |
| SQL             | 88%  | Daily     | Active (green dot)            |
| Power BI        | 92%  | Daily     | Active (green dot)            |
| Data Analysis   | 95%  | Daily     | Active (green dot)            |
| JS / TypeScript | 70%  | Weekly    | Active (green dot)            |
|                                          [View Full List ->]        |
+---------------------------------------------------------------------+
```

A compact 4-column table showing the top 5 skills. "View Full List" links to the Medications view. Table headers are uppercase, 12px, gray-400. Table rows alternate between `#FFFFFF` and `#F9FAFB` backgrounds.

### Card 4: Last Consultation (spans full width)

```
+--[ Last Consultation ]----------------------------------------------+
| Date: May 2025   Clinician: A. Charlwood   Location: NHS N&W ICB    |
|                                                                      |
| Interim Head, Population Health & Data Analysis                      |
| Led strategic delivery of population health initiatives and          |
| data-driven medicines optimisation across Norfolk & Waveney ICS...   |
|                                            [View Full Record ->]     |
+---------------------------------------------------------------------+
```

A preview of the most recent role, truncated to 2-3 lines. "View Full Record" navigates to Consultations with that entry expanded.

### Card 5: Alerts (full width, positioned above all other cards)

This is the Clinical Alert — see below.

---

## The Clinical Alert (Signature Interaction)

When the user first loads the Summary view (immediately after the login transition), a clinical alert banner slides down from beneath the patient banner.

### Alert Styling

```
+--[ WARNING CLINICAL ALERT ]------------------------------------------+
| WARNING  ALERT: This patient has identified 14.6M in prescribing     |
|    efficiency savings across Norfolk & Waveney ICS.                  |
|                                                         [Acknowledge]|
+----------------------------------------------------------------------+
```

- Background: amber (`#FEF3C7` — amber-100, light amber)
- Left border: 4px solid `#F59E0B` (amber-500)
- Warning icon: `AlertTriangle` from Lucide, amber-600
- Text: Inter 500, 14px, `#92400E` (amber-800)
- "Acknowledge" button: small outlined button, amber border and text

### Behavior

1. The alert slides down from beneath the patient banner with a spring animation (250ms, slight overshoot) after the PMR interface finishes materializing.
2. It pushes the Summary content downward, so it's impossible to miss.
3. Clicking "Acknowledge" triggers a brief animation: a green checkmark replaces the warning icon (200ms), then the alert collapses upward (200ms, ease-out) and is gone.
4. The dismiss state is stored in React state (session-only) — refreshing the page shows the alert again.

### Why This Works

Clinical alerts are the mechanism that clinical systems use to put critical information in front of clinicians before they do anything else. They are the highest-priority information in the system. By framing Andy's most impressive metric ("14.6M") as a clinical alert, it gets the same treatment — it's the first thing the user reads, it demands acknowledgment, and its format gives the number institutional weight. This is not a boast in a paragraph; it's a system-generated alert based on data. The framing makes the achievement feel objective.

### Second Alert (on Consultations view)

When the user first navigates to Consultations, a secondary alert appears:

```
WARNING  NOTE: Patient has developed a Python-based switching algorithm
   identifying 14,000 patients for cost-effective medication alternatives.
   2.6M annual savings potential. Review recommended.
```

This second alert reinforces the key technical achievement in clinical language. It appears only once (on first navigation to Consultations) and is dismissible with the same "Acknowledge" interaction.

---

## Design Guidance (from /frontend-design)

### Aesthetic Direction

**Clinical Precision Meets Professional Polish**

The NHS clinical record aesthetic draws from real-world electronic patient record systems (EPR), balancing institutional gravitas with polished execution. Key visual principles:

- **Light-mode ONLY** — Consistent with clinical systems that prioritize readability over dark aesthetics
- **NHS blue (#005EB8)** — Institutional anchor color for headers and accents
- **Card-based architecture** — All information lives in contained, bordered cards (1px solid #E5E7EB, 4px border-radius)
- **Monospace for data** — Geist Mono for all coded entries, dates, and numerical values (creates clinical system authenticity)
- **High information density** — Compact layouts that maximize data visibility (16px card padding, tight line-heights)
- **Status dots** — Green/amber/red traffic light indicators for at-a-glance status assessment

### Key Design Decisions

**1. Spring Animation for Alert Slide-Down**

The Clinical Alert uses a spring animation (Framer Motion `type: 'spring'`) rather than ease-out. This creates a subtle overshoot effect that feels "alive" — mimicking how real clinical alerts materialize in systems like EMIS or SystmOne.

```
Initial state: y: -100%, opacity: 0
Animate to: y: 0, opacity: 1
type: 'spring', stiffness: 300, damping: 25
```

**2. Acknowledge → Checkmark → Collapse Sequence**

The dismissal interaction follows a deliberate three-phase sequence:

1. **Acknowledge click** (0ms) — Button triggers dismissal state
2. **Icon cross-fade** (200ms) — AlertTriangle fades out, CheckCircle fades in (green-600)
3. **Hold beat** (200ms) — Checkmark holds briefly to confirm action completion
4. **Height collapse** (200ms ease-out) — Alert height animates to 0, content slides up

This sequence transforms dismissal from a jarring disappearance into a satisfying confirmation action.

**3. Typography Hierarchy**

- **Card headers**: Inter 600, 14px, uppercase, letter-spacing-wide — creates clear section delineation
- **Labels**: Inter 500, 13px, gray-500, right-aligned — mimics clinical form layout
- **Values**: Inter 400, 14px, gray-900, left-aligned — primary data focus
- **Coded values**: Geist Mono, 12px — all dates, IDs, percentages, status codes

### Implementation Patterns

**ClinicalAlert Component**

```typescript
// State machine for alert lifecycle
type AlertState = 'visible' | 'acknowledging' | 'dismissing' | 'dismissed'

// Props interface
interface ClinicalAlertProps {
  variant: 'warning' | 'note'
  icon: typeof AlertTriangle | typeof Info
  message: string
  onDismiss: () => void
  storageKey?: string // For session persistence
}

// Animation variants
const alertVariants = {
  hidden: { y: '-100%', opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 25 }
  },
  exit: { 
    height: 0, 
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeOut' }
  }
}

const iconVariants = {
  warning: { scale: 1, opacity: 1 },
  acknowledged: { 
    scale: [1, 1.1, 1], 
    opacity: [1, 0],
    transition: { duration: 0.2 }
  }
}
```

**SummaryView Component**

```typescript
// Grid layout structure
const layoutConfig = {
  container: 'grid grid-cols-1 md:grid-cols-2 gap-4',
  demographics: 'col-span-full', // Spans both columns
  problems: 'col-span-1',
  medications: 'col-span-1',
  consultation: 'col-span-full'
}

// Card header pattern
const CardHeader = ({ title }: { title: string }) => (
  <div className="bg-[#F9FAFB] border-b border-[#E5E7EB] px-4 py-3">
    <h3 className="font-inter font-semibold text-sm uppercase tracking-wide">
      {title}
    </h3>
  </div>
)

// Key-value row pattern (for Demographics)
interface KeyValueRowProps {
  label: string
  value: string
  isMono?: boolean
}

const KeyValueRow = ({ label, value, isMono }: KeyValueRowProps) => (
  <div className="grid grid-cols-[1fr_auto] gap-4 py-1">
    <span className="font-inter font-medium text-[13px] text-gray-500 text-right">
      {label}
    </span>
    <span className={`font-inter text-sm text-gray-900 text-left ${isMono ? 'font-geist-mono' : ''}`}>
      {value}
    </span>
  </div>
)

// Problem list pattern with traffic lights
interface ProblemItemProps {
  status: 'active' | 'in-progress'
  title: string
  date: string
  onClick?: () => void
}

const ProblemItem = ({ status, title, date, onClick }: ProblemItemProps) => (
  <div 
    onClick={onClick}
    className="flex items-center gap-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
  >
    <div className={cn(
      'w-2 h-2 rounded-full',
      status === 'active' ? 'bg-green-500' : 'bg-amber-500'
    )} />
    <span className="flex-1 font-inter font-medium text-sm">{title}</span>
    <span className="font-geist-mono text-xs text-gray-500">{date}</span>
  </div>
)
```

**Animation Constants**

```typescript
// Timing constants (ms)
export const ANIMATION = {
  SPRING_DURATION: 250,
  ICON_CROSSFADE: 200,
  HOLD_BEAT: 200,
  COLLAPSE_DURATION: 200
} as const

// Easing
export const EASING = {
  spring: { type: 'spring', stiffness: 300, damping: 25 },
  easeOut: { ease: 'easeOut' }
} as const
```

### Color Palette

```css
/* NHS System Colors */
--nhs-blue: #005EB8;
--nhs-light-blue: #41B6E6;

/* Alert Colors */
--amber-100: #FEF3C7;
--amber-500: #F59E0B;
--amber-600: #D97706;
--amber-800: #92400E;
--green-500: #22C55E;
--green-600: #16A34A;

/* UI Colors */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-400: #9CA3AF;
--gray-500: #6B7280;
--gray-900: #111827;
--border: #E5E7EB;
```
