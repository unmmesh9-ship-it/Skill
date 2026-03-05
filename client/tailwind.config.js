/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // Admin Theme
        'admin-primary': '#1e3a8a', // Dark Blue
        'admin-secondary': '#0d9488', // Teal
        'admin-accent': '#f97316', // Orange
        
        // Employee Theme
        'employee-primary': '#7c3aed', // Purple
        'employee-secondary': '#10b981', // Green
        'employee-bg': '#f3f4f6', // Light Gray
      },
    },
  },
  plugins: [],
}
