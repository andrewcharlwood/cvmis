# Carousel Redesign — Design Debate Findings

> This document is maintained by 3 agents debating the proposed carousel redesign.
> Each agent updates their positions and the group converges on consensus.

---

## The Proposal (from Andy)

**Desktop carousel redesign** for the portfolio's "Significant Interventions" section.

### Current state
- Desktop (>=1024px): Continuous auto-scroll carousel showing 4 project cards at once
- Each card: thumbnail (16:9), title + year + live pill, result summary, tech stack tags, skills tags
- Hover overlay: "Intervention Outcomes" list with results
- Click opens detail panel

### Proposed new design
- **Center focus area (50% width)**: The "active" project gets a split layout:
  - Left half: Project thumbnail
  - Right half: Text description (currently from hover), title, full tech stack + domain skills
  - Clicking opens the existing expanded detail panel
- **Side thumbnails**: To the left and right of the focus area, show adjacent project thumbnails
  - Title overlaid at bottom with opaque background (similar font style/size to current)
  - Live/Live Demo pill remains visible
  - Stack/skills/headline outcome hidden — only visible on the active/focused item
- **Progress badge**: Similar to current dot indicators, shows item count/position

### Priority constraint
**Must not look displaced from the GP clinical system theme** the portfolio has.

---

## Agent Positions

### UX Designer (bencium-innovative-ux-designer skill)

**Overall assessment: The center-focus carousel is a reasonable direction but needs significant adjustments to preserve the clinical system aesthetic and achieve good interaction design.**

#### 1. Interaction Patterns — Mixed verdict

The center-focus carousel (hero + flanking thumbnails) is a well-understood pattern, but it carries strong associations with **media galleries and e-commerce product viewers** (Apple product pages, Netflix-style hero rows). This is the core tension: it reads as "portfolio showcase" not "clinical records system."

In GP software (EMIS Web, SystmOne), data browsing is **list-driven and table-driven**, not carousel-driven. Records use scrollable lists with a detail pane on click. The closest equivalent pattern in clinical software is a **master-detail list** — select an item from a compact list, and the detail populates beside it.

**Specific interaction concerns:**
- With only 6 projects, a carousel adds interaction overhead for little benefit. The user must click/swipe through items sequentially rather than scanning all options at once.
- The continuous auto-scroll in the current implementation is already problematic (auto-advancing content is an accessibility antipattern per WCAG 2.2.2 unless pauseable). The proposal doesn't clarify whether auto-advance continues.
- Side thumbnails as navigation targets have small hit areas and require users to understand that clicking them advances the carousel — this isn't self-evident.

#### 2. Progressive Disclosure — Wrong layer to hide

The proposal hides tech stack and skills on non-active items. But these are **the primary scanning criteria** for a hiring manager or recruiter. Someone looking at this portfolio wants to quickly spot "does this person know React?" or "have they worked with Python?" Hiding that behind an extra click/selection step adds friction at the exact moment the viewer is deciding whether to engage further.

In the current design, all 4 visible cards show their tech stack simultaneously — a recruiter can scan across all of them in one glance. The proposed design forces sequential discovery.

**Better progressive disclosure model:** Show the lightweight metadata (title, year, status, tech tags) for all items. Reserve the detail expansion (methodology text, full results list) for the active/selected item or the existing detail panel.

#### 3. Information Hierarchy — The 50/50 split is problematic

A 50/50 split between thumbnail and text in the focus area creates competing visual weight. Neither the image nor the text dominates, which produces a "neither fish nor fowl" feel. This layout works when images are high-quality product photography (e.g., Apple). For project screenshots — which are often busy, low-contrast UIs — the thumbnail will compete with rather than complement the text.

Additionally, cramming title + description + tech stack + domain skills into half the focus area width means either:
- Text is uncomfortably compressed (especially for projects like PharMetrics with lengthy methodology descriptions)
- Or the focus area must be tall enough to accommodate the text, making the overall component vertically dominant

#### 4. Motion & Transitions

