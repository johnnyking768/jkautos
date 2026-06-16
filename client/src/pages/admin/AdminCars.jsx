import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Badge from "../../components/ui/Badge";
import { carService } from "../../services/carService";
import { formatPrice } from "../../utils/formatPrice";

const tabs = ["all", "available", "sold", "reserved", "pending"];

export default function AdminCars() {
  const [cars, setCars] = useState([]);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const load = () => carService.adminAll({ limit: 100 }).then((data) => setCars(data.cars || []));
  useEffect(() => { document.title = "Admin Cars | JK Autos"; load(); }, []);

  const filtered = useMemo(() => cars.filter((car) => (status === "all" || car.status === status) && (!search || `${car.title} ${car.vin}`.toLowerCase().includes(search.toLowerCase()))), [cars, status, search]);
  const markSold = async (id) => { await carService.updateStatus(id, "sold"); toast.success("Marked sold"); load(); };
  const remove = async (id) => { await carService.remove(id); toast.success("Car deleted"); load(); };
  const bulkSold = () => Promise.all(selected.map((id) => carService.updateStatus(id, "sold"))).then(() => { toast.success("Bulk status updated"); setSelected([]); load(); });
  const bulkDelete = () => Promise.all(selected.map((id) => carService.remove(id))).then(() => { toast.success("Bulk delete complete"); setSelected([]); load(); });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Inventory</p><h1 className="page-title">Cars</h1></div><Link to="/admin/cars/add" className="primary-btn"><Plus className="h-4 w-4" /> Add New Car</Link></div>
      <div className="my-6 flex flex-wrap gap-3"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" /><input className="input w-72 pl-10" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title/VIN" /></div>{tabs.map((item) => <button key={item} className={`tab-btn ${status === item ? "active" : ""}`} onClick={() => setStatus(item)}>{item}</button>)}</div>
      {selected.length > 0 && <div className="mb-4 flex gap-3"><button className="secondary-btn" onClick={bulkSold}>Mark sold</button><button className="secondary-btn" onClick={bulkDelete}>Delete</button></div>}
      <div className="overflow-x-auto"><table className="admin-table"><thead><tr><th></th><th>Image</th><th>Title</th><th>Brand</th><th>Year</th><th>Price</th><th>Condition</th><th>Status</th><th>Views</th><th>Saves</th><th>Actions</th></tr></thead><tbody>{filtered.map((car) => <tr key={car.id}><td><input type="checkbox" checked={selected.includes(car.id)} onChange={(event) => setSelected(event.target.checked ? [...selected, car.id] : selected.filter((id) => id !== car.id))} /></td><td><img src={car.images?.[0]} alt="" /></td><td>{car.title}</td><td>{car.brand}</td><td>{car.year}</td><td>{formatPrice(car.price)}</td><td>{car.condition}</td><td><Badge tone={car.status}>{car.status}</Badge></td><td>{car.views}</td><td>{car.saves}</td><td><div className="flex gap-2"><Link className="icon-btn" to={`/admin/cars/${car.id}/edit`}><Edit className="h-4 w-4" /></Link><button className="icon-btn" onClick={() => markSold(car.id)}>Sold</button><button className="icon-btn" onClick={() => remove(car.id)}><Trash2 className="h-4 w-4" /></button></div></td></tr>)}</tbody></table></div>
    </div>
  );
}
