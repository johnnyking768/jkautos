import { Grid2X2, List, SearchX, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CarCard from "../components/ui/CarCard";
import CarCardSkeleton from "../components/ui/CarCardSkeleton";
import FilterPanel from "../components/ui/FilterPanel";
import SearchBar from "../components/ui/SearchBar";
import { carService } from "../services/carService";

const paramsToObject = (params) => Object.fromEntries([...params.entries()].filter(([, value]) => value));

export default function CarsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(paramsToObject(searchParams));
  const [view, setView] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ cars: [], total: 0, page: 1, totalPages: 1 });

  useEffect(() => {
    document.title = "Inventory | JK Autos";
  }, []);

  useEffect(() => {
    const next = paramsToObject(searchParams);
    setFilters(next);
    setLoading(true);
    carService
      .getCars(next)
      .then(setData)
      .finally(() => setLoading(false));
  }, [searchParams]);

  const updateFilters = (next) => setSearchParams(Object.fromEntries(Object.entries(next).filter(([, value]) => value)));
  const active = useMemo(() => Object.entries(filters).filter(([key, value]) => value && key !== "page" && key !== "limit"), [filters]);

  return (
    <main className="page-shell">
      <div className="mx-auto max-w-7xl px-4">
        <div className="breadcrumb">Home / Cars / Inventory</div>
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Verified Inventory</p>
            <h1 className="page-title">Find Your Next Car</h1>
          </div>
          <div className="min-w-0 lg:w-[560px]"><SearchBar compact onSearch={updateFilters} /></div>
        </div>
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <FilterPanel filters={filters} onChange={updateFilters} onClear={() => setSearchParams({})} />
          <section>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="font-data text-sm text-zinc-400">{data.total} results</p>
              <div className="flex items-center gap-2">
                <select className="input w-44" value={filters.sort || "newest"} onChange={(event) => updateFilters({ ...filters, sort: event.target.value })}>
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price Low</option>
                  <option value="price_desc">Price High</option>
                  <option value="mileage_asc">Lowest Mileage</option>
                  <option value="popular">Popular</option>
                </select>
                <button className={`icon-btn ${view === "grid" ? "border-red-700 text-red-500" : ""}`} onClick={() => setView("grid")} aria-label="Grid view"><Grid2X2 className="h-4 w-4" /></button>
                <button className={`icon-btn ${view === "list" ? "border-red-700 text-red-500" : ""}`} onClick={() => setView("list")} aria-label="List view"><List className="h-4 w-4" /></button>
              </div>
            </div>
            {active.length > 0 && (
              <div className="mb-5 flex flex-wrap gap-2">
                {active.map(([key, value]) => (
                  <button key={key} className="chip" onClick={() => updateFilters({ ...filters, [key]: undefined })}>{key}: {value}<X className="h-3 w-3" /></button>
                ))}
              </div>
            )}
            {loading ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <CarCardSkeleton key={index} />)}</div>
            ) : data.cars.length === 0 ? (
              <div className="empty-state"><SearchX className="h-12 w-12 text-red-500" /><h2>No Cars Found</h2><p>Adjust filters or clear them to see more JK Autos inventory.</p></div>
            ) : (
              <div className={view === "grid" ? "grid gap-5 md:grid-cols-2 xl:grid-cols-3" : "space-y-5"}>
                {data.cars.map((car) => <CarCard key={car.id} car={car} layout={view} />)}
              </div>
            )}
            <div className="mt-8 flex items-center justify-center gap-3">
              <button className="secondary-btn" disabled={Number(data.page) <= 1} onClick={() => updateFilters({ ...filters, page: Number(data.page) - 1 })}>Prev</button>
              <span className="font-data text-sm text-zinc-400">Page {data.page} of {data.totalPages}</span>
              <button className="secondary-btn" disabled={Number(data.page) >= Number(data.totalPages)} onClick={() => updateFilters({ ...filters, page: Number(data.page) + 1 })}>Next</button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
