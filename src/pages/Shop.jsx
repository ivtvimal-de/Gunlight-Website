import React, { useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link, useSearchParams } from "react-router-dom";
import { Search, X, Flashlight, Check } from "lucide-react";
import { useCart } from "../context/CartContext";
import SEO from "../components/SEO";

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
    link: "/eagle",
    badge: "Best Seller",
    categories: ["Search Light"],
  },
  {
    id: "everest",
    img: "/images/everest.webp",
    fallback: "/images/everest.png",
    title: "Everest LED GunLite",
    desc: "Professional-grade LED torch with ultra-bright beam.",
    price: "₹1,999",
    link: "/everest",
    badge: "New",
    categories: ["LED Torch", "Rechargeable"],
  },
  {
    id: "tiger",
    img: "/images/tigerpro.webp",
    fallback: "/images/tigerpro.png",
    title: "Tiger Pro-1 GunLite",
    desc: "Rechargeable emergency torch for home and industrial use.",
    price: "₹1,499",
    link: "/tiger",
    badge: null,
    categories: ["Rechargeable"],
  },
  {
    id: "sniper",
    img: "/images/sniper.webp",
    fallback: "/images/sniper.png",
    title: "Sniper X2 GunLite",
    desc: "Compact and powerful torch for everyday carry.",
    price: "₹999",
    link: "/sniper",
    badge: "Popular",
    categories: ["Compact", "LED Torch"],
  },
];

const CATEGORY_LIST = ["All", "Search Light", "LED Torch", "Rechargeable", "Compact"];

// ─────────────────────────────────────────────────────────────────────────────

