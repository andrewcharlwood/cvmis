# Reference: Task 1 — Design Tokens and Tailwind Config

## Overview

Update the design system from the dark-sidebar NHS Blue palette to the GP System concept's light teal palette. The concept reference is `References/GPSystemconcept.html`.

## CSS Custom Properties (`src/index.css`)

Add/update these variables in the PMR section (keep boot/ECG/login variables unchanged):

```css
/* GP System Dashboard tokens */
--bg: #F0F5F4;
--surface: #FFFFFF;
--sidebar-bg: #F7FAFA;
--text-primary: #1A2B2A;
--text-secondary: #5B7A78;
--text-tertiary: #8DA8A5;
--accent: #0D6E6E;
--accent-hover: #0A8080;
--accent-light: rgba(10,128,128,0.08);
--accent-border: rgba(10,128,128,0.18);
--amber: #D97706;
--amber-light: rgba(217,119,6,0.08);
--amber-border: rgba(217,119,6,0.18);
--success: #059669;
--success-light: rgba(5,150,105,0.08);
--success-border: rgba(5,150,105,0.18);
--alert: #DC2626;
--alert-light: rgba(220,38,38,0.08);
--alert-border: rgba(220,38,38,0.18);
--border: #D4E0DE;
--border-light: #E4EDEB;
--sidebar-width: 272px;
--topbar-height: 48px;
--radius: 8px;
--radius-sm: 6px;
--shadow-sm: 0 1px 2px rgba(26,43,42,0.05);
--shadow-md: 0 2px 8px rgba(26,43,42,0.08);
--shadow-lg: 0 8px 32px rgba(26,43,42,0.12);
--font-body: var(--font-ui);
--font-mono: 'Geist Mono', 'Fira Code', monospace;
```

## Tailwind Config (`tailwind.config.js`)

Update the `extend` section:

### Colors
```js
colors: {
  'pmr-bg': '#F0F5F4',
  'pmr-surface': '#FFFFFF',
  'pmr-sidebar': '#F7FAFA',
  'pmr-accent': '#0D6E6E',
  'pmr-accent-hover': '#0A8080',
  'pmr-text-primary': '#1A2B2A',
  'pmr-text-secondary': '#5B7A78',
  'pmr-text-tertiary': '#8DA8A5',
  'pmr-border': '#D4E0DE',
  'pmr-border-light': '#E4EDEB',
  'pmr-success': '#059669',
  'pmr-amber': '#D97706',
  'pmr-alert': '#DC2626',
  'pmr-purple': '#7C3AED',
  // Keep pmr-nhsblue for backward compat during transition
  'pmr-nhsblue': '#005EB8',
  // Keep pmr-content as fallback
  'pmr-content': '#F0F5F4',
}
```

### Shadows
```js
boxShadow: {
  'pmr-sm': '0 1px 2px rgba(26,43,42,0.05)',
  'pmr-md': '0 2px 8px rgba(26,43,42,0.08)',
  'pmr-lg': '0 8px 32px rgba(26,43,42,0.12)',
  // Keep old pmr shadow as alias during transition
  'pmr': '0 1px 2px rgba(26,43,42,0.05)',
}
```

### Border Radius
```js
borderRadius: {
  'card': '8px',    // was 4px — now 8px per concept
  'card-sm': '6px', // inner elements
  'login': '12px',  // login card exception
}
```

## Existing Tokens to Replace/Update

The Tailwind config and CSS already have tokens from the old PMR design. Task 1 needs to UPDATE these, not just add new ones alongside:

**Existing Tailwind shadow tokens (replace with new three-tier system):**
- `pmr`: `'0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)'` → replace with `pmr-sm`
- `pmr-hover`: `'0 2px 4px rgba(0,0,0,0.06), 0 8px 16px rgba(0,0,0,0.04)'` → replace with `pmr-md`
- `pmr-banner`: `'0 2px 8px rgba(0,0,0,0.12)'` → remove (no banner in new design)

**Existing Tailwind color tokens (keep during transition, Task 21 cleans up):**
- `pmr-nhsblue: '#005EB8'` — keep for login screen (still uses NHS blue)
- `pmr-content: '#F5F7FA'` → update to `pmr-content: '#F0F5F4'` (new bg color)
- `pmr-sidebar: '#1E293B'` → update to `pmr-sidebar: '#F7FAFA'` (light sidebar)

**Existing CSS custom properties (in `--pmr-*` namespace):**
- Previous iterations added `--pmr-*` variables. The new tokens use shorter names (e.g., `--bg`, `--surface`, `--accent`). Add the new tokens AND keep `--pmr-*` aliases during transition so existing components don't break before they're rebuilt.

**Existing border-radius tokens:**
- `card: '4px'` → update to `card: '8px'`
- `login: '12px'` — keep unchanged

## What NOT to Change

- Boot phase variables (`--matrix-*`, `--terminal-*`)
- ECG phase variables
- Login phase background (`#1E293B` — handled by transition)
- Font declarations (Elvaro, Blumir, Geist Mono, Fira Code already set up correctly)
- Breakpoint values
