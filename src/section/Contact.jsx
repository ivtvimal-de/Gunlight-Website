import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check } from "lucide-react";
import { WHATSAPP_NUMBER, COMPANY } from "../config";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  // ── Form state ──────────────────────────────────────────────────────────
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.phone.trim()) {
      e.phone = "Phone number is required.";
    } else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ""))) {
      e.phone = "Enter a valid 10-digit Indian mobile number.";
    }
    if (!form.message.trim()) e.message = "Message / requirement is required.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Enter a valid email address.";
    }
    return e;
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});

    // Build a WhatsApp pre-filled message
    const text = [
      `*New Enquiry from GunLite Website*`,
      `Name: ${form.name}`,
      form.email ? `Email: ${form.email}` : null,
      `Phone: ${form.phone}`,
      `Message: ${form.message}`,
    ].filter(Boolean).join("\n");

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
      "_blank",
    );
    setSubmitted(true);
    setForm({ name: "", email: "", phone: "", message: "" });
  };
  // ────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.from(headerRef.current.children, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      });

      // Left Box Animation
      gsap.from(leftRef.current, {
        x: -60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: leftRef.current,
          start: "top 85%",
        },
      });

      // Right Form Animation
      gsap.from(rightRef.current, {
        x: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rightRef.current,
          start: "top 85%",
        },
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-white via-slate-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* HEADER */}
        <div ref={headerRef} className="text-center mb-16">
          

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact <span className="text-blue-600">Us</span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're here to help with product enquiries, bulk orders, or
            dealership opportunities.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* LEFT SIDE */}
          <div ref={leftRef} className="h-full">
            <div className="h-full bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-10 text-white shadow-xl flex flex-col justify-between">
              {/* CONTENT */}
              <div className="space-y-8">
                <h3 className="text-3xl font-bold tracking-wide">
                  Jerone Enterprises
                </h3>

                <div className="space-y-6 text-blue-100">
                  <div>
                    <p className="text-lg font-semibold text-white mb-2">
                      Our Location
                    </p>
                    <p className="text-base leading-relaxed">
                      39/2, Sakthi Nagar, 3rd Street,
                      <br />
                      Kavundampalayam,
                      <br />
                      Coimbatore – 641030
                    </p>
                  </div>

                  <div>
                    <p className="text-lg font-semibold text-white mb-1">
                      Phone
                    </p>
                    <p className="text-base">{COMPANY.phone}</p>
                  </div>

                  <div>
                    <p className="text-lg font-semibold text-white mb-1">
                      Email
                    </p>
                    <p className="text-base break-all">
                      jeroneenterprises@gmail.com
                    </p>
                  </div>

                  <div>
                    <p className="text-lg font-semibold text-white mb-1">
                      GST Number
                    </p>
                    <p className="text-base">33AAMFJ0709K1ZD</p>
                  </div>
                </div>
              </div>

              {/* WHATSAPP BUTTON */}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 w-full text-center bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-base font-semibold transition-all duration-300 shadow-md hover:scale-105"
              >
                WhatsApp Enquiry
              </a>
            </div>
          </div>

          {/* RIGHT SIDE FORM */}
          <div
            ref={rightRef}
            className="h-full bg-white rounded-3xl p-8 shadow-lg border border-blue-100 flex flex-col"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Send us an <span className="text-blue-600">Enquiry</span>
            </h3>

            {submitted ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center py-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-[#00e5ff]">
                  <Check className="w-8 h-8 text-[#00e5ff]" />
                </div>
                <p className="text-lg font-semibold text-gray-800">Enquiry sent via WhatsApp!</p>
                <p className="text-sm text-gray-500">We'll get back to you shortly on WhatsApp.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 rounded-xl border border-blue-300 px-6 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col justify-between" noValidate>
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Full Name *"
                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition ${errors.name ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Email Address (optional)"
                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition ${errors.email ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Phone Number *"
                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition ${errors.phone ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <textarea
                      rows="4"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us about your requirements... *"
                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition resize-none ${errors.message ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                    />
                    {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 shadow-md hover:scale-105"
                >
                  Send via WhatsApp →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
