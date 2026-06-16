import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import CarCard from "../../components/ui/CarCard";
import { viewedService } from "../../services/viewedService";

export default function RecentlyViewed() {
  const [rows, setRows] = useState([]);
  useEffect(() => { document.title = "Recently Viewed | JK Autos"; viewedService.mine(20).then((data) => setRows(data.viewed || [])); }, []);

  return (
    <div>
      <div className="flex items-end justify-between gap-4"><div><p className="eyebrow">History</p><h1 className="page-title">Recently Viewed</h1></div><button className="secondary-btn" onClick={() => setRows([])}><Trash2 className="h-4 w-4" /> Clear History</button></div>
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{rows.map((row) => <CarCard key={row.id} car={row.car} />)}</div>
    </div>
  );
}
