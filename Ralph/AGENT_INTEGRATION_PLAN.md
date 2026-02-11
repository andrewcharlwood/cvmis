# Agent Output to Ralph Files Integration Plan

## Overview

This plan documents how to decode the agent output files from `AgentOutput/` and place the design recommendations into the relevant Ralph reference files in `Tasks/07-the-clinical-record/Ralph/refs/`.

---

## Agent to Ralph File Mapping

| Agent File | Component | Target Ralph File | Status |
|------------|-----------|-------------------|--------|
| `agent-a19ebc6.jsonl` | LoginScreen | `ref-transition-login.md` | ✅ Has existing design guidance |
| `agent-a1dd546.jsonl` | PatientBanner | `ref-banner-sidebar.md` | Needs design guidance appended |
| `agent-aa811d1.jsonl` | PatientBanner (detailed) | `ref-banner-sidebar.md` | Use for design decisions |
| `agent-aff857c.jsonl` | ClinicalSidebar | `ref-banner-sidebar.md` | Add to same file |
| `agent-a8a7a9b.jsonl` | PMRInterface + Breadcrumb | `ref-banner-sidebar.md` | Add layout guidance |
| `agent-a2bbd7e.jsonl` | InvestigationsView + DocumentsView | `ref-investigations-documents.md` | Needs design guidance |
| `agent-acompact-a5ee2e.jsonl` | Investigations + Documents (compact) | `ref-investigations-documents.md` | Alternative source |
| `agent-a32017e.jsonl` | SummaryView + Clinical Alert | `ref-summary-alert.md` | Needs alert interaction details |
| `agent-a403d5f.jsonl` | ReferralsView | `ref-referrals.md` | Needs form styling guidance |
| `agent-aab6185.jsonl` | MedicationsView | `ref-medications.md` | Needs table styling guidance |
| `agent-aeb60ce.jsonl` | ProblemsView | `ref-problems.md` | Needs traffic light guidance |
| `agent-afebbe0.jsonl` | ConsultationsView | `ref-consultations.md` | Needs H/E/P structure guidance |

---

## Design Guidance Structure to Add

Each Ralph file should have a "## Design Guidance (from /frontend-design)" section appended with:

1. **Aesthetic Direction** - The design philosophy/tone
2. **Key Design Decisions** - Specific implementation choices
3. **Implementation Patterns** - Code snippets and patterns

---

## File-by-File Plan

### 1. ref-transition-login.md

**Already contains design guidance** - verify it matches agent output:

From agent-a19ebc6:
- ✅ Aesthetic: Institutional Utilitarian
- ✅ Shadow: `0 1px 2px rgba(0,0,0,0.03)`
- ✅ Border: `1px solid #E5E7EB`
- ✅ Font: Geist Mono for credentials
- ✅ Accessibility: role="status", aria-label, prefers-reduced-motion

**Action**: Already complete - no changes needed.

---

### 2. ref-banner-sidebar.md

**Current content**: Patient Banner specs, Sidebar navigation, URL routing

**Needs to add from agents**:

From agent-aa811d1 (PatientBanner detailed):
- Animation refinements: Framer Motion AnimatePresence for condensed/full state swap
- Badge styling: True pill shape (rounded-full)
- NHS Number tooltip: Custom styled tooltip with Framer Motion
- Mobile overflow menu: AnimatePresence for enter/exit
- Action buttons: Loading state with spinner
- Layout measurements: Exact padding, margin values

From agent-aff857c (ClinicalSidebar):
- Keyboard navigation details: Alt+1-7, arrow keys, / for search
- Search input integration
- Tooltip positioning for tablet mode
- Focus management patterns
- Accessibility: aria-current for active item

From agent-a8a7a9b (PMRInterface + Breadcrumb):
- Layout timing: Patient banner (200ms), sidebar (250ms, 50ms delay), content (300ms, 100ms delay)
- View switching: INSTANT - no crossfade
- Breadcrumb deepening: When item expanded, show item name
- Breadcrumb styling: Inter 400, 13px, gray-400, chevron separators

**Action**: Append comprehensive design guidance section.

---

### 3. ref-investigations-documents.md

**Current content**: Table layouts, status badges, expanded views

**Needs to add from agent-a2bbd7e/acompact**:

Shared Pattern: ExpandableRow
- Component structure for row expansion
- Height animation only (200ms ease-out) - no opacity fade
- Chevron rotation (180 degrees)
- Only one expanded at a time

InvestigationsView specific:
- Status badges: Complete (green), Ongoing (amber), Live (pulsing green)
- Pulsing animation for Live status (CSS keyframes)
- Tree-indented structure with box-drawing characters
- View Results button pattern for external links

DocumentsView specific:
- Lucide icons mapping: FileText, Award, GraduationCap, FlaskConical
- Document type indicators
- Same tree-indented structure

**Action**: Append design guidance with expandable row patterns.

---

### 4. ref-summary-alert.md

**Current content**: Summary cards layout, Clinical Alert behavior

**Needs to add from agent-a32017e**:

Clinical Alert (signature interaction):
- Spring animation (not ease-out) for slide down
- Acknowledge button flow:
  1. Warning icon cross-fades to green checkmark (200ms)
  2. Holds 200ms
  3. Alert height collapses (200ms ease-out)
- Session-only state (resets on refresh)

Summary Cards:
- Two-column key-value layout exact specs
- Card header styling: Inter 600, 14px, uppercase, #F9FAFB bg
- Traffic light dots: 8px circles with text labels (WCAG)
- "View Full List" link patterns

Second Alert (Consultations view):
- Trigger: First navigation to Consultations
- Same dismiss pattern as main alert
- Positioning beneath patient banner

**Action**: Append alert animation details and card styling specs.

---

