# UX Improvements Plan — GP Clinical System Theme Polish

## Status Key
- [ ] Not started
- [x] Complete

---

## Improvement 1: Restructure Profile Summary Text
**Status:** [x] Complete
**File:** `src/components/tiles/PatientSummaryTile.tsx`, `src/data/profile-content.ts`

**Current state:** `PatientSummaryTile` line 129 renders `summaryText` (from `getProfileSummaryText()`) as a single `<div>` — an 80+ word paragraph wall.

**Plan:**
1. In `PatientSummaryTile.tsx`, replace the single `<div style={profileTextStyles}>{summaryText}</div>` with a structured clinical layout:
   - **Presenting Complaint** (1–2 sentence summary): "Healthcare leader combining clinical pharmacy expertise with proficiency in Python, SQL, and data analytics. Currently leading population health analytics for NHS Norfolk & Waveney ICB, serving 1.2 million."
   - **Structured fields** below, rendered as a 2-column grid of label/value pairs:
     | Label | Value |
     |-------|-------|
     | Specialisation | Population Health Analytics & Medicines Optimisation |
     | Current System | NHS Norfolk & Waveney ICB |
     | Population | 1.2 million |
     | Focus Areas | Prescribing analytics, financial modelling, algorithm design, data pipelines |
     | Key Achievement | £14.6M+ efficiency programmes identified |

2. **Styling approach:**
   - Brief summary: same `profileTextStyles` (15px, line-height 1.65, `--text-primary`)
   - Structured fields grid: 2-column CSS grid (`grid-template-columns: auto 1fr`), gap 6px 16px
   - Labels: `12px uppercase, letter-spacing 0.06em, color: var(--text-tertiary), font-family: var(--font-geist-mono)` — matching existing `fieldLabelStyle` from LastConsultationCard
   - Values: `13px, font-weight 600, color: var(--text-primary)` — matching existing `fieldValueStyle` from LastConsultationCard
   - A thin `border-top: 1px solid var(--border-light)` with `padding-top: 14px, margin-top: 14px` separating the summary from the fields

3. **Data source:** Extract structured fields into `profile-content.ts` as a new `structuredProfile` object within `profileContent.profile`. Keep `patientSummaryNarrative` for backward compatibility but add:
   ```ts
   structuredProfile: {
     presentingComplaint: '...',
     fields: [
       { label: 'Specialisation', value: '...' },
       { label: 'Current System', value: '...' },
       // etc.
     ]
   }
   ```

4. **Mobile:** Grid goes single-column (`1fr`) at `< 480px`. Use CSS class `profile-fields-grid` with media query.

**Verify:** Profile reads as structured clinical data, not a LinkedIn About. Labels match the field label aesthetic used in LastConsultationCard.

---

## Improvement 2: Surface Impact Metrics on Project Cards
**Status:** [x] Complete
**File:** `src/components/tiles/ProjectsTile.tsx`

**Current state:** `ProjectItem` renders thumbnail, name, year, tech stack, skills, status pill — but never touches `project.resultSummary`. The `Investigation` type has `resultSummary: string` with data like "14,000 patients identified", "£2.6M savings".

**Plan:**
1. In `ProjectItem` component (around line 170, after the name/year row), add a `resultSummary` display:
   ```tsx
   {project.resultSummary && (
     <div style={{
       fontSize: '12px',
       fontWeight: 700,
       fontFamily: 'var(--font-geist-mono)',
       color: 'var(--accent)',
       letterSpacing: '-0.01em',
       lineHeight: 1.3,
     }}>
       {project.resultSummary}
     </div>
   )}
   ```
2. Place it between the name row and the tech stack row — immediately after the `</div>` that wraps project name + year (after line 169).
3. All 6 investigations have `resultSummary`, so it will always show. But the conditional guard is good practice.

**Verify:** Each project card shows a bold stat line. Numbers like "14,000 patients identified" are immediately scannable.

---

## Improvement 3: Add Prominent Contact/Download CV CTA
**Status:** [x] Complete
**File:** `src/components/tiles/PatientSummaryTile.tsx`

