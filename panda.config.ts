import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  preflight: true,
  include: ['./src/**/*.{js,jsx,ts,tsx}', './pages/**/*.{js,jsx,ts,tsx}'],
  exclude: [],
  theme: {
    extend: {
      keyframes: {
        fadein: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pop: {
          '0%': { transform: 'scale(1)', boxShadow: 'var(--box-shadow)' },
          '100%': {
            transform: 'scale(var(--scale))',
            boxShadow: 'var(--box-shadow-picked-up)',
          },
        },
      },
    },
  },
  outdir: 'styled-system',
  jsxFramework: 'react',
})
