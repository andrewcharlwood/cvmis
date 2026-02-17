# Task: Fix Mobile Responsiveness for Small Viewport Widths (≤430px)

The portfolio website is broken on phones with viewport widths around 400px. Text overflows off-screen, elements are hidden behind `overflow: hidden`, and layout components are sized inappropriately for small screens.

## Context

- **Tech stack:** React + TypeScript + Tailwind CSS + Framer Motion + D3
- **Dev server:** `npm run dev` (localhost:5173)
- **Quality gates:** `npm run lint && npm run typecheck && npm run build`
- **Smallest configured breakpoint:** `xs: 480px` in tailwind.config.js — there is no sub-480px handling
- **Key layout file:** `src/components/DashboardLayout.tsx` orchestrates all dashboard tiles
- **CSS media queries:** `src/index.css` contains most custom responsive rules
- **Tailwind config:** `tailwind.config.js` defines breakpoints and theme

## Target Viewports

Test and fix at these widths (all portrait orientation, 812px height):
- **320px** — iPhone SE / smallest realistic phone
- **360px** — Common Android (Samsung Galaxy S series)
- **375px** — iPhone 12 mini / iPhone SE 3rd gen
- **390px** — iPhone 14
- **400px** — User's specific device (primary target)
- **414px** — iPhone 8 Plus / larger phones
- **430px** — iPhone 14 Pro Max

## Known Issues (from codebase analysis)

### Critical
1. **Sidebar must become a bottom nav bar at <600px** — The current sidebar is a 304px-wide overlay on mobile, leaving only 96px for content at 400px. At viewport widths below 600px, replace the sidebar with a **bottom navigation bar** that:
   - **Collapsed state (default):** A slim fixed bar along the bottom edge of the screen with icon-based navigation items (like a mobile tab bar / iOS-style bottom nav). Should not obscure content — main content area accounts for its height.
   - **Expanded state (on tap/click):** Slides up as a drawer/sheet showing the full sidebar content (patient name, navigation links, etc.). Tapping the bar or a close affordance collapses it back down.
   - The existing sidebar behavior for viewports ≥600px should remain completely unchanged.
   - Use Framer Motion for the drawer slide animation, consistent with existing animation patterns.
2. **KPI grid forces 2 columns** — `repeat(2, minmax(0, 1fr))` creates cramped cards at small widths. Values use `30px` font.
3. **Timeline text silently clipped** — `overflow: hidden` on Card.tsx hides content with no visual indication (no ellipsis, no wrapping).
4. **Project carousel cards too small** — At 400px with 2 cards per view, each card is only ~194px wide.

### Important
5. **Constellation graph** — 520px height at <768px may be disproportionate; needs better sizing.
6. **No sub-480px breakpoint** — The smallest Tailwind breakpoint is `xs: 480px`, leaving 320-479px unhandled.

### Minor
8. **Padding/spacing** — `p-5` (20px) main content + `24px` card padding eats significant space at 400px.
9. **Detail panel header** — Close button (44px) + title cramped at narrow widths.
10. **Skills/medications grid** — May need column count reduction at small widths.

## Requirements

- **All text must be visible** — no text clipped by `overflow: hidden` without ellipsis or wrapping. Truncated text needs `text-overflow: ellipsis` with title attribute for accessibility.
- **All interactive elements must be reachable** — nothing hidden off-screen or behind other elements.
- **Touch targets** — minimum 44x44px for interactive elements.
- **Readable font sizes** — minimum 12px body text, 14px primary content.
- **No horizontal scroll** — page must never scroll horizontally at any target viewport.
- **Maintain visual identity** — keep PMR aesthetic, teal/coral palette, existing design language. Adapt proportionally, don't radically redesign.
- **Respect existing patterns** — use Tailwind classes where possible, use existing CSS custom properties, follow project conventions.

## Success Criteria

All of the following must be true:

- [ ] `npm run lint` passes with zero errors
- [ ] `npm run typecheck` passes with zero errors
- [ ] `npm run build` succeeds
- [ ] At 320px viewport: no horizontal scrollbar, all text readable, no content clipped without indication
- [ ] At 360px viewport: same as above
- [ ] At 375px viewport: same as above
- [ ] At 390px viewport: same as above
- [ ] At 400px viewport: same as above (primary target)
- [ ] At 414px viewport: same as above
- [ ] At 430px viewport: same as above
- [ ] At <600px: sidebar is replaced by a bottom nav bar with collapsed (tab bar) and expanded (drawer) states
- [ ] Bottom nav bar does not obscure page content in collapsed state (content has bottom padding/margin to account for it)
- [ ] Bottom nav drawer expands on tap and shows full navigation content
- [ ] Bottom nav drawer can be collapsed back down
- [ ] At ≥600px: existing sidebar behavior is completely unchanged
- [ ] KPI cards are readable with appropriate font sizing
- [ ] Timeline entries show full text or have proper ellipsis truncation
- [ ] Project carousel cards are adequately sized (consider 1 card per view if needed)
- [ ] Constellation graph fits within viewport without excessive scrolling
- [ ] Desktop/tablet layouts (768px+) remain unchanged and unbroken

## Constraints

- Do NOT change boot sequence, ECG animation, or login screen (already handle small screens)
- Do NOT change D3 force simulation logic — only container sizing
- Do NOT add new npm dependencies
- Do NOT remove existing features or functionality
- Keep changes minimal and focused — fix responsiveness, don't redesign
- Preserve all existing breakpoint behavior for md (768px) and above

## Visual Validation Method

Use Playwright MCP to:
1. Navigate to `http://localhost:5173` (dev server must be running)
2. Get past boot sequence + ECG + login to reach dashboard
3. Set viewport to each target width × 812px height
4. Take screenshots of dashboard at each viewport
5. Visually inspect for: overflow, clipping, cramped text, unreachable elements
6. Scroll through full page and verify no content is hidden

## Status

Track progress here. When all success criteria are met, print LOOP_COMPLETE.
