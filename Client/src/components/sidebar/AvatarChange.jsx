import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { userActions } from '../../store/user-slice';

//////////////////////
// sometimes in some clients or some networks the avatar image files will not load
// i have set a default image to load instead of the actual avatar image file in other components
// we could not pinpoint exactly why this was happening but you can see in game that the
// testAvatar will load if an img source has an error and can't load the actuall image
//////////////////////

export default function AvatarChange({ socket }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const gsData = useSelector((state) => state.gsData);
  const user = useSelector((state) => state.user);
  // const { gs, user } = useSelector((state) => state);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  // setting user avatar to show in game
  // users can choose their profile picture as theire avatar
  const handleAvatarChange = (selectedAvatarId, selectedAvatarPath) => () => {
    socket.emit(
      'changeAvatar',
      // will send empty object to server if profile picture is selected
      { ...(user.profilePic.id !== selectedAvatarId && { id: selectedAvatarId }) },
      (response) => {
        if (!response.ok) {
          console.log('Something went wrong!');
          console.log(response);
          return;
        }
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        // set the selected avatar to the user redux state
        dispatch(
          userActions.setAvatar({
            avatarId: selectedAvatarId,
            avatarSrc: `${gsData.photoRoute}/${selectedAvatarPath}`,
          }),
        );
      },
    );
  };

  if (gsData.isInit && gsData.photoRoute)
    return (
      <div className='collapse rounded-none border-b border-border-primary'>
        <input type='checkbox' onChange={handleToggle} checked={open} />
        <div className='collapse-title flex w-full items-center gap-4 px-3 py-2'>
          <FontAwesomeIcon className='text-2xl text-text-secondary' icon={faUser} />
          <div className='flex w-full items-center justify-between'>
            <div className=''>{t('AvatarChange.label')}</div>
            <FontAwesomeIcon
              className={`me-2 transition-transform ${open ? 'rotate-180' : ''}`}
              icon={faChevronUp}
            />
          </div>
        </div>
        <div className={`collapse-content`}>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            {gsData?.avatars.map((avatar) => (
              <button
                key={avatar.id}
                onClick={handleAvatarChange(avatar.id, avatar.name)}
                className={`rounded-full border p-1 ${
                  avatar.id === user.avatarId ? 'border-active shadow' : 'border-border-primary'
                }`}
              >
                <img src={`${gsData.photoRoute}/${avatar.name}`} className='h-12 w-12 rounded-full' alt='Avatar' />
              </button>
            ))}
            {user.hasProfilePic && (
              <button
                onClick={handleAvatarChange(user.profilePic.id, user.profilePic.name)}
                className={`w-full rounded-full border p-1 ${
                  user.profilePic.id === user.avatarId ? 'border-active shadow' : 'border-border-primary'
                }`}
              >
                <div className='flex items-center gap-2'>
                  <img
                    src={`${gsData.photoRoute}/${user.profilePic.name}`}
                    className='h-12 w-12 rounded-full'
                    alt='Avatar'
                  />
                  <div className=''>{t('AvatarChange.profile')}</div>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    );
}
