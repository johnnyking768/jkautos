import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Badge from "../../components/ui/Badge";
import { inspectionService } from "../../services/inspectionService";
import { formatPrice } from "../../utils/formatPrice";

const tabs = ["all", "pending", "confirmed", "completed"];

export default function Inspections() {
  const [rows, setRows] = useState([]);
  const [tab, setTab] = useState("all");

  const load = () => inspectionService.mine().then((data) => setRows(data.inspections || []));
  useEffect(() => { document.title = "Inspections | JK Autos"; load(); }, []);
  const cancel = async (id) => { await inspectionService.cancel(id); toast.success("Inspection cancelled"); load(); };
  const filtered = tab === "all" ? rows : rows.filter((row) => row.status === tab);

  return (
    <div>
      <p className="eyebrow">Bookings</p><h1 className="page-title">Inspections</h1>
      <div className="my-6 flex flex-wrap gap-2">{tabs.map((item) => <button key={item} className={`tab-btn ${tab === item ? "active" : ""}`} onClick={() => setTab(item)}>{item}</button>)}</div>
      <div className="space-y-4">
        {filtered.map((row) => <div key={row.id} className="booking-card"><img src={row.car?.images?.[0]} alt="" /><div><h3>{row.car?.title}</h3><p>{formatPrice(row.car?.price)} / {row.inspection_date} {row.inspection_time}</p><p>{row.location}</p>{row.admin_note && <p>{row.admin_note}</p>}</div><Badge tone={row.status}>{row.status}</Badge>{row.status === "pending" && <button className="secondary-btn" onClick={() => cancel(row.id)}>Cancel</button>}</div>)}
      </div>
    </div>
  );
}
