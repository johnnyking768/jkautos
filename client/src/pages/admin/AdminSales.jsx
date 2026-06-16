import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { adminService } from "../../services/adminService";
import { formatDate } from "../../utils/formatDate";
import { formatPrice } from "../../utils/formatPrice";

const colors = ["#CC0000", "#D4AF37", "#C0C0C0", "#00C851", "#FFB300"];

export default function AdminSales() {
  const [data, setData] = useState({ sales: [], monthlyRevenue: [], revenueByBrand: [], totalRevenue: 0 });
  useEffect(() => { document.title = "Admin Sales | JK Autos"; adminService.sales().then(setData); }, []);
  const csv = () => {
    const rows = [["Car title", "Brand", "Sale price", "Sold date"], ...data.sales.map((car) => [car.title, car.brand, car.discounted_price || car.price, car.sold_at])];
    const blob = new Blob([rows.map((row) => row.join(",")).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "jkautos-sales.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Revenue</p><h1 className="page-title">Sales</h1><p className="price-tag mt-3 text-3xl">{formatPrice(data.totalRevenue)}</p></div><button className="primary-btn" onClick={csv}><Download className="h-4 w-4" /> Export CSV</button></div>
      <div className="mt-8 grid gap-5 lg:grid-cols-2"><Chart title="Monthly Revenue"><BarChart data={data.monthlyRevenue}><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="revenue" fill="#CC0000" /></BarChart></Chart><Chart title="Revenue By Brand"><PieChart><Pie data={data.revenueByBrand} dataKey="revenue" nameKey="brand" outerRadius={110}>{data.revenueByBrand.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}</Pie><Tooltip /></PieChart></Chart></div>
      <div className="mt-8 overflow-x-auto"><table className="admin-table"><thead><tr><th>Car</th><th>Brand</th><th>Sale Price</th><th>Sold Date</th></tr></thead><tbody>{data.sales.map((car) => <tr key={car.id}><td>{car.title}</td><td>{car.brand}</td><td>{formatPrice(car.discounted_price || car.price)}</td><td>{formatDate(car.sold_at)}</td></tr>)}</tbody></table></div>
    </div>
  );
}

function Chart({ title, children }) {
  return <div className="glass-dark p-5"><h2 className="mb-5 font-display text-lg font-black uppercase">{title}</h2><div className="h-72"><ResponsiveContainer>{children}</ResponsiveContainer></div></div>;
}
