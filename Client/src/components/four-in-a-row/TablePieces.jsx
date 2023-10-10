import Piece from './Piece';

export default function TablePieces({ table, game }) {
  return (
    <div className='absolute bottom-0'>
      {table.map((col, colIndex) =>
        col.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className='absolute bottom-0 right-0 animate-dropPiece'
            style={{
              '--col-index': colIndex,
              '--row-index': rowIndex,
              '--row-total': game.boardData.boardRows,
              '--drop-piece-duration': `${140 + (game.boardData.boardRows - rowIndex) * 50}ms`,
              transform: `translate(calc(var(--size-cell)*${colIndex}*-1), calc(var(--size-cell)*${rowIndex}*-1))`,
            }}
          >
            <Piece colorCode={game.players.find((player) => player.playerId === row).color.tailwind} />
          </div>
        )),
      )}
    </div>
  );
}
