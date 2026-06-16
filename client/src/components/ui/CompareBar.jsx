import { X, Scale } from "lucide-react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { CompareContext } from "../../context/CompareContext";

export default function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useContext(CompareContext);
  if (compareList.length < 2) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-red-900/70 bg-black/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 font-display text-sm uppercase tracking-[.2em] text-white">
          <Scale className="h-4 w-4 text-red-500" /> Compare
        </div>
        <div className="flex flex-1 gap-2 overflow-x-auto">
          {compareList.map((car) => (
            <div key={car.id} className="flex min-w-52 items-center gap-2 border border-white/10 bg-zinc-950 p-2">
              <img src={car.images?.[0]} alt={car.title} className="h-10 w-14 object-cover" />
              <span className="line-clamp-1 text-sm">{car.title}</span>
              <button onClick={() => removeFromCompare(car.id)} aria-label={`Remove ${car.title}`}>
                <X className="h-4 w-4 text-zinc-400" />
              </button>
            </div>
          ))}
        </div>
        <Link to="/compare" className="primary-btn">
          Compare Now
        </Link>
        <button className="secondary-btn" onClick={clearCompare}>Clear All</button>
      </div>
    </div>
  );
}
