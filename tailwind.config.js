/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{vue,js}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#000',
          90: '#292e39',
          70: '#3c414b',
          50: '#323742'
        },
        secondary: {
          100: '#5c7cf8'
        }
      },
      fontFamily: {
        mulish: ['Mulish', 'sans-serif'], // Add the Sora font
      },
    },
  },
  plugins: [],
}

