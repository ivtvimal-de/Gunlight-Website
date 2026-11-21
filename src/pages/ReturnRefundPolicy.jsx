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
      <main className="min-h-screen bg-[#fafaf8] pt-32 sm:pt-36 pb-20 text-[#4a5058]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
            <Link to="/" className="hover:text-[#14161a] transition-colors">Home</Link>
            <span className="text-[#cfcfc8]">/</span>
            <span>Legal</span>
            <span className="text-[#cfcfc8]">/</span>
            <span className="text-[#6b727c]">Return &amp; Refund Policy</span>
          </div>

          {/* Header */}
          <header className="mb-8">
            <h1 className="font-['Outfit'] text-3xl sm:text-4xl font-bold text-[#14161a] mb-3 tracking-tight">
              Return &amp; Refund Policy
            </h1>
            <p className="text-xs sm:text-sm text-[#6b727c]">
              7-Day Replacement Policy | 1-Year Hardware Warranty Support
            </p>
          </header>

          {/* Quick Policy Nav */}
          <div className="mb-8 flex flex-wrap gap-2 border-b border-[#e6e6e1] pb-4 text-xs font-medium">
            <Link to="/privacy" className="rounded-lg border border-[#e6e6e1] bg-white px-3 py-1.5 text-[#6b727c] hover:text-[#14161a] hover:border-[#cfcfc8] transition-colors">Privacy Policy</Link>
            <Link to="/shipping" className="rounded-lg border border-[#e6e6e1] bg-white px-3 py-1.5 text-[#6b727c] hover:text-[#14161a] hover:border-[#cfcfc8] transition-colors">Shipping Policy</Link>
            <Link to="/returns" className="rounded-lg bg-[var(--accent)] text-white font-semibold px-3 py-1.5 shadow-xs">Return &amp; Refund</Link>
            <Link to="/terms" className="rounded-lg border border-[#e6e6e1] bg-white px-3 py-1.5 text-[#6b727c] hover:text-[#14161a] hover:border-[#cfcfc8] transition-colors">Terms &amp; Conditions</Link>
          </div>

          {/* Content Body */}
          <div className="rounded-2xl border border-[#e6e6e1] bg-white p-6 sm:p-8 space-y-8 text-sm leading-relaxed shadow-[0_4px_20px_rgba(20,22,26,0.06)]">
            
            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">1. 7-Day Replacement Guarantee</h2>
              <p>
                At <strong className="text-[#14161a]">{COMPANY.brand}</strong>, we pride ourselves on delivering rugged, high-performance illumination equipment. Every piece undergoes functional checks before dispatch. If you receive a product that is defective on arrival, damaged in transit, or missing parts, we provide a <strong className="text-[#14161a]">7-Day Replacement Guarantee</strong> starting from the date of confirmed delivery.
              </p>
            </section>

            {/* WhatsApp Process Card */}
            <section className="rounded-xl border border-[#e6e6e1] bg-[#f4f4f1] p-5">
              <h3 className="font-['Outfit'] font-bold text-[#14161a] mb-2 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[var(--accent)]" /> Hassle-Free Returns via WhatsApp
              </h3>
              <p className="text-xs sm:text-sm text-[#4a5058] mb-3">
                Because your order was confirmed over WhatsApp, raising a return or replacement request is instantaneous. Simply contact us on WhatsApp with:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-[#4a5058] pl-2">
                <li>Your Name &amp; Phone Number used during ordering.</li>
                <li>A clear photo or short video showing the issue (e.g. charging port, switch failure, or transit crack).</li>
                <li>A photo of the original product packaging and retail box.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">2. Eligibility Conditions for Return / Replacement</h2>
              <p className="mb-2">To be eligible for an exchange or replacement:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-[#4a5058]">
                <li>The item must be reported within <strong className="text-[#14161a]">7 days</strong> of delivery.</li>
                <li>The item must include its original retail box, internal protective inserts, charging cable, and included battery accessories.</li>
                <li>The item must not show signs of intentional abuse, cosmetic wear from rough external mishandling, unauthorized opening, or soldering.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">3. Refund Policy (When Replacement is Unavailable)</h2>
              <p className="mb-3">
                Our primary goal is to ensure you have a working, dependable torch through prompt free replacement. However, if an exact replacement or suitable alternative model is unavailable:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-[#4a5058]">
                <li>A full refund of the product purchase amount will be approved.</li>
                <li>Refunds are processed back to your original payment method, UPI ID, or bank account via NEFT within <strong className="text-[#14161a]">5 to 7 business days</strong> of receipt and inspection of the returned unit at our Coimbatore facility.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">4. 1-Year Limited Hardware Warranty</h2>
              <p className="mb-3">
                Beyond the 7-day initial replacement window, our torches (including Eagle 3.1, Everest LED, Tiger Pro-1, and Sniper X2) are backed by a <strong className="text-[#14161a]">1-Year Limited Manufacturer Warranty</strong> against internal LED chip failure, switch malfunction, and internal charging board defects.
              </p>
              <p className="text-xs text-[#4a5058] bg-[#f4f4f1] p-3 rounded-lg border border-[#e6e6e1]">
                <strong className="text-[#14161a]">Warranty Exclusions:</strong> Water damage caused by submerging non-waterproof models, physical breakage from high drops, battery aging due to long-term storage without recharging, or unauthorized modification/repairs.
              </p>
            </section>

            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-3">5. Need Help with a Return?</h2>
              <p className="mb-4">
                Reach out to our customer care team and we will assist you directly:
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-4 py-2.5 text-xs font-semibold text-white transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 text-white" /> WhatsApp Support: {COMPANY.phone}
                </a>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#e6e6e1] bg-white px-4 py-2.5 text-xs font-semibold text-[#14161a] hover:bg-[#f4f4f1] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[var(--accent)]" /> Email: {COMPANY.email}
                </a>
              </div>
            </section>

          </div>
        </div>
      </main>
    </>
  );
}
