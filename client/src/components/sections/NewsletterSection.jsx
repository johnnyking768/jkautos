import { Mail } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function NewsletterSection() {
  const submit = async (event) => {
    event.preventDefault();
    try {
      await api.post("/newsletter", { email: new FormData(event.currentTarget).get("email") });
      toast.success("New arrival alerts activated");
      event.currentTarget.reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not subscribe");
    }
  };

  return (
    <section className="section pt-6">
      <div className="glass-dark mx-auto max-w-4xl p-6 md:p-8">
        <div className="mb-5 flex items-center gap-3">
          <Mail className="h-6 w-6 text-red-500" />
          <h2 className="font-display text-2xl font-black uppercase">Get Alerts For New Arrivals</h2>
        </div>
        <form className="flex flex-col gap-3 sm:flex-row" onSubmit={submit}>
          <input name="email" type="email" required className="input" placeholder="Email address" />
          <button className="primary-btn h-12 px-6">Subscribe</button>
        </form>
      </div>
    </section>
  );
}
