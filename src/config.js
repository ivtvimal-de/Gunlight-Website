// ─────────────────────────────────────────────
//  GunLite — Central Site Configuration
//  Edit business details, specs, and claims here.
// ─────────────────────────────────────────────

/** E.164 format without '+', used in wa.me links */
export const WHATSAPP_NUMBER = "919698788270"; // [PHONE FOR WHATSAPP]

/** Human-readable display format */
export const PHONE_DISPLAY = "+91 96987 88270"; // [PHONE DISPLAY]

/** WhatsApp enquiry URL */
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

/** Company and legal details */
export const COMPANY = {
  name: "Jerone Enterprises", // [BUSINESS NAME]
  brand: "GunLite",           // [BRAND NAME]
  email: "jeroneenterprises@gmail.com", // [EMAIL]
  phone: PHONE_DISPLAY,       // [PHONE]
  gst: "33AAMFJ0709K1ZD",     // [GST NUMBER]
  address: "39/2, Sakthi Nagar, 3rd Street, Kavundampalayam, Coimbatore – 641030, Tamil Nadu, India", // [ADDRESS]
  city: "Coimbatore",
  state: "Tamil Nadu",
  country: "India",
  pincode: "641030",
  operatingHours: "Monday – Saturday: 9:30 AM – 7:30 PM IST",
  supportWhatsApp: WHATSAPP_URL,
};

/**
 * Brand Directory
 * The main brand (GunLite) and demo entries.
 * Easily edit or delete demo entries as needed.
 */
export const BRANDS = [
  {
    slug: "gunlite",
    name: "Our Brands",
    logo: "/images/logo.png",
    logoWebp: "/images/logo.webp",
  },
  // ── Demo entries (safe to edit or delete) ──
  { slug: "philips", name: "Philips", demo: true },
  { slug: "eveready", name: "Eveready", demo: true },
  { slug: "wipro", name: "Wipro", demo: true },
  { slug: "bajaj", name: "Bajaj", demo: true },
  { slug: "mi", name: "Mi", demo: true },
];

/**
 * Key Product Specifications
 * Real verified values to fill in (uses [VALUE] placeholders where unconfirmed).
 */
export const SPECS = {
  hero: [
    {
      label: "Max Lumens",
      value: "[MAX LUMENS, e.g. 5,000 LM]",
      detail: "[LED TYPE, e.g. CREE High-Power LED]",
    },
    {
      label: "Beam Distance",
      value: "[BEAM DISTANCE, e.g. 1,200 M]",
      detail: "[OPTIC TYPE, e.g. Fresnel Focused Lens]",
    },
    {
      label: "Battery Life",
      value: "[BATTERY HOURS, e.g. 8 - 10 HRS]",
      detail: "[CHARGING, e.g. Type-C Fast Rechargeable]",
    },
    {
      label: "Chassis Build",
      value: "[IP RATING, e.g. IPX8 RATED]",
      detail: "[MATERIAL, e.g. Hard-Anodized Aluminium]",
    },
  ],
  models: {
    eagle: {
      power: "50W High Power LED",
      beamRange: "[BEAM RANGE]",
      tag: "5000LM",
    },
    everest: {
      power: "55W High Power LED",
      battery: "10000 mAh Lithium-ion",
      tag: "10000mAh",
    },
    tiger: {
      brightness: "500 Lumens",
      battery: "4000 mAh Lithium-ion",
      tag: "500LM",
    },
    sniper: {
      brightness: "1000 Lumens",
      battery: "2 × 18650 Lithium-ion",
      tag: "1000LM",
    },
  },
};

/**
 * Business & Warranty Claims
 * Used across Hero, Footer, and Trust Guarantee components.
 */
export const CLAIMS = {
  warranty: "1-Year Hardware Warranty",
  warrantyDetail: "Covered against internal LED chip and switch defects",
  orders: "Direct WhatsApp Orders",
  ordersDetail: "Instant stock confirmation, live pricing & tracking",
  shipping: "Pan-India Safe Transit",
  shippingDetail: "Insulated battery packaging with registered courier dispatch",
  factory: "[FACTORY / WAREHOUSE FACILITY, e.g. Coimbatore Hub]",
  gstin: "33AAMFJ0709K1ZD",
  pitch: "Professional-grade illumination hardware by Jerone Enterprises. High-power rechargeable LED searchlights and portable torches built for emergency, industrial, and outdoor use across India.",
};
