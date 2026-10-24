/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#6C5CE7', dark: '#4A3FD1', soft: '#EDEBFF' },
        accent: '#FF8FA3',
        success: '#22B07D',
        warning: '#F2A93B',
        danger: '#E5484D',
        info: '#3E8BFF',
        bg: '#F5F6FA',
        surface: '#FFFFFF',
        border: '#E4E6EF',
        text: { DEFAULT: '#1F2233', secondary: '#6B7080', disabled: '#A0A4B4' },
      },
      fontFamily: {
        ar: ['"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
        num: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        h1: ['2rem', { lineHeight: '2.5rem', fontWeight: '700' }],
        h2: ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        h3: ['1.125rem', { lineHeight: '1.625rem', fontWeight: '500' }],
        body: ['1rem', { lineHeight: '1.5rem' }],
        'body-sm': ['0.875rem', { lineHeight: '1.25rem' }],
        caption: ['0.75rem', { lineHeight: '1rem' }],
      },
      borderRadius: { xs: '4px', sm: '8px', md: '14px', lg: '20px' },
      boxShadow: {
        sm: '0 1px 2px rgba(31,34,51,0.06)',
        md: '0 6px 16px rgba(31,34,51,0.08)',
        lg: '0 20px 40px rgba(31,34,51,0.12)',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 250ms cubic-bezier(0.2,0.8,0.2,1) both',
        'slide-up': 'slide-up 250ms cubic-bezier(0.2,0.8,0.2,1) both',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
