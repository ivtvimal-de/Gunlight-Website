import { ShieldCheck, MessageCircle, Truck, Headphones } from "lucide-react";
import { CLAIMS, COMPANY } from "../config";

export default function TrustBar() {
  const trustItems = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-[var(--accent)]" />,
      title: CLAIMS.warranty || "1-Year Hardware Warranty",
      desc: "Comprehensive protection against internal LED chip & switch defects.",
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-[var(--accent)]" />,
      title: "Direct WhatsApp Ordering",
      desc: "Instant stock confirmation, live pricing, and personal support from {COMPANY.city}.",
    },
    {
      icon: <Truck className="w-6 h-6 text-[var(--accent)]" />,
      title: CLAIMS.shipping || "Pan-India Safe Transit",
      desc: "Insulated battery packaging with tracked surface and express couriers.",
    },
    {
      icon: <Headphones className="w-6 h-6 text-[var(--accent)]" />,
      title: "Direct Merchant Support",
      desc: "Mon – Sat, 9:30 AM – 7:30 PM IST via direct call or WhatsApp.",
    },
  ];

  return (
    <section className="py-12 bg-[var(--bg-canvas)] border-b border-[var(--border-subtle)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 rounded-2xl border border-[var(--border-subtle)] bg-white p-5 shadow-[0_4px_20px_rgba(20,22,26,0.04)]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)]">
                {item.icon}
              </div>
              <div>
                <h4 className="font-['Outfit'] text-sm sm:text-base font-bold text-[var(--text-primary)]">
                  {item.title}
                </h4>
                <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
                  {item.desc.replace("{COMPANY.city}", COMPANY.city)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

