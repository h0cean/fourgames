import { Fragment, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark, faWifi } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useTimer } from 'react-timer-hook';

import Header from '../components/header/Header';
import testAvatar from '../assets/images/test-avatar.webp';
import Piece from '../components/four-in-a-row/Piece';
import useMainButton from '../hooks/useMainButton';
import LeaveGame from '../components/common/LeaveGame';

export default function WaitingForJoin({ socket, game, setGame }) {
  const { t } = useTranslation();
  const user = useSelector((state) => state.user);
  const { minutes, seconds, totalSeconds } = useTimer({
    expiryTimestamp: new Date(game.state.exp * 1000),
  });
  const [players, setPlayers] = useState([]);
  const { showMainButton, hideMainButton } = useMainButton();
  const gsData = useSelector((state) => state.gsData);

  useEffect(() => {
    setPlayers(game.players);
  }, [game]);

  // handle joining game when telegram MainButton is clicked
  // using useCallback to change the function that is binded to telegram MainButton onClick event
  const handleJoin = useCallback(() => {
    const sendingData = { gameId: game.id };
    socket.emit('joinGame', sendingData, (response) => {
      if (!response.ok) {
        console.log('Something went wrong!');
        console.log(response);
        return;
      }
    });
  }, [game.id]);

  // handle appending or removing MainButton click event based on user.isPlayer
  useEffect(() => {
    if (!user.isPlayer) {
      window.Telegram.WebApp.isClosingConfirmationEnabled && window.Telegram.WebApp.disableClosingConfirmation();
      // append 'handleJoin' function to telegram MainButton onClick event and show MainButton if user is not a player of this game
      showMainButton(t('WaitingForJoin.join'));
      window.Telegram.WebApp.MainButton.onClick(handleJoin);
    } else {
      window.Telegram.WebApp.enableClosingConfirmation();
      hideMainButton();
    }

    return () => {
      // remove 'handleJoin' function from telegram MainButton onClick event when user.isPlayer state changes
      window.Telegram.WebApp.MainButton.offClick(handleJoin);
      hideMainButton();
    };
  }, [user.isPlayer, handleJoin, showMainButton, hideMainButton, t('WaitingForJoin.join')]);

  //////////////////////
  // actions that happens on server emits
  //////////////////////
  useEffect(() => {
    // new player joins game and is added to the players state
    socket.on('playerJoinedGame', (data) => {
      console.log('playerJoinedGame', data);
      setPlayers((prevPlayers) => [...prevPlayers, data.player]);
    });

    // a player leaves game and is removed from the players state
    socket.on('playerLeft', (data) => {
      console.log('playerLeft: ', data);
      setPlayers((prevPlayers) => prevPlayers.filter((player) => player.userId !== data.userId));
    });

    // a player connection status (isConnected) is changed
    socket.on('playerConnection', (data) => {
      console.log('playerConnection: ', data);
      setPlayers((prevPlayers) =>
        prevPlayers.map((prevPlayer) => ({
          ...prevPlayer,
          isConnected: prevPlayer.userId === data.userId ? data.isConnected : prevPlayer.isConnected,
        })),
      );
    });

    // game is ready to get started
    socket.on('countingDown', (data) => {
      console.log('countingDown: ', data);
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      // setting game object with the new gameStateId that will be handled in the 'Game' component
      setGame(data);
    });

    // removing events attached to socket when component is closing
    return () => {
      socket.off('playerJoinedGame');
      socket.off('playerLeft');
      socket.off('countingDown');
    };
  }, [socket]);

  const handleInviteClick = () => {
    window.Telegram.WebApp.switchInlineQuery(`${game.typeId}/${game.playersCount}`, ['users', 'groups']);
    window.Telegram.WebApp.close();
  };

  return (
    <>
      <Header socket={socket} />
      <div className='p-4'>
        <div className='mx-auto flex w-full max-w-lg flex-col items-center gap-4 rounded-2xl bg-bg-primary'>
          <div className='flex w-full flex-col items-center gap-2'>
            <div
              className='radial-progress bg-bg-secondary text-bg-button'
              style={{ '--value': (totalSeconds / game.joinTime) * 100, '--size': '8rem' }}
            >
              <span dir='ltr' className='countdown text-2xl text-text-primary'>
                <span style={{ '--value': minutes }}></span>:<span style={{ '--value': seconds }}></span>
              </span>
            </div>
          </div>
          <div className='w-full'>{`${t('WaitingForJoin.players')} (${players.length}/${game.playersCount})`}</div>
          <div className='flex w-full flex-col gap-4 rounded-xl bg-bg-secondary p-2 shadow'>
            {players?.map((player) => (
              <div
                key={player.userId}
                className='flex h-16 w-full items-center gap-4 rounded-xl border p-2 shadow'
              >
                <img
                  src={`${gsData.photoRoute}/${player.avatar.photoPath}`}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = testAvatar;
                  }}
                  className='h-12 w-12 rounded-full'
                />
                <Piece colorCode={player.color.tailwind} />
                <div className='w-full truncate'>{player.firstName}</div>
                <div className='ms-auto flex w-5 shrink-0 flex-col gap-2'>
                  <FontAwesomeIcon className='text-text-secondary' icon={faWifi} />
                  {player.isConnected ? (
                    <FontAwesomeIcon className='text-success' icon={faCircleCheck} />
                  ) : (
                    <FontAwesomeIcon className='text-error' icon={faCircleXmark} />
                  )}
                </div>
              </div>
            ))}
            {[...Array(game.playersCount - players.length)].map((element, index) => (
              <Fragment key={index}>
                {user.isPlayer ? (
                  <button
                    onClick={handleInviteClick}
                    className='h-16 w-full rounded-xl border-4 border-dashed border-border-primary p-2'
                  >
                    {t('WaitingForJoin.tap')}
                  </button>
                ) : (
                  <div className='flex h-16 w-full items-center justify-center rounded-xl border-4 border-dashed border-border-primary p-2'>
                    {t('WaitingForJoin.empty')}
                  </div>
                )}
              </Fragment>
            ))}
          </div>
          {user.isPlayer && (
            <LeaveGame
              socket={socket}
              setGame={setGame}
              className='mt-2 w-1/2 rounded-lg bg-error p-2 text-text-button'
            />
          )}
        </div>
      </div>
    </>
  );
}
