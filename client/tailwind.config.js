/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        playora: {
          50: '#f0f4ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#0b132b',
        },
        cyber: {
          cyan: '#00f5ff',
          purple: '#b026ff',
          pink: '#ff007f',
          yellow: '#ffe600',
          dark: '#0d1117',
          card: '#161b22',
          border: '#30363d'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -3px rgba(0, 245, 255, 0.4)',
        'glow-purple': '0 0 25px -3px rgba(176, 38, 255, 0.4)',
        'glow-pink': '0 0 25px -3px rgba(255, 0, 127, 0.4)',
        '3d-light': '0 12px 24px -6px rgba(0, 0, 0, 0.08), 0 4px 8px -2px rgba(0, 0, 0, 0.04)',
        '3d-dark': '0 20px 30px -10px rgba(0, 0, 0, 0.6), 0 0 15px 1px rgba(110, 86, 207, 0.15)',
        'card-3d': '0 30px 60px -12px rgba(0,0,0,0.25), 0 18px 36px -18px rgba(0,0,0,0.3)'
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'tilt': 'tilt 10s infinite linear'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.85, transform: 'scale(1.02)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
