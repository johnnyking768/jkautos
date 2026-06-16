import { useEffect, useState } from "react";
import Badge from "../../components/ui/Badge";
import { installmentService } from "../../services/installmentService";
import { formatDate } from "../../utils/formatDate";
import { formatPrice } from "../../utils/formatPrice";

export default function Installments() {
  const [rows, setRows] = useState([]);
  useEffect(() => { document.title = "Installments | JK Autos"; installmentService.mine().then((data) => setRows(data.installments || [])); }, []);

  return (
    <div>
      <p className="eyebrow">Payment plans</p><h1 className="page-title">Installments</h1>
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {rows.map((row) => {
          const progress = Math.min((Number(row.amount_paid) / Number(row.total_amount)) * 100, 100);
          return (
            <div key={row.id} className="glass-dark p-5">
              <div className="flex gap-4"><img src={row.car?.images?.[0]} alt="" className="h-28 w-36 object-cover" /><div><h3 className="font-display text-xl font-black uppercase">{row.car?.title}</h3><p className="price-tag">{formatPrice(row.monthly_payment)} monthly</p><Badge tone={row.status}>{row.status}</Badge></div></div>
              <div className="mt-5 h-2 bg-zinc-800"><div className="h-full bg-red-700" style={{ width: `${progress}%` }} /></div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-zinc-400"><p>Total: {formatPrice(row.total_amount)}</p><p>Paid: {formatPrice(row.amount_paid)}</p><p>Remaining: {row.months_remaining} months</p><p>Next: {formatDate(row.next_payment_date)}</p></div>
              <table className="mini-table mt-5"><tbody><tr><td>Down payment</td><td>{formatPrice(row.down_payment)}</td></tr><tr><td>Plan</td><td>{row.plan?.name}</td></tr></tbody></table>
            </div>
          );
        })}
      </div>
    </div>
  );
}
