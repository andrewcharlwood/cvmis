# Reference: Tasks 16-18 — Interactions

## Task 16: Tile Expansion System

### Overview

Three tiles have expandable items: CareerActivity (roles), Projects, and CoreSkills. Clicking an item expands it in-place to reveal detail, like expanding a clinical record entry.

### Expansion Pattern (consistent across all tiles)

**Animation:**
- Framer Motion `AnimatePresence` + `motion.div`
- Height-only animation: 200ms, ease-out
- **No opacity fade on content** (guardrail)
- `overflow: hidden` on the animated container

```typescript
<AnimatePresence initial={false}>
  {isExpanded && (
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: 'auto' }}
      exit={{ height: 0 }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' }}
      style={{ overflow: 'hidden' }}
    >
      {/* expanded content */}
    </motion.div>
  )}
</AnimatePresence>
```

**Behavior:**
- Single-expand accordion: only one item expanded at a time within each tile
- Click expanded item again to collapse
- Click different item: collapses current, expands new
- State: `expandedItemId: string | null` in each tile component

**Keyboard:**
- Enter/Space: toggle expand/collapse
- Escape: collapse current item
- `aria-expanded` on each clickable item

**Visual:**
- Expanded content has slightly different background (`var(--bg)` or subtle border-left)
- Colored left border on expanded panel (accent color for roles, amber for projects, teal for skills)
- Content padding: 12-16px

### CareerActivity Expansion (roles)

When a role-type activity item is expanded:
- Show full role details from corresponding consultation entry
- Structure: role title, organization, date range
- Achievement bullets (examination array from consultation)
- Coded entries if available
- Match expanded content to `consultations` data by mapping activity item to consultation

### Projects Expansion

When a project item is expanded:
- Show from investigation data:
  - Methodology
  - Tech stack (as tags or inline list)
  - Results (bulleted)
  - External URL link if available ("View Results" button)

### CoreSkills Expansion

When a skill item is expanded:
- Show "prescribing history" — a timeline of skill development
- Source: Can use the existing `medications` data which has `prescribingHistory` entries
- Format: vertical timeline with year markers and descriptions
  - Timeline dots: accent color, 6px, with connecting line
  - Year: mono font, 12px, semibold
  - Description: 12px, regular

---

## Task 17: KPI Flip Cards

### Overview

In the LatestResults tile, each metric card can be clicked to "flip" and reveal an explanation of that KPI.

### Flip Animation

**CSS Perspective approach:**
```css
.metric-card {
  perspective: 1000px;
  cursor: pointer;
}

.metric-card-inner {
  transition: transform 0.4s ease-in-out;
  transform-style: preserve-3d;
  position: relative;
}

.metric-card-inner.flipped {
  transform: rotateY(180deg);
}

.metric-card-front,
.metric-card-back {
  backface-visibility: hidden;
  position: absolute;
  inset: 0;
}

.metric-card-back {
  transform: rotateY(180deg);
}
```

Or use Framer Motion `animate={{ rotateY: isFlipped ? 180 : 0 }}` with `perspective` on parent.

**Behavior:**
- Click to flip front → back
- Click again to flip back → front
- Only one card flipped at a time (clicking another card flips the current one back)
- State: `flippedCardId: string | null` in LatestResultsTile

**Front face:** Current metric display (value + label + sub) — same as Task 10.

**Back face:**
- `background: var(--accent-light)` (subtle teal tint)
- `padding: 14px`
- Text: 12px, text-secondary, `line-height: 1.5`
- The explanation text from KPI data's `explanation` field

**Reduced motion:**
- No 3D flip animation
- Instant content swap (front → back)
- Could use a simple crossfade or just replace content immediately

**Keyboard:**
- Enter/Space to flip
- Each metric card should be `tabIndex={0}` with appropriate `aria-label`

**KPI Explanations** (from `src/data/kpis.ts`):
- £220M: Budget management with forecasting models
- £14.6M: Efficiency programme through data analysis
- 9+ Years: NHS service progression since 2016
- 12: Cross-functional team leadership

