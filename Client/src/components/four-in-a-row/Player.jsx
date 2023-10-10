import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faClock, faCircleCheck, faCircleXmark, faWifi } from '@fortawesome/free-solid-svg-icons';
import { useStopwatch } from 'react-timer-hook';

import Piece from './Piece';
import testAvatar from '../../assets/images/test-avatar.webp';

export default function Player({ player }) {
  const gsData = useSelector((state) => state.gsData);
  const { seconds, minutes, pause, reset } = useStopwatch({
    autoStart: false,
    offsetTimestamp: new Date(Date.now() + player.allPlayTime * 1000),
  });

  useEffect(() => {
    if (player.isMyTurn) {
      reset(new Date(Date.now() + player.allPlayTime * 1000));
    } else {
      pause();
    }
  }, [player.isMyTurn, player.allPlayTime]);

  return (
    <div
      className={`flex h-16 w-full items-center justify-between gap-2 rounded-xl border p-2 ${
        player.isMyTurn ? 'border-bg-button shadow shadow-bg-button' : 'border-border-primary'
      }`}
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
      <div className={`w-full truncate ${player.hasLeft ? 'text-error' : 'text-text-primary'}`}>
        {player.firstName}
      </div>

      <div className='flex h-12 w-5 flex-col items-center gap-2'>
        <FontAwesomeIcon className='text-text-secondary' icon={faStar} />
        <div className=''>{player.score}</div>
      </div>
      <div className='flex h-12 w-10 flex-col items-center gap-2'>
        <FontAwesomeIcon className='text-text-secondary' icon={faClock} />
        <div className='flex items-center'>
          {minutes.toLocaleString('en-US', { minimumIntegerDigits: 2 })}:
          {seconds.toLocaleString('en-US', { minimumIntegerDigits: 2 })}
        </div>
      </div>
      <div className='flex h-12 w-5 flex-col items-center gap-3'>
        <FontAwesomeIcon className='text-text-secondary' icon={faWifi} />
        {player.isConnected ? (
          <FontAwesomeIcon className='text-success' icon={faCircleCheck} />
        ) : (
          <FontAwesomeIcon className='text-error' icon={faCircleXmark} />
        )}
      </div>
    </div>
  );
}
