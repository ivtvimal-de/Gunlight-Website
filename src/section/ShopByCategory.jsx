import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Layers } from "lucide-react";

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

        {/* Distinct Premium Category Setup:
            - Mobile: Sleek dark obsidian horizontal split cards (text left, full 3:2 photo right)
            - Tablet/Desktop: 2-col / 4-col obsidian showcase cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={cat.link}
              className="group flex flex-row sm:flex-col items-center sm:items-stretch justify-between gap-3 sm:gap-0 rounded-2xl bg-[#14161A] border border-white/[0.08] p-2 pl-4 sm:p-2.5 shadow-[0_6px_20px_rgba(20,22,26,0.08)] hover:shadow-[0_14px_32px_rgba(20,22,26,0.16)] hover:border-white/20 transition-all duration-250 active:scale-[0.985] sm:active:scale-100 sm:hover:-translate-y-1"
            >
              {/* Text Content (Left on mobile, Bottom on desktop) */}
              <div className="flex-1 min-w-0 sm:order-2 sm:px-2 sm:pt-3.5 sm:pb-2 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/55">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                    <span>{cat.count}</span>
                  </div>

                  <h3 className="font-['Outfit'] font-bold text-[15.5px] min-[390px]:text-[17px] sm:text-[18px] text-white tracking-tight leading-snug mt-1 truncate group-hover:text-white">
                    {cat.name}
                  </h3>

                  <p className="text-[11.5px] sm:text-xs text-[#9CA3AF] mt-0.5 leading-snug truncate">
                    {cat.desc}
                  </p>
                </div>

                <div className="mt-2 sm:mt-3.5 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-white/85 group-hover:text-white transition-colors">
                    <span>Explore</span>
                    <ArrowRight className="w-3 h-3 text-[var(--accent)] transition-transform duration-250 group-hover:translate-x-0.5" />
                  </span>

                  <span className="hidden sm:flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.08] text-white/80 group-hover:bg-[var(--accent)] group-hover:text-white transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Clean 3:2 Framed Image (Right on mobile, Top on desktop — zero cropping, zero overlap) */}
              <div className="relative w-[124px] min-[390px]:w-[138px] sm:w-full aspect-[3/2] shrink-0 overflow-hidden rounded-xl bg-[#1D2026] ring-1 ring-white/10 sm:order-1">
                {cat.isCollage ? (
                  <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-[1.5px] bg-[#14161A] transition-transform duration-500 ease-out sm:group-hover:scale-104">
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
                    className="h-full w-full object-cover transition-transform duration-500 ease-out sm:group-hover:scale-104"
                  />
                )}
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
