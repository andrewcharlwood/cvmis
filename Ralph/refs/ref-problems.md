# Reference: Problems View (= Achievements / Challenges)

> Extracted from goal.md — Problems View section. Career achievements framed as clinical problems that were identified, treated, and resolved.

---

## Overview

The "Problems" list in a clinical record tracks diagnoses — conditions that were identified, treated, and either resolved or require ongoing management. This maps perfectly to career achievements: challenges that Andy identified and resolved.

## Two Sections: Active Problems and Resolved Problems

### Active Problems (current / ongoing)

```
+--[ Active Problems ]----------------------------------------------------+
| Status | Code      | Problem                              | Since      |
|--------+-----------+--------------------------------------+------------|
| AMB    | [MGT001]  | 220M prescribing budget oversight    | Jul 2024   |
| GRN    | [TRN001]  | Patient-level SQL transformation     | 2025       |
| AMB    | [LEA001]  | Team data literacy programme         | Jul 2024   |
+-------------------------------------------------------------------------+
```

### Resolved Problems (past achievements)

```
+--[ Resolved Problems ]--------------------------------------------------+
| Status | Code      | Problem                        | Resolved  | Outcome                                  |
|--------+-----------+--------------------------------+-----------+------------------------------------------|
| GRN    | [EFF001]  | Manual prescribing analysis    | Oct 2025  | Python algorithm: 14,000 pts, 2.6M/yr   |
|        |           | inefficiency                   |           |                                          |
| GRN    | [EFF002]  | 14.6M efficiency target        | Oct 2025  | Over-target performance achieved         |
| GRN    | [AUT001]  | Blueteq form creation backlog  | 2023      | 70% reduction, 200hrs saved              |
| GRN    | [INN001]  | Asthma screening scalability   | 2019      | National rollout: ~300 branches, ~1M     |
| GRN    | [AUT002]  | Incentive scheme manual calc.  | 2025      | Automated: 50% Rx reduction in 2 months  |
| GRN    | [DAT001]  | HCD spend tracking gaps        | 2023      | Blueteq-secondary care data integration  |
| GRN    | [VIS001]  | Patient pathway opacity        | 2023      | Sankey chart analysis tool               |
| GRN    | [MON001]  | Population opioid exposure     | 2024      | CD monitoring system: OME tracking       |
|        |           | monitoring                     |           |                                          |
+-------------------------------------------------------------------------+
```

## Column Definitions

| Column | Meaning |
|--------|---------|
| Status | Traffic light: Green (resolved), Amber (in progress / active), Red (urgent — unused, reserved) |
| Code | SNOMED-style reference code. Fictional but internally consistent. Formatted in Geist Mono. |
| Problem | The challenge or opportunity Andy identified |
| Resolved | Date or year the problem was resolved |
| Outcome | Brief description of the resolution and its measurable impact |

## Expandable Rows

Each problem row can be expanded to show a full narrative: what the problem was, how Andy approached it, what tools/methods were used, and the quantified outcome. The expanded state also shows "linked consultations" — clicking a link navigates to the relevant entry in Consultations view.

## Traffic Light Status Indicators

Traffic lights are 8px circles with the status colors (green, amber, red, gray). They appear inline before the code column. This is exactly how clinical systems indicate problem severity/status — it's an immediately scannable visual language.

---

## Design Guidance

### Aesthetic Direction

**Clinical Luxury** — The Problems view uses the clinical structure of a problem list (traffic lights, coded entries, expandable narratives) but executes with premium refinement. White card surfaces with layered shadows, generous padding, refined typography. The visual power comes from the *content structure* — traffic light dots and expandable narratives do the heavy lifting — while the luxury finish makes it feel polished and intentional.

The distinctiveness comes from the *concept itself* — framing career achievements as a Problem List is the creative act. The premium execution makes it memorable.

### Key Design Decisions

1. **Traffic Light Status Indicators (WCAG Critical)**
   - 8px circles: green (`#22C55E`) for resolved, amber (`#F59E0B`) for in-progress
   - **MUST ALWAYS be paired with text labels** — never dots alone (WCAG 1.4.1 requirement)
   - Each status shows both the colored dot AND the text label (e.g., "● Resolved", "● In Progress")
   - Implementation uses flexbox with gap-2 for dot-label pairing

