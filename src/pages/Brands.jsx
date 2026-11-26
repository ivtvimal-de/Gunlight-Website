import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";
import SEO from "../components/SEO";
import ProductCard from "../components/ProductCard";
import { useCatalog } from "../context/CatalogContext";

function productMatchesBrand(product, brand) {
  const pb = String(product?.brand || "").trim().toLowerCase();
  const nameLower = String(brand?.name || "").trim().toLowerCase();
  const slugLower = String(brand?.slug || "").trim().toLowerCase();

  if (!pb) {
    return slugLower === "gunlite" || Boolean(brand?.isFlagship);
  }
  return pb === nameLower || pb === slugLower;
}

export default function Brands() {
  const { products, brands } = useCatalog();

  const activeBrands = brands.filter(
    (b) => b.isActive !== false && !b.isComingSoon
  );
  const comingSoonBrands = brands.filter(
    (b) => b.isActive !== false && b.isComingSoon
  );

  const flagshipBrands = (() => {
    const flagged = activeBrands.filter((b) => b.isFlagship);
    if (flagged.length > 0) return flagged;
    return activeBrands.length > 0 ? [activeBrands[0]] : [];
  })();

  return (
    <>
      <SEO
        title="Brands | GunLite Illumination Hardware"
        description="Explore torch light brands at GunLite. Discover our flagship GunLite professional high-power LED torches and illumination partners."
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

          {/* 2. FEATURE CARD(S) for Flagship Brands */}
          {flagshipBrands.map((brand) => {
            const brandProducts = products.filter((p) =>
              productMatchesBrand(p, brand)
            );
            const bannerImg =
              brand.bannerImage ||
              brandProducts[0]?.heroImg ||
              brandProducts[0]?.img ||
              "/images/eaglemain.webp";

            return (
              <section key={brand.slug} className="mb-10 sm:mb-16">
                <div className="rounded-2xl sm:rounded-[24px] bg-[#14161A] p-5 sm:p-10 text-white shadow-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
                    
                    {/* Left Column: Logo/Badge, tagline, product count, and red CTA button */}
                    <div className="flex flex-col justify-center">
                      {brand.logo ? (
                        <div className="inline-flex items-center justify-center rounded-xl bg-white px-3.5 py-2 w-fit mb-4 sm:mb-5 shadow-xs">
                          <img
                            src={brand.logo}
                            alt={brand.name}
                            className="h-7 sm:h-8 w-auto object-contain"
                          />
                        </div>
                      ) : (
                        <div className="inline-flex items-center rounded-xl bg-white/10 px-4 py-2 w-fit mb-4 sm:mb-5 font-['Outfit'] text-lg font-bold text-white">
                          {brand.name}
                        </div>
                      )}

                      <p className="text-sm sm:text-lg text-[#E6E6E1] leading-relaxed mb-3 sm:mb-4 max-w-md">
                        {brand.tagline ||
                          brand.description ||
                          "Professional LED torches and search lights from Coimbatore."}
                      </p>

                      <div className="text-xs text-[#A0A6AF] font-medium mb-5 sm:mb-6">
                        {brandProducts.length} product
                        {brandProducts.length !== 1 ? "s" : ""} available
                      </div>

                      <Link
                        to={`/shop?brand=${brand.slug}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-5 sm:px-6 h-11 text-sm font-semibold transition-colors w-fit shadow-xs"
                      >
                        <span>Shop all products</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>

                    {/* Right Column: Full 3:2 product image rounded 16px, zero cropping */}
                    <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[16px] bg-[#1D2127] border border-white/10">
                      <img
                        src={bannerImg}
                        alt={`${brand.name} Showcase`}
                        width={1536}
                        height={1024}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                  </div>
                </div>
              </section>
            );
          })}

          {/* 3. Sections for Each Live Brand's Products */}
          {activeBrands.map((brand) => {
            const brandProducts = products.filter((p) =>
              productMatchesBrand(p, brand)
            );
            if (brandProducts.length === 0 && !brand.isFlagship) return null;

            return (
              <section key={`grid-${brand.slug}`} className="mb-10 sm:mb-16">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    {brand.logo && !brand.isFlagship && (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="h-7 w-auto object-contain rounded-md bg-white border border-[#E6E6E1] px-2 py-1"
                      />
                    )}
                    <h2 className="font-['Outfit'] text-2xl sm:text-3xl font-bold text-[#14161A] tracking-tight">
                      {brand.name} Products
                    </h2>
                  </div>
                  <Link
                    to={`/shop?brand=${brand.slug}`}
                    className="text-xs sm:text-sm font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors inline-flex items-center gap-1"
                  >
                    <span>View all</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {brandProducts.length === 0 ? (
                  <p className="text-sm text-[#6B727C] rounded-2xl bg-white border border-[#E6E6E1] p-6">
                    No active products listed under {brand.name} yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    {brandProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </section>
            );
          })}

          {/* 4. Section: "More Brands" */}
          {comingSoonBrands.length > 0 && (
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
                {comingSoonBrands.map((b) => (
                  <div
                    key={b.slug}
                    className="rounded-[16px] bg-white border border-[#E6E6E1] p-5 opacity-75 cursor-default select-none transition-shadow"
                  >
                    {b.logo ? (
                      <img
                        src={b.logo}
                        alt={b.name}
                        className="h-7 w-auto object-contain mb-2"
                      />
                    ) : null}
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
          )}

        </div>
      </main>
    </>
  );
}

