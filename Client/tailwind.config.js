/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  safelist: [
    {
      pattern: /bg-(sky|yellow|green|red|purple|pink)-(400|500|600)/, // You can display all the colors that you need
    },
  ],
  theme: {
    fontFamily: {
      sans: ['iransans'],
    },

    extend: {
      colors: {
        'bg-primary': 'var(--color-bg-primary)',
        'bg-secondary': 'var(--color-bg-secondary)',
        'bg-header': 'var(--color-bg-header)',
        'bg-button': 'var(--color-bg-button)',

        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-button': 'var(--color-text-button)',

        'border-primary': 'var(--color-border-primary)',

        board: 'var(--color-board)',

        active: 'var(--color-active)',
        success: 'var(--color-success)',
        error: 'var(--color-error)',
        warning: 'var(--color-warning)',
      },
      minWidth: {
        7: '1.75rem',
        13: '3.25rem',
        22: '5.5rem',
        '1/2': '50%',
      },
      spacing: {
        13: '3.25rem',
        17.5: '4.375rem',
      },
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
        90: '90',
        95: '95',
        100: '100',
      },
      flex: {
        2: '2 1 0%',
      },
      borderWidth: {
        10: '10px',
      },
      boxShadow: {
        cell: '0 0 0 50px rgba(0, 0, 0, 0.3)',
        pieceInner: 'inset 0 0 5px rgb(0 0 0 / 25%)',
        pieceOuter: '0 0 5px rgb(0 0 0 / 35%)',
        activeShadow: '0 0 50px #fff, -10px 0 70px 15px #f0f, 10px 0 70px 15px #0ff',
      },
      backgroundImage: {
        'hover-wave': 'url(/src/assets/image/wave.png)',
      },
      animation: {
        sidebar: 'sidebar 0.2s ease-in',
        dropBG: 'dropBG 1s infinite linear',
        dropPiece: 'dropPiece var(--drop-piece-duration) ease-in',
        fade: 'fade 0.5s ease-in',
        overlay: 'overlay 0.2s linear',
      },
      keyframes: {
        sidebar: {
          '0%': {
            transform: 'translateX(100%)',
          },
          '100%': {
            transform: 'translateX(0)',
          },
        },
        dropBG: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(calc(var(--size-cell) * 25 / 72))' },
        },
        dropPiece: {
          '0%': {
            transform:
              'translate(calc(var(--size-cell)*var(--col-index)*-1), calc(var(--size-cell)*var(--row-total)*-1))',
          },
          '100%': {
            transform:
              'translate(calc(var(--size-cell)*var(--col-index)*-1), calc(var(--size-cell)*var(--row-index)*-1))',
          },
        },
        fade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        overlay: {
          '0%': { opacity: '0' },
          '100%': { opacity: '0.3' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-rtl'), require('daisyui')],
};
