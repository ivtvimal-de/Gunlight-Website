import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShoppingCart, MessageCircle, Check } from "lucide-react";
import { useCart } from "../context/CartContext";
import { WHATSAPP_NUMBER } from "../config";

gsap.registerPlugin(ScrollTrigger);

const PopularTorch = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);
  const [addedId, setAddedId] = useState(null);
  const { addItem, items } = useCart();

  useEffect(() => {
    cardsRef.current = [];

    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      });

      gsap.from(cardsRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.1,
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
      id: "eagle",
      img: "/images/eagle.webp",
      fallback: "/images/eagle.png",
      title: "Eagle 3.1 GunLite",
      desc: "50W high-power search light with long-range focused beam.",
      price: "₹2,499",
      priceNum: 2499,
      link: "/eagle",
      specs: ["50W LED Chip", "Type-C Fast Charge", "SOS Flash"],
    },
    {
      id: "everest",
      img: "/images/everest.webp",
      fallback: "/images/everest.png",
      title: "Everest LED GunLite",
      desc: "55W professional search light with 10000mAh device charging.",
      price: "₹1,999",
      priceNum: 1999,
      link: "/everest",
      specs: ["55W LED", "10000mAh Power Bank", "Tri-Light Output"],
    },
    {
      id: "tiger",
      img: "/images/tigerpro.webp",
      fallback: "/images/tigerpro.png",
      title: "Tiger Pro-1 GunLite",
      desc: "Compact aluminium emergency flashlight with USA CREE LED.",
      price: "₹1,499",
      priceNum: 1499,
      link: "/tiger",
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
      specs: ["1000 Lumens", "2× 18650 Battery", "Zoom Flood/Focus"],
    },
  ];

  const handleAddToCart = (product) => {
    addItem({ ...product, quantity: 1 });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

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

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((item, idx) => {
            const isAdded = addedId === item.id;
            const inCart = items.some((i) => i.id === item.id);
            const waText = encodeURIComponent(
              `Hi GunLite, I would like to enquire about ${item.title} (${item.price}). Please share availability and delivery time.`
            );
            const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

            return (
              <div
                key={item.id}
                ref={(el) => (cardsRef.current[idx] = el)}
                className="group relative flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-white overflow-hidden transition-all duration-300 hover:border-[var(--border-strong)] hover:-translate-y-1 shadow-[0_4px_20px_rgba(20,22,26,0.06)] hover:shadow-[0_12px_30px_-4px_rgba(20,22,26,0.1)]"
              >
                <div>
                  {/* Image Presentation */}
                  <Link
                    to={item.link}
                    className="block relative overflow-hidden bg-[var(--bg-surface-2)] p-6 flex items-center justify-center border-b border-[var(--border-subtle)]"
                  >
                    <picture>
                      <source srcSet={item.img} type="image/webp" />
                      <img
                        src={item.fallback}
                        alt={`${item.title} - ${item.desc}`}
                        width={300}
                        height={176}
                        loading="lazy"
                        className="mx-auto h-44 w-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    </picture>
                  </Link>

                  {/* Body Info */}
                  <div className="p-5">
                    <Link to={item.link} className="block group-hover:text-[var(--accent)] transition-colors">
                      <h3 className="font-['Outfit'] text-base font-bold text-[var(--text-primary)] mb-1.5">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-3 line-clamp-2">
                      {item.desc}
                    </p>

                    {/* Spec Chips */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {item.specs.map((spec) => (
                        <span
                          key={spec}
                          className="rounded-md bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] px-2 py-0.5 text-[11px] font-medium text-[var(--text-primary)]"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    {/* Price */}
                    <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
                      <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-medium">Price</span>
                      <span className="font-['Outfit'] text-lg font-bold text-[var(--text-primary)]">{item.price}</span>
                    </div>
                  </div>
                </div>

                {/* Actions: Add to Cart & Enquire */}
                <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs ${
                      isAdded
                        ? "bg-[#10B981] text-white"
                        : "bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white"
                    }`}
                    aria-label={`Add ${item.title} to cart`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5 text-white" />
                        <span>{inCart ? "Add More" : "Add to Cart"}</span>
                      </>
                    )}
                  </button>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-3)] hover:border-[var(--accent)] hover:text-[var(--accent)] text-[var(--text-primary)] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span>Enquire</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-strong)] bg-white px-6 py-3 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--bg-surface-2)] transition-colors shadow-xs"
          >
            <span>View All Products</span>
            <span>→</span>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default PopularTorch;
