import { useEffect, useState } from "react";
import Badge from "../../components/ui/Badge";
import { testDriveService } from "../../services/testDriveService";
import { formatPrice } from "../../utils/formatPrice";

export default function TestDrives() {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    document.title = "Test Drives | JK Autos";
    testDriveService.mine().then((data) => setRows(data.testDrives || []));
  }, []);

  return (
    <div>
      <p className="eyebrow">Drive requests</p><h1 className="page-title">Test Drives</h1>
      <button className="primary-btn my-6">Schedule Test Drive</button>
      <div className="space-y-4">
        {rows.map((row) => <div key={row.id} className="booking-card"><img src={row.car?.images?.[0]} alt="" /><div><h3>{row.car?.title}</h3><p>{formatPrice(row.car?.price)} / {row.drive_date} {row.drive_time}</p><p>{row.note}</p></div><Badge tone={row.status}>{row.status}</Badge></div>)}
      </div>
    </div>
  );
}
