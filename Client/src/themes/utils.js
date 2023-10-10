import { themes } from './index';
// import { useDispatch } from 'react-redux';
// import { userActions } from '../store/user-slice';

export const mapTheme = (variables) => {
  return {
    // '--color-black': variables.black || '',
    // '--color-white': variables.white || '',
    // '--color-confirm': variables.confirm || '',
    // '--color-confirm-hover': variables.confirmHover || '',
    // '--color-reject': variables.reject || '',
    // '--color-reject-hover': variables.rejectHover || '',
    // '--color-primary-200': variables.primary200 || '',
    // '--color-primary-300': variables.primary300 || '',
    // '--color-primary-400': variables.primary400 || '',
    // '--color-primary-500': variables.primary500 || '',
    // '--color-primary-700': variables.primary700 || '',
    // '--color-gray-100': variables.gray100 || '',
    // '--color-gray-300': variables.gray300 || '',
    // '--color-gray-500': variables.gray500 || '',
    // '--color-secondary': variables.secondary || '',
    // '--color-secondary-gradiant': variables.secondaryGradiant || '',
    // '--color-success': variables.success || '',

    // '--color-bg-body': variables.bodyBG || '',
    // '--color-bg-primary': variables.primaryBG || '',
    // '--color-bg-secondary': variables.secondaryBG || '',
    // '--color-bg-darker': variables.darkerBG || '',
    // '--color-bg-dark-input': variables.darkInputBG || '',
    // '--color-bg-gradiant-from': variables.gradiantFromBG || '',
    // '--color-bg-gradiant-to': variables.gradiantToBG || '',
    // '--color-bg-board': variables.boardBG || '',

    // '--color-text-primary': variables.primaryText || '',
    // '--color-text-secondary': variables.secondaryText || '',
    // '--color-text-darker': variables.darkerText || '',
    // '--color-text-title': variables.titleText || '',
    // '--color-text-disabled': variables.disabledText || '',
    // '--color-text-green': variables.greenText || '',
    // '--color-text-red': variables.redText || '',
    // '--color-text-light': variables.lightText || '',
    // '--color-text-lighter': variables.lighterText || '',

    // '--color-perfect': variables.perfect || '',
    // '--color-badge': variables.badge || '',

    // '--color-border-light': variables.lightBorder || '',
    // '--color-border-dark': variables.darkBorder || '',

    '--color-bg-primary': variables.primaryBG || '',
    '--color-bg-secondary': variables.secondaryBG || '',
    '--color-bg-header': variables.headerBG || '',
    '--color-bg-button': variables.buttonBG || '',

    '--color-text-primary': variables.primaryText || '',
    '--color-text-secondary': variables.secondaryText || '',
    '--color-text-button': variables.buttonText || '',

    '--color-border-primary': variables.primaryBorder || '',

    '--color-board': variables.board || '',

    '--color-active': variables.active || '',
    '--color-success': variables.success || '',
    '--color-error': variables.error || '',
    '--color-warning': variables.warning || '',
  };
};

export const extend = (extending, newTheme) => {
  return { ...extending, ...newTheme };
};

export const applyTheme = (theme) => {
  // const dispatch = useDispatch();
  // dispatch(userActions.setCurrentTheme({ currentTheme: theme }));

  const themeObject = mapTheme(themes[theme]);
  if (!themeObject) return;
  const root = document.documentElement;

  Object.keys(themeObject).forEach((property) => {
    if (property === 'name') {
      return;
    }

    root.style.setProperty(property, themeObject[property]);
  });
};
