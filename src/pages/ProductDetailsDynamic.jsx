import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Flashlight, ArrowLeft } from "lucide-react";
import ProductDetailTemplate from "../components/ProductDetailTemplate";
import { useCatalog } from "../context/CatalogContext";
import { api } from "../services/api";
import { adaptProduct } from "../utils/productAdapter";
import { useTranslation } from "../i18n/LanguageContext";
import { getLocalizedProductTitle } from "../i18n/catalogI18n";

export default function ProductDetailsDynamic({
  slugProp,
  seoTitle,
  seoDescription,
  seoPath,
}) {
  const { slug: paramSlug } = useParams();
  const targetSlug = slugProp || paramSlug;
  const { getProductBySlugOrId, loading: catalogLoading } = useCatalog();
  const { language, t } = useTranslation();

  const cachedProduct = getProductBySlugOrId(targetSlug);
  const [liveProduct, setLiveProduct] = useState(null);
  const [notFoundError, setNotFoundError] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function load() {
      if (!targetSlug) return;
      setFetching(true);
      setNotFoundError(false);
      try {
        const res = await api.getPublicProductById(targetSlug);
        if (!ignore && res?.product) {
          setLiveProduct(adaptProduct(res.product));
        }
      } catch (err) {
        if (!ignore) {
          if (err.status === 404) {
            setLiveProduct(null);
            setNotFoundError(true);
          }
        }
      } finally {
        if (!ignore) setFetching(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [targetSlug]);

  const product = notFoundError ? null : liveProduct || cachedProduct;

  if (!product && (fetching || catalogLoading)) {
    return (
      <main className="min-h-screen bg-[var(--bg-canvas)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 aspect-[3/2] rounded-2xl bg-[#E6E6E1] animate-pulse" />
          <div className="lg:col-span-5 h-96 rounded-2xl bg-white border border-[var(--border-subtle)] animate-pulse" />
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-[70vh] bg-[var(--bg-canvas)] flex flex-col items-center justify-center px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-[var(--border-subtle)] shadow-xs mb-4">
          <Flashlight className="w-8 h-8 text-[var(--accent)]" />
        </div>
        <h1 className="font-['Outfit'] text-2xl font-bold text-[var(--text-primary)]">
          {t("productDetail.notFoundTitle")}
        </h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-md">
          {t("productDetail.notFoundDesc")}
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-6 py-3 text-xs font-semibold text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t("common.backToShop")}</span>
        </Link>
      </main>
    );
  }

  const localizedTitle = getLocalizedProductTitle(product, language);

  return (
    <ProductDetailTemplate
      product={product}
      images={product.galleryImages}
      specs={product.specs}
      seoTitle={seoTitle || `${localizedTitle} | ${t("seo.productFallbackSuffix")}`}
      seoDescription={seoDescription}
      seoPath={seoPath || product.link}
    />
  );
}
