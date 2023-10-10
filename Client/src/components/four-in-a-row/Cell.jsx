export default function Cell() {
  return (
    <div className='relative h-[var(--size-cell)] w-[var(--size-cell)] overflow-hidden'>
      <div className='absolute left-1/2 top-1/2 h-[var(--size-cell-inside)] w-[var(--size-cell-inside)] -translate-x-1/2 -translate-y-1/2 rounded-full shadow-inner'></div>
      <div className='shadow-board absolute left-1/2 top-1/2 h-[var(--size-cell-inside)] w-[var(--size-cell-inside)] -translate-x-1/2 -translate-y-1/2 rounded-full shadow-cell'></div>
    </div>
  );
}
