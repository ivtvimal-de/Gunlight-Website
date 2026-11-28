import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "../i18n/LanguageContext";

const SITE_URL = "https://gunlite.in";
const DEFAULT_IMAGE = `${SITE_URL}/images/hero.webp`;

export default function SEO({
  title,
  description,
  path = "",
  image = DEFAULT_IMAGE,
  type = "website",
}) {
  const { language, t } = useTranslation();
  const resolvedDesc = description || t("seo.defaultDesc");
  const fullTitle = title ? `${title} | GunLite` : t("seo.defaultTitle");
  const canonicalUrl = `${SITE_URL}${path}`;
  const fullImageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return (
    <Helmet htmlAttributes={{ lang: language }}>
      {/* Standard Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={resolvedDesc} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:site_name" content="GunLite" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={resolvedDesc} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={fullImageUrl} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={resolvedDesc} />
      <meta name="twitter:image" content={fullImageUrl} />
    </Helmet>
  );
}
