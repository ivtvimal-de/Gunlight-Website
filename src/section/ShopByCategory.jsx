import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Layers,
  Flashlight,
  Crosshair,
  BatteryCharging,
  LayoutGrid,
} from "lucide-react";

// Real catalog data to accurately calculate dynamic product counts
const ALL_PRODUCTS = [
  { id: "eagle", categories: ["Search Light"] },
  { id: "everest", categories: ["LED Torch", "Rechargeable"] },
  { id: "tiger", categories: ["Rechargeable"] },
  { id: "sniper", categories: ["LED Torch"] },
];

const getModelCount = (categoryName) => {
  if (categoryName === "All") return `${ALL_PRODUCTS.length} models`;
  const count = ALL_PRODUCTS.filter((p) => p.categories.includes(categoryName)).length;
  return `${count} ${count === 1 ? "model" : "models"}`;
};

const CATEGORIES = [
  {
    name: "LED Torches",
    link: "/shop?category=LED+Torch",
    desc: "Handheld high-beam",
    icon: Flashlight,
    count: getModelCount("LED Torch"),
  },
  {
    name: "Search Lights",
    link: "/shop?category=Search+Light",
    desc: "Long-range optics",
    icon: Crosshair,
    count: getModelCount("Search Light"),
  },
  {
    name: "Rechargeable",
    link: "/shop?category=Rechargeable",
    desc: "Lithium backup power",
    icon: BatteryCharging,
    count: getModelCount("Rechargeable"),
  },
  {
    name: "All Models",
    link: "/shop",
    desc: "Complete lineup",
    icon: LayoutGrid,
    count: getModelCount("All"),
  },
];

export default function ShopByCategory() {
  return (
    <section className="py-8 sm:py-14 bg-[var(--bg-canvas)] border-b border-[var(--border-subtle)]">
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

        {/* Sleek Architectural Category Grid (distinct from Product Cards) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={cat.link}
                className="group flex flex-col justify-between rounded-2xl bg-white border border-[#E6E6E1] p-3.5 sm:p-5 shadow-[0_2px_10px_rgba(20,22,26,0.03)] hover:border-[#14161A]/30 hover:shadow-[0_10px_28px_rgba(20,22,26,0.08)] transition-all duration-250 active:scale-[0.98] md:active:scale-100 md:hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-[#14161A] text-white shadow-2xs group-hover:bg-[var(--accent)] transition-colors duration-250">
                    <Icon className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-medium text-[#6B727C]">
                    <span className="hidden min-[380px]:inline">{cat.count}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#8B97A8] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                </div>

                <div className="mt-4 sm:mt-6">
                  <h3 className="font-['Outfit'] font-bold text-[15px] sm:text-[17px] text-[#14161A] tracking-tight leading-snug group-hover:text-[var(--accent)] transition-colors truncate">
                    {cat.name}
                  </h3>
                  <p className="text-[11.5px] sm:text-xs text-[#6B727C] mt-0.5 leading-snug truncate">
                    {cat.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
