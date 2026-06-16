export default function SpecRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 py-3 last:border-b-0">
      <span className="text-sm uppercase tracking-[.14em] text-zinc-500">{label}</span>
      <span className="font-data text-sm text-white">{value || "N/A"}</span>
    </div>
  );
}