If this moves forward, transitions should:
- Use **crossfade with a subtle horizontal slide** (120-200ms) when switching items — not a full carousel slide animation
- Side thumbnails should scale from ~0.92 to 1.0 when becoming active, with opacity shift from 0.7 to 1.0
- Respect `prefers-reduced-motion` by cutting directly with no animation
- Avoid any auto-advance — let the user drive navigation entirely

#### 5. Accessibility Concerns

- The carousel must implement the [WAI-ARIA Carousel pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/) with `role="region"`, `aria-roledescription="carousel"`, `aria-label`
- Each slide needs `role="group"` and `aria-roledescription="slide"`
- Arrow key navigation between items, with focus trapped to the carousel when navigating
- Screen readers need to announce "Project 2 of 6: Patient Switching Algorithm" on navigation
- The side thumbnails as click targets must meet minimum 44x44px touch target size (WCAG 2.5.8)

#### 6. GP Clinical Theme Coherence — **This is where I push back hardest**

A center-focus carousel with flanking thumbnails looks like a **media player or product showcase**. It does not look like anything you'd find in EMIS Web or SystmOne. Clinical systems present multiple records in:
- Scrollable lists/tables with columns
- Accordion sections that expand inline
- Master-detail views (list on left, detail on right)

The current continuous-scroll carousel already stretches the clinical metaphor. A hero-focus carousel stretches it further into generic portfolio territory.

#### Alternative Proposal: Clinical Record Browser

Instead of a center-focus carousel, consider a pattern more native to clinical software:

**A compact tabular list with inline expansion:**
- Show all 6 projects in a condensed list (each row: status dot, name, year, tech stack pills, "Live" badge)
- Clicking a row either expands it inline (showing thumbnail + methodology + results) or opens the existing detail panel
- This is essentially the same pattern as `TimelineInterventionsSubsection` (the accordion), maintaining consistency across the portfolio
- For visual interest, the expanded state could show the thumbnail + text side by side

This preserves scan-ability, matches the clinical system aesthetic, and leverages an existing interaction pattern in the portfolio. The tradeoff is it's less visually dramatic — but "visually dramatic" isn't necessarily the goal when the design language is supposed to be utilitarian clinical software.

**If the carousel must stay**, I'd advocate for keeping the current multi-card view (4 cards visible) but improving the hover/active state rather than switching to a center-focus pattern. Make the hover overlay richer (fade in the full description alongside results), add keyboard navigation between cards, and drop the auto-scroll.

#### Updated Position (after Round 1 debate)

Portfolio-expert correctly identified that my tabular list alternative goes too far — it would make the Interventions section indistinguishable from the Timeline accordion, losing visual texture that the dashboard needs. I'm withdrawing the tabular list proposal.

**Revised recommendation: Iterative improvement on the current multi-card layout.**

1. **Drop auto-scroll entirely** — removes accessibility issue (WCAG 2.2.2), simplifies implementation (no DOM duplication for infinite scroll illusion)
2. **Improved hover state** — replace the current full-card dark overlay with a **slide-up panel covering the bottom ~60%** of the card, keeping the thumbnail visible at top. This maintains spatial continuity rather than the current jarring before/after.
3. **Keyboard navigation** — composite widget pattern: Tab lands on carousel as a group, arrow keys navigate between cards, Enter/Space opens detail panel
4. **Keep 16:9 aspect ratio** — project screenshots are landscape dashboard UIs; 3:2 would crop useful content
5. **Promote resultSummary** — pull it above tech tags, heavier type weight, keep accent color
6. **Explicit navigation** — arrow buttons (already exist) sufficient for 6 items at 4-per-view (2 pages)

**Open question:** Should cards-per-view drop from 4 to 3 on desktop? At 1024px, 4 cards = ~240px each, which may cramp richer hover content. 3-per-view = ~320px each, more breathing room but requires 2 pages of 3. Awaiting frontend-expert input on this.

### Portfolio Expert (interactive-portfolio skill)

**Overall verdict: The proposal trades scanning breadth for visual polish — a bad trade for this portfolio's actual audience.**

#### 1. The 30-second test — current design wins

A hiring manager in health-tech or pharma lands on this portfolio and has 30 seconds. The current design shows **4 project cards simultaneously**, each with:
- A thumbnail showing what was built
- The project name + year
- A bold result summary ("14,000 patients identified", "70% reduction in forms", "£2.6M savings")
- Tech stack tags (Python, React, SQL, etc.)
- Domain skill tags (Health Economics, Medicines Optimisation)

