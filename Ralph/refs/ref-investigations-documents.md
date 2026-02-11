# Reference: Investigations View (= Projects) + Documents View (= Education)

> Extracted from goal.md — Investigations and Documents sections. Two simpler views that share the expandable-row pattern.

---

## Investigations View (= Projects)

Projects presented as diagnostic investigations — tests that were ordered, performed, and returned results.

### Investigation List

```
+--[ Investigation Results ]----------------------------------------------+
| Test Name                    | Requested | Status   | Result            |
|------------------------------+-----------+----------+-------------------|
| PharMetrics Interactive      | 2024      | Complete | Live (green)      |
|   Platform                   |           |          |                   |
| Patient Switching Algorithm  | 2025      | Complete | 14,000 pts found  |
| Blueteq Generator            | 2023      | Complete | 70% reduction     |
| CD Monitoring System         | 2024      | Complete | Population-scale  |
| Sankey Chart Analysis Tool   | 2023      | Complete | Pathway audit     |
| Patient Pathway Analysis     | 2024      | Ongoing  | In development    |
+-------------------------------------------------------------------------+
```

### Status Badges

Styled like laboratory result status indicators:
- **Complete** (green dot): Investigation finished, results available
- **Ongoing** (amber dot): Investigation still in progress
- **Live** (pulsing green dot): Results are actively being used (for PharMetrics, which is a live URL)

### Expanded Investigation View

Clicking an investigation row reveals a detailed "results panel" below the row:

```
PharMetrics Interactive Platform
|-- Date Requested:  2024
|-- Date Reported:   2024
|-- Status:          Complete - Live at medicines.charlwood.xyz
|-- Requesting Clinician: A. Charlwood
|-- Methodology:
|    Real-time medicines expenditure dashboard providing
|    actionable analytics for NHS decision-makers. Built with
|    Power BI and SQL, tracking expenditure across the 220M
|    prescribing budget.
|-- Results:
|    - Real-time tracking of medicines expenditure
|    - Actionable analytics for budget holders
|    - Self-serve model for wider team
|-- Tech Stack:     Power BI, SQL, DAX
|-- [View Results ->]  (external link to medicines.charlwood.xyz)
```

The expanded view uses a tree-like indented structure (with box-drawing characters in monospace) to present the investigation report. This mirrors how lab results and imaging reports appear in clinical systems — structured, indented, with labelled fields.

### "View Results" Link

For PharMetrics (the only project with a live URL), a "View Results" button appears styled as an NHS blue action button. For internal projects, this button is absent.

---

## Documents View (= Education & Certifications)

Education and certifications presented as attached documents in the patient record.

### Document List

```
+--[ Attached Documents ]-------------------------------------------------+
| Type           | Document                         | Date    | Source     |
|----------------+----------------------------------+---------+------------|
| Certificate    | MPharm (Hons) 2:1                | 2015    | UEA        |
| Registration   | GPhC Pharmacist Registration     | 2016    | GPhC       |
| Certificate    | Mary Seacole Programme (78%)     | 2018    | NHS LA     |
| Results        | A-Levels: Maths A*, Chem B,     | 2011    | Highworth  |
|                | Politics C                       |         | Grammar    |
| Research       | Drug Delivery & Cocrystals       | 2015    | UEA        |
|                | (75.1% Distinction)              |         |            |
+-------------------------------------------------------------------------+
```

### Document Type Icons

Small document icons from Lucide:
- `FileText` for certificates
- `Award` for registrations
- `GraduationCap` for academic results
- `FlaskConical` for research

### Expanded Document Preview

```
MPharm (Hons) 2:1 - University of East Anglia
|-- Type:           Academic Qualification
|-- Date Awarded:   2015
|-- Institution:    University of East Anglia, Norwich
|-- Classification: Upper Second-Class Honours (2:1)
|-- Duration:       2011 - 2015 (4 years)
|-- Research:       Drug delivery and cocrystals
|                   Grade: 75.1% (Distinction)
|-- Notes:          MPharm is a 4-year integrated Master's degree
                    required for pharmacist registration in the UK.
```

The preview panel uses the same tree-indented structure as the Investigations expanded view, maintaining visual consistency across the PMR interface.

---

## Design Guidance (from /frontend-design)

### Aesthetic Direction

**Tone:** Clinical utilitarian — faithful reproduction of NHS clinical software (EMIS Web / SystmOne). Zero decorative flourish. Borders as the dominant structuring element. Dense, scannable, table-first. Light-mode only. The visual language is institutional and familiar to any NHS clinician.

