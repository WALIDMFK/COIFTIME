import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0B0B',
        header: '#111111',
        button: '#222222',
        search: '#6B7280',
        searchBg: '#1F1F1F',
        bannerText: '#111827',
        bannerBg: '#FEF3C7',
      },
    },
  },
  plugins: [],
}

export default config
