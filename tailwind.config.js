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
          DEFAULT: '#06070d',
          card: '#0d0e1a',
          surface: '#131427',
          border: '#212342',
        },
        cyber: {
          cyan: '#00f2fe',
          blue: '#4facfe',
          purple: '#8a2be2',
          pink: '#f72585',
          emerald: '#10b981',
          gold: '#fbbf24',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 18s linear infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glowPulse: {
          '0%': { opacity: '0.4', filter: 'blur(20px)' },
          '100%': { opacity: '0.8', filter: 'blur(35px)' },
        }
      },
      boxShadow: {
        'neon-cyan': '0 0 25px -5px rgba(0, 242, 254, 0.5)',
        'neon-purple': '0 0 25px -5px rgba(138, 43, 226, 0.5)',
        'neon-pink': '0 0 25px -5px rgba(247, 37, 133, 0.5)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
