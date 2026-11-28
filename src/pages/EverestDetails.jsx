import ProductDetailsDynamic from "./ProductDetailsDynamic";
import { useTranslation } from "../i18n/LanguageContext";

export default function EverestDetails() {
  const { t } = useTranslation();
  return (
    <ProductDetailsDynamic
      slugProp="everest"
      seoTitle={t("seo.everestTitle")}
      seoDescription={t("seo.everestDesc")}
      seoPath="/everest"
    />
  );
}