**Differentiation:** The expanded-row tree-indented monospace structure using box-drawing characters is the signature element. It transforms a flat data table into something that reads like a lab report or radiology result — structured, indented, with labelled fields in `Geist Mono`. The pipe-and-branch characters (`├─`, `│`, `└─`) create a distinctly clinical-system aesthetic that no standard portfolio site would ever use.

### Key Design Decisions

#### ExpandableRow Component Pattern

Both views share an identical expand/collapse mechanic:

1. **Collapsed State:** Standard table row with hover feedback (slight background tint)
2. **Expand Trigger:** Click anywhere on the row
3. **Expanded State:** Full-width panel slides down below the row with `AnimatePresence`
4. **Visual Connection:** Expanded panel has left border matching the row's status color
5. **Tree Structure:** Expanded content uses box-drawing characters for clinical report aesthetic

**Status Badge System:**
- **Complete** (green dot): `#10B981` background, used for finished investigations
- **Ongoing** (amber dot): `#F59E0B` background, used for in-progress work  
- **Live** (pulsing green dot): `#10B981` with CSS pulse animation, used for active/live URLs

#### Typography & Spacing

- **Primary font:** Inter (text, labels, table headers)
- **Monospace font:** Geist Mono (tree-indented expanded content)
- **Border radius:** 4px throughout
- **Border color:** `#E5E7EB` (Tailwind gray-200)
- **NHS Blue:** `#005EB8` (action buttons, links)

### Implementation Patterns

#### StatusBadge Component

```tsx
interface StatusBadgeProps {
  status: 'complete' | 'ongoing' | 'live';
  label: string;
}

const StatusBadge = ({ status, label }: StatusBadgeProps) => {
  const styles = {
    complete: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    ongoing: 'bg-amber-100 text-amber-800 border-amber-200',
    live: 'bg-emerald-100 text-emerald-800 border-emerald-200 animate-pulse',
  };

  const dotColors = {
    complete: 'bg-emerald-500',
    ongoing: 'bg-amber-500',
    live: 'bg-emerald-500 animate-ping',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[status]}`} />
      {label}
    </span>
  );
};
```

#### Tree-Indented Content Structure

```tsx
const TreeLine = ({ label, value, isLast = false }: TreeLineProps) => (
  <div className="font-mono text-sm text-gray-700">
    <span className="text-gray-400">{isLast ? '└─ ' : '├─ '}</span>
    <span className="text-gray-500">{label}:</span>
    <span className="ml-2">{value}</span>
  </div>
);

// Usage in expanded view:
<div className="bg-gray-50 border-l-4 border-emerald-400 pl-4 py-3">
  <TreeLine label="Date Requested" value="2024" />
  <TreeLine label="Status" value="Complete" />
  <TreeLine label="Methodology" value="Power BI dashboard..." isLast />
</div>
```

#### ExpandableRow with Framer Motion

```tsx
const ExpandableRow = ({ 
  children, 
  expandedContent,
  isExpanded,
  onToggle 
}: ExpandableRowProps) => {
  return (
    <>
      <tr 
        onClick={onToggle}
        className="cursor-pointer hover:bg-gray-50 transition-colors"
      >
        {children}
      </tr>
      <AnimatePresence>
        {isExpanded && (
          <motion.tr
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <td colSpan={4} className="p-0 border-b">
              {expandedContent}
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
};
```

#### Document Type Icons

```tsx
import { FileText, Award, GraduationCap, FlaskConical } from 'lucide-react';

const documentIcons = {
  certificate: FileText,
  registration: Award,
  academic: GraduationCap,
  research: FlaskConical,
};

const DocumentIcon = ({ type }: { type: keyof typeof documentIcons }) => {
  const Icon = documentIcons[type];
  return <Icon className="w-4 h-4 text-gray-500" />;
};
```

#### Mobile Card Layout

On mobile (<768px), both views switch to card layouts:

```tsx
// Mobile: Card layout with vertical stacking
<div className="md:hidden space-y-3">
  {investigations.map((inv) => (
    <div key={inv.id} className="bg-white rounded border p-4">
      {/* Card content */}
    </div>
  ))}
</div>

// Desktop: Table layout
<table className="hidden md:table w-full">
  {/* Table content */}
</table>
```

### Tech Stack Integration

- **React 18** with TypeScript strict mode
- **Tailwind CSS** for all styling (no CSS-in-JS)
- **Framer Motion 11** for expand/collapse animations
- **Lucide React** for document type icons
- **Geist Mono** font for tree-indented content (add to index.html)
