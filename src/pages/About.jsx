import SEO from "../components/SEO";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <>
      <SEO
        title="About Us | Professional Torches & Search Lights"
        description="Learn about GunLite, operated by Jerone Enterprises in Coimbatore. Supplying high-power rechargeable torches and search lights across India for home, industrial, and security use."
        path="/about"
        image="/images/abpage.webp"
        type="website"
      />
      <main className="bg-[#fafaf8] text-[#14161a] min-h-screen">
        {/* INTRO SECTION */}
        <section className="py-16 border-b border-[#e6e6e1] bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="mb-3 inline-block rounded-full border border-[#e6e6e1] bg-[#f4f4f1] px-4 py-1.5 text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">
              Company Overview
            </span>
            <h1 className="text-3xl md:text-5xl font-['Outfit'] font-bold text-[#14161a] mb-4 tracking-tight">
              About GunLite
            </h1>
            <p className="text-sm md:text-base text-[#4a5058] max-w-3xl leading-relaxed">
              GunLite is a professional torch light brand operated by
              <strong className="text-[#14161a]"> Jerone Enterprises</strong>, Coimbatore. We specialize in designing
              and supplying high-power, rechargeable and search light solutions
              for home, industrial, security and emergency applications across India.
            </p>
          </div>
        </section>

        {/* WHO WE ARE */}
        <section className="py-16 border-b border-[#e6e6e1]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* IMAGE */}
            <div className="overflow-hidden rounded-2xl border border-[#e6e6e1] bg-white shadow-[0_4px_20px_rgba(20,22,26,0.06)]">
              <picture>
                <source srcSet="/images/abpage.webp" type="image/webp" />
                <img
                  src="/images/abpage.jpg"
                  alt="GunLite high-power rechargeable torch lights engineered for long-range durability"
                  width={600}
                  height={600}
                  loading="lazy"
                  className="w-full object-cover"
                />
              </picture>
            </div>

            {/* CONTENT */}
            <div>
              <h2 className="text-2xl md:text-3xl font-['Outfit'] font-bold text-[#14161a] mb-4 tracking-tight">
                Who We Are
              </h2>
              <p className="text-sm md:text-base text-[#4a5058] leading-relaxed mb-4">
                GunLite was established with the vision of delivering reliable and
                powerful lighting products that meet real-world requirements. Our
                torch lights are engineered using advanced technology and
                high-quality components to ensure durability, efficiency and
                long-term performance.
              </p>
              <p className="text-sm md:text-base text-[#4a5058] leading-relaxed">
                We serve both retail and bulk customers across India, offering
                dependable products that security professionals, farmers, and households can trust.
              </p>
            </div>
          </div>
        </section>

        {/* WHAT WE DO */}
        <section className="py-16 border-b border-[#e6e6e1] bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-['Outfit'] font-bold text-[#14161a] mb-6 tracking-tight">
              What We Do
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#fafaf8] rounded-2xl p-6 border border-[#e6e6e1] hover:border-[#cfcfc8] transition-colors">
                <h3 className="font-['Outfit'] font-bold text-[#14161a] mb-2 text-base">
                  High-Power Search Lights
                </h3>
                <p className="text-xs sm:text-sm text-[#4a5058] leading-relaxed">
                  Designed for long-range visibility, security, rescue operations
                  and industrial night surveillance.
                </p>
              </div>

              <div className="bg-[#fafaf8] rounded-2xl p-6 border border-[#e6e6e1] hover:border-[#cfcfc8] transition-colors">
                <h3 className="font-['Outfit'] font-bold text-[#14161a] mb-2 text-base">
                  Rechargeable Torches
                </h3>
                <p className="text-xs sm:text-sm text-[#4a5058] leading-relaxed">
                  Compact, durable and energy-efficient torches for daily estate use and emergency blackouts.
                </p>
              </div>

              <div className="bg-[#fafaf8] rounded-2xl p-6 border border-[#e6e6e1] hover:border-[#cfcfc8] transition-colors">
                <h3 className="font-['Outfit'] font-bold text-[#14161a] mb-2 text-base">
                  Bulk &amp; Dealer Supply
                </h3>
                <p className="text-xs sm:text-sm text-[#4a5058] leading-relaxed">
                  Reliable wholesale supply solutions for distributors, hardware retailers, and institutions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCT PORTFOLIO */}
        <section className="py-16 border-b border-[#e6e6e1]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-['Outfit'] font-bold text-[#14161a] mb-4 tracking-tight">
              Our Product Portfolio
            </h2>

            <p className="text-sm md:text-base text-[#4a5058] max-w-3xl leading-relaxed mb-6">
              Along with our own GunLite branded products, we also supply selected
              torch light products from our trusted partner manufacturers. All
              partner products are carefully chosen to meet our strict build standards.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-[#e6e6e1] shadow-[0_4px_20px_rgba(20,22,26,0.06)]">
                <h3 className="font-['Outfit'] font-bold text-[#14161a] mb-2 text-base">
                  GunLite Original Products
                </h3>
                <p className="text-xs sm:text-sm text-[#4a5058] leading-relaxed">
                  Our in-house range of high-power search lights and rechargeable
                  torches designed for professional, agricultural, and security use.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#e6e6e1] shadow-[0_4px_20px_rgba(20,22,26,0.06)]">
                <h3 className="font-['Outfit'] font-bold text-[#14161a] mb-2 text-base">
                  Partner Brand Products
                </h3>
                <p className="text-xs sm:text-sm text-[#4a5058] leading-relaxed">
                  Authorized products from partner companies supplied through
                  GunLite with assured quality and tested performance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHOLESALE & RETAIL */}
        <section className="py-16 border-b border-[#e6e6e1] bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-['Outfit'] font-bold text-[#14161a] mb-4 tracking-tight">
              Wholesale &amp; Retail Availability
            </h2>

            <p className="text-sm md:text-base text-[#4a5058] max-w-3xl leading-relaxed mb-6">
              GunLite supports both wholesale and retail sales. Customers can
              purchase products in bulk quantities for distribution, as well as single-piece purchases for individual usage.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#fafaf8] rounded-2xl p-6 border border-[#e6e6e1]">
                <h3 className="font-['Outfit'] font-bold text-[#14161a] mb-2 text-base">
                  Wholesale Supply
                </h3>
                <p className="text-xs sm:text-sm text-[#4a5058] leading-relaxed">
                  Competitive pricing and consistent supply for dealers and distributors.
                </p>
              </div>

              <div className="bg-[#fafaf8] rounded-2xl p-6 border border-[#e6e6e1]">
                <h3 className="font-['Outfit'] font-bold text-[#14161a] mb-2 text-base">
                  Single Piece Sales
                </h3>
                <p className="text-xs sm:text-sm text-[#4a5058] leading-relaxed">
                  Direct purchase options for individual, security, and farm use.
                </p>
              </div>

              <div className="bg-[#fafaf8] rounded-2xl p-6 border border-[#e6e6e1]">
                <h3 className="font-['Outfit'] font-bold text-[#14161a] mb-2 text-base">
                  Pan-India Service
                </h3>
                <p className="text-xs sm:text-sm text-[#4a5058] leading-relaxed">
                  Prompt delivery across India with reliable customer support.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHY GUNLITE */}
        <section className="py-16 border-b border-[#e6e6e1]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-['Outfit'] font-bold text-[#14161a] mb-6 tracking-tight">
              Why Choose GunLite
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-[#e6e6e1] shadow-[0_4px_20px_rgba(20,22,26,0.06)]">
                <h4 className="font-['Outfit'] font-bold text-[#14161a] mb-2 text-sm">Optical Efficiency</h4>
                <p className="text-xs text-[#4a5058] leading-relaxed">
                  High-efficiency LED emitters with deep parabolic beam reflectors.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#e6e6e1] shadow-[0_4px_20px_rgba(20,22,26,0.06)]">
                <h4 className="font-['Outfit'] font-bold text-[#14161a] mb-2 text-sm">Long LED Lifespan</h4>
                <p className="text-xs text-[#4a5058] leading-relaxed">
                  Solid-state LED lifespan rated up to 100,000 hours.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#e6e6e1] shadow-[0_4px_20px_rgba(20,22,26,0.06)]">
                <h4 className="font-['Outfit'] font-bold text-[#14161a] mb-2 text-sm">Durable Build</h4>
                <p className="text-xs text-[#4a5058] leading-relaxed">
                  Aluminium body designed for demanding, rough usage.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#e6e6e1] shadow-[0_4px_20px_rgba(20,22,26,0.06)]">
                <h4 className="font-['Outfit'] font-bold text-[#14161a] mb-2 text-sm">Trusted Support</h4>
                <p className="text-xs text-[#4a5058] leading-relaxed">
                  Warranty-backed hardware with direct WhatsApp guidance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* COMMITMENT */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white border border-[#e6e6e1] rounded-3xl p-8 sm:p-12 max-w-3xl mx-auto shadow-[0_4px_20px_rgba(20,22,26,0.06)]">
              <h2 className="text-2xl font-['Outfit'] font-bold text-[#14161a] mb-4">Our Commitment</h2>
              <p className="text-sm md:text-base text-[#4a5058] leading-relaxed mb-6">
                At GunLite, we are committed to delivering dependable lighting
                solutions that combine performance, safety and value. Our focus
                remains on long-term customer satisfaction and strong business
                relationships.
              </p>
              <Link
                to="/shop"
                className="inline-block px-8 py-3 bg-[var(--accent)] text-white rounded-lg text-xs font-semibold hover:bg-[var(--accent-hover)] transition-colors shadow-sm"
              >
                Browse Shop →
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
