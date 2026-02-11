---

## Design Guidance (from /frontend-design)

### Aesthetic Direction

**Tone: Clinical Utilitarian** — This is an NHS-styled patient medical record system. The aesthetic is intentionally institutional: clean, functional, bureaucratic-in-a-charming-way. The humor comes from the deadpan application of clinical form conventions to a personal contact form. No flourishes, no gradients, no decorative frills. The beauty is in the precision of the grid, the crispness of the type hierarchy, and the tongue-in-cheek seriousness of it all.

**What makes it memorable**: The collision between NHS clinical form seriousness and the fact that you are "referring" to a person's contact page. The pre-filled "patient" header, the priority radio buttons with their wry tooltips, the reference number generation — all of this is a joke delivered with a completely straight face.

### Key Design Decisions

**Priority Radio Buttons (urgent/routine/2-week-wait)**

| Priority | Color | Tooltip |
|----------|-------|---------|
| Urgent | Red (`#EF4444`) | "All enquiries are welcome, urgent or not." |
| Routine | NHS Blue (`#005EB8`) | (default, no tooltip needed) |
| Two-Week Wait | Amber (`#F59E0B`) | "NHS cancer referral pathway — this isn't that, but the spirit of promptness applies." |

Each priority option features a colored dot indicator and supports hover tooltips via a tooltip component pattern.

**Form Validation Patterns**

- Real-time validation on blur
- Error messages appear below invalid fields in red (`text-red-600`)
- Disabled submit button until required fields are valid
- Required fields: Referrer Name, Referrer Email
- Email validation uses standard pattern matching
- Organization field is optional

**Design System Constraints (Locked)**

| Token | Value | Tailwind Class |
|-------|-------|----------------|
| NHS Blue | `#005EB8` | `text-pmr-nhsblue` / `bg-pmr-nhsblue` |
| Card border | `1px solid #E5E7EB` | `border-pmr-border` |
| Input border | `1px solid #D1D5DB` | `border-pmr-border-dark` |
| Border radius | `4px` | `rounded` |
| Label font | Inter 500, 13px, gray-600 | `font-inter font-medium text-sm text-gray-600` |
| Mono font | Geist Mono | `font-mono` (reference numbers) |
| Input padding | `8px 12px` | `py-2 px-3` |
| Focus state | NHS blue border + glow | `focus:border-pmr-nhsblue focus:ring-2 focus:ring-pmr-nhsblue/15` |

### Implementation Patterns/Code Snippets

**Priority Option Component Pattern**

```tsx
type Priority = 'urgent' | 'routine' | 'two-week-wait'

const dotColors: Record<Priority, string> = {
  urgent: 'bg-red-500',
  routine: 'bg-pmr-nhsblue',
  'two-week-wait': 'bg-amber-500',
}

const labelColors: Record<Priority, string> = {
  urgent: 'text-red-600',
  routine: 'text-pmr-nhsblue',
  'two-week-wait': 'text-amber-600',
}
```

**Form Input Styling Pattern**

```tsx
// Standard clinical form input
<input
  className="w-full px-3 py-2 border border-pmr-border-dark rounded 
             text-sm text-gray-900 placeholder-gray-400
             focus:outline-none focus:border-pmr-nhsblue 
             focus:ring-2 focus:ring-pmr-nhsblue/15
             transition-all duration-200"
/>

// Label styling
<label className="block text-sm font-medium text-gray-600 mb-1.5 font-inter">
  Field Label
</label>
```

**Reference Number Generation**

```tsx
function generateRefNumber(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const seq = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')
  return `REF-${year}-${month}${day}-${seq}`
}
```

**Form State Management Pattern**

```tsx
interface FormData {
  priority: Priority
  referrerName: string
  referrerEmail: string
  referrerOrg: string
  reason: string
  contactMethod: ContactMethod
}

interface FormErrors {
  referrerName?: string
  referrerEmail?: string
}

// Validation on submit
const validate = (): boolean => {
  const errors: FormErrors = {}
  if (!formData.referrerName.trim()) {
    errors.referrerName = 'Referrer name is required'
  }
  if (!formData.referrerEmail.trim()) {
    errors.referrerEmail = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.referrerEmail)) {
    errors.referrerEmail = 'Please enter a valid email'
  }
  setErrors(errors)
  return Object.keys(errors).length === 0
}
```

**Success State Pattern**

```tsx
// After form submission
<div className="text-center py-8">
  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
  <h3 className="text-lg font-semibold text-gray-900 mb-1">
    Referral sent successfully
  </h3>
  <p className="text-sm text-gray-600 font-mono mb-1">
    Reference: {refNumber}
  </p>
  <p className="text-sm text-gray-500">
    Expected response time: 24-48 hours
  </p>
</div>
```

**Contact Method Radio Pattern**

```tsx
type ContactMethod = 'email' | 'phone' | 'linkedin'

// Radio button with icon
<div className="flex items-center gap-3 p-3 border border-pmr-border-dark rounded 
                cursor-pointer hover:bg-gray-50 transition-colors">
  <input type="radio" className="sr-only" />
  <Mail className="w-4 h-4 text-gray-500" />
  <span className="text-sm text-gray-700">Email</span>
</div>
```