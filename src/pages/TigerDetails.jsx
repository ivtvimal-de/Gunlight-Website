import React from "react";
import ProductDetailTemplate from "../components/ProductDetailTemplate";

const PRODUCT = {
  id: "tiger",
  title: "Tiger Pro-1 GunLite",
  price: "₹1,499",
  priceNum: 1499,
  desc: "High-quality rechargeable aluminium flashlight designed for everyday carry, emergency lighting, and professional duties. Equipped with authentic USA-made CREE LED.",
  img: "/images/timain.webp",
};

const IMAGES = [
  "/images/timain.webp",
  "/images/tigerpro.webp",
];

const SPECS = [
  { label: "LED Emitter", value: "CREE LED (Made in USA)" },
  { label: "Driver Technology", value: "German Regulated Constant-Current Technology" },
  { label: "Peak Output", value: "500 Lumens" },
  { label: "Charging Port", value: "USB Type-C" },
  { label: "Internal Battery", value: "4000 mAh Lithium-ion (3.7V)" },
  { label: "Runtime / Backup", value: "Up to 8 Hours (~300 Minutes Continuous)" },
  { label: "Chassis Build", value: "Heavy-Duty Machined Aluminium Alloy" },
  { label: "Overall Length", value: "10.5 Inches" },
  { label: "Switch Modes", value: "Low / Medium / High / Flickering / Off" },
  { label: "Hardware Warranty", value: "1 Year Official Guarantee" },
];

export default function TigerDetails() {
  return (
    <ProductDetailTemplate
      product={PRODUCT}
      images={IMAGES}
      specs={SPECS}
      seoTitle="Tiger Pro-1 GunLite | 500 Lumens Rechargeable Flashlight"
      seoDescription="Tiger Pro-1 GunLite: CREE LED emitter, 4000mAh lithium battery, 8-hour backup, Type-C charging, and solid aluminium construction. Buy directly over WhatsApp."
      seoPath="/tiger"
    />
  );
}
