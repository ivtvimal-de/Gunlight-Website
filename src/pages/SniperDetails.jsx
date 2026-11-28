import ProductDetailsDynamic from "./ProductDetailsDynamic";
import { useTranslation } from "../i18n/LanguageContext";

export default function SniperDetails() {
  const { t } = useTranslation();
  return (
    <ProductDetailsDynamic
      slugProp="sniper"
      seoTitle={t("seo.sniperTitle")}
      seoDescription={t("seo.sniperDesc")}
      seoPath="/sniper"
    />
  );
}
