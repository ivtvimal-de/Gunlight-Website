import React from "react";
import ProductDetailTemplate from "../components/ProductDetailTemplate";

const PRODUCT = {
  id: "eagle",
  title: "Eagle 3.1 GunLite",
  price: "₹2,499",
  priceNum: 2499,
  desc: "High-power professional rechargeable search light designed for long-range focus, emergency usage and industrial applications. Features a 50W LED chip and transparent Fresnel lens.",
  img: "/images/egmain.webp",
};

const IMAGES = [
  "/images/egmain.webp",
  "/images/eg1.webp",
  "/images/eg2.webp",
  "/images/eg3.webp",
  "/images/eg4.webp",
];

const SPECS = [
  { label: "LED Emitter", value: "50W High Power LED Chip" },
  { label: "Beam Optics", value: "Long-Range Focused Throw" },
  { label: "Zoom System", value: "Zoom-in / Zoom-out (Flood & Focus light)" },
  { label: "Optic Lens", value: "High-Transmittance Fresnel Lens" },
  { label: "Light Color Filters", value: "White, Blue, Green, Red" },
  { label: "Emergency Modes", value: "High / Medium / Strobe / SOS Function" },
  { label: "Battery Cell", value: "Rechargeable High-Capacity Lithium-Ion" },
  { label: "Charging & Output", value: "Type-C Fast Input with Power Bank USB Output" },
  { label: "Chassis Material", value: "Aircraft-Grade Hard-Anodized Aluminium Alloy" },
];

export default function EagleDetails() {
  return (
    <ProductDetailTemplate
      product={PRODUCT}
      images={IMAGES}
      specs={SPECS}
      seoTitle="Eagle 3.1 GunLite | 50W High-Power LED Search Light"
      seoDescription="Eagle 3.1 GunLite: 50W high-power search light with long-range focused beam, multi-color lenses, USB power bank function, and rugged aircraft aluminum body."
      seoPath="/eagle"
    />
  );
}
