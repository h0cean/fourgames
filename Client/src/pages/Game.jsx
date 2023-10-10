import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import WaitingForJoin from './WaitingForJoin';
import FourInARow from './FourInARow';

export default function Game({ socket, game, setGame }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    // expand mini app when user is going to the game page or waiting for game page
    !window.Telegram.WebApp.isExpanded && window.Telegram.WebApp.expand();

    if (!game) {
      // getting gameId from url so that when user refreshes the page we still have access to gameId
      let gameId = window.location.hash.replace('#', '');

      // deciding whether to send observeGame or rejoinGame request based on the user.isPlayer state
      // server sends the game object in 'gamePublicData' for observing or 'yourCurrentGame' for rejoining
      if (user.isPlayer) {
        socket.emit('rejoinGame', { gameId: gameId }, (response) => {
          if (!response.ok) {
            console.log('Something went wrong!');
            console.log(response);
            return;
          }
        });
      } else {
        socket.emit('observeGame', { gameId: gameId }, (response) => {
          if (!response.ok) {
            window.Telegram.WebApp.showPopup({ message: t('Error.gameExist') });
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
            navigate('/');
          }
        });
      }
    }
  }, [socket, game, user.isPlayer]);

  // user will be redirected to 'WaitingForJoin' or a game (only four-in-a-row in this case) when the game object is received
  return (
    <>
      {game && game.state.gameStateId === 2 && <WaitingForJoin socket={socket} game={game} setGame={setGame} />}
      {game && game.state.gameStateId > 2 && (
        <Routes>
          <Route
            path='four-in-a-row'
            element={<FourInARow socket={socket} game={game} setGame={setGame} user={user} />}
          />
          {/* other games can be added here and based on their origin will be redirected to automatically */}
        </Routes>
      )}
    </>
  );
}
