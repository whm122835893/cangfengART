/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,vue}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        neu: {
          bg: '#e0e5ec',
          'bg-light': '#e8ecf1',
          'bg-dark': '#d1d9e0',
          'text-primary': '#4a5568',
          'text-secondary': '#718096',
          'text-muted': '#a0aec0',
          'shadow-light': 'rgba(255, 255, 255, 0.7)',
          'shadow-dark': 'rgba(174, 186, 204, 0.5)',
        },
        accent: {
          blue: '#4A90D9',
          'blue-light': '#6DB3F2',
          pink: '#d4758a',
          'pink-light': '#e8a0b4',
          magenta: '#c44569',
          orange: '#e09060',
          'orange-light': '#f0b080',
          green: '#70b080',
          'green-light': '#90cfa0',
        },
        functional: {
          success: '#70b080',
          danger: '#e06060',
          tech: '#6090c0',
        },
      },
      fontFamily: {
        sans: ['PingFang SC', 'Roboto', 'Helvetica Neue', 'sans-serif'],
        mono: ['SF Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      borderRadius: {
        'card': '18px',
        'btn': '18px',
        'sm-card': '16px',
        'lg-card': '20px',
      },
      spacing: {
        'navbar': '48px',
        'bottom-nav': '64px',
      },
      fontWeight: {
        'normal': '500',
        'medium': '600',
        'semibold': '600',
        'bold': '700',
      },
    },
  },
  plugins: [],
};
