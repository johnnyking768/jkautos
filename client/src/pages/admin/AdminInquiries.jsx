import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Badge from "../../components/ui/Badge";
import { messageService } from "../../services/messageService";

export default function AdminInquiries() {
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState("");
  const [reply, setReply] = useState({});
  const load = () => messageService.admin(filter ? { is_replied: filter } : {}).then((data) => setMessages(data.messages || []));
  useEffect(() => { document.title = "Admin Inquiries | JK Autos"; load(); }, [filter]);
  const submit = async (id) => { await messageService.reply(id, reply[id]); toast.success("Reply sent"); setReply({}); load(); };

  return (
    <div>
      <p className="eyebrow">Customer care</p><h1 className="page-title">Inquiries</h1>
      <div className="my-6"><select className="input w-56" value={filter} onChange={(event) => setFilter(event.target.value)}><option value="">All</option><option value="true">Replied</option><option value="false">Pending</option></select></div>
      <div className="space-y-4">
        {messages.map((message) => (
          <details key={message.id} className="glass-dark p-5">
            <summary className="grid cursor-pointer gap-3 md:grid-cols-[1fr_180px_140px]"><span className="font-display font-black uppercase">{message.subject}</span><span>{message.user?.email || "guest inquiry"}</span><Badge tone={message.is_replied ? "new" : "pending"}>{message.is_replied ? "replied" : "pending"}</Badge></summary>
            <div className="mt-5 border-t border-white/10 pt-5"><p className="text-zinc-300">{message.content}</p><p className="mt-2 text-sm text-zinc-500">Car: {message.car?.title || "General inquiry"}</p>{message.reply && <p className="mt-4 border-l-2 border-red-700 pl-4">{message.reply}</p>}<textarea className="input mt-4 min-h-28" value={reply[message.id] || ""} onChange={(event) => setReply((current) => ({ ...current, [message.id]: event.target.value }))} placeholder="Reply to customer" /><button className="primary-btn mt-3" onClick={() => submit(message.id)}>Send Reply</button></div>
          </details>
        ))}
      </div>
    </div>
  );
}
