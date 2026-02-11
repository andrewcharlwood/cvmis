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
