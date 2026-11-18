import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FeaturedProducts = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    cardsRef.current = [];

    const ctx = gsap.context(() => {
      // Title Animation
      gsap.from(titleRef.current, {
        y: -40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      });

      // Cards Animation
      gsap.from(cardsRef.current, {
        y: 80,
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });
    }, sectionRef);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  const products = [
    {
      img: "/images/eagle.webp",
      fallback: "/images/eagle.png",
      title: "Eagle 3.1 Gunlite",
      desc: "High power professional torch",
      link: "/eagle",
    },
    {
      img: "/images/everest.webp",
      fallback: "/images/everest.png",
      title: "Everest LED Gunlite",
      desc: "Long range search light",
      link: "/everest",
    },
    {
      img: "/images/tigerpro.webp",
      fallback: "/images/tigerpro.png",
      title: "Tiger Pro-1 Gunlite",
      desc: "Rechargeable emergency torch",
      link: "/tiger",
    },
    {
      img: "/images/sniper.webp",
      fallback: "/images/sniper.png",
      title: "Sniper X2 Gunlite",
      desc: "Compact & powerful torch",
      link: "/sniper",
    },
    {
      img: "/images/eagle.webp",
      fallback: "/images/eagle.png",
      title: "Eagle 3.1 Pro Beam",
      desc: "Ultra-distance spotlight",
      link: "/eagle",
    },
    {
      img: "/images/everest.webp",
      fallback: "/images/everest.png",
      title: "Everest LED 55W",
      desc: "Tri-beam search light",
      link: "/everest",
    },
    {
      img: "/images/tigerpro.webp",
      fallback: "/images/tigerpro.png",
      title: "Tiger Pro Duty Light",
      desc: "Heavy-duty industrial build",
      link: "/tiger",
    },
    {
      img: "/images/sniper.webp",
      fallback: "/images/sniper.png",
      title: "Sniper X2 Tactical",
      desc: "Quick-zoom carry torch",
      link: "/sniper",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Title */}
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4"
          >
            Featured Products
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((item, idx) => (
            <div
              key={idx}
              ref={(el) => {
                if (el) cardsRef.current[idx] = el;
              }}
              className="group relative"
            >
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>

                {/* Badge */}

                {/* Image Section */}
                <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 p-8 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl"></div>

                  <picture>
                    <source srcSet={item.img} type="image/webp" />
                    <img
                      src={item.fallback || item.img}
                      alt={`${item.title} - ${item.desc}`}
                      width={300}
                      height={192}
                      loading="lazy"
                      className="h-48 w-full object-contain relative z-10 transform transition-all duration-700 group-hover:scale-110"
                    />
                  </picture>
                </div>

                {/* Content */}
                <div className="p-6 relative z-10">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-600 mb-6">{item.desc}</p>

                  <button className="relative w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold shadow-md hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 overflow-hidden group/btn">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>

                    <span className="relative flex items-center justify-center gap-2">
                      View Product
                      <svg
                        className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </button>
                </div>

                {/* Bottom Line Animation */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
