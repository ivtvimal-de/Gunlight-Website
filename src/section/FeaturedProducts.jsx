import { Link } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useCatalog } from "../context/CatalogContext";
import { useTranslation } from "../i18n/LanguageContext";

export default function FeaturedProducts() {
  const { products, loading } = useCatalog();
  const { t } = useTranslation();

  const featuredList = (() => {
    const featured = products.filter((p) => p.isFeatured);
    return featured.length > 0 ? featured : products;
  })();

  return (
    <section className="py-10 sm:py-16 bg-white border-b border-[var(--border-subtle)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-end justify-between gap-3 mb-5 sm:mb-9">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-[var(--accent)] uppercase tracking-[0.08em]">
                <Zap className="w-3.5 h-3.5" />
                {t("featuredSection.eyebrow")}
              </span>
            </div>
            <h2 className="font-['Outfit'] text-xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight leading-tight">
              {t("featuredSection.heading")}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 hidden sm:block">
              {t("featuredSection.subtitle")}
            </p>
          </div>
          <Link
            to="/shop"
            className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors pb-0.5"
          >
            <span>{t("common.exploreAll")}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4-Column Product Grid */}
        {loading && products.length === 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-72 rounded-2xl bg-[#111317]/10 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            {featuredList.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
