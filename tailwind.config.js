/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Light theme design tokens (dashboard)
        canvas: '#F1F5F9',
        card: '#FFFFFF',
        surface: '#F8FAFC',
        'primary-blue': '#2563EB',
        'primary-blue-hover': '#1D4ED8',
        'primary-blue-light': '#EFF6FF',
        'border-light': '#E2E8F0',
        'text-dark': '#1E293B',
        'text-mid': '#475569',
        'text-muted': '#94A3B8',

        // Sensor semantic accents (preserved)
        'modis-amber': '#F59E0B',
        'viirs-cyan': '#06B6D4',
        'candidate-violet': '#7C3AED',
        'valid-green': '#10B981',
        'cloud-gray': '#64748B',
        'swath-slate': '#475569',

        // Legacy dark tokens (kept for landing page)
        'canvas-dark': '#111827',
        'card-dark': '#192234',
        'text-heading': '#F8FAFC',
        'text-body': '#CBD5E1',
        'border-soft': 'rgba(148,163,184,0.14)',
      },
      lineHeight: { relaxed: '1.65' },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.06)',
        'panel': '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.05)',
      },
    },
  },
  plugins: [],
}

