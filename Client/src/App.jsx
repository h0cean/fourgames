import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { userActions } from './store/user-slice';
import { gsDataActions } from './store/gs-data-slice';
import { DEFAULT_THEME } from './themes/index';
import { applyTheme } from './themes/utils';
import Home from './pages/Home';
import Game from './pages/Game';
import DifferentGames from './pages/DifferentGames';

// connecting socket with initial telegram user data
const socket = io('https://fourgames.shiftboro.net/gameserver', {
  path: '/api/',
  auth: { initData: window.Telegram.WebApp.initData },
});

// there is only 1 origin now. its for adding more games in the future
// different games should have different origins to load different components and routs
// like maybe adding a tic-tac-toe game in future or some other game
const origins = {
  1: 'four-in-a-row',
  // 2: 'tic-tac-toe',
  // ...
};

export default function App() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const gsData = useSelector((state) => state.gsData);
  const [game, setGame] = useState();

  //////////////////////
  // setting general initial user data
  //////////////////////
  useEffect(() => {
    const telegramUser = window.Telegram.WebApp.initDataUnsafe.user;
    // setting user profile data from telegram in redux user state
    dispatch(
      userActions.setProfile({
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        username: telegramUser.username,
        userId: telegramUser.id,
      }),
    );

    // setting default language from user's current telegram language
    if (telegramUser.language_code === 'fa') {
      document.documentElement.setAttribute('lang', 'fa');
      document.documentElement.setAttribute('dir', 'rtl');
      i18n.changeLanguage('fa');
    } else {
      document.documentElement.setAttribute('lang', 'en');
      document.documentElement.setAttribute('dir', 'ltr');
      i18n.changeLanguage('en');
    }

    // setting theme to DEFAULT_THEME
    // DEFAULT_THEME is the current telegram theme of user
    applyTheme(DEFAULT_THEME);
    dispatch(userActions.setCurrentTheme({ currentTheme: DEFAULT_THEME }));

    // getting the previous language_code and color_scheme that is saved in telegram CloudStorage
    // it will be saved in CloudStorage when the user changes theme or language from sidebar settings
    window.Telegram.WebApp.CloudStorage.getItems(['language_code', 'color_scheme'], (error, items) => {
      if (error) {
        console.log('Something went wrong when getting data from Telegram CloudStorage!');
        console.log(error);
      } else {
        // if a color_scheme has been set by user previously it will be changed to that instead of DEFAULT_THEME
        if (items.color_scheme && items.color_scheme !== DEFAULT_THEME) {
          applyTheme(items.color_scheme);
          dispatch(userActions.setCurrentTheme({ currentTheme: items.color_scheme }));
        }
        // if a language_code has been set by user previously it will be changed to that instead of telegram language
        if (items.language_code && items.language_code !== telegramUser.language_code) {
          if (items.language_code === 'fa') {
            document.documentElement.setAttribute('lang', 'fa');
            document.documentElement.setAttribute('dir', 'rtl');
            i18n.changeLanguage('fa');
          } else {
            document.documentElement.setAttribute('lang', 'en');
            document.documentElement.setAttribute('dir', 'ltr');
            i18n.changeLanguage('en');
          }
        }
      }
    });
  }, []);

  //////////////////////
  // actions that happens on server emits
  //////////////////////
  useEffect(() => {
    // initial data received from socket server on connection containing users and servers current status
    socket.on('gameServerData', (gameServerData) => {
      console.log('gameServerData', gameServerData);

      dispatch(
        gsDataActions.init({
          photoRoute: gameServerData.photoPath,
          avatars: gameServerData.avatars,
          colors: gameServerData.colors,
          types: gameServerData.types,
          startParamGameId: gameServerData.startParamGameId,
          current: gameServerData.current,
        }),
      );

      // setting user colorId, avatarId and profilePicture (that is stored on the server) in redux user state
      dispatch(userActions.setColorId({ colorId: gameServerData.user.color.id }));
      dispatch(
        userActions.setAvatar({
          avatarId: gameServerData.user.avatar.id,
          avatarSrc: `${gameServerData.photoPath}/${gameServerData.user.avatar.photoPath}`,
        }),
      );
      dispatch(
        userActions.setProfilePic({
          hasProfilePic: gameServerData.user.hasProfilePicture,
          profilePic: gameServerData.user.profilePicture,
        }),
      );

      // deciding what to show user based on his playing state and the link he clicked to open the mini app
      // if he clicked a link with a start param and is not a player in another game, he will be redirected to the game on the start param
      // if he is a player in a game with a same start param or no start param at all, he will be redirected to the game he is an active player at
      // if he has a start param and is a player in another game we will ask which game he wants to go to
      if (
        gameServerData.current.gameId &&
        gameServerData.startParamGameId &&
        gameServerData.current.gameId !== gameServerData.startParamGameId
      ) {
        navigate('/different-games');
      } else {
        const gameId = gameServerData.current.gameId || gameServerData.startParamGameId;
        dispatch(userActions.setIsPlayer({ isPlayer: gameServerData.current.isPlayer }));
        if (gameId === 'canceled') {
          window.Telegram.WebApp.showPopup({
            message: t('Error.gameExist'),
            buttons: [{ text: t('Error.ok') }],
          });
          window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
        } else if (gameId) {
          navigate(`/game#${gameId}`);
        }
      }
    });

    // gamePublicData is received when a user requests to observe a game
    // user will be sent to the requested game
    socket.on('gamePublicData', (gamePublicData) => {
      console.log('gamePublicData', gamePublicData);
      // check if the game user is trying to observe was canceled and has no data
      if (gamePublicData.game.state.gameStateId === 1) {
        window.Telegram.WebApp.showPopup({
          message: t('Error.gameExist'),
          buttons: [{ text: t('Error.ok') }],
        });
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
        navigate('/');
        return;
      }
      setGame(gamePublicData.game);
      const typeId = gamePublicData.game.typeId;
      const gameId = gamePublicData.game.id;
      const originId = gsData.types.find((type) => type.id === typeId).origin;
      // setting gameId inside url hash so that when user refreshes the page we still have access to gameId
      navigate(`/game/${origins[originId]}#${gameId}`);
    });

    // yourCurrentGame is received when a user requests to join or rejoin a game
    // user will be sent to the requested game
    socket.on('yourCurrentGame', (currentGame) => {
      console.log('yourCurrentGame', currentGame);
      setGame(currentGame.game);
      dispatch(userActions.setPlayer({ playerId: currentGame.playerId, isPlayer: true }));
      const typeId = currentGame.game.typeId;
      const gameId = currentGame.game.id;
      const originId = gsData.types.find((type) => type.id === typeId).origin;
      // setting gameId inside url hash so that when user refreshes the page we still have access to gameId
      navigate(`/game/${origins[originId]}#${gameId}`);
    });

    // gameCanceled is received when a game has no players or runs out of time when waiting for players to join
    socket.on('gameCanceled', (data) => {
      console.log('gameCanceled', data);
      window.Telegram.WebApp.showPopup({
        message: t('Error.canceledGame'),
        buttons: [{ text: t('Error.ok') }],
      });
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
      window.Telegram.WebApp.isClosingConfirmationEnabled && window.Telegram.WebApp.disableClosingConfirmation();
      dispatch(userActions.setPlayer({ playerId: '', isPlayer: false }));
      navigate(`/`);
    });

    // alreadyConnected is received when a user connects to socket server from multiple clients at the same time
    // socket.on('alreadyConnected', (data) => {
    //   console.log('alreadyConnected', data);
    //   window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
    //   window.Telegram.WebApp.showPopup(
    //     {
    //       message: t('Error.already'),
    //       buttons: [{ text: t('Error.closeThis') }, { id: 'closeAll', text: t('Error.closeAll') }],
    //     },
    //     (response) => {
    //       if (response === 'closeAll') {
    //         socket.emit('closeAll');
    //       }
    //       window.Telegram.WebApp.close();
    //     },
    //   );
    // });

    // removing events attached to socket when component is closing
    return () => {
      socket.off('gameServerData');
      socket.off('gamePublicData');
      socket.off('yourCurrentGame');
      socket.off('gameCanceled');
      // socket.off('alreadyConnected');
    };
  }, [game, gsData]);

  return (
    <>
      {gsData.isInit ? (
        <>
          <div className='w-full overflow-x-hidden bg-bg-primary text-text-primary'>
            <Routes>
              <Route path='/' element={<Home socket={socket} />} />
              <Route path='/game/*' element={<Game socket={socket} game={game} setGame={setGame} />} />
              <Route path='/different-games' element={<DifferentGames socket={socket} />} />
            </Routes>
          </div>
        </>
      ) : (
        // render loading rings untill socket connects and game server data is set
        <div className='flex h-screen w-screen items-center justify-center p-2'>
          <span className='loading loading-ring w-24 text-bg-button'></span>
        </div>
      )}
    </>
  );
}