2. **Typography System**
   - **[UI font]** for all body text, headers, and UI labels (Elvaro or Blumir — see CLAUDE.md)
   - **Geist Mono** for codes and dates — SNOMED-style codes like `[EFF001]`, `[MGT001]` must be monospace
   - Font sizes: 13px for table headers (uppercase, tracking-wider), 14px for body text
   - Header styling: `font-ui font-semibold text-xs uppercase tracking-wider text-gray-400`

3. **Color Palette (Locked)**
   - Light-mode ONLY
   - NHS Blue: `#005EB8` (Tailwind `text-pmr-nhsblue`) — used for links and accents
   - Borders: `1px solid #E5E7EB` (gray-200) — consistent table borders
   - Row hover: `#EFF6FF` (blue-50) — subtle highlight
   - Background: White cards on `#F5F7FA` (pmr-content) background with layered shadows per design system
   - Border radius: 4px for clinical elements

4. **Table Structure**
   - Semantic HTML: `<table>`, `<thead>`, `<th scope="col">`, `<tbody>`, `<tr>`, `<td>`
   - Two separate tables: Active Problems (4 columns) and Resolved Problems (6 columns)
   - Column widths fixed for Status (w-28), Code (w-28), Since/Resolved (w-28)
   - Alternating row backgrounds not used — clean white with hover state only

5. **Expandable Rows Pattern**
   - Chevron icon in rightmost column indicates expandability
   - Expanded content shows in a full-width sub-row below
   - Animation: height transition 200ms ease-out (respects prefers-reduced-motion)
   - Expanded background: `#F9FAFB` (gray-50) with narrative text and linked consultations

6. **Mobile Layout**
   - Card-based layout below breakpoint (isMobile from useBreakpoint hook)
   - Each problem becomes a rounded card with stacked information
   - Status and code on same line, problem description prominent
   - Expandable via button press, showing narrative and linked consultations

### Implementation Patterns

**TrafficLight Component (WCAG Compliant):**
```tsx
function TrafficLight({ status }: { status: ProblemStatus }) {
  const colorMap: Record<ProblemStatus, { bg: string; label: string }> = {
    Active: { bg: 'bg-green-500', label: 'Active' },
    'In Progress': { bg: 'bg-amber-500', label: 'In Progress' },
    Resolved: { bg: 'bg-green-500', label: 'Resolved' },
  }

  const { bg, label } = colorMap[status]

  return (
    <div className="flex items-center gap-2">
      <span
        className={`w-2 h-2 rounded-full ${bg}`}
        aria-label={`Status: ${label}`}
        role="img"
      />
      <span className="text-xs text-gray-600">{label}</span>
    </div>
  )
}
```

**Code Column (Geist Mono):**
```tsx
<td className="border border-gray-200 px-3 py-2.5">
  <span className="font-mono text-xs text-gray-500">[{problem.code}]</span>
</td>
```

**Row Hover Effect:**
```tsx
<tr className={`cursor-pointer hover:bg-blue-50 transition-colors ${
  isExpanded ? 'bg-blue-50' : ''
}`}>
```

**Expandable Row Animation:**
```tsx
<div
  style={{
    height: isExpanded ? contentHeight : 0,
    overflow: 'hidden',
    transition: prefersReducedMotion ? 'none' : 'height 200ms ease-out',
  }}
>
  <div ref={contentRef} className="bg-gray-50 p-4">
    {/* Narrative content */}
  </div>
</div>
```

**Linked Consultations Navigation:**
```tsx
<button
  onClick={(e) => {
    e.stopPropagation()
    handleLinkedClick(consultation.id)
  }}
  className="inline-flex items-center gap-1 text-xs text-pmr-nhsblue hover:underline"
>
  <ExternalLink className="w-3 h-3" />
  {consultation.organization} — {consultation.role}
</button>
```

### Mobile Card Layout

On mobile devices (`isMobile` from useBreakpoint hook), the table transforms into cards:
- White background cards with `border border-gray-200 rounded`
- Status dot + code on one line
- Problem description as card title
- Since/Resolved date below
- Chevron indicates expandability
- Expanded state shows narrative and linked consultations below

### Accessibility Requirements

1. **WCAG 1.4.1 Use of Color**: Never rely on color alone — traffic lights MUST have text labels
2. **Semantic HTML**: Proper `<table>` structure with `<th scope="col">` for headers
3. **ARIA**: `aria-expanded` on toggle buttons, `aria-label` on status dots
4. **Motion**: Respect `prefers-reduced-motion` for expand/collapse animations
5. **Focus management**: Linked consultation buttons are keyboard navigable

