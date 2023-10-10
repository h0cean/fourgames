import Piece from './Piece';

export default function HoveringPiece({ selectedColumn, players, user }) {
  return (
    <div
      className={`absolute -top-[var(--size-top-height)]`}
      style={{
        transform: `translateX(calc(var(--size-cell)*${selectedColumn}*-1))`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      <Piece colorCode={players.find((player) => player.playerId === user.playerId)?.color?.tailwind} />
    </div>
  );
}
