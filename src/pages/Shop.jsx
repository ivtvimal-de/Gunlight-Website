import React, { useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link, useSearchParams } from "react-router-dom";
import { Search, X, Flashlight, Package, Sparkles } from "lucide-react";
import { useCatalog } from "../context/CatalogContext";
import SEO from "../components/SEO";
import ProductCard from "../components/ProductCard";
import { useTranslation } from "../i18n/LanguageContext";
import { translateCategoryName, translateProductDescription } from "../i18n/catalogI18n";

gsap.registerPlugin(ScrollTrigger);

function matchesProductBrand(product, brandObj) {
  if (!brandObj) return true;
  const pb = String(product?.brand || "").trim().toLowerCase();
  const slugLower = String(brandObj.slug || "").trim().toLowerCase();
  const nameLower = String(brandObj.name || "").trim().toLowerCase();

  if (!pb) {
    return slugLower === "gunlite" || Boolean(brandObj.isFlagship);
  }
  return pb === slugLower || pb === nameLower;
}

export default function Shop() {
  const {
    products: ALL_PRODUCTS,
    categories: apiCategories,
    brands: apiBrands,
    loading,
  } = useCatalog();
  const { language, t } = useTranslation();

  const BRANDS_LIST = useMemo(
    () => apiBrands.filter((b) => b.isActive !== false),
    [apiBrands]
  );
  const CATEGORY_LIST = useMemo(
    () => ["All", ...apiCategories.map((c) => c.name)],
    [apiCategories]
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const urlCategory = searchParams.get("category");
  const urlBrand = searchParams.get("brand");

  const matchedBrandObj = useMemo(() => {
    if (urlBrand) {
      const needle = urlBrand.toLowerCase();
      return (
        BRANDS_LIST.find(
          (b) =>
            b.slug.toLowerCase() === needle || b.name.toLowerCase() === needle
        ) || {
          slug: needle,
          name: urlBrand,
          isComingSoon: needle !== "gunlite",
        }
      );
    }
    const q = urlQuery.trim().toLowerCase();
    if (!q) return null;
    return (
      BRANDS_LIST.find((b) => {
        const slug = b.slug.toLowerCase();
        const name = b.name.toLowerCase();
        return q === slug || q === name || q.includes(slug) || q.includes(name);
      }) || null
    );
  }, [urlBrand, urlQuery, BRANDS_LIST]);

  const matchedUrlCategory = useMemo(() => {
    if (!urlCategory) return "All";
    const found = CATEGORY_LIST.find(
      (c) => c.toLowerCase() === urlCategory.toLowerCase()
    );
    return found || urlCategory;
  }, [urlCategory, CATEGORY_LIST]);

  const [activeCategory, setActiveCategory] = useState(matchedUrlCategory);

  const heroRef = useRef(null);
  const gridRef = useRef(null);
  const cardsRef = useRef([]);

  const [brandSheetOpen, setBrandSheetOpen] = useState(false);

  useEffect(() => {
    if (urlCategory) {
      setActiveCategory(matchedUrlCategory);
    } else if (!urlCategory && !urlQuery) {
      setActiveCategory("All");
    }
  }, [urlCategory, urlQuery, matchedUrlCategory]);

  useEffect(() => {
    const handleOpenBrandSheet = () => setBrandSheetOpen(true);
    window.addEventListener("open-brand-sheet", handleOpenBrandSheet);
    if (window.location.hash === "#brands-sheet") {
      setBrandSheetOpen(true);
    }
    return () => {
      window.removeEventListener("open-brand-sheet", handleOpenBrandSheet);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current, {
        opacity: 0,
        y: -24,
        duration: 0.8,
        ease: "power2.out",
      });
    });
    return () => ctx.revert();
  }, []);

  const filtered = useMemo(() => {
    const q = urlQuery.trim().toLowerCase();
    const qClean = q.replace(/[\s\-_]+/g, "");

    return ALL_PRODUCTS.filter((product) => {
      if (urlBrand && !matchesProductBrand(product, matchedBrandObj)) {
        return false;
      }

      const matchesCategoryTab =
        activeCategory === "All" ||
        product.categories.some(
          (c) => c.toLowerCase() === activeCategory.toLowerCase()
        );

      if (!matchesCategoryTab) return false;
      if (!q) return true;

      if (
        (matchedBrandObj && matchesProductBrand(product, matchedBrandObj)) ||
        (product.brand && product.brand.toLowerCase().includes(q))
      ) {
        return true;
      }

      const titleMatch = (product.title || "").toLowerCase().includes(q);
      const localizedDesc = translateProductDescription(product, language);
      const descMatch =
        (product.desc || "").toLowerCase().includes(q) ||
        localizedDesc.toLowerCase().includes(q);
      const skuMatch = (product.sku || "").toLowerCase().includes(q);
      const shortSpecMatch = (product.shortSpec || "").toLowerCase().includes(q);

      const specsMatch = (product.specs || []).some((s) => {
        const text = typeof s === "string" ? s : `${s.label || ""} ${s.value || ""}`;
        return text.toLowerCase().includes(q);
      });

      const categoryMatch = (product.categories || []).some((c) => {
        const cLower = c.toLowerCase();
        const cLocalLower = String(translateCategoryName(c, language) || "").toLowerCase();
        const cClean = cLower.replace(/[\s\-_]+/g, "");
        return (
          cLower.includes(q) ||
          q.includes(cLower) ||
          cLocalLower.includes(q) ||
          q.includes(cLocalLower) ||
          cClean.includes(qClean) ||
          qClean.includes(cClean)
        );
      });

      const synonymMatch =
        (q.includes("torch") &&
          (product.categories || []).some(
            (c) => c.toLowerCase().includes("torch") || c.toLowerCase().includes("light")
          )) ||
        ((q.includes("search") || q.includes("searchlight") || q.includes("patrol")) &&
          (product.categories || []).some((c) => c.toLowerCase().includes("search"))) ||
        ((q.includes("recharge") || q.includes("battery") || q.includes("cell")) &&
          (product.categories || []).some((c) => c.toLowerCase().includes("recharge")));

      return (
        titleMatch ||
        descMatch ||
        skuMatch ||
        shortSpecMatch ||
        specsMatch ||
        categoryMatch ||
        synonymMatch
      );
    });
  }, [ALL_PRODUCTS, activeCategory, urlQuery, urlBrand, matchedBrandObj, language]);

  useEffect(() => {
    cardsRef.current = [];
    const timer = setTimeout(() => {
      if (cardsRef.current.length > 0) {
        gsap.fromTo(
          cardsRef.current.filter(Boolean),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: "power2.out" }
        );
      }
    }, 30);
    return () => clearTimeout(timer);
  }, [filtered]);

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    const newParams = {};
    if (urlBrand) {
      newParams.brand = urlBrand;
    }
    if (cat !== "All") {
      newParams.category = cat;
    }
    if (urlQuery) {
      newParams.q = urlQuery;
    }
    setSearchParams(newParams);
  };

  const handleClearBrand = () => {
    const newParams = {};
    if (activeCategory !== "All") {
      newParams.category = activeCategory;
    }
    if (urlQuery) {
      newParams.q = urlQuery;
    }
    setSearchParams(newParams);
  };

  const handleClearSearch = () => {
    const newParams = {};
    if (urlBrand) {
      newParams.brand = urlBrand;
    }
    if (activeCategory !== "All") {
      newParams.category = activeCategory;
    }
    setSearchParams(newParams);
  };

  return (
    <>
      <SEO
        title={t("seo.shopTitle")}
        description={t("seo.shopDesc")}
        path="/shop"
        type="website"
      />
      <main className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
        
        {/* ── Page Header ── */}
        <section className="relative border-b border-[var(--border-subtle)] bg-white py-8 sm:py-10">
          <div ref={heroRef} className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <span className="mb-2 inline-block rounded-full border border-[var(--border-subtle)] bg-[var(--accent-tint)] px-3.5 py-1 text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
              {matchedBrandObj ? matchedBrandObj.name : t("shop.eyebrowDefault")}
            </span>
            <h1 className="mb-2 font-['Outfit'] text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] tracking-tight">
              {matchedBrandObj
                ? t("shop.headingBrand", { brand: matchedBrandObj.name })
                : t("shop.headingDefault")}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-xl mx-auto">
              {t("shop.subtitle")}
            </p>
          </div>
        </section>

        {/* ── Filter Bar ── */}
        <section className="sticky top-16 lg:top-[72px] z-30 border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)]/95 px-4 py-3 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center gap-2 sm:gap-3 overflow-x-auto pb-1 px-4 sm:px-6 lg:px-8">
            
            {/* Mobile "Brand" Chip */}
            <button
              onClick={() => setBrandSheetOpen(true)}
              className={`md:hidden shrink-0 flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
                urlBrand
                  ? "bg-[var(--accent)] text-white shadow-xs"
                  : "border border-[var(--border-subtle)] bg-white text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {urlBrand
                  ? t("shop.brandChipPrefix", { brand: matchedBrandObj?.name || urlBrand })
                  : t("shop.brandsButton")}
              </span>
            </button>

            {/* Category Filter Chips */}
            {CATEGORY_LIST.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`shrink-0 rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
                  activeCategory === cat && !urlQuery
                    ? "bg-[var(--accent)] text-white shadow-xs"
                    : "border border-[var(--border-subtle)] bg-white text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                }`}
              >
                {cat === "All"
                  ? t("shop.allCategory")
                  : translateCategoryName(cat, language)}
              </button>
            ))}

            {/* Active Brand Removable Chip */}
            {urlBrand && (
              <span className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[var(--accent-tint)] border border-[var(--border-subtle)] px-3 py-1.5 text-xs text-[var(--accent)] font-semibold">
                <span>
                  {t("shop.brandChipPrefix", {
                    brand: matchedBrandObj ? matchedBrandObj.name : urlBrand,
                  })}
                </span>
                <button
                  onClick={handleClearBrand}
                  className="ml-0.5 text-[var(--accent)] hover:text-[var(--accent-hover)] transition p-0.5 rounded-full hover:bg-black/5"
                  aria-label={t("shop.clearBrandAria")}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {/* Active search pill */}
            {urlQuery && (
              <span className="flex shrink-0 items-center gap-2 rounded-lg bg-[var(--accent-tint)] border border-[var(--border-subtle)] px-3.5 py-1.5 text-xs text-[var(--accent)] font-medium">
                <Search className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>&ldquo;{urlQuery}&rdquo;</span>
                <button
                  onClick={handleClearSearch}
                  className="ml-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition"
                  aria-label={t("shop.clearSearchAria")}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <span className="ml-auto shrink-0 text-xs text-[var(--text-muted)]">
              {t("shop.productCountOfTotal", {
                filtered: filtered.length,
                total: ALL_PRODUCTS.length,
              })}
            </span>
          </div>
        </section>

        {/* ── Product Grid or Empty State ── */}
        <section ref={gridRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
          {loading && ALL_PRODUCTS.length === 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-72 rounded-2xl bg-[#111317]/10 animate-pulse"
                />
              ))}
            </div>
          ) : (matchedBrandObj?.isComingSoon || matchedBrandObj?.demo) && filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 sm:py-24 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-[#E6E6E1] shadow-xs">
                <Package className="w-8 h-8 text-[var(--accent)]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-[var(--text-primary)]">
                {t("shop.noBrandProductsTitle", { brand: matchedBrandObj.name })}
              </h2>
              <p className="text-[var(--text-secondary)] text-sm max-w-md">
                {t("shop.noBrandProductsDesc")}
              </p>
              <Link
                to="/shop?brand=gunlite"
                className="mt-2 inline-flex items-center justify-center rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-6 py-3 text-xs sm:text-sm font-semibold text-white transition-colors shadow-xs"
              >
                {t("shop.viewGunliteProducts")}
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-[var(--border-subtle)] shadow-xs">
                <Flashlight className="w-8 h-8 text-[var(--accent)]" />
              </div>
              <p className="text-xl font-bold font-['Outfit'] text-[var(--text-primary)]">
                {t("shop.noProductsTitle")}
              </p>
              <p className="text-[var(--text-muted)] text-sm">
                {t("shop.noProductsDesc")}
              </p>
              <button
                onClick={() => { setActiveCategory("All"); handleClearSearch(); }}
                className="mt-2 rounded-lg bg-[var(--accent)] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[var(--accent-hover)] transition shadow-xs"
              >
                {t("shop.showAllProducts")}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {filtered.map((item, idx) => (
                <div
                  key={item.id}
                  ref={(el) => { if (el) cardsRef.current[idx] = el; }}
                  className="h-full"
                >
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Mobile Brands Bottom Sheet ── */}
        {brandSheetOpen && (
          <div className="fixed inset-0 z-50 md:hidden font-['Inter']">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-200"
              onClick={() => setBrandSheetOpen(false)}
            />

            <div className="fixed bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-[20px] bg-white p-5 shadow-2xl z-10 animate-in slide-in-from-bottom duration-250 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
              <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-[#E6E6E1]" />

              <div className="flex items-center justify-between pb-3 border-b border-[#E6E6E1] mb-4">
                <div>
                  <h3 className="font-['Outfit'] text-lg font-bold text-[#14161A]">
                    {t("shop.selectBrandTitle")}
                  </h3>
                  <p className="text-xs text-[#6B727C]">
                    {t("shop.selectBrandSubtitle")}
                  </p>
                </div>
                <button
                  onClick={() => setBrandSheetOpen(false)}
                  className="h-8 w-8 rounded-full border border-[#E6E6E1] flex items-center justify-center text-[#14161A] hover:bg-[#F4F4F1]"
                  aria-label={t("shop.closeBrandSheetAria")}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Brand List */}
              <div className="space-y-2">
                {BRANDS_LIST.map((b) => {
                  const isSelected =
                    (urlBrand && urlBrand.toLowerCase() === b.slug.toLowerCase()) ||
                    (!urlBrand && b.slug === "gunlite");
                  const initial = b.name.charAt(0).toUpperCase();
                  const count = ALL_PRODUCTS.filter((p) =>
                    matchesProductBrand(p, b)
                  ).length;
                  const unit =
                    count === 1 ? t("common.productSingular") : t("common.productPlural");

                  return (
                    <button
                      key={b.slug}
                      onClick={() => {
                        setBrandSheetOpen(false);
                        const newParams = {};
                        newParams.brand = b.slug;
                        if (activeCategory !== "All") {
                          newParams.category = activeCategory;
                        }
                        setSearchParams(newParams);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-colors ${
                        isSelected
                          ? "border-[var(--accent)] bg-[var(--accent-tint)]"
                          : "border-[#E6E6E1] hover:bg-[#F4F4F1]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {b.logo ? (
                          <div className="h-10 w-10 rounded-full bg-white border border-[#E6E6E1] p-1 flex items-center justify-center shrink-0">
                            <img
                              src={b.logo}
                              alt={b.name}
                              className="h-6 w-auto object-contain"
                            />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-[#EAEAE6] flex items-center justify-center shrink-0 text-sm font-bold text-[#14161A]">
                            {initial}
                          </div>
                        )}
                        <div>
                          <div className={`text-sm font-semibold ${isSelected ? "text-[var(--accent)]" : "text-[#14161A]"}`}>
                            {b.name}
                          </div>
                          <div className="text-[11px] text-[#6B727C]">
                            {b.isComingSoon && count === 0
                              ? t("shop.partnerComingSoon")
                              : `${b.isFlagship ? t("shop.flagshipBrand") : t("shop.activeBrand")} • ${count} ${unit}`}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="text-xs font-bold text-[var(--accent)]">
                          {t("shop.activeStatus")}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {urlBrand && (
                <button
                  onClick={() => {
                    setBrandSheetOpen(false);
                    handleClearBrand();
                  }}
                  className="w-full mt-3 py-2.5 text-center text-xs font-semibold text-[#6B727C] hover:text-[#14161A] border-t border-[#E6E6E1]"
                >
                  {t("shop.clearBrandShowAll")}
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
