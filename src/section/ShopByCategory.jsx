import { Link } from "react-router-dom";
import { ArrowRight, Layers } from "lucide-react";

// Real catalog data to accurately calculate dynamic product counts
const ALL_PRODUCTS = [
  { id: "eagle", categories: ["Search Light"], img: "/images/eagle.webp" },
  { id: "everest", categories: ["LED Torch", "Rechargeable"], img: "/images/everest.webp" },
  { id: "tiger", categories: ["Rechargeable"], img: "/images/tigerpro.webp" },
  { id: "sniper", categories: ["LED Torch"], img: "/images/sniper.webp" },
];

const getModelCount = (categoryName) => {
  if (categoryName === "All") return `${ALL_PRODUCTS.length} Models`;
  const count = ALL_PRODUCTS.filter((p) => p.categories.includes(categoryName)).length;
  return `${count} ${count === 1 ? "Model" : "Models"}`;
};

const CATEGORIES = [
  {
    name: "LED Torches",
    link: "/shop?category=LED+Torch",
    desc: "Handheld high-beam",
    img: "/images/everest.webp",
    count: getModelCount("LED Torch"),
  },
  {
    name: "Search Lights",
    link: "/shop?category=Search+Light",
    desc: "Long-range optics",
    img: "/images/eagle.webp",
    count: getModelCount("Search Light"),
  },
  {
    name: "Rechargeable Lights",
    link: "/shop?category=Rechargeable",
    desc: "Lithium backup power",
    img: "/images/tigerpro.webp",
    count: getModelCount("Rechargeable"),
  },
  {
    name: "All Models",
    link: "/shop",
    desc: "Complete lineup",
    isCollage: true,
    collageImages: [
      "/images/eagle.webp",
      "/images/everest.webp",
      "/images/tigerpro.webp",
      "/images/sniper.webp",
    ],
    count: getModelCount("All"),
  },
];

export default function ShopByCategory() {
  return (
    <section className="py-9 sm:py-14 bg-[var(--bg-canvas)] border-b border-[var(--border-subtle)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-end justify-between gap-3 mb-5 sm:mb-8">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-[var(--accent)] uppercase tracking-[0.08em]">
                <Layers className="w-3.5 h-3.5" />
                Categories
              </span>
            </div>
            <h2 className="font-['Outfit'] text-xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight leading-tight">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors pb-0.5"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Hero-Style Dark Obsidian Category Cards (Full 3:2 photo on top + smooth feather + category info below) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={cat.link}
              className="group flex flex-col h-full rounded-2xl sm:rounded-[20px] overflow-hidden bg-[#111317] ring-1 ring-black/10 shadow-[0_8px_24px_rgba(20,22,26,0.12)] hover:shadow-[0_14px_32px_rgba(20,22,26,0.18)] transition-all duration-250 active:scale-[0.98] md:active:scale-100 md:hover:-translate-y-1"
            >
              {/* Top: Full 3:2 Photo with bottom feather blend (matching Hero card) */}
              <div className="relative w-full aspect-[3/2] bg-[#16181D] overflow-hidden shrink-0">
                {cat.isCollage ? (
                  <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-[1.5px] bg-[#111317] transition-transform duration-500 ease-out md:group-hover:scale-104">
                    {cat.collageImages.map((imgSrc, idx) => (
                      <div key={idx} className="relative h-full w-full overflow-hidden bg-[#1D2026]">
                        <img
                          src={imgSrc}
                          alt={`GunLite Model ${idx + 1}`}
                          width={1536}
                          height={1024}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <img
                    src={cat.img}
                    alt={cat.name}
                    width={1536}
                    height={1024}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out md:group-hover:scale-104"
                  />
                )}

                {/* Seamless bottom feather melting image into dark card footer */}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[#111317] via-[#111317]/45 to-transparent z-10"
                  aria-hidden="true"
                />
              </div>

              {/* Bottom: Sleek Dark Editorial Footer (matching Hero card) */}
              <div className="flex-1 flex flex-col justify-between bg-gradient-to-b from-[#111317] to-[#171A21] px-3 sm:px-4 pt-1.5 sm:pt-2 pb-3 sm:pb-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[9.5px] sm:text-[10px] font-semibold uppercase tracking-[0.1em] text-white/55">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                    <span>{cat.count}</span>
                  </span>

                  <h3 className="font-['Outfit'] font-bold text-[14px] min-[390px]:text-[15.5px] sm:text-[17px] text-white tracking-tight leading-snug mt-1 truncate">
                    {cat.name}
                  </h3>

                  <p className="text-[11px] sm:text-xs text-[#9CA3AF] mt-0.5 leading-snug truncate">
                    {cat.desc}
                  </p>
                </div>

                <div className="mt-2.5 sm:mt-3.5 pt-2 sm:pt-2.5 border-t border-white/[0.08] flex items-center justify-between gap-2">
                  <span className="text-[11px] sm:text-xs font-semibold text-white/90 group-hover:text-white transition-colors">
                    Shop now
                  </span>
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-[0_2px_8px_rgba(217,15,37,0.35)] transition-transform duration-250 group-hover:translate-x-0.5">
                    <ArrowRight className="h-3 w-3" />
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
