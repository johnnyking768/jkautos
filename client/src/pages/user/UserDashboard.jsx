import { CalendarCheck, Heart, MessageSquare, WalletCards } from "lucide-react";
import { useEffect, useState } from "react";
import CarCard from "../../components/ui/CarCard";
import StatCard from "../../components/ui/StatCard";
import { useAuth } from "../../hooks/useAuth";
import { inspectionService } from "../../services/inspectionService";
import { installmentService } from "../../services/installmentService";
import { messageService } from "../../services/messageService";
import { savedService } from "../../services/savedService";
import { viewedService } from "../../services/viewedService";
import { formatPrice } from "../../utils/formatPrice";

export default function UserDashboard() {
  const { user } = useAuth();
  const [state, setState] = useState({ saved: [], inspections: [], installments: [], messages: [], viewed: [] });

  useEffect(() => {
    document.title = "User Dashboard | JK Autos";
    Promise.allSettled([savedService.mine(), inspectionService.mine(), installmentService.mine(), messageService.mine(), viewedService.mine(5)]).then((results) => {
      setState({
        saved: results[0].value?.cars || [],
        inspections: results[1].value?.inspections || [],
        installments: results[2].value?.installments || [],
        messages: results[3].value?.messages || [],
        viewed: results[4].value?.viewed || [],
      });
    });
  }, []);

  return (
    <div>
      <p className="eyebrow">Your garage</p>
      <h1 className="page-title">Welcome Back, {user?.name}</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <StatCard icon={Heart} label="Saved Cars" value={state.saved.length} />
        <StatCard icon={CalendarCheck} label="Upcoming Inspections" value={state.inspections.filter((item) => item.status !== "completed").length} />
        <StatCard icon={WalletCards} label="Active Installments" value={state.installments.length} />
        <StatCard icon={MessageSquare} label="Unread Messages" value={state.messages.filter((item) => !item.is_read).length} />
      </div>
      <section className="content-panel">
        <h2>Recently Viewed</h2>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{state.viewed.map((row) => <CarCard key={row.id} car={row.car} />)}</div>
      </section>
      <section className="grid gap-5 lg:grid-cols-2">
        <div className="content-panel mt-0"><h2>Upcoming Inspections</h2>{state.inspections.slice(0, 2).map((item) => <p key={item.id} className="dash-row">{item.car?.title}<span>{item.inspection_date} / {item.status}</span></p>)}</div>
        <div className="content-panel mt-0"><h2>Installment Summary</h2>{state.installments.slice(0, 2).map((item) => <p key={item.id} className="dash-row">{item.car?.title}<span>{formatPrice(item.monthly_payment)} monthly</span></p>)}</div>
      </section>
      <section className="content-panel"><h2>Recent Messages</h2>{state.messages.slice(0, 2).map((item) => <p key={item.id} className="dash-row">{item.subject}<span>{item.is_replied ? "Replied" : "Pending"}</span></p>)}</section>
    </div>
  );
}
