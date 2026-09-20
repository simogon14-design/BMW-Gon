import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          850: '#0B1220',
          900: '#070B14',
          950: '#04060A',
        },
        imperialGold: {
          light: '#FFF2A3',
          DEFAULT: '#FFD700',
          dark: '#D97706',
          amber: '#F59E0B',
        },
      },
      backdropBlur: {
        '3xl': '64px',
      },
      fontFamily: {
        arabic: ['Tajawal', 'Cairo', 'sans-serif'],
        luxury: ['Cinzel', 'serif'],
        sans: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
