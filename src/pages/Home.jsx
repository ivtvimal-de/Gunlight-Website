import SEO from "../components/SEO";
import BrandStrip from "../components/BrandStrip";
import Hero from "../section/Hero";
import ShopByCategory from "../section/ShopByCategory";
import FeaturedProducts from "../section/FeaturedProducts";
import TrustBar from "../section/TrustBar";
import BrandStory from "../section/BrandStory";
import DealerBanner from "../section/DealerBanner";

export default function Home() {
  return (
    <>
      <SEO
        title="High-Power LED Torches & Search Lights"
        description="GunLite e-commerce store by Jerone Enterprises. Professional high-power LED searchlights and torches. Long-range optics, 10000mAh battery backup, and rugged aluminium body. Pan-India safe transit."
        path="/"
        image="/images/eaglemain.webp"
        type="website"
      />
      <main>
        {/* Brand Strip between Navbar and Hero */}
        <BrandStrip />

        {/* 3. Hero banner slider with product image, headline, Shop Now CTA */}
        <Hero />

        {/* 4. Shop by Category tile row */}
        <ShopByCategory />

        {/* 5 & 6. Featured Products (4-column grid, 2 on mobile) & Product Cards */}
        <FeaturedProducts />

        {/* 7. Trust bar (Warranty, WhatsApp, Shipping, Support) */}
        <TrustBar />

        {/* 8. Brand / About strip */}
        <BrandStory />

        {/* 9. Bulk or dealer enquiry banner */}
        <DealerBanner />
      </main>
    </>
  );
}
