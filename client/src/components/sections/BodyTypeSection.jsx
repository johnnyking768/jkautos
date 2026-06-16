import { Car, Gem, RefreshCcw, Shield, Truck, Trophy, Van, Waves } from "lucide-react";
import { Link } from "react-router-dom";

const types = [
  ["Sedan", "sedan", Car],
  ["SUV", "suv", Shield],
  ["Coupe", "coupe", Trophy],
  ["Van", "van", Van],
  ["Truck", "truck", Truck],
  ["Sports", "sports", Waves],
  ["Luxury", "luxury", Gem],
  ["Convertible", "convertible", RefreshCcw],
];

export default function BodyTypeSection() {
  return (
    <section className="section">
      <div className="section-heading">
        <p className="eyebrow">Browse by type</p>
        <h2>Choose Your Shape</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {types.map(([label, slug, Icon]) => (
          <Link key={slug} to={`/cars?body_type=${slug}`} className="glass-dark flex items-center gap-4 p-5 transition hover:border-red-700">
            <Icon className="h-8 w-8 text-red-500" />
            <span className="font-display text-lg font-black uppercase">{label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
