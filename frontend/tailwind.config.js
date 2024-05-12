/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "3xl": "0 1px 2px 0 rgb(0,0,0)",
      },
    },
  },
  plugins: [],
};
