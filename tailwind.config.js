/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/dashboard/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'custom-bg': '#1a1d2e',
        'custom-surface': '#252945',
        'custom-card': '#313552',
        'custom-accent': '#8a74f9',
        'custom-text': '#e0e0e0',
        'custom-text-secondary': '#a0a0b0',
        'custom-hover': 'var(--custom-hover-bg)',
        'custom-orange': '#f7931e',
      },
    },
  },
  plugins: [],
}