/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // ChadWallet dark palette (sampled from store screenshots)
        bg: '#0A0D12', // app background (near-black navy)
        surface: '#141A22', // cards / inputs
        surface2: '#1C242E', // elevated chips / pills
        border: '#232B35',
        primary: {
          DEFAULT: '#22E06B', // ChadWallet bright green (buy / up / accent)
          dark: '#15C257',
          fg: '#06140B', // text on green buttons
        },
        danger: {
          DEFAULT: '#F6465D', // sell / down red
          dark: '#D63A4E',
        },
        text: {
          DEFAULT: '#FFFFFF',
          secondary: '#8B95A1', // muted gray labels
          tertiary: '#5B6573',
        },
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
};
