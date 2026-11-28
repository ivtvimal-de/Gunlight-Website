import ProductDetailsDynamic from "./ProductDetailsDynamic";
import { useTranslation } from "../i18n/LanguageContext";

export default function TigerDetails() {
  const { t } = useTranslation();
  return (
    <ProductDetailsDynamic
      slugProp="tiger"
      seoTitle={t("seo.tigerTitle")}
      seoDescription={t("seo.tigerDesc")}
      seoPath="/tiger"
    />
  );
}
