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
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-20 pb-20 text-slate-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb / Top Tag */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
          <Link to="/" className="hover:text-cyan-300 transition">Home</Link>
          <span>/</span>
          <span>Legal</span>
          <span>/</span>
          <span className="text-slate-400">Privacy Policy</span>
        </div>

        {/* Header */}
        <header className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-400">
            Last Updated: November 2026 | Compliant with the Information Technology Act, 2000 (India)
          </p>
        </header>

        {/* Quick Policy Nav */}
        <div className="mb-10 flex flex-wrap gap-2 border-b border-slate-800 pb-4 text-xs sm:text-sm font-medium">
          <Link to="/privacy" className="rounded-lg bg-blue-600/30 border border-blue-500/50 px-3.5 py-1.5 text-white">Privacy Policy</Link>
          <Link to="/shipping" className="rounded-lg border border-slate-800 bg-slate-900/50 px-3.5 py-1.5 text-slate-400 hover:text-white hover:border-slate-700 transition">Shipping Policy</Link>
          <Link to="/returns" className="rounded-lg border border-slate-800 bg-slate-900/50 px-3.5 py-1.5 text-slate-400 hover:text-white hover:border-slate-700 transition">Return & Refund</Link>
          <Link to="/terms" className="rounded-lg border border-slate-800 bg-slate-900/50 px-3.5 py-1.5 text-slate-400 hover:text-white hover:border-slate-700 transition">Terms & Conditions</Link>
        </div>

        {/* Content Body */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-10 shadow-2xl backdrop-blur-md space-y-8 text-sm sm:text-base leading-relaxed">
          
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Introduction</h2>
            <p>
              Welcome to <strong>{COMPANY.brand}</strong>, operated by <strong>{COMPANY.name}</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), located at {COMPANY.address}. We respect your privacy and are committed to protecting any personal data collected when you browse our website, explore our catalogue, or place product enquiries.
            </p>
          </section>

          {/* Highlight Notice */}
          <section className="rounded-xl border border-blue-500/30 bg-blue-950/40 p-4 sm:p-5 text-blue-200">
            <h3 className="font-semibold text-white mb-1.5 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-[#00e5ff]" /> Order Confirmation via WhatsApp
            </h3>
            <p className="text-sm text-blue-200/90 leading-normal">
              Please note that order details, pricing quotes, and delivery confirmations on this website are facilitated and verified directly via <strong>WhatsApp</strong>. When you communicate with us through WhatsApp, relevant details (such as your name, contact number, and delivery address) are used strictly to finalize and deliver your order.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Information We Collect</h2>
            <p className="mb-2">We collect only necessary information to serve you effectively:</p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-slate-300">
              <li><strong>Contact Information:</strong> Name, phone number, delivery address, and email address provided during enquiry or order placement.</li>
              <li><strong>WhatsApp Communications:</strong> Order specifications, model preferences, and delivery instructions shared in WhatsApp chats.</li>
              <li><strong>Technical Browsing Data:</strong> Standard server logs, browser type, and anonymous analytics to maintain website security and user experience.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 pl-2 text-slate-300">
              <li>To confirm, process, package, and deliver your torch and searchlight orders across India.</li>
              <li>To share dispatch updates, courier tracking numbers, and delivery ETAs via WhatsApp or SMS.</li>
              <li>To provide customer support, warranty assistance, and post-purchase guidance.</li>
              <li>To comply with statutory legal and tax obligations under applicable Indian laws (including GST documentation).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Data Protection & No-Sale Policy</h2>
            <p>
              We <strong>do not sell, rent, trade, or monetize</strong> your personal contact information to any third parties for advertising or telemarketing purposes. Your data is shared solely with trusted logistics/courier partners (e.g., Delhivery, India Post, DTDC) strictly for delivery fulfilment.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Product Usage & Safety Compliance</h2>
            <p>
              Our products are high-power LED searchlights and portable illumination torches. In compliance with safety advisories, we do not intentionally collect data from or market products directly to minors without parental consent. Customers are encouraged to read operating instructions carefully to ensure safe handling of high-lumen optical equipment.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Cookies and Local Storage</h2>
            <p>
              Our website uses lightweight browser local storage to preserve your cart items between browsing sessions. You can clear your browser storage at any time without impacting your ability to view products.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Grievance Officer & Contact Details</h2>
            <p className="mb-3">
              In accordance with the Information Technology Act, 2000 and rules made thereunder, for questions or concerns regarding this policy, please reach out to our team:
            </p>
            <div className="rounded-lg bg-slate-950 p-4 border border-slate-800 text-sm space-y-1.5 font-mono">
              <p><strong>Business Name:</strong> {COMPANY.name}</p>
              <p><strong>Brand:</strong> {COMPANY.brand}</p>
              <p><strong>Address:</strong> {COMPANY.address}</p>
              <p><strong>Email:</strong> {COMPANY.email}</p>
              <p><strong>Phone:</strong> {COMPANY.phone}</p>
              <p><strong>GSTIN:</strong> {COMPANY.gst}</p>
            </div>
            <div className="mt-4">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 transition"
              >
                <MessageCircle className="w-4 h-4 text-white" /> Chat on WhatsApp
              </a>
            </div>
          </section>

        </div>
      </div>
    </main>
    </>
  );
}

