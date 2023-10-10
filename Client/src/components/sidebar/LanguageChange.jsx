import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faChevronUp, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

export default function LanguageChange() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleLanguageClick = (selectedLanguage) => () => {
    // setting language and direction of the html based on selectedLanguage by user
    if (selectedLanguage === 'fa') {
      document.documentElement.setAttribute('lang', 'fa');
      document.documentElement.setAttribute('dir', 'rtl');
    }
    if (selectedLanguage === 'en') {
      document.documentElement.setAttribute('lang', 'en');
      document.documentElement.setAttribute('dir', 'ltr');
    }
    i18n.changeLanguage(selectedLanguage);
    // setting language_code on telegram CloudStorage that will override the default telegram language from now on
    window.Telegram.WebApp.CloudStorage.setItem('language_code', selectedLanguage, (error, ok) => {
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
        <FontAwesomeIcon className='text-2xl text-text-secondary' icon={faGlobe} />
        <div className='flex w-full items-center justify-between'>
          <div className=''>{t('LanguageChange.label')}</div>
          <FontAwesomeIcon
            className={`me-2 transition-transform ${open ? 'rotate-180' : ''}`}
            icon={faChevronUp}
          />
        </div>
      </div>
      <div className={`collapse-content`}>
        <div className='flex flex-col gap-2'>
          <button
            onClick={handleLanguageClick('en')}
            className={`flex items-center justify-between rounded-lg p-2 ${
              i18n.language === 'en' ? 'text-active' : ''
            }`}
          >
            English
            {i18n.language === 'en' && <FontAwesomeIcon icon={faCircleCheck} />}
          </button>
          <button
            onClick={handleLanguageClick('fa')}
            className={`flex items-center justify-between rounded-lg p-2 ${
              i18n.language === 'fa' ? 'text-active' : ''
            }`}
          >
            فارسی
            {i18n.language === 'fa' && <FontAwesomeIcon icon={faCircleCheck} />}
          </button>
        </div>
      </div>
    </div>
  );
}
