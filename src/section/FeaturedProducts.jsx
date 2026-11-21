import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, MessageCircle, Check, ArrowRight, Zap } from "lucide-react";
import { useCart } from "../context/CartContext";
import { WHATSAPP_NUMBER } from "../config";

export const STORE_PRODUCTS = [
  {
    id: "eagle",
    title: "Eagle 3.1 GunLite",
    desc: "Long range high-power search light with rugged aluminium build.",
    price: "₹2,499",
    priceNum: 2499,
    link: "/eagle",
    badge: "Best Seller",
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
    badge: "New",
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
    badge: null,
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
    badge: null,
    specs: ["1000 Lumens", "2× 18650 Battery", "Zoom Flood/Focus"],
    imgWebp: "/images/sniper.webp",
    imgPng: "/images/sniper.png",
  },
];

export default function FeaturedProducts() {
  const { addItem } = useCart();
  const [addedId, setAddedId] = useState(null);

  const handleAddToCart = (product) => {
    addItem({ ...product, quantity: 1 });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-[var(--border-subtle)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5" />
                Featured Collection
              </span>
            </div>
            <h2 className="font-['Outfit'] text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
              Popular Illumination Hardware
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
              Tested, verified models ready for instant dispatch across India
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
          >
            <span>Explore All Torches</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4-Column Product Grid (2 columns on mobile) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {STORE_PRODUCTS.map((product) => {
            const isAdded = addedId === product.id;
            const hasValidPrice = product.price && !product.price.includes("[");
            const filteredSpecs = product.specs.filter(
              (s) => !s.includes("[") && !s.includes("]")
            );

            const whatsappEnquiryUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              `Hi Jerone Enterprises, I want to enquire about ${product.title} (${product.price || "Price on request"}). Is it in stock for dispatch?`
            )}`;

            return (
              <div
                key={product.id}
                className="group flex flex-col rounded-2xl border border-[var(--border-subtle)] bg-white p-3.5 sm:p-5 shadow-[0_4px_20px_rgba(20,22,26,0.06)] hover:border-[var(--border-strong)] hover:shadow-md transition-all duration-300 hover:-translate-y-1.5"
              >
                {/* Image Stage on #F4F4F1 Area */}
                <div className="relative mb-3.5 flex h-40 sm:h-52 w-full items-center justify-center rounded-xl bg-[var(--bg-surface-2)] p-3 overflow-hidden">
                  
                  {/* Badge (Only if marked in product data) */}
                  {product.badge && (
                    <span className="absolute top-2.5 left-2.5 z-10 rounded-md bg-[var(--accent)] px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                      {product.badge}
                    </span>
                  )}

                  <Link to={product.link} className="flex h-full w-full items-center justify-center">
                    <picture className="flex h-full w-full items-center justify-center">
                      <source srcSet={product.imgWebp} type="image/webp" />
                      <img
                        src={product.imgPng}
                        alt={product.title}
                        width={240}
                        height={200}
                        loading="lazy"
                        className="max-h-32 sm:max-h-44 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    </picture>
                  </Link>
                </div>

                {/* Product Name */}
                <div className="flex-1 flex flex-col">
                  <Link to={product.link}>
                    <h3 className="font-['Outfit'] text-sm sm:text-base font-bold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors line-clamp-1">
                      {product.title}
                    </h3>
                  </Link>

                  {/* 2-3 Spec Chips */}
                  <div className="mt-2 flex flex-wrap gap-1 sm:gap-1.5">
                    {filteredSpecs.slice(0, 3).map((spec) => (
                      <span
                        key={spec}
                        className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-[var(--text-secondary)]"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] flex items-baseline justify-between">
                    <div>
                      <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">
                        Direct Price
                      </p>
                      {hasValidPrice ? (
                        <p className="font-['Outfit'] text-base sm:text-lg font-bold text-[var(--text-primary)]">
                          {product.price}
                        </p>
                      ) : (
                        <p className="text-xs font-semibold text-[var(--accent)]">
                          Price on Request
                        </p>
                      )}
                    </div>
                  </div>

                  {/* CTAs: Add to Cart (Red) + WhatsApp Enquire */}
                  <div className="mt-4 flex items-center gap-2">
                    {hasValidPrice ? (
                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-3 text-xs font-semibold transition-all ${
                          isAdded
                            ? "bg-green-600 text-white"
                            : "bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-xs"
                        }`}
                        aria-label={`Add ${product.title} to Cart`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <a
                        href={whatsappEnquiryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white py-2.5 px-3 text-xs font-semibold shadow-xs transition-colors"
                      >
                        <span>Get Price on WhatsApp</span>
                      </a>
                    )}

                    {/* Small WhatsApp Enquire Button */}
                    <a
                      href={whatsappEnquiryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-white transition-colors"
                      title="Enquire on WhatsApp"
                      aria-label={`Enquire about ${product.title} on WhatsApp`}
                    >
                      <MessageCircle className="w-4 h-4 text-[var(--accent)]" />
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
