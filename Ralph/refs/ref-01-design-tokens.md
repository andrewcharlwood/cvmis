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

## What NOT to Change

- Boot phase variables (`--matrix-*`, `--terminal-*`)
- ECG phase variables
- Login phase background (`#1E293B` — handled by transition)
- Font declarations (Elvaro, Blumir, Geist Mono, Fira Code already set up correctly)
- Breakpoint values
