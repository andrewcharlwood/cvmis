# Reference: Patient Banner + Sidebar + Navigation

> Extracted from goal.md — Patient Banner, Left Sidebar, and Navigation sections. These are the persistent UI chrome that defines the clinical system feel.

---

## Patient Banner (Persistent Top Chrome)

The patient banner is the most recognizable element of any PMR system. It spans the full viewport width above the main content area and provides constant demographic context.

### Full Banner (80px height, visible at top of page)

```
+---------------------------------------------------------------------------+
| CHARLWOOD, Andrew (Mr)                        Active (green dot)  Open to opps.    |
| DOB: 14/02/1993  |  NHS No: 2211810  |  Norwich, NR1                     |
| 07795553088  |  andy@charlwood.xyz    [Download CV] [Email] [LinkedIn]    |
+---------------------------------------------------------------------------+
```

### Content Mapping

| PMR Field | Actual Content | Notes |
|-----------|---------------|-------|
| Patient name | CHARLWOOD, Andrew (Mr) | Surname first, comma-separated — exactly as in clinical systems |
| DOB | 14/02/1993 | DD/MM/YYYY format (UK clinical standard) |
| NHS Number | 221 181 0 | Andy's GPhC registration number formatted like an NHS number (with spaces). Hover tooltip: "GPhC Registration Number" |
| GP Practice | Self-Referred | Tongue-in-cheek — Andy referred himself to this record |
| Address | Norwich, NR1 | Abbreviated postcode area |
| Phone | 07795553088 | Clickable (tel: link) |
| Email | andy@charlwood.xyz | Clickable (mailto: link) |
| Status | Active (green dot) | Like the "registered" status in a PMR |
| Badge | Open to opportunities | Styled as a clinical banner tag (blue background, white text, small pill shape) |

### Action Buttons (top right of banner)

| Button | PMR Equivalent | Action |
|--------|---------------|--------|
| Download CV | Print Summary | Downloads PDF version of CV |
| Email | Send Letter | Opens mailto: link |
| LinkedIn | External Link | Opens LinkedIn profile in new tab |

Buttons are styled as small outlined rectangles with NHS blue text and 1px NHS blue border, 4px radius. On hover: filled NHS blue background with white text.

### Condensed Banner (48px, sticky after scroll)

When the user scrolls past 100px of content, the banner smoothly condenses to show only the essential information on a single line:

```
CHARLWOOD, Andrew (Mr) | NHS No: 2211810 | Active (green dot)     [Download CV] [Email]
```

The condensed banner sticks to the top of the viewport (`position: sticky`) with a `z-index` above the content area but below modals/alerts.

---

## Left Sidebar — Clinical Navigation

The sidebar replicates the dark navigation panel found in EMIS Web and similar clinical systems. It provides category-based access to different "record views."

**Width:** 220px (desktop), dark blue-gray (`#1E293B`) background.

### Navigation Items

**IMPORTANT:** Sidebar labels use CV-friendly terms, NOT clinical jargon. The clinical metaphor lives in the LAYOUT of each view, not the labels.

| Icon | Label | View Layout Style | Description |
|------|-------|-------------------|-------------|
| `ClipboardList` | Summary | Patient summary screen | Demographics, active items, current skills, recent role |
| `FileText` | Experience | Consultation journal layout | Reverse-chronological journal of roles with H/E/P format |
| `Pill` | Skills | Medications table layout | Skills table with proficiency dosages and frequency |
| `AlertTriangle` | Achievements | Problems list layout | Challenges resolved and ongoing, with traffic lights |
| `FlaskConical` | Projects | Investigation results layout | Project outcomes with status badges |
| `FolderOpen` | Education | Attached documents layout | Certificates and qualifications |
| `Send` | Contact | Referral form layout | Contact/message form styled as clinical referral |

### Styling

- Each item: 44px height, 16px left padding, icon (18px, `lucide-react`) + label in Inter 500, 14px
- Default state: white text at 70% opacity, transparent background
- Hover state: white text at 100% opacity, background `rgba(255,255,255,0.08)`
- Active state: white text at 100%, NHS blue left border (3px), background `rgba(255,255,255,0.12)`, label in Inter 600
- A thin horizontal separator line (`1px solid rgba(255,255,255,0.1)`) appears between "Summary" and "Consultations" (separating the overview from the detail views)

### Sidebar Footer

At the bottom of the sidebar, in small text (Inter 400, 11px, `#64748B`):
```
Session: A.CHARLWOOD
Logged in: [current time]
```
This updates with the actual current time on mount, reinforcing the "logged in" metaphor.

### Sidebar Header

