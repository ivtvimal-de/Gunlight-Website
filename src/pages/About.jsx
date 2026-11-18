import SEO from "../components/SEO";

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
      <main className="pt-20 bg-cyan-50">
      {/* INTRO SECTION */}
      <section className=" py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            About GunLite
          </h1>
          <p className="text-gray-600 max-w-3xl leading-relaxed">
            GunLite is a professional torch light brand operated by
            <b> Jerone Enterprises</b>, Coimbatore. We specialize in designing
            and supplying high-power, rechargeable and search light solutions
            for home, industrial, security and emergency applications.
          </p>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* IMAGE */}
          <div>
            <picture>
              <source srcSet="/images/abpage.webp" type="image/webp" />
              <img
                src="/images/abpage.jpg"
                alt="GunLite high-power rechargeable torch lights engineered for long-range durability"
                width={600}
                height={600}
                loading="lazy"
                className="rounded-xl shadow-md w-full object-cover"
              />
            </picture>
          </div>

          {/* CONTENT */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Who We Are
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              GunLite was established with the vision of delivering reliable and
              powerful lighting products that meet real-world requirements. Our
              torch lights are engineered using advanced technology and
              high-quality components to ensure durability, efficiency and
              long-term performance.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We serve both retail and bulk customers across India, offering
              dependable products that professionals and households can trust.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className=" py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What We Do</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] transition-all duration-300">
              <h3 className="font-semibold text-gray-900 mb-2">
                High-Power Search Lights
              </h3>
              <p className="text-sm text-gray-600">
                Designed for long-range visibility, security, rescue operations
                and industrial usage.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] transition-all duration-300">
              <h3 className="font-semibold text-gray-900 mb-2">
                Rechargeable Torches
              </h3>
              <p className="text-sm text-gray-600">
                Compact, durable and energy-efficient torches for daily and
                emergency use.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] transition-all duration-300">
              <h3 className="font-semibold text-gray-900 mb-2">
                Bulk & Dealer Supply
              </h3>
              <p className="text-sm text-gray-600">
                Reliable supply solutions for wholesalers, dealers and
                institutional buyers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT PORTFOLIO */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Our Product Portfolio
          </h2>

          <p className="text-gray-600 max-w-4xl leading-relaxed mb-6">
            Along with our own GunLite branded products, we also supply selected
            torch light products from our trusted tie-up partner companies. All
            partner products are carefully chosen to meet quality, performance
            and reliability standards.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] transition-all duration-300">
              <h3 className="font-semibold text-gray-900 mb-2">
                GunLite Original Products
              </h3>
              <p className="text-sm text-gray-600">
                Our in-house range of high-power search lights and rechargeable
                torches designed for professional and household use.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] transition-all duration-300">
              <h3 className="font-semibold text-gray-900 mb-2">
                Partner Brand Products
              </h3>
              <p className="text-sm text-gray-600">
                Authorized products from tie-up companies supplied through
                GunLite with assured quality and authenticity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHOLESALE & RETAIL */}
      <section className=" py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Wholesale & Retail Availability
          </h2>

          <p className="text-gray-600 max-w-4xl leading-relaxed mb-6">
            GunLite supports both wholesale and retail sales. Customers can
            purchase products in bulk quantities for distribution and business
            requirements, as well as single-piece purchases for individual usage
            without minimum order restrictions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] transition-all duration-300">
              <h3 className="font-semibold text-gray-900 mb-2">
                Wholesale Supply
              </h3>
              <p className="text-sm text-gray-600">
                Competitive pricing and consistent supply for dealers and
                distributors.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] transition-all duration-300">
              <h3 className="font-semibold text-gray-900 mb-2">
                Single Piece Sales
              </h3>
              <p className="text-sm text-gray-600">
                Easy purchase options for individual and household customers.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] transition-all duration-300">
              <h3 className="font-semibold text-gray-900 mb-2">
                Pan-India Service
              </h3>
              <p className="text-sm text-gray-600">
                Serving customers across India with reliable support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY GUNLITE */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Why Choose GunLite
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] transition-all duration-300">
              <h4 className="font-semibold mb-2">Advanced Technology</h4>
              <p className="text-sm text-gray-600">
                German technology-based designs with premium LED components.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] transition-all duration-300">
              <h4 className="font-semibold mb-2">Long Life</h4>
              <p className="text-sm text-gray-600">
                LED lifespan up to 100,000 hours.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] transition-all duration-300">
              <h4 className="font-semibold mb-2">Durable Build</h4>
              <p className="text-sm text-gray-600">
                Aluminium body designed for rough usage.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] transition-all duration-300">
              <h4 className="font-semibold mb-2">Trusted Support</h4>
              <p className="text-sm text-gray-600">
                Warranty-backed products with dependable service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COMMITMENT */}
      <section className=" text-black py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
          <p className="max-w-3xl mx-auto text-black leading-relaxed">
            At GunLite, we are committed to delivering dependable lighting
            solutions that combine performance, safety and value. Our focus
            remains on long-term customer satisfaction and strong business
            relationships.
          </p>
        </div>
      </section>
    </main>
    </>
  );
}
