import React from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Mail } from "lucide-react";
import { COMPANY, WHATSAPP_URL } from "../config";
import SEO from "../components/SEO";

export default function ReturnRefundPolicy() {
  return (
    <>
      <SEO
        title="Return & Refund Policy | 7-Day Replacement Guarantee"
        description="GunLite Return & Refund Policy: 7-day replacement guarantee for damaged or defective items, hassle-free WhatsApp support, and 1-year hardware warranty details."
        path="/returns"
        type="website"
      />
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-20 pb-20 text-slate-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
          <Link to="/" className="hover:text-cyan-300 transition">Home</Link>
          <span>/</span>
          <span>Legal</span>
          <span>/</span>
          <span className="text-slate-400">Return &amp; Refund Policy</span>
        </div>

        {/* Header */}
        <header className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3">
            Return &amp; Refund Policy
          </h1>
          <p className="text-sm text-slate-400">
            7-Day Replacement Policy | 1-Year Hardware Warranty Support
          </p>
        </header>

        {/* Quick Policy Nav */}
        <div className="mb-10 flex flex-wrap gap-2 border-b border-slate-800 pb-4 text-xs sm:text-sm font-medium">
          <Link to="/privacy" className="rounded-lg border border-slate-800 bg-slate-900/50 px-3.5 py-1.5 text-slate-400 hover:text-white hover:border-slate-700 transition">Privacy Policy</Link>
          <Link to="/shipping" className="rounded-lg border border-slate-800 bg-slate-900/50 px-3.5 py-1.5 text-slate-400 hover:text-white hover:border-slate-700 transition">Shipping Policy</Link>
          <Link to="/returns" className="rounded-lg bg-blue-600/30 border border-blue-500/50 px-3.5 py-1.5 text-white">Return &amp; Refund</Link>
          <Link to="/terms" className="rounded-lg border border-slate-800 bg-slate-900/50 px-3.5 py-1.5 text-slate-400 hover:text-white hover:border-slate-700 transition">Terms &amp; Conditions</Link>
        </div>

        {/* Content Body */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-10 shadow-2xl backdrop-blur-md space-y-8 text-sm sm:text-base leading-relaxed">
          
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. 7-Day Replacement Guarantee</h2>
            <p>
              At <strong>{COMPANY.brand}</strong>, we pride ourselves on delivering rugged, high-performance illumination equipment. Every piece undergoes functional checks before dispatch. If you receive a product that is defective on arrival, damaged in transit, or missing parts, we provide a <strong>7-Day Replacement Guarantee</strong> starting from the date of confirmed delivery.
            </p>
          </section>

          {/* WhatsApp Process Card */}
          <section className="rounded-xl border border-blue-500/30 bg-blue-950/40 p-5">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-[#00e5ff]" /> Hassle-Free Returns via WhatsApp
            </h3>
            <p className="text-sm text-blue-200/90 mb-3">
              Because your order was confirmed over WhatsApp, raising a return or replacement request is instantaneous. Simply contact us on WhatsApp with:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-sm text-blue-200/80 pl-2">
              <li>Your Name &amp; Phone Number used during ordering.</li>
              <li>A clear photo or short video showing the issue (e.g. charging port, switch failure, or transit crack).</li>
              <li>A photo of the original product packaging and retail box.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Eligibility Conditions for Return / Replacement</h2>
            <p className="mb-2">To be eligible for an exchange or replacement:</p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-slate-300">
              <li>The item must be reported within <strong>7 days</strong> of delivery.</li>
              <li>The item must include its original retail box, internal protective inserts, charging cable (USB Type-C), and included lithium batteries or battery accessories.</li>
              <li>The item must not show signs of intentional abuse, cosmetic wear from rough external mishandling, unauthorized opening, or soldering.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Refund Policy (When Replacement is Unavailable)</h2>
            <p className="mb-3">
              Our primary goal is to ensure you have a working, dependable torch through prompt free replacement. However, if an exact replacement or suitable alternative model is unavailable:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-slate-300">
              <li>A full refund of the product purchase amount will be approved.</li>
              <li>Refunds are processed back to your original payment method, UPI ID, or bank account via NEFT within <strong>5 to 7 business days</strong> of receipt and inspection of the returned unit at our Coimbatore facility.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. 1-Year Limited Hardware Warranty</h2>
            <p className="mb-3">
              Beyond the 7-day initial replacement window, our torches (including Eagle 3.1, Everest LED, Tiger Pro-1, and Sniper X2) are backed by a <strong>1-Year Limited Manufacturer Warranty</strong> against internal LED chip failure, switch malfunction, and internal charging board defects.
            </p>
            <p className="text-xs sm:text-sm text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-800">
              <strong>Warranty Exclusions:</strong> Water damage caused by submerging non-waterproof models, physical breakage from high drops, battery aging due to long-term storage without recharging, or unauthorized modification/repairs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Need Help with a Return?</h2>
            <p className="mb-3">
              Reach out to our customer care team and we will assist you directly:
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-500 transition"
              >
                <MessageCircle className="w-4 h-4 text-white" /> WhatsApp Support: {COMPANY.phone}
              </a>
              <a
                href={`mailto:${COMPANY.email}`}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition"
              >
                <Mail className="w-4 h-4 text-[#00e5ff]" /> Email: {COMPANY.email}
              </a>
            </div>
          </section>

        </div>
      </div>
    </main>
    </>
  );
}

