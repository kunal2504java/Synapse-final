/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0A0A1A',
          800: '#1A1A2E',
          700: '#16213E',
          600: '#0F3460',
        },
        primary: {
          400: '#00F5D4',
          500: '#00D4B8',
          600: '#00B39C',
        },
        secondary: {
          400: '#9D4EDD',
          500: '#7209B7',
          600: '#560BAD',
        },
        accent: {
          400: '#F72585',
          500: '#B5179E',
          600: '#7209B7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 20px rgba(0, 245, 212, 0.3)',
          },
          '50%': {
            opacity: '.8',
            boxShadow: '0 0 40px rgba(0, 245, 212, 0.6)',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'slide-up': {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(20px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
        },
      },
    },
  },
  plugins: [],
};