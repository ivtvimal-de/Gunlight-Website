import { Link, useSearchParams } from "react-router-dom";
import { useCatalog } from "../context/CatalogContext";

export default function BrandStrip() {
  const [searchParams] = useSearchParams();
  const { brands } = useCatalog();
  const currentBrand = (searchParams.get("brand") || "").toLowerCase();
  const visibleBrands = brands.filter((b) => b.isActive !== false);

  if (visibleBrands.length === 0) return null;

  return (
    /* Strictly mobile-only (<768px): desktop markup and styles completely removed */
    <section
      id="brand-strip"
      className="md:hidden relative bg-[#FAFAF8] border-b border-[#E6E6E1] py-3 overflow-hidden font-['Inter']"
      aria-label="Shop by Brand"
    >
      <div className="relative mx-auto px-4">
        
        {/* Soft edge fade mask on mobile so it's clear it scrolls horizontally */}
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#FAFAF8] to-transparent z-10"
          aria-hidden="true"
        />

        {/* Brand Circle Row (mobile only) */}
        <div className="flex items-start gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {visibleBrands.map((brand) => {
            const isActive =
              currentBrand === brand.slug.toLowerCase() ||
              currentBrand === brand.name.toLowerCase();
            const hasLogo = Boolean(brand.logo);
            const displayLabel =
              brand.slug === "gunlite" && brand.name === "GunLite"
                ? "GunLite"
                : brand.name;

            return (
              <Link
                key={brand.slug}
                to={`/shop?brand=${brand.slug}`}
                className="group flex flex-col items-center shrink-0 snap-start focus:outline-none"
                aria-label={`View products from ${displayLabel}`}
              >
                <div
                  className={`w-[56px] h-[56px] rounded-full overflow-hidden flex items-center justify-center transition-transform duration-150 active:scale-[0.96] shadow-[0_2px_6px_rgba(20,22,26,0.06)] ${
                    isActive
                      ? "border-2 border-[#D90F25]"
                      : "border-[1.5px] border-[#E6E6E1]"
                  } ${hasLogo ? "bg-white" : "bg-[#F4F4F1]"}`}
                >
                  {hasLogo ? (
                    <picture className="w-full h-full p-2.5 flex items-center justify-center">
                      {brand.logoWebp && (
                        <source srcSet={brand.logoWebp} type="image/webp" />
                      )}
                      <img
                        src={brand.logo}
                        alt={displayLabel}
                        width={48}
                        height={16}
                        className="w-full h-full object-contain"
                      />
                    </picture>
                  ) : (
                    <span className="font-['Outfit'] font-bold text-base text-[#4A5058] select-none">
                      {displayLabel.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <span
                  className={`mt-1.5 text-[12px] font-[500] leading-[1.2] text-center max-w-[62px] line-clamp-2 transition-colors ${
                    isActive
                      ? "text-[#D90F25] font-semibold"
                      : "text-[#4A5058]"
                  }`}
                >
                  {displayLabel}
                </span>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
