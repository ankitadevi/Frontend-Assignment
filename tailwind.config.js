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
        brand: {
          50: '#eef6ff',
          100: '#d9ebfe',
          200: '#bcdcfd',
          300: '#8ec6fc',
          400: '#58a6f8',
          500: '#3184f2',
          600: '#1b66e5',
          700: '#144ec9',
          800: '#1541a3',
          900: '#173981',
          950: '#102450',
        },
      },
    },
  },
  plugins: [],
}
