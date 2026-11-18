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
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-20 pb-20 text-slate-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
          <Link to="/" className="hover:text-cyan-300 transition">Home</Link>
          <span>/</span>
          <span>Legal</span>
          <span>/</span>
          <span className="text-slate-400">Shipping Policy</span>
        </div>

        {/* Header */}
        <header className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3">
            Shipping &amp; Delivery Policy
          </h1>
          <p className="text-sm text-slate-400">
            Pan-India Delivery | Secure Packaging for Rechargeable Illumination Hardware
          </p>
        </header>

        {/* Quick Policy Nav */}
        <div className="mb-10 flex flex-wrap gap-2 border-b border-slate-800 pb-4 text-xs sm:text-sm font-medium">
          <Link to="/privacy" className="rounded-lg border border-slate-800 bg-slate-900/50 px-3.5 py-1.5 text-slate-400 hover:text-white hover:border-slate-700 transition">Privacy Policy</Link>
          <Link to="/shipping" className="rounded-lg bg-blue-600/30 border border-blue-500/50 px-3.5 py-1.5 text-white">Shipping Policy</Link>
          <Link to="/returns" className="rounded-lg border border-slate-800 bg-slate-900/50 px-3.5 py-1.5 text-slate-400 hover:text-white hover:border-slate-700 transition">Return & Refund</Link>
          <Link to="/terms" className="rounded-lg border border-slate-800 bg-slate-900/50 px-3.5 py-1.5 text-slate-400 hover:text-white hover:border-slate-700 transition">Terms & Conditions</Link>
        </div>

        {/* Content Body */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-10 shadow-2xl backdrop-blur-md space-y-8 text-sm sm:text-base leading-relaxed">
          
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Order Confirmation via WhatsApp</h2>
            <p className="mb-3">
              All orders submitted through the {COMPANY.brand} website are verified and finalized over <strong>WhatsApp</strong> before shipment. Once you submit an order or enquiry from our cart or product pages:
            </p>
            <ol className="list-decimal list-inside space-y-2 pl-2 text-slate-300">
              <li>Our team contacts you on WhatsApp to confirm stock availability, order quantity, and recipient address details.</li>
              <li>Final invoice details, payment methods, and shipping rates are communicated clearly.</li>
              <li>Upon your final approval and payment, your order moves immediately into order processing and dispatch.</li>
            </ol>
          </section>

          {/* Timelines Callout */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
              <h3 className="text-base font-bold text-cyan-400 mb-1 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#00e5ff]" /> Processing Time
              </h3>
              <p className="text-sm text-slate-400">
                Orders are thoroughly quality-tested, battery-checked, and packaged within <strong>24 to 48 business hours</strong> of WhatsApp confirmation.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
              <h3 className="text-base font-bold text-cyan-400 mb-1 flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#00e5ff]" /> Transit Timelines
              </h3>
              <p className="text-sm text-slate-400">
                • Tamil Nadu &amp; South India: <strong>2 – 4 Business Days</strong><br />
                • Rest of India &amp; Metro Areas: <strong>4 – 7 Business Days</strong>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Shipping Charges &amp; Carriers</h2>
            <p className="mb-3">
              We partner with India&rsquo;s leading surface and express courier providers including <strong>DTDC, Professional Couriers, Delhivery, and India Post Speed Post</strong>.
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-slate-300">
              <li><strong>Standard Delivery Charges:</strong> Calculated based on destination pincode and package gross weight, quoted upfront over WhatsApp.</li>
              <li><strong>Bulk &amp; Wholesale Shipments:</strong> Dedicated surface transport / transport cargo options arranged directly with commercial volume buyers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Tracking Your Consignment</h2>
            <p>
              Once your package is handed over to our courier partner, we send you the <strong>Courier Name, Consignment / Docket Number, and Live Tracking Link</strong> directly on your WhatsApp chat. You can monitor your shipment anytime until safe doorstep delivery.
            </p>
          </section>

          <section className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-5 text-amber-200">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" /> Battery Safety &amp; Transport Compliance
            </h3>
            <p className="text-sm text-amber-200/90 leading-relaxed">
              Our searchlights and torches contain rechargeable lithium-ion cells (such as 18650 or high-capacity 4000mAh–10000mAh packs). In compliance with Indian domestic transport regulations and courier safety protocols, all products are packed with terminal insulation and shock-absorbent multi-layer cushioning to guarantee safe surface transit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Delivery Inspection &amp; Damaged Parcels</h2>
            <p className="mb-3">
              We strongly advise customers to inspect the outer packaging before signing the courier receipt:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-slate-300">
              <li>If the parcel appears severely tampered with, crushed, or damaged, please record a quick video or photograph prior to opening.</li>
              <li>Contact our team within <strong>24 hours</strong> on WhatsApp at <strong>{COMPANY.phone}</strong> with the photos or unboxing video so we can promptly arrange a free replacement or resolve the issue with the courier.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Questions or Address Changes?</h2>
            <p className="mb-3">
              Need to modify your delivery address or enquire about shipment status? Reach out to us right away:
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-500 transition"
              >
                <MessageCircle className="w-4 h-4 text-white" /> Track Order via WhatsApp
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition"
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

