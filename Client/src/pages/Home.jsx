import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import useMainButton from '../hooks/useMainButton';
import brush from '../assets/images/brush.png';
import Piece from '../components/four-in-a-row/Piece';
import Header from '../components/header/Header';

export default function Home({ socket }) {
  const { t } = useTranslation();
  const [typeIndex, setTypeIndex] = useState(0);
  const [players, setPlayers] = useState();
  const { showMainButton, hideMainButton } = useMainButton();
  const gsData = useSelector((state) => state.gsData);

  useEffect(() => {
    if (gsData.isInit) {
      setPlayers(gsData.types[0].minPlayers);
    }
  }, [gsData]);

  // send user to bot InlineQuery with the selected options for the inline query to create the game
  // and share the join link of the game to a chat or group
  const handleCreate = useCallback(() => {
    window.Telegram.WebApp.switchInlineQuery(`${gsData.types[typeIndex].id}/${players}`, ['users', 'groups']);
    window.Telegram.WebApp.close();
  }, [gsData.types, players, typeIndex]);

  useEffect(() => {
    showMainButton(t('Home.create'));
    window.Telegram.WebApp.MainButton.onClick(handleCreate);

    return () => {
      window.Telegram.WebApp.MainButton.offClick(handleCreate);
      hideMainButton();
    };
  }, [handleCreate, showMainButton, hideMainButton, t('Home.create')]);

  // handle games settings changing
  const handleGameClick = (index) => () => {
    setTypeIndex(index);
  };
  const handlePlayersChange = (event) => {
    setPlayers(event.target.value);
  };

  if (gsData.isInit)
    return (
      <>
        <Header socket={socket} />
        <div className='flex w-full flex-col gap-3 overflow-hidden p-3 sm:flex-row'>
          <div className='flex w-full flex-col gap-2'>
            {gsData.types.map((type, index) => (
              <div key={type.id} className='w-full'>
                <button
                  onClick={handleGameClick(index)}
                  className={`relative z-50 w-full rounded-full text-text-button`}
                >
                  <img src={brush} alt='brush' className='z-50 w-full' />
                  <div
                    className={`absolute left-1/2 top-1/2 -z-10 h-1/5 w-10/12 -translate-x-1/2 -translate-y-1/2 rounded-full transition-shadow ${
                      index === typeIndex ? 'shadow-activeShadow duration-300' : ''
                    }`}
                  ></div>
                  <div className='absolute inset-0 z-50 flex h-full w-full items-center justify-center text-2xl font-semibold'>
                    {type.name}
                  </div>
                </button>
              </div>
            ))}
          </div>

          <div className='flex w-full flex-col gap-2'>
            <div className='w-full'>
              <label className='label px-0 py-1'>
                <span className='label-text text-base text-text-primary'>{t('Home.players')}</span>
              </label>
              <select
                value={players}
                onChange={handlePlayersChange}
                className='select select-bordered w-full bg-bg-secondary pe-10 ps-4'
              >
                {new Array(gsData.types[typeIndex].maxPlayers - gsData.types[typeIndex].minPlayers + 1)
                  .fill(null)
                  .map((el, index) => (
                    <option key={index} value={gsData.types[typeIndex].minPlayers + index}>
                      {gsData.types[typeIndex].minPlayers + index}
                    </option>
                  ))}
              </select>
            </div>

            <div className='flex w-full flex-col gap-2 rounded-xl bg-bg-secondary p-2'>
              <div className='flex gap-2'>
                <div className=''>{t('Home.board')}</div>
                <div className='font-semibold'>{`${gsData.types[typeIndex].board.columns} ${t('Home.x')} ${
                  gsData.types[typeIndex].board.rows
                }`}</div>
              </div>
              <div className='flex gap-2'>
                <div className=''>{t('Home.time')}</div>
                <div className='font-semibold'>
                  {gsData.types[typeIndex].eachMoveTime} <span className='font-normal'>{t('Home.seconds')}</span>
                </div>
              </div>
            </div>

            <div className='flex w-full flex-col gap-2 rounded-xl bg-bg-secondary p-2'>
              <div className='flex items-center gap-1'>
                <Piece colorCode={gsData.colors[0].tailwind} />
                <Piece colorCode={gsData.colors[0].tailwind} />
                <div className='ms-1'>
                  {gsData.types[typeIndex].twoInRowScore} {t('Home.points')}
                </div>
              </div>
              <div className='flex items-center gap-1'>
                <Piece colorCode={gsData.colors[0].tailwind} />
                <Piece colorCode={gsData.colors[0].tailwind} />
                <Piece colorCode={gsData.colors[0].tailwind} />
                <div className='ms-1'>
                  {gsData.types[typeIndex].threeInRowScore} {t('Home.points')}
                </div>
              </div>
              <div className='flex items-center gap-1'>
                <Piece colorCode={gsData.colors[0].tailwind} />
                <Piece colorCode={gsData.colors[0].tailwind} />
                <Piece colorCode={gsData.colors[0].tailwind} />
                <Piece colorCode={gsData.colors[0].tailwind} />
                <div className='ms-1'>{t('Home.winner')}</div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
}