At the top, above the navigation items, a small logo or system name:
```
CareerRecord PMR
v1.0.0
```
In Inter 500, 13px, white at 50% opacity. Styled like the "EMIS Web" branding that appears in the top-left of the real system.

---

## Navigation

### Primary Navigation: Left Sidebar

The sidebar is always visible on desktop — this is how clinical systems work. There is no floating nav, no hamburger menu on desktop, and no scroll-based navigation. The sidebar provides persistent, direct access to any record section.

### Keyboard Shortcuts

| Sidebar Item | View Layout | Shortcut |
|-------------|-------------|----------|
| Summary | Patient summary | `Alt+1` |
| Experience | Consultation journal | `Alt+2` |
| Skills | Medications table | `Alt+3` |
| Achievements | Problems list | `Alt+4` |
| Projects | Investigation results | `Alt+5` |
| Education | Attached documents | `Alt+6` |
| Contact | Referral form | `Alt+7` |

### URL Hash Routing

Each sidebar item updates the URL hash (`#summary`, `#experience`, `#skills`, `#achievements`, `#projects`, `#education`, `#contact`) for direct linking. On page load, the app reads the hash and navigates to the corresponding view.

### Breadcrumb

A breadcrumb appears at the top of the main content area:

```
Patient Record > Consultations > Interim Head, Population Health
```

The breadcrumb updates as the user navigates deeper (e.g., expanding a consultation). Clicking "Patient Record" returns to Summary. Clicking "Consultations" collapses any expanded entries and shows the full journal list. The breadcrumb is styled in Inter 400, 13px, gray-400, with chevron separators.

### Secondary Navigation: Within-View Interactions

- **Summary:** Clicking "View Full List" or "View Full Record" links navigates to the corresponding sidebar section.
- **Consultations:** Expand/collapse individual entries. "Linked consultations" in Problems view can deep-link to specific consultation entries.
- **Medications:** Category tabs (Active, Clinical, PRN) within the view. Click to expand prescribing history.
- **Problems:** Click to expand. "Linked consultations" navigate to Consultations view.
- **Investigations:** Click to expand results.
- **Documents:** Click to expand preview.
- **Referrals:** No sub-navigation.

---

## Design Guidance (from /frontend-design)

### Aesthetic Direction

**Clinical Institutional Precision** — The NHS Patient Administration System (PAS) header bar, faithfully reproduced as personal branding. This is not a "medical theme" website. It is a clinical system UI that happens to contain career data instead of patient data. The fidelity to real NHS IT systems (EMIS Web, SystmOne, Lorenzo) is the entire point.

- **Tone**: Utilitarian, institutional, information-dense. No decoration. No gradients. No shadows. The beauty is in the data density, the pipe separators, the monospaced identifiers, the surname-first convention, the green status dot.
- **Typography Discipline**:
  - Inter at 600 weight for the patient name — the anchor element
  - Geist Mono for structured identifiers (NHS Number, DOB) — monospaced data feels like it came from a database
  - Inter at normal weight for demographic text
  - The pipe character `|` as a data separator is a deliberate NHS PAS convention

### Design System Tokens

| Token | Value | Usage |
|-------|-------|-------|
| NHS Blue | `#005EB8` | Primary accent, buttons, active states, borders |
| Banner Background | `#334155` (slate-700) | Patient banner background — exact EMIS Web header shade |
| Sidebar Background | `#1E293B` | Dark navigation panel |
| Content Background | `#F5F7FA` | Main content area |
| Border | `#E5E7EB` | 1px solid borders |
| Border Radius | `4px` | All UI elements |
| Green Status | `#22C55E` | Active status dot |
| Font Text | `Inter` | All text content |
| Font Data | `Geist Mono` | Monospaced identifiers |

### Key Design Decisions

1. **220px Sidebar Width**: Fixed, always visible on desktop. No hamburger menu. This is how clinical systems work — persistent direct access.

2. **Alt+1-7 Keyboard Shortcuts**: Each sidebar item has a keyboard shortcut for power users. Arrow key navigation and `/` for search focus.

3. **CV-Friendly Navigation Labels**: Not clinical jargon. The metaphor lives in the layout, not the labels:
   - Summary (ClipboardList icon)
   - Experience (FileText)
   - Skills (Pill)
   - Achievements (AlertTriangle)
   - Projects (FlaskConical)
   - Education (FolderOpen)
   - Contact (Send)

4. **Scroll-Triggered Banner Condensation**: 
   - Full banner: 80px height with three rows (name, demographics, contact/actions)
   - Condensed: 48px sticky after 100px scroll, single line
   - 200ms smooth transition
   - IntersectionObserver for performance

