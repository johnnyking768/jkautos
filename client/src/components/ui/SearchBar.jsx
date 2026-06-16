import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

const popular = ["Mercedes-Benz", "BMW X5", "Toyota SUV", "Lexus", "Electric"];
const brands = ["Toyota", "Honda", "Mercedes-Benz", "BMW", "Lexus", "Ford", "Chevrolet", "Audi", "Porsche", "Range Rover", "Tesla"];
const bodyTypes = ["sedan", "suv", "coupe", "convertible", "truck", "sports", "luxury"];

export default function SearchBar({ compact = false, onSearch }) {
  const navigate = useNavigate();
  const [advanced, setAdvanced] = useState(false);
  const [focused, setFocused] = useState(false);
  const [form, setForm] = useState({ search: "", brand: "", body_type: "", condition: "", min_price: "", max_price: "", min_year: "", max_year: "" });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    setRecent(JSON.parse(localStorage.getItem("jkautos_recent_searches") || "[]"));
  }, []);

  const suggestions = useMemo(() => {
    const pool = [...popular, ...recent, ...brands, ...bodyTypes, "2023 Toyota Camry", "2023 Range Rover Sport"];
    if (!form.search) return [...new Set([...recent, ...popular])].slice(0, 6);
    return pool.filter((item) => item.toLowerCase().includes(form.search.toLowerCase())).slice(0, 6);
  }, [form.search, recent]);

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = (event, quickValue) => {
    event.preventDefault();
    const payload = { ...form, search: quickValue || form.search };
    const cleaned = Object.fromEntries(Object.entries(payload).filter(([, value]) => value));
    if (cleaned.search) {
      const nextRecent = [cleaned.search, ...recent.filter((item) => item !== cleaned.search)].slice(0, 5);
      localStorage.setItem("jkautos_recent_searches", JSON.stringify(nextRecent));
      setRecent(nextRecent);
    }
    onSearch?.(cleaned);
    navigate(`/cars?${new URLSearchParams(cleaned).toString()}`);
  };

  return (
    <form onSubmit={submit} className={`glass-dark relative w-full p-3 ${compact ? "" : "shadow-2xl shadow-red-950/20"}`}>
      <div className="grid gap-3 md:grid-cols-[1fr_180px_170px_auto]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-red-500" />
          <input
            name="search"
            value={form.search}
            onChange={updateField}
            onFocus={() => setFocused(true)}
            onBlur={() => window.setTimeout(() => setFocused(false), 120)}
            className="input pl-12"
            placeholder="Search models, brands, body types"
          />
          {focused && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-[110%] z-20 border border-white/10 bg-black shadow-2xl">
              {suggestions.map((item) => (
                <button key={item} type="button" className="block w-full px-4 py-3 text-left text-sm text-zinc-300 hover:bg-red-950/40" onClick={(event) => submit(event, item)}>
                  {item}
                </button>
              ))}
            </div>
          )}
        </label>
        <select name="brand" value={form.brand} onChange={updateField} className="input">
          <option value="">Brand</option>
          {brands.map((brand) => <option key={brand}>{brand}</option>)}
        </select>
        <select name="body_type" value={form.body_type} onChange={updateField} className="input">
          <option value="">Body Type</option>
          {bodyTypes.map((type) => <option key={type} value={type}>{type.toUpperCase()}</option>)}
        </select>
        <button className="primary-btn min-h-12" type="submit"><Search className="h-4 w-4" /> Search</button>
      </div>
      <button type="button" className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-[.18em] text-zinc-400 hover:text-white" onClick={() => setAdvanced((value) => !value)}>
        <SlidersHorizontal className="h-4 w-4 text-red-500" /> Advanced filters
      </button>
      {advanced && (
        <div className="mt-3 grid gap-3 border-t border-white/10 pt-3 md:grid-cols-4">
          <select name="condition" value={form.condition} onChange={updateField} className="input">
            <option value="">Condition</option>
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="certified">Certified</option>
          </select>
          <input name="min_price" value={form.min_price} onChange={updateField} className="input" type="number" placeholder="Min price" />
          <input name="max_price" value={form.max_price} onChange={updateField} className="input" type="number" placeholder="Max price" />
          <input name="min_year" value={form.min_year} onChange={updateField} className="input" type="number" placeholder="Min year" />
        </div>
      )}
    </form>
  );
}
