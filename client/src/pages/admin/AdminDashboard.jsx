import { Car, CheckCircle, CircleDollarSign, Clock, MessageSquare, Users, WalletCards } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import StatCard from "../../components/ui/StatCard";
import { adminService } from "../../services/adminService";
import { formatPrice } from "../../utils/formatPrice";

const colors = ["#CC0000", "#D4AF37", "#C0C0C0", "#00C851", "#FFB300", "#FF3D57"];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  useEffect(() => { document.title = "Admin Dashboard | JK Autos"; adminService.stats().then(setData); }, []);
  const stats = data?.stats || {};

  return (
    <div>
      <p className="eyebrow">Control room</p><h1 className="page-title">Admin Dashboard</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Car} label="Total Cars" value={stats.totalCars || 0} />
        <StatCard icon={CheckCircle} label="Available" value={stats.available || 0} />
        <StatCard icon={WalletCards} label="Sold" value={stats.sold || 0} />
        <StatCard icon={Clock} label="Reserved" value={stats.reserved || 0} />
        <StatCard icon={Clock} label="Pending Inspections" value={stats.pendingInspections || 0} />
        <StatCard icon={MessageSquare} label="Unread Inquiries" value={stats.unreadInquiries || 0} />
        <StatCard icon={Users} label="Customers" value={stats.totalCustomers || 0} />
        <StatCard icon={CircleDollarSign} label="Revenue" value={formatPrice(stats.totalRevenue || 0)} />
      </div>
      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        <Chart title="Cars Sold Per Month"><LineChart data={data?.monthlySales || []}><XAxis dataKey="month" /><YAxis /><Tooltip /><Line dataKey="sold" stroke="#CC0000" strokeWidth={3} /></LineChart></Chart>
        <Chart title="Revenue Per Month"><BarChart data={data?.monthlySales || []}><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="revenue" fill="#D4AF37" /></BarChart></Chart>
        <Chart title="Cars By Body Type"><PieChart><Pie data={data?.carsByBodyType || []} dataKey="value" nameKey="body_type" outerRadius={110}>{(data?.carsByBodyType || []).map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}</Pie><Tooltip /></PieChart></Chart>
        <Chart title="Top Brands"><BarChart data={data?.carsByBrand || []}><XAxis dataKey="brand" /><YAxis /><Tooltip /><Bar dataKey="count" fill="#CC0000" /></BarChart></Chart>
      </div>
      <div className="mt-8 grid gap-5 xl:grid-cols-3">
        <List title="Recent Inspections" rows={data?.recentInspections || []} get={(row) => `${row.inspection_date} / ${row.status}`} />
        <List title="Recent Inquiries" rows={data?.recentInquiries || []} get={(row) => `${row.subject} / ${row.is_replied ? "replied" : "pending"}`} />
        <List title="Recently Added Cars" rows={data?.recentCars || []} get={(row) => `${row.title} / ${formatPrice(row.price)}`} />
      </div>
    </div>
  );
}

function Chart({ title, children }) {
  return <div className="glass-dark p-5"><h2 className="mb-5 font-display text-lg font-black uppercase">{title}</h2><div className="h-72"><ResponsiveContainer>{children}</ResponsiveContainer></div></div>;
}

function List({ title, rows, get }) {
  return <div className="glass-dark p-5"><h2 className="mb-4 font-display text-lg font-black uppercase">{title}</h2>{rows.map((row, index) => <p key={row.id || index} className="dash-row">{get(row)}</p>)}</div>;
}
