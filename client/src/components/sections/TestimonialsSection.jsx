import { Star } from "lucide-react";

const testimonials = [
  ["Ada Okafor", "Lagos", "Mercedes-Benz GLE 450", "JK Autos made the paperwork clean and the handover felt truly premium."],
  ["Tunde Bello", "Abuja", "BMW X5", "The inspection notes were honest, detailed, and easy to understand."],
  ["Chioma Briggs", "Port Harcourt", "Toyota Camry", "I used installments and still got the exact car I wanted."],
];

export default function TestimonialsSection() {
  return (
    <section className="section">
      <div className="section-heading">
        <p className="eyebrow">Customer proof</p>
        <h2>What Our Customers Say</h2>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {testimonials.map(([name, city, car, quote]) => (
          <div key={name} className="glass-dark p-6">
            <div className="mb-4 flex gap-1 text-red-500">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className="h-4 w-4 fill-current" />)}</div>
            <p className="text-lg text-zinc-200">"{quote}"</p>
            <p className="mt-6 font-display font-black uppercase">{name}</p>
            <p className="text-sm text-zinc-500">{car} / {city}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
