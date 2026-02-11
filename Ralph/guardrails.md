# Guardrails — Clinical Record PMR System

## Standard Guardrails

### Frontend-design skill requirement
- **When**: Writing ANY component with visual styling, animations, or UI elements
- **Rule**: You MUST invoke the `/frontend-design` skill before writing code. This applies to: LoginScreen, PatientBanner, ClinicalSidebar, ClinicalAlert, all View components (Summary, Consultations, Medications, Problems, Investigations, Documents, Referrals), and any table, card, or form component.
- **Why**: The frontend-design skill provides specialized capabilities for creating polished, professional-grade visual output. This is a high-fidelity clinical interface requiring exact color matching and spacing.

### Light-mode only constraint
- **When**: Implementing any styling for the PMR interface
- **Rule**: This design is LIGHT-MODE ONLY. Never implement dark mode. Clinical systems operate in light mode due to high ambient lighting in consulting rooms. Use white backgrounds (`#FFFFFF`), cool light gray content areas (`#F5F7FA`), and dark text (`#111827`).
- **Why**: Dark mode would break the clinical system metaphor entirely.

### Clinical system navigation behavior
- **When**: Implementing sidebar navigation and view switching
- **Rule**: View switching must be INSTANT — no crossfade, no slide animation, no transition. When a sidebar item is clicked, the main content area replaces immediately. This matches EMIS Web, SystmOne, and other clinical systems exactly.
- **Why**: Clinical systems prioritize speed and responsiveness over visual flair. Any animation here breaks the authenticity.

### Table markup requirements
- **When**: Building the Medications, Problems, Investigations, or Documents tables
- **Rule**: Use proper semantic HTML `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` elements. Headers must use `scope="col"`. Never use divs styled as tables. Tables must have `1px solid #E5E7EB` borders on all cells, 40px row height, and alternating row colors.
- **Why**: Screen readers rely on proper table markup to navigate data tables. Clinical systems use real tables.

### Traffic light accessibility
- **When**: Using green/amber/red status indicators
- **Rule**: Traffic light dots (8px circles) must ALWAYS accompany text labels ("Active", "Resolved", "In Progress"). Never use color alone to communicate status. This applies to Problems status, Medications status, and Investigations status.
- **Why**: WCAG 2.1 AA requirement — color cannot be the sole means of conveying information.

### CV content accuracy
- **When**: Adding CV content to data files
- **Rule**: Use exact data from `References/CV_v4.md`. Key numbers must match: £14.6M efficiency programme, 14,000 patients, £2.6M savings, 70% reduction, 200 hours saved, £1M revenue, £220M budget. Dates must be accurate: Interim Head (May-Nov 2025), Deputy Head (Jul 2024-Present), etc.
- **Why**: Inaccurate CV data is a critical error. The PMR system presents factual career information.

### NHS blue brand color
- **When**: Using the primary accent color
- **Rule**: Use exact NHS blue `#005EB8` for: active sidebar border, buttons, links, column headers, organization names. This is the actual NHS brand blue. Never use a different shade.
- **Why**: NHS blue is instantly recognizable to healthcare professionals. Wrong blue breaks the authenticity.

### TypeScript strictness
- **When**: Writing any TypeScript code
- **Rule**: No `any` types. Define interfaces for all data structures in `src/types/pmr.ts`. Use proper React.FC types or function component signatures with typed props. Enable strict mode in tsconfig.json.
- **Why**: Type safety is critical for maintainability. The data layer has complex types (Consultation, Medication with history, Problem with codes).

### Reduced motion support
- **When**: Implementing animations (login typing, alert slide, consultation expand)
- **Rule**: All animations must respect `prefers-reduced-motion: reduce`. With reduced motion: login typing completes instantly, alert appears without slide, consultation expand is instant, banner condensation is instant.
- **Why**: Accessibility requirement for users with vestibular disorders.

### No console errors
- **When**: Writing JavaScript/TypeScript
- **Rule**: No errors in the browser console. Handle edge cases: fuse.js search with no results, table sorting with empty data, form validation, animation cleanup on unmount.
- **Why**: Console errors suggest broken functionality and are a quality check failure.

### Responsive breakpoints
- **When**: Adding responsive CSS/Tailwind classes
- **Rule**: Must work at 3 breakpoints: desktop (>1024px with full sidebar), tablet (768-1024px with icon-only sidebar), mobile (<768px with bottom nav). Tables must adapt: full columns on desktop, scrollable on tablet, card layout on mobile.
- **Why**: Clinical records may be viewed on tablets in consulting rooms or mobile devices.

## Project-Specific Guardrails

