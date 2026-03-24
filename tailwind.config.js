/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sky: {
          light: '#f0f9ff',
          pastel: '#93c5fd',
          deep: '#60a5fa',
        },
        mint: {
          light: '#f0fdf8',
          pastel: '#a7f3d0',
          deep: '#6ee7b7',
        },
        teal: {
          pastel: '#99f6e4',
        },
      },
      fontFamily: {
        jakarta: ["Plus Jakarta Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