### 5. ref-referrals.md

**Current content**: Form layout, priority toggle, direct contact

**Needs to add from agent-a403d5f**:

Referral Form:
- Priority radio button styling: Urgent (red), Routine (blue), Two-Week Wait (amber)
- Tooltip content: "All enquiries are welcome..." and "NHS cancer referral pathway..."
- Input focus state: NHS blue border + box-shadow `0 0 0 3px rgba(0,94,184,0.15)`
- Form validation patterns

Submit Button States:
- Default: NHS blue (#005EB8)
- Loading: Spinner icon
- Success: Checkmark + reference number generation (REF-YYYY-MMDD-NNN)
- Success message styling: 24-48 hours response time

**Action**: Append form interaction and state management patterns.

---

### 6. ref-medications.md

**Current content**: Table layout, medication categories, prescribing history

**Needs to add from agent-aab6185**:

Table Styling:
- Semantic HTML: table, thead, th (scope=col), tbody, tr, td
- Headers: Inter 600, 13px, uppercase, #F9FAFB bg
- Row height: 40px exactly
- Alternating backgrounds: #FFFFFF / #F9FAFB
- Hover: #EFF6FF (no transform, no lift)
- Status dots: 6px green circles + 'Active' text

Category Tabs:
- Active tab: White bg + NHS blue bottom border
- Inactive tab: Transparent bg
- Tab switching animation (instant)

Sortable Columns:
- Click header to sort
- Arrow indicator (up/down) in active column
- Default: category grouping

Prescribing History:
- Expand animation: Height only, 200ms ease-out
- Geist Mono 12px for history entries
- Year markers bold, descriptions regular

**Action**: Append table semantics and sorting patterns.

---

### 7. ref-problems.md

**Current content**: Active/resolved problems tables, traffic lights

**Needs to add from agent-aeb60ce**:

Traffic Light Status:
- 8px circles: Green (resolved), Amber (in-progress)
- MUST ALWAYS be paired with text labels (WCAG requirement)
- Never dots alone
- Code column: Geist Mono (e.g., [EFF001], [MGT001])

Expandable Rows:
- Full narrative: Problem, approach, tools, quantified outcome
- 'Linked consultations' buttons that navigate to Consultations view
- Row hover: #EFF6FF

Table Structure:
- Active Problems: Status | Code | Problem | Since
- Resolved Problems: Status | Code | Problem | Resolved | Outcome

**Action**: Append traffic light accessibility requirements.

---

### 8. ref-consultations.md

**Current content**: Journal layout, H/E/P structure, coded entries

**Needs to add from agent-afebbe0**:

Collapsed Entry:
- Date in Geist Mono 13px gray-500
- Organization in Inter 400 13px NHS blue
- Role in Inter 600 15px gray-900
- 'Key:' prefix in Inter 500 gray-500
- Status dot: Green (current), Gray (historical)
- 3px left border color-coded: NHS blue (#005EB8) or Tesco teal (#00897B)

Expanded Entry:
- Duration line
- HISTORY / EXAMINATION / PLAN section headers
- Headers: Inter 600, 12px, uppercase, letter-spacing 0.05em, gray-400
- Plan items as bullet lists
- CODED ENTRIES section at bottom: Geist Mono 12px, gray-500, bracket codes

Animation:
- Height-only expand animation, 200ms ease-out
- NO opacity fade on content
- Only one expanded at a time
- Chevron rotates 180 degrees when expanded

Second Alert:
- Appears on first navigation to Consultations view
- Same Acknowledge pattern as main alert
- Warning icon → Checkmark → Collapse

**Action**: Append H/E/P styling and animation details.

---

## Implementation Order

1. **Start with**: ref-banner-sidebar.md (most complex, multiple agents)
2. **Then**: ref-investigations-documents.md (shared patterns)
3. **Then**: ref-summary-alert.md (signature interaction)
4. **Then**: ref-consultations.md (core content view)
5. **Then**: ref-medications.md, ref-problems.md, ref-referrals.md (specialized views)

---

## Token-Efficient Approach

For each file:

1. Read the agent output file (focused read, only design guidance section)
2. Extract: Aesthetic direction, Key design decisions, Implementation patterns
3. Read the target Ralph file
4. Append the design guidance in the standard format
5. Write back
6. Clear context, move to next

This keeps context window usage minimal by processing one file at a time.

---

## Design Guidance Section Template

```markdown

---

## Design Guidance (from /frontend-design)

> Pre-baked design direction. Do NOT invoke `/frontend-design` at runtime — this section contains the output.

### Aesthetic Direction: [Name]

[Description of the design philosophy]

### Key Design Decisions

1. **[Decision name]**: [Description with specific values]
2. **[Decision name]**: [Description with specific values]
...

### Implementation Patterns

```tsx
// Key code patterns and snippets
```
```

---

## Completion Checklist

- [ ] ref-transition-login.md - Verify existing content (no changes needed)
- [ ] ref-banner-sidebar.md - Add PatientBanner, ClinicalSidebar, PMRInterface guidance
- [ ] ref-investigations-documents.md - Add InvestigationsView + DocumentsView guidance
- [ ] ref-summary-alert.md - Add SummaryView + Clinical Alert guidance
- [ ] ref-referrals.md - Add ReferralsView guidance
- [ ] ref-medications.md - Add MedicationsView guidance
- [ ] ref-problems.md - Add ProblemsView guidance
- [ ] ref-consultations.md - Add ConsultationsView guidance

---

## Notes

- All design guidance should be appending (not replacing) existing content
- Existing content in Ralph files has the "what" and "why"
- Design guidance adds the "how" with specific implementation details
- Keep code snippets minimal but complete enough to guide implementation
- Reference specific values: colors, fonts, sizes, timing functions
