import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTimer } from 'react-timer-hook';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { userActions } from '../store/user-slice';
import useMainButton from '../hooks/useMainButton';
import HoveringPiece from '../components/four-in-a-row/HoveringPiece';
import Players from '../components/four-in-a-row/Players';
import Scoreboard from '../components/four-in-a-row/Scoreboard';
import TableBoard from '../components/four-in-a-row/TableBoard';
import TablePieces from '../components/four-in-a-row/TablePieces';
import LeaveGame from '../components/common/LeaveGame';

export default function FourInARow({ socket, game, setGame, user }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [table, setTable] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState(0);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [isWaitingForPlay, setIsWaitingForPlay] = useState(false);
  const [players, setPlayers] = useState([]);
  const { minutes, seconds, pause, restart, start } = useTimer({
    expiryTimestamp: new Date((game.state.since + game?.eachMoveTime) * 1000),
    autoStart: game.state.gameStateId === 4,
  });
  const { showMainButton, hideMainButton, enableMainButton, disableMainButton } = useMainButton();
  const [isFinished, setIsFinished] = useState(false);

  //////////////////////
  // setting initial data when a user enters four in a row game (maybe in the middle of the game)
  //////////////////////
  useEffect(() => {
    // if user wants to see the result after the game is finished the data that comes from database is a bit
    // different than the ongoing in game data. so when gameStateId === 5 i convert some of the data to be used here
    if (game.state.gameStateId === 5) {
      // detecting winner. first if a player has 4 pieces in a row is winner and scores does not matter
      // then if all the other players left the game the remaining player is the winner
      // at last the player with the most score is the winner
      let winner = game.players.find((player) => player.hasFourInRowPoint);
      const finishedPlayers = game.players.filter((player) => !player.hasLeft);
      if (!winner && finishedPlayers.length === 1) {
        winner = finishedPlayers[0];
      }
      if (!winner) {
        winner = finishedPlayers.reduce((prev, current) => (prev && prev.score > current.score ? prev : current));
      }
      const players = game.players.map((player) => ({ ...player, isWinner: player.userId === winner.userId }));
      setPlayers(players);

      let plays = [];
      game.plays.forEach((play) => {
        plays.push(play.rows);
      });
      setTable(plays);
      setIsFinished(true);
    }

    // the rest here is for when a user comes to observe or rejoin in the middle of a game
    if (game.state.gameStateId === 5 || isFinished) {
      return;
    }

    setPlayers(
      game.players.map((player, index) => ({
        ...player,
        // this is used to determine when a player timer in 'Players' componet is going up
        isMyTurn: index === game.turnPlayerIndex && game.state.gameStateId > 3,
        // sum of each player turn times
        allPlayTime:
          index === game.turnPlayerIndex
            ? parseInt(Date.now() / 1000 - game.state.since + player.allPlayTime)
            : player.allPlayTime,
      })),
    );

    // deteccting which player turn it is
    if (game.players[game.turnPlayerIndex]?.playerId === user.playerId && game.state.gameStateId > 3) {
      setIsMyTurn(true);
    }

    // updating table with plays that happend before this user joins game
    if (game?.plays && game?.plays.find((element) => element.length !== 0)) {
      setTable(game.plays);
    } else {
      setTable(new Array(game?.boardData?.boardColumns).fill([]));
    }
  }, [game, user, isFinished]);

  // showing telegram MainButton if user is a player in game
  useEffect(() => {
    if (user.isPlayer) {
      window.Telegram.WebApp.enableClosingConfirmation();
      showMainButton(t('FourInARow.drop'));
    }
  }, [showMainButton, user.isPlayer, t('FourInARow.drop')]);

  const handlePlay = useCallback(() => {
    if (isWaitingForPlay || !isMyTurn) return;
    // detecting full column selection
    if (table[selectedColumn].length >= game?.boardData?.boardRows) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
      return;
    }

    setIsWaitingForPlay(true); // state between sending play request and receiving success response
    socket.emit('playerPlay', { move: { col: selectedColumn } }, (response) => {
      if (response.ok) {
        setIsWaitingForPlay(false);
        setIsMyTurn(false);
      } else {
        console.log('Something went wrong!');
        console.log(response);
        setIsWaitingForPlay(false);
      }
    });
  }, [table, selectedColumn, isWaitingForPlay, isMyTurn, game]);

  // handling telegram MainButton events and states
  useEffect(() => {
    if (isMyTurn) {
      window.Telegram.WebApp.MainButton.onClick(handlePlay);
      enableMainButton();
    } else {
      disableMainButton();
    }

    return () => {
      window.Telegram.WebApp.MainButton.offClick(handlePlay);
    };
  }, [isMyTurn, selectedColumn, handlePlay, disableMainButton]);

  //////////////////////
  // actions that happens on server emits
  //////////////////////
  useEffect(() => {
    socket.on('gameStarted', (data) => {
      console.log('gameStarted: ', data);
      start();
    });

    // turn start of a player
    socket.on('playerTurn', (data) => {
      console.log('playerTurn', data);
      if (data.playerId === user.playerId) {
        setIsMyTurn(true);
      } else {
        setIsMyTurn(false);
      }
      // restarting turn timer
      restart(new Date(Date.now() + game.eachMoveTime * 1000));
      setPlayers((prevPlayers) =>
        prevPlayers.map((prevPlayer) => ({
          ...prevPlayer,
          isMyTurn: prevPlayer.playerId === data.playerId,
          allPlayTime: prevPlayer.playerId === data.playerId ? data.allPlayTime : prevPlayer.allPlayTime,
        })),
      );
    });

    // a new play on the board and score changes
    socket.on('newPlay', (data) => {
      console.log('newPlay', data);
      setTable((prevTable) => {
        const newTable = JSON.parse(JSON.stringify(prevTable));
        newTable[data.col].push(data.playerId);
        setTimeout(
          () => {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('rigid');
          },
          140 + (game.boardData.boardRows - newTable[data.col].length + 2) * 50,
        );
        return newTable;
      });

      setPlayers((prevPlayers) =>
        prevPlayers.map((prevPlayer) => ({
          ...prevPlayer,
          score: data.scores.find((element) => element.playerId === prevPlayer.playerId).score,
        })),
      );
    });

    // a player has conceded and left the game
    socket.on('playerLeft', (data) => {
      console.log('playerLeft: ', data);
      setPlayers((prevPlayers) =>
        prevPlayers.map((prevPlayer) => ({ ...prevPlayer, hasLeft: data.userId === prevPlayer.userId })),
      );
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

    socket.on('gameFinished', (data) => {
      console.log('gameFinished: ', data);

      pause();
      setIsMyTurn(false);
      hideMainButton();
      window.Telegram.WebApp.isClosingConfirmationEnabled && window.Telegram.WebApp.disableClosingConfirmation();
      setIsFinished(true);
      setTimeout(() => {
        dispatch(userActions.setPlayer({ playerId: '', isPlayer: false }));
      }, 0); // otherwise the first useEffect will run with isFinished = false

      // detecting winner with rules explained earlier
      let winner = data.players.find((player) => player.hasFourInRowPoint);
      const finishedPlayers = data.players.filter((player) => !player.hasLeft);
      if (!winner && finishedPlayers.length === 1) {
        winner = finishedPlayers[0];
      }
      if (!winner) {
        winner = finishedPlayers.reduce((prev, current) => (prev && prev.score > current.score ? prev : current));
      }
      setPlayers(
        data.players.map((player) => ({
          ...player,
          isMyTurn: false,
          isWinner: player.userId === winner.userId,
        })),
      );
    });

    return () => {
      socket.off('gameStarted');
      socket.off('playerTurn');
      socket.off('newPlay');
      socket.off('playerLeft');
      socket.off('playerConnection');
      socket.off('gameFinished');
    };
  }, [game, user]);

  const handleColumnClick = (column) => () => {
    setSelectedColumn(column);
  };
  const handleTouchMove = (event) => {
    const touch = event.touches[0];
    // get the element that the touchMove is on by the touch clientX and Y
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const touchColumn = element.dataset?.columnId;
    if (touchColumn && parseInt(touchColumn) !== selectedColumn) {
      setSelectedColumn(parseInt(touchColumn));
    }
  };

  return (
    <div className='relative p-3'>
      {game && (
        <div className='flex flex-col items-center gap-2'>
          <Players players={players} />

          <div
            dir='rtl'
            className='mx-auto mt-[var(--size-top-height)] w-fit rounded-xl border-4 border-board sm:border-8 md:border-10'
          >
            <div className='relative -m-px'>
              <TableBoard
                game={game}
                selectedColumn={selectedColumn}
                user={user}
                isMyTurn={isMyTurn}
                handleColumnClick={handleColumnClick}
                handleTouchMove={handleTouchMove}
              />

              {user && players.length > 0 && isMyTurn && !isFinished && (
                <HoveringPiece selectedColumn={selectedColumn} players={players} user={user} />
              )}

              {table.length !== 0 && <TablePieces table={table} game={game} />}
            </div>
          </div>

          {!isFinished && (
            <div className='flex w-full items-start justify-between gap-2'>
              {user.isPlayer && (
                <LeaveGame
                  socket={socket}
                  setGame={setGame}
                  className='mt-2 rounded-lg bg-error p-2 text-text-button'
                />
              )}
              <div className=''>
                {minutes.toLocaleString('en-US', { minimumIntegerDigits: 2 })}:
                {seconds.toLocaleString('en-US', { minimumIntegerDigits: 2 })}
              </div>
            </div>
          )}

          {isFinished && (
            <>
              <Scoreboard players={players} />
              <Link to='/' className='mt-4 flex items-center justify-center rounded-full bg-bg-secondary p-4'>
                <FontAwesomeIcon icon={faHouse} className='text-3xl' />
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