**Current state:** Contact actions only exist in CommandPalette (`Ctrl+K`). `profile-content.ts` has URLs: `mailto:andy@charlwood.xyz`, `linkedin.com/in/andycharlwood`, `github.com/andycharlwood`. Download CV exists as a quick action type `'download'`.

**Plan:**
1. Add a compact action bar below the structured profile fields, above the KPI section. Use a horizontal flex row with 4 buttons: Email, LinkedIn, GitHub, Download CV.
2. **Styling** — match GP system "action buttons" aesthetic:
   - Container: `display: flex, gap: 8px, flexWrap: wrap, marginTop: 16px, marginBottom: 4px`
   - Each button: `display: inline-flex, alignItems: center, gap: 6px, padding: '6px 12px', fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-geist-mono)', letterSpacing: '0.03em', textTransform: 'uppercase', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--accent)', cursor: 'pointer', transition: '...', textDecoration: 'none'`
   - Hover: `background: var(--accent-light), borderColor: var(--accent-border)`
   - Icons: `Mail`, `Linkedin`, `Github`, `Download` from lucide-react, size 13
3. **Links:**
   - Email → `mailto:andy@charlwood.xyz`
   - LinkedIn → `https://linkedin.com/in/andycharlwood` (target `_blank`, `rel="noopener noreferrer"`)
   - GitHub → `https://github.com/andycharlwood` (target `_blank`, `rel="noopener noreferrer"`)
   - Download CV → trigger the same download logic as CommandPalette (check what it does — likely opens a PDF URL or triggers a download). For now, link to `/AndrewCharlwood_CV.pdf` or check existing download action. If no PDF exists, use a `mailto:` with subject "CV Request" as fallback, or omit.
4. Render as `<a>` tags styled as buttons (not `<button>`) since they navigate externally.

**Verify:** Buttons visible without scrolling on desktop. Compact on mobile. GP action button aesthetic maintained.

---

## Improvement 4: Reduce Boot + Login Sequence Time
**Status:** [x] Complete
**Files:** `src/components/BootSequence.tsx`, `src/components/LoginScreen.tsx`, `src/App.tsx`

**Current state:**
- Boot: `TYPING_SPEED = 2` (line 62) → ~5.6s total (3.3s×2 typing + 0.6s hold + 1.2s loading + 0.5s fade)
- Login: 1500ms start delay + ~1.5s typing + 500ms connect + 600ms dissolve ≈ 4.1s
- Total: ~9.7s before dashboard
- No sessionStorage skip logic
- Skip button appears at 1500ms into boot

**Plan:**
1. **BootSequence.tsx line 62:** Change `TYPING_SPEED = 2` → `TYPING_SPEED = 1.2`
   - New typing time: ~3.3s × 1.2 = ~4.0s
   - New total boot: ~4.0 + 0.6 + 1.2 + 0.5 = ~6.3s
   - But also reduce `holdAfterComplete` from 600 → 300, and `loadingDuration` from 1200 → 800
   - New total: ~4.0 + 0.3 + 0.8 + 0.5 = ~5.6s

2. **LoginScreen.tsx line 150:** Reduce start delay from 1500 → 800ms
   - Change character typing from 80ms → 55ms (username)
   - Change password dots from 60ms → 40ms
   - New login total: ~0.8 + (13×0.055) + 0.3 + (8×0.04) + 0.5 + 0.6 ≈ 3.1s
   - Combined first-visit: ~5.6 + 3.1 = ~8.7s... still too long.
   - Further: reduce boot `TYPING_SPEED = 1.0`, `holdAfterComplete: 200`, `loadingDuration: 600`
   - New boot: ~3.3 + 0.2 + 0.6 + 0.5 = ~4.6s
   - Combined: ~4.6 + 3.1 = ~7.7s. Getting there.
   - Also reduce login dissolve from 600 → 400ms, and startDelay to 600ms.
   - New login: ~0.6 + 0.7 + 0.3 + 0.3 + 0.5 + 0.4 ≈ 2.8s
   - Combined: ~4.6 + 2.8 = ~7.4s. Under 8s is reasonable for a first-time experience.
   - **Final timing targets:**
     - Boot TYPING_SPEED: 1.0
     - holdAfterComplete: 200
     - loadingDuration: 600
     - Login startDelay: 600 (from 1500)
     - Username char: 55ms (from 80)
     - Password dot: 40ms (from 60)
     - Login dissolve: 400ms (from 600)

