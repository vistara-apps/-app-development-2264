/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(210 36% 98%)',
        accent: 'hsl(171 74% 45%)',
        primary: 'hsl(204 94% 51%)',
        surface: 'hsl(210 36% 96%)',
        'text-primary': 'hsl(222.2 47.4% 11.2%)',
        'text-secondary': 'hsl(210 40% 41%)',
      },
      borderRadius: {
        'lg': '12px',
        'md': '8px',
        'sm': '4px',
      },
      spacing: {
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'xl': '24px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(222, 47%, 11%, 0.08)',
      },
    },
  },
  plugins: [],
}