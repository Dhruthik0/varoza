/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0F1A",
        primary: "#7C3AED",
        accent: "#22D3EE"
      }
    }
  },
  plugins: []
};
