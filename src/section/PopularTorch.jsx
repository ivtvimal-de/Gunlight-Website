import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductCard from "../components/ProductCard";

gsap.registerPlugin(ScrollTrigger);

export default function PopularTorch() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);

  const products = [
    {
      id: "eagle",
      img: "/images/eagle.webp",
      fallback: "/images/eagle.png",
      title: "Eagle 3.1 GunLite",
      desc: "50W LED searchlight with focused Fresnel optical lens.",
      price: "₹2,499",
      priceNum: 2499,
      link: "/eagle",
      categories: ["Search Light"],
      specs: ["50W LED Chip", "Type-C Rechargeable", "SOS Emergency"],
    },
    {
      id: "everest",
      img: "/images/everest.webp",
      fallback: "/images/everest.png",
      title: "Everest LED GunLite",
      desc: "55W long-range LED torch with 10,000mAh dual-cell backup.",
      price: "₹1,999",
      priceNum: 1999,
      link: "/everest",
      categories: ["LED Torch", "Rechargeable"],
      specs: ["55W LED", "10,000mAh Battery", "Reverse USB Out"],
    },
    {
      id: "tiger",
      img: "/images/tigerpro.webp",
      fallback: "/images/tigerpro.png",
      title: "Tiger Pro-1 GunLite",
      desc: "Compact rechargeable emergency patrol torch for security use.",
      price: "₹1,499",
      priceNum: 1499,
      link: "/tiger",
      categories: ["Rechargeable"],
      specs: ["500 Lumens", "4000mAh Lithium", "CREE LED"],
    },
    {
      id: "sniper",
      img: "/images/sniper.webp",
      fallback: "/images/sniper.png",
      title: "Sniper X2 GunLite",
      desc: "Dual-battery zoomable torch with flood & focus optics.",
      price: "₹999",
      priceNum: 999,
      link: "/sniper",
      categories: ["LED Torch"],
      specs: ["1000 Lumens", "2× 18650 Battery", "Zoom Flood/Focus"],
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(cardsRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        opacity: 0,
        y: 40,
        duration: 0.7,
        stagger: 0.1,
        ease: "power2.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="popular"
      ref={sectionRef}
      className="py-20 bg-[var(--bg-canvas)] text-[var(--text-primary)] border-b border-[var(--border-subtle)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16">
          <span className="mb-3 inline-block rounded-full border border-[var(--border-subtle)] bg-[var(--accent-tint)] px-3.5 py-1.5 text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
            Customer Favorites
          </span>
          <h2 className="font-['Outfit'] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
            Popular <span className="text-[var(--accent)]">Torches</span>
          </h2>
          <p className="mt-3 text-base text-[var(--text-secondary)] max-w-xl mx-auto">
            High-output rechargeable torches engineered for demanding civilian, agricultural, and security applications.
          </p>
        </div>

        {/* 4-Column Product Grid (2 columns on mobile, gap 24px desktop / 16px mobile) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((item, idx) => (
            <div
              key={item.id}
              ref={(el) => (cardsRef.current[idx] = el)}
              className="h-full"
            >
              <ProductCard product={item} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
