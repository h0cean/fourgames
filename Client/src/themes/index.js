import base from './base';
import dark from './dark';

// setting DEFAULT_THEME from user's current telegram theme
export const DEFAULT_THEME = window.Telegram.WebApp.colorScheme === 'light' ? 'base' : 'dark';

export const themes = {
  base,
  dark,
};
