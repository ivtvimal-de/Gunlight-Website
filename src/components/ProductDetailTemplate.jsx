import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Truck,
  MessageCircle,
  ShoppingCart,
  Check,
  Plus,
  Minus,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCart, parsePriceNum, formatPrice } from "../context/CartContext";
import { WHATSAPP_NUMBER, CLAIMS, WARRANTY_OPTION } from "../config";
import SEO from "./SEO";
import ProductCard from "./ProductCard";

const ALL_CATALOGUE = [
  {
    id: "eagle",
    title: "Eagle 3.1 GunLite",
    price: "₹2,499",
    img: "/images/eagle.webp",
    link: "/eagle",
    categories: ["Search Light"],
    specs: ["50W LED Chip", "Type-C Rechargeable"],
  },
  {
    id: "everest",
    title: "Everest LED GunLite",
    price: "₹1,999",
    img: "/images/everest.webp",
    link: "/everest",
    categories: ["LED Torch"],
    specs: ["55W LED", "10,000mAh Battery"],
  },
  {
    id: "tiger",
    title: "Tiger Pro-1 GunLite",
    price: "₹1,499",
    img: "/images/tigerpro.webp",
    link: "/tiger",
    categories: ["Rechargeable"],
    specs: ["500 Lumens", "4000mAh Lithium"],
  },
  {
    id: "sniper",
    title: "Sniper X2 GunLite",
    price: "₹999",
    img: "/images/sniper.webp",
    link: "/sniper",
    categories: ["LED Torch"],
    specs: ["1000 Lumens", "2× 18650 Battery"],
  },
];

