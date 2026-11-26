import { AlertTriangle, X } from "lucide-react";

export default function ConfirmDialog({
  open,
  title = "Confirm Action",
  description = "Are you sure you want to proceed?",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
  children,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-['Inter']">
      <div
        className="fixed inset-0 bg-black/55 backdrop-blur-xs"
        onClick={!loading ? onCancel : undefined}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-md rounded-2xl bg-white border border-[#E6E6E1] p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 border border-red-100 text-red-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-['Outfit'] text-lg font-bold text-[#14161A]">
                {title}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-[#4A5058] leading-relaxed">
                {description}
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="rounded-lg p-1 text-[#6B727C] hover:bg-[#F4F4F1] hover:text-[#14161A]"
            aria-label="Close confirmation dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {children && <div className="mt-4">{children}</div>}

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="h-10 rounded-xl border border-[#E6E6E1] bg-white px-4 text-xs font-semibold text-[#14161A] hover:bg-[#F4F4F1] disabled:opacity-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="h-10 rounded-xl bg-red-600 hover:bg-red-700 px-5 text-xs font-semibold text-white shadow-xs disabled:opacity-50 transition-colors"
          >
            {loading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