In 30 seconds, a hiring manager can **scan all 6 projects** (one arrow click reveals the other 2). They immediately see: this person builds data-driven healthcare tools, knows Python and React, and delivers measurable outcomes.

The proposed carousel shows **1 project in detail + 2 blurry thumbnails**. In 30 seconds, the hiring manager sees ONE project thoroughly and maybe clicks once. They leave with a narrow impression. This is catastrophic for someone who needs to demonstrate **breadth** — Andy is a pharmacist showing he can also build software. Breadth of projects IS the message.

#### 2. Information density is the killer feature

The current design's superpower is the `resultSummary` field. Every card screams a quantified outcome:
- "Live at medicines.charlwood.xyz"
- "14,000 patients identified"
- "70% reduction in forms"
- "Population-scale OME tracking"
- "Shared nationally across Tesco Pharmacy"
- "9 interactive chart types, sub-50ms responses"

These are visible **without any interaction**. The proposed design hides all of this behind the side thumbnails — you only see the result summary for the one active project. This eliminates the most compelling part of the portfolio: the cumulative weight of multiple measurable outcomes visible at once.

#### 3. The thumbnails are NOT marketing-quality hero images

I reviewed all 6 thumbnails:
- **PharMetrics**: Landing page screenshot — colorful but busy with emojis and gradients
- **Switching Dashboard**: Data table with map — dense, information-heavy, not visually striking at large sizes
- **Blueteq**: Desktop app screenshot — utilitarian form UI with instructions text
- **OME**: 3D surface chart — technically impressive but abstract, reads poorly below full-screen
- **NMS**: Video still — cinematic blue overlay, the only one that works as a "hero" image
- **Pathways**: Complex Dash dashboard with NHS branding — very busy with tiny text

Only 1 of 6 (NMS) works as a hero image. The rest are tool/dashboard screenshots that prove "I built real software." They work at small thumbnail size precisely because you see the general shape of a dashboard or application without needing to read the details. At **50% viewport width** in the focus area, the Switching Dashboard will show unreadable table cells and the Pathways screenshot will show tiny SNOMED codes. This creates a visual liability rather than an asset.

#### 4. With only 6 projects, the carousel pattern is already generous

6 items is barely worth a carousel at all. The proposal makes this worse: by showing only 1 at a time with side previews, the user must interact 5 times to see everything. The current continuous scroll shows 4/6 immediately — a single arrow click reveals the rest.

For 6 items, the ideal pattern would arguably be a **static 2x3 or 3x2 grid** where everything is visible without any interaction. But if the carousel must stay (the continuous scroll animation does add visual dynamism to the dashboard), the current "4 at once" density is the correct tradeoff.

#### 5. The focus-area approach may actually REDUCE click-through

Counter-intuitively, showing more detail about the active project could reduce motivation to click into the detail panel. The detail panel provides the deep dive — methodology, full results list, full tech stack. If the carousel focus area already shows a large thumbnail + description + full tech stack + domain skills, the user may feel they've "seen enough" and not click through.

The current design's hover overlay ("Intervention Outcomes" + "Click to view more →") creates a deliberate **information gap** that drives click-through. The brief `resultSummary` on each card acts as a hook — it teases the outcome without fully explaining how. The proposed design fills that gap prematurely in the carousel itself.

#### 6. GP clinical system theme coherence

GP systems (EMIS, SystmOne) are fundamentally **list-based and information-dense**. They show multiple patients, multiple medications, multiple results simultaneously in compact rows. A "spotlight one item" carousel is the opposite of this aesthetic — it's closer to an e-commerce product viewer or photography portfolio. The current 4-card view is actually MORE aligned with the GP records metaphor: compact, scannable, data-rich rows of structured information.

#### 7. What the hiring manager actually needs to see

