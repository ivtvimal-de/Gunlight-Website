import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
} from "lucide-react";
import { WHATSAPP_URL, COMPANY } from "../config";
import { useCatalog } from "../context/CatalogContext";
import { useTranslation } from "../i18n/LanguageContext";
import { getLocalizedProductTitle } from "../i18n/catalogI18n";

export default function Footer() {
  const { products } = useCatalog();
  const { language, t } = useTranslation();
  const shopLinks = products.slice(0, 5);

  return (
    <footer className="bg-[#14161A] text-[#94A3B8] border-t border-[#232730] font-['Inter'] relative">
      
      {/* ── Main Navigation Grid ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Brand */}
          <div className="col-span-2 lg:col-span-1 space-y-3">
            <Link to="/" className="inline-block" aria-label={t("nav.homeAria")}>
              <picture>
                <source srcSet="/images/logo.webp" type="image/webp" />
                <img
                  src="/images/logo.png"
                  alt="GunLite Logo"
                  width={115}
                  height={32}
                  loading="lazy"
                  className="h-8 w-auto object-contain brightness-110"
                />
              </picture>
            </Link>
            <p className="text-[13px] text-[#8B97A8] leading-relaxed max-w-[280px]">
              {t("footer.description")}
            </p>
          </div>

          {/* Column 2: Shop */}
          <div className="col-span-1">
            <h4 className="font-['Outfit'] text-[13px] font-bold uppercase tracking-wider text-[#F8FAFC] mb-3">
              {t("footer.shopHeading")}
            </h4>
            <ul className="space-y-2 text-[14px] leading-[1.4] text-[#94A3B8]">
              {shopLinks.map((item) => (
                <li key={item.id}>
                  <Link to={item.link} className="hover:text-[var(--accent)] transition-colors">
                    {getLocalizedProductTitle(item, language, { stripGunlite: true })}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company & Policies */}
          <div className="col-span-1">
            <h4 className="font-['Outfit'] text-[13px] font-bold uppercase tracking-wider text-[#F8FAFC] mb-3">
              {t("footer.companyHeading")}
            </h4>
            <ul className="space-y-2 text-[14px] leading-[1.4] text-[#94A3B8]">
              <li>
                <Link to="/about" className="hover:text-[var(--accent)] transition-colors">
                  {t("footer.about")}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[var(--accent)] transition-colors">
                  {t("footer.dealership")}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[var(--accent)] transition-colors">
                  {t("footer.support")}
                </Link>
              </li>
            </ul>
            <div className="pt-2.5 mt-2.5 border-t border-[#232730] flex flex-wrap gap-x-2 gap-y-1 text-[12px] text-[#8B97A8]">
              <Link to="/privacy" className="hover:text-[var(--accent)] transition-colors">
                {t("footer.privacy")}
              </Link>
              <span>·</span>
              <Link to="/shipping" className="hover:text-[var(--accent)] transition-colors">
                {t("footer.shipping")}
              </Link>
              <span>·</span>
              <Link to="/returns" className="hover:text-[var(--accent)] transition-colors">
                {t("footer.returnsWarranty")}
              </Link>
              <span>·</span>
              <Link to="/terms" className="hover:text-[var(--accent)] transition-colors">
                {t("footer.terms")}
              </Link>
            </div>
          </div>

          {/* Column 4: Contact */}
          <div className="col-span-2 lg:col-span-1 space-y-2.5 text-[13px] text-[#8B97A8]">
            <h4 className="font-['Outfit'] text-[13px] font-bold uppercase tracking-wider text-[#F8FAFC] mb-3">
              {t("footer.contactHeading")}
            </h4>
            <a
              href={`tel:${COMPANY.phone.replace(/\s+/g, "")}`}
              className="flex items-center gap-2 text-[#F8FAFC] font-semibold hover:text-[var(--accent)] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
              <span>{COMPANY.phone}</span>
            </a>
            <a
              href={`mailto:${COMPANY.email}`}
              className="flex items-center gap-2 text-[#8B97A8] hover:text-[#F8FAFC] transition-colors break-all"
            >
              <Mail className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
              <span>{COMPANY.email}</span>
            </a>
            <p className="flex items-start gap-2 leading-snug">
              <MapPin className="w-3.5 h-3.5 text-[var(--accent)] shrink-0 mt-0.5" />
              <span>
                {t("footer.addressLine1")}
                <br />
                {t("footer.addressLine2")}
              </span>
            </p>
            <p className="flex items-center gap-2 text-[12px] text-[#8B97A8]">
              <Clock className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
              <span>{t("footer.hours")}</span>
            </p>
            <div className="pt-1">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-3.5 h-[36px] text-xs font-semibold text-white transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>{t("footer.whatsappDesk")}</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-[#232730] bg-[#0D0F12] py-3 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2 text-[13px] text-[#8B97A8]">
          <p className="text-center sm:text-left">
            {t("footer.copyright", { year: new Date().getFullYear(), company: COMPANY.name })} · {t("footer.gstinLabel")}{" "}
            <span className="font-mono text-[#CBD5E1]">{COMPANY.gst}</span>
          </p>
          <p className="text-center sm:text-right">
            {t("footer.developedBy")} <span className="font-semibold text-[#F8FAFC]">Devozzz</span>
          </p>
        </div>
      </div>

    </footer>
  );
}