---

## Task 18: Command Palette

### File: `src/components/CommandPalette.tsx`

### Trigger
- **Ctrl+K** (global `keydown` listener on `document`)
- **Click** on TopBar search bar (or focus on search input)
- The TopBar search input does NOT do inline search — it opens the palette

### Overlay
- `position: fixed`, `inset: 0`
- `background: rgba(26,43,42,0.45)`
- `backdrop-filter: blur(4px)`
- `z-index: 1000`
- Fade in: `opacity: 0 → 1`, `visibility: hidden → visible`, 200ms transition
- Click overlay (outside modal) to close

### Palette Modal
- `width: 580px`, `max-height: 520px`
- `background: var(--surface)` (#FFFFFF)
- `border-radius: 12px`
- `box-shadow: 0 20px 60px rgba(26,43,42,0.2), 0 0 0 1px rgba(26,43,42,0.08)`
- `overflow: hidden`
- Entrance: `transform: scale(0.97) translateY(-8px)` → `scale(1) translateY(0)`, 200ms cubic-bezier

### Search Input
- Flex row: search icon (18px, accent) + input + "ESC" hint badge
- `padding: 14px 18px`, `border-bottom: 1px solid var(--border-light)`
- Input: 15px, font-body, placeholder "Search records, experience, skills..."
- ESC badge: mono 10px, tertiary, bg var(--bg), border, padding 2px 7px, radius 4px

### Results Area
- `overflow-y: auto`, `padding: 8px`, `flex: 1`
- Custom scrollbar (4px)

### Result Sections
Section label: 10px, 600 weight, uppercase, `letter-spacing: 0.08em`, text-tertiary, `padding: 8px 10px 5px`

### Result Items
- `display: flex`, `align-items: center`, `gap: 10px`
- `padding: 9px 10px`, `border-radius: var(--radius-sm)` (6px)
- `cursor: pointer`, `transition: background 0.1s`
- 13px, text-primary
- Hover/selected: `background: var(--accent-light)`
- Selected also gets: `outline: 1.5px solid var(--accent-border)`

**Item structure:**
- Icon container: 28px square, 6px radius, colored bg per section
  - Experience: teal
  - Core Skills: green
  - Active Projects: amber
  - Achievements: amber
  - Education: purple
  - Quick Actions: teal
- Text: title (500 weight) + subtitle (11px, tertiary, truncated)
- Optional badge: 10px, mono, tertiary

### Fuzzy Search

Adapt existing `src/lib/search.ts` (fuse.js integration):
- Rebuild search index to include new data (skills from skills.ts, KPIs, etc.)
- `threshold: 0.3`, weighted keys (title: 2, content: 1)
- `minMatchCharLength: 2`
- Group results by section
- Highlight matching text in titles using `<mark>` with accent-light background

### Keyboard Navigation
- **Arrow Down/Up**: move selection through results
- **Enter**: select highlighted result (navigate to section or trigger action)
- **Escape**: close palette
- `selectedIndex` state tracks which result is highlighted
- Auto-scroll highlighted result into view

### Quick Actions Section
| Title | Subtitle | Action |
|-------|----------|--------|
| Download CV | Export as PDF | Trigger download |
| Send Email | andy@charlwood.xyz | `mailto:` link |
| View LinkedIn | Professional profile | External link |
| View Projects | GitHub & portfolio | External link |

### Footer
- `display: flex`, `gap: 12px`
- `padding: 10px 18px`, `border-top: 1px solid var(--border-light)`
- 11px, text-tertiary
- Keyboard hints: `↑ ↓ Navigate`, `Enter Select`, `Esc Close`
- Each key in `<kbd>` styled element

### Reduced Motion
- No scale/translate entrance animation
- Instant show/hide (opacity only, or immediate)

### State Management
```typescript
const [isOpen, setIsOpen] = useState(false)
const [query, setQuery] = useState('')
const [selectedIndex, setSelectedIndex] = useState(-1)
```

Render the palette at the DashboardLayout level so it overlays everything.
