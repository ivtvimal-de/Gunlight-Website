import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, MessageCircle, Check } from "lucide-react";
import { useCart } from "../context/CartContext";
import { WHATSAPP_NUMBER, SPECS } from "../config";

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

  // 1. Category line: first category or fallback, uppercase 12px
  const category =
    (product.categories && product.categories[0]) ||
    product.category ||
    "LED Torch";

  // 3. Spec line: the 2 most important specs separated by " · ", clean suffixes, max 1 line
  const getCleanSpec = (spec) => {
    return spec
      .replace(/\s*Chip\s*/i, "")
      .replace(/\s*Rechargeable\s*/i, "")
      .replace(/\s*Emergency\s*/i, "")
      .trim();
  };

  const cleanSpecs = (product.specs || [])
    .filter((s) => !s.includes("[") && !s.includes("]"))
    .slice(0, 2)
    .map(getCleanSpec);

  const specLine = cleanSpecs.join(" · ");

  // 4. Price formatting
  const hasValidPrice =
    product.price && !product.price.includes("[") && product.price !== "On Request";

  // WhatsApp enquiry prefilled URL
  const whatsappEnquiryUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi Jerone Enterprises, I would like to enquire about ${displayName} (${
      hasValidPrice ? product.price : "Price on request"
    }). Is it available for dispatch?`
  )}`;

  // Badges: ONLY show if explicitly set in config.js (currently removed/undefined)
  const badge = SPECS?.models?.[product.id]?.badge;

  const imgSrc = product.imgWebp || product.img;
  const fallbackSrc = product.fallback || product.imgPng || product.img;

  return (
    <div className="group flex flex-col h-full bg-white border border-[#E6E6E1] rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(20,22,26,0.06)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      
      {/* Edge-to-Edge Image (Aspect ratio 4/3 with 1.05 scale on hover) */}
      <Link
        to={product.link}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-[#14161A]"
      >
        {badge && (
          <span className="absolute top-3 left-3 z-10 rounded-md bg-[var(--accent)] px-2 py-0.5 text-[10px] font-bold text-white shadow-xs tracking-wide">
            {badge}
          </span>
        )}
        <picture className="h-full w-full">
          <source srcSet={imgSrc} type="image/webp" />
          <img
            src={fallbackSrc}
            alt={displayName}
            width={400}
            height={300}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </picture>
      </Link>

      {/* Card Body (Padding 16px = p-4) */}
      <div className="p-4 flex-1 flex flex-col">
        
        {/* 1. Small Muted Category Line (Uppercase, 12px) */}
        <span className="text-[12px] uppercase font-semibold text-[var(--text-muted)] tracking-wider mb-1 block truncate">
          {category}
        </span>

        {/* 2. Product Name in Outfit Semibold (1 line max) */}
        <Link
          to={product.link}
          className="font-['Outfit'] font-semibold text-[17px] sm:text-[18px] text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors truncate block mb-1.5"
          title={displayName}
        >
          {displayName}
        </Link>

        {/* 3. ONE Spec Line: 2 most important specs separated by ' · ' (Max 1 line) */}
        <p className="text-[12px] sm:text-[13px] text-[var(--text-secondary)] truncate mb-4">
          {specLine || "High-Power Illumination"}
        </p>

        {/* 4 & 5. Price Row and Action Buttons (mt-auto ensures aligned baseline across row) */}
        <div className="mt-auto pt-2">
          
          {/* Price Row (Outfit 22px bold, no DIRECT PRICE label) */}
          <div className="flex items-baseline justify-between mb-3">
            {hasValidPrice ? (
              <span className="font-['Outfit'] font-bold text-[22px] text-[var(--text-primary)] leading-none tracking-tight">
                {product.price}
              </span>
            ) : (
              <span className="text-[12px] sm:text-xs font-semibold text-[var(--accent)] leading-tight">
                Get price on WhatsApp
              </span>
            )}
          </div>

          {/* Buttons: Full-width Red Add to Cart (40px high) + 40px Square WhatsApp Outline Button */}
          <div className="flex items-center gap-2">
            {hasValidPrice ? (
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 h-[40px] min-w-0 flex items-center justify-center gap-1 sm:gap-1.5 rounded-xl px-1.5 sm:px-2 text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all ${
                  isAdded
                    ? "bg-green-600 text-white"
                    : "bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-xs"
                }`}
                aria-label={`Add ${displayName} to Cart`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            ) : (
              <a
                href={whatsappEnquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-[40px] min-w-0 flex items-center justify-center gap-1 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-[11px] sm:text-xs font-semibold whitespace-nowrap shadow-xs transition-colors px-2"
              >
                <span>Get price on WhatsApp</span>
              </a>
            )}

            {/* 40px Square Outline Button with WhatsApp Icon */}
            <a
              href={whatsappEnquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-[40px] w-[40px] shrink-0 flex items-center justify-center rounded-xl border border-[#E6E6E1] bg-white text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--bg-surface-2)] transition-colors shadow-2xs"
              title="Enquire on WhatsApp"
              aria-label="Enquire on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-[var(--accent)] shrink-0" />
            </a>
          </div>

        </div>

      </div>

    </div>
  );
}
