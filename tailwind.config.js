/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    screens: {
      md: "750px",
      lg: "1000px",
      check: "1200px",
      xl: "1504px",
      xxl: "2500px",
    },
    extend: {
      fontFamily: {
        sans: ["Open Sans", "sans-serif"],
      },
      fontWeight: {
        extrablack: "1000",
      },
      colors: {
        "heading-color": "#182C62",
        "header-color": "#025FEB",
        "menu-font-color": "#FFFFFF",
        "even-rows-color": "#F6F7F7",
        "table-header-border-color": "#E4EDF2",
        "table-footer-font-color": "#4B5C68",
        "footer-background-color": "#F6F7F7",
      },
      height: {
        60: "60px",
        25: "25px",
        70: "70px",
        37: "37px",
      },
      width: {
        90: "90%",
        53: "53px",
        76: "76px",
        280: "280px",
        340: "340px",
      },
      spacing: {
        60: "60px",
        110: "110px",
      },
    },
  },
  plugins: [],
};
