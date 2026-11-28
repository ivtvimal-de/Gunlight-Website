import React from "react";
import { Link } from "react-router-dom";
import { Clock, Truck, AlertTriangle, MessageCircle } from "lucide-react";
import { COMPANY, WHATSAPP_URL } from "../config";
import SEO from "../components/SEO";
import { useTranslation } from "../i18n/LanguageContext";

export default function ShippingPolicy() {
  const { t } = useTranslation();
  const s1Steps = t("policies.shipping.s1Steps");
  const s2Items = t("policies.shipping.s2Items");

  return (
    <>
      <SEO
        title={t("seo.shippingTitle")}
        description={t("seo.shippingDesc")}
        path="/shipping"
        type="website"
      />
      <main className="min-h-screen bg-[#fafaf8] py-8 sm:py-12 pb-20 text-[#4a5058]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
            <Link to="/" className="hover:text-[#14161a] transition-colors">
              {t("common.home")}
            </Link>
            <span className="text-[#cfcfc8]">/</span>
            <span>{t("common.legal")}</span>
            <span className="text-[#cfcfc8]">/</span>
            <span className="text-[#6b727c]">{t("policies.shipping.crumb")}</span>
          </div>

          {/* Header */}
          <header className="mb-8">
            <h1 className="font-['Outfit'] text-3xl sm:text-4xl font-bold text-[#14161a] mb-3 tracking-tight">
              {t("policies.shipping.heading")}
            </h1>
            <p className="text-xs sm:text-sm text-[#6b727c]">
              {t("policies.shipping.subtitle")}
            </p>
          </header>

          {/* Quick Policy Nav */}
          <div className="mb-8 flex flex-wrap gap-2 border-b border-[#e6e6e1] pb-4 text-xs font-medium">
            <Link to="/privacy" className="rounded-lg border border-[#e6e6e1] bg-white px-3 py-1.5 text-[#6b727c] hover:text-[#14161a] hover:border-[#cfcfc8] transition-colors">
              {t("policies.nav.privacy")}
            </Link>
            <Link to="/shipping" className="rounded-lg bg-[var(--accent)] text-white font-semibold px-3 py-1.5 shadow-xs">
              {t("policies.nav.shipping")}
            </Link>
            <Link to="/returns" className="rounded-lg border border-[#e6e6e1] bg-white px-3 py-1.5 text-[#6b727c] hover:text-[#14161a] hover:border-[#cfcfc8] transition-colors">
              {t("policies.nav.returns")}
            </Link>
            <Link to="/terms" className="rounded-lg border border-[#e6e6e1] bg-white px-3 py-1.5 text-[#6b727c] hover:text-[#14161a] hover:border-[#cfcfc8] transition-colors">
              {t("policies.nav.terms")}
            </Link>
          </div>

          {/* Content Body */}
          <div className="rounded-2xl border border-[#e6e6e1] bg-white p-6 sm:p-8 space-y-8 text-sm leading-relaxed shadow-[0_4px_20px_rgba(20,22,26,0.06)]">
            
            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">
                {t("policies.shipping.s1Title")}
              </h2>
              <p className="mb-3">
                {t("policies.shipping.s1IntroBefore")}
                {COMPANY.brand}
                {t("policies.shipping.s1IntroAfter")}
              </p>
              <ol className="list-decimal list-inside space-y-1.5 pl-2 text-[#4a5058]">
                {s1Steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </section>

            {/* Timelines Callout */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-[#e6e6e1] bg-[#f4f4f1] p-5">
                <h3 className="font-['Outfit'] text-sm font-bold text-[var(--accent)] mb-1.5 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[var(--accent)]" /> {t("policies.shipping.processingTitle")}
                </h3>
                <p className="text-xs text-[#4a5058] leading-relaxed">
                  {t("policies.shipping.processingBodyBefore")}
                  <strong className="text-[#14161a]">{t("policies.shipping.processingHighlight")}</strong>
                  {t("policies.shipping.processingBodyAfter")}
                </p>
              </div>
              <div className="rounded-xl border border-[#e6e6e1] bg-[#f4f4f1] p-5">
                <h3 className="font-['Outfit'] text-sm font-bold text-[var(--accent)] mb-1.5 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[var(--accent)]" /> {t("policies.shipping.transitTitle")}
                </h3>
                <p className="text-xs text-[#4a5058] leading-relaxed">
                  {t("policies.shipping.transitLine1Label")}
                  <strong className="text-[#14161a]">{t("policies.shipping.transitLine1Val")}</strong>
                  <br />
                  {t("policies.shipping.transitLine2Label")}
                  <strong className="text-[#14161a]">{t("policies.shipping.transitLine2Val")}</strong>
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">
                {t("policies.shipping.s2Title")}
              </h2>
              <p className="mb-3">
                {t("policies.shipping.s2IntroBefore")}
                <strong className="text-[#14161a]">{t("policies.shipping.s2Carriers")}</strong>
                {t("policies.shipping.s2IntroAfter")}
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-[#4a5058]">
                {s2Items.map((item, idx) => (
                  <li key={idx}>
                    <strong className="text-[#14161a]">{item.strong}</strong> {item.text}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">
                {t("policies.shipping.s3Title")}
              </h2>
              <p>
                {t("policies.shipping.s3Before")}
                <strong className="text-[#14161a]">{t("policies.shipping.s3Bold")}</strong>
                {t("policies.shipping.s3After")}
              </p>
            </section>

            <section className="rounded-xl border border-[#e6e6e1] bg-[#f4f4f1] p-5">
              <h3 className="font-['Outfit'] font-bold text-[#14161a] mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[var(--accent)] shrink-0" /> {t("policies.shipping.safetyTitle")}
              </h3>
              <p className="text-xs sm:text-sm text-[#4a5058] leading-relaxed">
                {t("policies.shipping.safetyBody")}
              </p>
            </section>

            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">
                {t("policies.shipping.s4Title")}
              </h2>
              <p className="mb-3">{t("policies.shipping.s4Intro")}</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-[#4a5058]">
                <li>{t("policies.shipping.s4Item1")}</li>
                <li>
                  {t("policies.shipping.s4Item2Before")}
                  <strong className="text-[#14161a]">{t("policies.shipping.s4Item2Hours")}</strong>
                  {t("policies.shipping.s4Item2Mid")}
                  <strong className="text-[#14161a]">{COMPANY.phone}</strong>
                  {t("policies.shipping.s4Item2After")}
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-3">
                {t("policies.shipping.s5Title")}
              </h2>
              <p className="mb-4">{t("policies.shipping.s5Intro")}</p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-4 py-2.5 text-xs font-semibold text-white transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 text-white" /> {t("policies.shipping.trackBtn")}
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#e6e6e1] bg-white px-4 py-2.5 text-xs font-semibold text-[#14161a] hover:bg-[#f4f4f1] transition-colors"
                >
                  {t("policies.shipping.contactBtn")}
                </Link>
              </div>
            </section>

          </div>
        </div>
      </main>
    </>
  );
}
