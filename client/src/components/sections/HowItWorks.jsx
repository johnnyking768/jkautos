const steps = [
  ["01", "Browse", "Search our verified inventory"],
  ["02", "Inspect", "Book a free inspection or test drive"],
  ["03", "Finance", "Choose your payment or installment plan"],
  ["04", "Drive", "Complete paperwork and drive home"],
];

export default function HowItWorks() {
  return (
    <section className="section bg-[#0a0a0a]">
      <div className="section-heading">
        <p className="eyebrow">Process</p>
        <h2>How It Works</h2>
      </div>
      <div className="relative grid gap-5 md:grid-cols-4">
        <div className="absolute left-0 right-0 top-10 hidden h-px bg-red-900/60 md:block" />
        {steps.map(([number, title, description]) => (
          <div key={number} className="relative z-10 bg-[#0a0a0a] p-5 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-red-700 bg-black font-display text-2xl font-black text-red-500">{number}</div>
            <h3 className="mt-5 font-display text-xl font-black uppercase">{title}</h3>
            <p className="mt-2 text-sm text-zinc-400">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
