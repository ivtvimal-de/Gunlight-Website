import React from "react";
import { Helmet } from "react-helmet-async";

const DEFAULT_TITLE = "GunLite | High-Power LED Torches & Search Lights";
const DEFAULT_DESC =
  "High-power professional rechargeable LED searchlights and torches by Jerone Enterprises. Designed for outdoor, industrial, agricultural, and security illumination across India.";
const SITE_URL = "https://gunlite.in";
const DEFAULT_IMAGE = `${SITE_URL}/images/hero.webp`;

export default function SEO({
  title,
  description = DEFAULT_DESC,
  path = "",
  image = DEFAULT_IMAGE,
  type = "website",
}) {
  const fullTitle = title ? `${title} | GunLite` : DEFAULT_TITLE;
  const canonicalUrl = `${SITE_URL}${path}`;
  const fullImageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return (
    <Helmet>
      {/* Standard Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:site_name" content="GunLite" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={fullImageUrl} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
    </Helmet>
  );
}

