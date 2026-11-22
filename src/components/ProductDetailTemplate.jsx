import React, { useState } from "react";
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
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { WHATSAPP_NUMBER, CLAIMS } from "../config";
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
  const [activeImg, setActiveImg] = useState(images[0] || product.img);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const { addItem, openCart, items } = useCart();
  const inCart = items.find((i) => i.id === product.id);

  const handleAddToCart = () => {
    addItem({ ...product, quantity: qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const waText = encodeURIComponent(
    `Hi GunLite, I am interested in ordering ${product.title} (${product.price}, Qty: ${qty}). Please share delivery timeline and payment details.`
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
        image={images[0] || product.img}
      />

      <main className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] py-8 pb-24 md:pb-20">
        
        {/* Breadcrumb Bar */}
        <div className="border-b border-[var(--border-subtle)] bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            
            {/* ── LEFT: Product Gallery with Zoom ── */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Main Image Stage */}
              <div
                className="relative rounded-2xl border border-[var(--border-subtle)] bg-white p-6 sm:p-10 flex items-center justify-center overflow-hidden min-h-[340px] sm:min-h-[440px] shadow-[0_4px_20px_rgba(20,22,26,0.06)] cursor-zoom-in"
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 rounded-md bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] px-2.5 py-1 text-[11px] text-[var(--text-secondary)]">
                  <ZoomIn className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>{isZoomed ? "Reset" : "Click to Zoom"}</span>
                </div>

                <div className="w-full bg-[var(--bg-surface-2)] rounded-xl p-6 flex items-center justify-center">
                  <picture className="w-full flex items-center justify-center">
                    <source srcSet={activeImg} type="image/webp" />
                    <img
                      src={activeImg}
                      alt={`${product.title} - High power torch view`}
                      width={600}
                      height={500}
                      fetchPriority="high"
                      className={`max-h-[300px] sm:max-h-[380px] w-auto object-contain transition-transform duration-300 ${
                        isZoomed ? "scale-150" : "scale-100"
                      }`}
                    />
                  </picture>
                </div>
              </div>

              {/* Thumbnails Row */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {images.map((img, idx) => {
                    const isActive = activeImg === img;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setActiveImg(img);
                          setIsZoomed(false);
                        }}
                        className={`h-20 w-20 shrink-0 rounded-xl border p-2 bg-[var(--bg-surface-2)] transition-all overflow-hidden flex items-center justify-center ${
                          isActive
                            ? "border-[var(--accent)] shadow-xs"
                            : "border-[var(--border-subtle)] opacity-70 hover:opacity-100"
                        }`}
                        aria-label={`View angle ${idx + 1}`}
                      >
                        <img
                          src={img}
                          alt=""
                          width={64}
                          height={64}
                          className="h-full w-full object-contain"
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Trust Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[var(--border-subtle)]">
                <div className="flex items-center gap-3 p-3.5 rounded-xl border border-[var(--border-subtle)] bg-white shadow-xs">
                  <ShieldCheck className="w-5 h-5 text-[var(--accent)] shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-[var(--text-primary)]">
                      {CLAIMS.warranty || "1-Year Warranty"}
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)]">Official Guarantee</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl border border-[var(--border-subtle)] bg-white shadow-xs">
                  <Truck className="w-5 h-5 text-[var(--accent)] shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-[var(--text-primary)]">Pan-India Shipping</p>
                    <p className="text-[11px] text-[var(--text-muted)]">Dispatched in 24-48h</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl border border-[var(--border-subtle)] bg-white shadow-xs">
                  <MessageCircle className="w-5 h-5 text-[var(--accent)] shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-[var(--text-primary)]">Direct WhatsApp</p>
                    <p className="text-[11px] text-[var(--text-muted)]">Instant Confirmation</p>
                  </div>
                </div>
              </div>

            </div>

            {/* ── RIGHT: Sticky Buy Box ── */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
              
              <div className="rounded-2xl border border-[var(--border-subtle)] bg-white p-6 sm:p-8 space-y-6 shadow-[0_4px_20px_rgba(20,22,26,0.06)]">
                
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

                {/* Price Display */}
                <div className="flex items-baseline gap-3 pb-6 border-b border-[var(--border-subtle)]">
                  <span className="font-['Outfit'] text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                    {product.price}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">Inclusive of all taxes</span>
                </div>

                {/* Description */}
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {product.desc}
                </p>

                {/* Quantity Stepper */}
                <div className="space-y-2 pt-2">
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

                    {inCart && (
                      <span className="text-xs text-[var(--accent)] font-medium">
                        ({inCart.quantity} already in cart)
                      </span>
                    )}
                  </div>
                </div>

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

                  {inCart && (
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-white p-6 sm:p-10 shadow-[0_4px_20px_rgba(20,22,26,0.06)]">
            <h2 className="font-['Outfit'] text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
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
                    className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-8">
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

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {related.slice(0, 3).map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>

        {/* ── Mobile Sticky Add-to-Cart Bar ── */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[var(--border-subtle)] p-3.5 flex items-center justify-between gap-4 md:hidden shadow-lg">
          <div>
            <span className="block text-[11px] text-[var(--text-muted)] truncate max-w-[130px]">
              {product.title}
            </span>
            <span className="font-['Outfit'] text-base font-bold text-[var(--text-primary)]">
              {product.price}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddToCart}
              className={`py-2 px-4 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs ${
                added
                  ? "bg-[#10B981] text-white"
                  : "bg-[var(--accent)] text-white"
              }`}
            >
              {added ? <Check className="w-3.5 h-3.5 text-white" /> : <ShoppingCart className="w-3.5 h-3.5 text-white" />}
              <span>{added ? "Added" : "Add to Cart"}</span>
            </button>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] text-[var(--text-primary)] text-xs font-semibold"
              aria-label="Enquire on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[var(--accent)]" />
            </a>
          </div>
        </div>

      </main>
    </>
  );
}
