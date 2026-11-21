import React from "react";
import ProductDetailTemplate from "../components/ProductDetailTemplate";

const PRODUCT = {
  id: "everest",
  title: "Everest LED GunLite",
  price: "₹1,999",
  priceNum: 1999,
  desc: "Multi-functional high-power rechargeable searchlight designed for long-range visibility, emergency situations, and professional use. Features 55W power output and massive 10000mAh battery.",
  img: "/images/evmain.webp",
};

const IMAGES = [
  "/images/evmain.webp",
  "/images/ev1.webp",
  "/images/ev2.webp",
  "/images/ev3.webp",
  "/images/ev4.webp",
];

const SPECS = [
  { label: "Power Output", value: "55 Watts High Power LED" },
  { label: "Battery Capacity", value: "10000 mAh Lithium-ion Rechargeable" },
  { label: "Charging Input", value: "Type-C Fast Input Charging" },
  { label: "Power Bank Output", value: "USB Output to Charge Smartphones & Devices" },
  { label: "Switch Design", value: "Dual Tactical Switch System" },
  { label: "Lighting Array", value: "Main Forward Beam + Side Work Light + Tail Warning Light" },
  { label: "Recommended Use", value: "Emergency, Outdoor Trekking, Security & Industrial" },
];

export default function EverestDetails() {
  return (
    <ProductDetailTemplate
      product={PRODUCT}
      images={IMAGES}
      specs={SPECS}
      seoTitle="Everest LED GunLite | 55W Tri-Light Searchlight"
      seoDescription="Everest LED GunLite: 55 Watts high power output, 10000mAh battery with power bank function, main light, side light, and tail light. Order on WhatsApp with fast Pan-India shipping."
      seoPath="/everest"
    />
  );
}
