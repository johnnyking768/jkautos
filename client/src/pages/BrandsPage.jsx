import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { carService } from "../services/carService";

const luxury = ["Mercedes-Benz", "BMW", "Lexus", "Porsche", "Range Rover", "Bentley", "Rolls-Royce", "Ferrari", "Lamborghini"];

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [sort, setSort] = useState("Most Cars");

  useEffect(() => {
    document.title = "Brands | JK Autos";
    carService.getBrands().then((data) => setBrands(data.brands || []));
  }, []);

  const sorted = useMemo(() => {
    const list = [...brands];
    if (sort === "Alphabetical") list.sort((a, b) => a.brand.localeCompare(b.brand));
    if (sort === "Luxury") list.sort((a, b) => Number(luxury.includes(b.brand)) - Number(luxury.includes(a.brand)));
    if (sort === "Economy") list.sort((a, b) => Number(luxury.includes(a.brand)) - Number(luxury.includes(b.brand)));
    if (sort === "Most Cars") list.sort((a, b) => b.count - a.count);
    return list;
  }, [brands, sort]);

  return (
    <main className="page-shell">
      <div className="mx-auto max-w-7xl px-4">
        <div className="breadcrumb">Home / Brands</div>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">All marques</p>
            <h1 className="page-title">Brands At JK Autos</h1>
          </div>
          <select className="input w-52" value={sort} onChange={(event) => setSort(event.target.value)}>
            {["Most Cars", "Alphabetical", "Luxury", "Economy"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sorted.map((brand) => (
            <div key={brand.brand} className="glass-dark p-6">
              <p className="font-display text-2xl font-black uppercase">{brand.brand}</p>
              <p className="mt-3 font-data text-red-500">{brand.count} available</p>
              <Link className="primary-btn mt-6 w-full" to={`/cars?brand=${encodeURIComponent(brand.brand)}`}>View Cars</Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
