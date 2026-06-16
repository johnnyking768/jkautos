import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../components/ui/Loader";
import { carService } from "../../services/carService";
import CarForm from "./CarForm";

export default function EditCar() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carService.getSingle(id).then((data) => setCar(data.car)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  return (
    <div>
      <p className="eyebrow">Inventory</p>
      <h1 className="page-title">Edit Car</h1>
      <div className="mt-8"><CarForm initial={car} /></div>
    </div>
  );
}
