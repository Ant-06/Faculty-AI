/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f5ff",
          100: "#dbe6ff",
          200: "#b9cdff",
          300: "#8fabff",
          400: "#6284fd",
          500: "#3f5ff5",
          600: "#2c42e0",
          700: "#2434b5",
          800: "#212e8f",
          900: "#1f2a71",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Sora", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 10px -2px rgba(20, 30, 60, 0.08), 0 1px 2px rgba(20,30,60,0.04)",
        card: "0 4px 20px -4px rgba(20, 30, 60, 0.10)",
      },
    },
  },
  plugins: [],
};
