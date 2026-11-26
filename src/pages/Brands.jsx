import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";
import SEO from "../components/SEO";
import ProductCard from "../components/ProductCard";
import { useCatalog } from "../context/CatalogContext";
import { BRANDS } from "../config";

export default function Brands() {
  const { products } = useCatalog();
  const GUNLITE_PRODUCTS = products.filter(
    (p) => !p.brand || p.brand.toLowerCase() === "gunlite"
  );
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          
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

          <h1 className="font-['Outfit'] text-[28px] sm:text-[32px] font-bold text-[#14161A] tracking-tight mb-6 sm:mb-10">
            Brands
          </h1>

          {/* 2. FEATURE CARD for GunLite */}
          <section className="mb-10 sm:mb-16">
            <div className="rounded-2xl sm:rounded-[24px] bg-[#14161A] p-5 sm:p-10 text-white shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
                
                {/* Left Column: Logo in white chip, tagline, product count, and red CTA button */}
                <div className="flex flex-col justify-center">
                  <div className="inline-flex items-center justify-center rounded-xl bg-white px-3.5 py-2 w-fit mb-4 sm:mb-5 shadow-xs">
                    <img
                      src={mainBrand.logo || "/images/logo.png"}
                      alt="GunLite"
                      className="h-7 sm:h-8 w-auto object-contain"
                    />
                  </div>

                  <p className="text-sm sm:text-lg text-[#E6E6E1] leading-relaxed mb-3 sm:mb-4 max-w-md">
                    Professional LED torches and search lights from Coimbatore.
                  </p>

                  <div className="text-xs text-[#A0A6AF] font-medium mb-5 sm:mb-6">
                    {GUNLITE_PRODUCTS.length} products available
                  </div>

                  <Link
                    to="/shop?brand=gunlite"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-5 sm:px-6 h-11 text-sm font-semibold transition-colors w-fit shadow-xs"
                  >
                    <span>Shop all products</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Right Column: Full 3:2 product image rounded 16px, zero cropping */}
                <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[16px] bg-[#1D2127] border border-white/10">
                  <picture className="block w-full h-full">
                    <source srcSet="/images/eaglemain.webp" type="image/webp" />
                    <img
                      src="/images/eaglemain.png"
                      alt="GunLite Professional Search Light"
                      width={1536}
                      height={1024}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </picture>
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

