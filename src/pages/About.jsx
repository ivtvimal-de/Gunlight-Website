import SEO from "../components/SEO";
import { Link } from "react-router-dom";
import { useTranslation } from "../i18n/LanguageContext";

export default function About() {
  const { t } = useTranslation();
  const whatCards = t("about.whatCards");
  const wholesaleCards = t("about.wholesaleCards");
  const whyCards = t("about.whyCards");

  return (
    <>
      <SEO
        title={t("seo.aboutTitle")}
        description={t("seo.aboutDesc")}
        path="/about"
        image="/images/abpage.webp"
        type="website"
      />
      <main className="bg-[#fafaf8] text-[#14161a] min-h-screen">
        {/* INTRO SECTION */}
        <section className="py-16 border-b border-[#e6e6e1] bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="mb-3 inline-block rounded-full border border-[#e6e6e1] bg-[#f4f4f1] px-4 py-1.5 text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
              {t("about.badge")}
            </span>
            <h1 className="text-3xl md:text-5xl font-['Outfit'] font-bold text-[#14161a] mb-4 tracking-tight">
              {t("about.heading")}
            </h1>
            <p className="text-sm md:text-base text-[#4a5058] max-w-3xl leading-relaxed">
              {t("about.introBeforeBrand")}
              <strong className="text-[#14161a]">Jerone Enterprises</strong>
              {t("about.introAfterBrand")}
            </p>
          </div>
        </section>

        {/* WHO WE ARE */}
        <section className="py-16 border-b border-[#e6e6e1]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="overflow-hidden rounded-2xl border border-[#e6e6e1] bg-white shadow-[0_4px_20px_rgba(20,22,26,0.06)]">
              <picture>
                <source srcSet="/images/abpage.webp" type="image/webp" />
                <img
                  src="/images/abpage.jpg"
                  alt={t("about.imageAlt")}
                  width={600}
                  height={600}
                  loading="lazy"
                  className="w-full object-cover"
                />
              </picture>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-['Outfit'] font-bold text-[#14161a] mb-4 tracking-tight">
                {t("about.whoTitle")}
              </h2>
              <p className="text-sm md:text-base text-[#4a5058] leading-relaxed mb-4">
                {t("about.whoP1")}
              </p>
              <p className="text-sm md:text-base text-[#4a5058] leading-relaxed">
                {t("about.whoP2")}
              </p>
            </div>
          </div>
        </section>

        {/* WHAT WE DO */}
        <section className="py-16 border-b border-[#e6e6e1] bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-['Outfit'] font-bold text-[#14161a] mb-6 tracking-tight">
              {t("about.whatTitle")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {whatCards.map((card, idx) => (
                <div
                  key={idx}
                  className="bg-[#fafaf8] rounded-2xl p-6 border border-[#e6e6e1] hover:border-[#cfcfc8] transition-colors"
                >
                  <h3 className="font-['Outfit'] font-bold text-[#14161a] mb-2 text-base">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4a5058] leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRODUCT PORTFOLIO */}
        <section className="py-16 border-b border-[#e6e6e1]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-['Outfit'] font-bold text-[#14161a] mb-4 tracking-tight">
              {t("about.portfolioTitle")}
            </h2>

            <p className="text-sm md:text-base text-[#4a5058] max-w-3xl leading-relaxed mb-6">
              {t("about.portfolioDesc")}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-[#e6e6e1] shadow-[0_4px_20px_rgba(20,22,26,0.06)]">
                <h3 className="font-['Outfit'] font-bold text-[#14161a] mb-2 text-base">
                  {t("about.portfolioOriginalTitle")}
                </h3>
                <p className="text-xs sm:text-sm text-[#4a5058] leading-relaxed">
                  {t("about.portfolioOriginalDesc")}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#e6e6e1] shadow-[0_4px_20px_rgba(20,22,26,0.06)]">
                <h3 className="font-['Outfit'] font-bold text-[#14161a] mb-2 text-base">
                  {t("about.portfolioPartnerTitle")}
                </h3>
                <p className="text-xs sm:text-sm text-[#4a5058] leading-relaxed">
                  {t("about.portfolioPartnerDesc")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHOLESALE & RETAIL */}
        <section className="py-16 border-b border-[#e6e6e1] bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-['Outfit'] font-bold text-[#14161a] mb-4 tracking-tight">
              {t("about.wholesaleTitle")}
            </h2>

            <p className="text-sm md:text-base text-[#4a5058] max-w-3xl leading-relaxed mb-6">
              {t("about.wholesaleDesc")}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {wholesaleCards.map((card, idx) => (
                <div
                  key={idx}
                  className="bg-[#fafaf8] rounded-2xl p-6 border border-[#e6e6e1]"
                >
                  <h3 className="font-['Outfit'] font-bold text-[#14161a] mb-2 text-base">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4a5058] leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY GUNLITE */}
        <section className="py-16 border-b border-[#e6e6e1]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-['Outfit'] font-bold text-[#14161a] mb-6 tracking-tight">
              {t("about.whyTitle")}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyCards.map((card, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-[#e6e6e1] shadow-[0_4px_20px_rgba(20,22,26,0.06)]"
                >
                  <h4 className="font-['Outfit'] font-bold text-[#14161a] mb-2 text-sm">
                    {card.title}
                  </h4>
                  <p className="text-xs text-[#4a5058] leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COMMITMENT */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white border border-[#e6e6e1] rounded-3xl p-8 sm:p-12 max-w-3xl mx-auto shadow-[0_4px_20px_rgba(20,22,26,0.06)]">
              <h2 className="text-2xl font-['Outfit'] font-bold text-[#14161a] mb-4">
                {t("about.commitmentTitle")}
              </h2>
              <p className="text-sm md:text-base text-[#4a5058] leading-relaxed mb-6">
                {t("about.commitmentDesc")}
              </p>
              <Link
                to="/shop"
                className="inline-block px-8 py-3 bg-[var(--accent)] text-white rounded-lg text-xs font-semibold hover:bg-[var(--accent-hover)] transition-colors shadow-sm"
              >
                {t("about.commitmentCta")}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
