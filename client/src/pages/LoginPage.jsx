import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { login, user } = useAuth();
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Login | JK Autos";
  }, []);

  if (user) return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} />;

  const submit = async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    if (!payload.email || !payload.password) return setErrors({ form: "Email and password are required" });
    setLoading(true);
    try {
      await login(payload);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      setErrors({ form: error.response?.data?.message || "Login failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <img src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format&fit=crop" alt="JK Autos luxury car" />
        <div><p className="eyebrow">Member access</p><h1>Welcome Back</h1></div>
      </section>
      <section className="auth-form">
        <form onSubmit={submit} className="w-full max-w-md">
          <h2 className="font-display text-3xl font-black uppercase">Login</h2>
          <p className="mt-2 text-zinc-400">Access saved cars, inspections, messages, and admin tools.</p>
          {errors.form && <p className="mt-4 text-sm text-red-400">{errors.form}</p>}
          <label className="mt-8 block"><span className="filter-label">Email</span><input className="input" name="email" type="email" defaultValue="admin@jkautos.com" /></label>
          <label className="mt-4 block"><span className="filter-label">Password</span><div className="relative"><input className="input pr-12" name="password" type={show ? "text" : "password"} defaultValue="Admin@12345" /><button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" onClick={() => setShow((value) => !value)}>{show ? <EyeOff /> : <Eye />}</button></div></label>
          <label className="mt-4 flex items-center gap-2 text-sm text-zinc-400"><input type="checkbox" name="remember" /> Remember me</label>
          <button className="primary-btn mt-6 h-12 w-full" disabled={loading}>{loading ? "Logging in" : "Login"}</button>
          <p className="mt-5 text-sm text-zinc-400">New to JK Autos? <Link className="text-red-500" to="/register">Create an account</Link></p>
        </form>
      </section>
    </main>
  );
}
