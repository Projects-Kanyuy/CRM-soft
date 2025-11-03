const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // We can keep slate and other colors for utility purposes
        slate: colors.slate,
        violet: colors.violet,
        
        // Define our custom theme colors
        'theme-primary-text': colors.slate[900],
        'theme-primary-bg': colors.slate[100],
        'theme-accent': colors.violet[500],
        'theme-accent-hover': colors.violet[600],
        'theme-background': colors.slate[50],
        
        // Status colors
        'status-won': colors.green[500],
        'status-lost': colors.red[500],
        'status-proposal': colors.amber[500],
      },
    },
  },
  plugins: [],
}