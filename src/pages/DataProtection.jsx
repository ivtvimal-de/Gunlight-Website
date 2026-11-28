import React from "react";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { COMPANY } from "../config";
import SEO from "../components/SEO";
import { useTranslation } from "../i18n/LanguageContext";

export default function DataProtection() {
  const { t } = useTranslation();
  const s2Items = t("policies.privacy.s2Items");
  const s3Items = t("policies.privacy.s3Items");

  return (
    <>
      <SEO
        title={t("seo.privacyTitle")}
        description={t("seo.privacyDesc")}
        path="/privacy"
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
            <span className="text-[#6b727c]">{t("policies.privacy.crumb")}</span>
          </div>

          {/* Header */}
          <header className="mb-8">
            <h1 className="font-['Outfit'] text-3xl sm:text-4xl font-bold text-[#14161a] mb-3 tracking-tight">
              {t("policies.privacy.heading")}
            </h1>
            <p className="text-xs sm:text-sm text-[#6b727c]">
              {t("policies.privacy.updated")}
            </p>
          </header>

          {/* Quick Policy Nav */}
          <div className="mb-8 flex flex-wrap gap-2 border-b border-[#e6e6e1] pb-4 text-xs font-medium">
            <Link to="/privacy" className="rounded-lg bg-[var(--accent)] text-white font-semibold px-3 py-1.5 shadow-xs">
              {t("policies.nav.privacy")}
            </Link>
            <Link to="/shipping" className="rounded-lg border border-[#e6e6e1] bg-white px-3 py-1.5 text-[#6b727c] hover:text-[#14161a] hover:border-[#cfcfc8] transition-colors">
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
                {t("policies.privacy.s1Title")}
              </h2>
              <p>
                {t("policies.privacy.s1Body", { address: t("contact.addressText") })}
              </p>
            </section>

            {/* Highlight Notice */}
            <section className="rounded-xl border border-[#e6e6e1] bg-[#f4f4f1] p-4 sm:p-5 text-[#4a5058]">
              <h3 className="font-['Outfit'] font-bold text-[#14161a] mb-1.5 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[var(--accent)]" /> {t("policies.privacy.calloutTitle")}
              </h3>
              <p className="text-xs sm:text-sm text-[#4a5058] leading-relaxed">
                {t("policies.privacy.calloutBody")}
              </p>
            </section>

            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">
                {t("policies.privacy.s2Title")}
              </h2>
              <p className="mb-2">{t("policies.privacy.s2Intro")}</p>
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
                {t("policies.privacy.s3Title")}
              </h2>
              <p className="mb-2">{t("policies.privacy.s3Intro")}</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-[#4a5058]">
                {s3Items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">
                {t("policies.privacy.s4Title")}
              </h2>
              <p>{t("policies.privacy.s4Body")}</p>
            </section>

            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">
                {t("policies.privacy.s5Title")}
              </h2>
              <p>{t("policies.privacy.s5Body")}</p>
            </section>

            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">
                {t("policies.privacy.s6Title")}
              </h2>
              <p className="mb-3">{t("policies.privacy.s6Intro")}</p>
              <div className="rounded-xl border border-[#e6e6e1] bg-[#f4f4f1] p-4 text-xs sm:text-sm space-y-1">
                <p><strong className="text-[#14161a]">{t("policies.privacy.grievanceDeskLabel")}</strong> {COMPANY.name}</p>
                <p><strong className="text-[#14161a]">{t("policies.privacy.addressLabel")}</strong> {t("contact.addressText")}</p>
                <p><strong className="text-[#14161a]">{t("policies.privacy.phoneLabel")}</strong> {COMPANY.phone}</p>
                <p><strong className="text-[#14161a]">{t("policies.privacy.emailLabel")}</strong> {COMPANY.email}</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
