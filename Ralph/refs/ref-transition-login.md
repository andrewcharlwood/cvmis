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

## Phase 3: Login Sequence (1200ms)

A login panel materializes center-screen: a white card (320px wide, 12px border-radius, subtle shadow) on the dark blue-gray background. The card contains:

- A small NHS-blue shield icon or generic clinical system logo at the top
- **Username field**: Empty text input with label "Username". After 200ms, a cursor appears and types `A.CHARLWOOD` character by character (30ms per character, ~350ms total). The typing uses Geist Mono / monospace font.
- **Password field**: After a 150ms pause, dots fill the password field in rapid succession (8 dots, 20ms each, ~160ms total).
- **"Log In" button**: NHS blue (`#005EB8`), full width. After another 150ms pause, the button receives a subtle pressed state (darkens slightly, 100ms) as if clicked.

The login card holds for 200ms in its "submitted" state, then...

## Phase 4: Interface Materialization (500ms)

The login card scales up slightly (103%) and fades out (200ms). As it fades, the full PMR interface fades in behind it:

1. **Patient banner** slides down from the top edge (200ms, ease-out)
2. **Sidebar** slides in from the left edge (250ms, ease-out, starting 50ms after the banner)
3. **Main content area** (Summary view) fades in (300ms, starting 100ms after sidebar begins)
4. **Clinical alert banner** slides down from beneath the patient banner (250ms, spring easing, starting 200ms after main content appears)

## Phase 5: Final State

The full PMR interface is visible: patient banner at top, dark sidebar on left, Summary view in the main content area, and the clinical alert banner demanding attention. The user is now "logged in" to Andy's career record.

**Total transition duration:** ~2.7 seconds

## Why This Works

The login sequence is the most immersive transition of all designs. Every NHS worker, every pharmacist, every GP has typed their credentials into a clinical system at 8am on a Monday. This transition puts them right there. It's specific, it's authentic, and it immediately establishes the metaphor: you are opening a patient record. The "patient" happens to be a career.

## Login Animation Implementation Notes

- Component mounts with dark blue-gray background
- Login card fades in (Framer Motion, 200ms)
- Username typing: `setInterval` adds one character per 30ms to a state string
- Password dots: `setInterval` adds one dot per 20ms
- Button press: state change triggers visual pressed state, then 200ms delay
- `onComplete` callback fires, parent component swaps to PMRInterface
- Typing respects `prefers-reduced-motion` — with reduced motion, full username appears instantly and login completes in ~500ms total
- **Font: Geist Mono** for username/password fields (NOT Fira Code)

---

## Design Guidance (from /frontend-design)

> Pre-baked design direction. Do NOT invoke `/frontend-design` at runtime — this section contains the output.

### Aesthetic Direction: Institutional Utilitarian

This is not "exciting" design — it is the visual equivalent of fluorescent lights, laminate desks, and the smell of hand sanitiser at 07:58 on a Monday morning. The card must look like every single hospital login prompt a doctor has ever seen: clean white, unadorned, functional. No personality. The branding is the only concession to identity. The magic is not visual flair — it is the uncanny recognition of "oh, this is exactly what that looks like" combined with the satisfying typewriter rhythm of credentials appearing.

### Key Design Decisions

1. **Active field focus ring**: NHS-blue border (`1px solid #005EB8`) on the currently active field, inactive fields shift to `#FAFAFA` background. Mirrors real NHS login forms (Lorenzo, SystmOne, EMIS Web). Transition 150ms.
2. **Reduced shadow to spec**: Use exactly `0 1px 2px rgba(0,0,0,0.03)`. Card sits on dark background through border definition, not shadow depth — more faithful to real NHS software.
3. **Border**: Use `1px solid #E5E7EB` per design system (not `rgba(255,255,255,0.1)`).
4. **Timer cleanup**: Track every `setInterval` and `setTimeout` via refs, clear all on unmount.
5. **Consolidated active field state**: Single `activeField` state (`'username' | 'password' | null`) instead of separate booleans.
6. **Accessibility**: `role="status"` + `aria-label` on outer container. Cursor pipes `aria-hidden="true"`. Card entrance `scale: 0.98` (not 0).
7. **The Monday-morning feeling**: No gradients, no decorative elements, no loading spinners, no "Welcome back!" messaging. Just white rectangle on gray, shield icon, two fields, button. Typing speed deliberately mechanical.

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
const [activeField, setActiveField] = useState<'username' | 'password' | null>('username')
const [buttonPressed, setButtonPressed] = useState(false)
const [isExiting, setIsExiting] = useState(false)

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
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
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
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: '13px', fontWeight: 600,
    color: '#64748B', letterSpacing: '0.01em',
  }}>CareerRecord PMR</span>
  <span style={{
    fontFamily: "'Inter', system-ui, sans-serif",
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

Login button:
```tsx
<button style={{
  width: '100%',
  padding: '10px 16px',
  fontFamily: "'Inter', system-ui, sans-serif",
  fontSize: '14px', fontWeight: 600,
  color: '#FFFFFF',
  backgroundColor: buttonPressed ? '#004494' : '#005EB8',
  border: 'none',
  borderRadius: '4px',
}}>Log In</button>
```

Typing sequence (reduced motion branch):
```tsx
if (prefersReducedMotion) {
  setUsername(fullUsername)
  setPasswordDots(passwordLength)
  setActiveField(null)
  setTimeout(() => { setButtonPressed(true); setTimeout(triggerComplete, 100) }, 300)
  return
}
// Normal: username at 30ms/char, 150ms pause, password at 20ms/dot, 150ms pause, button press
```

Footer:
```tsx
<div style={{ marginTop: '22px', paddingTop: '18px', borderTop: '1px solid #E5E7EB' }}>
  <p style={{
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: '11px', color: '#94A3B8', textAlign: 'center',
  }}>Secure clinical system login</p>
</div>
```
