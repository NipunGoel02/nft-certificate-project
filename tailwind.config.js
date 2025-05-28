/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        xl: '1520px',
      },
    },
    extend: {
      colors: {
        primary: {
          50: '#E6FFF9',
          100: '#B3FFE6',
          200: '#80FFD9',
          300: '#4DFFCC',
          400: '#1AFFBF',
          500: '#00BFA6', // Main primary
          600: '#00A693',
          700: '#008D80',
          800: '#00736C',
          900: '#005A59',
        },
        secondary: {
          300: '#FFA07A', // Coral light
          500: '#FF7F50', // Coral
          700: '#E55A30',
        },
        accent: {
          amber: '#FFBF00',
          blue: '#0892D0',
        },
        background: '#F8F9FA',
        card: '#FFFFFF',
      },
      boxShadow: {
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
        'button': '0 4px 6px -1px rgba(0, 191, 166, 0.1), 0 2px 4px -1px rgba(0, 191, 166, 0.06)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
         'float': 'certificateFloat 4s ease-in-out infinite',
        'loading': 'loading 3s infinite',
        'scale-in': 'scaleIn 0.5s ease-out',
      },
      keyframes: {
         certificateFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
          loading: {
          '0%': { width: '0%' },
          '50%': { width: '70%' },
          '100%': { width: '100%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
