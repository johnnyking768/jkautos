export default function StatCard({ icon: Icon, label, value, accent = "text-red-500" }) {
  return (
    <div className="glass-dark p-5">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-xs uppercase tracking-[.18em] text-zinc-500">{label}</span>
        {Icon && <Icon className={`h-5 w-5 ${accent}`} />}
      </div>
      <p className="font-data text-3xl font-black text-white">{value}</p>
    </div>
  );
}
