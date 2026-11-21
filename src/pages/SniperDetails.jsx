import React from "react";
import ProductDetailTemplate from "../components/ProductDetailTemplate";

const PRODUCT = {
  id: "sniper",
  title: "Sniper X2 GunLite",
  price: "₹999",
  priceNum: 999,
  desc: "High-power rechargeable aluminium torch designed for long-range focus, outdoor usage, emergency lighting and professional needs. Features dual 18650 battery power.",
  img: "/images/simain.webp",
};

const IMAGES = [
  "/images/simain.webp",
  "/images/sniper.webp",
];

const SPECS = [
  { label: "LED Emitter", value: "CREE LED (Made in USA)" },
  { label: "Driver Technology", value: "German Engineering Architecture" },
  { label: "Brightness", value: "1000 Lumens Peak Output" },
  { label: "Battery System", value: "2 × 18650 High-Drain Lithium-ion Cells" },
  { label: "Charging Support", value: "USB Fast Charging Interface" },
  { label: "Zoom Mechanism", value: "Telescopic Zoom In / Zoom Out (Flood & Focus)" },
  { label: "Tactical Modes", value: "High / Medium / Low / Strobe / SOS" },
  { label: "Body Construction", value: "Anodized Aerospace Aluminium" },
  { label: "Working Backup", value: "Up to 6–8 Hours Operating Life" },
  { label: "Warranty", value: "1 Year Hardware Warranty" },
];

export default function SniperDetails() {
  return (
    <ProductDetailTemplate
      product={PRODUCT}
      images={IMAGES}
      specs={SPECS}
      seoTitle="Sniper X2 GunLite | 1000 Lumens Compact Zoom Torch"
      seoDescription="Sniper X2 GunLite: 1000 Lumens CREE LED, dual 18650 lithium battery, flood & focus zoom lens, and 5 operating modes. Order directly on WhatsApp."
      seoPath="/sniper"
    />
  );
}
