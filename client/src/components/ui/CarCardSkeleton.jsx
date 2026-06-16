export default function CarCardSkeleton() {
  return (
    <div className="car-card h-[430px] animate-pulse bg-zinc-950">
      <div className="h-56 bg-zinc-900" />
      <div className="space-y-4 p-5">
        <div className="h-4 w-1/3 bg-zinc-800" />
        <div className="h-6 w-4/5 bg-zinc-800" />
        <div className="h-7 w-1/2 bg-zinc-800" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-10 bg-zinc-800" />
          <div className="h-10 bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}
