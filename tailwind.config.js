/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xxs': '360px',
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
    },
    extend: {
      colors: {
        teal: {
          DEFAULT: '#00897B',
          light: 'rgba(0, 137, 123, 0.08)',
          medium: 'rgba(0, 137, 123, 0.15)',
        },
        coral: {
          DEFAULT: '#FF6B6B',
          light: 'rgba(255, 107, 107, 0.08)',
        },
        heading: '#0F172A',
        text: '#334155',
        muted: '#94A3B8',
        border: '#E2E8F0',
        ecg: {
          green: '#00ff41',
          cyan: '#00e5ff',
          dim: '#3a6b45',
          grey: '#666666',
        },
        pmr: {
          // GP System Dashboard palette
          'bg': '#F0F5F4',
          'surface': '#FFFFFF',
          'sidebar': '#F7FAFA',
          'accent': '#0D6E6E',
          'accent-hover': '#0A8080',
          'text-primary': '#1A2B2A',
          'text-secondary': '#5B7A78',
          'text-tertiary': '#8DA8A5',
          'border': '#D4E0DE',
          'border-light': '#E4EDEB',
          'success': '#059669',
          'amber': '#D97706',
          'alert': '#DC2626',
          'purple': '#7C3AED',
          // Legacy tokens kept for transition (Task 21 cleanup)
          'nhsblue': '#005EB8',
          'content': '#F0F5F4',
          'card': '#FFFFFF',
          'banner': '#334155',
          'green': '#22C55E',
          'red': '#EF4444',
          'text-on-dark': '#FFFFFF',
          'text-on-dark-secondary': '#94A3B8',
          'border-dark': '#D1D5DB',
          'selected-row': '#EFF6FF',
          'alert-bg': '#FEF3C7',
          'alert-border': '#F59E0B',
          'alert-text': '#92400E',
        },
      },
      fontFamily: {
        primary: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        secondary: ['Inter Tight', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
        ui: ['Elvaro Grotesque', 'system-ui', 'sans-serif'],
        'ui-alt': ['Blumir', 'system-ui', 'sans-serif'],
        geist: ['Interval Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        // GP System three-tier shadow system
        'pmr-sm': '0 1px 2px rgba(26,43,42,0.05)',
        'pmr-md': '0 2px 8px rgba(26,43,42,0.08)',
        'pmr-lg': '0 8px 32px rgba(26,43,42,0.12)',
        // Legacy alias
        'pmr': '0 1px 2px rgba(26,43,42,0.05)',
      },
      borderRadius: {
        'card': '8px',
        'card-sm': '6px',
        'login': '12px',
      },
    },
  },
  plugins: [],
}
