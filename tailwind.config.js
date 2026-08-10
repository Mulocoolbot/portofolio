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
        background: {
          DEFAULT: '#ffffff',
          card: 'rgba(255, 255, 255, 0.85)',
          surface: '#f8fafc',
          muted: '#f1f5f9',
          border: '#e2e8f0',
        },
        mono: {
          black: '#09090b',
          dark: '#18181b',
          charcoal: '#27272a',
          gray: '#52525b',
          muted: '#71717a',
          light: '#a1a1aa',
          border: '#e4e4e7',
          subtle: '#f4f4f5',
          white: '#ffffff',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 24s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'glass-light': '0 8px 30px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'glass-hover': '0 14px 40px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.03)',
        'mono-glow': '0 0 25px -5px rgba(0, 0, 0, 0.25)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
