/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          primary: '#c9a962',
          bright: '#e8d5a3',
          muted: '#8b7355',
          deep: '#9a7b4f',
        },
        dark: {
          bg: '#0a0805',
          card: '#120f0c',
          sidebar: '#070604',
          input: '#1a1510',
          hover: '#211c16',
        },
        text: {
          white: '#ffffff',
          light: '#e6dfd5',
          muted: '#998f82',
          gold: '#c9a962',
        }
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}