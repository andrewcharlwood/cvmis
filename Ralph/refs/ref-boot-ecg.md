# Reference: Boot Sequence + ECG Animation

> Covers the full pre-login flow: terminal boot → cursor transition → ECG heartbeat → name reveal → flatline. The flatline→login transition is covered in `ref-transition-login.md`.

---

## Current Architecture

Two components manage the pre-login flow:
- `src/components/BootSequence.tsx` → terminal text animation, ends with blinking cursor
- `src/components/ECGAnimation.tsx` → canvas-based heartbeat + name tracing + flatline + bg transition
- `App.tsx` phases: `boot → ecg → login → pmr`

## What Needs to Change

### 1. Boot Sequence — Clean Up for Easy Config

**Problem:** Boot text lines are hardcoded as HTML strings with inline Tailwind classes. Adding/removing/reordering lines requires editing raw HTML. The `dangerouslySetInnerHTML` approach is fragile.

**Fix:** Refactor to a clean config-driven structure:
```typescript
// Example config structure — easy to customize
const BOOT_CONFIG = {
  header: { text: 'CLINICAL TERMINAL v3.2.1', style: 'bright' },
  lines: [
    { type: 'status', text: 'Initialising pharmacist profile...' },
    { type: 'separator' },
    { type: 'field', label: 'SYSTEM', value: 'NHS Norfolk & Waveney ICB' },
    { type: 'field', label: 'USER', value: 'Andy Charlwood' },
    { type: 'field', label: 'ROLE', value: 'Deputy Head of Population Health & Data Analysis' },
    { type: 'field', label: 'LOCATION', value: 'Norwich, UK' },
    { type: 'separator' },
    { type: 'status', text: 'Loading modules...' },
    { type: 'module', name: 'pharmacist_core.sys' },
    { type: 'module', name: 'population_health.mod' },
    { type: 'module', name: 'data_analytics.eng' },
    { type: 'separator' },
    { type: 'ready', text: 'READY — Rendering CV..' },
  ],
  timing: { lineDelay: 220, holdAfterComplete: 400, fadeOutDuration: 800 },
}
```
- Each line type maps to a React component (not raw HTML)
- Colors remain: bright green `#00ff41`, dim green `#3a6b45`, cyan labels `#00e5ff`
- Staggered reveal timing stays the same (220ms per line)
- Font: Fira Code (this is the terminal phase, NOT the PMR — Fira Code is correct here)

### 2. Cursor → Dot Transition

**Problem:** The boot sequence ends with a blinking green block cursor (`.animate-blink`). The ECG animation starts with a glowing dot that appears at the far left of the screen. There's a visual disconnect — the cursor and dot don't connect.

**Fix:** The blinking cursor at the end of boot should smoothly transition INTO the ECG's glowing trace dot:
- At end of boot, capture the cursor's screen position (x, y)
- Pass this position to ECGAnimation via props
- ECGAnimation starts with its glowing dot AT the cursor position
- The cursor stops blinking and morphs: block cursor → circular glow (scale down width, increase glow, ~300ms)
- The dot then begins moving rightward, drawing the flatline/heartbeat trace behind it
- This means the ECG trace starts at the cursor position, NOT the far left edge

### 3. ECG Start Position

**Problem:** Currently the ECG trace starts at x=0 (far left of viewport). The cursor ends somewhere in the middle-left of the screen. This means the dot "teleports" from cursor position to the left edge.

**Fix:** The ECG animation should:
- Accept a `startPosition: { x: number, y: number }` prop from the boot sequence
- Begin the trace from that position
- The first section of trace is a flat line from the cursor position rightward
- Heartbeats begin after the first flat gap (same timing as now, just offset)
- The viewport scroll logic already handles the "head" position — just shift the world-space origin

### 4. Text Reveal — Mask Technique

**Problem:** The current ECGAnimation.tsx reveals letters by stroking them with progressive alpha (`letterProgress > 0.3` → fade in). This looks like letters fading in, not like the ECG line IS the letter shape.

**Reference:** `ECGCombined.tsx` (Remotion version at project root) uses a superior technique:
- The actual text characters are pre-rendered on the canvas (stroke-only, no fill)
- A wipe mask follows the ECG trace head, revealing the text underneath
- The ECG trace line IS the path that forms each letter shape (via the `getYAtX` function which returns letter Y values when in text region)
- Connector lines between letters sit at the baseline
- The neon glow filter applies to both the trace and revealed text

**What to adopt from ECGCombined.tsx:**
- The mask-based text reveal approach (the trace unveils pre-rendered text)
- The connector lines between letters at baseline
- The neon glow SVG filters (or canvas equivalents)
- The text mask brush that follows the trace head

