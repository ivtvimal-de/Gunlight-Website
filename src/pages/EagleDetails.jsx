import ProductDetailsDynamic from "./ProductDetailsDynamic";
import { useTranslation } from "../i18n/LanguageContext";

export default function EagleDetails() {
  const { t } = useTranslation();
  return (
    <ProductDetailsDynamic
      slugProp="eagle"
      seoTitle={t("seo.eagleTitle")}
      seoDescription={t("seo.eagleDesc")}
      seoPath="/eagle"
    />
  );
}
