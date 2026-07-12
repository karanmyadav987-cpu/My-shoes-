/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./next-migration/**/*.{js,ts,jsx,tsx,mdx}",
    // Also include root static html for tailwind parser references if compiled locally
    "./index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7C2D12', /* Deep mahogany rust */
          light: '#9A3412',
          dark: '#431407',
        },
        accent: {
          DEFAULT: '#D97706', /* Warm Amber */
          light: '#F59E0B',
          dark: '#B45309',
        },
        cream: {
          DEFAULT: '#FDFBF7', /* Warm off-white background */
          dark: '#F4EFE6',
        },
        ebony: {
          DEFAULT: '#120E0D', /* Soft warm black */
          light: '#1E1614',
        }
      },
      fontFamily: {
        heading: ['var(--font-sora)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      borderRadius: {
        'premium': '16px',
        'button': '8px'
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(67, 20, 7, 0.08)',
        'premium-hover': '0 20px 40px -15px rgba(67, 20, 7, 0.15)',
      }
    },
  },
  plugins: [],
}
