# PRD: Login Screen Logo & Blur Refinements

## Introduction

Refine the login screen's CVMIS logo animation and backdrop blur to match the quality of the original Remotion reference, and align the login screen's visual details with the dashboard's design system. The logo and branding text need to be larger (the logo + title + subtitle block should occupy ~50% of the login card's height), the fan animation needs tunable timing variables, overlapping capsules need a multiply-blend effect on their intersection areas, the backdrop blur should cover the full dashboard (including TopBar) at reduced intensity, and several visual inconsistencies between the login screen and the dashboard should be resolved.

## Goals

- Scale logo + branding text so the branding block is ~50% of the login card height
- Increase branding text ("CVMIS" title and "CV Management Information System" subtitle) to match dashboard-level typography
- Add configurable animation timing constants for easy tuning of rise/fan speeds
- Implement CSS `mix-blend-mode: multiply` overlap effect matching the Remotion reference
- Extend backdrop blur to cover TopBar and all dashboard content uniformly
- Reduce blur intensity by ~50% (from 20px to ~10px)
- Align login card border radius, shadow, and hardcoded colors with dashboard design tokens
- Fix minor typography weight and sizing inconsistencies

## User Stories

### US-001: Scale logo and branding block to ~50% of login card height
**Description:** As a visitor, I want the CVMIS logo and branding text to be larger and more prominent, occupying roughly half the login card's height so the brand has real visual presence.

**Acceptance Criteria:**
- [ ] Logo height scaled up ~2–2.5x from current `clamp(80px, 8vw, 120px)` — target approximately `clamp(160px, 18vw, 280px)` (tune visually for balance)
- [ ] Width scales proportionally (maintains aspect ratio via SVG viewBox)
- [ ] The branding block (logo + "CVMIS" title + "CV Management Information System" subtitle + spacing) occupies approximately 50% of the total login card height
- [ ] Logo does not overflow or clip on mobile viewports (≥375px wide)
- [ ] Typecheck passes
- [ ] **Verify in browser using Playwright:** measure the branding block height vs total login card height and confirm it is approximately 50% (±10%)

### US-002: Increase branding text to match dashboard typography scale
**Description:** As a visitor, I want the "CVMIS" title and "CV Management Information System" subtitle on the login screen to be larger and more in line with the text scale used in the GP dashboard (TopBar brand text is 15px/600 weight).

**Acceptance Criteria:**
- [ ] "CVMIS" title font size increased from 13px — target approximately 18–20px to match dashboard heading scale
- [ ] "CV Management Information System" subtitle font size increased from 11px — target approximately 13–14px
- [ ] Both remain in `font-ui` (Elvaro Grotesque) with appropriate weight hierarchy
- [ ] Text remains visually balanced with the larger logo above and the login form below
- [ ] Typecheck passes
- [ ] **Verify in browser using Playwright:** confirm text is rendered at the expected sizes

### US-003: Extract animation timing into named constants
**Description:** As a developer, I want all animation timing values in CvmisLogo.tsx exposed as named constants at the top of the file so I can quickly tune rise speed, fan speed, fan delay, and easing without digging through the component logic.

**Acceptance Criteria:**
- [ ] Named constants at the top of `CvmisLogo.tsx` for at minimum:
  - Rise duration (currently 500ms)
  - Fan delay after rise (currently 500ms)
  - Fan duration (currently 600ms)
  - Fan easing curve
  - Fan rotation angle (currently ±50°)
  - Fan horizontal spacing (currently ±16px)
  - Right pill stagger delay (currently 30ms)
  - Overlap blend start progress (target: 0.5 = 50% into fan)
  - Overlap blend max opacity (target: 0.2 matching Remotion)
  - Overlap blend transition duration
- [ ] Component behaviour unchanged when constants retain current values
- [ ] Constants are clearly named and grouped with a brief comment block
- [ ] Typecheck passes

### US-004: Add overlap blend effect on fanning capsules
**Description:** As a visitor, I want to see a subtle color blend where the fanning capsules overlap, matching the multiply-blend effect from the original Remotion animation.

**Acceptance Criteria:**
- [ ] CSS `mix-blend-mode: multiply` hardcoded on the fanning pill elements
- [ ] Blend effect is not visible at the start of the fan animation
- [ ] Blend fades in starting at ~50% of the fan animation progress (matching `OVERLAY_BLEND_START_PROGRESS = 0.5` from Remotion)
- [ ] Blend reaches max intensity by the end of the fan (or configurable transition window)
- [ ] Max blend opacity approximately 0.2 (20%), matching `OVERLAP_BLEND_MAX_OPACITY` from Remotion
- [ ] On a light background, the blend is only perceptible where capsules actually overlap
- [ ] Blend transition feels smooth, not abrupt
- [ ] Respects `prefers-reduced-motion` (no animation, show final state)
- [ ] Typecheck passes
- [ ] **Verify in browser using Playwright:** visually confirm blend is visible in overlap areas during/after fan animation