**What to KEEP from current ECGAnimation.tsx:**
- The character spacing (current `LETTER_W`, `LETTER_G`, `SPACE_W` values — preferred over ECGCombined.tsx spacing)
- The heartbeat waveform shape (`generateHeartbeatPoints`)
- The beat timing and amplitude escalation (0.3 → 0.55 → 0.85 → 1.0)
- The canvas rendering approach (not SVG — canvas is correct for this performance-sensitive animation)
- The viewport scrolling/camera logic
- The flatline draw phase
- The scanline and vignette effects
- The background color transition to `#1E293B`

### 5. Text Rendering

- The name is still "ANDREW CHARLWOOD"
- Letters are stroke-only (no fill) in neon green `#00ff41`
- Each letter shape is defined by the `ECG_LETTERS` point arrays (keep these)
- The trace line passes through each letter's shape points, making the ECG waveform form recognizable letter shapes
- Between letters, the trace returns to baseline with short connector segments
- Neon glow effect on both trace and revealed text

## Transition to Login

After the text is fully revealed and the flatline extends to the right edge, the flow continues as described in `ref-transition-login.md`:
1. Name holds with glow (300ms)
2. Glow fades, flatline extends right
3. Canvas fades to black (200ms)
4. Background transitions to dark blue-gray `#1E293B` (200ms)
5. Login card materializes

## prefers-reduced-motion

With reduced motion enabled:
- Boot text appears instantly (no stagger)
- Cursor appears immediately
- ECG animation is skipped entirely — transition straight from boot to login
- Or: show the final frame (name fully revealed, flatline) as a static image for 1 second, then proceed to login

## Testing Checklist

- [ ] Boot text renders correctly with all lines
- [ ] Blinking cursor visible at end of boot
- [ ] Cursor smoothly transitions to ECG dot (no teleport)
- [ ] ECG trace starts from cursor position
- [ ] Heartbeats render with increasing amplitude
- [ ] Name letters revealed via mask technique (not alpha fade)
- [ ] Connector lines between letters
- [ ] Neon glow on trace and text
- [ ] Flatline extends to right edge after name
- [ ] Background transitions to `#1E293B`
- [ ] Scanlines and vignette present
- [ ] Reduced motion: instant/static
- [ ] Mobile: scales correctly

---

## Design Guidance (from /frontend-design)

> Pre-baked design direction. Do NOT invoke `/frontend-design` at runtime — this section contains the output.

### Aesthetic Direction: Authentic Clinical Terminal → Medical Monitor Realism

This isn't "medical-themed" design — this IS medical equipment interfaces. Two distinct phases:
1. **Boot Terminal**: Authentic 1990s clinical system boot sequence (think legacy pharmacy dispensing systems, hospital terminal logins). CRT monitor aesthetic with phosphor green, scanlines, slight text glow.
2. **ECG Monitor**: Hospital bedside cardiac monitor realism. The heartbeat isn't decorative — it's a functioning waveform that becomes letterforms through technical precision.

**Visual Signature**: The cursor-to-dot morphing transition. Most animations have discrete phases; this creates continuous material transformation — the blinking terminal cursor literally becomes the ECG trace point. It's the moment where "loading system" becomes "reading vital signs."

### Boot Sequence — Type-Safe Config

```typescript
type BootLineType = 'header' | 'status' | 'separator' | 'field' | 'module' | 'ready'

interface BootLine {
  type: BootLineType
  text: string
  label?: string
  value?: string
  style?: 'bright' | 'dim' | 'cyan'
}

interface BootConfig {
  header: string
  lines: BootLine[]
  timing: {
    lineDelay: number
    cursorBlinkInterval: number
    holdAfterComplete: number
    fadeOutDuration: number
  }
  colors: {
    bright: string
    dim: string
    cyan: string
  }
}
```

Component architecture:
- `<BootLine>` — renders individual line types with appropriate styling
- `<BootCursor>` — separate component for cursor with ref exposure for position capture
- Config-driven rendering replaces hardcoded HTML

Example config:
```typescript
const BOOT_CONFIG: BootConfig = {
  header: 'CLINICAL TERMINAL v3.2.1',
  lines: [
    { type: 'status', text: 'Initialising pharmacist profile...', style: 'dim' },
    { type: 'separator', text: '---', style: 'dim' },
    { type: 'field', label: 'SYSTEM', value: 'NHS Norfolk & Waveney ICB', style: 'cyan' },
    { type: 'field', label: 'USER', value: 'Andy Charlwood', style: 'bright' },
    // ... etc
  ],
  timing: { lineDelay: 220, cursorBlinkInterval: 530, holdAfterComplete: 400, fadeOutDuration: 800 },
  colors: { bright: '#00ff41', dim: '#3a6b45', cyan: '#00e5ff' }
}
```

