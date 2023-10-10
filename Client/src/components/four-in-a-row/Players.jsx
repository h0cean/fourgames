import Player from './Player';

export default function Players({ players }) {
  return (
    <div className='flex w-full flex-col gap-2'>
      {players.map((el) => (
        <Player key={el.playerId} player={el} />
      ))}
    </div>
  );
}