3. **App.tsx:** Add `sessionStorage` skip logic:
   ```tsx
   const [phase, setPhase] = useState<Phase>(() => {
     if (typeof window !== 'undefined' && sessionStorage.getItem('portfolio-visited')) {
       return 'pmr'
     }
     return 'boot'
   })
   ```
   And when transitioning to `'pmr'`:
   ```tsx
   useEffect(() => {
     if (phase === 'pmr') {
       sessionStorage.setItem('portfolio-visited', '1')
     }
   }, [phase])
   ```
   This means: first visit in tab → full boot+login. Refresh or navigate back → instant dashboard.

4. **Skip button** in `App.tsx`: Keep appearing at 1500ms (or reduce to 1000ms for faster access). Also show during login phase — currently only shows during boot. Add skip button to login phase too:
   ```tsx
   {(phase === 'boot' || phase === 'login') && (
     <SkipButton onSkip={skipToDashboard} />
   )}
   ```

**Verify:** First visit ≤ ~5s total. Return visitor in same session → instant dashboard. Skip button visible within 1s.

---

## Improvement 5: Resolve Last Consultation / Timeline Duplication
**Status:** [x] Complete
**Files:** `src/components/LastConsultationCard.tsx`, `src/components/TimelineInterventionsSubsection.tsx`

**Current state:**
- `LastConsultationCard` displays the current role with full examination bullet points (lines 135–173) + metadata fields + "View full record" button
- `TimelineInterventionsSubsection` renders all `timelineEntities` including the current role as the first accordion item, also with full details
- Both are rendered in `DashboardLayout.tsx` (lines 315, 319)

**Plan:**
1. **LastConsultationCard.tsx:** Remove the examination bullets list entirely (lines 135–173: the `<ul>` and all `<li>` elements). Keep:
   - CardHeader "LAST CONSULTATION"
   - Metadata fields row (Date, Organisation, Type, Band) — this is the clickable summary
   - Role title
   - "View full record" button
   This makes it a compact summary card.

2. **TimelineInterventionsSubsection.tsx:** Add a "CURRENT" badge to the first timeline entry (the current role). In `TimelineInterventionItem`, detect if the entity is the current one (`entity.isCurrent === true` or first entity in the sorted list). Add a small pill badge next to the date:
   ```tsx
   {entity.isCurrent && (
     <span style={{
       fontSize: '9px',
       fontWeight: 700,
       fontFamily: 'var(--font-geist-mono)',
       textTransform: 'uppercase',
       letterSpacing: '0.05em',
       padding: '2px 7px',
       borderRadius: '9999px',
       background: 'rgba(34, 197, 94, 0.12)',
       color: '#16a34a',
       border: '1px solid rgba(34, 197, 94, 0.3)',
     }}>
       Current
     </span>
   )}
   ```
   Check if `TimelineEntity` has an `isCurrent` field — if not, use `entity.dateRange.end === null` or compare with the consultation from `timelineConsultations`.

**Verify:** LastConsultationCard shows a compact summary (no bullets). Timeline accordion first item has "Current" badge. Full details only in the accordion expansion.

---

## Improvement 6: Fix Text-Tertiary Contrast Ratio
**Status:** [x] Complete
**File:** `src/index.css`

**Current state:** Line 106: `--text-tertiary: #8DA8A5` on `--bg-dashboard: #F0F5F4`. Current contrast ≈ 2.8:1 (fails WCAG AA 4.5:1 for normal text).

