import type { Config } from 'tailwindcss'

const config: Config = {
  important: true,
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    backgroundSize: {
      auto: 'auto',
      cover: 'cover',
      contain: 'contain',
      '100%': '100%'
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      colors: {
        primary: '#1e315c',
        secondary: '#c7bdb3',
        icons: {
          default: '#ceba84',
          active: '#1e315c',
          nav: '#ab9e91'
        },
        cream: {
          100: '#e5e7eb',
          200: '#f1f5f8',
          300: '#f9fafb',
          400: '#fafafa',
          500: '#ffffff',
          600: '#ffffff'
        }
      }
    }
  },
  plugins: []
}
export default config
