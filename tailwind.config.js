/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-gold': '#D4AF37',
        'off-white': '#F8F9FA',
        'dark-charcoal': '#1A1A1A',
        'error-red': '#E53E3E',
        'success-green': '#38A169',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F3E5AB 0%, #D4AF37 100%)',
      },
      fontFamily: {
        serif: ['"Cinzel"', 'serif'],
        sans: ['"Inter"', '"Outfit"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}
