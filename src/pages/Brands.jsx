import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";
import SEO from "../components/SEO";
import ProductCard from "../components/ProductCard";
import { BRANDS } from "../config";

// Real 4 GunLite products from product data
const GUNLITE_PRODUCTS = [
  {
    id: "eagle",
    img: "/images/eagle.webp",
    fallback: "/images/eagle.png",
    title: "Eagle 3.1 GunLite",
    brand: "GunLite",
    desc: "Long range high-power search light with rugged build.",
    price: "₹2,499",
    priceNum: 2499,
    link: "/eagle",
    badge: "Best Seller",
    categories: ["Search Light", "Rechargeable", "LED Torch"],
    specs: ["50W LED Chip", "Type-C Rechargeable", "SOS Emergency"],
  },
  {
    id: "everest",
    img: "/images/everest.webp",
    fallback: "/images/everest.png",
    title: "Everest LED GunLite",
    brand: "GunLite",
    desc: "Professional-grade LED torch with ultra-bright beam.",
    price: "₹1,999",
    priceNum: 1999,
    link: "/everest",
    badge: "New",
    categories: ["LED Torch", "Search Light", "Rechargeable"],
    specs: ["55W LED", "10000mAh Power Bank", "Tri-Light Output"],
  },
  {
    id: "tiger",
    img: "/images/tigerpro.webp",
    fallback: "/images/tigerpro.png",
    title: "Tiger Pro-1 GunLite",
    brand: "GunLite",
    desc: "Rechargeable emergency torch for home and industrial use.",
    price: "₹1,499",
    priceNum: 1499,
    link: "/tiger",
    badge: null,
    categories: ["Rechargeable", "LED Torch"],
    specs: ["500 Lumens", "4000mAh Lithium", "CREE LED"],
  },
  {
    id: "sniper",
    img: "/images/sniper.webp",
    fallback: "/images/sniper.png",
    title: "Sniper X2 GunLite",
    brand: "GunLite",
    desc: "Compact high-power torch with adjustable zoom function.",
    price: "₹999",
    priceNum: 999,
    link: "/sniper",
    badge: null,
    categories: ["LED Torch", "Rechargeable"],
    specs: ["1000 Lumens", "2× 18650 Battery", "Zoom Flood/Focus"],
  },
];

export default function Brands() {
  const mainBrand = BRANDS.find((b) => b.slug === "gunlite") || BRANDS[0];
  const demoBrands = BRANDS.filter((b) => b.slug !== "gunlite");

  return (
    <>
      <SEO
        title="Brands | GunLite Illumination Hardware"
        description="Explore torch light brands at GunLite. Discover our flagship GunLite professional high-power LED torches and upcoming illumination partners."
        path="/brands"
        type="website"
      />

      <main className="min-h-screen bg-[#FAFAF8] text-[#14161A] font-['Inter']">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
          
          {/* 1. Compact Header: breadcrumb "Home / Brands", H1 "Brands" (Outfit bold, 32px) */}
          <nav aria-label="Breadcrumb" className="mb-2">
            <ol className="flex items-center gap-1.5 text-xs text-[#6B727C]">
              <li>
                <Link to="/" className="hover:text-[#14161A] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <ChevronRight className="w-3.5 h-3.5 text-[#8B97A8]" />
              </li>
              <li className="font-medium text-[#14161A]" aria-current="page">
                Brands
              </li>
            </ol>
          </nav>

          <h1 className="font-['Outfit'] text-[32px] font-bold text-[#14161A] tracking-tight mb-8 sm:mb-10">
            Brands
          </h1>

          {/* 2. FEATURE CARD for GunLite: full-width card, 24px radius, dark #14161A background, padding 40px, 2 columns on desktop */}
          <section className="mb-10 sm:mb-16">
            <div className="rounded-[24px] bg-[#14161A] p-6 sm:p-10 text-white shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                
                {/* Left Column: Logo in white chip, tagline, product count, and red CTA button */}
                <div className="flex flex-col justify-center">
                  <div className="inline-flex items-center justify-center rounded-xl bg-white px-3.5 py-2 w-fit mb-5 shadow-xs">
                    <img
                      src={mainBrand.logo || "/images/logo.png"}
                      alt="GunLite"
                      className="h-8 w-auto object-contain"
                    />
                  </div>

                  <p className="text-base sm:text-lg text-[#E6E6E1] leading-relaxed mb-4 max-w-md">
                    Professional LED torches and search lights from Coimbatore.
                  </p>

                  <div className="text-xs text-[#A0A6AF] font-medium mb-6">
                    {GUNLITE_PRODUCTS.length} products available
                  </div>

                  <Link
                    to="/shop?brand=gunlite"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-6 py-3.5 text-sm font-semibold transition-colors w-fit shadow-xs"
                  >
                    <span>Shop all products</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Right Column: Soft product image rounded 16px, object-cover */}
                <div className="relative aspect-4/3 sm:aspect-16/10 w-full overflow-hidden rounded-[16px] bg-[#1D2127] border border-white/10">
                  <picture>
                    <source srcSet="/images/eaglemain.webp" type="image/webp" />
                    <img
                      src="/images/eaglemain.png"
                      alt="GunLite Professional Search Light"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </picture>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                </div>

              </div>
            </div>
          </section>

          {/* 3. Section: "GunLite Products" (4-column grid, 2 on mobile) */}
          <section className="mb-10 sm:mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-['Outfit'] text-2xl sm:text-3xl font-bold text-[#14161A] tracking-tight">
                GunLite Products
              </h2>
              <Link
                to="/shop?brand=gunlite"
                className="text-xs sm:text-sm font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors inline-flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {GUNLITE_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          {/* 4. Section: "More Brands" (simple cards, not clickable, reduced opacity 0.7, cursor-default) */}
          <section className="mb-12">
            <div className="mb-6">
              <h2 className="font-['Outfit'] text-2xl sm:text-3xl font-bold text-[#14161A] tracking-tight">
                More Brands
              </h2>
              <p className="text-xs sm:text-sm text-[#6B727C] mt-1">
                Upcoming partner illumination brands
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {demoBrands.map((b) => (
                <div
                  key={b.slug}
                  className="rounded-[16px] bg-white border border-[#E6E6E1] p-5 opacity-70 cursor-default select-none transition-shadow"
                >
                  <div className="font-['Outfit'] text-[18px] font-bold text-[#14161A] mb-1">
                    {b.name}
                  </div>
                  <div className="text-[12px] text-[#8B97A8] font-medium">
                    Coming soon
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </>
  );
}

