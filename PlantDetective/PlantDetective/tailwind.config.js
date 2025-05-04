/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'plant-green': {
          light: '#4ade80',
          DEFAULT: '#22c55e',
          dark: '#166534',
        },
      },
    },
  },
  plugins: [],
};
