# Implementation Plan — Clinical Record PMR System

## Project Overview

Transform the existing React CV application into a **Patient Medical Record (PMR) system** — a faithful digital clinical information system that presents Andy's CV as a clinician would view a patient record. This is Design 7: The Clinical Record, completely replacing the previous ECG-based design.

**Core Concept:**
The "patient" is Andy's career. Users navigate a genuine PMR interface (similar to EMIS Web, SystmOne, Vision) with:
- Patient banner with persistent demographic context
- Sidebar navigation with clinical record categories (Summary, Consultations, Medications, Problems, Investigations, Documents, Referrals)
- Consultation-journal format for experience (History/Examination/Plan structure)
- Tabular medications list for skills with proficiency "dosages"
- Clinical alert system for standout achievements
- Light-mode only (authentic to clinical systems)
- Border-heavy, table-heavy, functional aesthetic

**Key Features:**
- ECG exit animation → Login sequence → PMR interface materialization (~2.7s total transition)
- Animated login screen with typing username/password
- 7 sidebar views with instant content swapping (authentic clinical system behavior)
- Expandable consultation entries with coded entries (SNOMED-style references)
- Sortable medications table with prescribing history expansion
- Traffic-light status system (green/amber/red/gray)
- Clinical alert banner with acknowledge interaction
- Responsive: desktop sidebar → tablet icon-only → mobile bottom nav
- Full keyboard navigation (Alt+1-7 shortcuts)
- Search across all PMR sections with fuse.js

**Tech Stack:**
- React 18+ with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Framer Motion for login animation and transitions
- Lucide React for clinical icons
- fuse.js for fuzzy search

**Project Structure:**
```
src/
├── components/
│   ├── BootSequence.tsx          # Existing terminal animation (preserved)
│   ├── ECGAnimation.tsx          # Modified for PMR transition
│   ├── LoginScreen.tsx           # Animated login sequence
│   ├── PMRInterface.tsx          # Main PMR layout container
│   ├── PatientBanner.tsx         # Full + condensed banner
│   ├── ClinicalSidebar.tsx       # Navigation sidebar
│   ├── ClinicalAlert.tsx         # Dismissible alert banner
│   ├── Breadcrumb.tsx            # Navigation breadcrumb
│   ├── views/
│   │   ├── SummaryView.tsx       # Patient summary landing
│   │   ├── ConsultationsView.tsx # Experience as consultations
│   │   ├── MedicationsView.tsx   # Skills as medications
│   │   ├── ProblemsView.tsx      # Achievements as problems
│   │   ├── InvestigationsView.tsx# Projects as investigations
│   │   ├── DocumentsView.tsx     # Education as documents
│   │   └── ReferralsView.tsx     # Contact as referral form
│   ├── ui/
│   │   ├── ConsultationEntry.tsx # Expandable consultation
│   │   ├── MedicationTable.tsx   # Sortable skills table
│   │   ├── ProblemEntry.tsx      # Problem list item
│   │   ├── InvestigationEntry.tsx# Investigation result
│   │   └── DocumentEntry.tsx     # Document list item
├── hooks/
│   ├── useScrollCondensation.ts  # Patient banner scroll behavior
│   └── useSearch.ts              # Fuse.js search hook
├── data/
│   ├── consultations.ts          # Experience data
│   ├── medications.ts            # Skills data
│   ├── problems.ts               # Achievements data
│   ├── investigations.ts         # Projects data
│   └── documents.ts              # Education data
├── types/
│   └── pmr.ts                    # All PMR TypeScript interfaces
├── lib/
│   └── utils.ts                  # Utility functions
├── App.tsx                       # Phase manager (boot → ecg → login → pmr)
└── index.css                     # Tailwind + PMR CSS variables
```

**Reference Materials:**
- `designs/07-the-clinical-record.md` — Complete design specification
- `References/CV_v4.md` — Source CV content
- `References/concept.html` — Previous ECG implementation (timing reference only)

---

## Quality Checks

- `npm run dev` — Development server starts without errors
- `npm run build` — Production build completes without errors
- `npm run lint` — No ESLint errors
- `npm run typecheck` — No TypeScript errors
- Manual verification:
  - Boot sequence plays (4s) → ECG flatlines → Login screen types username/password → PMR interface materializes
  - Patient banner condenses on scroll (80px → 48px)
  - All 7 sidebar views render correctly with proper data
  - Consultation entries expand/collapse with History/Examination/Plan sections
  - Medications table sorts correctly by all columns
  - Clinical alert appears on Summary view and dismisses with animation
  - Search finds content across all sections
  - Keyboard shortcuts work (Alt+1-7)
  - Responsive layouts work at 1024px, 768px, and 480px
  - No console errors
  - Accessibility: screen reader announces views, tables are navigable

---

## Tasks