Example BootLine component:
```typescript
function BootLine({ line }: { line: BootLine }) {
  const colors = BOOT_CONFIG.colors
  const color = line.style ? colors[line.style] : colors.dim

  if (line.type === 'field') {
    return (
      <div className="font-mono text-sm leading-relaxed">
        <span style={{ color: colors.cyan }}>{line.label?.padEnd(9)}</span>
        <span style={{ color }}>{line.value}</span>
      </div>
    )
  }

  if (line.type === 'module') {
    return (
      <div className="font-mono text-sm leading-relaxed">
        <span className="font-bold" style={{ color: colors.bright }}>[OK]</span>
        {' '}
        <span style={{ color: colors.dim }}>{line.text}</span>
      </div>
    )
  }

  // ... other types
}
```

### Cursor → Dot Transition — Implementation

```typescript
const [cursorPosition, setCursorPosition] = useState<{x: number, y: number} | null>(null)
const cursorRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  if (cursorRef.current) {
    const rect = cursorRef.current.getBoundingClientRect()
    setCursorPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    })
  }
}, [/* trigger when boot completes */])

// Pass to ECG:
<ECGAnimation startPosition={cursorPosition} onComplete={...} />
```

Morph animation: width 8px→0px, height 16px→6px, border-radius 0→50% (300ms ease-out). Simultaneously fade in ECG dot at same position. After morph complete, begin trace movement.

### Canvas Mask Reveal — Implementation

```javascript
// Pre-render text to offscreen canvas
const textCanvas = document.createElement('canvas')
const textCtx = textCanvas.getContext('2d')
textCtx.strokeStyle = lineColor
textCtx.lineWidth = 1.5
textCtx.font = `bold ${fontSize}px Arial`
textLayout.forEach(item => {
  textCtx.strokeText(item.char, item.centerX, baselineY)
})

// During animation loop:
ctx.save()

// Create clipping path following trace head
ctx.beginPath()
ctx.rect(0, 0, headSX + 20, vh) // reveal up to head position + lead
ctx.clip()

// Draw pre-rendered text through clip
ctx.drawImage(textCanvas, -viewOff, 0)

ctx.restore()

// Feathered leading edge:
const gradient = ctx.createLinearGradient(headSX - 30, 0, headSX, 0)
gradient.addColorStop(0, 'rgba(0,255,65,0)')
gradient.addColorStop(1, 'rgba(0,255,65,1)')
```

### Connector Lines Between Letters

```javascript
const connectors: {startX: number, endX: number}[] = []
for (let i = 0; i < textLayout.length - 1; i++) {
  const curr = textLayout[i]
  const next = textLayout[i + 1]
  const endInset = CONNECTOR_INSETS[curr.char] || 0
  const startInset = CONNECTOR_INSETS[next.char] || 0
  connectors.push({
    startX: curr.endX - endInset,
    endX: next.startX + startInset
  })
}

// During draw:
connectors.forEach(conn => {
  if (headWX > conn.startX) {
    const connectorEndX = Math.min(conn.endX, headWX)
    ctx.beginPath()
    ctx.moveTo(conn.startX - viewOff, baselineY)
    ctx.lineTo(connectorEndX - viewOff, baselineY)
    ctx.stroke()
  }
})
```

### Visual Enhancement Details

**CRT Scanlines** (boot phase):
```css
.boot-scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15) 0px,
    transparent 1px,
    transparent 2px,
    rgba(0, 0, 0, 0.15) 3px
  );
  pointer-events: none;
  animation: scanline-drift 8s linear infinite;
}
```

**Phosphor Glow** (terminal text):
```css
.terminal-text {
  text-shadow:
    0 0 4px currentColor,
    0 0 8px currentColor,
    0 0 12px rgba(0, 255, 65, 0.3);
}
```

**ECG Neon Glow** (canvas — multi-layer):
- Primary trace: 2px solid line
- Glow layer 1: 6px @ 25% opacity + shadowBlur 14px
- Glow layer 2: Inner 3px core for sharpness
- Text: Same multi-layer glow approach

**Background Transition** (smooth RGB interpolation):
```javascript
const bgProgress = (elapsed - flatlineStartTime) / BG_TRANSITION
ctx.fillStyle = `rgb(
  ${Math.round(0 + (30 * bgProgress))},
  ${Math.round(0 + (41 * bgProgress))},
  ${Math.round(0 + (59 * bgProgress))}
)` // black → #1E293B
ctx.fillRect(0, 0, vw, vh)
```
