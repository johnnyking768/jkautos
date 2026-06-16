import CarForm from "./CarForm";

export default function AddCar() {
  return (
    <div>
      <p className="eyebrow">Inventory</p>
      <h1 className="page-title">Add New Car</h1>
      <div className="mt-8"><CarForm /></div>
    </div>
  );
}
