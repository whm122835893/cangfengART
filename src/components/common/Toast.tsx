import { useStore } from '@/store/useStore';
import { CheckCircle, XCircle, Info } from 'lucide-react';

export default function Toast() {
  const toast = useStore((s) => s.toast);
  if (!toast) return null;

  const icons = {
    success: <CheckCircle size={18} className="text-functional-success" />,
    error: <XCircle size={18} className="text-functional-error" />,
    info: <Info size={18} className="text-accent-blue" />,
  };

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] pointer-events-none">
      <div className="neu-raised rounded-2xl px-4 py-3 flex items-center gap-2 shadow-lg animate-[slideDown_0.3s_ease-out]">
        {icons[toast.type]}
        <span className="text-sm font-semibold text-neu-text-primary">{toast.message}</span>
      </div>
    </div>
  );
}