### US-005: Extend backdrop blur to cover full dashboard including TopBar
**Description:** As a visitor, I want the frosted-glass blur behind the login card to cover the entire dashboard — including the TopBar and sidebar — so nothing behind the overlay is sharp.

**Acceptance Criteria:**
- [ ] Blur overlay z-index raised above TopBar's z-index (currently TopBar is `zIndex: 100`, login overlay is `z-50`). Overlay must be ≥ `zIndex: 110` or similar.
- [ ] TopBar, Sidebar, and all dashboard content are uniformly blurred behind the overlay
- [ ] Login card itself remains crisp and unblurred (card z-index above overlay)
- [ ] Blur still fades out during the dissolve/exit transition
- [ ] Typecheck passes
- [ ] **Verify in browser using Playwright:** confirm TopBar is blurred behind the overlay (not rendered sharply above it)

### US-006: Reduce backdrop blur intensity by ~50%
**Description:** As a visitor, I want the backdrop blur to be softer/less aggressive so the dashboard behind is slightly more visible while still providing contrast for the login card.

**Acceptance Criteria:**
- [ ] Blur value reduced from `blur(20px)` to approximately `blur(10px)`
- [ ] The blur value should be a named constant (co-located with other LoginScreen timing constants) for easy adjustment
- [ ] Login card remains clearly readable against the softened backdrop
- [ ] Typecheck passes
- [ ] **Verify in browser using Playwright:** confirm blur is visibly softer than before

### US-007: Align login card border radius and shadow with dashboard design system
**Description:** As a visitor, I want the login card to feel like it belongs to the same design system as the dashboard. Currently the border radius and shadow diverge from the dashboard tokens.

**Acceptance Criteria:**
- [ ] Login card border radius changed from hardcoded `12px` to `8px` (matching `var(--radius-card)` / dashboard cards)
- [ ] Login input fields and button border radius changed from hardcoded `4px` to `6px` (matching `var(--radius-sm)` / dashboard inner elements)
- [ ] Login card shadow upgraded from `shadow-sm` (`0 1px 2px rgba(26,43,42,0.05)`) to `shadow-lg` (`0 8px 32px rgba(26,43,42,0.12)`) — appropriate for a floating modal over a blurred backdrop, consistent with the command palette
- [ ] Use CSS custom property references (`var(--radius-card)`, `var(--radius-sm)`, `var(--shadow-lg)`) where available rather than hardcoded values
- [ ] Typecheck passes
- [ ] **Verify in browser using Playwright:** confirm card corners and shadow match dashboard card styling

### US-008: Replace hardcoded colors with design tokens
**Description:** As a developer, I want the login screen to reference the same CSS custom properties as the dashboard so that any future palette changes propagate consistently.

