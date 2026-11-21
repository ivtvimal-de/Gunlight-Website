import { Link } from "react-router-dom";
import { ArrowRight, Layers } from "lucide-react";

const CATEGORIES = [
  {
    name: "LED Torches",
    slug: "LED+Torch",
    link: "/shop?category=LED+Torch",
    desc: "Everyday & high-power portable handheld torches",
    spec: "Up to 55W High Power",
    imgWebp: "/images/everest.webp",
    imgPng: "/images/everest.png",
  },
  {
    name: "Search Lights",
    slug: "Search+Light",
    link: "/shop?category=Search+Light",
    desc: "Long-distance focused beam searchlights",
    spec: "Fresnel Lens Optics",
    imgWebp: "/images/eagle.webp",
    imgPng: "/images/eagle.png",
  },
  {
    name: "Rechargeable Lights",
    slug: "Rechargeable",
    link: "/shop?category=Rechargeable",
    desc: "Lithium-ion emergency & security illumination",
    spec: "10,000mAh Backup",
    imgWebp: "/images/tigerpro.webp",
    imgPng: "/images/tigerpro.png",
  },
  {
    name: "All Models",
    slug: "All",
    link: "/shop",
    desc: "Explore full GunLite catalogue with specs",
    spec: "Pan-India Transit",
    imgWebp: "/images/sniper.webp",
    imgPng: "/images/sniper.png",
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

        {/* 4-Tile Row Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={cat.link}
              className="group relative flex flex-col rounded-2xl border border-[var(--border-subtle)] bg-white p-4 sm:p-5 shadow-[0_4px_20px_rgba(20,22,26,0.04)] hover:border-[var(--accent)] hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              {/* Product Image Stage in #F4F4F1 Area */}
              <div className="relative mb-4 flex h-36 sm:h-44 w-full items-center justify-center rounded-xl bg-[var(--bg-surface-2)] p-3 overflow-hidden group-hover:bg-[#ECECE8] transition-colors">
                <picture className="w-full flex items-center justify-center">
                  <source srcSet={cat.imgWebp} type="image/webp" />
                  <img
                    src={cat.imgPng}
                    alt={cat.name}
                    width={180}
                    height={160}
                    loading="lazy"
                    className="max-h-28 sm:max-h-36 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </picture>

                <span className="absolute top-2 left-2 rounded-md bg-white/90 backdrop-blur-xs px-2 py-0.5 text-[10px] font-medium text-[var(--text-muted)] border border-[var(--border-subtle)]">
                  {cat.spec}
                </span>
              </div>

              {/* Title & Arrow */}
              <div className="flex items-center justify-between mt-auto">
                <div>
                  <h3 className="font-['Outfit'] text-sm sm:text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5">
                    {cat.desc}
                  </p>
                </div>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-surface-2)] text-[var(--text-secondary)] group-hover:bg-[var(--accent)] group-hover:text-white transition-colors ml-2">
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}

