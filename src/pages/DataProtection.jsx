import React from "react";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { COMPANY, WHATSAPP_URL } from "../config";
import SEO from "../components/SEO";

export default function DataProtection() {
  return (
    <>
      <SEO
        title="Privacy Policy | Data Protection & IT Act Compliance"
        description="GunLite Privacy Policy: Data collection, order fulfillment, WhatsApp communication protocols, and user data protection under the Information Technology Act 2000."
        path="/privacy"
        type="website"
      />
      <main className="min-h-screen bg-[#fafaf8] py-8 sm:py-12 pb-20 text-[#4a5058]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb / Top Tag */}
          <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
            <Link to="/" className="hover:text-[#14161a] transition-colors">Home</Link>
            <span className="text-[#cfcfc8]">/</span>
            <span>Legal</span>
            <span className="text-[#cfcfc8]">/</span>
            <span className="text-[#6b727c]">Privacy Policy</span>
          </div>

          {/* Header */}
          <header className="mb-8">
            <h1 className="font-['Outfit'] text-3xl sm:text-4xl font-bold text-[#14161a] mb-3 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-[#6b727c]">
              Last Updated: November 2026 | Compliant with the Information Technology Act, 2000 (India)
            </p>
          </header>

          {/* Quick Policy Nav */}
          <div className="mb-8 flex flex-wrap gap-2 border-b border-[#e6e6e1] pb-4 text-xs font-medium">
            <Link to="/privacy" className="rounded-lg bg-[var(--accent)] text-white font-semibold px-3 py-1.5 shadow-xs">Privacy Policy</Link>
            <Link to="/shipping" className="rounded-lg border border-[#e6e6e1] bg-white px-3 py-1.5 text-[#6b727c] hover:text-[#14161a] hover:border-[#cfcfc8] transition-colors">Shipping Policy</Link>
            <Link to="/returns" className="rounded-lg border border-[#e6e6e1] bg-white px-3 py-1.5 text-[#6b727c] hover:text-[#14161a] hover:border-[#cfcfc8] transition-colors">Return &amp; Refund</Link>
            <Link to="/terms" className="rounded-lg border border-[#e6e6e1] bg-white px-3 py-1.5 text-[#6b727c] hover:text-[#14161a] hover:border-[#cfcfc8] transition-colors">Terms &amp; Conditions</Link>
          </div>

          {/* Content Body */}
          <div className="rounded-2xl border border-[#e6e6e1] bg-white p-6 sm:p-8 space-y-8 text-sm leading-relaxed shadow-[0_4px_20px_rgba(20,22,26,0.06)]">
            
            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">1. Introduction</h2>
              <p>
                Welcome to <strong className="text-[#14161a]">{COMPANY.brand}</strong>, operated by <strong className="text-[#14161a]">{COMPANY.name}</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), located at {COMPANY.address}. We respect your privacy and are committed to protecting any personal data collected when you browse our website, explore our catalogue, or place product enquiries.
              </p>
            </section>

            {/* Highlight Notice */}
            <section className="rounded-xl border border-[#e6e6e1] bg-[#f4f4f1] p-4 sm:p-5 text-[#4a5058]">
              <h3 className="font-['Outfit'] font-bold text-[#14161a] mb-1.5 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[var(--accent)]" /> Order Confirmation via WhatsApp
              </h3>
              <p className="text-xs sm:text-sm text-[#4a5058] leading-relaxed">
                When you click &ldquo;Order on WhatsApp&rdquo; or submit an enquiry, you voluntarily transfer communication to WhatsApp (Meta Platforms, Inc.). Any chat conversation, address shared for dispatch, or payment confirmation exchanged over WhatsApp is governed by WhatsApp&rsquo;s end-to-end encryption protocols and privacy policy.
              </p>
            </section>

            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">2. Information We Collect</h2>
              <p className="mb-2">We collect only information necessary to respond to your queries and deliver physical goods:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-[#4a5058]">
                <li><strong className="text-[#14161a]">Contact Information:</strong> Your name, phone number, and delivery address provided directly by you.</li>
                <li><strong className="text-[#14161a]">Order Details:</strong> Product models, quantities, and transaction details required for invoicing and shipping.</li>
                <li><strong className="text-[#14161a]">Technical Analytics:</strong> Basic anonymous site usage metrics via standard browser logs. We do not sell your personal data.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">3. Purpose and Legal Basis of Processing</h2>
              <p className="mb-2">Your information is processed in compliance with the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, for:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-[#4a5058]">
                <li>Confirming stock, finalizing prices, and coordinating parcel dispatch.</li>
                <li>Generating tax invoices compliant with Indian GST laws.</li>
                <li>Providing after-sales support and warranty service for GunLite products.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">4. Third-Party Disclosures</h2>
              <p>
                We do not sell, rent, or trade your personal data. We share shipping addresses strictly with verified courier partners (e.g., India Post, DTDC, Professional Couriers, Delhivery) solely for parcel delivery.
              </p>
            </section>

            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">5. Data Retention &amp; Security</h2>
              <p>
                We maintain appropriate administrative and technical safeguards to protect your personal data from unauthorized access, alteration, or disclosure. Invoicing records are retained as required by Indian tax statutes.
              </p>
            </section>

            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">6. Grievance Officer &amp; Contact</h2>
              <p className="mb-3">
                In accordance with the Information Technology Act 2000 and the Rules made thereunder:
              </p>
              <div className="rounded-xl border border-[#e6e6e1] bg-[#f4f4f1] p-4 text-xs sm:text-sm space-y-1">
                <p><strong className="text-[#14161a]">Grievance Desk:</strong> Jerone Enterprises</p>
                <p><strong className="text-[#14161a]">Address:</strong> {COMPANY.address}</p>
                <p><strong className="text-[#14161a]">Phone:</strong> {COMPANY.phone}</p>
                <p><strong className="text-[#14161a]">Email:</strong> {COMPANY.email}</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
