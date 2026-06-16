import { BadgeCheck, ClipboardCheck, CreditCard, Gauge, SearchCheck, Wrench } from "lucide-react";

const items = [
  [SearchCheck, "100% Verified Cars", "Every listing is inspected for documents, condition, and ownership trail."],
  [BadgeCheck, "Best Price Guarantee", "Transparent pricing with market-aware recommendations."],
  [Gauge, "Free Test Drive", "Book a premium studio test drive before committing."],
  [ClipboardCheck, "Complete Documentation", "Registration, customs, and handover support handled end to end."],
  [Wrench, "Service History Included", "Maintenance records and inspection notes travel with the car."],
  [CreditCard, "Flexible Installments", "Drive now with structured payment plans built for premium buyers."],
];

export default function WhyChooseUs() {
  return (
    <section id="about" className="section">
      <div className="section-heading">
        <p className="eyebrow">Why JK Autos?</p>
        <h2>Luxury Without Guesswork</h2>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map(([Icon, title, description]) => (
          <div key={title} className="glass-dark p-6 transition hover:border-red-700 hover:shadow-xl hover:shadow-red-950/20">
            <Icon className="mb-5 h-8 w-8 text-red-500" />
            <h3 className="font-display text-xl font-black uppercase">{title}</h3>
            <p className="mt-3 text-zinc-400">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
