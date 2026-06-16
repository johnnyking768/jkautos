import { Plus, Trash2 } from "lucide-react";
import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { CompareContext } from "../context/CompareContext";
import { formatMileage } from "../utils/formatMileage";
import { formatPrice } from "../utils/formatPrice";

const rows = [
  ["Price", "price", (car) => formatPrice(car.discounted_price || car.price), "lower"],
  ["Year", "year", (car) => car.year, "higher"],
  ["Mileage", "mileage", (car) => formatMileage(car.mileage), "lower"],
  ["Engine", "engine_size", (car) => car.engine_size],
  ["HP", "horsepower", (car) => car.horsepower, "higher"],
  ["Transmission", "transmission", (car) => car.transmission],
  ["Fuel", "fuel_type", (car) => car.fuel_type],
  ["Drivetrain", "drivetrain", (car) => car.drivetrain?.toUpperCase()],
  ["Body Type", "body_type", (car) => car.body_type],
  ["Seats", "seats", (car) => car.seats, "higher"],
  ["Color", "color", (car) => car.color],
];

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useContext(CompareContext);

  useEffect(() => {
    document.title = "Compare Cars | JK Autos";
  }, []);

  const highlight = (row, car) => {
    if (!row[3] || compareList.length < 2) return "";
    const values = compareList.map((item) => Number(item[row[1]] || 0));
    const best = row[3] === "lower" ? Math.min(...values) : Math.max(...values);
    const worst = row[3] === "lower" ? Math.max(...values) : Math.min(...values);
    if (Number(car[row[1]]) === best) return "text-emerald-400";
    if (Number(car[row[1]]) === worst) return "text-red-400";
    return "";
  };

  return (
    <main className="page-shell">
      <div className="mx-auto max-w-7xl px-4">
        <div className="breadcrumb">Home / Compare</div>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Side by side</p>
            <h1 className="page-title">Compare Vehicles</h1>
          </div>
          {compareList.length > 0 && <button className="secondary-btn" onClick={clearCompare}><Trash2 className="h-4 w-4" /> Clear All</button>}
        </div>
        {compareList.length === 0 ? (
          <div className="empty-state"><Plus className="h-12 w-12 text-red-500" /><h2>No Cars Selected</h2><Link to="/cars" className="primary-btn">Add Cars</Link></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="compare-table">
              <thead>
                <tr>
                  <th>Spec</th>
                  {compareList.map((car) => (
                    <th key={car.id}>
                      <img src={car.images?.[0]} alt={car.title} />
                      <p>{car.title}</p>
                      <button onClick={() => removeFromCompare(car.id)}>Remove</button>
                    </th>
                  ))}
                  {compareList.length < 3 && <th><Link to="/cars" className="secondary-btn">Add Car</Link></th>}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row[0]}>
                    <td>{row[0]}</td>
                    {compareList.map((car) => <td key={car.id} className={highlight(row, car)}>{row[2](car)}</td>)}
                    {compareList.length < 3 && <td />}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
