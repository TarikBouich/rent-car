/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{vue,js}"],
  theme: {
    fontFamily: {
      main: ["Space Grotesk", "sans-serif"],
    },
    extend: {
      colors: {
        primary: {
          100: "#3f78e0",
          1: "#F7F7FE",
        },
        green: {
          100: "#8fdcc6",
        },
        red: {
          100: "#eea1a6",
        },
        yellow: {
          100: "#fcd49b",
        },
        white: {
          100: "#FFF",
          50: "#F2F2F2",
        },
        body: {
          100: "#343f52",
          50: "#FEFEFE",
          0: "#60697b",
        },
        blue: {
          100: "#0091BD",
          0: "#1A0CAB",
        },
        gray: {
          100: "#e4e6ef",
          800: "#666",
          30: "#b5b5c3",
          20: "#e5e5e5",
          80: "#4d5156",
          1: "#fafafa",
          0: "#87909e",
        },
        danger: {
          50: "rgba(251, 50, 63, .2)",
          100: "#fb323f",
        },
        info: {
          50: "rgba(3, 169, 244, .2)",
          100: "#03a9f4",
        },
        warning: {
          50: "rgba(255, 171, 0, .2)",
          100: "#ffab00",
        },
        success: {
          100: "#00AB66",
          50: "#d6efe1",
        },
        dark: {
          90: "#1B1E27",
          80: "#17191D",
          70: "#272A33",
          60: "#393D49",
          50: "#4C5160",
          30: "#6B7185",
          20: "#7C8399",
          15: "#8E96AE",
          10: "#A6ADC1",
          0: "#C0C5D2",
          100: "#0091BD",
          1: "#2E323C",
          2: "#282A33",
          3: "#313540",
        },
      },
      boxShadow: {
        card: "0 0.25rem 1.75rem rgba(30, 34, 40, .07)",
      },
      spacing: {
        400: "400px",
        70: "70px",
        450: "450px",
      },
    },
  },
  plugins: [],
};
