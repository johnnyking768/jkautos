import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import { messageService } from "../../services/messageService";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [open, setOpen] = useState(false);
  const load = () => messageService.mine().then((data) => setMessages(data.messages || []));
  useEffect(() => { document.title = "Messages | JK Autos"; load(); }, []);

  const submit = async (event) => {
    event.preventDefault();
    await messageService.create(Object.fromEntries(new FormData(event.currentTarget).entries()));
    toast.success("Inquiry sent");
    setOpen(false);
    load();
  };

  return (
    <div>
      <div className="flex items-end justify-between gap-4"><div><p className="eyebrow">Inquiries</p><h1 className="page-title">Messages</h1></div><button className="primary-btn" onClick={() => setOpen(true)}><Send className="h-4 w-4" /> Send New Inquiry</button></div>
      <div className="mt-8 space-y-4">{messages.map((message) => <details key={message.id} className="glass-dark p-5"><summary className="flex cursor-pointer items-center justify-between gap-4"><span className="font-display font-black uppercase">{message.subject}</span><Badge tone={message.is_replied ? "new" : "pending"}>{message.is_replied ? "Replied" : "Pending"}</Badge></summary><p className="mt-4 text-zinc-300">{message.content}</p>{message.reply && <p className="mt-4 border-l-2 border-red-700 pl-4 text-zinc-200">{message.reply}</p>}</details>)}</div>
      <Modal open={open} title="Send New Inquiry" onClose={() => setOpen(false)}>
        <form className="space-y-4" onSubmit={submit}><input className="input" name="subject" placeholder="Subject" /><textarea className="input min-h-36" name="content" required placeholder="Message" /><button className="primary-btn w-full">Send</button></form>
      </Modal>
    </div>
  );
}
