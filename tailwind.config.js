/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        baloo: ['"Baloo 2"', 'cursive', 'sans-serif'],
        reading: ['"Be Vietnam Pro"', 'sans-serif']
      }
    },
  },
  plugins: [],
}
