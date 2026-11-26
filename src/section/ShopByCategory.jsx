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
    desc: "High-power handheld beams",
    img: "/images/everest.webp",
    count: getProductCount("LED Torch"),
  },
  {
    name: "Search Lights",
    slug: "Search+Light",
    link: "/shop?category=Search+Light",
    desc: "Long-range focused optics",
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
    desc: "Complete GunLite lineup",
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
    <section className="py-10 sm:py-16 bg-[var(--bg-canvas)] border-b border-[var(--border-subtle)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-end justify-between gap-3 mb-6 sm:mb-9">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" />
                Hardware Categories
              </span>
            </div>
            <h2 className="font-['Outfit'] text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text-primary)] tracking-tight leading-tight">
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

        {/* 4-Card Category Grid: 3:2 full-frame photo on top + clean editorial card footer below */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={cat.link}
              className="group flex flex-col h-full overflow-hidden rounded-2xl bg-white border border-[#E6E6E1] shadow-[0_2px_12px_rgba(20,22,26,0.04)] hover:shadow-[0_10px_28px_rgba(20,22,26,0.09)] hover:border-[#D4D4CE] transition-all duration-250 active:scale-[0.98] md:active:scale-100 md:hover:-translate-y-1"
            >
              {/* Clean 3:2 Image Frame: Zero cropping, zero floating badge collisions */}
              <div className="relative w-full aspect-[3/2] overflow-hidden bg-[#14161A] shrink-0">
                {cat.isCollage ? (
                  <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-[1.5px] bg-[#14161A] transition-transform duration-500 ease-out md:group-hover:scale-104">
                    {cat.collageImages.map((imgSrc, idx) => (
                      <div key={idx} className="relative h-full w-full overflow-hidden bg-[#1b1e24]">
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
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10" aria-hidden="true" />
              </div>

              {/* Clean Structured Card Footer */}
              <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between bg-white">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center rounded-md bg-[#F4F4F1] px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-[#4A5058]">
                      {cat.count}
                    </span>
                    <div className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-tint)] text-[var(--accent)] transition-colors duration-250 group-hover:bg-[var(--accent)] group-hover:text-white">
                      <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform duration-250 group-hover:translate-x-0.5" />
                    </div>
                  </div>

                  <h3 className="font-['Outfit'] font-bold text-[14.5px] sm:text-[17px] text-[#14161A] tracking-tight leading-snug mt-2.5 group-hover:text-[var(--accent)] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#6B727C] mt-0.5 leading-snug">
                    {cat.desc}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
