import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ImageUploader from "../../components/ui/ImageUploader";
import { carService } from "../../services/carService";

const steps = ["Basic Info", "Specs", "Features", "Location & Settings", "Photos"];
const featureOptions = ["Air Conditioning", "Leather Seats", "Sunroof", "Navigation System", "Bluetooth", "Backup Camera", "Parking Sensors", "Cruise Control", "Heated Seats", "Apple CarPlay/Android Auto", "Push Start", "Keyless Entry", "Lane Assist", "Blind Spot Monitor", "Adaptive Cruise Control", "360 Camera", "Premium Sound System", "Wireless Charging", "Ventilated Seats", "Head-Up Display", "Night Vision", "Massage Seats", "Air Suspension"];

export default function CarForm({ initial = null }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initial || { brand: "", model: "", year: new Date().getFullYear(), condition: "new", body_type: "suv", transmission: "automatic", fuel_type: "petrol", drivetrain: "awd", status: "available", features: [], images: [], is_featured: false, is_negotiable: true, installment_available: false });

  useEffect(() => {
    if (!form.title && form.year && form.brand && form.model) setForm((current) => ({ ...current, title: `${current.year} ${current.brand} ${current.model}` }));
  }, [form.year, form.brand, form.model, form.title]);

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const input = (key) => ({ value: form[key] || "", onChange: (event) => set(key, event.target.value) });
  const numberInput = (key) => ({ value: form[key] || "", onChange: (event) => set(key, Number(event.target.value)) });
  const toggleFeature = (feature) => set("features", form.features?.includes(feature) ? form.features.filter((item) => item !== feature) : [...(form.features || []), feature]);

  const submit = async () => {
    try {
      if (initial?.id) await carService.update(initial.id, form);
      else await carService.create(form);
      toast.success(initial?.id ? "Car updated" : "Car added");
      navigate("/admin/cars");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save car");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="mb-3 h-2 bg-zinc-900"><div className="h-full bg-red-700 transition-all" style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
        <div className="flex flex-wrap gap-2">{steps.map((item, index) => <button key={item} className={`tab-btn ${step === index ? "active" : ""}`} onClick={() => setStep(index)}>{index + 1}. {item}</button>)}</div>
      </div>
      <div className="glass-dark p-5">
        {step === 0 && <div className="grid gap-4 md:grid-cols-2"><input className="input" placeholder="Brand" {...input("brand")} /><input className="input" placeholder="Model" {...input("model")} /><input className="input" type="number" placeholder="Year" {...numberInput("year")} /><select className="input" {...input("condition")}><option value="new">New</option><option value="used">Used</option><option value="certified">Certified</option></select><select className="input" {...input("body_type")}><option value="sedan">Sedan</option><option value="suv">SUV</option><option value="coupe">Coupe</option><option value="convertible">Convertible</option><option value="truck">Truck</option><option value="luxury">Luxury</option></select><input className="input md:col-span-2" placeholder="Title" {...input("title")} /></div>}
        {step === 1 && <div className="grid gap-4 md:grid-cols-3"><input className="input" type="number" placeholder="Price" {...numberInput("price")} /><input className="input" type="number" placeholder="Discounted price" {...numberInput("discounted_price")} /><select className="input" {...input("transmission")}><option>automatic</option><option>manual</option><option>semi-automatic</option><option>cvt</option></select><select className="input" {...input("fuel_type")}><option>petrol</option><option>diesel</option><option>electric</option><option>hybrid</option></select><input className="input" placeholder="Engine size" {...input("engine_size")} /><input className="input" type="number" placeholder="Horsepower" {...numberInput("horsepower")} /><input className="input" placeholder="Torque" {...input("torque")} /><select className="input" {...input("drivetrain")}><option>fwd</option><option>rwd</option><option>awd</option><option>4wd</option></select><input className="input" type="number" placeholder="Mileage" {...numberInput("mileage")} /><input className="input" placeholder="Color" {...input("color")} /><input className="input" placeholder="Interior color" {...input("interior_color")} /><input className="input" type="number" placeholder="Doors" {...numberInput("doors")} /><input className="input" type="number" placeholder="Seats" {...numberInput("seats")} /><input className="input" placeholder="VIN" {...input("vin")} /></div>}
        {step === 2 && <div className="grid gap-3 md:grid-cols-3">{featureOptions.map((feature) => <label key={feature} className="check-row"><input type="checkbox" checked={form.features?.includes(feature)} onChange={() => toggleFeature(feature)} />{feature}</label>)}</div>}
        {step === 3 && <div className="grid gap-4"><input className="input" placeholder="Location" {...input("location")} /><textarea className="input min-h-40" placeholder="Description" {...input("description")} /><div className="grid gap-3 md:grid-cols-4"><label className="check-row"><input type="checkbox" checked={form.is_featured} onChange={(event) => set("is_featured", event.target.checked)} />Featured</label><label className="check-row"><input type="checkbox" checked={form.is_negotiable} onChange={(event) => set("is_negotiable", event.target.checked)} />Negotiable</label><label className="check-row"><input type="checkbox" checked={form.installment_available} onChange={(event) => set("installment_available", event.target.checked)} />Installments</label><select className="input" {...input("status")}><option>available</option><option>sold</option><option>reserved</option><option>pending</option></select></div></div>}
        {step === 4 && <div><ImageUploader value={form.images || []} onChange={(images) => set("images", images)} /><input className="input mt-4" placeholder="YouTube/video URL" {...input("video_url")} /></div>}
        <div className="mt-8 flex justify-between gap-3"><button className="secondary-btn" disabled={step === 0} onClick={() => setStep((value) => Math.max(value - 1, 0))}>Back</button>{step < steps.length - 1 ? <button className="primary-btn" onClick={() => setStep((value) => value + 1)}>Next</button> : <button className="primary-btn" onClick={submit}>Submit Car</button>}</div>
      </div>
    </div>
  );
}
