import { useState } from "react";
import Modal from "../ui/Modal";
import InstallmentCard from "../ui/InstallmentCard";
import { formatPrice } from "../../utils/formatPrice";

const plans = [
  { name: "Starter", description: "Higher down payment, fast finish.", down_payment_percent: 30, duration_months: 12, interest_rate: 5 },
  { name: "Standard", description: "Balanced plan for luxury buyers.", down_payment_percent: 20, duration_months: 24, interest_rate: 8 },
  { name: "Premium", description: "Lowest down payment and flexible duration.", down_payment_percent: 10, duration_months: 36, interest_rate: 12 },
];

export default function InstallmentSection() {
  const [plan, setPlan] = useState(null);
  const [price, setPrice] = useState(50000000);
  const down = plan ? price * (plan.down_payment_percent / 100) : 0;
  const monthly = plan ? Math.ceil(((price - down) * (1 + plan.interest_rate / 100)) / plan.duration_months) : 0;

  return (
    <section className="section">
      <div className="section-heading">
        <p className="eyebrow">Drive now, pay later</p>
        <h2>Flexible Installments</h2>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {plans.map((item) => <InstallmentCard key={item.name} plan={item} onSelect={setPlan} />)}
      </div>
      <Modal open={Boolean(plan)} title={`${plan?.name} Calculator`} onClose={() => setPlan(null)}>
        <label className="block">
          <span className="filter-label">Car Price</span>
          <input className="input" type="range" min="10000000" max="200000000" step="1000000" value={price} onChange={(event) => setPrice(Number(event.target.value))} />
        </label>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="spec-badge">Price: {formatPrice(price)}</div>
          <div className="spec-badge">Down: {formatPrice(down)}</div>
          <div className="spec-badge">Monthly: {formatPrice(monthly)}</div>
        </div>
      </Modal>
    </section>
  );
}
