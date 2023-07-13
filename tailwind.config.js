/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx,jsx}", "./src/**/**/.{html,js,ts,tsx,jsx}"],
  safelist: [
    'bg-danger',
      'bg-success',
      'bg-primary',
      'bg-green-600',
      'bg-pink',
      'bg-warning'
  ],
  theme: {
    extend: {
      fontFamily: {
        lexend: ['LEXEND', 'sans-serif'],
      },
      colors: {
        current: '#555249',
        'success': '#49A078',
        'danger': '#BD1E1E',
        'pink' : '#D88373',
        'warning': '#F6BD60',
        'lightGrey': '#F7EDE2',
        'primary': '#216869'
      }
    },
  },
  plugins: [],
}

