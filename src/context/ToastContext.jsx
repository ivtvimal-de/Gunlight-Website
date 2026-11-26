import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    (type, message) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => removeToast(id), 4000);
    },
    [removeToast]
  );

  const toast = useMemo(
    () => ({
      success: (msg) => pushToast("success", msg),
      error: (msg) => pushToast("error", msg),
      info: (msg) => pushToast("info", msg),
    }),
    [pushToast]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Floating Notification Stack */}
      <div
        className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-[calc(100%-2rem)] pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((t) => {
          const styles =
            t.type === "success"
              ? "border-emerald-500/30 bg-[#14161A] text-white"
              : t.type === "error"
              ? "border-red-500/40 bg-[#14161A] text-white"
              : "border-white/15 bg-[#14161A] text-white";

          const Icon =
            t.type === "success"
              ? CheckCircle2
              : t.type === "error"
              ? AlertCircle
              : Info;

          const iconColor =
            t.type === "success"
              ? "text-emerald-400"
              : t.type === "error"
              ? "text-red-400"
              : "text-blue-400";

          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-2.5 rounded-xl border px-3.5 py-3 shadow-xl backdrop-blur-md text-xs font-medium ${styles}`}
            >
              <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${iconColor}`} />
              <span className="flex-1 leading-relaxed">{t.message}</span>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="text-white/50 hover:text-white transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