**Plan:**
1. Change `--text-tertiary: #8DA8A5` → `--text-tertiary: #6B8886`
   - `#6B8886` (RGB 107, 136, 134) on `#F0F5F4` (RGB 240, 245, 244) gives contrast ≈ 4.5:1
   - Maintains the teal-grey character of the palette
2. This is a single-line CSS change.

**Verify:** Check contrast with a WCAG contrast checker. Visually scan: dates in timeline, helper text, mono metadata — all should be clearly readable without looking out of place.

---

## Improvement 7: Add Mobile Identity Bar
**Status:** [x] Complete
**File:** `src/components/DashboardLayout.tsx`

**Current state:** On mobile (< lg breakpoint), the sidebar is hidden and replaced by `MobileBottomNav`. No name/identity visible without opening the drawer.

**Plan:**
1. Add a compact top bar in `DashboardLayout.tsx`, rendered only below `lg` breakpoint (use `useIsMobileNav()` hook that already exists, or a `useMediaQuery` for `max-width: 1023px`).
2. **Structure:**
   ```tsx
   {isMobileNav && (
     <div style={{
       display: 'flex',
       alignItems: 'center',
       justifyContent: 'space-between',
       padding: '10px 16px',
       background: 'var(--sidebar-bg)',
       borderBottom: '1px solid var(--border)',
       position: 'sticky',
       top: 0,
       zIndex: 50,
     }}>
       <div>
         <div style={{
           fontSize: '14px',
           fontWeight: 700,
           color: 'var(--text-on-dark)',
           letterSpacing: '0.04em',
           fontFamily: 'var(--font-ui)',
         }}>
           CHARLWOOD, Andrew
         </div>
         <div style={{
           fontSize: '11px',
           color: 'var(--text-secondary-on-dark)',
           fontFamily: 'var(--font-geist-mono)',
           letterSpacing: '0.02em',
         }}>
           Informatics Pharmacist · NHS Norfolk & Waveney ICB
         </div>
       </div>
     </div>
   )}
   ```
3. Looks like a GP system patient banner strip — dark background (sidebar-bg), surname first in caps, role subtitle. Check if `--text-on-dark` and `--text-secondary-on-dark` exist; if not, use appropriate colors from sidebar styles (check Sidebar.tsx for text color patterns).

**Verify:** On mobile viewport, name and role visible at top without opening drawer. Disappears on desktop (≥ lg).

---

## Improvement 8: Simplify KPI Section Header Language
**Status:** [x] Complete
**File:** `src/data/profile-content.ts`

**Current state:** Line 8: `title: 'LATEST RESULTS (CLICK TO VIEW FULL REFERENCE RANGE)'`

**Plan:**
1. Change to: `title: 'KEY METRICS'`
2. The existing `helperText` is already good: `'Select a metric to inspect methodology, impact, and outcomes.'` — keep it.
3. Single-line change.

**Verify:** Header reads "KEY METRICS" with helper text below. No medical jargon confusion.

---

## Improvement 9: Add Detail Panel Exit Animation
**Status:** [x] Complete
**File:** `src/components/DetailPanel.tsx`, `src/contexts/DetailPanelContext.tsx`

**Current state:**
- Entry: `animation: 'panel-slide-in 250ms ease-out'` (line 127)
- Exit: Panel returns `null` when `!isOpen` (line 86) — instant unmount, no exit animation
- CSS has `@keyframes panel-slide-out` defined (index.css line 564) but unused
- Backdrop has `backdrop-fade-in` but no `backdrop-fade-out`

