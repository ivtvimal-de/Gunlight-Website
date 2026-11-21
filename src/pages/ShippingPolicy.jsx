import React from "react";
import { Link } from "react-router-dom";
import { Clock, Truck, AlertTriangle, MessageCircle } from "lucide-react";
import { COMPANY, WHATSAPP_URL } from "../config";
import SEO from "../components/SEO";

export default function ShippingPolicy() {
  return (
    <>
      <SEO
        title="Shipping & Delivery Policy | Pan-India Orders"
        description="GunLite Shipping Policy: 24-48hr processing, 3-7 day delivery across India via DTDC/Delhivery, live WhatsApp tracking updates, and battery transit safety."
        path="/shipping"
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
            <span className="text-[#6b727c]">Shipping Policy</span>
          </div>

          {/* Header */}
          <header className="mb-8">
            <h1 className="font-['Outfit'] text-3xl sm:text-4xl font-bold text-[#14161a] mb-3 tracking-tight">
              Shipping &amp; Delivery Policy
            </h1>
            <p className="text-xs sm:text-sm text-[#6b727c]">
              Pan-India Delivery | Secure Packaging for Rechargeable Illumination Hardware
            </p>
          </header>

          {/* Quick Policy Nav */}
          <div className="mb-8 flex flex-wrap gap-2 border-b border-[#e6e6e1] pb-4 text-xs font-medium">
            <Link to="/privacy" className="rounded-lg border border-[#e6e6e1] bg-white px-3 py-1.5 text-[#6b727c] hover:text-[#14161a] hover:border-[#cfcfc8] transition-colors">Privacy Policy</Link>
            <Link to="/shipping" className="rounded-lg bg-[var(--accent)] text-white font-semibold px-3 py-1.5 shadow-xs">Shipping Policy</Link>
            <Link to="/returns" className="rounded-lg border border-[#e6e6e1] bg-white px-3 py-1.5 text-[#6b727c] hover:text-[#14161a] hover:border-[#cfcfc8] transition-colors">Return &amp; Refund</Link>
            <Link to="/terms" className="rounded-lg border border-[#e6e6e1] bg-white px-3 py-1.5 text-[#6b727c] hover:text-[#14161a] hover:border-[#cfcfc8] transition-colors">Terms &amp; Conditions</Link>
          </div>

          {/* Content Body */}
          <div className="rounded-2xl border border-[#e6e6e1] bg-white p-6 sm:p-8 space-y-8 text-sm leading-relaxed shadow-[0_4px_20px_rgba(20,22,26,0.06)]">
            
            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">1. Order Confirmation via WhatsApp</h2>
              <p className="mb-3">
                All orders submitted through the {COMPANY.brand} website are verified and finalized over <strong>WhatsApp</strong> before shipment. Once you submit an order or enquiry from our cart or product pages:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 pl-2 text-[#4a5058]">
                <li>Our team contacts you on WhatsApp to confirm stock availability, order quantity, and recipient address details.</li>
                <li>Final invoice details, payment methods, and shipping rates are communicated clearly.</li>
                <li>Upon your final approval and payment, your order moves immediately into order processing and dispatch.</li>
              </ol>
            </section>

            {/* Timelines Callout */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-[#e6e6e1] bg-[#f4f4f1] p-5">
                <h3 className="font-['Outfit'] text-sm font-bold text-[var(--accent)] mb-1.5 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[var(--accent)]" /> Processing Time
                </h3>
                <p className="text-xs text-[#4a5058] leading-relaxed">
                  Orders are thoroughly quality-tested, battery-checked, and packaged within <strong className="text-[#14161a]">24 to 48 business hours</strong> of WhatsApp confirmation.
                </p>
              </div>
              <div className="rounded-xl border border-[#e6e6e1] bg-[#f4f4f1] p-5">
                <h3 className="font-['Outfit'] text-sm font-bold text-[var(--accent)] mb-1.5 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[var(--accent)]" /> Transit Timelines
                </h3>
                <p className="text-xs text-[#4a5058] leading-relaxed">
                  • Tamil Nadu &amp; South India: <strong className="text-[#14161a]">2 – 4 Business Days</strong><br />
                  • Rest of India &amp; Metro Areas: <strong className="text-[#14161a]">4 – 7 Business Days</strong>
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">2. Shipping Charges &amp; Carriers</h2>
              <p className="mb-3">
                We partner with India&rsquo;s leading surface and express courier providers including <strong className="text-[#14161a]">DTDC, Professional Couriers, Delhivery, and India Post Speed Post</strong>.
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-[#4a5058]">
                <li><strong className="text-[#14161a]">Standard Delivery Charges:</strong> Calculated based on destination pincode and package gross weight, quoted upfront over WhatsApp.</li>
                <li><strong className="text-[#14161a]">Bulk &amp; Wholesale Shipments:</strong> Dedicated surface transport options arranged directly with commercial volume buyers.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">3. Tracking Your Consignment</h2>
              <p>
                Once your package is handed over to our courier partner, we send you the <strong className="text-[#14161a]">Courier Name, Consignment / Docket Number, and Live Tracking Link</strong> directly on your WhatsApp chat. You can monitor your shipment anytime until safe doorstep delivery.
              </p>
            </section>

            <section className="rounded-xl border border-[#e6e6e1] bg-[#f4f4f1] p-5">
              <h3 className="font-['Outfit'] font-bold text-[#14161a] mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[var(--accent)] shrink-0" /> Battery Safety &amp; Transport Compliance
              </h3>
              <p className="text-xs sm:text-sm text-[#4a5058] leading-relaxed">
                Our searchlights and torches contain rechargeable lithium-ion cells. In compliance with Indian domestic transport regulations and courier safety protocols, all products are packed with terminal insulation and shock-absorbent multi-layer cushioning to guarantee safe surface transit.
              </p>
            </section>

            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-2">4. Delivery Inspection &amp; Damaged Parcels</h2>
              <p className="mb-3">
                We strongly advise customers to inspect the outer packaging before signing the courier receipt:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-[#4a5058]">
                <li>If the parcel appears severely tampered with, crushed, or damaged, please record a quick video or photograph prior to opening.</li>
                <li>Contact our team within <strong className="text-[#14161a]">24 hours</strong> on WhatsApp at <strong className="text-[#14161a]">{COMPANY.phone}</strong> with the photos or unboxing video so we can promptly arrange a free replacement.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-['Outfit'] text-lg font-bold text-[#14161a] mb-3">5. Questions or Address Changes?</h2>
              <p className="mb-4">
                Need to modify your delivery address or enquire about shipment status? Reach out to us right away:
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-4 py-2.5 text-xs font-semibold text-white transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 text-white" /> Track Order via WhatsApp
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#e6e6e1] bg-white px-4 py-2.5 text-xs font-semibold text-[#14161a] hover:bg-[#f4f4f1] transition-colors"
                >
                  Contact Support Desk
                </Link>
              </div>
            </section>

          </div>
        </div>
      </main>
    </>
  );
}