Andy's target audience is health-tech and pharma. These hiring managers want to answer:
1. "Does this person understand healthcare data?" — The domain skills tags answer this instantly across all visible cards
2. "Can they actually build software?" — The tech stack tags and thumbnail screenshots answer this
3. "Do they deliver results?" — The resultSummary answers this with quantified outcomes
4. "Should I dig deeper?" — The hover overlay with specific results creates the motivation

All four questions are answered by the current design **within 10 seconds of passive scanning**. The proposed design answers them for 1 project at a time, requiring 5+ interactions to build the same picture.

#### Recommendation

**Keep the current 4-at-once carousel as the primary desktop pattern.** If visual polish is the goal:
- Improve card design within the existing layout (crisper thumbnail borders, better tag spacing)
- Make the hover overlay transition smoother and richer
- Make `resultSummary` even more prominent (slightly larger font, accent color treatment)
- Consider bumping thumbnail aspect ratio from 16:9 to 3:2 for more visual weight
- Drop the auto-scroll in favor of user-driven navigation (the UX designer's point about WCAG 2.2.2 is valid)

If a redesign is truly wanted, a **2x3 static grid** would outperform the proposed focus carousel — everything visible at once, zero interaction required, and the grid pattern fits the GP records aesthetic of structured, scannable data layouts.

#### Updated Position (after Round 2-3 debate)

Consensus reached. All three agents reject the focus carousel and agree on iterative improvement. On the two remaining open items:

- **Hover state**: I accept either Option A or B from the consensus. The current dark overlay works today and promoting resultSummary to the default card state reduces the urgency of changing the hover. Defer to Andy.
- **Cards per view**: I maintain 4 across all desktop breakpoints. The density argument holds. If 1024px feels cramped, address it later with data rather than preemptively reducing to 3.
- **Aspect ratio**: I concede my 3:2 suggestion. The UX designer and frontend expert both correctly noted that 16:9 matches the landscape dashboard screenshots without cropping. Withdrawn.

### Frontend Design Expert

**Overall position: The center-focus carousel proposal should be rejected. It has fatal feasibility issues below 1440px, breaks the GP clinical system theme, and trades scanning breadth for visual spectacle — the wrong tradeoff for this audience. The current multi-card layout should be iteratively improved instead.**

#### 1. Layout Feasibility — The Numbers Kill This at Common Viewport Widths

The proposal asks for a 50% center focus with flanking thumbnails. Here are the pixel budgets:

- **At 1024px** (`lg` breakpoint): Sidebar = `--sidebar-width: 304px` → ~720px content. 50% focus = 360px. Split thumbnail + text = ~180px each. A 180px-wide 16:9 thumbnail = 101px tall. Text at 180px = ~3 words per line at 13px `--font-primary`. Side thumbnails need ~120px minimum each with title overlay, leaving 360px total for both = 180px each with zero gap/padding. **Physically impossible to render meaningfully.**
- **At 1280px**: ~976px content. Focus = 488px, split = ~244px. Side thumbnails = ~244px each. Methodology text wraps to 7-8 lines. Cramped but borderline.
- **At 1440px**: ~1136px content. Focus = 568px, split = ~284px. Starts to breathe.
- **At 1920px**: ~1616px content. Fully comfortable.

The 1024-1440px range covers the majority of laptop screens (1366x768 is still the most common laptop resolution globally). The proposal fails at the most common desktop viewport.

#### 2. Responsive Complexity — Three Tiers for Six Items

Currently: 2 modes (~490 lines total). Proposed: 3 modes.
- Mobile: Embla slide-by-slide (existing, fine)
- Tablet/small desktop (768-1440px): **No design specified** — would need its own treatment
- Large desktop (1440px+): Center-focus

For 6 projects, maintaining 3 separate carousel implementations is an engineering overhead that doesn't match the content scale. Every bug, every styling change, every new project added must be tested across 3 modes.

#### 3. Implementation — Concrete Technical Risks

Current `ContinuousScrollCarousel`: `requestAnimationFrame` loop, duplicated track, chevron jump. ~250 lines, zero edge cases beyond resize handling.

The proposed design introduces:
- **Conditional slide rendering based on active index**: The focused slide renders a split layout; flanking slides render thumbnail-only with title overlay. This requires tracking `selectedScrollSnap()` and re-rendering the slide content on every navigation. Embla doesn't natively provide "render this slide differently when it's the center one" — you'd detect the active index and conditionally render, but the layout shift between states (thumbnail-only → split panel) happens mid-animation, which creates visual jank unless carefully choreographed with crossfade transitions.
- **Variable content heights**: PharMetrics methodology = ~73 words; Blueteq = ~24 words. The focus panel height changes dramatically between projects. Options: (a) fixed height with truncation (defeats purpose), (b) variable height (layout shift on every navigation), (c) fixed to tallest (wastes space). None are clean.
- **Peek width coordination**: The side thumbnail visible width must be calculated to show enough of the image + title overlay to be meaningful, but not so much that it competes with the focus area. This ratio changes at every viewport width.

#### 4. Performance — Non-Issue

12 DOM nodes (current) vs. 3-5 visible nodes (proposed) — irrelevant with 6 projects on modern hardware. **Not a factor.**

#### 5. GP Clinical Theme — This Is Where the Proposal Fails Categorically

All three agents appear to agree on this, so let me add the CSS pattern analysis:

**Clinical record browsing patterns in GP software:**

| System | Pattern | CSS equivalent |
|--------|---------|---------------|
| EMIS Problem List | Striped table rows | `display: grid; grid-template-columns: ...` |
| EMIS Documents | Master-detail pane | `grid-template-columns: 1fr 2fr` with selection state |
| SystmOne Investigations | Flowsheet grid | Dense `grid` with compact cells |
| SystmOne Consultations | Expandable list | Accordion with `max-height` transitions |

**Center-focus carousel patterns:**

| Context | Association |
|---------|-------------|
| Apple product pages | Marketing/premium product |
| Netflix hero row | Entertainment/media |
| Shopify product gallery | E-commerce |
| Dribbble showcase | Design portfolio |

These are fundamentally different design languages. The current 4-card carousel reads as "a row of compact records" — it is information-dense, uniform in treatment, and functionally scannable. The center-focus carousel reads as "spotlighting a featured product" — it prioritizes one item's visual impact over collective scannability.

The portfolio's entire identity rests on the EMIS/SystmOne aesthetic. Every other component (sidebar, timeline accordion, KPI cards, constellation) follows this language. The carousel is the one section where the clinical metaphor is most fragile. Pushing it further toward "product showcase" would create an uncanny valley — clinical everywhere else, marketing here.

#### 6. Typography/Spacing — Inconsistent Heights, Dense Columns

At 284px text column width (1440px viewport), rendering methodology text at 13px `--font-primary`:
- PharMetrics: ~73 words → ~9 lines → ~150px text height
- Blueteq: ~24 words → ~3 lines → ~50px text height
- Patient Pathway: ~65 words → ~8 lines → ~135px text height

The focus panel height would swing by ~100px between items. Add title (20px), year (14px), result summary (18px), tech tags (28px), skill tags (28px), and gaps (~40px total): the full panel ranges from ~200px to ~300px. The 16:9 thumbnail at 284px = ~160px tall. So for short-methodology projects, thumbnail and text are similar height; for long-methodology projects, text dominates and the thumbnail looks small. **This visual inconsistency would feel unpolished.**

#### 7. Agreement with Other Agents

- **UX Designer's WCAG 2.2.2 point on auto-scroll**: Correct. The current auto-scroll should be dropped regardless of whether the carousel is redesigned.
- **Portfolio Expert's 30-second test**: The strongest argument against the proposal. 4 simultaneous cards with quantified outcomes visible at once is categorically more effective for a hiring manager than sequential one-at-a-time discovery.
- **Portfolio Expert's thumbnail quality assessment**: Valid. These are dashboard/tool screenshots, not product photography. They work at thumbnail scale (you see "a dashboard"); at hero scale they show unreadable UI elements.
- **UX Designer's progressive disclosure critique**: Agreed — tech stack and domain skills are primary scanning criteria that should stay visible on all items, not hidden behind selection.

#### 8. UX Designer's Open Question — Cards Per View

The UX Designer asks whether to drop from 4 to 3 cards per view. My analysis:

At 4 cards per view with 720px content (1024px viewport):
- Card width = (720 - 3*12px gap) / 4 = ~171px. With 12px card padding, content area = ~147px. That IS tight for a richer hover state.

At 3 cards per view:
- Card width = (720 - 2*12px gap) / 3 = ~232px. Content area = ~208px. Significantly more room for hover content, tags wrap less.
- At 1440px: card width = (1136 - 2*12px) / 3 = ~371px. Very comfortable.
- Tradeoff: 3 per view means 2 pages (3+3) instead of ~1.5 pages (4+2). One extra navigation step.

**My recommendation: Stay at 4 cards per view.** The density is the feature. At 1024px the cards are tight but functional — the tag truncation (`+3`, `+2`) already handles overflow gracefully. The hover overlay covers the full card area regardless of width. 3-per-view gives more breathing room per card but loses the "wall of results" scanning impact that the Portfolio Expert correctly identifies as the design's superpower.

---

### Summary Recommendation

**Reject the center-focus carousel. Iteratively improve the existing 4-card layout:**

1. **Drop auto-scroll** — Replace `requestAnimationFrame` infinite loop with static positioning + chevron/keyboard navigation. Removes ~60 lines of code, fixes WCAG 2.2.2, eliminates DOM duplication.
2. **Promote `resultSummary`** — Move above tag row, increase to 13px, use `--accent` color. Already rendered; just needs reordering and restyling.
3. **Add keyboard navigation** — Arrow keys advance cards, Enter opens detail panel. Implement WAI-ARIA carousel pattern (`role="region"`, `aria-roledescription="carousel"`, per-slide `role="group"`).
4. **Improve hover overlay** — The current dark overlay with results list works. Could add a brief methodology excerpt above the results list for richer content on hover. Keep the "Click to view more →" CTA.
5. **Keep 4 cards per view, 16:9 thumbnails** — Density and scannability are the competitive advantage.

---

## Debate Log

### Round 1: Initial positions
- **UX Designer** proposed rejecting center-focus carousel entirely. Offered two alternatives: (a) clinical record browser / tabular list, (b) improved current multi-card layout.
- **Portfolio Expert** agreed center-focus carousel breaks theme. Challenged tabular list as too functional — loses visual texture thumbnails provide. Advocated for path (b): keep multi-card, fix interaction layer.
- **Frontend Expert** provided detailed pixel-budget analysis showing the proposal fails at 1024-1440px (the most common viewport range). Strongest technical argument: at 1024px, the 50/50 split gives only ~180px per half, physically impossible to render meaningfully.

### Round 2: Convergence on multi-card improvement
- **UX Designer** withdrew tabular list proposal (convinced it would homogenize dashboard). Proposed: drop auto-scroll, slide-up hover panel (60% coverage), composite keyboard nav, keep 16:9, promote resultSummary.
- **Portfolio Expert** pushed back on slide-up hover panel (still disruptive). Counter-proposed: minimal hover (highlight + "View details" affordance), outcomes only in detail panel. Advocated 4 cards per view.
- **Frontend Expert** recommended 4 cards per view. Analyzed hover overlay: current dark overlay with results list works, could be enriched. Rejected 3-per-view.

### Round 3: Hover state refinement
- **UX Designer** proposed compromise: subtle bottom bar (32-40px) on hover showing first outcome teaser + click affordance. Three-tier progressive disclosure: scan → hover teaser → detail panel. Accepted 4 cards at 1280px+, proposed 3 at 1024-1279px.
- **Frontend Expert** stayed at 4 cards across all desktop sizes, noting tag truncation already handles overflow.
- All three agents unanimously reject center-focus carousel and agree on iterative improvement path.

---

## Consensus

### Unanimous: Reject the center-focus carousel proposal

All three agents agree the proposed center-focus carousel with flanking thumbnails should **not** be built. Reasons:

1. **Layout infeasibility below 1440px**: At the 1024px breakpoint (most common laptop viewport), only ~720px of content area is available. The 50/50 split focus gives ~180px per half — physically unusable for both thumbnails and text. (Frontend Expert)
2. **GP clinical theme violation**: Center-focus carousels are the visual language of Apple product pages, Netflix, and e-commerce — not clinical record systems. EMIS/SystmOne use lists, tables, accordions, and master-detail panes. The current 4-card carousel is already at the edge of the clinical metaphor; the proposal pushes it into marketing territory. (All three agents)
3. **Scanning breadth is the competitive advantage**: A hiring manager needs to see 4+ quantified outcomes simultaneously ("14,000 patients identified", "70% reduction in forms", "£2.6M savings") within 10-30 seconds. The proposal shows 1 at a time. (Portfolio Expert)
4. **Thumbnail quality mismatch**: 5 of 6 thumbnails are dashboard/tool screenshots that work at small scale but show unreadable UI elements at hero scale. (Portfolio Expert)
5. **Progressive disclosure error**: Hiding tech stack and domain skills on non-active items removes the primary scanning criteria for recruiters. (UX Designer)

### Agreed: Iterative improvement of the existing multi-card layout

**Changes to implement (unanimous agreement):**

1. **Drop auto-scroll** — Remove the `requestAnimationFrame` infinite loop and DOM duplication (the two `[0, 1].map()` sets). Replace with static Embla carousel using chevron navigation. Fixes WCAG 2.2.2 (auto-advancing content), simplifies code by ~60-80 lines.

2. **Promote `resultSummary` visibility** — Move above the tech/skills tag row, increase font size to 13px, use `var(--accent)` color token. This is already rendered on each card; just needs reordering and restyling. The result summary is the single most compelling element per card.

3. **Add keyboard navigation** — Implement WAI-ARIA carousel pattern:
   - `role="region"` + `aria-roledescription="carousel"` + `aria-label="Significant Interventions"` on container
   - `role="group"` + `aria-roledescription="slide"` + `aria-label="Project N of 6: Name"` on each card
   - Arrow keys to navigate between cards, Enter/Space to open detail panel, Escape to return focus to carousel
   (UX Designer spec)

4. **Keep 4 cards per view, 16:9 thumbnails** — Density and scannability are the design's strength. Tag truncation (`+3`, `+2`) already handles overflow at narrow widths. 16:9 matches the landscape dashboard screenshots without cropping useful content.

**Open items (minor disagreement, either approach acceptable):**

5. **Hover state refinement** — Two options on the table:
   - *Option A* (Frontend Expert): Keep current dark overlay with results list + "Click to view more" CTA. Optionally add a brief methodology excerpt above the results.
   - *Option B* (UX Designer): Replace with a subtle bottom bar (32-40px) on hover showing the first result as a teaser + click affordance. Less disruptive, maintains spatial continuity.
   - **Recommendation**: Either is acceptable. Option B is more refined but more work to implement. Option A works today with zero changes. Defer to Andy's preference.

6. **Cards per view at 1024-1279px** — Two positions:
   - *4 per view* (Frontend Expert, Portfolio Expert): Tight (~171px per card) but functional. Maintains the "wall of results" scanning density.
   - *3 per view at 1024-1279px, 4 at 1280px+* (UX Designer): More breathing room per card at the tightest breakpoint.
   - **Recommendation**: Start with 4 everywhere. If user testing reveals cramping at 1024px, add a responsive 3-per-view breakpoint later. Simpler to ship, easier to adjust.

### Implementation estimate

Items 1-4 are achievable within the existing `ProjectsTile.tsx` component with approximately 50-100 lines of net changes (removing auto-scroll code offsets new ARIA/keyboard code). No new dependencies. No new components. No breaking changes to data or types.

---

## Data Context

6 projects total. Fields per project: `name`, `requestedYear`, `status` (Complete/Ongoing/Live), `resultSummary`, `methodology` (long text description), `results[]`, `techStack[]`, `skills[]`, `externalUrl?`, `demoUrl?`, `thumbnail?`

## Design System Context
- Primary: Teal #00897B / Accent: Coral #FF6B6B
- PMR palette: GP system-inspired greens, teals, greys
- Font tokens: --font-ui (Elvaro Grotesque), --font-geist-mono (Geist Mono/Fira Code), --font-primary (Plus Jakarta Sans), --font-secondary (Inter Tight)
- Industrial/utilitarian tone — the portfolio mimics a GP clinical records system (EMIS/SystmOne aesthetic)
