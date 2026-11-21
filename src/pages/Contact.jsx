import { useState } from "react";
import { Check, MessageCircle, MapPin, Phone, Mail, FileText } from "lucide-react";
import { WHATSAPP_NUMBER, WHATSAPP_URL, COMPANY } from "../config";
import SEO from "../components/SEO";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", type: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.phone.trim()) {
      e.phone = "Phone number is required.";
    } else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ""))) {
      e.phone = "Enter a valid 10-digit Indian mobile number.";
    }
    if (!form.message.trim()) e.message = "Message is required.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address.";
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

  return (
    <>
      <SEO
        title="Contact Us & Dealership Enquiries"
        description="Contact Jerone Enterprises for GunLite high-power LED torch orders, wholesale distribution, bulk pricing, and retail enquiries. Call or WhatsApp +91 96987 88270."
        path="/contact"
        type="website"
      />
      <main className="pt-32 sm:pt-36 bg-[#fafaf8] text-[#14161a] min-h-screen">
        {/* CONTACT HEADER */}
        <section className="py-14 border-b border-[#e6e6e1] bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="mb-3 inline-block rounded-full border border-[#e6e6e1] bg-[#f4f4f1] px-4 py-1.5 text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
              Communication Desk
            </span>
            <h1 className="text-3xl md:text-5xl font-['Outfit'] font-bold text-[#14161a] mb-3 tracking-tight">
              Contact Us
            </h1>
            <p className="text-sm md:text-base text-[#4a5058] max-w-3xl leading-relaxed">
              For product enquiries, wholesale orders, partner brand products or
              dealership opportunities, feel free to contact us using the details
              below. Our team will assist you at the earliest over phone or WhatsApp.
            </p>
          </div>
        </section>

        {/* CONTACT CONTENT */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* LEFT SIDE – COMPANY INFO */}
            <div className="bg-white border border-[#e6e6e1] rounded-3xl p-8 sm:p-10 shadow-[0_4px_20px_rgba(20,22,26,0.06)]">
              <span className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
                Authorized Operator
              </span>
              <h2 className="text-2xl sm:text-3xl font-['Outfit'] font-bold text-[#14161a] mb-4 mt-1">
                {COMPANY.name}
              </h2>

              <p className="text-sm text-[#4a5058] leading-relaxed mb-6">
                GunLite is operated by {COMPANY.name}, Coimbatore. We deal in
                GunLite branded torch lights as well as selected products from our
                authorized partner manufacturers. We support both wholesale and
                single-piece sales across India.
              </p>

              <div className="space-y-4 text-sm text-[#4a5058] border-t border-[#e6e6e1] pt-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[var(--accent)] shrink-0 mt-1" />
                  <div>
                    <strong className="text-[#14161a] block mb-0.5">Address:</strong>
                    {COMPANY.address.split(",").map((line, i) => (
                      <span key={i}>{line.trim()}{i < 4 ? "," : ""}<br /></span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[var(--accent)] shrink-0" />
                  <div>
                    <strong className="text-[#14161a]">Phone: </strong>{COMPANY.phone}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[var(--accent)] shrink-0" />
                  <div>
                    <strong className="text-[#14161a]">Email: </strong>{COMPANY.email}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-[var(--accent)] shrink-0" />
                  <div>
                    <strong className="text-[#14161a]">GSTIN: </strong>{COMPANY.gst}
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
                <span>WhatsApp Enquiry</span>
              </a>
            </div>

            {/* RIGHT SIDE – ENQUIRY FORM */}
            <div className="rounded-3xl p-8 sm:p-10 border border-[#e6e6e1] bg-white shadow-[0_4px_20px_rgba(20,22,26,0.06)]">
              <h3 className="text-xl sm:text-2xl font-['Outfit'] font-bold text-[#14161a] mb-2">
                Send Us an Enquiry
              </h3>
              <p className="text-xs text-[#6b727c] mb-6">
                Direct WhatsApp routing for quick replies.
              </p>

              {submitted ? (
                <div className="flex flex-col items-center justify-center gap-4 text-center py-10">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f4f4f1] border border-[#e6e6e1]">
                    <Check className="w-8 h-8 text-[var(--accent)]" />
                  </div>
                  <p className="font-['Outfit'] text-lg font-bold text-[#14161a]">Sent via WhatsApp!</p>
                  <p className="text-sm text-[#6b727c]">We'll reply to your query on WhatsApp shortly.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 rounded-lg border border-[#e6e6e1] bg-white px-6 py-2 text-xs font-semibold text-[#14161a] hover:bg-[#f4f4f1] transition-colors"
                  >
                    Send another enquiry
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
                      placeholder="Your Name *"
                      className={`w-full bg-[#f4f4f1] rounded-xl px-4 py-3 text-sm text-[#14161a] placeholder-[#6b727c] border ${
                        errors.name ? "border-red-400" : "border-[#e6e6e1]"
                      } focus:outline-none focus:border-[var(--accent)] focus:bg-white transition-colors`}
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                  </div>

                  <div>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Email Address (optional)"
                      className={`w-full bg-[#f4f4f1] rounded-xl px-4 py-3 text-sm text-[#14161a] placeholder-[#6b727c] border ${
                        errors.email ? "border-red-400" : "border-[#e6e6e1]"
                      } focus:outline-none focus:border-[var(--accent)] focus:bg-white transition-colors`}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </div>

                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Phone Number *"
                      className={`w-full bg-[#f4f4f1] rounded-xl px-4 py-3 text-sm text-[#14161a] placeholder-[#6b727c] border ${
                        errors.phone ? "border-red-400" : "border-[#e6e6e1]"
                      } focus:outline-none focus:border-[var(--accent)] focus:bg-white transition-colors`}
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                  </div>

                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full bg-[#f4f4f1] rounded-xl px-4 py-3 text-sm border border-[#e6e6e1] focus:outline-none focus:border-[var(--accent)] focus:bg-white transition-colors text-[#14161a]"
                  >
                    <option value="" className="text-[#6b727c]">Type of Enquiry</option>
                    <option value="Product Enquiry">Product Enquiry</option>
                    <option value="Wholesale / Bulk Order">Wholesale / Bulk Order</option>
                    <option value="Partner Brand Products">Partner Brand Products</option>
                    <option value="Dealership Enquiry">Dealership Enquiry</option>
                  </select>

                  <div>
                    <textarea
                      rows="4"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Your Message *"
                      className={`w-full bg-[#f4f4f1] rounded-xl px-4 py-3 text-sm text-[#14161a] placeholder-[#6b727c] border ${
                        errors.message ? "border-red-400" : "border-[#e6e6e1]"
                      } focus:outline-none focus:border-[var(--accent)] focus:bg-white transition-colors resize-none`}
                    />
                    {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[var(--accent)] text-white py-3.5 rounded-lg text-xs font-semibold hover:bg-[var(--accent-hover)] transition-colors shadow-sm"
                  >
                    Send via WhatsApp →
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
