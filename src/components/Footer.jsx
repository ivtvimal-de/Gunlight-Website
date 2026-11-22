import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Truck,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { WHATSAPP_URL, COMPANY } from "../config";

export default function Footer() {
  return (
    <footer className="bg-[#14161A] text-[#94A3B8] border-t border-[#232730] font-['Inter'] relative">
      
      {/* ── Main 4-Column Navigation ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Column 1: Brand and Contact */}
          <div className="space-y-4">
            <Link to="/" className="inline-block" aria-label="GunLite Home">
              <picture>
                <source srcSet="/images/logo.webp" type="image/webp" />
                <img
                  src="/images/logo.png"
                  alt="GunLite Logo"
                  width={130}
                  height={36}
                  loading="lazy"
                  className="h-9 w-auto object-contain brightness-110"
                />
              </picture>
            </Link>

            <p className="text-xs text-[#8B97A8] leading-relaxed">
              Operated by <strong>{COMPANY.name}</strong>, Coimbatore. Designing and supplying
              professional high-power rechargeable LED torches and search lights across India.
            </p>

            <div className="pt-2 space-y-2.5 text-xs text-[#8B97A8]">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                <span className="leading-snug">
                  {COMPANY.address}
                </span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[var(--accent)] shrink-0" />
                <span className="text-[#F8FAFC] font-semibold">{COMPANY.phone}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[var(--accent)] shrink-0" />
                <span className="break-all">{COMPANY.email}</span>
              </p>
              <p className="flex items-center gap-2.5 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-[var(--accent)] shrink-0" />
                <span>GSTIN: <strong className="text-[#F8FAFC] font-mono">{COMPANY.gst}</strong></span>
              </p>
            </div>
          </div>

          {/* Column 2: Shop Links */}
          <div>
            <h4 className="font-['Outfit'] text-sm font-bold uppercase tracking-wider text-[#F8FAFC] mb-4">
              Shop Illumination
            </h4>
            <ul className="space-y-2.5 text-xs text-[#94A3B8]">
              <li>
                <Link to="/eagle" className="hover:text-[var(--accent)] transition-colors flex items-center justify-between">
                  <span>Eagle 3.1 GunLite</span>
                  <span className="text-[10px] text-[#8B97A8] font-mono">50W Search Light</span>
                </Link>
              </li>
              <li>
                <Link to="/everest" className="hover:text-[var(--accent)] transition-colors flex items-center justify-between">
                  <span>Everest LED GunLite</span>
                  <span className="text-[10px] text-[#8B97A8] font-mono">55W • 10,000mAh</span>
                </Link>
              </li>
              <li>
                <Link to="/tiger" className="hover:text-[var(--accent)] transition-colors flex items-center justify-between">
                  <span>Tiger Pro-1 GunLite</span>
                  <span className="text-[10px] text-[#8B97A8] font-mono">500 LM Patrol</span>
                </Link>
              </li>
              <li>
                <Link to="/sniper" className="hover:text-[var(--accent)] transition-colors flex items-center justify-between">
                  <span>Sniper X2 GunLite</span>
                  <span className="text-[10px] text-[#8B97A8] font-mono">1000 LM Zoom</span>
                </Link>
              </li>
              <li className="pt-2 border-t border-[#232730]">
                <Link to="/shop" className="text-[var(--accent)] hover:underline font-semibold transition-colors flex items-center gap-1">
                  <span>Browse All Torches</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Support */}
          <div>
            <h4 className="font-['Outfit'] text-sm font-bold uppercase tracking-wider text-[#F8FAFC] mb-4">
              Company &amp; Service
            </h4>
            <ul className="space-y-2.5 text-xs text-[#94A3B8]">
              <li>
                <Link to="/about" className="hover:text-[var(--accent)] transition-colors">
                  About GunLite &amp; Engineering
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[var(--accent)] transition-colors">
                  Dealership &amp; Bulk Enquiries
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[var(--accent)] transition-colors">
                  Direct Support Desk
                </Link>
              </li>
              <li className="pt-2 border-t border-[#232730] text-[11px] text-[#8B97A8]">
                Operating Hours:
                <p className="text-[#F8FAFC] font-medium mt-0.5">
                  {COMPANY.operatingHours || "Mon – Sat: 9:30 AM – 7:30 PM IST"}
                </p>
              </li>
            </ul>

            {/* Social / Direct Connect */}
            <div className="mt-5">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-4 py-2.5 text-xs font-semibold text-white transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>WhatsApp Order Desk</span>
              </a>
            </div>
          </div>

          {/* Column 4: Policies & Regulatory */}
          <div>
            <h4 className="font-['Outfit'] text-sm font-bold uppercase tracking-wider text-[#F8FAFC] mb-4">
              Policies &amp; Compliance
            </h4>
            <ul className="space-y-2.5 text-xs text-[#94A3B8]">
              <li>
                <Link to="/privacy" className="hover:text-[var(--accent)] transition-colors">
                  Privacy &amp; Data Protection Policy
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-[var(--accent)] transition-colors">
                  Shipping &amp; Transit Guidelines
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-[var(--accent)] transition-colors">
                  7-Day Return &amp; 1-Year Warranty
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[var(--accent)] transition-colors">
                  Terms &amp; Optical Safety Guidelines
                </Link>
              </li>
            </ul>

            <div className="mt-5 rounded-xl border border-[#232730] bg-[#1A1D24] p-3 text-[11px] text-[#8B97A8]">
              <p className="font-semibold text-[#F8FAFC] flex items-center gap-1.5 mb-1">
                <Truck className="w-3.5 h-3.5 text-[var(--accent)]" />
                Pan-India Transit
              </p>
              <p className="leading-snug">
                Insulated battery packaging via DTDC, Professional Couriers &amp; Speed Post.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-[#232730] bg-[#0D0F12] py-6 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-[#8B97A8]">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} {COMPANY.name}. All rights reserved. Brand: <strong>{COMPANY.brand}</strong>.
          </p>
          <p className="text-center sm:text-right">
            Developed by <span className="font-semibold text-[#F8FAFC]">Devozzz</span>
          </p>
        </div>
      </div>

    </footer>
  );
}
