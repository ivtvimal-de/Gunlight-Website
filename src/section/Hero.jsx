import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Truck,
  Headphones,
} from "lucide-react";
import { CLAIMS, WHATSAPP_URL } from "../config";

const HERO_SLIDES = [
  {
    id: "eagle",
    name: "Eagle 3.1",
    spec: "50W LED · Type-C Fast Charging",
    price: "₹2,499",
    link: "/eagle",
    imgWebp: "/images/eaglemain.webp",
    imgPng: "/images/eaglemain.png",
    alt: "Eagle 3.1 50W High-Power LED Search Light",
  },
  {
    id: "everest",
    name: "Everest LED",
    spec: "55W LED · 10,000mAh Battery Bank",
    price: "₹1,999",
    link: "/everest",
    imgWebp: "/images/evmain.webp",
    imgPng: "/images/evmain.png",
    alt: "Everest LED 55W Heavy-Duty Search Light",
  },
  {
    id: "tiger",
    name: "Tiger Pro-1",
    spec: "500 Lumens · 4000mAh Lithium",
    price: "₹1,499",
    link: "/tiger",
    imgWebp: "/images/timain.webp",
    imgPng: "/images/timain.png",
    alt: "Tiger Pro-1 CREE LED Tactical Flashlight",
  },
  {
    id: "sniper",
    name: "Sniper X2",
    spec: "1000 Lumens · Zoom Flood/Focus",
    price: "₹999",
    link: "/sniper",
    imgWebp: "/images/simain.webp",
    imgPng: "/images/simain.png",
    alt: "Sniper X2 Dual 18650 Tactical Zoom Torch",
  },
];

