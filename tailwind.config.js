/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#111827',
        card: '#192234',
        'modis-amber': '#F59E0B',
        'viirs-cyan': '#22D3EE',
        'candidate-violet': '#A78BFA',
        'valid-green': '#34D399',
        'cloud-gray': '#64748B',
        'swath-slate': '#475569',
        'text-heading': '#F8FAFC',
        'text-body': '#CBD5E1',
        'border-soft': 'rgba(148,163,184,0.14)',
      },
      lineHeight: { relaxed: '1.65' },
    },
  },
  plugins: [],
}
