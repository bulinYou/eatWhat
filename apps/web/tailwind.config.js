/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#396a05',
        'primary-container': '#88c057',
        'primary-fixed': '#c5e8a3',
        'on-primary-fixed': '#1a3300',
        secondary: '#8f4e00',
        tertiary: '#b3272e',
        surface: '#f8faf8',
        'surface-container-low': '#f2f4f2',
        'surface-container-lowest': '#ffffff',
        'surface-container-high': '#e6e9e7',
        'surface-variant': '#e8ebe8',
        'on-surface': '#191c1b',
        'on-surface-variant': '#5a635e',
        'outline-variant': '#c2c9b6',
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-lg': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.015em', fontWeight: '600' }],
        'headline-md': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'title-lg': ['1.25rem', { lineHeight: '1.4', letterSpacing: '-0.005em', fontWeight: '600' }],
        'title-md': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['0.9375rem', { lineHeight: '1.5', fontWeight: '400' }],
        'label': ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0.02em', fontWeight: '500' }],
      },
      borderRadius: {
        'sm': '1rem',
        'md': '1.5rem',
        'lg': '2rem',
        'full': '9999px',
      },
      boxShadow: {
        'ambient': '0px 12px 32px rgba(25, 28, 27, 0.06)',
        'ambient-lg': '0px 16px 48px rgba(25, 28, 27, 0.08)',
      },
      spacing: {
        'card': '2rem',
        'section': '3rem',
      },
      backdropBlur: {
        'glass': '20px',
      },
    },
  },
  plugins: [],
}
