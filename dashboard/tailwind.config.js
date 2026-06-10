/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f7f7fe',
          100: '#dadafc',
          200: '#bcbdf9',
          300: '#9ea0f6',
          400: '#8183f4',
          500: '#6366f1',
          600: '#5457cd',
          700: '#4547a9',
          800: '#363885',
          900: '#282960',
          DEFAULT: '#6366f1',
        },
        surface: {
          ground: '#f9fafb',
          section: '#ffffff',
          card: '#ffffff',
          overlay: '#ffffff',
          border: '#dfe7ef',
          hover: '#f6f9fc',
          0: '#ffffff',
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        green: {
          50: '#f4fcf7',
          500: '#22c55e',
          600: '#1da750',
        },
        red: {
          50: '#fff5f5',
          500: '#ff3d32',
          600: '#d9342b',
        },
        orange: {
          50: '#fff8f3',
          500: '#f97316',
        },
        teal: {
          500: '#14b8a6',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '6px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0,0,0,.06), 0 1px 2px -1px rgba(0,0,0,.06)',
        'card-hover': '0 10px 15px -3px rgba(0,0,0,.08), 0 4px 6px -4px rgba(0,0,0,.05)',
        'elevated': '0 20px 25px -5px rgba(0,0,0,.08), 0 8px 10px -6px rgba(0,0,0,.04)',
      },
      maxWidth: {
        'container': '1100px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.4' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out forwards',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