- [x] **Task 1: Create PMR data layer and TypeScript types**

  Create `src/types/pmr.ts` with interfaces for: `Patient`, `Consultation` (History/Examination/Plan/CodedEntries), `Medication` (with PrescribingHistory), `Problem` (status, code, outcome), `Investigation` (with results), `Document`, `ReferralForm`. Create `src/data/` directory with files: `consultations.ts` (5 roles from CV_v4.md mapped to consultation format), `medications.ts` (18 skills mapped to medication format with prescribing history), `problems.ts` (8-10 achievements with traffic light status), `investigations.ts` (4 projects with methodology/results), `documents.ts` (MPharm, Mary Seacole, A-Levels, Research). All data must match CV_v4.md exactly with specific numbers (£14.6M, 14,000 patients, etc.).

- [x] **Task 2: Modify ECGAnimation for PMR flatline transition**

  Modify `src/components/ECGAnimation.tsx` to change the exit phase. Instead of fading to white and revealing the CV, the animation should: 1) Complete the name tracing as normal, 2) Hold for 300ms, 3) Draw a flatline extending rightward from the name over 300ms (patient monitor flatline visual), 4) Fade entire canvas to black over 200ms, 5) Transition background to dark blue-gray (#1E293B) over 200ms. Emit `onComplete` callback to trigger LoginScreen. Total ECG phase: ~5-6 seconds. Preserve all existing animation timing for heartbeats and letter tracing.

- [ ] **Task 3: Build LoginScreen component with typing animation**

  Create `src/components/LoginScreen.tsx`. Dark blue-gray background (#1E293B). Centered white login card (320px wide, 12px radius, subtle shadow). NHS-blue shield icon at top. Username field: types "A.CHARLWOOD" character-by-character (30ms per char, Geist Mono font). Password field: fills with 8 dots (20ms per dot). "Log In" button: NHS blue (#005EB8), full width. After 150ms pause, button shows pressed state (darkens, 100ms), then emits `onComplete` callback. Total login animation: ~1.2s. Respect `prefers-reduced-motion`: with reduced motion, username appears instantly and login completes in ~500ms.

- [ ] **Task 4: Build PatientBanner component (full and condensed)**

  Create `src/components/PatientBanner.tsx` with two modes. Full banner (80px): patient name "CHARLWOOD, Andrew (Mr)", DOB "14/02/1993", NHS No "221 181 0" (GPhC number formatted), address "Norwich, NR1", phone, email, status "Active" (green dot), badge "Open to opportunities". Action buttons: Download CV, Email, LinkedIn. Condensed banner (48px, sticky after 100px scroll): name, NHS No, status dot, action buttons only. Use `useScrollCondensation` hook with IntersectionObserver. Smooth height transition (200ms). Banner spans full viewport width.

- [ ] **Task 5: Build ClinicalSidebar component with navigation and search**

  Create `src/components/ClinicalSidebar.tsx`. 220px width (desktop), dark blue-gray (#1E293B) background. Header: "CareerRecord PMR v1.0.0". 7 navigation items with Lucide icons: Summary (ClipboardList), Consultations (FileText), Medications (Pill), Problems (AlertTriangle), Investigations (FlaskConical), Documents (FolderOpen), Referrals (Send). Active state: 3px NHS blue left border, white background tint. Separator line after Summary. Footer: "Session: A.CHARLWOOD" and current time. Search input in header with fuse.js integration. Clicking item updates active view instantly (no animation). URL hash updates (#summary, #consultations, etc.).

- [ ] **Task 6: Build SummaryView component with clinical alert**

  Create `src/components/views/SummaryView.tsx`. Grid layout with cards: Patient Demographics (full width, two-column key-value table), Active Problems (left column, green/amber dots with dates), Current Medications Quick View (right column, 4-column table showing top 5 skills), Last Consultation preview (full width, truncated to 2-3 lines with "View Full Record" link). Clinical Alert banner: amber background (#FEF3C7), amber left border, warning icon, text "ALERT: This patient has identified £14.6M in prescribing efficiency savings...", Acknowledge button. Alert slides down with spring animation (250ms) after view loads. Clicking Acknowledge: icon changes to green checkmark (200ms), then alert collapses upward (200ms).

- [ ] **Task 7: Build ConsultationsView with History/Examination/Plan structure**

  Create `src/components/views/ConsultationsView.tsx`. Reverse-chronological journal of 5 roles. Each entry: collapsed state shows date, organization (NHS blue), role title, key coded entry, expand chevron. Click to expand: shows Duration, HISTORY section (context/background), EXAMINATION section (bullet list of analysis/findings), PLAN section (bullet list of outcomes), CODED ENTRIES (SNOMED-style codes like [EFF001], [ALG001]). Section headers styled as clinical consultation dividers (uppercase, letter-spacing). Only one entry expanded at a time. Color-coded left border: NHS blue for NHS N&W ICB, Teal (#00897B) for Tesco PLC. Expand animation: height 0→auto (200ms, ease-out).

- [ ] **Task 8: Build MedicationsView with sortable table and prescribing history**

  Create `src/components/views/MedicationsView.tsx`. Three category tabs: Active Medications (technical skills), Clinical Medications (healthcare domain skills), PRN (strategic skills). Each tab shows a table: Drug Name | Dose (%) | Frequency | Start | Status. Sortable columns: clicking header sorts (asc/desc toggle). Default sort: by category grouping. Table styling: gray-200 borders, alternating row colors, 40px row height. Hover: subtle blue tint (#EFF6FF). Click row to expand "Prescribing History" — mini-timeline showing skill progression (year + description). History styled in Geist Mono. 18 total medications mapped from CV skills with accurate proficiency percentages and usage frequencies.

- [ ] **Task 9: Build ProblemsView with traffic light system**

  Create `src/components/views/ProblemsView.tsx`. Two sections: Active Problems and Resolved Problems. Table columns: Status (traffic light dot), Code (SNOMED-style in Geist Mono), Problem description, Since/Resolved date, Outcome (for resolved). Traffic lights: 8px circles — green (resolved/current), amber (in progress), gray (inactive/historical). Active problems: £220M budget oversight, SQL transformation, data literacy programme. Resolved problems: 8 achievements with specific outcomes ("Python algorithm: 14,000 pts, £2.6M/yr", "70% reduction, 200hrs saved", etc.). Click row to expand full narrative with "linked consultations" navigation.

- [ ] **Task 10: Build InvestigationsView with results panel**

  Create `src/components/views/InvestigationsView.tsx`. Projects presented as diagnostic investigations. Table: Test Name | Requested | Status | Result. Status badges: Complete (green dot), Ongoing (amber dot), Live (pulsing green dot for PharMetrics). 5 investigations: PharMetrics Interactive Platform, Patient Switching Algorithm, Blueteq Generator, CD Monitoring System, Sankey Chart Analysis Tool. Click row to expand "results panel" with tree-indented structure: Date Requested, Date Reported, Status, Requesting Clinician, Methodology, Results, Tech Stack. PharMetrics has "View Results" button linking to medicines.charlwood.xyz.

- [ ] **Task 11: Build DocumentsView for education/certifications**

  Create `src/components/views/DocumentsView.tsx`. Education presented as attached documents. Table: Type (icon), Document, Date, Source. Icons: FileText (certificates), Award (registrations), GraduationCap (academic), FlaskConical (research). 4 documents: MPharm (Hons) 2:1 UEA 2015, GPhC Registration 2016, Mary Seacole Programme 2018, A-Levels 2011 + Drug Delivery Research. Click to expand "preview" panel with tree-indented details: Type, Date Awarded, Institution, Classification, Duration, Research details, Notes. Consistent with Investigations expanded view style.

- [ ] **Task 12: Build ReferralsView with clinical referral form**

  Create `src/components/views/ReferralsView.tsx`. Contact presented as clinical referral form. Form fields: Referring to (pre-filled: CHARLWOOD, Andrew), NHS Number (pre-filled), Priority toggle (radio: Urgent [red], Routine [blue/selected], Two-Week Wait [amber] with tongue-in-cheek tooltips), Referrer Name/Email/Org inputs, Reason for Referral textarea, Contact Method radio (Email/Phone/LinkedIn). Submit button: NHS blue, full width right half. On submit: loading spinner, then success message with reference number (REF-2026-0210-001 format). Below form: Direct Contact table with Email, Phone, LinkedIn, Location as clickable links.

- [ ] **Task 13: Implement keyboard shortcuts and accessibility**

  Add keyboard navigation throughout. Global shortcuts: Alt+1-7 activate sidebar items, Escape closes expanded items/menus, / focuses search. Sidebar: Up/Down arrows navigate items, Enter activates. Implement focus management: after login, focus moves to first sidebar item; after view change, focus moves to view heading; after expanding item, focus moves to content. Add ARIA: `role="navigation"` on sidebar, `aria-current="page"` on active item, `role="alert"` on clinical alert, proper table markup with `scope="col"`, `aria-expanded` on expandable items. Test with screen reader: views announced, tables navigable, alert read immediately.

- [ ] **Task 14: Implement responsive design (tablet and mobile)**

  Tablet (768-1024px): Sidebar collapses to 56px icon-only with tooltips on hover. Patient banner always condensed (48px). Tables may horizontally scroll with indicator. Mobile (<768px): Sidebar becomes bottom navigation bar (56px height, 7 icon buttons, safe area padding). Patient banner becomes minimal top bar. Tables switch to card layout (each row becomes stacked card). Search moves to top of each view. Add back navigation arrow in each view. Test all breakpoints: desktop (>1024), tablet (768-1024), mobile (<768). Ensure touch targets minimum 48px. Test on actual mobile device or emulator.

- [ ] **Task 15: Final integration, testing, and polish**

  Wire up App.tsx with three phases: BootSequence (4s) → ECGAnimation (modified for flatline) → LoginScreen (1.2s) → PMRInterface. Ensure smooth transitions between phases. Run all quality checks. Verify TypeScript strict mode (no `any` types). Verify all CV content accuracy against CV_v4.md (dates, numbers, achievements). Test all interactive elements: sidebar nav, consultation expand, medication sort, alert acknowledge, referral form submit. Verify responsive layouts at all breakpoints. Test accessibility with keyboard navigation and screen reader. Verify search finds content across all sections. Final production build test.
