import { RotateCcw } from "lucide-react";

const brands = ["Toyota", "Honda", "Mercedes-Benz", "BMW", "Lexus", "Ford", "Chevrolet", "Audi", "Porsche", "Range Rover", "Tesla", "Hyundai", "Kia", "Nissan"];
const bodyTypes = ["sedan", "suv", "coupe", "convertible", "truck", "sports", "luxury"];
const fuels = ["petrol", "diesel", "electric", "hybrid"];
const transmissions = ["automatic", "manual", "semi-automatic", "cvt"];
const drivetrains = ["fwd", "rwd", "awd", "4wd"];

export default function FilterPanel({ filters, onChange, onClear }) {
  const set = (key, value) => onChange({ ...filters, [key]: value || undefined, page: 1 });

  return (
    <aside className="glass-dark sticky top-24 h-fit p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-lg font-black uppercase">Filters</h2>
        <button className="icon-btn" onClick={onClear} title="Clear filters" aria-label="Clear filters"><RotateCcw className="h-4 w-4" /></button>
      </div>

      <div className="space-y-5">
        <label className="block">
          <span className="filter-label">Brand</span>
          <select className="input" value={filters.brand || ""} onChange={(event) => set("brand", event.target.value)}>
            <option value="">All brands</option>
            {brands.map((brand) => <option key={brand}>{brand}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="filter-label">Body Type</span>
          <select className="input" value={filters.body_type || ""} onChange={(event) => set("body_type", event.target.value)}>
            <option value="">All body types</option>
            {bodyTypes.map((type) => <option key={type} value={type}>{type.toUpperCase()}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="filter-label">Condition</span>
          <div className="segmented">
            {["", "new", "used", "certified"].map((item) => (
              <button key={item || "all"} type="button" className={filters.condition === item || (!filters.condition && !item) ? "active" : ""} onClick={() => set("condition", item)}>
                {item || "All"}
              </button>
            ))}
          </div>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <input className="input" type="number" placeholder="Min price" value={filters.min_price || ""} onChange={(event) => set("min_price", event.target.value)} />
          <input className="input" type="number" placeholder="Max price" value={filters.max_price || ""} onChange={(event) => set("max_price", event.target.value)} />
          <input className="input" type="number" placeholder="Min year" value={filters.min_year || ""} onChange={(event) => set("min_year", event.target.value)} />
          <input className="input" type="number" placeholder="Max mileage" value={filters.max_mileage || ""} onChange={(event) => set("max_mileage", event.target.value)} />
        </div>
        <label className="block">
          <span className="filter-label">Fuel Type</span>
          <div className="grid grid-cols-2 gap-2">
            {fuels.map((fuel) => (
              <label key={fuel} className="check-row"><input type="checkbox" checked={filters.fuel_type === fuel} onChange={(event) => set("fuel_type", event.target.checked ? fuel : "")} />{fuel}</label>
            ))}
          </div>
        </label>
        <label className="block">
          <span className="filter-label">Transmission</span>
          <select className="input" value={filters.transmission || ""} onChange={(event) => set("transmission", event.target.value)}>
            <option value="">Any</option>
            {transmissions.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="filter-label">Drivetrain</span>
          <div className="grid grid-cols-2 gap-2">
            {drivetrains.map((drive) => (
              <label key={drive} className="check-row"><input type="checkbox" checked={filters.drivetrain === drive} onChange={(event) => set("drivetrain", event.target.checked ? drive : "")} />{drive.toUpperCase()}</label>
            ))}
          </div>
        </label>
      </div>
    </aside>
  );
}
