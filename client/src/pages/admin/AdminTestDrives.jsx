import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Badge from "../../components/ui/Badge";
import { testDriveService } from "../../services/testDriveService";

export default function AdminTestDrives() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("");
  const load = () => testDriveService.admin(status ? { status } : {}).then((data) => setRows(data.testDrives || []));
  useEffect(() => { document.title = "Admin Test Drives | JK Autos"; load(); }, [status]);
  const setRowStatus = async (id, next) => { await testDriveService.setStatus(id, next); toast.success("Test drive updated"); load(); };

  return (
    <div><p className="eyebrow">Operations</p><h1 className="page-title">Test Drives</h1><div className="my-6"><select className="input w-56" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All Status</option><option>pending</option><option>confirmed</option><option>completed</option><option>cancelled</option></select></div><div className="overflow-x-auto"><table className="admin-table"><thead><tr><th>User</th><th>Car</th><th>Date</th><th>Time</th><th>Status</th><th>Note</th><th>Actions</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td>{row.user?.name}</td><td>{row.car?.title}</td><td>{row.drive_date}</td><td>{row.drive_time}</td><td><Badge tone={row.status}>{row.status}</Badge></td><td>{row.note}</td><td><div className="flex gap-2"><button className="secondary-btn" onClick={() => setRowStatus(row.id, "confirmed")}>Confirm</button><button className="secondary-btn" onClick={() => setRowStatus(row.id, "cancelled")}>Cancel</button><button className="secondary-btn" onClick={() => setRowStatus(row.id, "completed")}>Complete</button></div></td></tr>)}</tbody></table></div></div>
  );
}
