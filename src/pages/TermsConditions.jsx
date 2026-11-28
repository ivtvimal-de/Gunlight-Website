import React from "react";
import { Link } from "react-router-dom";
import { Scale } from "lucide-react";
import { COMPANY } from "../config";
import SEO from "../components/SEO";
import { useTranslation } from "../i18n/LanguageContext";

export default function TermsConditions() {
  const { t } = useTranslation();
  const s2Warnings = t("policies.terms.s2Warnings");
  const s3Items = t("policies.terms.s3Items");

  return (
    <>
      <SEO
        title={t("seo.termsTitle")}
        description={t("seo.termsDesc")}
        path="/terms"
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
            <span className="text-[#6b727c]">{t("policies.terms.crumb")}</span>
          </div>

          {/* Header */}
          <header className="mb-8">
            <h1 className="font-['Outfit'] text-3xl sm:text-4xl font-bold text-[#14161a] mb-3 tracking-tight">
              {t("policies.terms.heading")}
            </h1>
            <p className="text-xs sm:text-sm text-[#6b727c]">
              {t("policies.terms.subtitle", { company: COMPANY.name })}
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
            <Link to="/returns" className="rounded-lg border border-[#e6e6e1] bg-white px-3 py-1.5 text-[#6b727c] hover:text-[#14161a] hover:border-[#cfcfc8] transition-colors">
              {t("policies.nav.returns")}
            </Link>
            <Link to="/terms" className="rounded-lg bg-[var(--accent)] text-white font-semibold px-3 py-1.5 shadow-xs">
              {t("policies.nav.terms")}
            </Link>
          </div>

          {/* Content Body */}
          <div className="rounded-2xl border border-[#e6e6e1] bg-white p-6 sm:p-8 space-y-8 text-sm leading-relaxed shadow-[0_4px_20px_rgba(20,22,26,0.06)]">
            
            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">
                {t("policies.terms.s1Title")}
              </h2>
              <p>
                {t("policies.terms.s1Before")}
                <strong className="text-[#14161a]">{COMPANY.name}</strong>
                {t("policies.terms.s1Mid1")}
                <strong className="text-[#14161a]">{COMPANY.brand}</strong>
                {t("policies.terms.s1Mid2")}
                {t("contact.addressText")}
                {t("policies.terms.s1After")}
              </p>
            </section>

            {/* Section: Product Usage & Compliance with Local Laws */}
            <section className="rounded-xl border border-[#e6e6e1] bg-[#f4f4f1] p-5 sm:p-6 text-[#4a5058]">
              <h2 className="font-['Outfit'] text-base sm:text-lg font-bold text-[var(--accent)] mb-3 flex items-center gap-2">
                <Scale className="w-5 h-5 text-[var(--accent)]" /> {t("policies.terms.s2Title")}
              </h2>
              <div className="space-y-3 text-xs sm:text-sm text-[#4a5058] leading-relaxed">
                <p>
                  <strong className="text-[#14161a]">{t("policies.terms.s2NatureLabel")}</strong>{" "}
                  {t("policies.terms.s2NatureText")}
                </p>
                <p>
                  <strong className="text-[#14161a]">{t("policies.terms.s2LawfulLabel")}</strong>{" "}
                  {t("policies.terms.s2LawfulText")}
                </p>
                <p>
                  <strong className="text-[#14161a]">{t("policies.terms.s2SafetyLabel")}</strong>{" "}
                  {t("policies.terms.s2SafetyText")}
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-3 text-[#4a5058]">
                  {s2Warnings.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
                <p className="text-xs text-[#6b727c] italic">
                  {t("policies.terms.s2Disclaimer", { company: COMPANY.name })}
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">
                {t("policies.terms.s3Title")}
              </h2>
              <p className="mb-3">{t("policies.terms.s3Intro")}</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-[#4a5058]">
                {s3Items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">
                {t("policies.terms.s4Title")}
              </h2>
              <p>{t("policies.terms.s4Body", { gst: COMPANY.gst })}</p>
            </section>

            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">
                {t("policies.terms.s5Title")}
              </h2>
              <p>{t("policies.terms.s5Body")}</p>
            </section>

            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">
                {t("policies.terms.s6Title")}
              </h2>
              <p>
                {t("policies.terms.s6Before")}
                <strong className="text-[#14161a]">{t("policies.terms.s6Location")}</strong>
                {t("policies.terms.s6After")}
              </p>
            </section>

            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">
                {t("policies.terms.s7Title")}
              </h2>
              <p className="mb-3">{t("policies.terms.s7Intro")}</p>
              <div className="rounded-xl border border-[#e6e6e1] bg-[#f4f4f1] p-4 text-xs sm:text-sm space-y-1 font-mono">
                <p><strong className="text-[#14161a]">{t("policies.terms.entityLabel")}</strong> {COMPANY.name}</p>
                <p><strong className="text-[#14161a]">{t("policies.terms.brandLabel")}</strong> {COMPANY.brand}</p>
                <p><strong className="text-[#14161a]">{t("policies.terms.locationLabel")}</strong> {t("contact.addressText")}</p>
                <p><strong className="text-[#14161a]">{t("policies.terms.phoneLabel")}</strong> {COMPANY.phone}</p>
                <p><strong className="text-[#14161a]">{t("policies.terms.emailLabel")}</strong> {COMPANY.email}</p>
              </div>
            </section>

          </div>
        </div>
      </main>
    </>
  );
}
