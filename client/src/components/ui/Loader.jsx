export default function Loader({ label = "Loading JK Autos" }) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
      <div className="h-12 w-12 animate-spin border-2 border-red-700 border-t-transparent" />
      <p className="font-display text-sm uppercase tracking-[.24em] text-zinc-400">{label}</p>
    </div>
  );
}
