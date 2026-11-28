import { useState } from "react";
import { Check, MessageCircle, MapPin, Phone, Mail, FileText } from "lucide-react";
import { WHATSAPP_NUMBER, WHATSAPP_URL, COMPANY } from "../config";
import SEO from "../components/SEO";
import { useTranslation } from "../i18n/LanguageContext";

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", phone: "", type: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "contact.validation.nameRequired";
    if (!form.phone.trim()) {
      e.phone = "contact.validation.phoneRequired";
    } else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ""))) {
      e.phone = "contact.validation.phoneInvalid";
    }
    if (!form.message.trim()) e.message = "contact.validation.messageRequired";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "contact.validation.emailInvalid";
    }
    return e;
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});

    const text = [
      `*New Enquiry from GunLite Website*`,
      `Name: ${form.name}`,
      form.email ? `Email: ${form.email}` : null,
      `Phone: ${form.phone}`,
      form.type ? `Type: ${form.type}` : null,
      `Message: ${form.message}`,
    ].filter(Boolean).join("\n");

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
      "_blank",
    );
    setSubmitted(true);
    setForm({ name: "", email: "", phone: "", type: "", message: "" });
  };

  const addressParts = t("contact.addressText").split(/[,،]/);

  return (
    <>
      <SEO
        title={t("seo.contactTitle")}
        description={t("seo.contactDesc")}
        path="/contact"
        type="website"
      />
      <main className="bg-[#fafaf8] text-[#14161a] min-h-screen">
        {/* CONTACT HEADER */}
        <section className="py-14 border-b border-[#e6e6e1] bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="mb-3 inline-block rounded-full border border-[#e6e6e1] bg-[#f4f4f1] px-4 py-1.5 text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
              {t("contact.badge")}
            </span>
            <h1 className="text-3xl md:text-5xl font-['Outfit'] font-bold text-[#14161a] mb-3 tracking-tight">
              {t("contact.heading")}
            </h1>
            <p className="text-sm md:text-base text-[#4a5058] max-w-3xl leading-relaxed">
              {t("contact.subtitle")}
            </p>
          </div>
        </section>

        {/* CONTACT CONTENT */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* LEFT SIDE – COMPANY INFO */}
            <div className="bg-white border border-[#e6e6e1] rounded-3xl p-8 sm:p-10 shadow-[0_4px_20px_rgba(20,22,26,0.06)]">
              <span className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
                {t("contact.authorizedOperator")}
              </span>
              <h2 className="text-2xl sm:text-3xl font-['Outfit'] font-bold text-[#14161a] mb-4 mt-1">
                {COMPANY.name}
              </h2>

              <p className="text-sm text-[#4a5058] leading-relaxed mb-6">
                {t("contact.companyIntro", { company: COMPANY.name })}
              </p>

              <div className="space-y-4 text-sm text-[#4a5058] border-t border-[#e6e6e1] pt-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[var(--accent)] shrink-0 mt-1" />
                  <div>
                    <strong className="text-[#14161a] block mb-0.5">
                      {t("contact.addressLabel")}
                    </strong>
                    {addressParts.map((line, i) => (
                      <span key={i}>
                        {line.trim()}
                        {i < addressParts.length - 1 ? "," : ""}
                        <br />
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[var(--accent)] shrink-0" />
                  <div>
                    <strong className="text-[#14161a]">{t("contact.phoneLabel")} </strong>
                    {COMPANY.phone}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[var(--accent)] shrink-0" />
                  <div>
                    <strong className="text-[#14161a]">{t("contact.emailLabel")} </strong>
                    {COMPANY.email}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-[var(--accent)] shrink-0" />
                  <div>
                    <strong className="text-[#14161a]">{t("contact.gstinLabel")} </strong>
                    {COMPANY.gst}
                  </div>
                </div>
              </div>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center justify-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-6 py-3 rounded-lg text-xs font-semibold transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>{t("contact.whatsappEnquiryBtn")}</span>
              </a>
            </div>

            {/* RIGHT SIDE – ENQUIRY FORM */}
            <div className="rounded-3xl p-8 sm:p-10 border border-[#e6e6e1] bg-white shadow-[0_4px_20px_rgba(20,22,26,0.06)]">
              <h3 className="text-xl sm:text-2xl font-['Outfit'] font-bold text-[#14161a] mb-2">
                {t("contact.formHeading")}
              </h3>
              <p className="text-xs text-[#6b727c] mb-6">
                {t("contact.formSubheading")}
              </p>

              {submitted ? (
                <div className="flex flex-col items-center justify-center gap-4 text-center py-10">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f4f4f1] border border-[#e6e6e1]">
                    <Check className="w-8 h-8 text-[var(--accent)]" />
                  </div>
                  <p className="font-['Outfit'] text-lg font-bold text-[#14161a]">
                    {t("contact.submittedTitle")}
                  </p>
                  <p className="text-sm text-[#6b727c]">
                    {t("contact.submittedDesc")}
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 rounded-lg border border-[#e6e6e1] bg-white px-6 py-2 text-xs font-semibold text-[#14161a] hover:bg-[#f4f4f1] transition-colors"
                  >
                    {t("contact.sendAnother")}
                  </button>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder={t("contact.placeholders.name")}
                      className={`w-full bg-[#f4f4f1] rounded-xl px-4 py-3 text-sm text-[#14161a] placeholder-[#6b727c] border ${
                        errors.name ? "border-red-400" : "border-[#e6e6e1]"
                      } focus:outline-none focus:border-[var(--accent)] focus:bg-white transition-colors`}
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{t(errors.name)}</p>}
                  </div>

                  <div>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder={t("contact.placeholders.email")}
                      className={`w-full bg-[#f4f4f1] rounded-xl px-4 py-3 text-sm text-[#14161a] placeholder-[#6b727c] border ${
                        errors.email ? "border-red-400" : "border-[#e6e6e1]"
                      } focus:outline-none focus:border-[var(--accent)] focus:bg-white transition-colors`}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{t(errors.email)}</p>}
                  </div>

                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder={t("contact.placeholders.phone")}
                      className={`w-full bg-[#f4f4f1] rounded-xl px-4 py-3 text-sm text-[#14161a] placeholder-[#6b727c] border ${
                        errors.phone ? "border-red-400" : "border-[#e6e6e1]"
                      } focus:outline-none focus:border-[var(--accent)] focus:bg-white transition-colors`}
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{t(errors.phone)}</p>}
                  </div>

                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full bg-[#f4f4f1] rounded-xl px-4 py-3 text-sm border border-[#e6e6e1] focus:outline-none focus:border-[var(--accent)] focus:bg-white transition-colors text-[#14161a]"
                  >
                    <option value="" className="text-[#6b727c]">
                      {t("contact.enquiryTypes.defaultOption")}
                    </option>
                    <option value="Product Enquiry">
                      {t("contact.enquiryTypes.product")}
                    </option>
                    <option value="Wholesale / Bulk Order">
                      {t("contact.enquiryTypes.wholesale")}
                    </option>
                    <option value="Partner Brand Products">
                      {t("contact.enquiryTypes.partner")}
                    </option>
                    <option value="Dealership Enquiry">
                      {t("contact.enquiryTypes.dealership")}
                    </option>
                  </select>

                  <div>
                    <textarea
                      rows="4"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder={t("contact.placeholders.message")}
                      className={`w-full bg-[#f4f4f1] rounded-xl px-4 py-3 text-sm text-[#14161a] placeholder-[#6b727c] border ${
                        errors.message ? "border-red-400" : "border-[#e6e6e1]"
                      } focus:outline-none focus:border-[var(--accent)] focus:bg-white transition-colors resize-none`}
                    />
                    {errors.message && <p className="mt-1 text-xs text-red-500">{t(errors.message)}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[var(--accent)] text-white py-3.5 rounded-lg text-xs font-semibold hover:bg-[var(--accent-hover)] transition-colors shadow-sm"
                  >
                    {t("contact.submitBtn")}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
