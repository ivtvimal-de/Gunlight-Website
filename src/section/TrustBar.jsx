import { ShieldCheck, MessageCircle, Truck, Headphones } from "lucide-react";
import { useTranslation } from "../i18n/LanguageContext";

export default function TrustBar() {
  const { t } = useTranslation();

  const trustItems = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-[var(--accent)]" />,
      title: t("trustBar.warrantyTitle"),
      desc: t("trustBar.warrantyDesc"),
    },
    {
      icon: <MessageCircle className="w-5 h-5 text-[var(--accent)]" />,
      title: t("trustBar.whatsappTitle"),
      desc: t("trustBar.whatsappDesc"),
    },
    {
      icon: <Truck className="w-5 h-5 text-[var(--accent)]" />,
      title: t("trustBar.shippingTitle"),
      desc: t("trustBar.shippingDesc"),
    },
    {
      icon: <Headphones className="w-5 h-5 text-[var(--accent)]" />,
      title: t("trustBar.supportTitle"),
      desc: t("trustBar.supportDesc"),
    },
  ];

  return (
    <section className="py-10 sm:py-12 bg-[var(--bg-canvas)] border-b border-[var(--border-subtle)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {trustItems.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row items-start gap-2.5 sm:gap-4 rounded-2xl border border-[var(--border-subtle)] bg-white p-3.5 sm:p-5 shadow-[0_2px_12px_rgba(20,22,26,0.04)]"
            >
              <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-tint)] border border-[var(--accent)]/10">
                {item.icon}
              </div>
              <div className="min-w-0">
                <h4 className="font-['Outfit'] text-[13.5px] sm:text-base font-bold text-[var(--text-primary)] leading-snug">
                  {item.title}
                </h4>
                <p className="mt-1 text-[11.5px] sm:text-xs text-[var(--text-secondary)] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
