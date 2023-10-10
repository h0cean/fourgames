import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: 'en',
    lng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          Home: {
            create: 'Create and Share',
            players: 'Players',
            board: 'Board Size:',
            time: 'Turn Time:',
            seconds: 'Seconds',
            points: 'Points',
            winner: 'Winner',
            x: 'x',
          },
          WaitingForJoin: {
            join: 'Join',
            players: 'Players',
            tap: 'Tap to invite players',
            empty: 'Empty',
          },
          FourInARow: {
            drop: 'Drop',
          },
          LeaveGame: {
            leave: 'Leave',
          },
          Scoreboard: {
            scoreboard: 'Scoreboard',
          },
          DifferentGames: {
            unfinished:
              'You have an unfinished game. Do you wish to resume that game or leave and go to the selected game?',
            leave: 'Leave and go',
            resume: 'Resume',
          },
          LanguageChange: {
            label: 'Language',
          },
          PlayerColorChange: {
            label: 'Player Color',
          },
          AvatarChange: {
            label: 'Avatar',
            profile: 'Set profile picture as avatar',
          },
          ThemeChange: {
            label: 'Theme',
            light: 'Light',
            dark: 'Dark',
          },
          Error: {
            canceledGame: 'Game was canceled.',
            ok: 'OK',
            sure: 'Are you sure?',
            leave: 'Leave Game',
            cancel: 'Cancel',
            already: 'You are already connected from another client! Do you want to close all clients?',
            closeThis: 'Close This',
            closeAll: 'Close All',
            gameExist: 'Game does not exist anymore!',
          },
        },
      },
      fa: {
        translation: {
          Home: {
            create: 'بساز شِیر کن',
            players: 'بازیکنان',
            board: 'اندازه صفحه:',
            time: 'زمان نوبت:',
            seconds: 'ثانیه',
            points: 'امتیاز',
            winner: 'برنده',
            x: 'در',
          },
          WaitingForJoin: {
            join: 'پیوستن',
            players: 'بازیکنان',
            tap: 'اینجا تَپ کن واسه شِیر بازی',
            empty: 'خالی',
          },
          FourInARow: {
            drop: 'بنداز',
          },
          LeaveGame: {
            leave: 'خروج',
          },
          Scoreboard: {
            scoreboard: 'رده بندی',
          },
          DifferentGames: {
            unfinished: 'یه بازی تموم نشده داری. میخوای ادامش بدی یا ولش کنی بری بازی جدید؟',
            leave: 'ولش کن بره',
            resume: 'بریم ادامش',
          },
          LanguageChange: {
            label: 'زبان',
          },
          PlayerColorChange: {
            label: 'رنگ بازیکن',
          },
          AvatarChange: {
            label: 'آواتار',
            profile: 'استفاده از عکس پروفایل',
          },
          ThemeChange: {
            label: 'انتخاب تم',
            light: 'لایت',
            dark: 'دارک',
          },
          Error: {
            canceledGame: 'بازی کنسل شده',
            ok: 'باشه',
            sure: 'مطمئنی؟',
            leave: 'خروج',
            cancel: 'کنسل',
            already: 'You are already connected from another client! Do you want to close all clients?',
            closeThis: 'Close This',
            closeAll: 'Close All',
            gameExist: 'این بازی دیگه وجود نداره!',
          },
        },
      },
    },
  });

export default i18n;
