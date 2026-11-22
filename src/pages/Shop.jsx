import React, { useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link, useSearchParams } from "react-router-dom";
import { Search, X, Flashlight } from "lucide-react";
import { useCart } from "../context/CartContext";
import SEO from "../components/SEO";
import ProductCard from "../components/ProductCard";

gsap.registerPlugin(ScrollTrigger);

// ── Product catalogue ────────────────────────────────────────────────────────
const ALL_PRODUCTS = [
  {
    id: "eagle",
    img: "/images/eagle.webp",
    fallback: "/images/eagle.png",
    title: "Eagle 3.1 GunLite",
    desc: "Long range high-power search light with rugged build.",
    price: "₹2,499",
    priceNum: 2499,
    link: "/eagle",
    badge: "Best Seller",
    categories: ["Search Light"],
    specs: ["50W LED Chip", "Type-C Rechargeable", "SOS Emergency"],
  },
  {
    id: "everest",
    img: "/images/everest.webp",
    fallback: "/images/everest.png",
    title: "Everest LED GunLite",
    desc: "Professional-grade LED torch with ultra-bright beam.",
    price: "₹1,999",
    priceNum: 1999,
    link: "/everest",
    badge: "New",
    categories: ["LED Torch", "Rechargeable"],
    specs: ["55W LED", "10000mAh Power Bank", "Tri-Light Output"],
  },
  {
    id: "tiger",
    img: "/images/tigerpro.webp",
    fallback: "/images/tigerpro.png",
    title: "Tiger Pro-1 GunLite",
    desc: "Rechargeable emergency torch for home and industrial use.",
    price: "₹1,499",
    priceNum: 1499,
    link: "/tiger",
    badge: null,
    categories: ["Rechargeable"],
    specs: ["500 Lumens", "4000mAh Lithium", "CREE LED"],
  },
  {
    id: "sniper",
    img: "/images/sniper.webp",
    fallback: "/images/sniper.png",
    title: "Sniper X2 GunLite",
    desc: "Compact high-power torch with adjustable zoom function.",
    price: "₹999",
    priceNum: 999,
    link: "/sniper",
    badge: null,
    categories: ["LED Torch"],
    specs: ["1000 Lumens", "2× 18650 Battery", "Zoom Flood/Focus"],
  },
];

const CATEGORY_LIST = ["All", "LED Torch", "Search Light", "Rechargeable"];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const urlCategory = searchParams.get("category");

  const [activeCategory, setActiveCategory] = useState(
    urlCategory && CATEGORY_LIST.includes(urlCategory) ? urlCategory : "All"
  );
  const [addedId, setAddedId] = useState(null);

  const { addItem, items } = useCart();

  const heroRef = useRef(null);
  const gridRef = useRef(null);
  const cardsRef = useRef([]);

  // Sync state if category in URL changes
  useEffect(() => {
    if (urlCategory && CATEGORY_LIST.includes(urlCategory)) {
      setActiveCategory(urlCategory);
    } else if (!urlCategory && !urlQuery) {
      setActiveCategory("All");
    }
  }, [urlCategory, urlQuery]);

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

  // Filter products based on category AND search query
  const filtered = useMemo(() => {
    return ALL_PRODUCTS.filter((product) => {
      const matchesCategory =
        activeCategory === "All" ||
        product.categories.includes(activeCategory);

      const q = urlQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        product.title.toLowerCase().includes(q) ||
        product.desc.toLowerCase().includes(q) ||
        product.categories.some((c) => c.toLowerCase().includes(q)) ||
        product.specs.some((s) => s.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, urlQuery]);

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
    if (cat !== "All") {
      newParams.category = cat;
    }
    setSearchParams(newParams);
  };

  const handleClearSearch = () => {
    setSearchParams({});
  };

  const handleAddToCart = (product) => {
    addItem({ ...product, quantity: 1 });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
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
        
        {/* ── Page Header ── */}
        <section className="relative border-b border-[var(--border-subtle)] bg-white py-14 sm:py-16">
          <div ref={heroRef} className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <span className="mb-3 inline-block rounded-full border border-[var(--border-subtle)] bg-[var(--accent-tint)] px-4 py-1.5 text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
              Illumination Hardware
            </span>
            <h1 className="mb-4 font-['Outfit'] text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] tracking-tight">
              Shop GunLite Torches
            </h1>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto">
              Professional LED torches built for performance, durability, and reliability — from
              compact carry to industrial search lights.
            </p>
          </div>
        </section>

        {/* ── Filter Bar (Sticky below the 72px Navbar) ── */}
        <section className="sticky top-[72px] z-30 border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)]/95 px-4 py-3 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto pb-1 px-4 sm:px-6 lg:px-8">
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

            {/* Active search pill */}
            {urlQuery && (
              <span className="ml-2 flex shrink-0 items-center gap-2 rounded-lg bg-[var(--accent-tint)] border border-[var(--border-subtle)] px-3.5 py-1.5 text-xs text-[var(--accent)] font-medium">
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
              {filtered.length} of {ALL_PRODUCTS.length} products
            </span>
          </div>
        </section>

        {/* ── Product Grid ── */}
        <section ref={gridRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          {filtered.length === 0 ? (
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
      </main>
    </>
  );
}
