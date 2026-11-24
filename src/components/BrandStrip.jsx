import { Link, useSearchParams } from "react-router-dom";
import { BRANDS } from "../config";

export default function BrandStrip() {
  const [searchParams] = useSearchParams();
  const currentBrand = searchParams.get("brand") || "";

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
          {BRANDS.map((brand) => {
            const isActive = currentBrand === brand.slug;

            return (
              <Link
                key={brand.slug}
                to={`/shop?brand=${brand.slug}`}
                className="group flex flex-col items-center shrink-0 snap-start focus:outline-none"
                aria-label={`View products from ${brand.name}`}
              >
                {/* 
                  Refined Compact Circle (Mobile: 56px):
                  - 1.5px ring in #E6E6E1 (or 2px solid #D90F25 if active)
                  - White fill for Our Brands (10px padding), #F4F4F1 fill for demo brands
                  - Shadow at most 0 2px 6px rgba(20,22,26,0.06)
                  - Press: scale 0.96
                */}
                <div
                  className={`w-[56px] h-[56px] rounded-full overflow-hidden flex items-center justify-center transition-transform duration-150 active:scale-[0.96] shadow-[0_2px_6px_rgba(20,22,26,0.06)] ${
                    isActive
                      ? "border-2 border-[#D90F25]"
                      : "border-[1.5px] border-[#E6E6E1]"
                  } ${!brand.demo ? "bg-white" : "bg-[#F4F4F1]"}`}
                >
                  {!brand.demo ? (
                    /* "Our Brands" GunLite Logo inside, padding 10px, object-contain */
                    <picture className="w-full h-full p-2.5 flex items-center justify-center">
                      <source
                        srcSet={brand.logoWebp || "/images/logo.webp"}
                        type="image/webp"
                      />
                      <img
                        src={brand.logo || "/images/logo.png"}
                        alt={brand.name}
                        width={48}
                        height={16}
                        className="w-full h-full object-contain"
                      />
                    </picture>
                  ) : (
                    /* Demo Brand Monogram: bold letter in #4A5058 */
                    <span className="font-['Outfit'] font-bold text-base text-[#4A5058] select-none">
                      {brand.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Brand Label: 12px, weight 500, line-height 1.2, centered, max 2 lines, 6px below */}
                <span
                  className={`mt-1.5 text-[12px] font-[500] leading-[1.2] text-center max-w-[62px] line-clamp-2 transition-colors ${
                    isActive
                      ? "text-[#D90F25] font-semibold"
                      : "text-[#4A5058]"
                  }`}
                >
                  {brand.name}
                </span>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
