/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
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
      },
      fontFamily: {
        primary: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        secondary: ['Inter Tight', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0,0,0,0.06)',
        'md': '0 4px 12px rgba(0,0,0,0.08)',
        'lg': '0 8px 24px rgba(0,0,0,0.1)',
      },
      borderRadius: {
        'card': '16px',
      },
    },
  },
  plugins: [],
}
