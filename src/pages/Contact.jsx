import { useState } from "react";
import { Check } from "lucide-react";
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
      <main className="pt-20 bg-cyan-50 min-h-screen">
      {/* CONTACT HEADER */}
      <section className="py-14 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Contact Us
          </h1>
          <p className="text-gray-600 max-w-3xl leading-relaxed">
            For product enquiries, wholesale orders, partner brand products or
            dealership opportunities, feel free to contact us using the details
            below. Our team will assist you at the earliest.
          </p>
        </div>
      </section>

      {/* CONTACT CONTENT */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-start">
          {/* LEFT SIDE – COMPANY INFO */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {COMPANY.name}
            </h2>

            <p className="text-gray-600 leading-relaxed mb-6">
              GunLite is operated by {COMPANY.name}, Coimbatore. We deal in
              GunLite branded torch lights as well as selected products from our
              authorized tie-up partner companies. We support both wholesale and
              single-piece sales across India.
            </p>

            <div className="space-y-4 text-sm text-gray-700">
              <p>
                <b>Address:</b>
                <br />
                {COMPANY.address.split(",").map((line, i) => (
                  <span key={i}>{line.trim()}{i < 4 ? "," : ""}<br /></span>
                ))}
              </p>
              <p><b>Phone:</b> {COMPANY.phone}</p>
              <p><b>Email:</b> {COMPANY.email}</p>
              <p><b>GST No:</b> {COMPANY.gst}</p>
            </div>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 bg-green-500 text-white px-6 py-3 rounded-lg text-sm font-semibold"
            >
              WhatsApp Enquiry
            </a>
          </div>

          {/* RIGHT SIDE – ENQUIRY FORM */}
          <div className="rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] bg-white">
            <h3 className="text-xl font-semibold text-gray-900 mb-5">
              Send Us an Enquiry
            </h3>

            {submitted ? (
              <div className="flex flex-col items-center justify-center gap-4 text-center py-10">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-[#00e5ff]">
                  <Check className="w-8 h-8 text-[#00e5ff]" />
                </div>
                <p className="text-lg font-semibold text-gray-800">Sent via WhatsApp!</p>
                <p className="text-sm text-gray-500">We'll reply to you on WhatsApp shortly.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 rounded-xl border border-blue-300 px-6 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition"
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
                    className={`w-full bg-white rounded-lg px-4 py-3 text-sm border ${errors.name ? "border-red-400" : "border-gray-200"} focus:outline-none focus:border-blue-400 transition`}
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
                    className={`w-full bg-white rounded-lg px-4 py-3 text-sm border ${errors.email ? "border-red-400" : "border-gray-200"} focus:outline-none focus:border-blue-400 transition`}
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
                    className={`w-full bg-white rounded-lg px-4 py-3 text-sm border ${errors.phone ? "border-red-400" : "border-gray-200"} focus:outline-none focus:border-blue-400 transition`}
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                </div>

                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full bg-white rounded-lg px-4 py-3 text-sm border border-gray-200 focus:outline-none focus:border-blue-400 transition text-gray-600"
                >
                  <option value="">Type of Enquiry</option>
                  <option>Product Enquiry</option>
                  <option>Wholesale / Bulk Order</option>
                  <option>Partner Brand Products</option>
                  <option>Dealership Enquiry</option>
                </select>

                <div>
                  <textarea
                    rows="4"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Your Message *"
                    className={`w-full bg-white rounded-lg px-4 py-3 text-sm border ${errors.message ? "border-red-400" : "border-gray-200"} focus:outline-none focus:border-blue-400 transition`}
                  />
                  {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 rounded-lg text-sm font-semibold hover:bg-gray-800 transition"
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
