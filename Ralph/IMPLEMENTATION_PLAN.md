# Implementation Plan — The Clinical Record (v3)

## Project Overview

A premium portfolio CV presented as a clinical information system. The *structure* and *layout* come from GP software (EMIS Web, SystmOne) — patient banner, sidebar navigation, consultation journal, medications table, etc. — but the *execution* is **Clinical Luxury**: refined typography, layered shadows, generous spacing, premium fonts, atmospheric depth.

**This is NOT a faithful NHS clone.** It's a showcase portfolio that *evokes* clinical software while being distinctly beautiful.

**What's already done:** Data files (`src/data/*`), type system (`src/types/pmr.ts`), phase management (`App.tsx`), boot sequence, ECG animation, and design system foundation (Tailwind tokens, fonts, CSS variables).

**What this plan builds:** The visual layer from login screen through to the full PMR interface — every component rebuilt to Clinical Luxury quality with the new premium font, refined surfaces, and user-interactive login.

## Quality Checks

Run after every task. All must pass before committing.

```
npm run typecheck
npm run lint
npm run build
```

## Reference Files

Each task references files in `Ralph/refs/`. Read the referenced file(s) for full design specs, implementation patterns, and code snippets. The ref files ARE the spec — do not duplicate their content here.

Always also read `Ralph/refs/ref-design-system.md` — it is the single source of truth for colors, typography, spacing, surfaces, and motion.

Also read `CLAUDE.md` for font setup instructions (Elvaro Grotesque and Blumir candidates in `Fonts/` directory).

## Tasks

- [x] **Task 1: Design system foundation.** Tailwind config, CSS variables, font loading. *(Completed — see progress.txt)*

- [x] **Task 1b: Boot sequence and ECG animation.** *(Completed and locked — do not modify)*

- [x] **Task 2: Set up premium font and update Tailwind config.** Read `CLAUDE.md` (Typography section) and `Ralph/refs/ref-design-system.md`. Load both candidate fonts from `Fonts/` directory (Elvaro Grotesque WOFF2 files and Blumir variable font WOFF2). Add `@font-face` declarations in `src/index.css`. Update Tailwind config to add `font-ui` family pointing to the chosen font (start with Elvaro, can be swapped later). Replace `font-inter` references in Tailwind config with `font-ui`. Ensure Geist Mono remains the monospace font. Keep Fira Code for boot/ECG phases only.

- [x] **Task 3: Rebuild LoginScreen.** Read `Ralph/refs/ref-transition-login.md`. Key changes from prior version: (a) Typing speed is now **80ms/char** for username, **60ms/dot** for password — natural pace, not frantic. (b) After typing completes, the "Log In" button becomes **user-interactive** — the user clicks it to proceed. It is NOT auto-triggered. Button should have hover state, full opacity when ready, disabled/dimmed while typing. (c) Card shadow uses multi-layered shadow per design system. (d) Uses [UI font] for labels, Geist Mono for input fields. (e) `prefers-reduced-motion`: typing completes instantly, button is immediately interactive.

- [x] **Task 4: Rebuild PatientBanner.** Read `Ralph/refs/ref-banner-sidebar.md` (Patient Banner section). Full banner (80px) with surname-first format, demographic details, action buttons. Condensed banner (48px) via IntersectionObserver at 100px scroll. Mobile minimal banner with overflow menu. Uses [UI font] throughout. NHS Number tooltip: "GPhC Registration Number".

- [x] **Task 4b: Fix PatientBanner scroll condensation.** Read `Ralph/refs/ref-banner-sidebar.md` (Patient Banner section + Implementation Patterns). The full 3-row banner (80px — name/status, demographics, contact) never displays because the IntersectionObserver sentinel is broken. The sentinel (`absolute top-0` with `h-0`) is inside a React fragment next to the sticky header — it positions relative to the viewport, and the `-100px` rootMargin means it's immediately "not intersecting", so the banner always shows as condensed. Fix: ensure the sentinel is placed in the document flow ABOVE the scrollable content area (not absolute-positioned inside the banner fragment), so it's naturally visible on load and only scrolls out of view when the user scrolls 100px. Verify that on page load the full banner displays, and after scrolling 100px it smoothly condenses to the single-row 48px layout.

