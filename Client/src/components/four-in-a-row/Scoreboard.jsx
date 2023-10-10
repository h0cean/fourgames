import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faUser, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import testAvatar from '../../assets/images/test-avatar.webp';
import Piece from './Piece';

export default function Scoreboard({ players }) {
  const { t } = useTranslation();
  const gsData = useSelector((state) => state.gsData);
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <button onClick={handleToggle} className='w-1/2 rounded-lg bg-bg-button p-2 text-text-button'>
        {t('Scoreboard.scoreboard')}
      </button>
      {isOpen && (
        <div className='fixed inset-0 z-90 flex h-screen w-screen flex-col items-center justify-center gap-4 p-2'>
          <div onClick={handleToggle} className='absolute inset-0 z-95 h-full w-full bg-black opacity-30'></div>
          <div className='z-100 flex w-full flex-col rounded-xl bg-bg-primary p-2'>
            <div className='flex h-10 w-full items-center gap-2 border-b border-border-primary'>
              <div className='w-full text-center'>
                <FontAwesomeIcon icon={faUser} className='text-text-secondary' />
              </div>
              <div className='w-10 shrink-0 text-center'>
                <FontAwesomeIcon icon={faStar} className='text-text-secondary' />
              </div>
              <div className='w-10 shrink-0 text-center'>
                <FontAwesomeIcon icon={faTrophy} className='text-text-secondary' />
              </div>
            </div>
            {players.map((player) => (
              <div key={player.userId} className='flex h-16 w-full items-center gap-2'>
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
                <div className='w-10 shrink-0 text-center'>{player.score}</div>
                <div className='w-10 shrink-0 text-center'>
                  {player.isWinner && <FontAwesomeIcon icon={faTrophy} className='text-warning' />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
