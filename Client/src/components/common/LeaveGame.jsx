import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { userActions } from '../../store/user-slice';

export default function LeaveGame({ socket, setGame, className }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLeaveClick = () => {
    // opening telegram popup to get leave confirmation from user
    window.Telegram.WebApp.showPopup(
      {
        message: t('Error.sure'),
        buttons: [
          { id: 'leave', text: t('Error.leave'), type: 'destructive' },
          { id: 'cancel', text: t('Error.cancel') },
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
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
            window.Telegram.WebApp.isClosingConfirmationEnabled &&
              window.Telegram.WebApp.disableClosingConfirmation();
            dispatch(userActions.setPlayer({ playerId: '', isPlayer: false }));
            setGame(null);
            navigate(`/`);
          });
        }
      },
    );
  };

  return (
    <button onClick={handleLeaveClick} className={className}>
      {t('LeaveGame.leave')}
    </button>
  );
}