### ECG flatline transition
- **When**: Modifying ECGAnimation component
- **Rule**: The ECG must end with a flatline (horizontal line extending rightward from the name) that visually reads as a patient monitor flatline. This transitions to the login screen background (#1E293B). Do NOT fade to white — the previous design did that, but this design requires the flatline → login sequence.
- **Why**: The flatline signals "end of patient monitoring, opening clinical record." It's a narrative transition.

### Login typing animation
- **When**: Implementing LoginScreen component
- **Rule**: Username "A.CHARLWOOD" types character-by-character at 30ms per character. Password fills with 8 dots at 20ms per dot. Use Geist Mono font for the typing. Blinking cursor appears during typing.
- **Why**: The login sequence is the most immersive transition. Every NHS worker recognizes typing credentials into a clinical system.

### Consultation format fidelity
- **When**: Building ConsultationsView
- **Rule**: Each consultation MUST have History, Examination, and Plan sections. Use uppercase section headers with letter-spacing (Inter 600, 12px, gray-400). History = context/background, Examination = analysis/findings (bullet list), Plan = outcomes/delivery (bullet list). Include coded entries at bottom in [XXX000] format.
- **Why**: This is the clinical SOAP note format. The mapping to career content is the core concept.

### Medication table columns
- **When**: Building MedicationsView
- **Rule**: Table must have exactly these columns: Drug Name, Dose (%), Frequency, Start (year), Status. All columns must be sortable. Default grouping: Active Medications (technical), Clinical Medications (healthcare), PRN (strategic).
- **Why**: Medications tables in clinical systems have standard columns. This mapping provides more information than typical skills sections.

### Clinical alert behavior
- **When**: Implementing ClinicalAlert component
- **Rule**: Alert appears on Summary view load with spring animation (250ms). Must include warning icon, amber background (#FEF3C7), amber left border, and "Acknowledge" button. Clicking Acknowledge: icon → green checkmark (200ms) → alert collapses upward (200ms). Use `role="alert"` and `aria-live="assertive"`.
- **Why**: The clinical alert is the signature interaction. It frames the £14.6M achievement with institutional weight.

### Coded entries format
- **When**: Adding coded entries to consultations or problems
- **Rule**: Use fictional but consistent SNOMED-style codes: [EFF001] for efficiency, [ALG001] for algorithms, [AUT001] for automation, [SQL001] for data, [BUD001] for budget, [TRN001] for transformation, [LEA001] for leadership, etc. Codes in Geist Mono 12px, gray-500.
- **Why**: Clinical systems use coded entries (SNOMED CT, Read codes). This maintains the metaphor.

### Sidebar navigation structure
- **When**: Building ClinicalSidebar
- **Rule**: Exactly 7 items in this order: Summary, Consultations, Medications, Problems, Investigations, Documents, Referrals. Use Lucide icons: ClipboardList, FileText, Pill, AlertTriangle, FlaskConical, FolderOpen, Send. Separator line after Summary. Active state: 3px NHS blue left border.
- **Why**: This matches clinical record navigation categories. Order matters for Alt+1-7 shortcuts.

### Patient banner data
- **When**: Building PatientBanner
- **Rule**: Full name "CHARLWOOD, Andrew (Mr)" (surname first, comma-separated). DOB "14/02/1993" (DD/MM/YYYY). NHS No "221 181 0" (GPhC number formatted like NHS number with tooltip). Address "Norwich, NR1". Status "Active" with green dot. Badge "Open to opportunities".
- **Why**: This is the most recognizable PMR element. Format must match clinical systems exactly.

### Keyboard shortcuts
- **When**: Implementing navigation
- **Rule**: Alt+1 through Alt+7 must activate corresponding sidebar items. Escape closes expanded items and menus. / focuses search. Implement roving tabindex in sidebar (Up/Down arrows navigate, Enter activates).
- **Why**: Clinical systems have keyboard shortcuts for rapid navigation. This is expected behavior.

### Form validation
- **When**: Building ReferralsView form
- **Rule**: Referrer Name and Email are required. Show validation errors if empty on submit. Generate reference number in format REF-YYYY-MM-DD-NNN from current date. Success message shows reference and "Expected response time: 24-48 hours."
- **Why**: Clinical referral forms have validation. The reference number mimics real NHS referral references.

### Mobile bottom navigation
- **When**: Implementing responsive mobile layout
- **Rule**: On mobile (<768px), sidebar becomes bottom nav bar with 7 icon buttons (56px height, safe area padding). Patient banner becomes minimal. Tables switch to card layout. Add back arrow in each view returning to Summary.
- **Why**: Mobile clinical apps use bottom tabs. This matches the NHS App and EMIS Mobile patterns.

### Search implementation
- **When**: Adding search functionality
- **Rule**: Use fuse.js with threshold 0.3. Index all content: consultation titles/bullets, medication names, problem descriptions, investigation names, document titles. Group results by section. Clicking result navigates to view and expands matching item.
- **Why**: Clinical systems have record search. Fuse.js provides fuzzy matching for medical record lookups.
