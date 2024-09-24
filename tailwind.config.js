/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{vue,js}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#000',
          50: '#333'
        }
      }
    },
  },
  plugins: [],
}

