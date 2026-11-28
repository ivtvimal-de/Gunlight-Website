import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Truck,
  Headphones,
} from "lucide-react";
import { WHATSAPP_URL } from "../config";
import { useCatalog } from "../context/CatalogContext";
import { useTranslation } from "../i18n/LanguageContext";
import { formatLocalizedPrice, translateShortSpec } from "../i18n/catalogI18n";

export default function Hero() {
  const { products } = useCatalog();
  const { language, t } = useTranslation();

  const TRUST_STRIP_ITEMS = [
    {
      icon: ShieldCheck,
      title: t("hero.claims.warranty"),
      subtitle: t("hero.claims.warrantyShort"),
    },
    {
      icon: MessageCircle,
      title: t("hero.claims.orders"),
      subtitle: t("hero.claims.ordersShort"),
    },
    {
      icon: Truck,
      title: t("hero.claims.shipping"),
      subtitle: t("hero.claims.shippingShort"),
    },
    {
      icon: Headphones,
      title: t("hero.claims.support"),
      subtitle: t("hero.claims.supportHours"),
    },
  ];

  const heroProducts = (() => {
    const featured = products.filter((p) => p.isFeatured);
    const pool = featured.length > 0 ? featured : products;
    return pool.slice(0, 5);
  })();

  const HERO_SLIDES = heroProducts.map((p) => {
    const rawSpec =
      p.shortSpec ||
      (p.specs?.[0]?.value ? `${p.specs[0].value}` : "High-Power LED");
    return {
      id: p.id,
      name: (p.title || "").replace(/\s*GunLite\s*/gi, "").trim() || p.title,
      spec: translateShortSpec(p, rawSpec, language),
      price: formatLocalizedPrice(p.price, t),
      link: p.link,
      imgWebp: p.heroImg || p.imgWebp || p.img,
      imgPng: p.heroImg || p.imgPng || p.img,
      alt: `${p.title} - ${t("hero.slideAltSuffix")}`,
    };
  });

  const FALLBACK_HERO_SLIDE = {
    id: "default",
    name: t("hero.defaultSlideName"),
    spec: t("hero.defaultSlideSpec"),
    price: "₹999",
    link: "/shop",
    imgWebp: "/images/eaglemain.webp",
    imgPng: "/images/eaglemain.webp",
    alt: t("hero.defaultSlideAlt"),
  };

  const renderedSlides =
    HERO_SLIDES.length > 0 ? HERO_SLIDES : [FALLBACK_HERO_SLIDE];

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideCount = renderedSlides.length;
  const safeCurrent = current % slideCount;

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  useEffect(() => {
    if (current >= slideCount) {
      setCurrent(0);
    }
  }, [current, slideCount]);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) return;
    }

    if (isPaused || slideCount <= 1) return;

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
      setCurrent((prev) => (prev + 1) % slideCount);
    } else if (distance < -45) {
      setCurrent((prev) => (prev - 1 + slideCount) % slideCount);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const activeSlide = renderedSlides[safeCurrent] || FALLBACK_HERO_SLIDE;

  return (
    <section className="bg-[#FAFAF8] overflow-hidden" aria-label={t("hero.ariaLabel")}>
      
      {/* ── 1. MOBILE HERO BANNER (under 1024px / lg:hidden) ── */}
      <div className="lg:hidden px-4 pt-3 pb-5">
        <div
          className="w-full rounded-[20px] overflow-hidden bg-[#111317] ring-1 ring-black/10 shadow-[0_12px_32px_rgba(20,22,26,0.14)] select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative w-full aspect-[3/2] bg-[#16181D] overflow-hidden">
            {renderedSlides.map((slide, idx) => {
              const isActive = safeCurrent === idx;
              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out motion-reduce:transition-none ${
                    isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                  }`}
                  aria-hidden={!isActive}
                >
                  <picture className="block w-full h-full">
                    <source srcSet={slide.imgWebp} type="image/webp" />
                    <img
                      src={slide.imgPng}
                      alt={slide.alt}
                      width={1536}
                      height={1024}
                      fetchPriority={idx === 0 ? "high" : "auto"}
                      loading={idx === 0 ? "eager" : "lazy"}
                      className="w-full h-full object-contain object-center"
                    />
                  </picture>
                </div>
              );
            })}

            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-7 bg-gradient-to-t from-[#111317] via-[#111317]/45 to-transparent z-20"
              aria-hidden="true"
            />
          </div>

          {/* Sleek Dark Editorial Footer */}
          <div className="bg-gradient-to-b from-[#111317] to-[#171A21] px-4 pt-2 pb-4 flex flex-col">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/60">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                {t("hero.featuredHardware")}
              </span>
              <span className="font-mono text-[10px] font-medium text-white/45 tabular-nums">
                0{safeCurrent + 1} / 0{slideCount}
              </span>
            </div>

            <h2 className="text-white font-['Outfit'] font-bold text-[20px] leading-tight tracking-tight truncate">
              {activeSlide.name}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {activeSlide.spec.split(" · ").map((chip, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center rounded-md bg-white/[0.07] border border-white/10 px-2 py-0.5 text-[11px] font-medium text-white/80"
                >
                  {chip}
                </span>
              ))}
            </div>

            <div className="mt-3.5 pt-3 border-t border-white/[0.08] flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-white/45 font-medium leading-none">
                  {t("hero.priceLabel")}
                </span>
                <span className="text-white font-['Outfit'] font-bold text-[20px] leading-tight mt-0.5 tabular-nums">
                  {activeSlide.price}
                </span>
              </div>

              <Link
                to={activeSlide.link}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-5 h-10 text-[13px] font-semibold text-white shadow-[0_4px_14px_rgba(217,15,37,0.35)] transition-all active:scale-[0.98]"
              >
                <span>{t("common.shopNow")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="mt-3.5 flex items-center justify-center gap-1.5">
              {HERO_SLIDES.map((s, index) => (
                <button
                  key={s.id}
                  onClick={() => setCurrent(index)}
                  aria-label={t("hero.goToSlideAria", { index: index + 1, name: s.name })}
                  className={`transition-all rounded-full ${
                    safeCurrent === index
                      ? "w-6 h-1 bg-white"
                      : "w-1.5 h-1 bg-white/25 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. DESKTOP HERO (lg:block) ── */}
      <div className="hidden lg:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 min-h-[560px] flex items-center">
          <div className="grid grid-cols-2 gap-12 items-center w-full">
            
            {/* LEFT COLUMN */}
            <div className="flex flex-col justify-center">
              <p className="text-sm font-bold uppercase tracking-wider text-[var(--accent)] mb-3">
                {t("hero.eyebrow")}
              </p>

              <h1 className="font-['Outfit'] font-bold text-[#14161A] text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[1.08] tracking-tight mb-4">
                {t("hero.headlineStart")}{" "}
                <span className="text-[var(--accent)]">{t("hero.headlineAccent")}</span>
              </h1>

              <p className="text-[18px] text-[#4A5058] leading-relaxed max-w-xl mb-7">
                {t("hero.subtitle")}
              </p>

              <div className="flex items-center gap-4 mb-7">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-7 h-12 text-base font-semibold text-white transition-colors shadow-sm"
                >
                  <span>{t("common.shopNow")}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D5D5CF] bg-white hover:bg-[#F4F4F1] px-6 h-12 text-base font-semibold text-[#14161A] transition-colors shadow-2xs"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>{t("common.orderOnWhatsapp")}</span>
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-y-2.5 gap-x-6 text-sm text-[#4A5058]">
                <div className="flex items-center gap-2 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[var(--accent)] shrink-0" />
                  <span>{t("hero.claims.warranty")}</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <MessageCircle className="w-4 h-4 text-[var(--accent)] shrink-0" />
                  <span>{t("hero.claims.orders")}</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <Truck className="w-4 h-4 text-[var(--accent)] shrink-0" />
                  <span>{t("hero.claims.shipping")}</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div
              className="flex flex-col items-center justify-center"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="relative w-full aspect-[4/3] rounded-[24px] overflow-hidden border border-[#E6E6E1] bg-[#F4F4F1] shadow-[0_8px_30px_rgba(20,22,26,0.06)]">
                {renderedSlides.map((slide, idx) => {
                  const isActive = safeCurrent === idx;
                  return (
                    <div
                      key={slide.id}
                      className={`absolute inset-0 transition-opacity duration-700 ease-in-out motion-reduce:transition-none ${
                        isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                      }`}
                      aria-hidden={!isActive}
                    >
                      <picture className="block w-full h-full">
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

                <div className="absolute bottom-6 left-6 z-20 bg-white/95 backdrop-blur-md border border-[#E6E6E1] rounded-2xl p-4 shadow-[0_8px_24px_rgba(20,22,26,0.12)] max-w-[280px]">
                  <h3 className="font-['Outfit'] font-bold text-base text-[#14161A] truncate">
                    {activeSlide.name}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5 truncate">
                    {activeSlide.spec}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-[#F1F1ED] flex items-center justify-between gap-3">
                    <span className="font-['Outfit'] font-bold text-lg text-[#14161A]">
                      {activeSlide.price}
                    </span>
                    <Link
                      to={activeSlide.link}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors whitespace-nowrap"
                    >
                      <span>{t("common.viewProduct")}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2">
                {HERO_SLIDES.map((s, index) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrent(index)}
                    aria-label={t("hero.goToSlideAria", { index: index + 1, name: s.name })}
                    className={`h-2 transition-all rounded-full ${
                      safeCurrent === index
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
