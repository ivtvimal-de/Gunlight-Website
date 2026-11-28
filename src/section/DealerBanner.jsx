import { Link } from "react-router-dom";
import { MessageCircle, Briefcase, ArrowRight } from "lucide-react";
import { WHATSAPP_URL } from "../config";
import { useTranslation } from "../i18n/LanguageContext";

export default function DealerBanner() {
  const { t } = useTranslation();

  return (
    <section className="py-10 sm:py-18 bg-[var(--bg-canvas)] border-b border-[var(--border-subtle)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl sm:rounded-3xl border border-[#232730] bg-[#14161A] p-5 sm:p-12 text-[#94A3B8] shadow-lg overflow-hidden">
          
          {/* Subtle Ambient Red Tint */}
          <div className="pointer-events-none absolute right-0 bottom-0 h-64 w-64 rounded-full bg-[var(--accent)] opacity-10 blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#242934] border border-[#384050] px-3.5 py-1 text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
                <Briefcase className="w-3.5 h-3.5" />
                {t("dealerBanner.badge")}
              </span>

              <h2 className="font-['Outfit'] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F8FAFC] tracking-tight">
                {t("dealerBanner.heading")}
              </h2>

              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                {t("dealerBanner.description")}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-[#F4F4F1] px-6 py-3.5 text-xs sm:text-sm font-semibold text-[#14161A] transition-colors shadow-sm"
              >
                <span>{t("dealerBanner.submitEnquiry")}</span>
                <ArrowRight className="w-4 h-4 text-[#14161A]" />
              </Link>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-6 py-3.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>{t("dealerBanner.whatsappDesk")}</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
