import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, MessageCircle, Check } from "lucide-react";
import { useCart } from "../context/CartContext";
import { WHATSAPP_NUMBER } from "../config";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem({ ...product, quantity: 1 });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  // Remove repeated "GunLite" from displayed name
  const displayName = (product.title || "")
    .replace(/\s*GunLite\s*/gi, "")
    .trim();

  // 1. Category line: uppercase 11px, letter-spacing 0.06em, weight 600, color #8B97A8 (muted)
  const category =
    (product.categories && product.categories[0]) ||
    product.category ||
    "LED Torch";

  // 3. ONE concise key spec line so it fits cleanly on 2-column mobile without wrapping
  const getShortSpec = () => {
    if (product.id === "eagle") return "50W LED · Type-C";
    if (product.id === "everest") return "55W LED · 10,000mAh";
    if (product.id === "tiger") return "500 Lm · 4000mAh";
    if (product.id === "sniper") return "1000 Lm · Zoom";

    if (product.specs && product.specs.length > 0) {
      const first = product.specs[0]
        .replace(/\s*Chip\s*/i, "")
        .replace(/\s*Rechargeable\s*/i, "")
        .replace(/\s*Emergency\s*/i, "")
        .trim();
      return first;
    }
    return "High-Power LED";
  };

  const specLine = getShortSpec();

  // 4. Price formatting
  const hasValidPrice =
    product.price && !product.price.includes("[") && product.price !== "On Request";

  // WhatsApp enquiry prefilled URL
  const whatsappEnquiryUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi Jerone Enterprises, I would like to enquire about ${displayName} (${
      hasValidPrice ? product.price : "Price on request"
    }). Is it available for dispatch?`
  )}`;

  const imgSrc = product.imgWebp || product.img;
  const fallbackSrc = product.fallback || product.imgPng || product.img;

  return (
    <div className="group flex flex-col h-full bg-white border border-[#E6E6E1] rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(20,22,26,0.04)] hover:shadow-[0_10px_28px_rgba(20,22,26,0.09)] hover:border-[#D4D4CE] transition-all duration-250 active:scale-[0.98] md:active:scale-100 md:hover:-translate-y-1">
      
      {/* 1. Image: Natural ratio 1536x1024 = 3/2, zero cropping */}
      <Link
        to={product.link}
        className="relative block aspect-[3/2] w-full overflow-hidden bg-[#14161A] shrink-0"
      >
        <picture className="block h-full w-full">
          <source srcSet={imgSrc} type="image/webp" />
          <img
            src={fallbackSrc}
            alt={displayName}
            width={1536}
            height={1024}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 ease-out md:group-hover:scale-104"
          />
        </picture>
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10" aria-hidden="true" />
      </Link>

      {/* 2. Content */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col">
        
        {/* Category & optional badge */}
        <div className="flex items-center justify-between gap-1.5">
          <span className="text-[10px] sm:text-[11px] uppercase font-semibold tracking-[0.06em] text-[#6B727C] leading-none truncate">
            {category}
          </span>
          {product.badge && (
            <span className="hidden sm:inline-flex items-center rounded-md bg-[var(--accent-tint)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--accent)] leading-none shrink-0">
              {product.badge}
            </span>
          )}
        </div>

        {/* Name */}
        <Link
          to={product.link}
          className="font-['Outfit'] font-bold text-[15px] sm:text-[17px] text-[#14161A] hover:text-[var(--accent)] transition-colors truncate block mt-1.5 leading-tight"
          title={displayName}
        >
          {displayName}
        </Link>

        {/* Concise Spec Line */}
        <p className="text-[12px] sm:text-[13px] text-[#4A5058] font-normal leading-snug mt-1 truncate">
          {specLine}
        </p>

        {/* Bottom Block (Price + Single-Line CTA Buttons) */}
        <div className="mt-auto pt-3 flex flex-col">
          
          <div className="pt-2.5 border-t border-[#F1F1ED] flex items-baseline justify-between gap-2 mb-2.5">
            {hasValidPrice ? (
              <span className="font-['Outfit'] font-bold text-[17px] sm:text-[19px] text-[#14161A] leading-none tabular-nums">
                {product.price}
              </span>
            ) : (
              <span className="text-[12.5px] font-semibold text-[var(--accent)] leading-none">
                Get price on WhatsApp
              </span>
            )}
          </div>

          {/* Buttons: strictly single-line text on all screen widths */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {hasValidPrice ? (
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 h-9 sm:h-10 min-w-0 inline-flex items-center justify-center gap-1.5 rounded-xl px-2.5 sm:px-3 text-[12.5px] sm:text-[13.5px] font-semibold whitespace-nowrap transition-all ${
                  isAdded
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-[0_2px_8px_rgba(217,15,37,0.22)]"
                }`}
                aria-label={`Add ${displayName} to Cart`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span className="sm:hidden">Add</span>
                    <span className="hidden sm:inline">Add to Cart</span>
                  </>
                )}
              </button>
            ) : (
              <a
                href={whatsappEnquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-9 sm:h-10 min-w-0 inline-flex items-center justify-center gap-1 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-[12.5px] sm:text-[13px] font-semibold whitespace-nowrap shadow-xs transition-colors px-2"
              >
                <span>Enquire</span>
              </a>
            )}

            <a
              href={whatsappEnquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 inline-flex items-center justify-center rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--accent-tint)] transition-colors"
              title="Enquire on WhatsApp"
              aria-label="Enquire on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-[var(--accent)] shrink-0" />
            </a>
          </div>

        </div>

      </div>

    </div>
  );
}
