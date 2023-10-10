import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPalette, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { userActions } from '../../store/user-slice';
import Piece from '../four-in-a-row/Piece';

export default function PlayerColorChange({ socket }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const colorId = useSelector((state) => state.user.colorId);
  const gsData = useSelector((state) => state.gsData);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  // setting player piece color to show in game
  const handleColorClick = (selectedColorId) => () => {
    socket.emit('changeColor', { id: selectedColorId }, (response) => {
      if (!response.ok) return;
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      // set the selected color to the user redux state
      dispatch(userActions.setColorId({ colorId: selectedColorId }));
    });
  };

  return (
    <div className='collapse rounded-none border-b border-border-primary'>
      <input type='checkbox' onChange={handleToggle} checked={open} />
      <div className='collapse-title flex w-full items-center gap-4 px-3 py-2'>
        <FontAwesomeIcon className='text-2xl text-text-secondary' icon={faPalette} />
        <div className='flex w-full items-center justify-between'>
          <div className=''>{t('PlayerColorChange.label')}</div>
          <FontAwesomeIcon
            className={`me-2 transition-transform ${open ? 'rotate-180' : ''}`}
            icon={faChevronUp}
          />
        </div>
      </div>
      <div className='collapse-content'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          {gsData.colors.map((color) => (
            <button
              key={color.id}
              className={`rounded-full border p-0.5 ${
                color.id === colorId ? 'border-active shadow' : 'border-border-primary'
              }`}
              onClick={handleColorClick(color.id)}
            >
              <Piece colorCode={color.tailwind} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
