/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'sans-serif'],
        mono: ['Geist Mono', 'monospace']
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'muted-foreground': 'var(--muted-foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        border: 'var(--border)',
        popover: 'var(--popover)',
        'popover-foreground': 'var(--popover-foreground)',
        muted: 'var(--muted)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        destructive: 'var(--destructive)',
        ring: 'var(--ring)',
        green: '#4ade80',
        red: '#f87171'
      }
    }
  },
  plugins: []
}