- [x] **Task 5: Rebuild ClinicalSidebar.** Read `Ralph/refs/ref-banner-sidebar.md` (Left Sidebar + Navigation sections). CV-friendly labels: Summary, Experience, Skills, Achievements, Projects, Education, Contact. 220px fixed width. Header branding, search input, navigation items with exact states (default/hover/active), separator line, footer with session info. Tablet mode: 56px icon-only. Keyboard shortcuts: Alt+1-7, arrow keys, "/" for search. URL hash routing.

- [x] **Task 6: Rebuild PMRInterface layout + Breadcrumb.** Read `Ralph/refs/ref-banner-sidebar.md` (PMRInterface Layout + Breadcrumb sections). Fixed sidebar + sticky banner + scrollable content on `#F5F7FA`. Create `Breadcrumb.tsx`. Interface materialization animations (banner → sidebar → content stagger). View switching is INSTANT. Mobile: bottom nav bar. Update ViewId type if needed.

- [x] **Task 7: Rebuild SummaryView + Clinical Alert.** Read `Ralph/refs/ref-summary-alert.md`. Clinical Alert with spring animation entrance, acknowledge → checkmark → collapse sequence. Summary cards: Demographics (full-width key-value), Active Problems (traffic lights), Current Skills quick table, Last Consultation preview. 2-column grid desktop, single column mobile. Navigation links to other views.

- [x] **Task 8: Rebuild ConsultationsView.** Read `Ralph/refs/ref-consultations.md`. Reverse-chronological journal. Collapsed entries with date, org, role, key achievement. Expanded: H/E/P structure with coded entries. Height-only expand animation (no opacity fade). One expanded at a time. 3px left border color-coded by employer. Second clinical alert on first visit.

- [x] **Task 9: Rebuild MedicationsView.** Read `Ralph/refs/ref-medications.md`. Three category tabs (Active/Clinical/PRN). Semantic `<table>` with sortable columns. Expandable prescribing history in Geist Mono. Status dots with text labels. Mobile: card layout.

- [x] **Task 10: Rebuild ProblemsView.** Read `Ralph/refs/ref-problems.md`. Two sections: Active Problems and Resolved Problems. Traffic light dots (8px, always with text labels). Code column in Geist Mono. Expandable rows with narrative + linked consultation navigation. Mobile: card layout.

- [ ] **Task 11: Rebuild InvestigationsView + DocumentsView.** Read `Ralph/refs/ref-investigations-documents.md`. Both views share the expandable-row pattern with tree-indented monospace content (box-drawing characters). Investigations: status badges (Complete/Ongoing/Live). Documents: type icons per document category. "View Results" button for PharMetrics only. Mobile: card layouts.

- [ ] **Task 12: Rebuild ReferralsView (Contact).** Read `Ralph/refs/ref-referrals.md`. Clinical referral form with priority radio buttons (Urgent/Routine/Two-Week Wait with tongue-in-cheek tooltips). Form validation, reference number generation, success state. Direct contact table below form.

- [ ] **Task 13: Fuzzy search with fuse.js.** Read `Ralph/refs/ref-interactions.md` (Search section). Install fuse.js. Build search index from all content. Results dropdown grouped by section. Clicking a result navigates to section + expands matching item. Mobile: search at top of each view.

- [ ] **Task 14: Responsive design audit.** Read `Ralph/refs/ref-interactions.md` (Responsive Strategy section). Test all three breakpoints: Desktop (>1024px), Tablet (768-1024px), Mobile (<768px). Tables → card layouts on mobile. Bottom nav bar. Touch targets ≥48px.

- [ ] **Task 15: Accessibility audit + final polish.** Read `Ralph/refs/ref-interactions.md` (Accessibility section). Semantic HTML, ARIA attributes, focus management, keyboard navigation, screen reader announcements, `prefers-reduced-motion` support, WCAG 2.1 AA contrast. Final visual consistency pass.
