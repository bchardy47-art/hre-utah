import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#f0f4f9',
          100: '#d9e4f0',
          200: '#b3c9e1',
          300: '#7da4c8',
          400: '#4e7eaf',
          500: '#326096',
          600: '#264c7a',
          700: '#1e3a5f',
          800: '#172d4a',
          900: '#101f35',
          950: '#0a1422',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #101f35 0%, #1e3a5f 50%, #172d4a 100%)',
      },
    },
  },
  plugins: [],
}

export default config
