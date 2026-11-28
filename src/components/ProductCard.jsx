import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, MessageCircle, Check } from "lucide-react";
import { useCart, parsePriceNum } from "../context/CartContext";
import { WHATSAPP_NUMBER } from "../config";
import { useTranslation } from "../i18n/LanguageContext";
import {
  translateBadge,
  translateCategoryName,
  translateShortSpec,
} from "../i18n/catalogI18n";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { language, t } = useTranslation();
  const [isAdded, setIsAdded] = useState(false);

  const basePriceNum = product.priceNum ?? parsePriceNum(product.price);
  const hasValidPrice =
    basePriceNum > 0 &&
    product.price &&
    !product.price.includes("[") &&
    product.price !== "On Request";

  const isOutOfStock = Boolean(product.outOfStock || product.stockQuantity <= 0);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (isOutOfStock) return;
    addItem({
      ...product,
      baseId: product.id,
      basePriceNum,
      hasWarranty: false,
      warrantyFee: 0,
      quantity: 1,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  // Keep product model / brand names untouched across languages
  const displayName = (product.title || "")
    .replace(/\s*GunLite\s*/gi, "")
    .trim();

  const rawCategory =
    (product.categories && product.categories[0]) ||
    product.category?.name ||
    product.category ||
    "LED Torch";
  const category = translateCategoryName(rawCategory, language);

  const getShortSpec = () => {
    if (product.shortSpec) {
      return translateShortSpec(product, product.shortSpec, language);
    }
    if (product.id === "eagle") return translateShortSpec(product, "50W LED · Type-C", language);
    if (product.id === "everest") return translateShortSpec(product, "55W LED · 10,000mAh", language);
    if (product.id === "tiger") return translateShortSpec(product, "500 Lm · 4000mAh", language);
    if (product.id === "sniper") return translateShortSpec(product, "1000 Lm · Zoom", language);

    if (product.specs && product.specs.length > 0) {
      const firstRaw =
        typeof product.specs[0] === "string"
          ? product.specs[0]
          : product.specs[0].value || product.specs[0].label || "";
      const first = firstRaw
        .replace(/\s*Chip\s*/i, "")
        .replace(/\s*Rechargeable\s*/i, "")
        .replace(/\s*Emergency\s*/i, "")
        .trim();
      return translateShortSpec(product, first, language);
    }
    return translateShortSpec(product, "High-Power LED", language);
  };

  const specLine = getShortSpec();
  const localizedBadge = translateBadge(product.badge, language);

  // WhatsApp enquiry prefilled URL
  const whatsappEnquiryUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi Jerone Enterprises, I would like to enquire about ${displayName} (${
      hasValidPrice ? product.price : "Price on request"
    }). Is it available for dispatch?`
  )}`;

  const imgSrc = product.imgWebp || product.img;
  const fallbackSrc = product.fallback || product.imgPng || product.img;

  return (
    <div className="group flex flex-col h-full rounded-2xl sm:rounded-[20px] overflow-hidden bg-[#111317] ring-1 ring-black/10 shadow-[0_10px_28px_rgba(20,22,26,0.12)] hover:shadow-[0_16px_36px_rgba(20,22,26,0.2)] transition-all duration-250 active:scale-[0.985] md:active:scale-100 md:hover:-translate-y-1">
      
      {/* 1. Image: Natural 3:2 ratio with seamless bottom feather into dark card body */}
      <Link
        to={product.link}
        className="relative block aspect-[3/2] w-full overflow-hidden bg-[#16181D] shrink-0"
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

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[#111317] via-[#111317]/45 to-transparent z-10"
          aria-hidden="true"
        />
      </Link>

      {/* 2. Sleek Dark Editorial Card Body */}
      <div className="flex-1 flex flex-col bg-gradient-to-b from-[#111317] to-[#171A21] px-3 sm:px-4 pt-1.5 sm:pt-2 pb-3 sm:pb-4">
        
        {/* Category Eyebrow & Optional Badge */}
        <div className="flex items-center justify-between gap-1.5">
          <span className="inline-flex items-center gap-1.5 text-[9.5px] sm:text-[10px] font-semibold uppercase tracking-[0.1em] text-white/55 leading-none truncate">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] shrink-0" />
            <span className="truncate">{category}</span>
          </span>
          {localizedBadge && (
            <span className="hidden sm:inline-flex items-center rounded-md bg-[var(--accent)]/15 border border-[var(--accent)]/30 px-1.5 py-0.5 text-[10px] font-semibold text-[#FF6B7A] leading-none shrink-0">
              {localizedBadge}
            </span>
          )}
        </div>

        {/* Name */}
        <Link
          to={product.link}
          className="font-['Outfit'] font-bold text-[15px] sm:text-[17px] text-white hover:text-white/90 transition-colors truncate block mt-1 leading-snug"
          title={displayName}
        >
          {displayName}
        </Link>

        {/* Dark Translucent Spec Chip */}
        <div className="mt-1.5">
          <span className="inline-block max-w-full truncate rounded-md bg-white/[0.06] border border-white/[0.09] px-2 py-0.5 text-[10.5px] sm:text-[11px] font-medium text-white/80 leading-snug">
            {specLine}
          </span>
        </div>

        {/* Bottom Dock */}
        <div className="mt-auto pt-3">
          <div className="pt-2.5 border-t border-white/[0.08] flex flex-col gap-2.5">
            
            <div className="flex items-center justify-between gap-2">
              {hasValidPrice ? (
                <div className="flex items-baseline gap-1.5 min-w-0">
                  <span className="font-['Outfit'] font-bold text-[17px] sm:text-[19px] text-white leading-none tabular-nums">
                    {product.price}
                  </span>
                  {product.hasDiscount && product.regularPrice && (
                    <span className="text-[11px] text-white/45 line-through tabular-nums truncate">
                      {product.regularPrice}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-[12px] font-semibold text-[#FF6B7A] leading-none">
                  {t("common.priceOnWhatsapp")}
                </span>
              )}

              <a
                href={whatsappEnquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-7 w-7 sm:h-8 sm:w-8 shrink-0 inline-flex items-center justify-center rounded-lg bg-white/[0.07] border border-white/10 text-white/80 hover:border-[var(--accent)] hover:bg-[var(--accent)]/20 hover:text-white transition-colors"
                title={t("common.enquireOnWhatsapp")}
                aria-label={t("common.enquireOnWhatsapp")}
              >
                <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              </a>
            </div>

            {isOutOfStock ? (
              <button
                type="button"
                disabled
                className="w-full h-9 sm:h-10 inline-flex items-center justify-center rounded-xl px-2.5 text-[12px] sm:text-[13px] font-semibold bg-white/10 text-white/50 border border-white/10 cursor-not-allowed whitespace-nowrap"
              >
                {t("common.outOfStock")}
              </button>
            ) : hasValidPrice ? (
              <button
                type="button"
                onClick={handleAddToCart}
                className={`w-full h-9 sm:h-10 inline-flex items-center justify-center gap-1.5 rounded-xl px-2.5 text-[12px] sm:text-[13px] font-semibold whitespace-nowrap transition-all ${
                  isAdded
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-[0_4px_14px_rgba(217,15,37,0.3)]"
                }`}
                aria-label={`${t("common.addToCart")} — ${displayName}`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span>{t("common.addedToCart")}</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span>{t("common.addToCart")}</span>
                  </>
                )}
              </button>
            ) : (
              <a
                href={whatsappEnquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-9 sm:h-10 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-[12px] sm:text-[13px] font-semibold whitespace-nowrap shadow-[0_4px_14px_rgba(217,15,37,0.3)] transition-colors px-2.5"
              >
                <span>{t("common.enquireNow")}</span>
              </a>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
