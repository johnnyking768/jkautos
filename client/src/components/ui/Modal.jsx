import { X } from "lucide-react";

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="glass-dark max-h-[90vh] w-full max-w-2xl overflow-auto">
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <h2 className="font-display text-xl font-black uppercase">{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close modal">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
