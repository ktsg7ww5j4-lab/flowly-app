/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },
      colors: {
        flow: {
          rose: "#fce7f3",
          blush: "#fbcfe8",
          plum: "#861657",
          violet: "#5b2a86",
          mint: "#d1fae5",
          sky: "#e0f2fe",
        },
      },
    },
  },
  plugins: [],
};
