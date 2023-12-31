/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: { 'nazirlik': '#1d458a'},
      inset: { '1.6' : '9%' }
    }
  },
  plugins: [],
}

