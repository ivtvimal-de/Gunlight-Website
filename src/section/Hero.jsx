import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { MessageCircle, ArrowRight } from "lucide-react";
import { WHATSAPP_URL, SPECS } from "../config";

const HeroTorchBlue = () => {
  const heroRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const buttonRef = useRef(null);
  const specsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { duration: 1.1, ease: "power3.out" },
      });

      tl.from(badgeRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.8,
      });

      const titleLines = titleRef.current.querySelectorAll(".title-line");
      tl.from(
        titleLines,
        {
          y: 40,
          opacity: 0,
          filter: "blur(6px)",
          stagger: 0.15,
          duration: 1.0,
          ease: "power4.out",
        },
        "-=0.5",
      );

      tl.from(descRef.current, { y: 25, opacity: 0, duration: 0.8 }, "-=0.7");
      tl.from(
        buttonRef.current,
        { scale: 0.92, opacity: 0, duration: 0.8, ease: "back.out(1.4)" },
        "-=0.6",
      );
      tl.from(
        specsRef.current.children,
        {
          y: 30,
          opacity: 0,
          stagger: 0.1,
          duration: 0.7,
        },
        "-=0.5",
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const specs = SPECS.hero;

  return (
    <section
      ref={heroRef}
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#020617] pt-20 pb-16"
    >
      {/* ── Full-Width Product Background Image ── */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source srcSet="/images/hero.webp" type="image/webp" />
          <img
            src="/images/hero.jpg"
            alt="GunLite high-power tactical flashlight beam cutting through darkness"
            width={1920}
            height={1080}
            fetchPriority="high"
            className="h-full w-full object-cover object-center"
          />
        </picture>

        {/* Sophisticated Darkening & Vignette Overlays */}
        <div className="absolute inset-0 bg-[#020617]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-[#020617]/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-transparent to-[#020617]" />
      </div>

      {/* ── Precision Cyan Beam Glow (Focused Behind Content) ── */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-[420px] sm:w-[600px] rounded-full bg-[#00e5ff]/15 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-12 right-1/4 h-64 w-64 rounded-full bg-[#0ea5e9]/10 blur-[90px]" />

      {/* ── Main Content Container ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
        
        {/* Tactical Category Tag */}
        <div ref={badgeRef} className="inline-flex items-center gap-2 mb-6">
          <span className="badge-tactical border-[#00e5ff]/40 bg-[#00e5ff]/10 text-[#00e5ff]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00e5ff] shadow-[0_0_6px_#00e5ff]" />
            Professional &amp; Tactical Illumination
          </span>
        </div>

        {/* Powerful Headline */}
        <h1 ref={titleRef} className="mb-6 space-y-1 font-display tracking-wider uppercase">
          <div className="title-line text-3xl sm:text-5xl lg:text-7xl font-bold text-white drop-shadow-md">
            Power in Every Beam
          </div>
          <div className="title-line text-3xl sm:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-[#00e5ff] via-[#38bdf8] to-white bg-clip-text text-transparent">
            Built for Professionals
          </div>
        </h1>

        {/* Crisp Sub-headline */}
        <p
          ref={descRef}
          className="mb-10 max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed font-sans"
        >
          High-performance LED searchlights and portable torches engineered for
          maximum beam throw, extreme battery endurance, and all-weather tactical reliability.
        </p>

        {/* Dual Primary & Secondary CTAs */}
        <div
          ref={buttonRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          {/* Primary CTA */}
          <Link
            to="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#0ea5e9] to-[#00e5ff] px-8 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-[#020617] shadow-[0_4px_25px_-2px_rgba(0,229,255,0.45)] hover:shadow-[0_6px_35px_-2px_rgba(0,229,255,0.65)] hover:-translate-y-0.5 transition-all duration-200"
          >
            <span>Shop Now</span>
            <ArrowRight className="w-4 h-4 text-[#020617]" />
          </Link>

          {/* Secondary CTA */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#0f172a]/90 border border-white/[0.12] hover:border-[#00e5ff]/50 px-7 py-3.5 font-display text-sm font-semibold uppercase tracking-wider text-white hover:text-[#00e5ff] hover:bg-[#1e293b] hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-sm shadow-md"
          >
            <MessageCircle className="w-4 h-4 text-[#00e5ff]" />
            <span>Enquire on WhatsApp</span>
          </a>
        </div>

        {/* ── Key Tactical Specifications Row (4 Cards) ── */}
        <div
          ref={specsRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-6 border-t border-white/[0.08]"
        >
          {specs.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-white/[0.06] bg-[#090e1a]/70 p-3.5 sm:p-4 backdrop-blur-md text-left hover:border-[#00e5ff]/30 transition-colors"
            >
              <p className="text-[11px] font-mono uppercase tracking-wider text-[#8494ab] mb-0.5">
                {item.label}
              </p>
              <p className="font-display text-lg sm:text-xl font-bold text-white tracking-wide">
                {item.value}
              </p>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                {item.detail}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HeroTorchBlue;
