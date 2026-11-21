import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, MessageCircle, MapPin, Phone, Mail, FileText } from "lucide-react";
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
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      });

      // Left Box Animation
      gsap.from(leftRef.current, {
        x: -40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: leftRef.current,
          start: "top 85%",
        },
      });

      // Right Form Animation
      gsap.from(rightRef.current, {
        x: 40,
        opacity: 0,
        duration: 0.8,
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
      className="py-20 bg-white text-[#14161a] border-t border-[#e6e6e1]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div ref={headerRef} className="text-center mb-16">
          <span className="mb-3 inline-block rounded-full border border-[#e6e6e1] bg-[#f4f4f1] px-4 py-1.5 text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
            Get in Touch
          </span>
          <h2 className="text-3xl md:text-5xl font-['Outfit'] font-bold text-[#14161a] mb-4 tracking-tight">
            Contact <span className="text-[var(--accent)]">GunLite</span>
          </h2>

          <p className="text-sm md:text-base text-[#4a5058] max-w-2xl mx-auto leading-relaxed">
            We are here to help with product enquiries, bulk orders, or
            dealership opportunities across India.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* LEFT SIDE: COMPANY INFO */}
          <div ref={leftRef} className="h-full">
            <div className="h-full bg-[#fafaf8] border border-[#e6e6e1] rounded-3xl p-8 sm:p-10 text-[#14161a] flex flex-col justify-between shadow-[0_4px_20px_rgba(20,22,26,0.06)]">
              <div className="space-y-8">
                <div>
                  <span className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
                    Manufacturing &amp; Trade
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-['Outfit'] font-bold text-[#14161a] mt-1">
                    Jerone Enterprises
                  </h3>
                </div>

                <div className="space-y-6 text-sm text-[#4a5058]">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[var(--accent)] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#14161a] mb-1">Our Location</p>
                      <p className="leading-relaxed">
                        39/2, Sakthi Nagar, 3rd Street,
                        <br />
                        Kavundampalayam,
                        <br />
                        Coimbatore – 641030, Tamil Nadu
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[var(--accent)] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#14161a] mb-1">Direct Phone / WhatsApp</p>
                      <p>{COMPANY.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[var(--accent)] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#14161a] mb-1">Email</p>
                      <p className="break-all">{COMPANY.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-[var(--accent)] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#14161a] mb-1">GST Registration</p>
                      <p>{COMPANY.gst}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* WHATSAPP BUTTON */}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 w-full flex items-center justify-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white py-3.5 rounded-lg text-xs font-semibold transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>Chat Directly on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* RIGHT SIDE: FORM */}
          <div
            ref={rightRef}
            className="h-full bg-[#fafaf8] border border-[#e6e6e1] rounded-3xl p-8 sm:p-10 flex flex-col shadow-[0_4px_20px_rgba(20,22,26,0.06)]"
          >
            <h3 className="text-xl sm:text-2xl font-['Outfit'] font-bold text-[#14161a] mb-2">
              Send us an <span className="text-[var(--accent)]">Enquiry</span>
            </h3>
            <p className="text-xs text-[#6b727c] mb-6">
              Fill in your details to immediately initiate an inquiry over WhatsApp.
            </p>

            {submitted ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center py-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-[#e6e6e1] shadow-xs">
                  <Check className="w-8 h-8 text-[var(--accent)]" />
                </div>
                <p className="font-['Outfit'] text-lg font-bold text-[#14161a]">Enquiry Initiated!</p>
                <p className="text-sm text-[#6b727c]">We have opened WhatsApp to confirm your requirement.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 rounded-lg border border-[#e6e6e1] bg-white px-6 py-2 text-xs font-semibold text-[#14161a] hover:bg-[#f4f4f1] transition-colors"
                >
                  Send another enquiry
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
                      className={`w-full bg-white border rounded-xl px-4 py-3 text-sm text-[#14161a] placeholder-[#6b727c] focus:outline-none transition ${
                        errors.name ? "border-red-400 focus:border-red-500" : "border-[#e6e6e1] focus:border-[var(--accent)]"
                      }`}
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
                      className={`w-full bg-white border rounded-xl px-4 py-3 text-sm text-[#14161a] placeholder-[#6b727c] focus:outline-none transition ${
                        errors.email ? "border-red-400 focus:border-red-500" : "border-[#e6e6e1] focus:border-[var(--accent)]"
                      }`}
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
                      className={`w-full bg-white border rounded-xl px-4 py-3 text-sm text-[#14161a] placeholder-[#6b727c] focus:outline-none transition ${
                        errors.phone ? "border-red-400 focus:border-red-500" : "border-[#e6e6e1] focus:border-[var(--accent)]"
                      }`}
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
                      className={`w-full bg-white border rounded-xl px-4 py-3 text-sm text-[#14161a] placeholder-[#6b727c] focus:outline-none transition resize-none ${
                        errors.message ? "border-red-400 focus:border-red-500" : "border-[#e6e6e1] focus:border-[var(--accent)]"
                      }`}
                    />
                    {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-6 w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white py-3.5 rounded-lg text-xs font-semibold transition-colors shadow-sm"
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
