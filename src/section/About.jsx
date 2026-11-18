import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Gem, Award, ShieldCheck } from "lucide-react";

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
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      });

      gsap.from(statsRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      gsap.from(whyChooseRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      gsap.from(highlightsRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
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
      desc: "High-intensity illumination for maximum visibility",
    },
    {
      title: "Long Battery Life",
      desc: "Extended runtime for uninterrupted performance",
    },
    { title: "Durable Build", desc: "Military-grade aluminum construction" },
    {
      title: "Water Resistant",
      desc: "IPX6 rated for all-weather reliability",
    },
  ];

  const stats = [
    { value: "15+", label: "Years of Excellence" },
    { value: "100K+", label: "Happy Customers" },
    { value: "50+", label: "Premium Models" },
  ];

  const whyChoose = [
    {
      icon: <Gem className="w-6 h-6 text-[#00e5ff]" />,
      title: "Premium Quality",
      desc: "Premium LED chips & aerospace-grade aluminum ensure unmatched durability.",
    },
    {
      icon: <Award className="w-6 h-6 text-[#00e5ff]" />,
      title: "Trusted Brand",
      desc: "Preferred by professionals & outdoor enthusiasts across India.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#00e5ff]" />,
      title: "Comprehensive Warranty",
      desc: "2-year warranty with nationwide service support.",
    },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-white via-slate-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 flex flex-col gap-16">
        {/* HEADER */}
        <div ref={contentRef} className="text-center flex flex-col gap-4">
          <div className="flex justify-center">
            <span
              className="px-6 py-2 text-sm font-semibold 
  border border-blue-600 text-blue-600 
  rounded-full tracking-wide uppercase 
  bg-blue-50 backdrop-blur-sm"
            >
              About GunLite
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Illuminate Your Path <br />
            <span className="text-blue-600">With Trusted Brilliance</span>
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            GunLite is India's trusted brand for high-performance torch lights.
            Reliable illumination that never lets you down.
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              ref={(el) => (statsRef.current[idx] = el)}
              className="text-center p-6 bg-white rounded-2xl shadow-md border border-blue-100 hover:shadow-lg transition"
            >
              <div className="text-4xl font-bold text-blue-600">
                {stat.value}
              </div>
              <div className="text-gray-600 text-sm font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* WHY CHOOSE */}
        <div className="flex flex-col gap-10">
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
              Why Choose <span className="text-blue-600">GunLite?</span>
            </h3>
            <p className="text-gray-600 mt-2">
              Innovation, reliability & performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whyChoose.map((item, idx) => (
              <div
                key={idx}
                ref={(el) => (whyChooseRef.current[idx] = el)}
                className="bg-white rounded-2xl p-6 shadow-md border border-blue-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center"
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-[#090e1a] border border-[#00e5ff]/30 rounded-full flex items-center justify-center text-white shadow-md">
                  {item.icon}
                </div>

                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FEATURES */}
        <div className="flex flex-col gap-10">
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
              Premium <span className="text-blue-600">Features</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item, idx) => (
              <div
                key={idx}
                ref={(el) => (highlightsRef.current[idx] = el)}
                className="bg-white rounded-2xl p-5 shadow-md border border-blue-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* APPLICATIONS */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-10 text-white text-center shadow-xl">
          <h4 className="text-2xl md:text-3xl font-bold mb-6">
            Perfect For Every Need
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              "Security Guards",
              "Night Patrols",
              "Emergency Backup",
              "Outdoor Camping",
              "Industrial Use",
              "Home Safety",
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white/10 rounded-xl py-3 px-4 text-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-blue-50 rounded-3xl p-10 border border-blue-100 shadow-md">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Ready to Experience Superior Illumination?
          </h3>

          <p className="text-gray-600 mb-6">
            Join over 100,000 satisfied customers who trust GunLite.
          </p>

          <button className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 hover:scale-105 transition-all duration-300 shadow-md">
            Explore Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default About;
