/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tailwind scans these files for class names
  content: [
    './index.html',
    './modules/**/*.html',
    './partials/**/*.html',
    './js/**/*.js'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans"', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif']
      },
      colors: {
        page:        '#f2f6f9',
        ink:         '#1b2a3b',
        body:        '#2b3a4a',
        muted:       '#5d6b79',
        subtle:      '#6b7785',
        placeholder: '#8a96a3',
        line:        '#d3dce5',
        link:        '#1f5f8b',
        primary: {
          DEFAULT: '#3b7ca9',
          hover:   '#336d96'
        },
        // Portal screens (frontdesk and others)
        brand: {
          DEFAULT: '#0f5a73',
          hover:   '#0b4a5f',
          soft:    '#e8f0f9',
          muted:   '#d8e4ef'
        },
        // Staff pages (profile, leave): green actions and highlights
        accent: {
          DEFAULT: '#1e5f48',
          hover:   '#174c3a',
          soft:    '#e7f3ee'
        }
      }
    }
  },
  plugins: []
};