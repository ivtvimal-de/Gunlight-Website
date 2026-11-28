import SEO from "../components/SEO";
import BrandStrip from "../components/BrandStrip";
import Hero from "../section/Hero";
import ShopByCategory from "../section/ShopByCategory";
import FeaturedProducts from "../section/FeaturedProducts";
import TrustBar from "../section/TrustBar";
import BrandStory from "../section/BrandStory";
import DealerBanner from "../section/DealerBanner";
import { useTranslation } from "../i18n/LanguageContext";

export default function Home() {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        title={t("seo.homeTitle")}
        description={t("seo.homeDesc")}
        path="/"
        image="/images/eaglemain.webp"
        type="website"
      />
      <main>
        {/* Brand Strip between Navbar and Hero */}
        <BrandStrip />

        {/* 3. Hero banner slider */}
        <Hero />

        {/* 4. Shop by Category tile row */}
        <ShopByCategory />

        {/* 5 & 6. Featured Products & Product Cards */}
        <FeaturedProducts />

        {/* 7. Trust bar */}
        <TrustBar />

        {/* 8. Brand / About strip */}
        <BrandStory />

        {/* 9. Bulk or dealer enquiry banner */}
        <DealerBanner />
      </main>
    </>
  );
}
