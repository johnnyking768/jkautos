import { Bell, Menu, Scale, User, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { CompareContext } from "../../context/CompareContext";
import { useAuth } from "../../hooks/useAuth";

const links = [
  ["Home", "/"],
  ["Cars", "/cars"],
  ["Brands", "/brands"],
  ["Compare", "/compare"],
  ["About", "/#about"],
  ["Contact", "/#contact"],
];

export default function Navbar() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const { compareList } = useContext(CompareContext);
  const { user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = (
    <>
      {links.map(([label, href]) => (
        <NavLink key={href} to={href} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={() => setOpen(false)}>
          {label}
          {label === "Compare" && compareList.length > 0 && <span className="nav-badge">{compareList.length}</span>}
        </NavLink>
      ))}
    </>
  );

  return (
    <header className={`fixed left-0 right-0 top-0 z-50 transition ${solid ? "border-b border-white/10 bg-black/95 backdrop-blur" : "bg-gradient-to-b from-black/80 to-transparent"}`}>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="font-display text-2xl font-black tracking-[.12em] text-white">
          J<span className="text-red-600">K</span> AUTOS
        </Link>
        <nav className="hidden items-center gap-7 md:flex">{nav}</nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link to="/compare" className="icon-btn" aria-label="Compare cars" title="Compare cars">
            <Scale className="h-4 w-4" />
          </Link>
          {user && (
            <button className="icon-btn" aria-label="Notifications" title="Notifications">
              <Bell className="h-4 w-4" />
            </button>
          )}
          {user ? (
            <div className="flex items-center gap-2">
              <Link to={user.role === "admin" ? "/admin" : "/dashboard"} className="secondary-btn">
                <User className="h-4 w-4" /> {user.name.split(" ")[0]}
              </Link>
              <button className="primary-btn" onClick={logout}>Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="secondary-btn">Login</Link>
              <Link to="/register" className="primary-btn">Register</Link>
            </>
          )}
        </div>
        <button className="icon-btn md:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/95 p-5 md:hidden">
          <div className="mb-8 flex items-center justify-between">
            <span className="font-display text-xl font-black">JK AUTOS</span>
            <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-5">{nav}</nav>
          <div className="mt-8 flex gap-3">
            {user ? (
              <button className="primary-btn" onClick={logout}>Logout</button>
            ) : (
              <>
                <Link to="/login" className="secondary-btn" onClick={() => setOpen(false)}>Login</Link>
                <Link to="/register" className="primary-btn" onClick={() => setOpen(false)}>Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
