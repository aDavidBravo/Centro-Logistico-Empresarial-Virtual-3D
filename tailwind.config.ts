import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'Geist Mono', 'ui-monospace', 'monospace'],
        display: ['Orbitron', 'Rajdhani', 'sans-serif'],
      },
      colors: {
        bg: { 0: '#03060d', 1: '#070d1a', 2: '#0c1426' },
        cyan: { glow: '#00f0ff', dim: '#0891b2' },
        magenta: { glow: '#ff2bd6' },
        amber: { glow: '#ffb020' },
        success: '#22ffaa',
        danger: '#ff3860',
      },
      boxShadow: {
        glow: '0 0 12px rgba(0,240,255,0.55), 0 0 32px rgba(0,240,255,0.25)',
        'glow-magenta': '0 0 12px rgba(255,43,214,0.55)',
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(0,240,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.06) 1px, transparent 1px)',
        scanlines: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 3px)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.4s ease-in-out infinite',
        scan: 'scan 6s linear infinite',
        flicker: 'flicker 4s linear infinite',
      },
      keyframes: {
        pulseGlow: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.55' } },
        scan: { '0%': { backgroundPosition: '0 0' }, '100%': { backgroundPosition: '0 100vh' } },
        flicker: { '0%,98%,100%': { opacity: '1' }, '99%': { opacity: '0.7' } },
      },
    },
  },
  plugins: [],
} satisfies Config;
