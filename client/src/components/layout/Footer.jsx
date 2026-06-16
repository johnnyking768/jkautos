import { Camera, Globe, Mail, MapPin, MessageCircle, Phone, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function Footer() {
  const subscribe = async (event) => {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    try {
      await api.post("/newsletter", { email });
      toast.success("You will receive new arrival alerts");
      event.currentTarget.reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not subscribe");
    }
  };

  return (
    <footer id="contact" className="border-t border-white/10 bg-black">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link to="/" className="font-display text-3xl font-black tracking-[.12em]">
            J<span className="text-red-600">K</span> AUTOS
          </Link>
          <p className="mt-4 max-w-sm text-zinc-400">Drive Your Dreams With JK Autos. Verified premium cars, clear documentation, and delivery support across Nigeria.</p>
          <div className="mt-6 flex gap-3">
            {[Globe, Camera, MessageCircle, Share2].map((Icon, index) => (
              <button key={index} className="icon-btn" aria-label="Social media">
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="footer-title">Company</h3>
          <Link to="/brands">Brands</Link>
          <Link to="/cars">Inventory</Link>
          <Link to="/compare">Compare</Link>
          <Link to="/register">Create Account</Link>
        </div>
        <div>
          <h3 className="footer-title">Services</h3>
          <Link to="/cars?installment_available=true">Installments</Link>
          <Link to="/dashboard/inspections">Inspections</Link>
          <Link to="/dashboard/test-drives">Test Drives</Link>
          <Link to="/admin">Admin Portal</Link>
        </div>
        <div>
          <h3 className="footer-title">Contact</h3>
          <p><Phone className="mr-2 inline h-4 w-4 text-red-500" /> +234 8121638903</p>
          <p><Mail className="mr-2 inline h-4 w-4 text-red-500" /> sales@jkautos.com</p>
          <p><MapPin className="mr-2 inline h-4 w-4 text-red-500" /> Lagos, Nigeria</p>
          <form className="mt-5 flex gap-2" onSubmit={subscribe}>
            <input name="email" type="email" required className="input" placeholder="Email alerts" />
            <button className="primary-btn">Join</button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-sm text-zinc-500">Copyright 2024 JK Autos. All rights reserved.</div>
    </footer>
  );
}
