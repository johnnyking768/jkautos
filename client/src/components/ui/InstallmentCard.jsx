import { Calculator } from "lucide-react";
import { formatPrice } from "../../utils/formatPrice";

export default function InstallmentCard({ plan, price = 50000000, onSelect }) {
  const financed = price * (1 - Number(plan.down_payment_percent) / 100);
  const monthly = Math.ceil((financed * (1 + Number(plan.interest_rate) / 100)) / Number(plan.duration_months));

  return (
    <div className="glass-dark flex h-full flex-col p-5 transition hover:border-red-700">
      <p className="font-display text-2xl font-black uppercase text-white">{plan.name}</p>
      <p className="mt-2 text-sm text-zinc-400">{plan.description}</p>
      <div className="my-5 grid grid-cols-2 gap-3">
        <span className="spec-badge">{plan.down_payment_percent}% down</span>
        <span className="spec-badge">{plan.duration_months} months</span>
        <span className="spec-badge col-span-2">{plan.interest_rate}% interest</span>
      </div>
      <p className="mt-auto text-sm uppercase tracking-[.16em] text-zinc-500">Est. monthly</p>
      <p className="price-tag text-2xl">{formatPrice(monthly)}</p>
      <button className="primary-btn mt-5 w-full" onClick={() => onSelect?.(plan)}>
        <Calculator className="h-4 w-4" /> Calculate Payment
      </button>
    </div>
  );
}
