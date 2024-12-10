/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/client/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-dark': 'var(--primary-dark)',
        secondary: 'var(--secondary)',
        danger: 'var(--danger)',
        success: 'var(--success)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}