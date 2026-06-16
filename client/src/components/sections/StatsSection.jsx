import { formatPrice } from "../../utils/formatPrice";

const stats = [
  ["500+", "Cars Available"],
  [formatPrice(50000000000), "Cars Sold"],
  ["5,000+", "Happy Customers"],
  ["10+", "Years Experience"],
];

export default function StatsSection() {
  return (
    <section className="border-y border-red-900/60 bg-black py-10">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 md:grid-cols-4">
        {stats.map(([value, label]) => (
          <div key={label} className="text-center">
            <p className="font-data text-3xl font-black text-red-500">{value}</p>
            <p className="mt-2 text-xs uppercase tracking-[.2em] text-zinc-500">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
