import { Eye, EyeOff } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

export default function RegisterPage() {
  const { register, user } = useAuth();
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const strength = useMemo(() => Math.min([/[A-Z]/, /[a-z]/, /[0-9]/, /.{8,}/].filter((rule) => rule.test(password)).length, 4), [password]);

  useEffect(() => {
    document.title = "Register | JK Autos";
  }, []);

  if (user) return <Navigate to="/dashboard" />;

  const submit = async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    if (payload.password !== payload.confirm_password) return setError("Passwords do not match");
    try {
      await register(payload);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <img src="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&auto=format&fit=crop" alt="JK Autos premium car" />
        <div><p className="eyebrow">Join the garage</p><h1>Create Account</h1></div>
      </section>
      <section className="auth-form">
        <form onSubmit={submit} className="w-full max-w-md">
          <h2 className="font-display text-3xl font-black uppercase">Register</h2>
          <p className="mt-2 text-zinc-400">Save cars, book inspections, and manage payments.</p>
          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <input className="input sm:col-span-2" name="name" placeholder="Full name" required />
            <input className="input sm:col-span-2" name="email" type="email" placeholder="Email" required />
            <input className="input" name="phone" placeholder="Phone" />
            <input className="input" name="city" placeholder="City" />
            <div className="relative sm:col-span-2">
              <input className="input pr-12" name="password" type={show ? "text" : "password"} placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} required />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" onClick={() => setShow((value) => !value)}>{show ? <EyeOff /> : <Eye />}</button>
            </div>
            <input className="input sm:col-span-2" name="confirm_password" type={show ? "text" : "password"} placeholder="Confirm password" required />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">{[1, 2, 3, 4].map((step) => <span key={step} className={`h-1 ${strength >= step ? "bg-red-600" : "bg-zinc-800"}`} />)}</div>
          <button className="primary-btn mt-6 h-12 w-full">Register</button>
          <p className="mt-5 text-sm text-zinc-400">Already have an account? <Link className="text-red-500" to="/login">Login</Link></p>
        </form>
      </section>
    </main>
  );
}
