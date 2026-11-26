import React, { useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link, useSearchParams } from "react-router-dom";
import { Search, X, Flashlight, Package, Sparkles } from "lucide-react";
import { useCatalog } from "../context/CatalogContext";
import SEO from "../components/SEO";
import ProductCard from "../components/ProductCard";
import { BRANDS } from "../config";

gsap.registerPlugin(ScrollTrigger);

export default function Shop() {
  const { products: ALL_PRODUCTS, categories: apiCategories, loading } = useCatalog();
  const CATEGORY_LIST = useMemo(
    () => ["All", ...apiCategories.map((c) => c.name)],
    [apiCategories]
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const urlCategory = searchParams.get("category");
  const urlBrand = searchParams.get("brand");

  // Check if URL brand param or search query matches a known brand
  const matchedBrandObj = useMemo(() => {
    // 1. Direct ?brand= URL parameter
    if (urlBrand) {
      return (
        BRANDS.find((b) => b.slug.toLowerCase() === urlBrand.toLowerCase()) || {
          slug: urlBrand.toLowerCase(),
          name: urlBrand,
          demo: urlBrand.toLowerCase() !== "gunlite",
        }
      );
    }
    // 2. Search query matching a brand name (e.g. "philips", "wipro", "eveready", "bajaj", "mi", "gunlite")
    const q = urlQuery.trim().toLowerCase();
    if (!q) return null;
    return (
      BRANDS.find((b) => {
        const slug = b.slug.toLowerCase();
        const name = b.name.toLowerCase();
        return q === slug || q === name || q.includes(slug) || q.includes(name);
      }) || null
    );
  }, [urlBrand, urlQuery]);

  const isDemoBrand = Boolean(matchedBrandObj && matchedBrandObj.demo);

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

  // Sync state if category in URL changes
  useEffect(() => {
    if (urlCategory) {
      setActiveCategory(matchedUrlCategory);
    } else if (!urlCategory && !urlQuery) {
      setActiveCategory("All");
    }
  }, [urlCategory, urlQuery, matchedUrlCategory]);

  // Open brand sheet if opened from navigation state or URL hash
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

  // Animate hero on mount
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

  // Filter products based on category AND search query (Brand name & Category-wise support)
  const filtered = useMemo(() => {
    if (isDemoBrand) return [];

    const q = urlQuery.trim().toLowerCase();
    const qClean = q.replace(/[\s\-_]+/g, "");

    return ALL_PRODUCTS.filter((product) => {
      // 1. Category Tab Filter
      const matchesCategoryTab =
        activeCategory === "All" ||
        product.categories.some(
          (c) => c.toLowerCase() === activeCategory.toLowerCase()
        );

      if (!matchesCategoryTab) return false;

      // 2. If no search query, matches category tab!
      if (!q) return true;

      // 3. Brand Search (e.g. "gunlite", "our brands")
      if (
        q === "gunlite" ||
        q === "our brands" ||
        q.includes("gunlite") ||
        (product.brand && product.brand.toLowerCase().includes(q))
      ) {
        return true;
      }

      // 4. Product Title, Description, ShortSpec & SKU Match
      const titleMatch = (product.title || "").toLowerCase().includes(q);
      const descMatch = (product.desc || "").toLowerCase().includes(q);
      const skuMatch = (product.sku || "").toLowerCase().includes(q);
      const shortSpecMatch = (product.shortSpec || "").toLowerCase().includes(q);

      // 5. Specs Match (handles both string specs and { label, value } objects from MongoDB)
      const specsMatch = (product.specs || []).some((s) => {
        const text = typeof s === "string" ? s : `${s.label || ""} ${s.value || ""}`;
        return text.toLowerCase().includes(q);
      });

      // 6. Category-wise Search Match (e.g. "search light", "searchlight", "led torch", "torch", "rechargeable")
      const categoryMatch = (product.categories || []).some((c) => {
        const cLower = c.toLowerCase();
        const cClean = cLower.replace(/[\s\-_]+/g, "");
        return (
          cLower.includes(q) ||
          q.includes(cLower) ||
          cClean.includes(qClean) ||
          qClean.includes(cClean)
        );
      });

      // Flexible Category Search Synonyms
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
  }, [ALL_PRODUCTS, activeCategory, urlQuery, isDemoBrand]);

  // Animate cards whenever filtered list changes
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
        title="Shop LED Torches & High-Power Search Lights"
        description="Browse all GunLite high-power rechargeable LED searchlights, tactical flashlights, and portable torches by Jerone Enterprises. Fast dispatch across India."
        path="/shop"
        type="website"
      />
      <main className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
        
        {/* ── Page Header (Compact) ── */}
        <section className="relative border-b border-[var(--border-subtle)] bg-white py-8 sm:py-10">
          <div ref={heroRef} className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <span className="mb-2 inline-block rounded-full border border-[var(--border-subtle)] bg-[var(--accent-tint)] px-3.5 py-1 text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
              {matchedBrandObj ? matchedBrandObj.name : "Illumination Hardware"}
            </span>
            <h1 className="mb-2 font-['Outfit'] text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] tracking-tight">
              {matchedBrandObj ? `${matchedBrandObj.name} Products` : "Shop GunLite Torches"}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-xl mx-auto">
              Professional LED torches built for performance, durability, and reliability across India.
            </p>
          </div>
        </section>

        {/* ── Filter Bar (Sticky below the Navbar: 64px mobile / 72px desktop) ── */}
        <section className="sticky top-16 lg:top-[72px] z-30 border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)]/95 px-4 py-3 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center gap-2 sm:gap-3 overflow-x-auto pb-1 px-4 sm:px-6 lg:px-8">
            
            {/* Mobile "Brand" Chip that opens the brand bottom sheet */}
            <button
              onClick={() => setBrandSheetOpen(true)}
              className={`md:hidden shrink-0 flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
                urlBrand
                  ? "bg-[var(--accent)] text-white shadow-xs"
                  : "border border-[var(--border-subtle)] bg-white text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{urlBrand ? `Brand: ${matchedBrandObj?.name || urlBrand}` : "Brands"}</span>
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
                {cat}
              </button>
            ))}

            {/* Active Brand Removable Chip (Item 5: "Brand: <name> x") */}
            {urlBrand && (
              <span className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[var(--accent-tint)] border border-[var(--border-subtle)] px-3 py-1.5 text-xs text-[var(--accent)] font-semibold">
                <span>Brand: {matchedBrandObj ? matchedBrandObj.name : urlBrand}</span>
                <button
                  onClick={handleClearBrand}
                  className="ml-0.5 text-[var(--accent)] hover:text-[var(--accent-hover)] transition p-0.5 rounded-full hover:bg-black/5"
                  aria-label="Clear brand filter"
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
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <span className="ml-auto shrink-0 text-xs text-[var(--text-muted)]">
              {isDemoBrand ? 0 : filtered.length} of {isDemoBrand ? 0 : ALL_PRODUCTS.length} products
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
          ) : isDemoBrand ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 sm:py-24 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-[#E6E6E1] shadow-xs">
                <Package className="w-8 h-8 text-[var(--accent)]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-[var(--text-primary)]">
                No products from {matchedBrandObj.name} yet
              </h2>
              <p className="text-[var(--text-secondary)] text-sm max-w-md">
                New brands are coming soon.
              </p>
              <Link
                to="/shop?brand=gunlite"
                className="mt-2 inline-flex items-center justify-center rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-6 py-3 text-xs sm:text-sm font-semibold text-white transition-colors shadow-xs"
              >
                View GunLite Products
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-[var(--border-subtle)] shadow-xs">
                <Flashlight className="w-8 h-8 text-[var(--accent)]" />
              </div>
              <p className="text-xl font-bold font-['Outfit'] text-[var(--text-primary)]">No products found</p>
              <p className="text-[var(--text-muted)] text-sm">
                Try a different search term or category filter.
              </p>
              <button
                onClick={() => { setActiveCategory("All"); handleClearSearch(); }}
                className="mt-2 rounded-lg bg-[var(--accent)] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[var(--accent-hover)] transition shadow-xs"
              >
                Show all products
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
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-200"
              onClick={() => setBrandSheetOpen(false)}
            />

            {/* Bottom Sheet Modal */}
            <div className="fixed bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-[20px] bg-white p-5 shadow-2xl z-10 animate-in slide-in-from-bottom duration-250 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
              {/* Drag handle */}
              <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-[#E6E6E1]" />

              <div className="flex items-center justify-between pb-3 border-b border-[#E6E6E1] mb-4">
                <div>
                  <h3 className="font-['Outfit'] text-lg font-bold text-[#14161A]">
                    Select Brand
                  </h3>
                  <p className="text-xs text-[#6B727C]">
                    Browse torches by manufacturer
                  </p>
                </div>
                <button
                  onClick={() => setBrandSheetOpen(false)}
                  className="h-8 w-8 rounded-full border border-[#E6E6E1] flex items-center justify-center text-[#14161A] hover:bg-[#F4F4F1]"
                  aria-label="Close brand sheet"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Brand List */}
              <div className="space-y-2">
                {BRANDS.map((b) => {
                  const isSelected =
                    (urlBrand && urlBrand.toLowerCase() === b.slug.toLowerCase()) ||
                    (!urlBrand && b.slug === "gunlite");
                  const initial = b.name.charAt(0).toUpperCase();

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
                        {b.slug === "gunlite" ? (
                          <div className="h-10 w-10 rounded-full bg-white border border-[#E6E6E1] p-1 flex items-center justify-center shrink-0">
                            <img
                              src={b.logo || "/images/logo.png"}
                              alt="GunLite"
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
                            {b.slug === "gunlite" ? "Our Flagship Brand • 4 products" : "Partner Brand • Coming soon"}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="text-xs font-bold text-[var(--accent)]">
                          Active
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Clear brand option if a brand is currently selected */}
              {urlBrand && (
                <button
                  onClick={() => {
                    setBrandSheetOpen(false);
                    handleClearBrand();
                  }}
                  className="w-full mt-3 py-2.5 text-center text-xs font-semibold text-[#6B727C] hover:text-[#14161A] border-t border-[#E6E6E1]"
                >
                  Clear Brand Filter (Show All)
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
