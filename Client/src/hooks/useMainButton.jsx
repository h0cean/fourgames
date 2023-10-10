import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { themes } from '../themes';

export default function useMainButton() {
  const user = useSelector((state) => state.user);
  const currentTheme = user.currentTheme;

  const handleShow = useCallback(
    (text) => {
      window.Telegram.WebApp.MainButton.setParams({
        text: text,
        color: themes[currentTheme].buttonBG,
        text_color: themes[currentTheme].buttonText,
        is_visible: true,
        is_active: true,
      });
    },
    [currentTheme],
  );

  const handleHide = useCallback(() => {
    window.Telegram.WebApp.MainButton.hide();
  }, []);

  const handleEnable = useCallback(() => {
    window.Telegram.WebApp.MainButton.setParams({
      color: themes[currentTheme].buttonBG,
      text_color: themes[currentTheme].buttonText,
      is_active: true,
    });
  }, [currentTheme]);

  const handleDisable = useCallback(() => {
    window.Telegram.WebApp.MainButton.setParams({
      color: themes[currentTheme].secondaryBG,
      text_color: themes[currentTheme].secondaryText,
      is_active: false,
    });
  }, [currentTheme]);

  return {
    showMainButton: handleShow,
    hideMainButton: handleHide,
    enableMainButton: handleEnable,
    disableMainButton: handleDisable,
  };
}
