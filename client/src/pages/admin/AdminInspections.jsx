import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Badge from "../../components/ui/Badge";
import { inspectionService } from "../../services/inspectionService";

export default function AdminInspections() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("");
  const load = () => inspectionService.admin(status ? { status } : {}).then((data) => setRows(data.inspections || []));
  useEffect(() => { document.title = "Admin Inspections | JK Autos"; load(); }, [status]);
  const setRowStatus = async (id, next) => { await inspectionService.setStatus(id, { status: next, admin_note: next === "confirmed" ? "Confirmed by JK Autos" : "" }); toast.success("Inspection updated"); load(); };

  return <AdminBooking title="Inspections" rows={rows} status={status} setStatus={setStatus} dateKey="inspection_date" timeKey="inspection_time" onStatus={setRowStatus} />;
}

function AdminBooking({ title, rows, status, setStatus, dateKey, timeKey, onStatus }) {
  return (
    <div><p className="eyebrow">Operations</p><h1 className="page-title">{title}</h1><div className="my-6"><select className="input w-56" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All Status</option><option>pending</option><option>confirmed</option><option>completed</option><option>cancelled</option></select></div><div className="overflow-x-auto"><table className="admin-table"><thead><tr><th>User</th><th>Car</th><th>Date</th><th>Time</th><th>Location</th><th>Status</th><th>Note</th><th>Actions</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td>{row.user?.name}</td><td>{row.car?.title}</td><td>{row[dateKey]}</td><td>{row[timeKey]}</td><td>{row.location || "JK Autos"}</td><td><Badge tone={row.status}>{row.status}</Badge></td><td>{row.note}</td><td><div className="flex gap-2"><button className="secondary-btn" onClick={() => onStatus(row.id, "confirmed")}>Confirm</button><button className="secondary-btn" onClick={() => onStatus(row.id, "cancelled")}>Cancel</button><button className="secondary-btn" onClick={() => onStatus(row.id, "completed")}>Complete</button></div></td></tr>)}</tbody></table></div></div>
  );
}
