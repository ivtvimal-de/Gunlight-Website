import React from "react";
import { Link } from "react-router-dom";
import { Scale } from "lucide-react";
import { COMPANY, WHATSAPP_URL } from "../config";
import SEO from "../components/SEO";

export default function TermsConditions() {
  return (
    <>
      <SEO
        title="Terms & Conditions | Lawful Use & Optical Safety"
        description="GunLite Terms and Conditions: Lawful civilian illumination usage, optical beam safety warnings, order confirmation via WhatsApp, and governing jurisdiction."
        path="/terms"
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
            <span className="text-[#6b727c]">Terms &amp; Conditions</span>
          </div>

          {/* Header */}
          <header className="mb-8">
            <h1 className="font-['Outfit'] text-3xl sm:text-4xl font-bold text-[#14161a] mb-3 tracking-tight">
              Terms &amp; Conditions
            </h1>
            <p className="text-xs sm:text-sm text-[#6b727c]">
              Terms of Service, Lawful Use &amp; Regulatory Compliance | {COMPANY.name}
            </p>
          </header>

          {/* Quick Policy Nav */}
          <div className="mb-8 flex flex-wrap gap-2 border-b border-[#e6e6e1] pb-4 text-xs font-medium">
            <Link to="/privacy" className="rounded-lg border border-[#e6e6e1] bg-white px-3 py-1.5 text-[#6b727c] hover:text-[#14161a] hover:border-[#cfcfc8] transition-colors">Privacy Policy</Link>
            <Link to="/shipping" className="rounded-lg border border-[#e6e6e1] bg-white px-3 py-1.5 text-[#6b727c] hover:text-[#14161a] hover:border-[#cfcfc8] transition-colors">Shipping Policy</Link>
            <Link to="/returns" className="rounded-lg border border-[#e6e6e1] bg-white px-3 py-1.5 text-[#6b727c] hover:text-[#14161a] hover:border-[#cfcfc8] transition-colors">Return &amp; Refund</Link>
            <Link to="/terms" className="rounded-lg bg-[var(--accent)] text-white font-semibold px-3 py-1.5 shadow-xs">Terms &amp; Conditions</Link>
          </div>

          {/* Content Body */}
          <div className="rounded-2xl border border-[#e6e6e1] bg-white p-6 sm:p-8 space-y-8 text-sm leading-relaxed shadow-[0_4px_20px_rgba(20,22,26,0.06)]">
            
            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">1. Agreement to Terms</h2>
              <p>
                These Terms and Conditions (&ldquo;Terms&rdquo;) govern your use of the website operated by <strong className="text-[#14161a]">{COMPANY.name}</strong> under the brand name <strong className="text-[#14161a]">{COMPANY.brand}</strong>, having its principal place of business at {COMPANY.address}. By accessing our website, browsing our product catalogue, or submitting an order enquiry, you agree to be bound by these Terms and all applicable laws and regulations of India.
              </p>
            </section>

            {/* Section: Product Usage & Compliance with Local Laws */}
            <section className="rounded-xl border border-[#e6e6e1] bg-[#f4f4f1] p-5 sm:p-6 text-[#4a5058]">
              <h2 className="font-['Outfit'] text-base sm:text-lg font-bold text-[var(--accent)] mb-3 flex items-center gap-2">
                <Scale className="w-5 h-5 text-[var(--accent)]" /> 2. Product Usage &amp; Compliance with Local Laws
              </h2>
              <div className="space-y-3 text-xs sm:text-sm text-[#4a5058] leading-relaxed">
                <p>
                  <strong className="text-[#14161a]">Nature of Products:</strong> Products offered under the brand name &ldquo;{COMPANY.brand}&rdquo; are portable, high-power LED flashlights, rechargeable search lights, and optical illumination equipment designed for domestic, agricultural, outdoor expedition, emergency, industrial, and search-and-rescue lighting.
                </p>
                <p>
                  <strong className="text-[#14161a]">Lawful Civilian Use:</strong> All products are sold strictly for lawful civilian and commercial illumination purposes. Our products are not firearms, weapons, or lethal munitions. Customers are solely responsible for ensuring that their purchase and application comply with all applicable local, municipal, state, and central regulations.
                </p>
                <p>
                  <strong className="text-[#14161a]">Optical Safety Warnings:</strong> High-power LED chips (such as 50W–55W emitters and 1000-lumen CREE LEDs) produce intense, concentrated photonic beams:
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-3 text-[#4a5058]">
                  <li>Never point the beam directly into human or animal eyes; doing so can cause temporary flash blindness or optical damage.</li>
                  <li>Do not shine high-intensity beams towards moving vehicles, train operators, ships, or aircraft.</li>
                  <li>Keep out of reach of unsupervised small children.</li>
                </ul>
                <p className="text-xs text-[#6b727c] italic">
                  {COMPANY.name} expressly disclaims all liability for any personal injury, property damage, or legal penalty arising from improper, negligent, or unlawful use of illumination devices.
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">3. Order Placement &amp; WhatsApp Confirmation</h2>
              <p className="mb-3">
                To provide personalized assistance and ensure correct model selection:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-[#4a5058]">
                <li>Our online catalogue and shopping cart allow you to compile products and dispatch order enquiries directly via <strong className="text-[#14161a]">WhatsApp</strong>.</li>
                <li>A binding contract of sale is formed only after order details, delivery address, shipping costs, and final payment terms are confirmed with our representative on WhatsApp.</li>
                <li>We reserve the right to decline or cancel enquiries in case of typographical pricing errors, stock unavailability, or unserviceable courier pincodes.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">4. Pricing, Payments &amp; Taxes</h2>
              <p>
                All prices listed on the site or quoted via WhatsApp are in Indian Rupees (INR) and are inclusive of applicable GST (GSTIN: {COMPANY.gst}) unless specifically noted for wholesale/B2B transport quotes. Payment options (UPI, GPay, PhonePe, Bank Transfer, or Cash on Delivery where supported) are confirmed prior to dispatch.
              </p>
            </section>

            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">5. Intellectual Property</h2>
              <p>
                All content on this website—including product photographs, technical descriptions, logos, graphics, and page layout—is the property of {COMPANY.name} and {COMPANY.brand}, and is protected by Indian copyright and intellectual property laws. Unauthorized reproduction or mirroring is strictly prohibited.
              </p>
            </section>

            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">6. Governing Law &amp; Jurisdiction</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with the purchase of products or use of this website shall be subject to the exclusive jurisdiction of the competent courts in <strong className="text-[#14161a]">Coimbatore, Tamil Nadu, India</strong>.
              </p>
            </section>

            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">7. Contact Information</h2>
              <p className="mb-3">
                For any clarification or legal enquiries regarding these Terms, please contact us:
              </p>
              <div className="rounded-xl border border-[#e6e6e1] bg-[#f4f4f1] p-4 text-xs sm:text-sm space-y-1 font-mono">
                <p><strong className="text-[#14161a]">Entity:</strong> {COMPANY.name}</p>
                <p><strong className="text-[#14161a]">Brand:</strong> {COMPANY.brand}</p>
                <p><strong className="text-[#14161a]">Location:</strong> {COMPANY.address}</p>
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
