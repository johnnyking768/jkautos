import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminService } from "../../services/adminService";
import { installmentService } from "../../services/installmentService";

export default function AdminSettings() {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", down_payment_percent: 20, duration_months: 24, interest_rate: 8 });
  const load = () => installmentService.plans().then((data) => setPlans(data.plans || []));
  useEffect(() => { document.title = "Admin Settings | JK Autos"; load(); }, []);
  const submit = async (event) => { event.preventDefault(); await adminService.createPlan(form); toast.success("Plan created"); setForm({ name: "", description: "", down_payment_percent: 20, duration_months: 24, interest_rate: 8 }); load(); };

  return (
    <div>
      <p className="eyebrow">Platform</p><h1 className="page-title">Settings</h1>
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="glass-dark p-5"><h2 className="font-display text-xl font-black uppercase">Installment Plans</h2><div className="mt-5 space-y-3">{plans.map((plan) => <div key={plan.id} className="dash-row"><span>{plan.name}</span><span>{plan.down_payment_percent}% / {plan.duration_months}m / {plan.interest_rate}%</span></div>)}</div><form className="mt-6 grid gap-3" onSubmit={submit}><input className="input" placeholder="Plan name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /><input className="input" placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /><input className="input" type="number" placeholder="Down payment %" value={form.down_payment_percent} onChange={(event) => setForm({ ...form, down_payment_percent: Number(event.target.value) })} /><input className="input" type="number" placeholder="Duration months" value={form.duration_months} onChange={(event) => setForm({ ...form, duration_months: Number(event.target.value) })} /><input className="input" type="number" placeholder="Interest rate" value={form.interest_rate} onChange={(event) => setForm({ ...form, interest_rate: Number(event.target.value) })} /><button className="primary-btn">Create Plan</button></form></section>
        <section className="glass-dark p-5"><h2 className="font-display text-xl font-black uppercase">Platform Info</h2><div className="mt-5 grid gap-3"><input className="input" defaultValue="JK Autos" /><input className="input" defaultValue="+234 8121638903" /><input className="input" defaultValue="Lagos, Nigeria" /><input className="input" placeholder="Create admin email" /><input className="input" type="password" placeholder="Create admin password" /><button className="primary-btn" type="button">Save Settings</button></div></section>
      </div>
    </div>
  );
}
