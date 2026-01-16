/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        surface: '#f0fdfa',    // Teal 50
        primary: '#0f766e',    // Teal 700
        secondary: '#14b8a6',  // Teal 500
        accent: '#99f6e4',     // Teal 200
      },
    },
  },
  plugins: [],
};
