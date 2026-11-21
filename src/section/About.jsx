import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Gem, Award, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const highlightsRef = useRef([]);
  const statsRef = useRef([]);
  const whyChooseRef = useRef([]);

  useEffect(() => {
    highlightsRef.current = [];
    statsRef.current = [];
    whyChooseRef.current = [];

    const ctx = gsap.context(() => {
      gsap.from(contentRef.current.children, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      });

      gsap.from(statsRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      gsap.from(whyChooseRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      gsap.from(highlightsRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const highlights = [
    {
      title: "Ultra Bright LED",
      desc: "High-intensity illumination for maximum visibility across terrain.",
    },
    {
      title: "Long Battery Life",
      desc: "Extended runtime battery banks for uninterrupted performance.",
    },
    {
      title: "Durable Build",
      desc: "Aerospace-grade aluminium construction for demanding use.",
    },
    {
      title: "Water Resistant",
      desc: "Engineered weather seals for all-weather outdoor reliability.",
    },
  ];

  const stats = [
    { value: "15+", label: "Years of Excellence" },
    { value: "100K+", label: "Happy Customers" },
    { value: "50+", label: "Premium Models" },
  ];

  const whyChoose = [
    {
      icon: <Gem className="w-5 h-5 text-[var(--accent)]" />,
      title: "Premium Engineering",
      desc: "High-efficiency LED chips & aircraft aluminium ensure long-lasting durability.",
    },
    {
      icon: <Award className="w-5 h-5 text-[var(--accent)]" />,
      title: "Trusted Brand",
      desc: "Preferred by security professionals, farms, and outdoor enthusiasts across India.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[var(--accent)]" />,
      title: "Comprehensive Warranty",
      desc: "Hardware warranty with responsive direct WhatsApp customer support.",
    },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-20 bg-[#fafaf8] text-[#14161a] border-t border-[#e6e6e1]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-16">
        {/* HEADER */}
        <div ref={contentRef} className="text-center flex flex-col gap-4">
          <div className="flex justify-center">
            <span className="px-4 py-1.5 text-xs font-semibold border border-[#e6e6e1] text-[var(--accent)] rounded-full tracking-wider uppercase bg-white shadow-xs">
              About GunLite
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-['Outfit'] font-bold text-[#14161a] tracking-tight">
            Illuminate Your Path <br />
            <span className="text-[var(--accent)]">With Trusted Brilliance</span>
          </h2>

          <p className="text-sm md:text-base text-[#4a5058] max-w-2xl mx-auto leading-relaxed">
            GunLite is India's trusted brand for high-performance torch lights.
            Reliable illumination that never lets you down in the field or at home.
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              ref={(el) => (statsRef.current[idx] = el)}
              className="text-center p-6 bg-white rounded-2xl border border-[#e6e6e1] shadow-[0_4px_20px_rgba(20,22,26,0.06)] hover:border-[#cfcfc8] transition-colors"
            >
              <div className="text-3xl sm:text-4xl font-['Outfit'] font-bold text-[var(--accent)] mb-1">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-[#6b727c] font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* WHY CHOOSE */}
        <div className="flex flex-col gap-10">
          <div className="text-center">
            <h3 className="text-2xl md:text-4xl font-['Outfit'] font-bold text-[#14161a] tracking-tight">
              Why Choose <span className="text-[var(--accent)]">GunLite?</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#6b727c] mt-2">
              Performance, reliability, and precision optical engineering
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whyChoose.map((item, idx) => (
              <div
                key={idx}
                ref={(el) => (whyChooseRef.current[idx] = el)}
                className="bg-white rounded-2xl p-6 border border-[#e6e6e1] shadow-[0_4px_20px_rgba(20,22,26,0.06)] hover:border-[#cfcfc8] transition-all duration-300 text-center flex flex-col items-center"
              >
                <div className="w-12 h-12 mb-4 bg-[#f4f4f1] border border-[#e6e6e1] rounded-full flex items-center justify-center">
                  {item.icon}
                </div>

                <h4 className="text-base font-['Outfit'] font-bold text-[#14161a] mb-2">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#4a5058] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FEATURES */}
        <div className="flex flex-col gap-10">
          <div className="text-center">
            <h3 className="text-2xl md:text-4xl font-['Outfit'] font-bold text-[#14161a] tracking-tight">
              Hardware <span className="text-[var(--accent)]">Standards</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item, idx) => (
              <div
                key={idx}
                ref={(el) => (highlightsRef.current[idx] = el)}
                className="bg-white rounded-2xl p-6 border border-[#e6e6e1] shadow-[0_4px_20px_rgba(20,22,26,0.06)] hover:border-[#cfcfc8] transition-all duration-300"
              >
                <h4 className="font-['Outfit'] text-base font-bold text-[#14161a] mb-2">{item.title}</h4>
                <p className="text-xs sm:text-sm text-[#4a5058] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* APPLICATIONS */}
        <div className="bg-white border border-[#e6e6e1] rounded-3xl p-8 sm:p-10 text-[#14161a] text-center shadow-[0_4px_20px_rgba(20,22,26,0.06)]">
          <h4 className="text-xl sm:text-2xl font-['Outfit'] font-bold mb-6">
            Engineered For Every Mission
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto">
            {[
              "Security Patrols",
              "Industrial Facilities",
              "Night Patrols",
              "Agricultural Fields",
              "Emergency Backup",
              "Estate Safety",
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#f4f4f1] border border-[#e6e6e1] rounded-xl py-3 px-4 text-xs font-semibold text-[#14161a]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-white rounded-3xl p-8 sm:p-12 border border-[#e6e6e1] shadow-[0_4px_20px_rgba(20,22,26,0.06)]">
          <h3 className="text-2xl sm:text-3xl font-['Outfit'] font-bold text-[#14161a] mb-3">
            Ready to Upgrade Your Illumination?
          </h3>

          <p className="text-sm text-[#4a5058] mb-6 max-w-xl mx-auto">
            Explore our professional collection of high-power torches and search lights.
          </p>

          <Link
            to="/shop"
            className="inline-block px-8 py-3 bg-[var(--accent)] text-white rounded-lg text-xs font-semibold hover:bg-[var(--accent-hover)] transition-colors shadow-sm"
          >
            Explore Catalogue →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default About;
