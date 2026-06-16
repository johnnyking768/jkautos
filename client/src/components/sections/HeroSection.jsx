import { ArrowDown, CalendarClock } from "lucide-react";
import { Link } from "react-router-dom";
import SearchBar from "../ui/SearchBar";

export default function HeroSection() {
  return (
    <section className="hero-section relative flex min-h-screen items-center overflow-hidden pt-24">
      <div className="speed-lines" />
      <div className="hero-spotlight" />
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 pb-16 lg:grid-cols-[1.05fr_.95fr]">
        <div className="relative z-10">
          <p className="eyebrow">Nigeria's Premium Car Dealership</p>
          <h1 className="mt-5 font-display text-5xl font-black uppercase leading-none text-white sm:text-7xl lg:text-8xl">
            Drive Your <span className="block text-red-600 text-stroke">Dream Car</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-zinc-300">
            Discover our exclusive collection of luxury, sports, and everyday vehicles. Premium quality. Unbeatable prices.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/cars" className="primary-btn h-12 px-6">Browse Inventory</Link>
            <Link to="/dashboard/test-drives" className="secondary-btn h-12 px-6"><CalendarClock className="h-4 w-4" /> Book Test Drive</Link>
          </div>
          <div className="mt-10">
            <SearchBar />
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {["500+ Cars", "10+ Brands", "5,000+ Customers", "100% Verified"].map((item) => (
              <div key={item} className="border border-white/10 bg-black/50 p-4">
                <p className="font-display text-lg font-black text-white">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 hidden min-h-[520px] lg:block">
          <img
            src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1400&auto=format&fit=crop"
            alt="Premium black sports car at JK Autos"
            className="absolute inset-0 h-full w-full object-cover shadow-2xl shadow-red-950/40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
          <div className="absolute bottom-6 left-6 border border-red-700 bg-black/80 p-5">
            <p className="font-data text-sm text-red-500">LIVE INVENTORY</p>
            <p className="font-display text-3xl font-black">LAGOS STUDIO</p>
          </div>
        </div>
      </div>
      <a href="#featured" className="absolute bottom-5 left-1/2 -translate-x-1/2 text-red-500" aria-label="Scroll to featured vehicles">
        <ArrowDown className="h-7 w-7 animate-bounce" />
      </a>
    </section>
  );
}
