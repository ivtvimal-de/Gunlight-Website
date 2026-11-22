import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Truck,
  MessageCircle,
  Zap,
} from "lucide-react";
import { CLAIMS, WHATSAPP_URL } from "../config";

const HERO_SLIDES = [
  {
    id: "eagle",
    badge: "Flagship Search Light",
    title: "Eagle 3.1 GunLite",
    tagline: "50W High-Power LED with Focused Fresnel Optics",
    desc: "Engineered for intense long-range illumination. Aircraft-grade aluminium housing with USB Type-C fast charging and 4 interchangeable color filters.",
    price: "₹2,499",
    specs: ["50W LED Chip", "Fresnel Lens", "Type-C Rechargeable"],
    primaryLink: "/eagle",
    secondaryLink: "/shop?category=Search+Light",
    imgPng: "/images/eaglemain.png",
    imgWebp: "/images/eaglemain.webp",
    alt: "GunLite Eagle 3.1 50W Search Light",
  },
  {
    id: "everest",
    badge: "Long Runtime Edition",
    title: "Everest LED GunLite",
    tagline: "55W Power with 10,000 mAh Dual-Battery Bank",
    desc: "Heavy-duty rechargeable searchlight designed for night patrols, security estates, and industrial facilities with power bank reverse charging.",
    price: "₹1,999",
    specs: ["55W LED", "10,000mAh Battery", "Reverse USB Out"],
    primaryLink: "/everest",
    secondaryLink: "/shop?category=LED+Torch",
    imgPng: "/images/evmain.png",
    imgWebp: "/images/evmain.webp",
    alt: "GunLite Everest 55W LED Torch",
  },
  {
    id: "sniper",
    badge: "Tactical Series",
    title: "Sniper X2 GunLite",
    tagline: "1000 Lumens with Precision Flood-to-Spot Zoom",
    desc: "Compact tactical flashlight powered by dual 18650 lithium cells. Quick sliding focal head for versatile close-up flood and distance spotting.",
    price: "₹999",
    specs: ["1000 Lumens", "Adjustable Zoom", "Dual 18650 Cells"],
    primaryLink: "/sniper",
    secondaryLink: "/shop",
    imgPng: "/images/simain.png",
    imgWebp: "/images/simain.webp",
    alt: "GunLite Sniper X2 Tactical Zoom Torch",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideCount = HERO_SLIDES.length;

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slideCount);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, slideCount]);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slideCount) % slideCount);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slideCount);
  };

  const slide = HERO_SLIDES[current];

  return (
    <section
      className="relative bg-[var(--bg-canvas)] border-b border-[var(--border-subtle)] py-8 sm:py-12 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Featured Store Products Slider"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ── Main Hero Card / Banner Container ── */}
        <div className="relative rounded-3xl border border-[var(--border-subtle)] bg-white p-6 sm:p-10 lg:p-12 shadow-[0_4px_24px_rgba(20,22,26,0.06)] overflow-hidden">
          
          {/* Background Ambient Glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[var(--accent-tint)] opacity-70 blur-3xl" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Headline, Copy & CTAs */}
            <div className="lg:col-span-7 z-10 flex flex-col justify-center">
              
              {/* Category / Badge Pill */}
              <div className="mb-4 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] px-3.5 py-1 text-xs font-semibold text-[var(--accent)] tracking-wide">
                  <Zap className="w-3.5 h-3.5 text-[var(--accent)]" />
                  {slide.badge}
                </span>
                <span className="text-xs font-mono font-bold text-[var(--text-primary)] px-2.5 py-0.5 rounded-md bg-[var(--bg-surface-2)]">
                  {slide.price}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-['Outfit'] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight mb-3">
                {slide.title}
              </h1>

              {/* Subheading / Tagline */}
              <p className="font-['Outfit'] text-base sm:text-lg font-semibold text-[var(--accent)] mb-3">
                {slide.tagline}
              </p>

              {/* Description */}
              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-xl mb-6">
                {slide.desc}
              </p>

              {/* Spec Chips Row */}
              <div className="flex flex-wrap gap-2 mb-8">
                {slide.specs.map((spec) => (
                  <span
                    key={spec}
                    className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)]"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <Link
                  to={slide.primaryLink}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-7 py-3.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all hover:shadow"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to={slide.secondaryLink}
                  className="inline-flex items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-white hover:bg-[var(--bg-surface-2)] px-6 py-3.5 text-xs sm:text-sm font-semibold text-[var(--text-primary)] transition-colors shadow-2xs"
                >
                  View Catalogue
                </Link>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--accent)] px-3 py-2 transition-colors ml-auto sm:ml-0"
                >
                  <MessageCircle className="w-4 h-4 text-[var(--accent)]" />
                  <span>Enquire on WhatsApp</span>
                </a>
              </div>

            </div>

            {/* Right Column: Product Image in #F4F4F1 Area */}
            <div className="lg:col-span-5 z-10 flex flex-col items-center justify-center">
              <div className="relative w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-6 sm:p-8 flex items-center justify-center min-h-[280px] sm:min-h-[360px] lg:min-h-[400px]">
                
                <picture className="w-full flex items-center justify-center">
                  <source srcSet={slide.imgWebp} type="image/webp" />
                  <img
                    src={slide.imgPng}
                    alt={slide.alt}
                    width={480}
                    height={400}
                    fetchPriority="high"
                    className="max-h-64 sm:max-h-80 w-auto object-contain drop-shadow-md transition-all duration-500 hover:scale-105"
                  />
                </picture>

                {/* Direct Detail Link Badge */}
                <div className="absolute bottom-4 right-4">
                  <Link
                    to={slide.primaryLink}
                    className="rounded-lg bg-white/90 backdrop-blur-xs border border-[var(--border-subtle)] px-3 py-1.5 text-[11px] font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] shadow-xs transition-colors"
                  >
                    Inspect Model →
                  </Link>
                </div>
              </div>
            </div>

          </div>

          {/* Slider Controls & Dots Bar */}
          <div className="mt-8 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
            {/* Slide Indicators */}
            <div className="flex items-center gap-2">
              {HERO_SLIDES.map((s, index) => (
                <button
                  key={s.id}
                  onClick={() => setCurrent(index)}
                  aria-label={`Go to slide ${index + 1}: ${s.title}`}
                  className={`h-2 transition-all rounded-full ${
                    current === index
                      ? "w-8 bg-[var(--accent)]"
                      : "w-2 bg-[var(--border-strong)] hover:bg-[var(--text-muted)]"
                  }`}
                />
              ))}
              <span className="text-[11px] font-mono text-[var(--text-muted)] ml-2">
                0{current + 1} / 0{slideCount}
              </span>
            </div>

            {/* Arrow Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                aria-label="Previous slide"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-white text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)] transition-colors shadow-2xs"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next slide"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-white text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)] transition-colors shadow-2xs"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
