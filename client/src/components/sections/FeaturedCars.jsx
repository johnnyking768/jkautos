import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { carService } from "../../services/carService";
import CarCard from "../ui/CarCard";
import CarCardSkeleton from "../ui/CarCardSkeleton";

const tabs = ["All", "New", "Used", "Certified", "Electric", "Luxury"];

export default function FeaturedCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("All");

  useEffect(() => {
    carService
      .getFeatured()
      .then((data) => setCars(data.cars || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (tab === "All") return cars;
    if (tab === "Electric") return cars.filter((car) => car.fuel_type === "electric");
    if (tab === "Luxury") return cars.filter((car) => ["Mercedes-Benz", "BMW", "Lexus", "Porsche", "Range Rover"].includes(car.brand));
    return cars.filter((car) => car.condition === tab.toLowerCase());
  }, [cars, tab]);

  return (
    <section id="featured" className="section">
      <div className="section-heading">
        <p className="eyebrow">Verified inventory</p>
        <h2>Featured Vehicles</h2>
      </div>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {tabs.map((item) => (
          <button key={item} className={`tab-btn ${tab === item ? "active" : ""}`} onClick={() => setTab(item)}>{item}</button>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {loading ? Array.from({ length: 4 }).map((_, index) => <CarCardSkeleton key={index} />) : filtered.slice(0, 8).map((car) => <CarCard key={car.id} car={car} />)}
      </div>
      <div className="mt-10 text-center">
        <Link to="/cars" className="secondary-btn px-7">View All Inventory</Link>
      </div>
    </section>
  );
}
