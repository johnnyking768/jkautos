import { HeartOff } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CarCard from "../../components/ui/CarCard";
import { savedService } from "../../services/savedService";

export default function SavedCars() {
  const [cars, setCars] = useState([]);
  const [brand, setBrand] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    document.title = "Saved Cars | JK Autos";
    savedService.mine().then((data) => setCars(data.cars || []));
  }, []);

  const filtered = useMemo(() => cars.filter((car) => (!brand || car.brand === brand) && (!body || car.body_type === body)), [cars, brand, body]);
  const brands = [...new Set(cars.map((car) => car.brand))];
  const bodies = [...new Set(cars.map((car) => car.body_type))];

  return (
    <div>
      <p className="eyebrow">Saved inventory</p><h1 className="page-title">Saved Cars</h1>
      <div className="my-6 flex flex-wrap gap-3">
        <select className="input w-52" value={brand} onChange={(event) => setBrand(event.target.value)}><option value="">All brands</option>{brands.map((item) => <option key={item}>{item}</option>)}</select>
        <select className="input w-52" value={body} onChange={(event) => setBody(event.target.value)}><option value="">All body types</option>{bodies.map((item) => <option key={item}>{item}</option>)}</select>
      </div>
      {filtered.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.map((car) => <CarCard key={car.id} car={car} />)}</div> : <div className="empty-state"><HeartOff className="h-12 w-12 text-red-500" /><h2>No Saved Cars Yet</h2></div>}
    </div>
  );
}
