/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    fontFamily: {
      main: ["Space Grotesk", "sans-serif"],
    },
    extend: {
      screens: {
        'xs': '480px',
      },
      colors: {
        primary: {
          90: '#1a56db',
          100: '#1e40af',
        },
        sidebar: '#2E233C', 
        sidenav: {
          item: '#907095',
          hover: '#e2b4e9',
        },
        white: '#ffffff',
        green: {
          100: "#8fdcc6",
        },
        red: {
          100: "#eea1a6",
        },
        yellow: {
          100: "#fcd49b",
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
          50: '#f0fdf4',
          100: '#059669',
        },
        dark: {
          90: "#1B1E27",
          80: "#17191D",
          70: "#272A33",
          60: "#393D49",
          50: '#374151',
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
      maxHeight: {
        'modal': 'calc(100vh - 200px)',
      },
    },
  },
  plugins: [],
};
