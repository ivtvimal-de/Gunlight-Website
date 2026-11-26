import { Link } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";
import ProductCard from "../components/ProductCard";

export const STORE_PRODUCTS = [
  {
    id: "eagle",
    title: "Eagle 3.1 GunLite",
    desc: "Long range high-power search light with rugged aluminium build.",
    price: "₹2,499",
    priceNum: 2499,
    link: "/eagle",
    categories: ["Search Light"],
    specs: ["50W LED Chip", "Type-C Rechargeable", "SOS Emergency"],
    imgWebp: "/images/eagle.webp",
    imgPng: "/images/eagle.png",
  },
  {
    id: "everest",
    title: "Everest LED GunLite",
    desc: "Professional-grade LED torch with 10,000mAh dual-battery backup.",
    price: "₹1,999",
    priceNum: 1999,
    link: "/everest",
    categories: ["LED Torch", "Rechargeable"],
    specs: ["55W LED", "10,000mAh Battery", "Reverse USB Out"],
    imgWebp: "/images/everest.webp",
    imgPng: "/images/everest.png",
  },
  {
    id: "tiger",
    title: "Tiger Pro-1 GunLite",
    desc: "Rechargeable emergency torch for home, patrol, and estate safety.",
    price: "₹1,499",
    priceNum: 1499,
    link: "/tiger",
    categories: ["Rechargeable"],
    specs: ["500 Lumens", "4000mAh Lithium", "CREE LED"],
    imgWebp: "/images/tigerpro.webp",
    imgPng: "/images/tigerpro.png",
  },
  {
    id: "sniper",
    title: "Sniper X2 GunLite",
    desc: "Compact high-power torch with adjustable zoom flood-to-spot optics.",
    price: "₹999",
    priceNum: 999,
    link: "/sniper",
    categories: ["LED Torch"],
    specs: ["1000 Lumens", "2× 18650 Battery", "Zoom Flood/Focus"],
    imgWebp: "/images/sniper.webp",
    imgPng: "/images/sniper.png",
  },
];

export default function FeaturedProducts() {
  return (
    <section className="py-10 sm:py-16 bg-white border-b border-[var(--border-subtle)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-end justify-between gap-3 mb-6 sm:mb-9">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5" />
                Featured Collection
              </span>
            </div>
            <h2 className="font-['Outfit'] text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text-primary)] tracking-tight leading-tight">
              Popular Illumination Hardware
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 hidden sm:block">
              Tested, verified models ready for instant dispatch across India
            </p>
          </div>
          <Link
            to="/shop"
            className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors pb-0.5"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4-Column Product Grid (2 columns on mobile / 4 columns on desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {STORE_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}