const TRUST_STRIP_ITEMS = [
  {
    icon: ShieldCheck,
    title: CLAIMS.warranty || "1-Year Warranty",
    subtitle: "Internal chip & switch coverage",
  },
  {
    icon: MessageCircle,
    title: CLAIMS.orders || "Direct WhatsApp Orders",
    subtitle: "Stock confirmation & live tracking",
  },
  {
    icon: Truck,
    title: CLAIMS.shipping || "Pan-India Safe Transit",
    subtitle: "Insulated protective packaging",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    subtitle: "Mon–Sat 9:30 AM – 7:30 PM",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideCount = HERO_SLIDES.length;

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) return;
    }

    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slideCount);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, slideCount]);

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 45) {
      // Swiped left -> next slide
      setCurrent((prev) => (prev + 1) % slideCount);
    } else if (distance < -45) {
      // Swiped right -> prev slide
      setCurrent((prev) => (prev - 1 + slideCount) % slideCount);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const activeSlide = HERO_SLIDES[current];

  return (
    <section className="bg-[#FAFAF8] overflow-hidden" aria-label="Hero Showcase">
      
      {/* ─────────────────────────────────────────────────────────────
          1. MOBILE HERO BANNER (under 768px / lg:hidden)
          App-like fashion store pattern:
          - Full width with 16px side margin (px-4)
          - 16px radius (rounded-2xl)
          - Aspect-ratio 4/5
          - Slider of 4 products with fade & touch swipe
          - Dark gradient overlay at bottom
          - Product name, real spec line, price & red "Shop Now" button (40px)
          - Dots overlaid at bottom center (white dot active)
         ───────────────────────────────────────────────────────────── */}
      <div className="lg:hidden px-4 pt-3 pb-4">
        <div
          className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[#F4F4F1] shadow-[0_4px_16px_rgba(20,22,26,0.08)] select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Photos with fade transition */}
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = current === idx;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out motion-reduce:transition-none ${
                  isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                }`}
                aria-hidden={!isActive}
              >
                <picture>
                  <source srcSet={slide.imgWebp} type="image/webp" />
                  <img
                    src={slide.imgPng}
                    alt={slide.alt}
                    width={1200}
                    height={1500}
                    fetchPriority={idx === 0 ? "high" : "auto"}
                    loading={idx === 0 ? "eager" : "lazy"}
                    className="w-full h-full object-cover object-center"
                  />
                </picture>
              </div>
            );
          })}

          {/* Dark gradient overlay at bottom with product info & Shop Now CTA */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-20 pb-7 px-4 z-20 flex flex-col justify-end">
            <h2 className="text-white font-['Outfit'] font-bold text-lg leading-tight truncate">
              {activeSlide.name}
            </h2>
            <p className="text-white/80 text-xs mt-1 leading-snug truncate">
              {activeSlide.spec}
            </p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-white font-['Outfit'] font-bold text-base sm:text-lg">
                {activeSlide.price}
              </span>
              <Link
                to={activeSlide.link}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-5 h-10 text-xs font-semibold text-white shadow-sm transition-colors"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Dots overlaid at bottom center (active white dot) */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 pointer-events-auto">
            {HERO_SLIDES.map((s, index) => (
              <button
                key={s.id}
                onClick={() => setCurrent(index)}
                aria-label={`Go to slide ${index + 1}: ${s.name}`}
                className={`transition-all rounded-full ${
                  current === index
                    ? "w-5 h-1.5 bg-white"
                    : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>

        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. DESKTOP HERO (hidden on mobile, visible on desktop lg:block)
          Preserves the desktop layout 100% UNCHANGED:
          - 2 columns
          - Left: eyebrow, H1, text, 48px buttons, 3 claims
          - Right: 4/3 showcase panel, overlapping caption card, dots below
          - Bottom: slim white trust strip
         ───────────────────────────────────────────────────────────── */}
      <div className="hidden lg:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 min-h-[560px] flex items-center">
          <div className="grid grid-cols-2 gap-12 items-center w-full">
            
            {/* LEFT COLUMN (about 50%) */}
            <div className="flex flex-col justify-center">
              
              {/* 1. Eyebrow */}
              <p className="text-sm font-bold uppercase tracking-wider text-[var(--accent)] mb-3">
                Professional LED Torches &amp; Search Lights
              </p>

              {/* 2. Headline */}
              <h1 className="font-['Outfit'] font-bold text-[#14161A] text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[1.08] tracking-tight mb-4">
                Powerful Light.{" "}
                <span className="text-[var(--accent)]">Built to Last.</span>
              </h1>

              {/* 3. Supporting text */}
              <p className="text-[18px] text-[#4A5058] leading-relaxed max-w-xl mb-7">
                Rechargeable torches and search lights, made in Coimbatore and delivered across India.
              </p>

              {/* 4. Action Buttons (48px high) */}
              <div className="flex items-center gap-4 mb-7">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-7 h-12 text-base font-semibold text-white transition-colors shadow-sm"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D5D5CF] bg-white hover:bg-[#F4F4F1] px-6 h-12 text-base font-semibold text-[#14161A] transition-colors shadow-2xs"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Order on WhatsApp</span>
                </a>
              </div>

              {/* 5. 3 Real Facts from config.js CLAIMS */}
              <div className="flex flex-wrap items-center gap-y-2.5 gap-x-6 text-sm text-[#4A5058]">
                <div className="flex items-center gap-2 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[var(--accent)] shrink-0" />
                  <span>{CLAIMS.warranty}</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <MessageCircle className="w-4 h-4 text-[var(--accent)] shrink-0" />
                  <span>{CLAIMS.orders}</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <Truck className="w-4 h-4 text-[var(--accent)] shrink-0" />
                  <span>{CLAIMS.shipping}</span>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN (about 50%) */}
            <div
              className="flex flex-col items-center justify-center"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Large Product Showcase Panel (4/3 desktop) */}
              <div className="relative w-full aspect-[4/3] rounded-[24px] overflow-hidden border border-[#E6E6E1] bg-[#F4F4F1] shadow-[0_8px_30px_rgba(20,22,26,0.06)]">
                
                {/* Product Photos (Cross-fade transition) */}
                {HERO_SLIDES.map((slide, idx) => {
                  const isActive = current === idx;
                  return (
                    <div
                      key={slide.id}
                      className={`absolute inset-0 transition-opacity duration-700 ease-in-out motion-reduce:transition-none ${
                        isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                      }`}
                      aria-hidden={!isActive}
                    >
                      <picture>
                        <source srcSet={slide.imgWebp} type="image/webp" />
                        <img
                          src={slide.imgPng}
                          alt={slide.alt}
                          width={1536}
                          height={1024}
                          fetchPriority={idx === 0 ? "high" : "auto"}
                          loading={idx === 0 ? "eager" : "lazy"}
                          className="w-full h-full object-cover"
                        />
                      </picture>
                    </div>
                  );
                })}

                {/* Overlapping Bottom-Left Caption Card */}
                <div className="absolute bottom-6 left-6 z-20 bg-white/95 backdrop-blur-md border border-[#E6E6E1] rounded-2xl p-4 shadow-[0_8px_24px_rgba(20,22,26,0.12)] max-w-[280px]">
                  <h3 className="font-['Outfit'] font-bold text-base text-[#14161A] truncate">
                    {activeSlide.name}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5 truncate">
                    {activeSlide.spec}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-[#F1F1ED] flex items-center justify-between">
                    <span className="font-['Outfit'] font-bold text-lg text-[#14161A]">
                      {activeSlide.price}
                    </span>
                    <Link
                      to={activeSlide.link}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
                    >
                      <span>View Product</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>

              {/* Slider Dots Below */}
              <div className="mt-4 flex items-center justify-center gap-2">
                {HERO_SLIDES.map((s, index) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrent(index)}
                    aria-label={`Go to slide ${index + 1}: ${s.name}`}
                    className={`h-2 transition-all rounded-full ${
                      current === index
                        ? "w-8 bg-[var(--accent)]"
                        : "w-2 bg-[#D5D5CF] hover:bg-[#8B97A8]"
                    }`}
                  />
                ))}
              </div>

            </div>

          </div>
        </div>

        {/* BELOW THE HERO: Slim White Trust Strip */}
        <div className="bg-white border-y border-[#E6E6E1] py-5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-4 gap-6">
              {TRUST_STRIP_ITEMS.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[var(--accent-tint)] flex items-center justify-center shrink-0">
                      <IconComponent className="w-5 h-5 text-[var(--accent)]" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-['Outfit'] font-bold text-sm text-[#14161A] truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-[#64748B] truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
