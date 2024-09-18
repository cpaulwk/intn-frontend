import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: {
          100: 'var(--primary-100)',
          200: 'var(--primary-200)',
          300: 'var(--primary-300)',
        },
        accent: {
          100: 'var(--accent-100)',
          200: 'var(--accent-200)',
        },
        text: {
          100: 'var(--text-100)',
          200: 'var(--text-200)',
        },
        bg: {
          100: 'var(--bg-100)',
          200: 'var(--bg-200)',
          300: 'var(--bg-300)',
        },
      },
    },
  },
  plugins: [],
};
export default config;