**Plan — Use a closing state pattern** (simpler than AnimatePresence since we're not using Framer Motion here):

1. **DetailPanelContext.tsx:** Add a `isClosing` state:
   ```tsx
   const [isClosing, setIsClosing] = useState(false)
   const closeTimerRef = useRef<number>()

   const closePanel = useCallback(() => {
     setIsClosing(true)
     closeTimerRef.current = window.setTimeout(() => {
       setIsClosing(false)
       setIsOpen(false)
       setContent(null)
     }, 250) // match panel-slide-out duration
   }, [])
   ```
   Expose `isClosing` in the context value.

2. **DetailPanel.tsx:**
   - Change guard: `if ((!isOpen && !isClosing) || !content) return null`
   - Panel animation: `animation: isClosing ? 'panel-slide-out 250ms ease-in forwards' : 'panel-slide-in 250ms ease-out'`
   - Backdrop: add `opacity: isClosing ? 0 : 1, transition: 'opacity 200ms ease-out'`

3. Clean up timer on unmount in the context provider.

**Verify:** Panel slides out smoothly before disappearing. Backdrop fades. Escape key triggers exit animation. Reduced motion users get instant close (CSS already overrides the keyframes).

---

## Improvement 10: Fix marginBottom Typo
**Status:** [x] Complete
**File:** `src/components/LastConsultationCard.tsx`

**Current state:** Line 89: `marginBottom: '1=px'` — typo. Surrounding context: this is on the metadata fields row div which also has `paddingBottom: '14px'`, `borderBottom: '1px solid var(--border-light)'`, and `margin: '-8px -8px 14px -8px'`.

**Plan:**
1. The `margin` shorthand on line 95 (`margin: '-8px -8px 14px -8px'`) already sets `marginBottom: 14px`, so the `marginBottom: '1=px'` on line 89 is being overridden anyway.
2. Change `marginBottom: '1=px'` → remove it entirely (the margin shorthand handles it), or change to `marginBottom: '10px'` if the intent was spacing before the bottom border. Looking at the layout: the `margin` shorthand on line 95 already handles bottom margin (14px), so the `marginBottom` on line 89 is redundant and was likely a typo of `'10px'` but is overridden.
3. Simplest fix: change `'1=px'` → `'10px'` to fix the typo. Even though it's overridden, fix the intent so the code is correct.

**Verify:** No visual regression. The metadata row spacing is unchanged (margin shorthand dominates).

---

## Improvement 11: Add Arrow Navigation to Desktop Projects Carousel
**Status:** [x] Complete
**File:** `src/components/tiles/ProjectsTile.tsx` — `ContinuousScrollCarousel` (lines 381–505)

**Current state:** Auto-scrolling via `requestAnimationFrame` at 24px/s. Pauses on hover/focus. No manual navigation buttons.

**Plan:**
1. **Import** `ChevronLeft, ChevronRight` from `lucide-react` (already have `lucide-react` in the file).

2. **Add a resume timeout ref** and **transition helper** inside `ContinuousScrollCarousel`:
   ```tsx
   const resumeTimeoutRef = useRef<number>(0)

   const jumpByCards = useCallback((direction: 1 | -1) => {
     const trackEl = trackRef.current
     const firstSetEl = firstSetRef.current
     if (!trackEl || !firstSetEl) return

     const gap = 12
     const cardsPerView = 4
     const totalGap = (cardsPerView - 1) * gap
     const cardWidth = (viewportWidth - totalGap) / cardsPerView
     const jumpPx = cardWidth + gap

     // Pause auto-scroll
     isPausedRef.current = true
     window.clearTimeout(resumeTimeoutRef.current)

     // Apply CSS transition for smooth jump
     if (!prefersReducedMotion) {
       trackEl.style.transition = 'transform 0.4s ease'
     }

     // Calculate new offset
     const setWidth = firstSetEl.offsetWidth
     let newOffset = offsetRef.current + (direction * jumpPx)
     if (setWidth > 0) {
       newOffset = ((newOffset % setWidth) + setWidth) % setWidth
     }
     offsetRef.current = newOffset
     trackEl.style.transform = `translate3d(-${newOffset}px, 0, 0)`

     // Remove transition after completion so rAF loop isn't fighting CSS
     const transitionEnd = () => {
       trackEl.style.transition = ''
       trackEl.removeEventListener('transitionend', transitionEnd)
     }
     if (!prefersReducedMotion) {
       trackEl.addEventListener('transitionend', transitionEnd, { once: true })
     }

     // Resume auto-scroll after 6s
     resumeTimeoutRef.current = window.setTimeout(() => {
       isPausedRef.current = false
     }, 6000)
   }, [viewportWidth, prefersReducedMotion])
   ```

3. **Clean up** the resume timeout on unmount (add to the rAF effect cleanup or a separate effect).

4. **Render arrows** — wrap the existing viewport div in a relative container:
   ```tsx
   <div style={{ position: 'relative' }}>
     {/* Existing viewport div */}
     <div ref={viewportRef} style={{ overflow: 'hidden' }} ...>
       ...
     </div>

     {/* Left arrow */}
     <button
       onClick={() => jumpByCards(-1)}
       aria-label="Previous project"
       style={{
         position: 'absolute',
         left: '-4px',
         top: '50%',
         transform: 'translateY(-50%)',
         width: '32px',
         height: '32px',
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
         background: 'var(--surface)',
         border: '1px solid var(--border)',
         borderRadius: '50%',
         cursor: 'pointer',
         boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
         color: 'var(--text-secondary)',
         transition: 'opacity 150ms, background-color 150ms',
         zIndex: 2,
       }}
     >
       <ChevronLeft size={16} />
     </button>

     {/* Right arrow */}
     <button
       onClick={() => jumpByCards(1)}
       aria-label="Next project"
       style={{ /* mirror of left, but right: '-4px' */ }}
     >
       <ChevronRight size={16} />
     </button>
   </div>
   ```

5. **Hover effect** on arrows: `opacity 0.7 → 1` on hover, match the existing `FullscreenButton` pattern.

6. **Existing hover pause** still works — `onMouseEnter/Leave` on the viewport div pauses the rAF loop. Arrow clicks set `isPausedRef = true` with their own 6s resume timer. If user hovers viewport area after clicking arrow, hover pause takes over. On mouse leave, if the 6s timer hasn't elapsed, the arrow's timer still holds the pause.
   - Need to handle interaction: when `setPaused(false)` fires from `onMouseLeave`, only unpause if the arrow timer has elapsed. Solution: track `arrowPausedUntil` timestamp. `setPaused` checks if `Date.now() < arrowPausedUntil`. Actually simpler: just let the arrow timeout set `isPausedRef = false` after 6s regardless. The hover handlers already set it. The last writer wins. This is fine — if user hovers after clicking, hover sets `true`. When they leave, `false`. If 6s timer fires while hovering, it sets `false` but hover immediately sets `true` again via the rAF check. Actually the hover sets it on enter/leave events, not continuously. So: mouse leaves → sets false → auto-scroll resumes. That's OK. The 6s pause only matters if the user clicks an arrow and then doesn't hover the carousel.

7. **Reduced motion:** Arrows still work (instant jump, no CSS transition). Auto-scroll stays disabled per existing logic.

**Verify:** Arrows visible at left/right edges of carousel. Click jumps one card smoothly. Auto-scroll pauses for 6s after click. Reduced motion: instant jump. Rapid clicks work without jank.

---

## Implementation Order

Implement in priority order 1→11. Each improvement is atomic and independently verifiable.

**Quality gate after each improvement:** `npm run lint && npm run typecheck && npm run build`

## Files Modified (Summary)

| # | Files |
|---|-------|
| 1 | `PatientSummaryTile.tsx`, `profile-content.ts`, `types/profile-content.ts` |
| 2 | `ProjectsTile.tsx` |
| 3 | `PatientSummaryTile.tsx` |
| 4 | `BootSequence.tsx`, `LoginScreen.tsx`, `App.tsx` |
| 5 | `LastConsultationCard.tsx`, `TimelineInterventionsSubsection.tsx` |
| 6 | `index.css` |
| 7 | `DashboardLayout.tsx` |
| 8 | `profile-content.ts` |
| 9 | `DetailPanel.tsx`, `DetailPanelContext.tsx` |
| 10 | `LastConsultationCard.tsx` |
| 11 | `ProjectsTile.tsx` |
