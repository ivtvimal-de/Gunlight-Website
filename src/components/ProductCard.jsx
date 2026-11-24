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

  // 3. ONE key spec line: 13px #4A5058, NEVER truncated with "...". Show only the first or shortest key spec so it fits.
  const getShortSpec = () => {
    if (product.id === "eagle") return "50W LED · Type-C";
    if (product.id === "everest") return "55W LED";
    if (product.id === "tiger") return "500 Lumens";
    if (product.id === "sniper") return "1000 Lumens";

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
    <div className="group flex flex-col h-full bg-white border border-[#E6E6E1] rounded-[16px] overflow-hidden shadow-[0_2px_10px_rgba(20,22,26,0.05)] transition-all duration-200 active:scale-[0.98] md:active:scale-100 md:hover:-translate-y-1">
      
      {/* 1. Image: Natural ratio 1536x1024 = 3/2 (1.5), rounded top corners only, no inner box, nothing cropped */}
      <Link
        to={product.link}
        className="relative block aspect-[3/2] w-full overflow-hidden bg-[#14161A] shrink-0"
      >
        <picture className="h-full w-full">
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
      </Link>

      {/* 2. Content: padding 12px on mobile (16px on desktop = p-3 md:p-4) */}
      <div className="p-3 md:p-4 flex-1 flex flex-col">
        
        {/* Category: 11px uppercase, letter-spacing 0.06em, weight 600, color #8B97A8 */}
        <span className="text-[11px] uppercase font-[600] tracking-[0.06em] text-[#8B97A8] block leading-none">
          {category}
        </span>

        {/* Name: Outfit 16px semibold, #14161A, 1 line, "GunLite" removed (mt-1 = 4px spacing) */}
        <Link
          to={product.link}
          className="font-['Outfit'] font-semibold text-[16px] text-[#14161A] hover:text-[var(--accent)] transition-colors truncate block mt-1 leading-tight"
          title={displayName}
        >
          {displayName}
        </Link>

        {/* ONE spec line: 13px #4A5058, NEVER truncated with "..." (mt-1 = 4px spacing) */}
        <p className="text-[13px] text-[#4A5058] font-normal leading-tight mt-1 whitespace-nowrap">
          {specLine}
        </p>

        {/* 3 & 4. Bottom Block (Price & Buttons pushed to bottom with mt-auto, 12px above price) */}
        <div className="mt-auto pt-3 flex flex-col">
          
          {/* Price: Outfit 18px bold */}
          <div className="mb-3 leading-none">
            {hasValidPrice ? (
              <span className="font-['Outfit'] font-bold text-[18px] text-[#14161A]">
                {product.price}
              </span>
            ) : (
              <span className="text-[13px] font-semibold text-[var(--accent)]">
                Get price on WhatsApp
              </span>
            )}
          </div>

          {/* Buttons: row, 8px gap */}
          <div className="flex items-center gap-2">
            {hasValidPrice ? (
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 h-[40px] min-w-0 flex items-center justify-center gap-1.5 rounded-[10px] px-2 text-[14px] font-semibold transition-colors ${
                  isAdded
                    ? "bg-green-600 text-white"
                    : "bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-xs"
                }`}
                aria-label={`Add ${displayName} to Cart`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4 shrink-0" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 shrink-0" />
                    {/* On screens under 360px show "Add", otherwise "Add to Cart" */}
                    <span className="hidden min-[360px]:inline">Add to Cart</span>
                    <span className="min-[360px]:hidden">Add</span>
                  </>
                )}
              </button>
            ) : (
              <a
                href={whatsappEnquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-[40px] min-w-0 flex items-center justify-center gap-1 rounded-[10px] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-[13px] font-semibold whitespace-nowrap shadow-xs transition-colors px-2"
              >
                <span>Enquire</span>
              </a>
            )}

            {/* WhatsApp: 40px square outline button, 10px radius, MessageCircle in red */}
            <a
              href={whatsappEnquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-[40px] w-[40px] shrink-0 flex items-center justify-center rounded-[10px] border border-[#E6E6E1] bg-white text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[#F4F4F1] transition-colors"
              title="Enquire on WhatsApp"
              aria-label="Enquire on WhatsApp"
            >
              <MessageCircle className="w-[18px] h-[18px] text-[var(--accent)] shrink-0" />
            </a>
          </div>

        </div>

      </div>

    </div>
  );
}
