/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    fontFamily: {
      sans: ['iransans'],
    },

    extend: {
      colors: {
        // bg: 'var(--tg-theme-bg-color)',
        // button: 'var(--tg-theme-button-color)',
        // 'button-text': 'var(--tg-theme-button-text-color)',
        // hint: 'var(--tg-theme-hint-color)',
        // link: 'var(--tg-theme-link-color)',
        // 'secondary-bg': 'var(--tg-theme-secondary-bg-color)',
        // text: 'var(--tg-theme-text-color)',

        // 'bg-body': 'var(--color-bg-body)',
        // 'bg-primary': 'var(--color-bg-primary)',
        // 'bg-secondary': 'var(--color-bg-secondary)',
        // 'bg-darker': 'var(--color-bg-darker)',
        // 'bg-dark-input': 'var(--color-bg-dark-input)',
        // 'bg-gradiant-from': 'var(--color-bg-gradiant-from)',
        // 'bg-gradiant-to': 'var(--color-bg-gradiant-to)',
        // 'bg-board': 'var(--color-bg-board)',

        // 'text-primary': 'var(--color-text-primary)',
        // 'text-secondary': 'var(--color-text-secondary)',
        // 'text-darker': 'var(--color-text-darker)',
        // 'text-title': 'var(--color-text-title)',
        // 'text-disabled': 'var(--color-text-disabled)',
        // 'text-green': 'var(--color-text-green)',
        // 'text-red': 'var(--color-text-red)',
        // 'text-light': 'var(--color-text-light)',
        // 'text-lighter': 'var(--color-text-lighter)',

        // perfect: 'var(--color-perfect)',
        // badge: 'var(--color-badge)',

        // 'border-light': 'var(--color-border-light)',
        // 'border-dark': 'var(--color-border-dark)',

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
        highLowNextCardRight: 'highLowNextCardRight 0.4s linear',
        highLowNextCardLeft: 'highLowNextCardLeft 0.4s linear',
        highLowFlipCard: 'highLowFlipCard 0.5s linear',
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
        // dropBG: {
        //   '0%': { 'background-position-y': 0 },
        //   '100%': { 'background-position-y': 'calc(var(--size-cell) * 25 / 72)' },
        // },
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
        highLowNextCardRight: {
          '0%': {
            right: '50%',
            transform: 'translateX(50%)',
            top: '25%',
            width: '8rem',
            height: '12rem',
          },
          '100%': {
            right: '0',
            transform: 'translateX(0)',
            top: '0',
            width: '2.5rem',
            height: '3.5rem',
          },
        },
        highLowNextCardLeft: {
          '0%': {
            left: '50%',
            transform: 'translateX(-50%)',
            top: '25%',
            width: '8rem',
            height: '12rem',
          },
          '100%': {
            left: '0',
            transform: 'translateX(0)',
            top: '0',
            width: '2.5rem',
            height: '3.5rem',
          },
        },
        highLowFlipCard: {
          '0%': {
            transform: 'rotateY(180deg)',
          },
          '100%': {
            transform: 'rotateY(0)',
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
