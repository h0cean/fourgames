import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { userActions } from '../store/user-slice';
import Header from '../components/header/Header';

export default function DifferentGames({ socket }) {
  const { t } = useTranslation;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const gsData = useSelector((state) => state.gsData);

  const handleLeave = () => {
    window.Telegram.WebApp.showPopup(
      {
        message: t('Error.sure'),
        buttons: [
          { id: 'leave', text: t('Error.leave'), type: 'destructive' },
          { id: 'cancel', text: t('Error.cancel'), type: 'cancel' },
        ],
      },
      (response) => {
        if (response === 'leave') {
          socket.emit('leaveGame', {}, (response) => {
            if (!response.ok) {
              console.log('Something went wrong!');
              console.log(response);
              return;
            }
            dispatch(userActions.setIsPlayer({ isPlayer: false }));
            navigate(`/game#${gsData.startParamGameId}`);
          });
        }
      },
    );
  };

  const handleRejoin = () => {
    const gameId = gsData.current.gameId;
    dispatch(userActions.setIsPlayer({ isPlayer: true }));
    navigate(`/game#${gameId}`);
  };
  return (
    <>
      <Header socket={socket} />
      <div className='flex flex-col gap-4 rounded-xl bg-bg-secondary p-4'>
        <div className='w-full'>{t('DifferentGames.unfinished')}</div>
        <div className='flex w-full items-center justify-between gap-2'>
          <button onClick={handleLeave} className='rounded-lg bg-error p-2 text-text-button'>
            {t('DifferentGames.leave')}
          </button>
          <button onClick={handleRejoin} className='rounded-lg bg-bg-button p-2 text-text-button'>
            {t('DifferentGames.resume')}
          </button>
        </div>
      </div>
    </>
  );
}