**Acceptance Criteria:**
- [ ] Input text color changed from hardcoded `#111827` to `var(--text-primary, #1A2B2A)` (the project's actual primary text color)
- [ ] Cursor/caret color changed from hardcoded `#0D6E6E` to `var(--accent, #0D6E6E)`
- [ ] Button background colors changed from hardcoded `#0D6E6E` / `#0A8080` / `#085858` to `var(--accent)` / `var(--accent-hover)` / appropriate pressed variant using token references
- [ ] Any other hardcoded color values in LoginScreen.tsx that have corresponding CSS custom properties should use the token instead
- [ ] No visual change (token values currently resolve to the same colors)
- [ ] Typecheck passes

### US-009: Fix minor typography inconsistencies
**Description:** As a visitor, I want the login screen's typography weight and sizing to feel consistent with the dashboard's conventions.

**Acceptance Criteria:**
- [ ] Form label font weight increased from 500 to 600 (matching dashboard card header weight convention)
- [ ] `clamp()` typography on inputs and button is acceptable (responsive approach for a modal), but ensure the base/mid values align with dashboard equivalents where practical (e.g., input text mid-value ~14px to match dashboard body, button mid-value ~15px)
- [ ] Connection status indicator gap increased from 6px to 8px (matching dashboard `CardHeader` gap)
- [ ] No dramatic visual change — these are subtle alignment fixes
- [ ] Typecheck passes

## Functional Requirements

- FR-1: CvmisLogo `cssHeight` prop updated to approximately `clamp(160px, 18vw, 280px)` — final values to be tuned visually
- FR-2: "CVMIS" title font size increased from 13px to ~18–20px; subtitle from 11px to ~13–14px
- FR-3: All animation timing values in `CvmisLogo.tsx` extracted to named constants at the top of the file
- FR-4: CSS `mix-blend-mode: multiply` (hardcoded) applied to left and right pill elements during the fan animation
- FR-5: Blend effect opacity animated from 0 to ~0.2, beginning at 50% fan progress, using a smooth transition
- FR-6: Login screen blur overlay z-index raised above TopBar (`zIndex: 100`) to cover full viewport
- FR-7: Blur intensity reduced from `blur(20px)` to `blur(10px)` via a named constant
- FR-8: Login card border radius aligned to `var(--radius-card)` (8px), inputs/button to `var(--radius-sm)` (6px)
- FR-9: Login card shadow upgraded to `shadow-lg` for proper modal elevation
- FR-10: All hardcoded color values replaced with CSS custom property references where tokens exist
- FR-11: Form label weight aligned to 600, minor spacing/sizing adjustments to match dashboard conventions
- FR-12: All changes respect `prefers-reduced-motion` — animations skip to final state

## Non-Goals

- No canvas-based compositing (using CSS `mix-blend-mode` approach, not replicating the Remotion canvas pipeline)
- No changes to the boot sequence or ECG animation (locked)
- No changes to the login typing animation timing or credentials
- No changes to the dissolve/exit transition behaviour (beyond blur fading and z-index)
- No changes to the dashboard layout or content behind the overlay
- Blend mode is hardcoded to `multiply` — no configurable blend mode switching
- No conversion of login `<div>` fields to `<input>` elements (the login is theatrical animation, not a real form — divs are intentional)

## Design Considerations

- **Remotion reference:** `LogoAnimation/src/Composition.tsx` — the blend uses `globalCompositeOperation: "multiply"` at 20% opacity, masked to intersection areas, starting at 50% fan progress. The CSS `mix-blend-mode: multiply` approach approximates this; on light backgrounds, multiply blending is only perceptible where elements overlap.
- **Branding block proportions:** The branding block (logo + title + subtitle + internal spacing) should take up ~50% of the total login card height. The login form (fields + button + connection indicator) occupies the other ~50%. This creates a strong brand-first impression.
- **Text scale reference:** TopBar brand text is 15px/600w. The login "CVMIS" title should be larger than the TopBar (it's the hero brand moment) — ~18–20px. The subtitle can be ~13–14px, matching dashboard label scale.
- **Blur coverage:** Currently the overlay is `z-50` and TopBar is `zIndex: 100`, so the TopBar renders above the blur. Fix: raise the overlay's z-index above 100 while keeping the login card above the overlay.
- **Design system alignment:** The login card should use the same border radius, shadow, and color tokens as dashboard components. The card is a modal (like the command palette) so `shadow-lg` is the correct elevation tier. Border radius should match `var(--radius-card)` (8px) not exceed it.

## Technical Considerations

- The `mix-blend-mode` property is well-supported in modern browsers. Framer Motion's `style` prop can animate opacity on elements with `mixBlendMode` set.
- The blend opacity animation should be driven by the same fan animation progress value, using Framer Motion's `useTransform` or similar to derive the blend opacity from fan progress.
- The backdrop blur overlay's z-index must be higher than the TopBar's z-index (100) to cover it, while the login card's z-index must be higher still.
- Named constants should follow the existing Remotion naming convention (e.g., `OVERLAY_BLEND_START_PROGRESS`, `OVERLAP_BLEND_MAX_OPACITY`) for consistency.
- Check whether `var(--accent-hover)` exists as a token or needs to be added. If not, a hardcoded hover shade is acceptable as a local constant.
- **Playwright verification:** Use Playwright MCP to measure the branding block vs card height ratio, confirm text sizes, and visually verify blur coverage and blend effects.

## Success Metrics

- Logo + branding block is ~50% of login card height (verified via Playwright measurement)
- Branding text is noticeably larger, matching dashboard-level typography
- Overlap blend is perceptible but subtle — matches the understated feel of the Remotion reference
- Developer can tune all animation timings by editing constants at the top of one file
- Backdrop blur is uniform across the full viewport including TopBar (no sharp elements above the overlay)
- Blur feels softer/more transparent than before
- Login card visually belongs to the same design system as the dashboard (matching radius, shadow, color tokens)

## Open Questions

None — all questions resolved.