5. **Navigation Item States**:
   - Default: white text at 70% opacity, transparent background
   - Hover: white text at 100%, background `rgba(255,255,255,0.08)`
   - Active: white text at 100%, 3px NHS blue left border, background `rgba(255,255,255,0.12)`, Inter 600 weight

6. **Interface Materialization Animations** (PMRInterface):
   - Patient banner slides down (200ms ease-out)
   - Sidebar slides from left (250ms ease-out, 50ms delay)
   - Content fades in (300ms, 100ms delay after sidebar)
   - View switching is INSTANT — no crossfade or slide between views

7. **Mobile Adaptations**:
   - Banner collapses to minimal: `CHARLWOOD, A (Mr) | 2211810 | dot`
   - Overflow menu for actions
   - Bottom nav bar (56px height with safe area padding)
   - Sidebar becomes icon-only (56px) with tooltips on tablet

### Implementation Patterns

#### PatientBanner Component Structure

```tsx
// Main container with IntersectionObserver sentinel
<>
  <div ref={sentinelRef} className="h-0 w-full absolute top-0" aria-hidden="true" />
  <header
    className={`
      sticky top-0 z-40 w-full
      bg-pmr-banner border-b border-slate-600
      transition-all duration-200 ease-out
      ${shouldCondense ? 'h-12' : 'h-20'}
    `}
    role="banner"
  >
    {shouldCondense ? <CondensedBanner /> : <FullBanner />}
  </header>
</>
```

#### useScrollCondensation Hook

```tsx
export function useScrollCondensation(options: UseScrollCondensationOptions = {}) {
  const { threshold = 100 } = options
  const [isCondensed, setIsCondensed] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        setIsCondensed(!entry.isIntersecting)
      },
      {
        rootMargin: `-${threshold}px 0px 0px 0px`,
        threshold: 0,
      }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [threshold])

  return { isCondensed, sentinelRef }
}
```

#### ClinicalSidebar Navigation Items

```tsx
const navItems: NavItem[] = [
  { id: 'summary', label: 'Summary', icon: <ClipboardList size={18} /> },
  { id: 'consultations', label: 'Experience', icon: <FileText size={18} /> },
  { id: 'medications', label: 'Skills', icon: <Pill size={18} /> },
  { id: 'problems', label: 'Achievements', icon: <AlertTriangle size={18} /> },
  { id: 'investigations', label: 'Projects', icon: <FlaskConical size={18} /> },
  { id: 'documents', label: 'Education', icon: <FolderOpen size={18} /> },
  { id: 'referrals', label: 'Contact', icon: <Send size={18} /> },
]

// Item styling pattern
<button
  className={`
    w-full h-[44px] px-4 flex items-center gap-3
    font-inter text-[14px] font-medium
    transition-all duration-150
    ${isActive 
      ? 'text-white bg-white/[0.12] border-l-[3px] border-pmr-nhsblue font-semibold' 
      : 'text-white/70 hover:text-white hover:bg-white/[0.08] border-l-[3px] border-transparent'
    }
  `}
>
  <span className="w-[18px] h-[18px]">{icon}</span>
  <span>{label}</span>
</button>
```

#### PMRInterface Layout

```tsx
// Main layout structure
<div className="flex h-screen overflow-hidden">
  {/* Fixed sidebar */}
  <ClinicalSidebar 
    activeView={activeView} 
    onViewChange={handleViewChange}
    isTablet={isTablet}
  />
  
  {/* Main content area */}
  <div className="flex-1 flex flex-col min-w-0">
    {/* Sticky patient banner */}
    <PatientBanner isMobile={isMobile} isTablet={isTablet} />
    
    {/* Scrollable content */}
    <main className="flex-1 overflow-y-auto bg-pmr-content p-6">
      {/* View content renders here */}
    </main>
  </div>
</div>
```

#### Action Button Pattern

```tsx
// Outlined buttons that fill on hover
<button
  className="
    px-3 py-1.5 
    text-pmr-nhsblue text-sm font-medium
    border border-pmr-nhsblue rounded-[4px]
    transition-all duration-150
    hover:bg-pmr-nhsblue hover:text-white
  "
>
  Download CV
</button>
```

### Mobile Considerations

- **Banner**: Shows only name (truncated), NHS number, and status dot
- **Overflow Menu**: Three-dot menu reveals hidden actions (Download CV, Email, LinkedIn)
- **Bottom Nav**: 56px fixed bottom bar with safe area padding for notched devices
- **Touch Targets**: All interactive elements minimum 44px for accessibility

### Accessibility Requirements

- All navigation items keyboard accessible
- Active state has visual indicator (NHS blue left border)
- Reduced motion support: disable animations when `prefers-reduced-motion` is set
- Focus visible states on all interactive elements
- ARIA labels for icon-only buttons

