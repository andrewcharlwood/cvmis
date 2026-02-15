# PRD: Login Screen Rework

## Introduction

The login screen currently feels undersized on desktop/4K displays, visually disconnected from the GP dashboard aesthetic, and lacks clear affordances telling users they need to click the login button. This rework addresses sizing, style alignment, branding, background treatment, logo animation, and UX clarity — making the login feel like an integrated part of the GP system rather than a disconnected intro screen.

## Goals

- Scale the login card appropriately across all viewports (mobile through 4K)
- Align login screen colors, typography, and styling with the GP dashboard
- Rebrand from "CareerRecord PMR" to "CVMIS" with updated subtitle
- Replace the Shield icon with the custom CVMIS capsule logo (animated reveal on login, static on dashboard)
- Replace the solid dark background with a live blurred dashboard for visual continuity
- Create a clear, sequenced UX flow (typing → connection established → button activates → pulse) so users know exactly when and what to click
- Smooth dissolve transition from login overlay to revealed dashboard

## User Stories

### US-001: Responsive Login Card Sizing
**Description:** As a visitor on a 1440p or 4K display, I want the login card to feel proportionate to my screen so it doesn't look lost in empty space.

**Acceptance Criteria:**
- [ ] Login card uses responsive width: min 320px, scales up with viewport (e.g. `clamp(320px, 28vw, 480px)`)
- [ ] Internal padding, font sizes, icon size, and input heights scale proportionally
- [ ] Card still looks good on mobile (≤480px viewport) — should not exceed viewport width minus margins
- [ ] Card is vertically and horizontally centered
- [ ] Typecheck passes
- [ ] Verify in browser at 1440p and mobile viewport using dev-browser skill

### US-002: Style Alignment with GP Dashboard
**Description:** As a visitor, I want the login screen to feel like part of the same system I'll use after logging in, not a separate app.

