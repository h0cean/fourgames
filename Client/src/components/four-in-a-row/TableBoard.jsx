import Cell from './Cell';

export default function TableBoard({ game, selectedColumn, user, isMyTurn, handleColumnClick, handleTouchMove }) {
  return (
    <div onTouchMove={handleTouchMove} className='flex'>
      {new Array(game.boardData.boardColumns).fill(null).map((el, col) => (
        <div key={col} className={`relative overflow-hidden`}>
          {selectedColumn === col && user && isMyTurn && (
            <div className='absolute -top-[var(--size-cell)] bottom-0 left-0 right-0 animate-dropBG bg-[url("/src/assets/images/wave.png")] bg-[length:50%] bg-repeat'></div>
          )}
          <div className=''>
            {new Array(game.boardData.boardRows).fill(null).map((el, row) => (
              <Cell key={row} />
            ))}
          </div>
          {user && (
            <div
              className='absolute bottom-0 z-40 h-[var(--size-col-hover)] w-full cursor-pointer'
              onClick={handleColumnClick(col)}
              data-column-id={col}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
}
