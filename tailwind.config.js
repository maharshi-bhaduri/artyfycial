/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'background-slide': {
          '0%': { backgroundColor: 'transparent', color: 'gray' },
          '100%': { backgroundColor: 'black', color: 'white' },
        },
      },
      animation: {
        'background-slide': 'background-slide 0.5s forwards',
      },
    },
  },
  plugins: [],
}