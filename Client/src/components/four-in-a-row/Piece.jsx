export default function Piece({ colorCode }) {
  return (
    <div className='flex h-[var(--size-cell)] w-[var(--size-cell)] items-center justify-center'>
      <div
        className={`${colorCode} flex h-[var(--size-piece)] w-[var(--size-piece)] items-center justify-center rounded-full shadow-pieceOuter`}
      >
        <div className='h-[var(--size-piece-inside)] w-[var(--size-piece-inside)] rounded-full shadow-pieceInner'></div>
      </div>
    </div>
  );
}
