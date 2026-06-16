import { CalendarCheck, Car, Gauge, Heart, LayoutDashboard, LogOut, MessageSquare, User, WalletCards } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const links = [
  ["Dashboard", "/dashboard", LayoutDashboard],
  ["Saved Cars", "/dashboard/saved", Heart],
  ["Inspections", "/dashboard/inspections", CalendarCheck],
  ["Test Drives", "/dashboard/test-drives", Car],
  ["Installments", "/dashboard/installments", WalletCards],
  ["Recently Viewed", "/dashboard/viewed", Gauge],
  ["Messages", "/dashboard/messages", MessageSquare],
  ["Profile", "/dashboard/profile", User],
];

export default function UserSidebar() {
  const { logout } = useAuth();

  return (
    <>
      <aside className="hidden min-h-screen w-[260px] shrink-0 border-r border-white/10 bg-[#0b0b0b] p-5 lg:block">
        <p className="mb-6 font-display text-xl font-black">USER GARAGE</p>
        <nav className="space-y-2">
          {links.map(([label, href, Icon]) => (
            <NavLink key={href} end={href === "/dashboard"} to={href} className={({ isActive }) => `side-link ${isActive ? "active" : ""}`}>
              <Icon className="h-4 w-4" /> {label}
            </NavLink>
          ))}
          <button className="side-link w-full" onClick={logout}><LogOut className="h-4 w-4" /> Logout</button>
        </nav>
      </aside>
      <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 border-t border-white/10 bg-black lg:hidden">
        {links.slice(0, 5).map(([label, href, Icon]) => (
          <NavLink key={href} end={href === "/dashboard"} to={href} className="flex flex-col items-center gap-1 px-1 py-2 text-[10px] uppercase text-zinc-400">
            <Icon className="h-4 w-4" /> {label.split(" ")[0]}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
