# Reference: ECG Transition + Login Sequence

> Extracted from goal.md — ECG Transition section. This covers the flatline exit from the ECG animation and the immersive login sequence that bridges into the PMR interface.

---

## Starting Point

"ANDREW CHARLWOOD" is on screen in neon green (`#00ff41`) on black. The heartbeat trace is complete. The name is fully formed and glowing.

## Phase 1: The Flatline (600ms)

The neon green name holds for a beat (300ms). Then the glow around the letters begins to fade. Simultaneously, from the right edge of the name, a flatline trace extends rightward — a perfectly horizontal green line drawn at the baseline, extending across the remaining viewport width over 300ms. The visual reads as a patient monitor flatline. This is deliberate: the "patient" (the animation phase) is ending. A new record is about to open.

The flatline has a subtle audio-visual implication without actual sound — the green line is steady and unbroken, the glow around the name letters reduces to zero. The entire canvas is now: a fading green name with a horizontal flatline extending to the right edge. All on black.

## Phase 2: Screen Clear (400ms)

The entire canvas fades to black over 200ms (the name and flatline dissolve into darkness). Then, from black, the background transitions to a dark blue-gray (`#1E293B`) over 200ms. This is the color of a clinical system login screen — the dark institutional background that every NHS worker recognizes from their Monday morning.

## Phase 3: Login Sequence (user-paced)

A login panel materializes center-screen: a white card (320px wide, 12px border-radius, refined shadow) on the dark blue-gray background. The card contains:

- A small NHS-blue shield icon or generic clinical system logo at the top
- **Username field**: Empty text input with label "Username". After 400ms, a cursor appears and types `A.CHARLWOOD` character by character at a natural reading pace (80ms per character, ~880ms total). The typing uses Geist Mono / monospace font.
- **Password field**: After a 300ms pause, dots fill the password field at a deliberate pace (8 dots, 60ms each, ~480ms total).
- **"Log In" button**: NHS blue (`#005EB8`), full width. After typing completes, the button becomes clearly available as a **user-interactive element**. The user clicks it to proceed. The button should have a visible hover state and feel like a natural call-to-action — this is the moment where the user "logs in" to the record.

**Important**: The login button is NOT auto-clicked. The user must click it. This creates a deliberate, satisfying interaction — the user is choosing to enter the record. On click, the button shows a brief pressed state (darkens slightly, 100ms), then...

## Phase 4: Interface Materialization (500ms)

The login card scales up slightly (103%) and fades out (200ms). As it fades, the full PMR interface fades in behind it:

1. **Patient banner** slides down from the top edge (200ms, ease-out)
2. **Sidebar** slides in from the left edge (250ms, ease-out, starting 50ms after the banner)
3. **Main content area** (Summary view) fades in (300ms, starting 100ms after sidebar begins)
4. **Clinical alert banner** slides down from beneath the patient banner (250ms, spring easing, starting 200ms after main content appears)

## Phase 5: Final State

The full PMR interface is visible: patient banner at top, dark sidebar on left, Summary view in the main content area, and the clinical alert banner demanding attention. The user is now "logged in" to Andy's career record.

**Total transition duration:** ~2s for typing to complete, then user-paced (waits for button click), then ~500ms for interface materialization.

## Why This Works

The login sequence is the most immersive transition. Every NHS worker, every pharmacist, every GP recognizes the shape of a clinical login screen. This transition evokes that recognition — but executed with premium refinement rather than institutional austerity. The natural typing pace lets the user absorb what's happening. And the interactive login button is the pivotal moment: the user *chooses* to enter the record. That moment of agency makes the experience feel personal, not passive.

## Login Animation Implementation Notes

- Component mounts with dark blue-gray background
- Login card fades in (Framer Motion, 200ms)
- Username typing: `setInterval` adds one character per 80ms to a state string (~880ms total)
- Password dots: `setInterval` adds one dot per 60ms (~480ms total)
- After typing completes: button becomes interactive (opacity goes to 1, cursor: pointer)
- **User clicks the "Log In" button** — this is NOT auto-triggered
- On click: button shows pressed state (100ms), then `onComplete` callback fires
- Typing respects `prefers-reduced-motion` — with reduced motion, full username and password appear instantly, button is immediately interactive
- **Font: Geist Mono** for username/password fields (NOT Fira Code)

---

## Design Guidance

### Aesthetic Direction: Clinical Luxury

The login card evokes the structure of a clinical system login — shield icon, two fields, a button — but executed with premium refinement. Clean white card with refined shadow, considered spacing, and the satisfying rhythm of credentials appearing at a natural pace. The recognition factor ("oh, this looks like a clinical login") is the creative hook; the premium finish is what makes it memorable.

### Key Design Decisions

