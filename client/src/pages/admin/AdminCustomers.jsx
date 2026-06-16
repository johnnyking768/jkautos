import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Badge from "../../components/ui/Badge";
import { adminService } from "../../services/adminService";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const load = () => adminService.customers().then((data) => setCustomers(data.customers || []));
  useEffect(() => { document.title = "Admin Customers | JK Autos"; load(); }, []);
  const toggle = async (id) => { await adminService.toggleCustomer(id); toast.success("Customer updated"); load(); };

  return (
    <div>
      <p className="eyebrow">People</p><h1 className="page-title">Customers</h1>
      <div className="mt-8 overflow-x-auto"><table className="admin-table"><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>City</th><th>Saves</th><th>Inspections</th><th>Joined</th><th>Status</th><th>Action</th></tr></thead><tbody>{customers.map((user) => <tr key={user.id}><td>{user.name}</td><td>{user.email}</td><td>{user.phone}</td><td>{user.city}</td><td>{user.saves}</td><td>{user.inspections}</td><td>{new Date(user.created_at).toLocaleDateString()}</td><td><Badge tone={user.is_active ? "new" : "sold"}>{user.is_active ? "active" : "inactive"}</Badge></td><td><button className="secondary-btn" onClick={() => toggle(user.id)}>Toggle</button></td></tr>)}</tbody></table></div>
    </div>
  );
}
