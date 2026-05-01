/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F5A623',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        accent: {
          orange: '#E67E22',
          green: '#27AE60',
          red: '#E74C3C',
        },
        dark: {
          100: '#ECF0F1',
          200: '#BDC3C7',
          300: '#95A5A6',
          400: '#7F8C8D',
          500: '#34495E',
          600: '#2C3E50',
          700: '#233140',
          800: '#1A252F',
          900: '#0F1419',
        }
      },
      fontFamily: {
        sans: ['Noto Sans SC', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
