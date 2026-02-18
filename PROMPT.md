# Task: Portfolio UX Improvements — GP Clinical System Theme Polish

Implement 11 prioritised UX improvements to the portfolio site. This is an interactive CV/portfolio themed as a GP primary care clinical system (like EMIS Web / SystmOne). The site should feel like a real GP system but function as a portfolio.

**Important constraints:**
- Do NOT change the overall structure or architecture
- Preserve the GP clinical system theme — improvements should reinforce it, not break it
- Respect existing conventions: TypeScript strict, Tailwind + CSS custom properties, Framer Motion with `prefers-reduced-motion`
- Path alias: `@/*` → `src/*`
- Quality gates: `npm run lint && npm run typecheck && npm run build`

## Improvements (ordered by priority)

### 1. Restructure Profile Summary Text
**File:** `src/components/tiles/PatientSummaryTile.tsx` (or wherever the narrative renders)
**Problem:** The patient summary narrative is a dense ~80-word paragraph — a wall of text. It's the first substantive content visitors see and doesn't match the structured clinical aesthetic.
**Change:** Break into structured clinical-style data:
- Brief 1-2 sentence summary (like a presenting complaint)
- Key facts as labeled fields below: Specialisation, Current System, Population, Focus Areas
- Or collapse behind "Read more" with first sentence visible
- Must feel like GP system structured data, not a LinkedIn About section

### 2. Surface Impact Metrics on Project Cards
**File:** `src/components/tiles/ProjectsTile.tsx` (or the project card component)
**Problem:** `resultSummary` exists in the data (e.g., "14,000 patients identified", "£2.6M savings") but is not rendered on project card faces. Recruiters scan for numbers.
**Change:** Render `resultSummary` prominently on each project card — below the title, styled as a bold stat. If a project has no `resultSummary`, don't show a placeholder.

### 3. Add Prominent Contact/Download CV CTA
**Problem:** No visible "Get in touch" or "Download CV" button in the main content area. These actions only exist in the sidebar or command palette.
**Change:** Add a small, visible row of action buttons (Email, LinkedIn, GitHub, Download CV) in the Patient Summary section. Style them as GP system action buttons to reinforce the theme. Keep it compact — not a hero CTA, but unmissable.

### 4. Reduce Boot + Login Sequence Time
**Files:** `src/components/BootSequence.tsx`, `src/components/LoginScreen.tsx`
**Problem:** Boot (~6-8s) + Login (~4s) = ~10 seconds before content. Too slow for repeat visitors.
**Change:** Reduce `TYPING_SPEED` multiplier to ~1.2 (from 2). Add `sessionStorage` detection — if user has visited before in this session, auto-skip directly to dashboard. Ensure skip button still appears early for first-time visitors.

### 5. Resolve Last Consultation / Timeline Duplication
**Files:** `src/components/tiles/LastConsultationCard.tsx`, `src/components/tiles/TimelineInterventionsSubsection.tsx`
**Problem:** Current role appears twice — once as LastConsultationCard and again as first timeline accordion entry. Redundant.
**Change:** Differentiate LastConsultationCard as a summary-only card (role, org, band, date range, one-line summary) without the full bullet points. The full details should only appear in the timeline accordion. Add a "Current" badge to the first timeline accordion entry.

### 6. Fix Text-Tertiary Contrast Ratio
**File:** `src/index.css`
**Problem:** `--text-tertiary: #8DA8A5` on `--bg-dashboard: #F0F5F4` yields ~2.8:1 contrast, failing WCAG AA.
**Change:** Darken `--text-tertiary` to at least `#6B8886` (achieves ~4.5:1 on `#F0F5F4`). Verify the change looks good across dates, helper text, and monospace metadata.

### 7. Add Mobile Identity Bar
**Problem:** On mobile, no name or identity marker is visible without opening the drawer. Recruiters on mobile have no visual anchor.
**Change:** Add a compact identity bar at the top of mobile layout showing "CHARLWOOD, Andrew" and brief role title. Only visible on mobile (below `lg` breakpoint where sidebar is hidden). Style it like a GP system patient banner strip.

### 8. Simplify KPI Section Header Language
**File:** The KPI/metrics section component
**Problem:** "LATEST RESULTS (CLICK TO VIEW FULL REFERENCE RANGE)" is deep medical jargon that non-healthcare visitors won't understand.
**Change:** Change to "KEY METRICS" or "IMPACT HIGHLIGHTS". Update the helper text to "Select a metric to inspect methodology, impact, and outcomes" (if not already). Keep the excellent metric cards unchanged.

### 9. Add Detail Panel Exit Animation
**Files:** `src/components/DetailPanel.tsx`
**Problem:** Panel has `panel-slide-in` animation but closes instantly. `panel-slide-out` keyframe exists in CSS but is unused.
**Change:** Implement exit animation — either wire up the existing `panel-slide-out` keyframe via a closing state, or use Framer Motion's `AnimatePresence`. The panel should slide out before unmounting.

### 10. Fix marginBottom Typo
**File:** `src/components/tiles/LastConsultationCard.tsx` (around line 89)
**Problem:** `marginBottom: '1=px'` — typo, should be `'1px'` or appropriate value.
**Change:** Fix the typo. Check surrounding styles for the correct intended value.

### 11. Add Arrow Navigation to Desktop Projects Carousel
**File:** `src/components/tiles/ProjectsTile.tsx` — `ContinuousScrollCarousel` component (lines ~356–480)
**Problem:** The ContinuousScrollCarousel (desktop ≥1024px) auto-scrolls but offers no manual browsing.
**Change:**
- Add prev/next arrow buttons (ChevronLeft, ChevronRight from lucide-react) positioned absolutely at left/right edges, vertically centered
- Style following the existing FullscreenButton pattern: `var(--surface)` background, `var(--border)` border, opacity hover effect, subtle shadow
- Arrow click handler: jump one card width + gap = `((viewportWidth - 36) / 4) + 12` pixels
- Apply temporary CSS transition on the track (`transform 0.4s ease`) for smooth animated jump; remove transition after completion so rAF loop isn't fighting CSS
- Handle wrapping: keep offset within `[0, firstSetWidth)` using modulo
- Pause/resume: on arrow click set `isPausedRef = true`, clear existing timeout, start 6-second timeout to resume auto-scroll
- Existing hover pause/resume still works independently
- Rapid clicks: each click resets the 6s timeout; transition handles overlapping clicks by snapping to current offset
- Reduced motion: arrows still work (instant jump, no transition), auto-scroll stays disabled per existing logic

## Success Criteria

All of the following must be true:
- [ ] Profile summary is structured data, not a text wall — feels clinical
- [ ] Project cards display `resultSummary` when available
- [ ] Contact/Download CV actions are visible in the main content area
- [ ] Boot + login sequence completes in ~5 seconds or less for first visit; instant skip for return visitors
- [ ] LastConsultationCard is a distinct summary (no duplication with timeline)
- [ ] `--text-tertiary` passes WCAG AA contrast (4.5:1) on dashboard background
- [ ] Mobile shows identity/name without opening drawer
- [ ] KPI header uses plain language, not clinical jargon
- [ ] Detail panel has exit animation (slide out, not instant disappear)
- [ ] marginBottom typo is fixed
- [ ] Desktop projects carousel has prev/next arrow buttons
- [ ] Arrow buttons pause auto-scroll for 6s then resume
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run build` passes
- [ ] No regressions — existing functionality preserved

## Status

Track progress here. Mark items complete as you go.
When all success criteria are met, print LOOP_COMPLETE.
