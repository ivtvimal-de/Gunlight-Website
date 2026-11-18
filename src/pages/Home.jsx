import SEO from "../components/SEO";
import HeroSection from "../section/Hero";
import PopularTorch from "../section/PopularTorch";
import FeaturedProducts from "../section/FeaturedProducts";
import About from "../section/About";
import Contact from "../section/Contact";

export default function Home() {
  return (
    <>
      <SEO
        title="High-Power LED Torches & Search Lights"
        description="Explore GunLite professional high-power LED searchlights and torches by Jerone Enterprises. Long-range focus, 10000mAh battery backup, and rugged aluminium body. Pan-India delivery."
        path="/"
        image="/images/hero.webp"
        type="website"
      />
      <main className="pt-16">
        {/* HERO SECTION */}
        <HeroSection />

        {/* POPULAR TORCHES */}
        <PopularTorch />

        {/* FEATURED PRODUCTS */}
        <FeaturedProducts />

        {/* ABOUT SECTION */}
        <About />

        {/* CONTACT / ENQUIRY SECTION */}
        <Contact />
      </main>
    </>
  );
}
