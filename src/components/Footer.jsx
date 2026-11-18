import { Link } from "react-router-dom";
import {
  ShieldCheck,
  MessageCircle,
  Truck,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { WHATSAPP_URL, COMPANY, CLAIMS, SPECS } from "../config";

export default function Footer() {
  const trustFeatures = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#00e5ff]" />,
      title: CLAIMS.warranty,
      desc: CLAIMS.warrantyDetail,
    },
    {
      icon: <MessageCircle className="w-5 h-5 text-[#00e5ff]" />,
      title: CLAIMS.orders,
      desc: CLAIMS.ordersDetail,
    },
    {
      icon: <Truck className="w-5 h-5 text-[#00e5ff]" />,
      title: CLAIMS.shipping,
      desc: CLAIMS.shippingDetail,
    },
  ];

  return (
    <footer className="bg-[#020617] text-slate-300 border-t border-white/[0.08] relative overflow-hidden">
      {/* Subtle Ambient Backing Glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-3/4 rounded-full bg-[#00e5ff]/5 blur-[120px]" />

      {/* ── 1. Trust Bar (3 Features with Lucide Cyan Icons) ── */}
      <div className="border-b border-white/[0.06] bg-[#090e1a]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {trustFeatures.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-xl border border-white/[0.05] bg-[#0f172a]/40 p-4 transition-colors hover:border-[#00e5ff]/20"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#00e5ff]/10 border border-[#00e5ff]/20">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-white tracking-wide uppercase">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#8494ab] mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. Four Main Navigation Columns ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Column 1: Brand & Pitch */}
          <div className="space-y-4">
            <Link to="/" className="inline-block" aria-label="GunLite Home">
              <picture>
                <source srcSet="/images/logo.webp" type="image/webp" />
                <img
                  src="/images/logo.png"
                  alt="GunLite Professional Search Lights Brand Logo"
                  width={130}
                  height={36}
                  loading="lazy"
                  className="h-9 w-auto object-contain"
                />
              </picture>
            </Link>

            <p className="text-xs text-[#8494ab] leading-relaxed">
              {CLAIMS.pitch}
            </p>

            {/* Quick Contact & Social Handles */}
            <div className="pt-2 space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#00e5ff] shrink-0" />
                <span className="font-mono text-slate-300">{COMPANY.phone}</span>
              </p>
              <p className="flex items-center gap-2 truncate">
                <Mail className="w-3.5 h-3.5 text-[#00e5ff] shrink-0" />
                <span className="truncate">{COMPANY.email}</span>
              </p>
            </div>

            {/* Direct Action Links with Lucide Cyan Icons */}
            <div className="pt-3 flex items-center gap-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Channel"
                className="h-9 w-9 rounded-lg border border-white/[0.08] bg-[#0f172a] flex items-center justify-center hover:border-[#00e5ff]/50 hover:bg-[#00e5ff]/10 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#00e5ff]" />
              </a>
              <a
                href={`mailto:${COMPANY.email}`}
                aria-label="Send Email"
                className="h-9 w-9 rounded-lg border border-white/[0.08] bg-[#0f172a] flex items-center justify-center hover:border-[#00e5ff]/50 hover:bg-[#00e5ff]/10 transition-colors"
              >
                <Mail className="w-4 h-4 text-[#00e5ff]" />
              </a>
              <Link
                to="/contact"
                aria-label="Contact Location"
                className="h-9 w-9 rounded-lg border border-white/[0.08] bg-[#0f172a] flex items-center justify-center hover:border-[#00e5ff]/50 hover:bg-[#00e5ff]/10 transition-colors"
              >
                <MapPin className="w-4 h-4 text-[#00e5ff]" />
              </Link>
            </div>
          </div>

          {/* Column 2: Shop & Models */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-[#00e5ff]" />
              Torch Collection
            </h4>
            <ul className="space-y-2.5 text-xs text-[#8494ab]">
              <li>
                <Link to="/eagle" className="hover:text-[#00e5ff] transition-colors flex items-center justify-between">
                  <span>Eagle 3.1 ({SPECS.models.eagle.power})</span>
                  <span className="text-[10px] text-[#00e5ff]/80 font-mono">{SPECS.models.eagle.tag}</span>
                </Link>
              </li>
              <li>
                <Link to="/everest" className="hover:text-[#00e5ff] transition-colors flex items-center justify-between">
                  <span>Everest LED ({SPECS.models.everest.power})</span>
                  <span className="text-[10px] text-[#00e5ff]/80 font-mono">{SPECS.models.everest.tag}</span>
                </Link>
              </li>
              <li>
                <Link to="/tiger" className="hover:text-[#00e5ff] transition-colors flex items-center justify-between">
                  <span>Tiger Pro-1 ({SPECS.models.tiger.brightness})</span>
                  <span className="text-[10px] text-[#00e5ff]/80 font-mono">{SPECS.models.tiger.tag}</span>
                </Link>
              </li>
              <li>
                <Link to="/sniper" className="hover:text-[#00e5ff] transition-colors flex items-center justify-between">
                  <span>Sniper X2 ({SPECS.models.sniper.brightness})</span>
                  <span className="text-[10px] text-[#00e5ff]/80 font-mono">{SPECS.models.sniper.tag}</span>
                </Link>
              </li>
              <li className="pt-2 border-t border-white/[0.05]">
                <Link to="/shop" className="text-white hover:text-[#00e5ff] font-semibold transition-colors inline-flex items-center gap-1.5">
                  <span>Browse All Torches</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#00e5ff]" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Wholesale */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-[#00e5ff]" />
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-[#8494ab]">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About GunLite &amp; Factory ({CLAIMS.factory})
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Dealership &amp; Bulk Enquiries
                </Link>
              </li>
              <li className="text-slate-400">
                GSTIN: <span className="font-mono text-slate-300">{CLAIMS.gstin}</span>
              </li>
              <li className="text-slate-400">
                Location: {COMPANY.city}, {COMPANY.state}
              </li>
              <li className="pt-2">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-semibold transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#00e5ff]" />
                  <span>Order Desk on WhatsApp</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Compliance */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-[#00e5ff]" />
              Legal &amp; Policy
            </h4>
            <ul className="space-y-2.5 text-xs text-[#8494ab]">
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy (IT Act 2000)
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-white transition-colors">
                  Shipping &amp; Delivery Policy
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-white transition-colors">
                  7-Day Replacement &amp; Warranty
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms &amp; Optical Safety
                </Link>
              </li>
              <li className="pt-2 text-[11px] text-[#8494ab] border-t border-white/[0.05]">
                Products are intended strictly for lawful civilian, commercial, and outdoor use.
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* ── 3. Quiet Bottom Bar ── */}
      <div className="border-t border-white/[0.06] bg-[#020617] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8494ab]">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} {COMPANY.name}. All rights reserved. GunLite is an illumination brand.
          </p>
          <div className="flex items-center gap-6 text-[11px]">
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <span>•</span>
            <Link to="/shipping" className="hover:text-white transition-colors">Shipping</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
