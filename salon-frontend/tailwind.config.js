/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#fdf3f5',
          100: '#fae5ea',
          200: '#f5cfd8',
          300: '#ecabba',
          400: '#e07c97',
          500: '#d05579',
          600: '#c2476a',
          700: '#a33459',
          800: '#882e4f',
          900: '#722947',
          DEFAULT: '#c2476a',
          foreground: '#ffffff',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'Noto Sans Arabic', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
