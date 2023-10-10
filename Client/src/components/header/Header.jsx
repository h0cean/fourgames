import { useState } from 'react';
import { useSelector } from 'react-redux';

import './Header.css';
import Sidebar from '../sidebar/Sidebar';
import testAvatar from '../../assets/images/test-avatar.webp';

export default function Header({ socket }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = useSelector((state) => state.user);

  // this function is called only when telegram BackButton gets clicked
  const handleSidebarClose = () => {
    window.Telegram.WebApp.BackButton.offClick(handleSidebarClose);
    window.Telegram.WebApp.BackButton.hide();
    setIsSidebarOpen(false);
  };

  // handle closing and opening sidebar
  // append or remove the handleSidebarClose function to the telegram BackButton
  const handleSidebarToggle = () => {
    setIsSidebarOpen((prev) => {
      if (prev) {
        window.Telegram.WebApp.BackButton.offClick(handleSidebarClose);
        window.Telegram.WebApp.BackButton.hide();
      } else {
        window.Telegram.WebApp.BackButton.onClick(handleSidebarClose);
        window.Telegram.WebApp.BackButton.show();
      }
      return !prev;
    });
  };

  return (
    <>
      <Sidebar socket={socket} isOpen={isSidebarOpen} handleSidebarToggle={handleSidebarToggle} />
      <div className='invisible h-13'></div>
      <div className='fixed end-0 top-0 z-90 flex h-13 w-full max-w-full items-center gap-2 bg-bg-header px-3 text-text-button drop-shadow-lg'>
        <button onClick={handleSidebarToggle} className='text-button-text flex h-12 w-12 shrink-0 overflow-hidden'>
          <svg
            className={`header_ham_btn -m-2 header_ham_rotate${isSidebarOpen ? ' header_ham_active' : ''}`}
            viewBox='0 0 100 100'
            width='80'
          >
            <path
              className='header_ham_line header_ham_top'
              d='m 30,33 h 40 c 3.722839,0 7.5,3.126468 7.5,8.578427 0,5.451959 -2.727029,8.421573 -7.5,8.421573 h -20'
            />
            <path className='header_ham_line header_ham_mid' d='m 30,50 h 40' />
            <path
              className='header_ham_line header_ham_bot'
              d='m 70,67 h -40 c 0,0 -7.5,-0.802118 -7.5,-8.365747 0,-7.563629 7.5,-8.634253 7.5,-8.634253 h 20'
            />
          </svg>
        </button>
        <div className='truncate'>{user.firstName}</div>
        {user.avatarSrc && (
          <img
            className='ms-auto h-12 w-12 shrink-0 rounded-full'
            src={user.avatarSrc}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = testAvatar;
            }}
            alt='Avatar'
          />
        )}
      </div>
    </>
  );
}
