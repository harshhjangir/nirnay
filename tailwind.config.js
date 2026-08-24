/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#080D14',
          secondary: '#0D141D',
          tertiary: '#0B1119',
        },
        surface: {
          DEFAULT: '#121B25',
          elevated: '#17222D',
          subtle: '#0F1720',
          border: 'rgba(255, 255, 255, 0.09)',
          'border-active': 'rgba(255, 255, 255, 0.18)',
        },
        brand: {
          primary: '#28D7A0',
          hover: '#22bd8c',
          cyan: '#55B8D9',
          amber: '#F2B84B',
          red: '#F06B6B',
          glow: 'rgba(40, 215, 160, 0.12)',
        },
        text: {
          primary: '#F4F7F8',
          secondary: '#AAB7C2',
          muted: '#71808C',
        },
        status: {
          safe: '#28D7A0',
          info: '#55B8D9',
          warning: '#F2B84B',
          critical: '#F06B6B',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', '"Manrope"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        'card': '14px',
        'card-lg': '18px',
      },
      boxShadow: {
        'institutional': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 2px 6px -1px rgba(0, 0, 0, 0.3)',
        'subtle-glow': '0 0 24px -4px rgba(40, 215, 160, 0.12)',
        'critical-glow': '0 0 24px -4px rgba(240, 107, 107, 0.15)',
        'amber-glow': '0 0 24px -4px rgba(242, 184, 75, 0.12)',
      }
    },
  },
  plugins: [],
}
