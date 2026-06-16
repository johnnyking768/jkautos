import { BarChart3, CalendarCheck, Car, ClipboardList, LogOut, MessageSquare, Plus, Settings, Users, WalletCards } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const links = [
  ["Dashboard", "/admin", BarChart3],
  ["Cars", "/admin/cars", Car],
  ["Add Car", "/admin/cars/add", Plus],
  ["Inspections", "/admin/inspections", CalendarCheck],
  ["Test Drives", "/admin/test-drives", ClipboardList],
  ["Inquiries", "/admin/inquiries", MessageSquare],
  ["Customers", "/admin/customers", Users],
  ["Sales", "/admin/sales", WalletCards],
  ["Settings", "/admin/settings", Settings],
];

export default function AdminSidebar() {
  const { logout } = useAuth();

  return (
    <aside className="min-h-screen w-[260px] shrink-0 border-r border-white/10 bg-[#0b0b0b] p-5 max-lg:hidden">
      <p className="mb-6 font-display text-xl font-black">ADMIN CONTROL</p>
      <nav className="space-y-2">
        {links.map(([label, href, Icon]) => (
          <NavLink key={href} end={href === "/admin"} to={href} className={({ isActive }) => `side-link ${isActive ? "active" : ""}`}>
            <Icon className="h-4 w-4" /> {label}
          </NavLink>
        ))}
        <button className="side-link w-full" onClick={logout}><LogOut className="h-4 w-4" /> Logout</button>
      </nav>
    </aside>
  );
}