---

## Additional Implementation Notes (from Agent Analysis)

### PatientBanner Component Refinements

#### Animation Improvements
- Replace raw CSS `transition-all duration-200` with Framer Motion's `AnimatePresence` and `motion.div` for smoother layout animations
- Enable cross-fade content between full and condensed banner states
- Use `motion.div` with `initial`, `animate`, `exit` props for content swapping

#### Badge Styling
- Current: `rounded-sm` — Change to true pill shape: `rounded-full` for "Open to opportunities" badge
- Blue pill shape per NHS design system

#### NHS Number Tooltip
- Replace native `title` attribute with custom styled tooltip
- Use Framer Motion for controlled hover reveal
- Tooltip text: "GPhC Registration Number"

#### Mobile Overflow Menu
- Current: raw `useState` toggle with no animation
- Use `AnimatePresence` for enter/exit animations
- Three-dot menu button triggers slide-down panel

#### Action Button Hover States
```tsx
// Outlined buttons with NHS blue that fill on hover
className="
  px-3 py-1.5 
  text-[#005EB8] text-sm font-medium
  border border-[#005EB8] rounded-[4px]
  transition-all duration-150
  hover:bg-[#005EB8] hover:text-white
"
```

### ClinicalSidebar Keyboard Navigation

#### Alt+1-7 Shortcuts Implementation
```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.altKey && e.key >= '1' && e.key <= '7') {
      const index = parseInt(e.key) - 1
      const view = navItems[index]
      if (view) onViewChange(view.id)
    }
    if (e.key === '/') {
      e.preventDefault()
      searchInputRef.current?.focus()
    }
  }
  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [onViewChange])
```

#### Arrow Key Navigation
- Up/Down arrows navigate between sidebar items
- Focus trap within sidebar when using keyboard
- Visual focus indicator matches hover state

### PMRInterface Layout Structure

#### Materialization Animation Sequence
```tsx
// Staggered entrance animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
}

// Patient banner: slides down (200ms ease-out)
const bannerVariants = {
  hidden: { y: -80, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.2, ease: 'easeOut' }
  }
}

// Sidebar: slides from left (250ms ease-out, 50ms delay)
const sidebarVariants = {
  hidden: { x: -220, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.25, ease: 'easeOut', delay: 0.05 }
  }
}

// Content: fades in (300ms, 100ms delay after sidebar)
const contentVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3, delay: 0.15 }
  }
}
```

#### View Switching Performance
- Views switch INSTANTLY — no crossfade or slide between views
- Content updates immediately on hash change
- No transition/animation between different view components
- Only initial materialization has animation

### Breadcrumb Component Pattern

```tsx
interface BreadcrumbProps {
  currentView: ViewId
  expandedItem?: { name: string; type: string }
}

// View name mapping (CV-friendly names)
const viewLabels: Record<ViewId, string> = {
  summary: 'Summary',
  consultations: 'Experience',
  medications: 'Skills',
  problems: 'Achievements',
  investigations: 'Projects',
  documents: 'Education',
  referrals: 'Contact'
}

// Styling: Inter 400, 13px, gray-400
// Chevron separators using Lucide ChevronRight
// Clickable links navigate back
```

### Mobile Bottom Navigation

```tsx
// 56px height with safe area padding
<div className="fixed bottom-0 left-0 right-0 h-14 bg-pmr-sidebar border-t border-slate-700 pb-safe">
  <div className="flex justify-around items-center h-full px-4">
    {navItems.map((item) => (
      <button
        key={item.id}
        className={`
          flex flex-col items-center gap-1
          ${isActive ? 'text-pmr-nhsblue' : 'text-white/60'}
        `}
      >
        {item.icon}
        <span className="text-[10px]">{item.label}</span>
      </button>
    ))}
  </div>
</div>
```

### TypeScript Types Reference

```tsx
// ViewId type for navigation
export type ViewId = 
  | 'summary' 
  | 'consultations' 
  | 'medications' 
  | 'problems' 
  | 'investigations' 
  | 'documents' 
  | 'referrals'

// Patient data structure
export interface Patient {
  name: string              // 'CHARLWOOD, Andrew (Mr)'
  displayName: string       // 'Andrew Charlwood'
  dob: string              // '14/02/1993'
  nhsNumber: string        // '221 181 0'
  nhsNumberTooltip: string // 'GPhC Registration Number'
  address: string          // 'Norwich, NR1'
  phone: string
  email: string
  linkedin: string
  status: 'Active' | 'Inactive'
  badge?: string           // 'Open to opportunities'
}
```
