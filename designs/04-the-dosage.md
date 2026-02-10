# Design 4: The Dosage

## Overview

The user controls how much information they see. A pharmaceutical dosage metaphor -- self-titrate your information intake. Combined with a Cmd+K command palette for power users. The most accessible, recruiter-friendly, and fastest-to-relevant-content of all 6 designs.

The core insight: most CVs and portfolios assume the visitor wants to see everything, in the order the author chose. This assumption wastes time. A hiring manager scanning 30 CVs wants key numbers in 5 seconds. A thorough reviewer wants the full picture. A curious peer wants to deep-dive into specific projects. These are three different users with three different "doses" of information needed.

The Dosage design lets each visitor self-prescribe. Every piece of content exists at three depth levels (headline, summary, detail), and the visitor controls which level they see. The pharmaceutical metaphor is not cosmetic -- it reflects Andy's background as a pharmacist and his professional understanding that the right amount of the right information at the right time is what matters.

Layered on top is a command palette (Cmd+K) borrowed from developer tools and productivity apps (Linear, Raycast, VS Code). This signals technical sophistication while providing a power-user shortcut to any piece of content.

---

## ECG Transition

**Starting point:** "ANDREW CHARLWOOD" is on screen in neon green (#00ff41) strokes on a black (#000) background. The ECG trace that drew it is still visible. The drawing head has stopped.

**Then:**

The neon green name begins a smooth **color shift**: green (#00ff41) transitions to teal (#0D7377) over 600ms. Simultaneously, the rough ECG-traced letterforms **morph** into clean Plus Jakarta Sans (later replaced by DM Sans in the final render) typography. The imprecise, hand-drawn quality of the ECG strokes straightens and refines -- serifs sharpen, curves smooth, letter spacing normalizes. This morphing happens over 1 second, overlapping with the color shift.

As the name refines, it **rises** from center-screen toward upper-third position (approximately 28vh from top). The movement follows `cubic-bezier(0.22, 0.68, 0, 1.00)` -- fast departure, gentle settle. Duration: 800ms.

Below where the name was positioned, a single horizontal line appears. This is the midline of the ECG trace -- the flatline that connected the letter strokes -- left behind as the name lifted away. The line transitions from neon green to teal (#0D7377) and **extends** smoothly to span the full viewport width. Duration: 600ms, starting 200ms after the name begins rising.

The black background brightens to warm white (#F8F6F3) during the name rise. The transition uses `ease-out` timing over 1 second.

Below the teal line, the subtitle "Deputy Head of Population Health & Data Analysis" fades in (300ms, 400ms delay after line extends). Then the prompt "What would you like to know?" fades in (300ms, 200ms delay after subtitle). Then the five choice buttons stagger in from below, 60ms apart, each with a subtle `translateY(12px)` to `translateY(0)` entrance.

The teal line persists as a permanent UI element throughout the entire experience -- a visual heartbeat-monitor flatline that doubles as a pharmaceutical Rx signature line. When the visitor clicks any choice button, this line **pulses once**: a brief flash of neon green (#00ff41) glow that travels along the line's length left-to-right in 300ms, then fades. This callback to the ECG origin happens on every major interaction, creating continuity.

**Duration:** ~1.5 seconds total. Deliberately calm.

**Color journey:** Black (#000) --> Warm White (#F8F6F3). ECG green (#00ff41) --> Teal (#0D7377). The warm white has a faint warm undertone (not clinical pure white) that creates an approachable, paper-like feel.

**The message:** "The dramatic part is over. Now it is about you."

---

## Visual System

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `--bg-warm` | `#F8F6F3` | Primary background -- warm off-white |
| `--bg-cream` | `#F0EDE8` | Card surfaces, elevated elements |
| `--teal` | `#0D7377` | Primary accent -- links, interactive elements, Rx line |
| `--teal-light` | `rgba(13, 115, 119, 0.08)` | Hover backgrounds, subtle tints |
| `--teal-medium` | `rgba(13, 115, 119, 0.15)` | Active states, progress fills |
| `--amber` | `#D4874D` | Secondary accent -- highlights, warmth |
| `--amber-light` | `rgba(212, 135, 77, 0.1)` | Amber tinted backgrounds |
| `--coral` | `#E8735A` | CTA buttons, urgent emphasis |
| `--text-heading` | `#1A1A2E` | Dark headings |
| `--text-body` | `#3D3D56` | Body text |
| `--text-muted` | `#8B8B9E` | Labels, metadata, tertiary text |
| `--border` | `#E2DED8` | Warm gray borders, dividers |
| `--ecg-green` | `#00ff41` | ECG callback pulses only |

### Background Treatment

The primary background is warm off-white (#F8F6F3) -- deliberately NOT pure white. A faint **paper grain texture** at 2% opacity overlays the background, created via a subtle CSS noise pattern. This creates a tactile, printed-document quality without being heavy-handed.

```css
background-image: url("data:image/svg+xml,..."); /* tiny repeating noise SVG */
background-size: 200px 200px;
opacity: 0.02;
```

The grain is purely cosmetic and does not affect readability.

### Typography

| Role | Font | Weight | Size | Notes |
|---|---|---|---|---|
| Display (name) | DM Sans | 700 | `clamp(2.5rem, 5vw, 4rem)` | Geometric, slightly rounded, approachable |
| Section headings | DM Sans | 700 | `clamp(1.5rem, 3vw, 2rem)` | |
| Subheadings | DM Sans | 500 | 1.125rem (18px) | |
| Body text | Inter | 400-450 | 15px / 1.7 line-height | `font-feature-settings: 'cv01', 'cv02', 'ss03'` for refined character shapes |
| Labels / metadata | Inter | 500 | 13px, uppercase, 0.05em tracking | |
| Data / statistics | JetBrains Mono | 400 | 14px | Used for numbers, percentages, code-like content |
| Large statistics | JetBrains Mono | 700 | `clamp(2rem, 4vw, 3.5rem)` | The "big numbers" in The Numbers view |

**Type scale:** Modular ratio 1.25 (Major Third). Steps: 0.875rem, 1rem, 1.25rem, 1.5625rem, 1.953rem, 2.441rem, 3.052rem.

**Font loading:** DM Sans and Inter from Google Fonts with `display=swap`. JetBrains Mono with `display=optional` (acceptable fallback to system mono for data labels).

### Spacing System

- **Base unit:** 4px
- **Scale:** 4, 8, 12, 16, 24, 32, 48, 64, 80, 120px
- **Section spacing:** 120px between major sections
- **Card padding:** 24px (mobile: 16px)
- **Grid:** 12-column grid, content centered in 8 columns (max-width: 720px for text content, 960px for card grids)
- **Viewport padding:** 32px sides (tablet: 24px, mobile: 16px)

### Motion

| Property | Value | Usage |
|---|---|---|
| Primary easing | `cubic-bezier(0.22, 0.68, 0, 1.00)` | Fast start, gentle settle. All entrance animations. |
| Exit easing | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard Material-style exit. |
| Micro-interaction duration | 150-200ms | Hover effects, button presses, color transitions |
| Content transition duration | 300-500ms max | View switches, panel openings |
| Hard limit | 500ms | No animation exceeds this. Respect the visitor's time. |
| Stagger delay | 60ms | Between siblings in a list (buttons, cards, stat items) |
| Rx line pulse | 300ms | Left-to-right green flash on major interactions |

### Material & Depth

Flat design with subtle depth. No heavy drop shadows.

- **Cards:** 1px solid `--border` (#E2DED8). Background `--bg-cream` (#F0EDE8). No border-radius greater than 12px.
- **Hover state:** Background lightens to white (#FFFFFF). Border transitions to `--teal-light`. Subtle `box-shadow: 0 2px 8px rgba(0,0,0,0.04)`.
- **Active/pressed:** Background shifts to `--teal-light`. Scale 0.98 (20ms spring).
- **Elevated elements** (command palette, tooltips): `box-shadow: 0 8px 30px rgba(0,0,0,0.08)`. Background white with 1px `--border`.

### Signature Visual: The Measure Bar

Every major statistic has a thin horizontal progress bar beneath it. This is the design's recurring visual motif.

- Height: 3px
- Background track: `--border` (#E2DED8)
- Fill: `--teal` (#0D7377)
- Fill width: proportional to the stat's magnitude relative to a contextual maximum
- Animation: fills from 0% to target width on IntersectionObserver trigger, using `cubic-bezier(0.22, 0.68, 0, 1.00)`, 800ms duration
- Stagger: 100ms between adjacent Measure Bars

Examples:
- "14.6M" efficiency programme: Measure Bar fills to 100% (it IS the maximum in context)
- "2.6M" savings: Measure Bar fills to ~18% (relative to 14.6M)
- "14,000" patients: full width in its own context group
- "200 hours" saved: Measure Bar fills to contextual proportion

The Measure Bar is a quiet, persistent design element that gives every number a physical weight. Numbers alone are abstract; a bar makes them visceral.

---

## Section-by-Section Design

### Hero / Landing Page

After the ECG transition completes, the visitor sees:

**Top section (above the Rx line):**
- Andy's name in DM Sans 700, `--text-heading` color, centered
- Role title: "Deputy Head of Population Health & Data Analysis" in Inter 400, `--text-muted`, centered, below name

**The Rx line:** Full-width horizontal line, 2px, `--teal`. Persistent throughout the experience.

**Below the Rx line:**
- Prompt: "What would you like to know?" in DM Sans 500, `--text-heading`, centered
- 5 choice buttons in a horizontal row (wrapping to 2 rows on mobile):

| Button | Label | Icon (Lucide) |
|---|---|---|
| 1 | The Numbers | Hash |
| 2 | The Journey | Clock |
| 3 | The Skills | Layers |
| 4 | The Impact | Zap |
| 5 | Everything | List |

**Button styling:**
- Pill-shaped: `border-radius: 999px`
- Border: 1px solid `--border`
- Background: `--bg-cream`
- Text: DM Sans 500, 14px, `--text-body`
- Icon: 16px, `--teal`, left of label
- Hover: background white, border `--teal-light`, icon `--amber`
- Active: background `--teal-light`, text `--teal`

The buttons stagger in from below (60ms apart) during the ECG transition.

### The Numbers View

Triggered by clicking "The Numbers" button. The button gains an active state (teal background, white text). The Rx line pulses green. Below the prompt area, content fades in:

**Layout:** A centered column of large statistics, each one a self-contained card.

Each stat card contains:
1. **The number:** JetBrains Mono 700, `clamp(2rem, 4vw, 3.5rem)`, `--text-heading`
2. **The context:** One line of Inter 400, 15px, `--text-body`
3. **The Measure Bar:** 3px tall, `--teal` fill, animated
4. **"Tell me more" link:** Inter 500, 13px, `--teal`, with ChevronRight icon. Clicking expands to the Summary depth.

**Statistics displayed:**

| Number | Context | Source |
|---|---|---|
| 14.6M | Efficiency programme identified through data analysis | Interim Head role |
| 14,000 | Patients identified by Python switching algorithm | Interim Head role |
| 220M | Prescribing budget managed with forecasting models | Deputy Head role |
| 2.6M | Annual savings from automated switching analysis | Interim Head role |
| 200+ hrs | Saved annually by Blueteq automation system | High-Cost Drugs role |
| ~1M | Revenue enabled by asthma screening process adopted nationally | Tesco role |

**Depth levels for each stat:**
- **Headline** (default): The number + one-line context + Measure Bar
- **Summary** (first "tell me more" click): 2-3 sentence expansion explaining methodology and impact. "Tell me more" changes to "Full detail."
- **Detail** (second click): Full bullet points from the relevant role, tools used, timeline. A "Collapse" link returns to Headline level.

### The Journey View

Triggered by clicking "The Journey" button. Content below the prompt:

**Layout:** A horizontal timeline running left-to-right across the full content width.

**Timeline structure:**
- Horizontal line: 2px, `--border`, full width
- Timeline dots: 12px circles at each role position
- Current role dot: filled `--teal`
- Past role dots: filled `--bg-cream` with 2px `--teal` border

**Role positions (left to right, spaced proportionally by date):**
1. Duty Pharmacy Manager (Aug 2016 - Nov 2017)
2. Pharmacy Manager (Nov 2017 - May 2022)
3. High-Cost Drugs & Interface Pharmacist (May 2022 - Jul 2024)
4. Deputy Head, Population Health & Data Analysis (Jul 2024 - Present)
5. Interim Head, Population Health & Data Analysis (May 2025 - Nov 2025)

Each dot has a label below: role title (DM Sans 500, 13px, `--text-body`). Organisation name appears on hover in `--text-muted`.

**Depth levels:**
- **Headline** (default): Timeline with role titles only. Compact. Scannable in 3 seconds.
- **Summary** (click a dot): A card expands below the timeline showing the role title, organisation, date range, and first 2 bullet points. Only one card open at a time (accordion).
- **Detail** (click "Full detail" in expanded card): All bullet points for that role appear. Tools/technologies mentioned are highlighted as inline teal badges.

**Employer era color-coding:**
- NHS ICB roles: timeline dots and cards have a teal left border
- Tesco roles: timeline dots and cards have an amber left border

### The Skills View

Triggered by clicking "The Skills" button.

**Layout:** Three category cards stacked vertically.

**Categories:**
1. **Technical** -- Python, SQL, Power BI, JS/TS, Data Analysis, Dashboard Dev, Algorithm Design, Data Pipelines
2. **Clinical** -- Medicines Optimisation, Pop. Health Analytics, NICE TA, Health Economics, Clinical Pathways, CD Assurance
3. **Strategic** -- Budget Mgmt, Stakeholder Engagement, Pharma Negotiation, Team Development

Each category card:
- Header: Category name in DM Sans 700, with count badge ("8 skills", "6 skills", "4 skills")
- Collapsed state: Header + top 3 skills shown as pill badges with proficiency percentages
- Expanded state (click header): All skills visible as a grid. Each skill shows:
  - Name (DM Sans 500, 14px)
  - Proficiency (JetBrains Mono 400, 13px, `--teal`)
  - SVG circular gauge (64px diameter, `strokeDashoffset = circumference * (1 - level / 100)`, teal for Technical/Strategic, coral for Clinical)
  - The gauge animates when revealed (1s ease-out with 80ms stagger between skills)

### The Impact View

Triggered by clicking "The Impact" button.

**Layout:** Project cards in a 2-column grid (single column on mobile).

**Projects:**

1. **PharMetrics**
   - One-line: "Real-time medicines expenditure dashboard for NHS decision-makers"
   - Outcome badge: "Live Project" in teal
   - Link: medicines.charlwood.xyz
   - Tech badges: Power BI, SQL

2. **Switching Algorithm**
   - One-line: "Python algorithm identifying 14,000 patients for cost-effective alternatives"
   - Outcome badge: "2.6M savings" in teal
   - Stat with Measure Bar: "Compressed months of analysis into 3 days"
   - Tech badges: Python, SQL

3. **Blueteq Generator**
   - One-line: "Automated prior approval form creation for high-cost drugs"
   - Outcome badge: "200+ hrs/year saved" in teal
   - Stat: "70% reduction in required forms"
   - Tech badges: Python, Automation

4. **Sankey Chart Tool**
   - One-line: "Patient journey visualization for pathway compliance auditing"
   - Tech badges: Python, Data Visualization

5. **Controlled Drug Monitor**
   - One-line: "Population-scale opioid exposure tracking for patient safety"
   - Tech badges: Python, SQL

Each card has three depth levels:
- **Headline** (default): Title + one-line description + outcome badge
- **Summary** (click): 2-3 sentence methodology description + tech badges
- **Detail** (click again): Full description from CV, related role context, connection to other projects

### Everything View

Triggered by clicking "Everything" button. This renders the complete CV in a traditional single-scroll layout:

1. Hero section with name, title, summary paragraph
2. Vitals row (key stats as cards with Measure Bars)
3. Skills section with all three categories expanded
4. Experience section as vertical timeline with all bullet points
5. Education section with MPharm and Mary Seacole cards + A-Level note
6. Projects section as card grid
7. Contact section
8. Footer with Rx line callback

This is the fallback for visitors who want a conventional CV experience. It is also the view that search engines and screen readers encounter (full content in DOM regardless of which button is clicked; the button views filter visibility, they do not remove content from DOM).

---

## Interactions & Micro-interactions

### Choice Button Selection

1. User clicks a choice button
2. The Rx line pulses: a neon green (#00ff41) glow travels left-to-right along the line (300ms, ease-out)
3. The clicked button transitions to active state (teal background, white text, 150ms)
4. Previously active button returns to default state (150ms)
5. Content below the prompt area crossfades: old content fades out (200ms), new content fades in from below with `translateY(12px)` (300ms, 60ms stagger for child elements)

### Depth Expansion

1. User clicks "Tell me more" or an expandable element
2. The element smoothly expands: `max-height` transition from current to target (300ms, `cubic-bezier(0.22, 0.68, 0, 1.00)`)
3. New content fades in during expansion (opacity 0 to 1, 200ms, 100ms delay)
4. The "Tell me more" text changes to "Full detail" (if going from Headline to Summary) or "Collapse" (if at Detail level)
5. Chevron icon rotates 90 degrees (150ms)

### Depth Collapse

1. User clicks "Collapse"
2. Content fades out (150ms)
3. Element contracts (300ms, matching expansion easing)
4. Returns to Headline depth. "Tell me more" reappears.

### Command Palette Open

1. User presses Cmd+K (or clicks the search icon in the side rail)
2. Background dims with a 40% black overlay (200ms fade)
3. Palette container slides down from top with subtle `translateY(-8px)` to `translateY(0)` (250ms, spring)
4. Input field auto-focuses. Cursor blinks.
5. Placeholder text: "Search skills, roles, projects, or actions..."

### Command Palette Search

1. User types. Results appear in real-time (fuzzy matching via fuse.js)
2. Results grouped by section: "Experience", "Skills", "Projects", "Actions"
3. Each result: icon (section-colored) + title + breadcrumb (e.g., "Experience > Deputy Head > Python algorithm")
4. Arrow keys navigate results. Active result has teal background highlight.
5. Enter selects: navigates to the relevant content, expanding it to Detail depth. The corresponding choice button activates.
6. Escape closes the palette (200ms fade + slide up)

### Command Palette Actions

Beyond content search, the palette surfaces actions:
- "Download CV as PDF" -- generates and downloads a formatted PDF
- "Email Andy" -- opens mailto:andy@charlwood.xyz
- "View PharMetrics" -- opens medicines.charlwood.xyz in new tab
- "LinkedIn" -- opens linkedin.com/in/andrewcharlwood in new tab

Actions appear in an "Actions" group at the bottom of results, marked with a subtle lightning bolt icon.

### Rx Line Pulse

Triggered on every major interaction (button click, depth change, command palette selection). The pulse is a neon green (#00ff41) glow that:
1. Appears at the left edge of the line
2. Travels rightward across the full viewport width (300ms, ease-out)
3. Fades from 60% opacity to 0% as it travels
4. The teal (#0D7377) base line is always visible -- the pulse is a highlight overlay

This is the design's heartbeat callback. It ties every interaction back to the ECG origin without being heavy-handed.

### Measure Bar Animation

1. IntersectionObserver detects the stat entering the viewport (threshold: 0.3)
2. The 3px bar fill animates from width 0% to target width
3. Duration: 800ms, easing: `cubic-bezier(0.22, 0.68, 0, 1.00)`
4. Stagger: 100ms between adjacent Measure Bars
5. Trigger-once: bars do not re-animate on subsequent views

---

## Navigation

### The Side Rail

A persistent minimal sidebar rail on the left edge of the viewport. Width: 48px. Background: transparent (does not occlude content).

**Contents (top to bottom):**
- Search icon (Lucide Search, 20px) -- triggers command palette
- Divider line (1px, 16px wide, `--border`)
- 5 section icons matching the choice buttons:
  - Hash (The Numbers)
  - Clock (The Journey)
  - Layers (The Skills)
  - Zap (The Impact)
  - List (Everything)
- Spacer (flex-grow)
- Dose meter (bottom)

Each icon: 20px, `--text-muted` color. Active icon: `--teal`. Hover: `--amber`.

**"Seen" indicators:** After a visitor has viewed a section (clicked the corresponding button), a 4px teal dot appears below that section's icon. This creates a subtle completeness signal without being gamified.

Clicking any icon triggers the same behavior as clicking the corresponding choice button (Rx line pulse, content crossfade, button active state update).

### The Dose Meter

Positioned at the bottom of the side rail. A vertical bar, 4px wide, 48px tall.

- Background track: `--border`
- Fill: `--teal`, growing upward
- Fill height: proportional to the percentage of total content elements the visitor has viewed (seen section / total sections, plus expanded items / total expandable items)

No label, no percentage. Just a quiet fill. If the visitor has seen everything, the bar is full and gains a subtle amber glow.

**Disable:** A tiny settings gear icon (12px, `--text-dim`) appears on hover near the dose meter. Clicking it toggles the meter off (it fades out and the gear icon shows a strikethrough state). Preference stored in `localStorage`.

### Keyboard Shortcuts

| Key | Action |
|---|---|
| `Cmd+K` / `Ctrl+K` | Open command palette |
| `Escape` | Close command palette / collapse expanded content |
| `1-5` | Switch to view 1-5 (Numbers, Journey, Skills, Impact, Everything) |
| `Tab` | Navigate between interactive elements in DOM order |
| `Enter` / `Space` | Activate focused button / expand focused content |
| `?` | Show keyboard shortcut overlay (dismissible) |

---

## Responsive Strategy

### Desktop (> 1024px)

Full experience:
- Side rail visible on left edge
- Choice buttons in single horizontal row
- Content in 8-column centered grid (max-width 960px)
- Command palette as floating overlay (max-width 640px, centered)
- 2-column grid for project cards
- Horizontal timeline for Journey view
- Dose meter in side rail

### Tablet (768px - 1024px)

- Side rail collapses to a **bottom tab bar** (5 icons + search, horizontal, 56px height, anchored to bottom)
- Content fills full width minus 24px padding each side
- Choice buttons wrap to 2 rows if needed
- Command palette becomes full-screen overlay (slides up from bottom)
- Project cards in single column
- Horizontal timeline becomes scrollable (horizontal overflow with subtle scroll indicators)
- Dose meter moves to the right side of the bottom tab bar as a horizontal bar

### Mobile (< 768px)

- **Bottom tab bar:** 5 section icons + search icon. Same as tablet but more compact (48px height). Icons 18px. Active icon has teal dot below.
- **Choice buttons:** Stack vertically, full width minus 32px padding. Larger touch targets (48px height minimum).
- **Content:** Single column, 16px padding.
- **Command palette:** Full-screen overlay. Input at top. Results scrollable below.
- **The Journey timeline:** Converts from horizontal to **vertical** timeline. Roles stack vertically with timeline line on the left. More natural for vertical scrolling.
- **Project cards:** Single column, full width.
- **Skill gauges:** Grid of 2 columns instead of 3.
- **Dose meter:** Hidden on mobile (the bottom tab bar's "seen" dots provide equivalent information).
- **Rx line:** Still visible, but at reduced width (viewport width minus 32px, centered). Pulse animation still fires.
- **Depth expansion:** Touch-friendly. "Tell me more" links have 44px minimum touch target. Expansion uses the full screen width.

The progressive disclosure mechanic is **inherently mobile-friendly** because it shows less content by default. Mobile users benefit most from the dosage model -- they are the most likely to want just "The Numbers" rather than scrolling through everything.

---

## Technical Implementation

### Choice Button State Management

```tsx
type ViewMode = 'numbers' | 'journey' | 'skills' | 'impact' | 'everything';

const [activeView, setActiveView] = useState<ViewMode | null>(null);
const [visitedViews, setVisitedViews] = useState<Set<ViewMode>>(new Set());
```

Switching views triggers `AnimatePresence` for crossfade transitions. The DOM always contains all content (for SEO/accessibility); views are toggled via `display` or `visibility` with animated wrappers.

### Three-Depth System

A reusable `DepthContent` component manages the three levels:

```tsx
interface DepthContentProps {
  headline: React.ReactNode;
  summary: React.ReactNode;
  detail: React.ReactNode;
  id: string; // unique identifier for dose tracking
}

const DepthContent: React.FC<DepthContentProps> = ({ headline, summary, detail, id }) => {
  const [depth, setDepth] = useState<1 | 2 | 3>(1);
  const { trackView } = useDoseMeter();

  useEffect(() => {
    trackView(id, depth);
  }, [depth]);

  return (
    <div>
      {headline}
      <AnimatePresence mode="wait">
        {depth >= 2 && <motion.div key="summary" ...>{summary}</motion.div>}
        {depth >= 3 && <motion.div key="detail" ...>{detail}</motion.div>}
      </AnimatePresence>
      <DepthToggle currentDepth={depth} onToggle={setDepth} />
    </div>
  );
};
```

### Command Palette

**Library:** Headless UI `Combobox` for the input + listbox pattern. `fuse.js` for fuzzy search (~6KB gzipped).

**Search index:** Built at app initialization from all CV content. Each searchable item has:
- `title`: display name
- `section`: which view it belongs to
- `content`: searchable text (role descriptions, skill names, project details)
- `action`: what happens when selected (navigate to view, expand to depth, open URL)

```tsx
const searchIndex = new Fuse(allContent, {
  keys: ['title', 'content'],
  threshold: 0.4,
  includeScore: true,
});
```

Results are grouped by section and capped at 8 results per group.

### Side Rail Active Tracking

The side rail uses the `useActiveSection` hook pattern:

```tsx
const useActiveView = () => {
  const [activeView, setActiveView] = useState<ViewMode | null>(null);
  // Tracks which button was last clicked
  // Side rail icons reflect this state
  return { activeView, setActiveView };
};
```

For the "Everything" view, IntersectionObserver tracks which section is in the viewport and updates the side rail's active icon accordingly.

### Dose Meter

A custom hook tracks content exploration:

```tsx
const useDoseMeter = () => {
  const [viewedItems, setViewedItems] = useState<Map<string, number>>(new Map());
  // key: content item ID, value: max depth viewed (1, 2, or 3)

  const totalItems = TOTAL_CONTENT_ITEMS; // constant
  const totalDepthPoints = totalItems * 3; // max possible
  const currentPoints = Array.from(viewedItems.values()).reduce((sum, d) => sum + d, 0);
  const percentage = currentPoints / totalDepthPoints;

  return { percentage, trackView, viewedItems };
};
```

The meter fill is a CSS custom property (`--dose-fill`) animated via transition on the bar element.

### Rx Line Pulse

The pulse is a CSS pseudo-element on the line container:

```css
.rx-line::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, transparent 0%, #00ff41 50%, transparent 100%);
  opacity: 0;
  transform: translateX(-100%);
}

.rx-line.pulsing::after {
  animation: rxPulse 300ms ease-out forwards;
}

@keyframes rxPulse {
  0% { opacity: 0.6; transform: translateX(-100%); }
  100% { opacity: 0; transform: translateX(100%); }
}
```

The `.pulsing` class is added via React state and removed after the animation completes (300ms timeout).

### Measure Bar Animation

Each Measure Bar is a simple div with CSS transition:

```css
.measure-bar-fill {
  height: 3px;
  width: 0%;
  background: var(--teal);
  transition: width 800ms cubic-bezier(0.22, 0.68, 0, 1.00);
}

.measure-bar-fill.visible {
  width: var(--target-width);
}
```

The `--target-width` is set via inline style from the data. The `.visible` class is toggled by IntersectionObserver (trigger-once).

### Performance Budget

- **Fonts:** DM Sans (700, 500) + Inter (400, 450, 500) + JetBrains Mono (400, 700) = ~120KB total
- **fuse.js:** ~6KB gzipped
- **Framer Motion:** tree-shaken to AnimatePresence + motion div = ~30KB gzipped
- **Headless UI Combobox:** ~8KB gzipped
- **Total JS bundle (above framework):** ~44KB gzipped
- **No canvas rendering.** All visuals are DOM/CSS. This is the lightest design of all 6.

---

## Accessibility

This is the **most accessible** of all 6 designs.

### Full Content Always in DOM

Regardless of which choice button is active, all CV content exists in the DOM in logical order. The view buttons toggle `visibility` and `aria-hidden`, not `display: none` or DOM removal. This means:

- Search engines index the full CV content
- Screen readers can traverse all content
- The "Everything" button simply makes everything visible -- it does not load additional content

### Progressive Disclosure Patterns

All expand/collapse interactions use standard WAI-ARIA patterns:

- Expandable items: `aria-expanded="true|false"` on the trigger
- Content panels: `aria-hidden` mirrors expanded state
- Role: `aria-controls` links trigger to its content panel
- State change announced: trigger's `aria-expanded` update is announced by screen readers

### Command Palette

- Fully keyboard navigable: arrow keys, Enter, Escape
- `role="combobox"` with `aria-haspopup="listbox"`
- Results: `role="listbox"` with `role="option"` children
- `aria-activedescendant` tracks the currently highlighted result
- `aria-label="Search CV content and actions"`

### Side Rail

- `role="navigation"`, `aria-label="Section navigation"`
- Each icon: `role="button"`, `aria-label="View [section name]"`, `aria-pressed="true|false"`
- Dose meter: `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-label="Content exploration progress"`

### Focus Management

- When a choice button is clicked, focus moves to the first content element in the new view
- When the command palette opens, focus moves to the search input
- When the command palette closes, focus returns to the element that opened it
- When content expands, focus moves to the newly revealed content
- Skip-to-content link is the first focusable element

### Motion Preferences

When `prefers-reduced-motion: reduce` is detected:
- Measure Bars show their final width immediately (no animation)
- No Rx line pulse animation
- View transitions use instant swap instead of crossfade
- Depth expansions use instant show/hide instead of animated expansion
- Choice button stagger is removed (all appear simultaneously)
- The ECG transition morph is simplified to a crossfade (green name fades out, clean name fades in)

### Color Contrast

All text meets WCAG AA on the warm white background:
- `--text-heading` (#1A1A2E) on `--bg-warm` (#F8F6F3): contrast ratio 14.8:1 (AAA)
- `--text-body` (#3D3D56) on `--bg-warm` (#F8F6F3): contrast ratio 8.2:1 (AAA)
- `--text-muted` (#8B8B9E) on `--bg-warm` (#F8F6F3): contrast ratio 3.5:1 (AA for large text)
- `--teal` (#0D7377) on `--bg-warm` (#F8F6F3): contrast ratio 5.4:1 (AA)
- `--coral` (#E8735A) on `--bg-warm` (#F8F6F3): contrast ratio 3.1:1 (AA for large text; used only for CTA buttons with white text overlay)

Button text contrast:
- White (#FFFFFF) on `--teal` (#0D7377): contrast ratio 5.4:1 (AA)
- White (#FFFFFF) on `--coral` (#E8735A): contrast ratio 3.3:1 (AA for large text, 18px+)

### Touch Targets

All interactive elements have minimum 44px touch targets on mobile:
- Choice buttons: 48px height
- "Tell me more" links: 44px tap area (padded beyond visible text)
- Side rail / bottom tab icons: 44px tap area
- Command palette results: 48px row height

---

## What Makes This Special

The Dosage respects the visitor's time more than any other design. It answers the question every CV visitor has but never gets to ask: "What do you want to know?"

A busy recruiter clicks "The Numbers" and sees Andy's quantitative impact in 5 seconds flat. A thorough hiring manager clicks "Everything" and reads the full CV. A curious peer clicks "The Impact" and deep-dives into the switching algorithm project through three depth levels. A power user hits Cmd+K and searches for "Python" to find every mention across all sections instantly.

The pharmaceutical dosage metaphor is elegant without being heavy-handed. It is not costume design -- it is a genuine UX pattern. The concept of dose-response (the right amount of the right thing at the right time) is literally how pharmacists think, and it is literally how good information architecture should work. Andy's professional worldview IS the site's UX philosophy.

The Rx line -- the persistent teal horizontal line with its green pulse callback -- is the design's signature. It is simultaneously:
- A remnant of the ECG animation (narrative continuity)
- A pharmaceutical prescription line (career metaphor)
- A progress indicator (interaction feedback)
- A visual anchor (layout stability)

One element, four meanings. That is efficient design.

The command palette signals technical sophistication to the right audience (developers, tech-adjacent roles) without alienating non-technical visitors (it is optional, triggered only by keyboard shortcut or an unobtrusive search icon). It says: "Andy knows how power users think, because he builds tools for them."

And the dose meter -- that quiet little bar in the corner -- does something subtle and important. It tells the visitor: "There is more here if you want it." It creates gentle curiosity without pressure. It makes thoroughness feel rewarding rather than obligatory. Most CV sites give you everything and hope you read it. This one gives you control and trusts you to find what matters.