export default function Shop() {
  const heroRef = useRef(null);
  const gridRef = useRef(null);
  const cardsRef = useRef([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("All");
  const [addedIds, setAddedIds] = useState({});

  const { addItem, openCart, items } = useCart();

  // Read the search query from URL (?q=...) — set by Navbar search
  const urlQuery = searchParams.get("q") || "";

  // Derived: filtered & searched product list
  const filtered = useMemo(() => {
    let list = ALL_PRODUCTS;

    // 1. Category filter
    if (activeCategory !== "All") {
      list = list.filter((p) => p.categories.includes(activeCategory));
    }

    // 2. Search filter (name or description, case-insensitive)
    const q = urlQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.desc.toLowerCase().includes(q) ||
          p.categories.some((c) => c.toLowerCase().includes(q)),
      );
    }

    return list;
  }, [activeCategory, urlQuery]);

  // Reset category when a search is typed
  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    if (urlQuery) setSearchParams({});
  };

  const handleClearSearch = () => {
    setSearchParams({});
  };

  const handleAddToCart = (product) => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      img: product.img,
      quantity: 1,
    });
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  useEffect(() => {
    cardsRef.current = [];
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current.children, {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      });

      gsap.from(cardsRef.current, {
        y: 60,
        opacity: 0,
        scale: 0.95,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <SEO
        title="Shop High-Power Torches & Search Lights"
        description="Browse GunLite collection of rechargeable LED searchlights, long-range zoom torches, and emergency flashlights. Order directly over WhatsApp with Pan-India shipping."
        path="/shop"
        image="/images/hero.webp"
        type="website"
      />
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-16">
        {/* ── Hero Banner ── */}
        <section className="relative overflow-hidden py-20 px-4">
          <div className="absolute inset-0 z-0">
            <picture>
              <source srcSet="/images/hero.webp" type="image/webp" />
              <img
                src="/images/hero.jpg"
                alt="GunLite collection of professional illumination tools"
                width={1920}
                height={600}
                className="h-full w-full object-cover object-center opacity-25"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950" />
          </div>

        <div className="pointer-events-none absolute top-10 right-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 left-20 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl" />

        <div ref={heroRef} className="relative z-10 mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-300">
            Our Collection
          </span>
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Shop{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              GunLite
            </span>{" "}
            Torches
          </h1>
          <p className="text-lg text-slate-400">
            Professional LED torches built for performance, durability, and reliability — from
            compact carry to industrial search lights.
          </p>
        </div>
      </section>

      {/* ── Filter Bar ── */}
      <section className="sticky top-16 z-30 border-b border-slate-800 bg-slate-950/90 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto pb-1">
          {CATEGORY_LIST.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat && !urlQuery
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
                  : "border border-slate-700 text-slate-400 hover:border-blue-500 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}

          {/* Active search pill */}
          {urlQuery && (
            <span className="ml-2 flex shrink-0 items-center gap-2 rounded-full bg-cyan-500/20 border border-cyan-500/40 px-3.5 py-1.5 text-xs text-cyan-300">
              <Search className="w-3.5 h-3.5 text-[#00e5ff]" />
              <span>&ldquo;{urlQuery}&rdquo;</span>
              <button
                onClick={handleClearSearch}
                className="ml-1 text-cyan-400 hover:text-white transition"
                aria-label="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <span className="ml-auto shrink-0 text-sm text-slate-500">
            {filtered.length} of {ALL_PRODUCTS.length} products
          </span>
        </div>
      </section>

      {/* ── Product Grid ── */}
      <section ref={gridRef} className="mx-auto max-w-7xl px-4 py-16">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00e5ff]/10 border border-[#00e5ff]/20">
              <Flashlight className="w-8 h-8 text-[#00e5ff]" />
            </div>
            <p className="text-xl font-semibold text-white">No products found</p>
            <p className="text-slate-400 text-sm">
              Try a different search term or category.
            </p>
            <button
              onClick={() => { setActiveCategory("All"); handleClearSearch(); }}
              className="mt-2 rounded-xl bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition"
            >
              Show all products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((item, idx) => {
              const inCart = items.some((i) => i.id === item.id);
              const isAdded = !!addedIds[item.id];

              return (
                <div
                  key={item.id}
                  ref={(el) => { if (el) cardsRef.current[idx] = el; }}
                  className="group relative flex flex-col rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10"
                >
                  {/* Badge */}
                  {item.badge && (
                    <span className="absolute top-3 left-3 z-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-3 py-1 text-xs font-bold text-white shadow">
                      {item.badge}
                    </span>
                  )}

                  {/* Image */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 p-8">
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100" />
                    <picture>
                      <source srcSet={item.img} type="image/webp" />
                      <img
                        src={item.fallback || item.img}
                        alt={`${item.title} - ${item.desc}`}
                        width={300}
                        height={176}
                        loading="lazy"
                        className="mx-auto h-44 w-full object-contain transition-transform duration-700 group-hover:scale-110"
                      />
                    </picture>
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="mb-1 text-base font-bold text-white transition-colors duration-300 group-hover:text-cyan-400">
                      {item.title}
                    </h3>
                    <p className="mb-4 flex-1 text-sm text-slate-400">{item.desc}</p>
                    <div className="mb-4 text-xl font-bold text-blue-400">{item.price}</div>

                    {/* Actions: Add to Cart & View Details */}
                    <div className="space-y-2">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                          isAdded
                            ? "bg-green-500 text-white"
                            : "bg-blue-600 hover:bg-blue-500 text-white shadow shadow-blue-600/30"
                        }`}
                      >
                        {isAdded ? (
                          <span className="inline-flex items-center gap-1">
                            <Check className="w-4 h-4 text-white" /> Added to Cart
                          </span>
                        ) : inCart ? (
                          "+ Add Another"
                        ) : (
                          "Add to Cart"
                        )}
                      </button>

                      <Link
                        to={item.link}
                        className="relative block w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 text-center text-sm font-semibold text-slate-200 transition-all duration-300 hover:border-slate-500 hover:text-white"
                      >
                        <span className="relative z-10">View Details →</span>
                      </Link>
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div className="h-0.5 w-full origin-left scale-x-0 bg-gradient-to-r from-blue-500 to-cyan-500 transition-transform duration-500 group-hover:scale-x-100" />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── CTA Banner ── */}
      <section className="mx-auto max-w-4xl px-4 pb-20">
        <div className="rounded-3xl border border-blue-800/40 bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900/40 p-10 text-center backdrop-blur">
          <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">
            Need help choosing the right torch?
          </h2>
          <p className="mb-6 text-slate-400">
            Contact our team and we'll help you find the perfect GunLite for your needs.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 hover:shadow-cyan-500/40"
          >
            Contact Us →
          </Link>
        </div>
      </section>
    </main>
    </>
  );
}
