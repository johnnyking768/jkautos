import { CarFront } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 pt-20">
      <div className="max-w-xl text-center">
        <CarFront className="mx-auto h-20 w-20 text-red-600" />
        <p className="mt-6 font-display text-8xl font-black text-red-700">404</p>
        <h1 className="mt-3 font-display text-4xl font-black uppercase">Car Not Found</h1>
        <p className="mt-4 text-zinc-400">That route has left the showroom. Return to verified JK Autos inventory.</p>
        <Link to="/cars" className="primary-btn mt-8 inline-flex">Back To Inventory</Link>
      </div>
    </main>
  );
}
