/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,html,css}',
  ],
  theme: {
    extend: {
      colors: {
        'rose-soft': '#FFDEE9',
        'violet-soft': '#B5FFFC',
        'accent': '#7C3AED',
      },
      fontFamily: {
        sugar: ['Poppins', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}

