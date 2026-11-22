import { Link } from "react-router-dom";
import { ArrowRight, Layers } from "lucide-react";

// Real catalog data to accurately calculate dynamic product counts
const ALL_PRODUCTS = [
  { id: "eagle", categories: ["Search Light"], img: "/images/eagle.webp" },
  { id: "everest", categories: ["LED Torch", "Rechargeable"], img: "/images/everest.webp" },
  { id: "tiger", categories: ["Rechargeable"], img: "/images/tigerpro.webp" },
  { id: "sniper", categories: ["LED Torch"], img: "/images/sniper.webp" },
];

const getProductCount = (categoryName) => {
  if (categoryName === "All") return `${ALL_PRODUCTS.length} Products`;
  const count = ALL_PRODUCTS.filter((p) => p.categories.includes(categoryName)).length;
  return `${count} ${count === 1 ? "Product" : "Products"}`;
};

const CATEGORIES = [
  {
    name: "LED Torches",
    slug: "LED+Torch",
    link: "/shop?category=LED+Torch",
    desc: "High-power handheld illumination",
    img: "/images/everest.webp",
    count: getProductCount("LED Torch"),
  },
  {
    name: "Search Lights",
    slug: "Search+Light",
    link: "/shop?category=Search+Light",
    desc: "Extreme long-range focused beam",
    img: "/images/eagle.webp",
    count: getProductCount("Search Light"),
  },
  {
    name: "Rechargeable Lights",
    slug: "Rechargeable",
    link: "/shop?category=Rechargeable",
    desc: "Dual lithium backup power",
    img: "/images/tigerpro.webp",
    count: getProductCount("Rechargeable"),
  },
  {
    name: "All Models",
    slug: "All",
    link: "/shop",
    desc: "Complete hardware collection",
    isCollage: true,
    collageImages: [
      "/images/eagle.webp",
      "/images/everest.webp",
      "/images/tigerpro.webp",
      "/images/sniper.webp",
    ],
    count: getProductCount("All"),
  },
];

export default function ShopByCategory() {
  return (
    <section className="py-14 sm:py-16 bg-[var(--bg-canvas)] border-b border-[var(--border-subtle)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" />
                Hardware Categories
              </span>
            </div>
            <h2 className="font-['Outfit'] text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4-Card Category Grid (Aspect Ratio 4:5 on desktop and mobile) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={cat.link}
              className="group relative flex flex-col aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#14161A] shadow-[0_4px_20px_rgba(20,22,26,0.06)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5"
            >
              {/* Image Layer: Full card coverage */}
              <div className="absolute inset-0 h-full w-full overflow-hidden">
                {cat.isCollage ? (
                  // 2x2 collage representing all models
                  <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-0.5 bg-[#14161A] transition-transform duration-500 ease-out group-hover:scale-105">
                    {cat.collageImages.map((imgSrc, idx) => (
                      <div key={idx} className="relative h-full w-full overflow-hidden bg-[#1b1e24]">
                        <img
                          src={imgSrc}
                          alt={`GunLite Model ${idx + 1}`}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  // Single product image covering full tile
                  <img
                    src={cat.img}
                    alt={cat.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                )}
              </div>

              {/* Dark Gradient Overlay (transparent to rgba(20,22,26,0.85)) */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(20, 22, 26, 0.88) 0%, rgba(20, 22, 26, 0.65) 35%, rgba(20, 22, 26, 0.2) 65%, rgba(20, 22, 26, 0) 100%)",
                }}
              />

              {/* Real Product Count Chip */}
              <div className="absolute top-3 sm:top-3.5 left-3 sm:left-3.5 z-10">
                <span className="inline-block rounded-full bg-black/45 backdrop-blur-md px-2.5 py-1 text-[10px] sm:text-[11px] font-medium text-white/90 border border-white/10 shadow-xs">
                  {cat.count}
                </span>
              </div>

              {/* Bottom Text Content */}
              <div className="relative z-10 mt-auto p-4 sm:p-5 flex flex-col justify-end">
                <h3 className="font-['Outfit'] font-semibold text-base sm:text-lg lg:text-xl text-white tracking-tight leading-snug">
                  {cat.name}
                </h3>
                <p className="text-[11px] sm:text-xs text-white/80 line-clamp-1 mt-1 font-normal">
                  {cat.desc}
                </p>

                {/* "Shop now" + Circle Arrow Button */}
                <div className="mt-3.5 sm:mt-4 flex items-center justify-between pt-1">
                  <span className="text-xs font-semibold text-white tracking-wide">
                    Shop now
                  </span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-xs transition-colors duration-300 group-hover:bg-white group-hover:text-[var(--accent)]">
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>

            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
