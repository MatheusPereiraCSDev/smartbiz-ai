import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Base surfaces
        base: '#1E1F2A',
        'base-deep': '#15161C',
        surface: '#25273A',
        'surface-soft': '#2C2E42',
        'surface-line': '#3A3D57',
        // Accent
        accent: {
          DEFAULT: '#7B61FF',
          soft: '#9683FF',
          dim: 'rgba(123, 97, 255, 0.16)',
          line: 'rgba(123, 97, 255, 0.45)',
        },
        ink: {
          DEFAULT: '#F5F5FA',
          muted: '#A9ACC4',
          faint: '#6E7191',
        },
      },
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 20px 60px -15px rgba(0,0,0,0.55)',
        glow: '0 0 0 1px rgba(123,97,255,0.4), 0 0 40px -8px rgba(123,97,255,0.55)',
      },
      keyframes: {
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'spin-slow-reverse': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'modal-in': {
          from: { opacity: '0', transform: 'scale(0.96) translateY(6px)' },
          to: { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '0.85' },
        },
      },
      animation: {
        'spin-slow': 'spin-slow 40s linear infinite',
        'spin-slow-reverse': 'spin-slow-reverse 55s linear infinite',
        'fade-in': 'fade-in 0.25s ease-out',
        'fade-in-up': 'fade-in-up 0.4s ease-out',
        'modal-in': 'modal-in 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-glow': 'pulse-glow 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
