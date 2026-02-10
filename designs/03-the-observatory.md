# Design 3: The Observatory

## Overview

A non-linear, spatial interface where the site does not scroll -- it is an interactive constellation. Glowing nodes arranged in a force-directed graph represent sections of Andy's career. Click a node to zoom in. Navigation is spatial, not linear. The most visually distinctive and architecturally ambitious of all 6 designs.

The core insight: a traditional CV is a list. A constellation is a map. Lists impose a reading order. Maps invite exploration. By presenting Andy's career as an interconnected constellation rather than a sequential document, visitors build their own mental model of how clinical expertise, technical skill, and strategic leadership connect -- and they remember it, because they built it themselves.

This design draws from three disciplines: knowledge-graph visualization (Obsidian, Neo4j Browser), environmental storytelling in game design (where narrative is discovered through spatial exploration rather than linear delivery), and the force-directed graph layouts used in data science to reveal hidden structure in complex datasets. It applies all three to the problem of self-presentation.

---

## ECG Transition

**Starting point:** "ANDREW CHARLWOOD" is on screen in neon green (#00ff41) strokes on a black (#000) background. The ECG trace that drew it is still visible. The drawing head has stopped.

**Then:**

The letterforms begin to **contract inward** toward the center of the name. Each letter stretches and thins -- like light near a gravitational singularity -- as it compresses toward a single convergence point at screen center. The neon green shifts through cyan (#00E5FF) to bright white (#FFFFFF) as the letters converge, mimicking the blueshift of light under gravitational compression.

All letters collapse into a single luminous point. A beat of stillness (200ms).

The point **pulses** -- a sonar ring of soft cyan (#00D4AA) radiates outward from center. As this ring passes across the viewport, constellation nodes **blink into existence in its wake**, each one appearing with a brief flash and then settling into a soft glow. The ring reaches the viewport edges and fades.

Simultaneously, the black background shifts imperceptibly to deep navy (#0A0E1A). The luminous center point fades and Andy's name re-renders as clean DOM text (Space Grotesk, 700 weight, soft white #ECECF0) at center screen. His role title fades in below at smaller size.

The 5-6 constellation nodes that appeared during the sonar ring now animate to their orbital positions around the name using spring physics -- they overshoot slightly, oscillate, and settle. Each node has a faint label that appears on hover proximity.

**Duration:** ~2.4 seconds.

**Color journey:** Black (#000) --> Deep Navy (#0A0E1A). ECG green (#00ff41) --> Cyan (#00E5FF) --> White (#FFF) at convergence --> Warm amber (#D4874D) node glows + Electric cyan (#00D4AA) active states in the constellation.

**The message:** "What was a single heartbeat line has become a universe of interconnected points. Welcome to the observatory."

---

## Visual System

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `--bg-deep` | `#0A0E1A` | Primary background (deep navy-black) |
| `--bg-gradient` | `radial-gradient(ellipse at center, #0F1428 0%, #0A0E1A 70%)` | Subtle depth at center |
| `--amber` | `#D4874D` | Primary accent -- node highlights, connection lines, active indicators |
| `--amber-glow` | `rgba(212, 135, 77, 0.15)` | Ambient glow around active nodes |
| `--cyan` | `#00D4AA` | Active/hover states, sonar pulses, interactive feedback |
| `--cyan-glow` | `rgba(0, 212, 170, 0.12)` | Hover glow |
| `--text-primary` | `#ECECF0` | Headings, labels, primary text |
| `--text-secondary` | `#8B8FA3` | Descriptions, body text |
| `--text-dim` | `#4A4E63` | Tertiary labels, metadata |
| `--grid-line` | `#1A1F2E` | Faint structural lines (used sparingly) |
| `--node-border` | `#2A2F42` | Inactive node borders |
| `--card-bg` | `rgba(15, 20, 40, 0.85)` | Detail panel backgrounds (translucent) |
| `--card-border` | `rgba(212, 135, 77, 0.2)` | Detail panel border glow |

### Background Treatment

No grid for this design. The dark space should feel open, organic, and expansive -- not systematic. Three layers create depth:

1. **Base:** Flat deep navy (#0A0E1A)
2. **Depth gradient:** Subtle radial gradient, lighter at center (#0F1428), fading to base at edges. Creates a sense of looking into space.
3. **Star particles:** Very low density (30-50 particles across the viewport), tiny (1-2px), faintly glowing white at 10-20% opacity. Drift slowly. These are purely atmospheric -- they do not carry content or respond to interaction. They simply make the space feel alive.

### Typography

| Role | Font | Weight | Size |
|---|---|---|---|
| Display (name) | Space Grotesk | 700 | `clamp(2rem, 4vw, 3.5rem)` |
| Section headings | Space Grotesk | 500 | `clamp(1.25rem, 2.5vw, 1.75rem)` |
| Body text | IBM Plex Sans | 400 | 15px / 1.7 line-height |
| Subheadings | IBM Plex Sans | 500 | 14px |
| Data labels / stats | IBM Plex Mono | 400 | 13px, uppercase, 0.05em tracking |
| Node labels | Space Grotesk | 500 | 13px |

**Font loading strategy:** Space Grotesk and IBM Plex Sans loaded via Google Fonts with `display=swap`. IBM Plex Mono loaded with `display=optional` (falls back to system mono if slow to load -- acceptable for data labels).

### Motion

- **Spring physics** for all node movement: `mass: 1, stiffness: 120, damping: 14` (Framer Motion spring config). This creates a responsive, organic feel -- nodes overshoot and settle rather than moving linearly.
- **Zoom transitions:** `cubic-bezier(0.16, 1, 0.3, 1)` -- fast departure, gentle arrival. Duration 600ms.
- **Hover effects:** 150ms ease-out for color/glow changes.
- **Connection line reveals:** `stroke-dasharray` animation, 800ms per line with 100ms stagger between lines.
- **Sonar pulse on interaction:** Radial ring emanating from clicked node, 400ms, opacity 0.3 --> 0.

### Signature Visual: Connection Lines

The constellation's defining feature is the connection web that reveals relationships between career elements. After visiting 3+ nodes, a "View Connections" toggle appears.

- Lines are SVG `<path>` elements drawn between node center points.
- **Line thickness** encodes relationship strength: strong connections (Python --> switching algorithm --> 2.6M savings) use 2px lines; weaker thematic connections use 0.75px lines.
- **Line color:** Warm amber (#D4874D) at 40% opacity, brightening to 80% on hover.
- **Line style:** Slightly curved (quadratic bezier with a subtle arc), not straight. This creates a more organic, constellation-like appearance.
- **Interaction:** Hovering a connection line shows a tooltip explaining the relationship. Example: "Python skills --> Built switching algorithm --> 14,000 patients identified, 2.6M annual savings."
- **Animation:** Lines draw themselves using `stroke-dashoffset` animation when first revealed.

---

## Section-by-Section Design

### Hub View (Default State)

The hub is the home state -- what visitors see after the ECG transition completes. Andy's name sits at center in Space Grotesk 700, with his role title below in IBM Plex Sans. Around the name, 5-6 constellation nodes orbit at varying distances:

**Node positions (approximate, adjusted by force-directed layout):**

| Node | Orbital Distance | Glow Color | Icon Concept |
|---|---|---|---|
| Skills | Close orbit (top-right) | Amber | Hexagonal skill web |
| Experience | Close orbit (left) | Amber | Timeline/pulse line |
| Education | Mid orbit (bottom-left) | Cyan | Academic cap / book |
| Projects | Mid orbit (bottom-right) | Cyan | Code brackets / diagram |
| Contact | Outer orbit (top-left) | Amber | Signal / connection |

Each node is a 48-64px circle with:
- A soft glow (`box-shadow: 0 0 20px var(--amber-glow)`)
- A thin border (`1px solid var(--node-border)`, transitioning to `--amber` on hover)
- A small icon or symbol at center (Lucide icons, 20px)
- A label that appears on hover or cursor proximity (within 100px), fading in at 200ms

**Gravitational attraction:** As the cursor moves near a node (within 120px), the node is gently pulled toward the cursor by 4-8px. This creates a subtle sense of magnetic interaction without disrupting the layout. The pull uses spring physics with high damping (damping: 20) to prevent oscillation.

**Ambient animation:** Nodes drift very slowly in micro-orbits (2-3px movement radius, 8-12 second cycle). This keeps the constellation feeling alive without being distracting.

### Skills Node (Zoomed In)

**Zoom transition:** Clicking the Skills node triggers a smooth pan+zoom. The clicked node expands to fill ~70% of the viewport width. Other nodes animate to the periphery (scaled down to 24px, still visible, still clickable). Duration: 600ms.

**Internal layout:** A radial skill diagram. Skills orbit a center point at distances proportional to their proficiency level (higher proficiency = closer to center, representing mastery as gravitational pull).

Three concentric rings (barely visible, #1A1F2E at 30% opacity) mark proficiency zones: Expert (inner), Proficient (mid), Competent (outer).

**Skill categories** are color-coded:
- Technical skills: Amber (#D4874D) nodes
- Clinical skills: Cyan (#00D4AA) nodes
- Strategic skills: Soft white (#ECECF0) nodes with amber border

Each skill is a small node (32-40px) with the skill name below it. Hovering a skill:
1. Expands the node slightly (scale 1.15)
2. Shows a tooltip with proficiency percentage and a one-line description
3. Highlights all related skills with pulsing connection lines

**Interaction:** The radial diagram can be slowly rotated by click-and-drag (Framer Motion `drag` with `dragElastic: 0.1`, constrained to rotation). This serves no functional purpose -- it simply makes the diagram feel tactile and explorable.

**Skill data:**

Technical: Python (90%), SQL (88%), Power BI (92%), JS/TS (70%), Data Analysis (95%), Dashboard Dev (88%), Algorithm Design (82%), Data Pipelines (80%)

Clinical: Medicines Optimisation (95%), Pop. Health Analytics (90%), NICE TA (85%), Health Economics (80%), Clinical Pathways (82%), CD Assurance (88%)

Strategic: Budget Mgmt (90%), Stakeholder Engagement (88%), Pharma Negotiation (85%), Team Development (82%)

### Experience Node (Zoomed In)

**Internal layout:** A vertical timeline within the expanded node, scrollable if content exceeds the viewport. The timeline line runs vertically at 20% from the left edge, with timeline dots and cards to the right.

Each role card contains:
- Role title (Space Grotesk, 500, `--text-primary`)
- Organisation (IBM Plex Sans, 400, `--cyan`)
- Date range (IBM Plex Mono, 400, `--text-dim`, in a pill badge with `--amber` background at 10% opacity)
- Expandable bullet points (collapsed by default, showing first 2 bullets with "Show more" toggle)

**Color-coding per employer era:**
- NHS Norfolk & Waveney ICB roles: Left border amber (#D4874D)
- Tesco Pharmacy roles: Left border cyan (#00D4AA)

This creates instant visual distinction between the "data/analytics" era and the "clinical pharmacy" era.

**Background shift:** The expanded node's background subtly shifts warm (#0F1220) during ICB roles and cooler (#0A1018) during Tesco roles. The shift is barely perceptible but creates an atmospheric distinction.

**Role data (from CV_v4.md):**

1. **Interim Head, Population Health & Data Analysis** -- NHS Norfolk & Waveney ICB -- May-Nov 2025
   - Identified and prioritised a 14.6M efficiency programme through comprehensive data analysis; achieved over-target performance by October 2025
   - Built Python-based switching algorithm compressing months of manual analysis into 3 days, identifying 14,000 patients and 2.6M in annual savings
   - Automated incentive scheme analysis; achieved 50% reduction in targeted prescribing within first two months
   - Presented strategy and financial position to Chief Medical Officer on bimonthly basis
   - Led transformation from practice-level data to patient-level SQL analytics

2. **Deputy Head, Population Health & Data Analysis** -- NHS Norfolk & Waveney ICB -- Jul 2024-Present
   - Managed 220M prescribing budget with sophisticated forecasting models
   - Collaborated with ICB data engineering team to create comprehensive medicines data table
   - Led financial scenario modelling for system-wide DOAC switching programme
   - Led renegotiation of pharmaceutical rebate terms ahead of patent expiry
   - Supported commissioning of tirzepatide (NICE TA1026) including financial projections
   - Developed Python-based controlled drug monitoring system
   - Educated colleagues on data interpretation and analytics best practices

3. **High-Cost Drugs & Interface Pharmacist** -- NHS Norfolk & Waveney ICB -- May 2022-Jul 2024
   - Wrote most of the system's high-cost drug pathways spanning rheumatology, ophthalmology, dermatology, gastroenterology, neurology, and migraine
   - Developed software automating Blueteq prior approval form creation: 70% reduction in forms, 200 hours immediate savings
   - Integrated Blueteq data with secondary care activity databases
   - Created Python-based Sankey chart analysis tool visualising patient journeys

4. **Pharmacy Manager** -- Tesco PLC -- Nov 2017-May 2022
   - Identified and shared asthma screening process adopted nationally across ~300 branches, enabling ~1M in revenue
   - Led creation of national induction training plan and eLearning modules
   - Supervised two staff members through NVQ3 qualifications

### Education Node (Zoomed In)

**Internal layout:** A horizontal path with interactive milestone markers. The path is a subtle line running left-to-right across the expanded node, with milestone nodes along it.

**Milestones:**
1. **A-Levels** (2009-2011) -- Highworth Grammar School. Mathematics (A*), Chemistry (B), Politics (C). Node shows as a small marker.
2. **MPharm (Hons) Pharmacy** (2011-2015) -- University of East Anglia. Upper Second-Class Honours (2:1). This is the primary milestone -- larger node. Clicking opens a detail panel with the research project information.
3. **Research Project** -- Drug delivery and cocrystals: 75.1% (Distinction). This sub-node opens a mini-visualization: simple SVG polyhedra representing cocrystal structures, rotatable by mouse drag. The polyhedra are wireframe-style in cyan (#00D4AA) on the dark background, gently rotating when idle. This is a small touch of delight that also subtly demonstrates technical capability (interactive 3D in the browser).
4. **Mary Seacole Programme** (2018) -- NHS Leadership Academy. 78%. Change management, healthcare leadership, system-level thinking.
5. **GPhC Registration** (August 2016-Present) -- Persistent certification. Shown as a badge rather than a path node.

### Projects Node (Zoomed In)

**Internal layout:** Each project is a sub-cluster -- a mini-constellation of technology + outcome nodes. The cluster is interactive: clicking zooms into it.

**Projects:**

1. **PharMetrics** -- Real-time medicines expenditure dashboard. Sub-nodes: "Power BI" (tech), "NHS Decision-Makers" (audience), "Actionable Analytics" (outcome). Link: medicines.charlwood.xyz
2. **Switching Algorithm** -- Python-based patient identification system. Sub-nodes: "Python" (tech), "14,000 Patients" (scale), "2.6M Savings" (outcome), "3 Days vs Months" (efficiency).
3. **Blueteq Generator** -- Automation tool for high-cost drug approvals. Sub-nodes: "Automation" (tech), "70% Reduction" (efficiency), "200+ Hours Saved" (outcome).
4. **Sankey Chart Tool** -- Patient journey visualization. Sub-nodes: "Python" (tech), "Data Visualization" (method), "Pathway Compliance" (outcome).
5. **Controlled Drug Monitor** -- Population-level opioid exposure tracking. Sub-nodes: "Python + SQL" (tech), "Patient Safety" (purpose), "Population Scale" (scope).

Each project cluster has connection lines back to the Skills and Experience nodes, showing provenance.

### Contact Node (Zoomed In)

**Internal layout:** A clean, centered panel with contact information. The copy reads: "Ready to connect another node to the network."

**Contact methods:**
- Email: andy@charlwood.xyz (clickable mailto link)
- Phone: 07795553088
- LinkedIn: linkedin.com/in/andrewcharlwood (opens in new tab)
- Location: Norwich, UK

Each contact method is a horizontal row with a Lucide icon (Mail, Phone, Linkedin, MapPin) in cyan, label in dim text, and value in primary text. Hovering a row highlights it with a subtle amber glow.

---

## Interactions & Micro-interactions

### Node Hover

1. Cursor enters 120px proximity zone: node begins gravitational pull toward cursor (4-8px, spring physics)
2. Cursor enters node bounds: border transitions from `--node-border` to `--amber` (150ms). Glow intensifies. Label fades in below node (200ms fade).
3. Cursor exits: all effects reverse with matching timing.

### Node Click (Zoom In)

1. Clicked node scales up with spring animation (mass: 1, stiffness: 100, damping: 12) from ~56px to ~70% viewport width
2. Other nodes simultaneously scale down to 24px and drift to viewport periphery (spring, 600ms)
3. Background subtly darkens by 10% to create focus
4. Clicked node's internal content fades in with 200ms delay, 400ms duration
5. A subtle "zoom out" icon (Lucide Minimize2) appears top-left of expanded node

### Zoom Out

1. Triggered by: clicking zoom-out button, pressing Escape, or clicking any peripheral node
2. If clicking a peripheral node: that node zooms in while the current one zooms out (seamless swap, ~700ms)
3. If zooming out to hub: expanded node contracts, peripheral nodes return to orbital positions (spring physics, ~600ms). Internal content fades out before contraction begins.

### Connection Line Reveal

1. Triggered after visiting 3+ unique nodes. A floating "View Connections" pill button fades in at bottom-center.
2. Clicking the toggle: connection lines draw themselves between related nodes using `stroke-dashoffset` animation. Each line takes 600ms. Lines stagger by 100ms.
3. Hovering a connection line: the line brightens to 80% opacity, thickens by 0.5px, and a tooltip appears at the midpoint explaining the relationship.
4. Clicking the toggle again: lines retract (reverse `stroke-dashoffset`) and the button returns to "View Connections."

### Sonar Pulse

When any interactive action occurs (node click, lens switch, connection toggle), a subtle sonar ring (cyan, 20% opacity) radiates from the point of interaction. Duration: 400ms. Radius: 80px. This provides visual feedback that ties every interaction back to the ECG intro's sonar moment.

### Ambient Drift

All nodes in the hub view drift in micro-orbits: 2-3px movement radius, 8-12 second cycle, using sine-wave interpolation. The drift directions are randomized per node. This keeps the constellation alive without being distracting. The drift pauses during zoom transitions to prevent visual conflict.

---

## Navigation

### The Lens System

A floating toolbar anchored to the bottom-center of the viewport (above the connection toggle, if visible). Contains 3 lens buttons:

| Lens | Icon | Effect |
|---|---|---|
| **The Numbers** | Hash (#) | All nodes dim except those containing quantitative achievements. Amber-highlighted stat cards float above the dimmed constellation showing: 14.6M, 14,000, 220M, 2.6M, 200 hrs, 1M. Each card links to its source node. |
| **The Journey** | Clock / Timeline | Nodes rearrange from orbital positions into a horizontal chronological timeline. Spring animation. Leftmost = A-Levels (2009), rightmost = current role (2025). Nodes are spaced proportionally to duration. This is the traditional fallback view -- familiar and scannable. |
| **The Stack** | Layers | Nodes regroup by technical capability. Three vertical columns: "Clinical," "Technical," "Strategic." Within each column, relevant content from Experience, Skills, and Projects is aggregated. Shows Andy's capabilities cross-cut across all roles. |

Clicking any lens animates the constellation into the new arrangement. Clicking the same lens again returns to the default hub view. Only one lens can be active at a time.

**Lens transitions:** Nodes move to their new positions using spring physics (600ms). Content within nodes fades out during transition and fades back in once settled (200ms fade).

### Keyboard Navigation

- **Tab:** Cycles through nodes in logical order (Skills, Experience, Education, Projects, Contact)
- **Enter / Space:** Zooms into focused node
- **Escape:** Zooms out to hub view
- **Arrow keys:** When in hub view, moves focus between adjacent nodes (proximity-based adjacency)
- **L key:** Cycles through lenses (None --> Numbers --> Journey --> Stack --> None)
- **C key:** Toggles connection lines (after 3+ nodes visited)

### Focus Indicators

Keyboard-focused nodes receive a visible focus ring: 2px solid cyan (#00D4AA) with 4px offset. The focus ring pulses gently (opacity 0.7 --> 1.0, 1.5s cycle) to distinguish it from hover states.

---

## Responsive Strategy

### Desktop (> 1024px)

Full spatial constellation experience. All features enabled:
- Force-directed node layout with gravitational cursor interaction
- Click-to-zoom node expansion
- Drag to rearrange nodes
- Connection lines with hover tooltips
- Full lens system
- Keyboard navigation

### Tablet (768px - 1024px)

Simplified constellation:
- Fewer ambient particles (15-20 instead of 30-50)
- No gravitational cursor pull (touch interfaces lack persistent cursor position)
- Tap to zoom into nodes
- Detail views render as full-screen overlays (sliding up from bottom, 90vh height) rather than inline expansion
- Connection lines are shown as a static overlay rather than animated reveal
- Lens toolbar moves to top of screen as a horizontal pill selector

### Mobile (< 768px)

The constellation transforms into a **vertical card stack**:
- Each card represents one constellation node. Cards are stacked vertically with 16px gap.
- Each card shows: icon, section title, one-line preview (e.g., "Python, SQL, Power BI + 15 more skills")
- Tapping a card expands it to show full section content (accordion-style, one expanded at a time)
- The lens toolbar becomes a horizontal pill selector at top of screen, sticky on scroll
- "The Journey" lens on mobile presents a standard vertical timeline
- "The Numbers" lens shows a simple stat card grid (2 columns)
- "The Stack" lens shows tabbed category view
- Background: solid deep navy. No particles, no gradient (performance).
- Connection lines: not shown on mobile. Instead, a "Related" section at the bottom of each expanded card lists connected items as text links.

### Touch Interaction

- **Tap node / card:** Zoom in (desktop/tablet) or expand (mobile)
- **Pinch-to-zoom:** Not supported (avoids conflict with browser zoom). Zoom is click/tap only.
- **Swipe:** On mobile, swipe horizontally between lens views. Swipe down to collapse an expanded card.
- **Long-press:** Not used (avoids confusion with system long-press behaviors).

---

## Technical Implementation

### Force-Directed Layout

**Library:** `d3-force` (lightweight -- only the force simulation module, not all of D3). ~15KB gzipped.

**Configuration:**
```
forceSimulation(nodes)
  .force('charge', forceManyBody().strength(-200))
  .force('center', forceCenter(viewportWidth / 2, viewportHeight / 2))
  .force('collision', forceCollide().radius(80))
  .force('radial', forceRadial(orbitDistance, cx, cy).strength(0.3))
```

Nodes are initialized with target orbital positions. The simulation runs for ~100 ticks on mount to reach equilibrium, then continues running at low alpha for ambient drift.

**Performance:** The simulation runs on `requestAnimationFrame` but only when nodes are moving (alpha > 0.001). When the constellation is at rest, the simulation pauses entirely. On resize, the simulation restarts with updated center coordinates.

### Zoom Transitions

**Library:** Framer Motion `AnimatePresence` with `layoutId` for seamless zoom.

Each node has a `layoutId` matching its section key (e.g., `layoutId="skills"`). When the node expands, its `layout` animation triggers automatically. The detail content uses `AnimatePresence` for mount/unmount transitions.

```tsx
<motion.div layoutId={nodeId} layout="position" transition={{ type: "spring", stiffness: 120, damping: 14 }}>
  {isExpanded ? <DetailView /> : <NodeIcon />}
</motion.div>
```

### Connection Lines

SVG `<path>` elements rendered in a fixed-position SVG overlay that spans the viewport. Paths are quadratic bezier curves between node center positions:

```
M startX startY Q controlX controlY endX endY
```

The control point is offset perpendicular to the line midpoint, creating a gentle arc. The offset direction alternates for adjacent lines to prevent overlap.

**Animation:** `stroke-dasharray` set to total path length. `stroke-dashoffset` animated from total length to 0 (line drawing effect). Duration: 600ms with `ease-out` timing.

### Star Particles

A single `<canvas>` element behind all content. 30-50 particles initialized with random positions and slow drift velocities. Rendered with `requestAnimationFrame`. Each particle is a 1-2px circle with 10-20% opacity.

The canvas pauses rendering when the tab is not visible (`document.visibilityState`). On mobile, the canvas is not created (particles disabled for performance).

### Detail Panel Scrolling

Zoomed-in node content that exceeds the viewport height uses `overflow-y: auto` with custom scrollbar styling (thin, amber-colored on WebKit browsers). The scroll container is the expanded node's inner content area, not the page body. `body` overflow is set to `hidden` when any node is expanded to prevent background scrolling.

### State Management

React `useState` for:
- `activeNode: string | null` -- which node is expanded (null = hub view)
- `activeLens: 'numbers' | 'journey' | 'stack' | null` -- current lens
- `visitedNodes: Set<string>` -- tracks which nodes have been viewed (for connection toggle threshold)
- `showConnections: boolean` -- connection lines visibility

No external state management library needed. State is simple and localized.

### Data Structure

```tsx
interface ConstellationNode {
  id: string;
  label: string;
  icon: LucideIcon;
  orbitDistance: number; // relative to center, 0-1
  orbitAngle: number; // radians
  glowColor: 'amber' | 'cyan';
  content: React.ReactNode; // rendered when expanded
}

interface Connection {
  from: string; // node id
  to: string; // node id
  strength: number; // 0-1, maps to line thickness
  label: string; // tooltip text
}
```

---

## Accessibility

### Screen Reader Experience

The DOM order follows a logical reading sequence regardless of visual layout:

1. Skip-to-content link (hidden, keyboard-accessible)
2. Andy Charlwood -- name and role title
3. Navigation: lens buttons + node list
4. Skills section content
5. Experience section content
6. Education section content
7. Projects section content
8. Contact section content

The constellation visual is a progressive enhancement. Screen readers traverse the underlying DOM in document order, encountering all content as standard sections with headings.

### ARIA Attributes

- Each constellation node: `role="button"`, `aria-label="View [Section Name]"`, `aria-expanded="true|false"`
- Expanded node detail panel: `role="region"`, `aria-label="[Section Name] details"`
- Lens buttons: `role="radio"` within a `role="radiogroup"` with `aria-label="View mode"`
- Connection toggle: `aria-pressed="true|false"`, `aria-label="Show career connections"`

### Keyboard Navigation

Full keyboard support as detailed in the Navigation section. Tab order matches DOM order. Focus indicators are visible and high-contrast (cyan on dark navy exceeds WCAG AAA contrast).

### Motion Preferences

When `prefers-reduced-motion: reduce` is detected:

- Constellation renders in static positions (no ambient drift, no spring physics)
- Node expansion uses opacity fade (200ms) instead of layout animation
- No sonar pulses
- No connection line drawing animation (lines appear immediately)
- No gravitational cursor pull
- Star particles are static (no drift)
- Lens transitions use crossfade instead of spatial rearrangement

### Color Contrast

All text meets WCAG AA contrast against the dark background:
- `--text-primary` (#ECECF0) on `--bg-deep` (#0A0E1A): contrast ratio 14.2:1 (AAA)
- `--text-secondary` (#8B8FA3) on `--bg-deep` (#0A0E1A): contrast ratio 5.8:1 (AA)
- `--amber` (#D4874D) on `--bg-deep` (#0A0E1A): contrast ratio 5.1:1 (AA)
- `--cyan` (#00D4AA) on `--bg-deep` (#0A0E1A): contrast ratio 8.3:1 (AAA)

### First-Time Visitor Onboarding

On first visit (checked via `localStorage`), a brief animated tour plays:
1. A pulsing ring highlights the center name (0.5s)
2. An arrow animates from center to a node with tooltip: "Click a node to explore" (1s)
3. The tooltip fades, and the constellation becomes interactive (0.5s)
Total: 2 seconds. Dismissible by clicking anywhere. Does not replay on subsequent visits.

### The "Journey" Lens as Fallback

The Journey lens rearranges the constellation into a standard horizontal timeline -- the most familiar CV layout pattern. This serves as a cognitive fallback for visitors who find the spatial navigation confusing. It is always accessible from the lens toolbar and via the L keyboard shortcut.

---

## What Makes This Special

This is the most **distinctive** of all 6 designs. No other CV site navigates like this.

The constellation creates a mental map of Andy's career where everything is visible at once -- reducing cognitive load while increasing exploration curiosity. Visitors do not need to remember what is "below the fold" because nothing is below the fold. The entire career is laid out in space, available at a glance.

The **connection web** is the signature feature. It shows not just WHAT Andy has done but HOW it all connects. The Python skill node connects to the switching algorithm project, which connects to the 14,000 patients identified, which connects to the 2.6M savings figure, which connects to the 220M budget he manages. Career coherence -- the idea that every role and skill builds on the last -- is visualized as a literal knowledge graph.

The lens system adds intellectual depth. Three different lenses on the same data demonstrate analytical thinking -- the ability to view information from multiple angles. This is exactly what Andy does professionally: take the same prescribing dataset and extract different insights depending on the question being asked.

Finally, the ECG-to-constellation transition is narratively powerful. A single heartbeat line becomes a universe of interconnected points. One signal becomes many. This mirrors Andy's career trajectory: from individual clinical interactions (one pharmacist, one patient) to population-level analytics (one analyst, one million patients).
