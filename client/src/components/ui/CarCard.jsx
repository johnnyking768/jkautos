import { Heart, Scale, Star, Gauge, Fuel, Calendar, Palette } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Badge from "./Badge";
import { formatPrice } from "../../utils/formatPrice";
import { formatMileage } from "../../utils/formatMileage";
import { useContext } from "react";
import { CompareContext } from "../../context/CompareContext";
import { savedService } from "../../services/savedService";
import { useAuth } from "../../hooks/useAuth";

export default function CarCard({ car, showCompare = true, showSave = true, layout = "grid" }) {
  const { addToCompare, compareList } = useContext(CompareContext);
  const { user } = useAuth();
  const isCompared = compareList.some((item) => item.id === car.id);
  const image = car.images?.[0] || "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format&fit=crop";

  const saveCar = async (event) => {
    event.preventDefault();
    if (!user) return toast.error("Login to save cars");
    try {
      const data = await savedService.toggle(car.id);
      toast.success(data.saved ? "Saved to your garage" : "Removed from saved cars");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save car");
    }
  };

  const compare = (event) => {
    event.preventDefault();
    addToCompare(car);
  };

  return (
    <Link to={`/cars/${car.slug}`} className={`car-card group relative block bg-[#111] ${layout === "list" ? "md:flex" : ""}`}>
      {car.status === "sold" && <div className="sold-overlay">SOLD</div>}
      <div className={`${layout === "list" ? "md:w-80" : "h-60"} relative overflow-hidden bg-zinc-950`}>
        <img src={image} alt={car.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {car.is_featured && (
            <Badge tone="featured">
              <Star className="mr-1 h-3 w-3" /> Featured
            </Badge>
          )}
          {car.status === "available" && <Badge>Available Now</Badge>}
        </div>
        {showSave && (
          <button className="icon-btn absolute right-3 top-3" onClick={saveCar} aria-label="Save car" title="Save car">
            <Heart className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-center gap-2">
          <Badge tone={car.condition}>{car.condition}</Badge>
          <span className="font-data text-xs uppercase text-zinc-500">{car.body_type}</span>
        </div>
        <div>
          <h3 className="line-clamp-2 font-display text-xl font-black uppercase text-white">{car.title}</h3>
          <p className="price-tag mt-2 text-2xl">{formatPrice(car.discounted_price || car.price)}</p>
          {car.discounted_price && <p className="font-data text-sm text-zinc-500 line-through">{formatPrice(car.price)}</p>}
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm text-zinc-300">
          <span className="spec-badge"><Calendar className="mr-1 inline h-3.5 w-3.5" />{car.year}</span>
          <span className="spec-badge"><Gauge className="mr-1 inline h-3.5 w-3.5" />{formatMileage(car.mileage)}</span>
          <span className="spec-badge"><Fuel className="mr-1 inline h-3.5 w-3.5" />{car.fuel_type}</span>
          <span className="spec-badge"><Palette className="mr-1 inline h-3.5 w-3.5" />{car.color}</span>
        </div>
        <div className="mt-auto flex items-center gap-3">
          {showCompare && (
            <button className={`secondary-btn flex-1 ${isCompared ? "border-emerald-500 text-emerald-400" : ""}`} onClick={compare}>
              <Scale className="h-4 w-4" /> {isCompared ? "Selected" : "Compare"}
            </button>
          )}
          <span className="primary-btn flex-1 text-center">View Details</span>
        </div>
      </div>
    </Link>
  );
}
