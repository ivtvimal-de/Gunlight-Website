import React from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Mail } from "lucide-react";
import { COMPANY, WHATSAPP_URL } from "../config";
import SEO from "../components/SEO";
import { useTranslation } from "../i18n/LanguageContext";

export default function ReturnRefundPolicy() {
  const { t } = useTranslation();
  const calloutItems = t("policies.returns.calloutItems");

  return (
    <>
      <SEO
        title={t("seo.returnsTitle")}
        description={t("seo.returnsDesc")}
        path="/returns"
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
            <span className="text-[#6b727c]">{t("policies.returns.crumb")}</span>
          </div>

          {/* Header */}
          <header className="mb-8">
            <h1 className="font-['Outfit'] text-3xl sm:text-4xl font-bold text-[#14161a] mb-3 tracking-tight">
              {t("policies.returns.heading")}
            </h1>
            <p className="text-xs sm:text-sm text-[#6b727c]">
              {t("policies.returns.subtitle")}
            </p>
          </header>

          {/* Quick Policy Nav */}
          <div className="mb-8 flex flex-wrap gap-2 border-b border-[#e6e6e1] pb-4 text-xs font-medium">
            <Link to="/privacy" className="rounded-lg border border-[#e6e6e1] bg-white px-3 py-1.5 text-[#6b727c] hover:text-[#14161a] hover:border-[#cfcfc8] transition-colors">
              {t("policies.nav.privacy")}
            </Link>
            <Link to="/shipping" className="rounded-lg border border-[#e6e6e1] bg-white px-3 py-1.5 text-[#6b727c] hover:text-[#14161a] hover:border-[#cfcfc8] transition-colors">
              {t("policies.nav.shipping")}
            </Link>
            <Link to="/returns" className="rounded-lg bg-[var(--accent)] text-white font-semibold px-3 py-1.5 shadow-xs">
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
                {t("policies.returns.s1Title")}
              </h2>
              <p>
                {t("policies.returns.s1Before")}
                <strong className="text-[#14161a]">{COMPANY.brand}</strong>
                {t("policies.returns.s1Mid")}
                <strong className="text-[#14161a]">{t("policies.returns.s1Highlight")}</strong>
                {t("policies.returns.s1After")}
              </p>
            </section>

            {/* WhatsApp Process Card */}
            <section className="rounded-xl border border-[#e6e6e1] bg-[#f4f4f1] p-5">
              <h3 className="font-['Outfit'] font-bold text-[#14161a] mb-2 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[var(--accent)]" /> {t("policies.returns.calloutTitle")}
              </h3>
              <p className="text-xs sm:text-sm text-[#4a5058] mb-3">
                {t("policies.returns.calloutIntro")}
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-[#4a5058] pl-2">
                {calloutItems.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">
                {t("policies.returns.s2Title")}
              </h2>
              <p className="mb-2">{t("policies.returns.s2Intro")}</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-[#4a5058]">
                <li>
                  {t("policies.returns.s2Item1Before")}
                  <strong className="text-[#14161a]">{t("policies.returns.s2Item1Bold")}</strong>
                  {t("policies.returns.s2Item1After")}
                </li>
                <li>{t("policies.returns.s2Item2")}</li>
                <li>{t("policies.returns.s2Item3")}</li>
              </ul>
            </section>

            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">
                {t("policies.returns.s3Title")}
              </h2>
              <p className="mb-3">{t("policies.returns.s3Intro")}</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-[#4a5058]">
                <li>{t("policies.returns.s3Item1")}</li>
                <li>
                  {t("policies.returns.s3Item2Before")}
                  <strong className="text-[#14161a]">{t("policies.returns.s3Item2Bold")}</strong>
                  {t("policies.returns.s3Item2After")}
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">
                {t("policies.returns.s4Title")}
              </h2>
              <p className="mb-3">
                {t("policies.returns.s4Before")}
                <strong className="text-[#14161a]">{t("policies.returns.s4Bold")}</strong>
                {t("policies.returns.s4After")}
              </p>
              <p className="text-xs text-[#4a5058] bg-[#f4f4f1] p-3 rounded-lg border border-[#e6e6e1]">
                <strong className="text-[#14161a]">{t("policies.returns.exclusionsLabel")}</strong>{" "}
                {t("policies.returns.exclusionsText")}
              </p>
            </section>

            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-3">
                {t("policies.returns.s5Title")}
              </h2>
              <p className="mb-4">{t("policies.returns.s5Intro")}</p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-4 py-2.5 text-xs font-semibold text-white transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 text-white" /> {t("policies.returns.whatsappSupportBtn", { phone: COMPANY.phone })}
                </a>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#e6e6e1] bg-white px-4 py-2.5 text-xs font-semibold text-[#14161a] hover:bg-[#f4f4f1] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[var(--accent)]" /> {t("policies.returns.emailBtn", { email: COMPANY.email })}
                </a>
              </div>
            </section>

          </div>
        </div>
      </main>
    </>
  );
}