1. **Active field focus ring**: NHS-blue border (`1px solid #005EB8`) on the currently active field, inactive fields shift to `#FAFAFA` background. Clinical login convention. Transition 150ms.
2. **Refined card shadow**: Multi-layered shadow `0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)` — the card should feel like it floats above the dark background. Combined with `1px solid #E5E7EB` border.
3. **Timer cleanup**: Track every `setInterval` and `setTimeout` via refs, clear all on unmount.
4. **Consolidated active field state**: Single `activeField` state (`'username' | 'password' | 'done' | null`) instead of separate booleans. `'done'` state indicates typing is complete and button is ready.
5. **Accessibility**: `role="status"` + `aria-label` on outer container. Cursor pipes `aria-hidden="true"`. Card entrance `scale: 0.98` (not 0).
6. **User-initiated login**: After typing completes, the "Log In" button is clearly interactive. Hover state (slight darken), cursor: pointer, and the button should feel like an invitation to click. This is the one moment of user agency in the boot sequence — make it satisfying.
7. **Natural typing pace**: 80ms/char for username, 60ms/dot for password. Deliberate and readable, not frantically fast.

### Implementation Pattern

```tsx
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

interface LoginScreenProps {
  onComplete: () => void
}

// Key state
const [username, setUsername] = useState('')
const [passwordDots, setPasswordDots] = useState(0)
const [showCursor, setShowCursor] = useState(true)
const [activeField, setActiveField] = useState<'username' | 'password' | 'done' | null>('username')
const [buttonPressed, setButtonPressed] = useState(false)
const [isExiting, setIsExiting] = useState(false)
const [typingComplete, setTypingComplete] = useState(false)

const fullUsername = 'A.CHARLWOOD'
const passwordLength = 8
```

Card structure:
```tsx
<motion.div
  className="bg-white"
  style={{
    width: '320px',
    padding: '32px',
    borderRadius: '12px',
    border: '1px solid #E5E7EB',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
  }}
  initial={{ opacity: 0, scale: 0.98 }}
  animate={isExiting ? { scale: 1.03, opacity: 0 } : { scale: 1, opacity: 1 }}
  transition={{ duration: 0.2, ease: 'easeOut' }}
>
```

Branding header:
```tsx
<div className="flex flex-col items-center" style={{ marginBottom: '28px' }}>
  <div style={{
    padding: '10px',
    borderRadius: '8px',
    backgroundColor: 'rgba(0, 94, 184, 0.07)',
    marginBottom: '10px',
  }}>
    <Shield size={26} style={{ color: '#005EB8' }} strokeWidth={2.5} />
  </div>
  <span style={{
    fontFamily: "'[UI font]', system-ui, sans-serif",
    fontSize: '13px', fontWeight: 600,
    color: '#64748B', letterSpacing: '0.01em',
  }}>CareerRecord PMR</span>
  <span style={{
    fontFamily: "'[UI font]', system-ui, sans-serif",
    fontSize: '11px', fontWeight: 400,
    color: '#94A3B8', marginTop: '2px',
  }}>Clinical Information System</span>
</div>
```

Input field pattern (username example):
```tsx
<div style={{
  width: '100%',
  padding: '9px 11px',
  fontFamily: "'Geist Mono', 'Fira Code', monospace",
  fontSize: '13px',
  backgroundColor: activeField === 'username' ? '#FFFFFF' : '#FAFAFA',
  border: activeField === 'username' ? '1px solid #005EB8' : '1px solid #E5E7EB',
  borderRadius: '4px',
  color: '#111827',
  minHeight: '38px',
  display: 'flex',
  alignItems: 'center',
}}>
  <span>{username}</span>
  {activeField === 'username' && (
    <span style={{ opacity: showCursor ? 1 : 0, color: '#005EB8' }} aria-hidden="true">|</span>
  )}
</div>
```

Login button (interactive — user clicks to proceed):
```tsx
<button
  onClick={typingComplete ? handleLogin : undefined}
  disabled={!typingComplete}
  style={{
    width: '100%',
    padding: '10px 16px',
    fontFamily: "'[UI font]', system-ui, sans-serif",
    fontSize: '14px', fontWeight: 600,
    color: '#FFFFFF',
    backgroundColor: buttonPressed ? '#004494' : '#005EB8',
    border: 'none',
    borderRadius: '4px',
    cursor: typingComplete ? 'pointer' : 'default',
    opacity: typingComplete ? 1 : 0.6,
    transition: 'background-color 150ms, opacity 300ms',
  }}
>Log In</button>
```

Typing sequence (reduced motion branch):
```tsx
if (prefersReducedMotion) {
  setUsername(fullUsername)
  setPasswordDots(passwordLength)
  setActiveField('done')
  setTypingComplete(true)
  // Button is immediately available for user to click
  return
}
// Normal: username at 80ms/char, 300ms pause, password at 60ms/dot
// After typing completes: setTypingComplete(true), button becomes interactive
// User clicks "Log In" to proceed — no auto-click
```

Footer:
```tsx
<div style={{ marginTop: '22px', paddingTop: '18px', borderTop: '1px solid #E5E7EB' }}>
  <p style={{
    fontFamily: "'[UI font]', system-ui, sans-serif",
    fontSize: '11px', color: '#94A3B8', textAlign: 'center',
  }}>Secure clinical system login</p>
</div>
```
