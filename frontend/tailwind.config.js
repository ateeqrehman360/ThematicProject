/** @type {import('tailwindcss').Config} */
export default {
  // This tells Tailwind to look at all Vue and TS files for styles
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom colors for the TCG project branding
      colors: {
        kinship: {
          primary: '#4f46e5', // indigo-600
          secondary: '#64748b',
        }
      }
    },
  },
  plugins: [],
}