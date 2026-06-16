const styles = {
  available: "bg-red-700 text-white border-red-500",
  sold: "bg-zinc-700 text-zinc-200 border-zinc-500",
  reserved: "bg-amber-600 text-black border-amber-300",
  pending: "bg-amber-600 text-black border-amber-300",
  new: "bg-emerald-600 text-white border-emerald-400",
  used: "bg-zinc-800 text-zinc-200 border-zinc-500",
  certified: "bg-sky-700 text-white border-sky-400",
  featured: "bg-yellow-600 text-black border-yellow-300",
  electric: "bg-cyan-700 text-white border-cyan-400",
};

export default function Badge({ children, tone = "available", className = "" }) {
  return (
    <span className={`inline-flex items-center border px-2.5 py-1 text-[11px] font-black uppercase tracking-[.16em] ${styles[tone] || styles.available} ${className}`}>
      {children}
    </span>
  );
}