export default function ProductDetailTemplate({
  product,
  images = [],
  specs = [],
  seoTitle,
  seoDescription,
  seoPath,
}) {
  const galleryImages = images.length > 0 ? images : [product.img];
  const [activeIdx, setActiveIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [withWarranty, setWithWarranty] = useState(false);
  const [added, setAdded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  useEffect(() => {
    setActiveIdx(0);
    setQty(1);
    setWithWarranty(false);
    setIsZoomed(false);
  }, [product.id]);

  const activeImg = galleryImages[activeIdx] || galleryImages[0];

  const { addItem, openCart, items } = useCart();
  const inCartCount = items
    .filter((i) => (i.baseId || i.id) === product.id)
    .reduce((sum, i) => sum + i.quantity, 0);

  const basePriceNum = product.priceNum ?? parsePriceNum(product.price);
  const hasValidPrice = basePriceNum > 0;
  const activeWarrantyFee = withWarranty ? WARRANTY_OPTION.fee : 0;
  const unitPriceNum = hasValidPrice ? basePriceNum + activeWarrantyFee : 0;
  const totalPriceNum = hasValidPrice ? unitPriceNum * qty : 0;
  const displayUnitPrice = unitPriceNum > 0 ? formatPrice(unitPriceNum) : product.price;
  const displayTotalPrice = totalPriceNum > 0 ? formatPrice(totalPriceNum) : product.price;

  const handlePrevImg = () => {
    setIsZoomed(false);
    setActiveIdx((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleNextImg = () => {
    setIsZoomed(false);
    setActiveIdx((prev) => (prev + 1) % galleryImages.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null || galleryImages.length <= 1) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 40) {
      handleNextImg();
    } else if (distance < -40) {
      handlePrevImg();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleAddToCart = () => {
    addItem({
      ...product,
      baseId: product.id,
      basePriceNum,
      hasWarranty: withWarranty,
      warrantyFee: activeWarrantyFee,
      quantity: qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const waText = encodeURIComponent(
    `Hi GunLite, I am interested in ordering ${product.title}${
      withWarranty ? ` with ${WARRANTY_OPTION.label} (+₹${WARRANTY_OPTION.fee})` : ""
    } (${displayUnitPrice} × ${qty}${qty > 1 || withWarranty ? ` = Total: ${displayTotalPrice}` : ""}). Please share delivery timeline and payment details.`
  );
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

  // Filter out any spec that contains placeholder brackets [ ]
  const validSpecs = specs.filter((item) => {
    const val = typeof item === "string" ? item : `${item.label} ${item.value}`;
    return !val.includes("[") && !val.includes("]");
  });

  const related = ALL_CATALOGUE.filter((p) => p.id !== product.id);

  return (
    <>
      <SEO
        title={seoTitle || `${product.title} | Professional GunLite Torch`}
        description={seoDescription || product.desc}
        path={seoPath || `/${product.id}`}
        type="product"
        image={galleryImages[0]}
      />

      <main className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] pb-24 md:pb-16">
        
        {/* Breadcrumb Bar */}
        <div className="border-b border-[var(--border-subtle)] bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)]">
              <Link to="/" className="hover:text-[var(--text-primary)] transition-colors">Home</Link>
              <span>/</span>
              <Link to="/shop" className="hover:text-[var(--text-primary)] transition-colors">Shop</Link>
              <span>/</span>
              <span className="text-[var(--text-primary)] truncate font-semibold">{product.title}</span>
            </nav>
          </div>
        </div>

        {/* ── Main Product Section (Gallery + Sticky Buy Box) ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-10 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
            
            {/* ── LEFT: Edge-to-Edge Studio Gallery ── */}
            <div className="lg:col-span-7 space-y-3">
              
              {/* Main Image Stage: Pure 3:2 dark studio card with zero nested borders */}
              <div
                className={`relative w-full aspect-[3/2] rounded-2xl overflow-hidden bg-[#14161A] ring-1 ring-black/10 shadow-[0_12px_32px_rgba(20,22,26,0.12)] select-none group ${
                  isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                }`}
                onClick={() => setIsZoomed((prev) => !prev)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <picture className="block w-full h-full">
                  <source srcSet={activeImg} type="image/webp" />
                  <img
                    src={activeImg}
                    alt={`${product.title} - View ${activeIdx + 1}`}
                    width={1536}
                    height={1024}
                    fetchPriority="high"
                    className={`w-full h-full object-contain transition-transform duration-300 ease-out ${
                      isZoomed ? "scale-150" : "scale-100"
                    }`}
                  />
                </picture>

                {/* Desktop Prev / Next Arrow Controls */}
                {galleryImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevImg();
                      }}
                      aria-label="Previous image"
                      className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white opacity-0 group-hover:opacity-100 hover:bg-black/75 transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextImg();
                      }}
                      aria-label="Next image"
                      className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white opacity-0 group-hover:opacity-100 hover:bg-black/75 transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Clean Utility Row below Photo (Counter + Dots + Zoom Toggle) */}
              <div className="flex items-center justify-between gap-3 px-0.5">
                <div className="flex items-center gap-2.5">
                  {galleryImages.length > 1 && (
                    <>
                      <span className="font-mono text-[11px] font-semibold text-[#4A5058] tabular-nums">
                        {String(activeIdx + 1).padStart(2, "0")} / {String(galleryImages.length).padStart(2, "0")}
                      </span>
                      <div className="flex items-center gap-1">
                        {galleryImages.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setActiveIdx(idx);
                              setIsZoomed(false);
                            }}
                            aria-label={`Go to image ${idx + 1}`}
                            className={`h-1.5 rounded-full transition-all ${
                              activeIdx === idx
                                ? "w-5 bg-[var(--accent)]"
                                : "w-1.5 bg-[#CFCFC8] hover:bg-[#8B97A8]"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setIsZoomed((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#E6E6E1] bg-white px-3 py-1 text-[11px] font-medium text-[#4A5058] shadow-2xs hover:border-[#CFCFC8] hover:text-[#14161A] transition-colors"
                >
                  {isZoomed ? (
                    <>
                      <ZoomOut className="w-3.5 h-3.5 text-[var(--accent)]" />
                      <span>Reset Zoom</span>
                    </>
                  ) : (
                    <>
                      <ZoomIn className="w-3.5 h-3.5 text-[var(--accent)]" />
                      <span>Tap to Zoom</span>
                    </>
                  )}
                </button>
              </div>

              {/* Sleek 3:2 Thumbnail Strip (zero grey borders, hidden scrollbar) */}
              {galleryImages.length > 1 && (
                <div className="flex items-center gap-2.5 overflow-x-auto py-1 px-0.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {galleryImages.map((img, idx) => {
                    const isActive = activeIdx === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setActiveIdx(idx);
                          setIsZoomed(false);
                        }}
                        className={`w-[74px] sm:w-[92px] aspect-[3/2] shrink-0 rounded-xl overflow-hidden bg-[#14161A] transition-all duration-200 ${
                          isActive
                            ? "ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--bg-canvas)] opacity-100 shadow-sm"
                            : "ring-1 ring-black/10 opacity-60 hover:opacity-95"
                        }`}
                        aria-label={`View angle ${idx + 1}`}
                      >
                        <img
                          src={img}
                          alt=""
                          width={192}
                          height={128}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Compact 3-Column Trust Strip */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3.5 pt-3 sm:pt-5 border-t border-[var(--border-subtle)]">
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1.5 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl border border-[var(--border-subtle)] bg-white shadow-2xs">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-tint)]">
                    <ShieldCheck className="w-4 h-4 text-[var(--accent)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] sm:text-xs font-semibold text-[var(--text-primary)] leading-tight">
                      {CLAIMS.warranty || "1-Year Warranty"}
                    </p>
                    <p className="hidden sm:block text-[11px] text-[var(--text-muted)] mt-0.5">Official Guarantee</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1.5 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl border border-[var(--border-subtle)] bg-white shadow-2xs">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-tint)]">
                    <Truck className="w-4 h-4 text-[var(--accent)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] sm:text-xs font-semibold text-[var(--text-primary)] leading-tight">
                      Pan-India Shipping
                    </p>
                    <p className="hidden sm:block text-[11px] text-[var(--text-muted)] mt-0.5">Dispatched in 24-48h</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1.5 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl border border-[var(--border-subtle)] bg-white shadow-2xs">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-tint)]">
                    <MessageCircle className="w-4 h-4 text-[var(--accent)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] sm:text-xs font-semibold text-[var(--text-primary)] leading-tight">
                      Direct WhatsApp
                    </p>
                    <p className="hidden sm:block text-[11px] text-[var(--text-muted)] mt-0.5">Instant Confirmation</p>
                  </div>
                </div>
              </div>

            </div>

            {/* ── RIGHT: Sticky Buy Box ── */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
              
              <div className="rounded-2xl border border-[var(--border-subtle)] bg-white p-4 sm:p-8 space-y-4 sm:space-y-6 shadow-[0_4px_20px_rgba(20,22,26,0.05)]">
                
                {/* Title & Badge */}
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--accent-tint)] px-3 py-1 text-xs font-medium text-[var(--accent)] mb-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                    In Stock &amp; Ready for Dispatch
                  </div>
                  <h1 className="font-['Outfit'] text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
                    {product.title}
                  </h1>
                </div>

                {/* Price Display (always shows base product price; tallied total appears below) */}
                <div className="flex items-baseline gap-3 pb-5 border-b border-[var(--border-subtle)]">
                  <span className="font-['Outfit'] text-3xl sm:text-4xl font-bold text-[var(--text-primary)] tabular-nums">
                    {product.price}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">Inclusive of all taxes</span>
                </div>

                {/* Description */}
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {product.desc}
                </p>

                {/* Optional 1-Year Warranty Add-On Tick Box (+₹500) */}
                {hasValidPrice && (
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={withWarranty}
                    onClick={() => setWithWarranty((prev) => !prev)}
                    className={`w-full flex items-center justify-between gap-3 rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
                      withWarranty
                        ? "border-[var(--accent)] bg-[var(--accent-tint)]/60 shadow-2xs"
                        : "border-[var(--border-subtle)] bg-[var(--bg-canvas)] hover:border-[#CFCFC8]"
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <span
                        className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-[5px] border transition-colors ${
                          withWarranty
                            ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                            : "border-[#B8B8B0] bg-white"
                        }`}
                      >
                        {withWarranty && <Check className="h-3 w-3 stroke-[3]" />}
                      </span>
                      <div className="min-w-0">
                        <span className="block text-xs sm:text-sm font-semibold text-[var(--text-primary)] leading-snug">
                          Add {WARRANTY_OPTION.label}
                        </span>
                        <span className="block text-[11px] text-[var(--text-muted)] mt-0.5 leading-snug">
                          Optional · {WARRANTY_OPTION.detail}
                        </span>
                      </div>
                    </div>

                    <span className="shrink-0 font-['Outfit'] text-sm font-bold text-[var(--accent)] tabular-nums">
                      +₹{WARRANTY_OPTION.fee}
                    </span>
                  </button>
                )}

                {/* Quantity Stepper */}
                <div className="space-y-2 pt-1">
                  <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider block">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)]">
                      <button
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        disabled={qty <= 1}
                        className="p-2.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-30 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold text-[var(--text-primary)]">
                        {qty}
                      </span>
                      <button
                        onClick={() => setQty((q) => q + 1)}
                        className="p-2.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {inCartCount > 0 && (
                      <span className="text-xs text-[var(--accent)] font-medium">
                        ({inCartCount} already in cart)
                      </span>
                    )}
                  </div>
                </div>

                {/* Price Tally Breakdown (shown clearly when warranty or qty > 1 is selected) */}
                {hasValidPrice && (withWarranty || qty > 1) && (
                  <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3.5 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[var(--text-secondary)]">
                      <span>Product ({product.price} × {qty})</span>
                      <span className="font-medium tabular-nums">
                        {formatPrice(basePriceNum * qty)}
                      </span>
                    </div>
                    {withWarranty && (
                      <div className="flex items-center justify-between text-[var(--accent)]">
                        <span>{WARRANTY_OPTION.label} (+₹{WARRANTY_OPTION.fee} × {qty})</span>
                        <span className="font-semibold tabular-nums">
                          +{formatPrice(activeWarrantyFee * qty)}
                        </span>
                      </div>
                    )}
                    <div className="pt-1.5 border-t border-[var(--border-subtle)] flex items-center justify-between font-['Outfit'] text-sm font-bold text-[var(--text-primary)]">
                      <span>Total Amount</span>
                      <span className="tabular-nums">{displayTotalPrice}</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    className={`w-full py-3.5 px-6 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-xs ${
                      added
                        ? "bg-[#10B981] text-white"
                        : "bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white"
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 text-white" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-3)] hover:border-[var(--accent)] hover:text-[var(--accent)] text-[var(--text-primary)] font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-[var(--accent)]" />
                    <span>Order on WhatsApp</span>
                  </a>

                  {inCartCount > 0 && (
                    <button
                      onClick={openCart}
                      className="w-full text-center text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors pt-1"
                    >
                      View Cart ({items.length} items) →
                    </button>
                  )}
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* ── Specifications Table ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-white p-4 sm:p-8 lg:p-10 shadow-[0_4px_20px_rgba(20,22,26,0.05)]">
            <h2 className="font-['Outfit'] text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-4 sm:mb-6 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
              Technical Specifications
            </h2>

            <div className="divide-y divide-[var(--border-subtle)]">
              {validSpecs.map((item, idx) => {
                const label = item.label || item.key;
                const value = item.value || item.desc || item;
                return (
                  <div
                    key={idx}
                    className="py-3 sm:py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 text-[13px] sm:text-sm"
                  >
                    <span className="font-medium text-[var(--text-muted)]">
                      {label || `Specification ${idx + 1}`}
                    </span>
                    <span className="sm:col-span-2 text-[var(--text-primary)] font-medium">
                      {value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Related Products ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <div className="flex items-center justify-between mb-5 sm:mb-8">
            <h2 className="font-['Outfit'] text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
              Other Models You May Like
            </h2>
            <Link
              to="/shop"
              className="text-xs font-semibold text-[var(--accent)] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {related.slice(0, 3).map((item) => (
              <div key={item.id} className="w-[46%] min-w-[162px] shrink-0 snap-start md:w-auto md:min-w-0">
                <ProductCard product={item} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Mobile Sticky Add-to-Cart Bar ── */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[var(--border-subtle)] px-4 pt-2.5 pb-[max(0.65rem,env(safe-area-inset-bottom))] flex items-center justify-between gap-3 md:hidden shadow-[0_-4px_20px_rgba(20,22,26,0.08)]">
          <div className="min-w-0">
            <span className="block text-[11px] text-[var(--text-muted)] truncate">
              {product.title}{qty > 1 ? ` × ${qty}` : ""}{withWarranty ? " · +1-Yr Warranty" : ""}
            </span>
            <span className="font-['Outfit'] text-base font-bold text-[var(--text-primary)] tabular-nums">
              {displayTotalPrice}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleAddToCart}
              className={`h-10 px-4 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs ${
                added
                  ? "bg-emerald-600 text-white"
                  : "bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white"
              }`}
            >
              {added ? <Check className="w-3.5 h-3.5 text-white" /> : <ShoppingCart className="w-3.5 h-3.5 text-white" />}
              <span>{added ? "Added" : "Add to Cart"}</span>
            </button>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-xl border border-[var(--border-subtle)] bg-[#FAFAF8] flex items-center justify-center text-[var(--accent)]"
              aria-label="Enquire on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-[var(--accent)]" />
            </a>
          </div>
        </div>

      </main>
    </>
  );
}
