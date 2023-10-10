import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrush, faChevronUp, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';

import { userActions } from '../../store/user-slice';
import { applyTheme } from '../../themes/utils';

export default function ThemeChange() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const user = useSelector((state) => state.user);
  const currentTheme = user.currentTheme;

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleThemeClick = (newTheme) => () => {
    // apply 'base' or 'dark' theme based on newTheme selected by user
    applyTheme(newTheme);
    // set the selected theme to the user redux state
    dispatch(userActions.setCurrentTheme({ currentTheme: newTheme }));
    // setting color_scheme on telegram CloudStorage that will override the default telegram theme from now on
    window.Telegram.WebApp.CloudStorage.setItem('color_scheme', newTheme, (error, ok) => {
      if (error) {
        console.log('Something went wrong when setting data to Telegram CloudStorage!');
        console.log(error);
      } else if (ok) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      }
    });
  };

  return (
    <div className='collapse rounded-none border-b border-border-primary'>
      <input type='checkbox' onChange={handleToggle} checked={open} />
      <div className='collapse-title flex w-full items-center gap-4 px-3 py-2'>
        <FontAwesomeIcon className='text-2xl text-text-secondary' icon={faBrush} />
        <div className='flex w-full items-center justify-between'>
          <div className=''>{t('ThemeChange.label')}</div>
          <FontAwesomeIcon
            className={`me-2 transition-transform ${open ? 'rotate-180' : ''}`}
            icon={faChevronUp}
          />
        </div>
      </div>
      <div className={`collapse-content`}>
        <div className='flex flex-col gap-2'>
          <button
            onClick={handleThemeClick('base')}
            className={`flex items-center justify-between rounded-lg p-2 ${
              currentTheme === 'base' ? 'text-active' : ''
            }`}
          >
            {t('ThemeChange.light')}
            {currentTheme === 'base' && <FontAwesomeIcon icon={faCircleCheck} />}
          </button>
          <button
            onClick={handleThemeClick('dark')}
            className={`flex items-center justify-between rounded-lg p-2 ${
              currentTheme === 'dark' ? 'text-active' : ''
            }`}
          >
            {t('ThemeChange.dark')}
            {currentTheme === 'dark' && <FontAwesomeIcon icon={faCircleCheck} />}
          </button>
        </div>
      </div>
    </div>
  );
}
