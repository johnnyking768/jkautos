import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-7xl border border-red-800 bg-[linear-gradient(135deg,#210000,#080808_55%,#360000)] p-8 md:p-12">
        <h2 className="font-display text-4xl font-black uppercase md:text-6xl">Ready To Find Your Car?</h2>
        <p className="mt-4 max-w-2xl text-zinc-300">Browse verified premium vehicles or speak with JK Autos for a guided search.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/cars" className="primary-btn h-12 px-6">Browse Inventory</Link>
          <a href="tel:+2348121638903" className="secondary-btn h-12 px-6">Contact Us</a>
        </div>
      </div>
    </section>
  );
}