**Acceptance Criteria:**
- [ ] Card uses dashboard color tokens: `pmr-surface` background, `pmr-border` borders, `pmr-text-primary`/`pmr-text-secondary` text colors
- [ ] Input fields use `pmr-accent` (#0D6E6E) for focus states, `pmr-border-card` (#E4EDEB) for default borders
- [ ] Button uses `pmr-accent` (#0D6E6E) background with hover `#0A8080`
- [ ] Font usage matches dashboard: `font-ui` (Elvaro) for labels/buttons, `font-geist` for monospace data
- [ ] Card shadow matches dashboard card shadow tokens (`shadow-sm` resting, `shadow-md` on the overlay context)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-003: Rebrand to CVMIS
**Description:** As the portfolio owner, I want the login to say "CVMIS" (a tongue-in-cheek play on EMIS) with the subtitle "CV Management Information System".

**Acceptance Criteria:**
- [ ] Title text changed from "CareerRecord PMR" to "CVMIS"
- [ ] Subtitle changed from "Clinical Information System" to "CV Management Information System"
- [ ] Footer text "Secure clinical system login" remains unchanged
- [ ] Typecheck passes

### US-004: Animated CVMIS Logo on Login Screen
**Description:** As a visitor, I want to see the CVMIS capsule logo animate on the login card — a polished reveal that replaces the generic Shield icon.

**Source file:** `cvmis-logo.svg` — contains three capsule `<g>` groups: `#capsule-rx` (teal, Rx/pharmacy), `#capsule-terminal` (amber, `>_` code), `#capsule-data` (green, bar chart/analytics).

**Animation reference:** `LogoReveal/frame 1-5.jpg` showing the reveal sequence.

**Animation sequence:**
1. **Frame 1-3 (Rise):** The green data capsule (`#capsule-data`) appears from nothing, rising upward into a fully visible upright/vertical position, centered. Scale from 0 → 1 and translateY from below. Duration: ~400-500ms.
2. **Frame 4-5 (Fan out):** All three capsules fan out from the center position. The green capsule rotates clockwise to its final tilted-right position. The teal Rx capsule appears and rotates to its tilted-left position. The amber terminal capsule appears in the center. Duration: ~400-500ms. The fan-out should feel organic — eased, not mechanical.
3. **Hold:** Logo rests in final fanned-out position (matching `frame 5.jpg` / the SVG's default layout).

**Acceptance Criteria:**
- [ ] `cvmis-logo.svg` is embedded as an inline React SVG component (not an `<img>` tag) so individual capsule groups can be animated
- [ ] Shield icon (`lucide-react` `Shield`) is removed from the login card branding section
- [ ] Logo container scales appropriately with the responsive card (US-001) — roughly 48-64px height depending on card size
- [ ] Animation plays once on login card entrance, after the card's initial fade-in
- [ ] Rise phase: green capsule scales/translates from hidden to upright center (~400-500ms, ease-out)
- [ ] Fan-out phase: three capsules rotate/translate to final positions (~400-500ms, ease-in-out)
- [ ] Total logo animation completes before typing animation begins (logo reveal → then typing starts)
- [ ] `prefers-reduced-motion`: logo appears instantly in final fanned-out position, no animation
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-005: CVMIS Logo on Dashboard TopBar
**Description:** As a visitor on the dashboard, I want to see the CVMIS logo in the top-left corner instead of the generic Home icon, reinforcing the brand.

**Acceptance Criteria:**
- [ ] The `Home` icon from `lucide-react` in `TopBar.tsx` is replaced with the CVMIS logo SVG
- [ ] Logo displays in its final fanned-out state (static, no animation on the dashboard)
- [ ] Logo is sized to fit the TopBar height (~20-24px height, maintaining aspect ratio)
- [ ] Logo colors match the SVG source: teal `#0b7979`, amber `#d97706`, green `#059669`
- [ ] The "Headhunt Medical Center" brand text beside the logo remains unchanged
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-006: Live Blurred Dashboard Background
**Description:** As a visitor, I want to see the GP dashboard blurred behind the login card, creating visual continuity and a satisfying reveal on login.

**Acceptance Criteria:**
- [ ] During the `login` phase, `DashboardLayout` renders underneath the login overlay (requires change to `App.tsx` phase rendering)
- [ ] Dashboard renders at scroll position 0 (top), showing the patient summary header area behind the blur
- [ ] Login overlay uses `backdrop-filter: blur(20px)` (or similar) over a semi-transparent background to blur the dashboard beneath
- [ ] Blur is constant from the moment the login screen appears (no ease-in)
- [ ] Dashboard content is non-interactive while login overlay is present (pointer-events: none or overlay captures all events)
- [ ] `prefers-reduced-motion`: blur still applies (static visual treatment), only animations are skipped
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-007: Connection Status Indicator Rework
**Description:** As a visitor, I want to clearly see the system's connection status change from red "awaiting" to green "connected" so I understand the login flow's progress.

**Acceptance Criteria:**
- [ ] Status indicator starts with RED LED (8-10px dot) + text "Awaiting secure connection..." in red
- [ ] The three dots in "Awaiting secure connection..." animate (sequential dot loading animation)
- [ ] 500ms after typing animation completes, LED transitions to GREEN + text changes to "Secure connection established, awaiting login" in green
- [ ] LED dot is larger than current (8-10px vs current 6px) with a subtle glow/shadow for visibility
- [ ] Text size increased from current 10px to 12px for readability
- [ ] Connection state change is tied to typing completion + 500ms delay (not an independent 2000ms timer)
- [ ] `prefers-reduced-motion`: state changes happen instantly, no dot animation
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-008: Login Button Activation and Pulse
**Description:** As a visitor, I want the login button to clearly signal when it becomes clickable through a visible pulse animation.

**Acceptance Criteria:**
- [ ] Login button remains disabled (opacity 0.6, no pointer cursor) while connection status is red
- [ ] Button becomes enabled only when LED turns green (i.e., after typing completes + 500ms)
- [ ] Once enabled, button begins a subtle pulse animation: scale 1.0 → 1.03 → 1.0, repeating every 3 seconds
- [ ] Pulse uses ease-in-out timing, smooth and premium-feeling
- [ ] Pulse stops on hover (hover state takes priority)
- [ ] Pulse stops immediately on click
- [ ] `prefers-reduced-motion`: no pulse animation, button just becomes enabled
- [ ] Button receives keyboard focus when it becomes enabled (existing behavior, preserve it)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-009: Login Dissolve Transition
**Description:** As a visitor, I want the login card and blurred overlay to dissolve away on login, revealing the dashboard underneath.

**Acceptance Criteria:**
- [ ] On login click: button shows pressed state → brief loading spinner (existing behavior)
- [ ] After loading spinner, the login card fades out (opacity 0, slight scale up)
- [ ] Simultaneously, the backdrop blur dissolves (blur value animates from 20px to 0, overlay opacity fades to 0)
- [ ] Dashboard beneath becomes interactive once overlay fully dissolves
- [ ] Total transition duration: ~600-800ms from click to fully revealed dashboard
- [ ] `prefers-reduced-motion`: instant transition, no animation
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

## Functional Requirements

- FR-1: Login card width uses `clamp()` for responsive scaling: minimum 320px, preferred ~28vw, maximum ~480px
- FR-2: All internal card elements (padding, fonts, inputs, icon, button) scale proportionally with card width
- FR-3: Login screen uses the same color tokens and font families as the dashboard
- FR-4: Title reads "CVMIS", subtitle reads "CV Management Information System"
- FR-5: `cvmis-logo.svg` is converted to an inline React SVG component with individually addressable capsule groups
- FR-6: Login screen logo animates: green capsule rises → three capsules fan out → hold in final position
- FR-7: Logo animation completes before the typing animation begins
- FR-8: Dashboard TopBar replaces the `Home` lucide icon with a static (final-state) CVMIS logo
- FR-9: `App.tsx` renders `DashboardLayout` during the `login` phase (behind the overlay), wrapped in its providers
- FR-10: Login overlay covers the full viewport with semi-transparent background + `backdrop-filter: blur()`
- FR-11: Connection status begins as red "Awaiting secure connection..." with animated dots
- FR-12: Connection transitions to green "Secure connection established, awaiting login" exactly 500ms after typing animation completes
- FR-13: Login button is disabled until green connection state is reached
- FR-14: Login button pulses (3% scale, 3-second interval) once enabled
- FR-15: Login transition dissolves both the card and the backdrop blur to reveal the live dashboard
- FR-16: All animations respect `prefers-reduced-motion`

## Non-Goals

- No changes to the boot sequence or ECG animation
- No changes to the "Secure clinical system login" footer text
- No password visibility toggle or form validation (this is a theatrical/demo login)
- No changes to the typing animation speeds (80ms/char username, 60ms/dot password)
- No changes to the dashboard layout itself
- No changes to the "Headhunt Medical Center" brand text in the TopBar

## Design Considerations

- **Reference images:** `current_login.jpg` (problem), `goal_login.jpg` (better proportions), `logged_in.jpg` (dashboard aesthetic to match)
- **Logo animation reference:** `LogoReveal/frame 1-5.jpg` showing the capsule reveal sequence
- **Card proportions:** The goal image (25% zoom) shows the card taking up roughly 25-30% of viewport width — use this as the scaling target
- **Blur intensity:** ~20px Gaussian blur; dashboard should be recognizably "there" but not distracting
- **Overlay color:** Semi-transparent version of the dashboard background — suggest `rgba(240, 245, 244, 0.7)` (pmr-bg with alpha) to match the warm sage feel
- **LED glow:** Subtle `box-shadow` in the LED color (red or green) to make the dot feel like an actual indicator light
- **Logo sizing:** On the login card, ~48-64px height. On the TopBar, ~20-24px height. Both maintain the SVG's natural aspect ratio

## Technical Considerations

- **SVG component:** The `cvmis-logo.svg` should be converted to a React component (e.g. `CvmisLogo.tsx`) that accepts props for size and animation state. The three `<g>` groups (`#capsule-rx`, `#capsule-terminal`, `#capsule-data`) need individual transform origins for rotation animation
- **Animation approach:** Framer Motion is already in the project — use it for the capsule animations (staggered variants). CSS transforms for rotation/translation of each capsule group. Transform origins should be set at the base/bottom of each capsule so they fan out like a hand of cards
- **App.tsx phase change:** Currently phases are mutually exclusive. For the blur effect, `DashboardLayout` must render during the `login` phase. This means wrapping it in `DetailPanelProvider` early and ensuring it doesn't trigger side effects that assume the user is "logged in"
- **Performance:** `backdrop-filter: blur()` can be expensive. The dashboard is static during login (no scroll, no interaction), so this should be manageable. Consider `will-change: backdrop-filter` on the overlay
- **Z-index:** Login overlay must sit above the dashboard. Current login uses `z-50` — this should work
- **CSS animation for pulse:** The button pulse can be a CSS `@keyframes` animation rather than framer-motion, since it's a simple repeating animation that should be lightweight
- **Shared logo component:** Both the login screen and TopBar use the same SVG component, just with different sizes and animation props (animated on login, static on dashboard)

## Success Metrics

- Login card appears proportionate on 1440p and 4K displays (no "lost in space" feeling)
- Visual style continuity: a visitor would identify the login and dashboard as the same product
- Logo animation feels polished and adds character to the login experience
- CVMIS branding is consistent between login screen and dashboard TopBar
- First-time visitors understand they need to click the login button without external instruction
- Transition from login to dashboard feels seamless and polished
