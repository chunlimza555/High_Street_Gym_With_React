
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'promo-banner': "url('../public/bg.jpg')", // Adjust the path based on the project structure
      }
    },
  },
  plugins: [
    require('daisyui')
  ],
};
