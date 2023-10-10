import { useState } from 'react';

import LanguageChange from './LanguageChange';
import AvatarChange from './AvatarChange';
import PlayerColorChange from './PlayerColorChange';
import ThemeChange from './ThemeChange';

export default function Sidebar({ socket, isOpen, handleSidebarToggle }) {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // the required distance between touchStart and touchEnd to be detected as a swipe
  const minSwipeDistance = 60;

  const handleTouchStart = (e) => {
    setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    // detecting right or left swipes
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    // const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleSidebarToggle();
    }
  };

  return (
    <>
      <div
        onClick={handleSidebarToggle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`fixed bottom-0 top-13 z-90 w-full bg-black transition-all duration-200 ${
          isOpen ? 'translate-x-0 opacity-30' : 'opacity-0 ltr:-translate-x-full rtl:translate-x-full'
        }`}
      ></div>

      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`fixed bottom-0 end-0 start-0 top-13 z-90 w-80 max-w-[85%] overflow-y-auto bg-bg-secondary transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full'
        }`}
      >
        <LanguageChange />
        <PlayerColorChange socket={socket} />
        <AvatarChange socket={socket} />
        <ThemeChange />
      </div>
    </>
  );
}
