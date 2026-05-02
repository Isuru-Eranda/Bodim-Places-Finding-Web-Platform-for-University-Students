/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          50:  '#FFF7ED',
          100: '#FFEDD5',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
        },
        brown: {
          50:  '#F3E8E2',
          400: '#A07850',
          500: '#8B5E3C',
          600: '#6B3E26',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
