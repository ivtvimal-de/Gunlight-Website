import { formatPrice } from "../context/CartContext";
import { API_BASE_URL } from "../services/api";

const DEDICATED_SLUG_ROUTES = {
  eagle: "/eagle",
  everest: "/everest",
  tiger: "/tiger",
  sniper: "/sniper",
};

export function resolveMediaUrl(url) {
  if (!url || typeof url !== "string") return "";
  if (url.startsWith("/uploads/") && API_BASE_URL) {
    return `${API_BASE_URL}${url}`;
  }
  return url;
}

export function adaptBrand(doc) {
  if (!doc) return null;
  const slug = String(doc.slug || "").toLowerCase().trim();
  const logoUrl = resolveMediaUrl(
    typeof doc.logo === "string" ? doc.logo : doc.logo?.url || ""
  );
  const bannerUrl = resolveMediaUrl(
    typeof doc.bannerImage === "string"
      ? doc.bannerImage
      : doc.bannerImage?.url || doc.previewBanner || ""
  );

  return {
    ...doc,
    _id: doc._id || slug,
    slug,
    name: doc.name || slug,
    tagline: doc.tagline || "",
    description: doc.description || "",
    logo: logoUrl,
    logoWebp: resolveMediaUrl(doc.logoWebp || "") || logoUrl,
    bannerImage: bannerUrl,
    isFlagship: Boolean(doc.isFlagship || slug === "gunlite"),
    isComingSoon: Boolean(doc.isComingSoon ?? doc.demo),
    demo: Boolean(doc.isComingSoon ?? doc.demo),
    isActive: doc.isActive !== false,
    productCount: Number(doc.productCount || 0),
  };
}

export const FALLBACK_BRANDS = [
  {
    _id: "brand-gunlite",
    name: "GunLite",
    slug: "gunlite",
    tagline: "Professional LED torches and search lights from Coimbatore.",
    description:
      "Flagship high-power rechargeable LED torches and portable searchlights engineered by Jerone Enterprises.",
    logo: { url: "/images/logo.png", publicId: "" },
    logoWebp: "/images/logo.webp",
    bannerImage: { url: "/images/eaglemain.webp", publicId: "" },
    isFlagship: true,
    isComingSoon: false,
    isActive: true,
    displayOrder: 1,
    productCount: 4,
  },
  { _id: "brand-philips", name: "Philips", slug: "philips", isComingSoon: true, isActive: true, displayOrder: 2 },
  { _id: "brand-eveready", name: "Eveready", slug: "eveready", isComingSoon: true, isActive: true, displayOrder: 3 },
  { _id: "brand-wipro", name: "Wipro", slug: "wipro", isComingSoon: true, isActive: true, displayOrder: 4 },
  { _id: "brand-bajaj", name: "Bajaj", slug: "bajaj", isComingSoon: true, isActive: true, displayOrder: 5 },
  { _id: "brand-mi", name: "Mi", slug: "mi", isComingSoon: true, isActive: true, displayOrder: 6 },
].map(adaptBrand);

/**
 * Convert a backend MongoDB Product document into the unified frontend shape.
 */
export function adaptProduct(doc) {
  if (!doc) return null;

  const slug = doc.slug || doc.id || doc._id;
  const basePrice = Number(doc.price) || 0;
  const hasDiscount =
    doc.discountPrice !== null &&
    doc.discountPrice !== undefined &&
    doc.discountPrice !== "" &&
    Number(doc.discountPrice) < basePrice;

  const effectivePriceNum = hasDiscount ? Number(doc.discountPrice) : basePrice;

  const imagesArr = Array.isArray(doc.images)
    ? doc.images.map((img) => ({
        ...img,
        url: resolveMediaUrl(img.url),
      }))
    : [];
  const primaryImage =
    imagesArr.find((img) => img.isPrimary)?.url ||
    imagesArr[0]?.url ||
    resolveMediaUrl(doc.imgWebp || doc.img) ||
    "/images/eagle.webp";

  const galleryImages =
    imagesArr.length > 0
      ? [
          primaryImage,
          ...imagesArr.map((i) => i.url).filter((url) => url && url !== primaryImage),
        ]
      : [primaryImage];

  const heroImageUrl = resolveMediaUrl(doc.heroImage?.url) || primaryImage;

  const categoryList = [];
  if (doc.category?.name) categoryList.push(doc.category.name);
  if (Array.isArray(doc.categories)) {
    doc.categories.forEach((c) => {
      const name = typeof c === "string" ? c : c?.name;
      if (name && !categoryList.includes(name)) categoryList.push(name);
    });
  }

  const stockQuantity = Number(doc.stockQuantity ?? 10);
  const outOfStock = stockQuantity <= 0;

  return {
    _id: doc._id || slug,
    id: slug,
    slug,
    sku: doc.sku || "",
    title: doc.name || doc.title || "",
    name: doc.name || doc.title || "",
    brand: doc.brand || "GunLite",
    desc: doc.description || doc.desc || "",
    shortSpec: doc.shortSpec || "",
    specs: Array.isArray(doc.specs) ? doc.specs : [],
    price: formatPrice(effectivePriceNum),
    priceNum: effectivePriceNum,
    regularPrice: hasDiscount ? formatPrice(basePrice) : null,
    regularPriceNum: basePrice,
    hasDiscount,
    stockQuantity,
    outOfStock,
<<<<<<< HEAD
    status: doc.status || "active",
=======
    status: doc.status || "published",
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
    isFeatured: Boolean(doc.isFeatured),
    badge: doc.badge || "",
    warrantyEnabled: doc.warrantyEnabled !== undefined ? Boolean(doc.warrantyEnabled) : true,
    warrantyPrice: Number(doc.warrantyPrice ?? 500),
    warrantyLabel: doc.warrantyLabel || "1-Year Warranty",
    link: DEDICATED_SLUG_ROUTES[slug] || `/product/${slug}`,
    category: doc.category || null,
    categories: categoryList.length > 0 ? categoryList : ["LED Torch"],
    img: primaryImage,
    imgWebp: primaryImage,
    imgPng: primaryImage,
    fallback: primaryImage,
    heroImg: heroImageUrl,
    galleryImages,
    images: imagesArr,
    createdAt: doc.createdAt || null,
  };
}

/**
 * Built-in initial catalog fallback (mirrors server/scripts/seed.js)
 * used only while loading or if backend is offline.
 */
export const FALLBACK_CATEGORIES = [
  {
    _id: "cat-led-torch",
    name: "LED Torch",
    slug: "led-torch",
    description: "Handheld high-beam",
    previewImage: "/images/everest.webp",
    productCount: 2,
  },
  {
    _id: "cat-search-light",
    name: "Search Light",
    slug: "search-light",
    description: "Long-range optics",
    previewImage: "/images/eagle.webp",
    productCount: 1,
  },
  {
    _id: "cat-rechargeable",
    name: "Rechargeable",
    slug: "rechargeable",
    description: "Lithium backup power",
    previewImage: "/images/tigerpro.webp",
    productCount: 2,
  },
];

export const FALLBACK_RAW_PRODUCTS = [
  {
    _id: "eagle",
    name: "Eagle 3.1 GunLite",
    slug: "eagle",
    sku: "GL-EAGLE-31",
    brand: "GunLite",
    description:
      "High-power professional rechargeable search light designed for long-range focus, emergency usage and industrial applications. Features a 50W LED chip and transparent Fresnel lens.",
    shortSpec: "50W LED · Type-C",
    specs: [
      { label: "LED Emitter", value: "50W High Power LED Chip" },
      { label: "Beam Optics", value: "Long-Range Focused Throw" },
      { label: "Zoom System", value: "Zoom-in / Zoom-out (Flood & Focus light)" },
      { label: "Optic Lens", value: "High-Transmittance Fresnel Lens" },
      { label: "Light Color Filters", value: "White, Blue, Green, Red" },
      { label: "Emergency Modes", value: "High / Medium / Strobe / SOS Function" },
      { label: "Battery Cell", value: "Rechargeable High-Capacity Lithium-Ion" },
      { label: "Charging & Output", value: "Type-C Fast Input with Power Bank USB Output" },
      { label: "Chassis Material", value: "Aircraft-Grade Hard-Anodized Aluminium Alloy" },
    ],
    category: { _id: "cat-search-light", name: "Search Light", slug: "search-light" },
    categories: [
      { _id: "cat-search-light", name: "Search Light", slug: "search-light" },
      { _id: "cat-rechargeable", name: "Rechargeable", slug: "rechargeable" },
      { _id: "cat-led-torch", name: "LED Torch", slug: "led-torch" },
    ],
    price: 2499,
    discountPrice: null,
    stockQuantity: 25,
<<<<<<< HEAD
    status: "active",
=======
    status: "published",
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
    isFeatured: true,
    badge: "Best Seller",
    warrantyEnabled: true,
    warrantyPrice: 500,
    warrantyLabel: "1-Year Warranty",
    heroImage: { url: "/images/eaglemain.webp", publicId: "" },
    images: [
      { url: "/images/eagle.webp", publicId: "", isPrimary: true },
      { url: "/images/egmain.webp", publicId: "", isPrimary: false },
      { url: "/images/eg1.webp", publicId: "", isPrimary: false },
      { url: "/images/eg2.webp", publicId: "", isPrimary: false },
      { url: "/images/eg3.webp", publicId: "", isPrimary: false },
      { url: "/images/eg4.webp", publicId: "", isPrimary: false },
    ],
  },
  {
    _id: "everest",
    name: "Everest LED GunLite",
    slug: "everest",
    sku: "GL-EVEREST-55",
    brand: "GunLite",
    description:
      "Multi-functional high-power rechargeable searchlight designed for long-range visibility, emergency situations, and professional use. Features 55W power output and massive 10000mAh battery.",
    shortSpec: "55W LED · 10,000mAh",
    specs: [
      { label: "Power Output", value: "55 Watts High Power LED" },
      { label: "Battery Capacity", value: "10000 mAh Lithium-ion Rechargeable" },
      { label: "Charging Input", value: "Type-C Fast Input Charging" },
      { label: "Power Bank Output", value: "USB Output to Charge Smartphones & Devices" },
      { label: "Switch Design", value: "Dual Tactical Switch System" },
      { label: "Lighting Array", value: "Main Forward Beam + Side Work Light + Tail Warning Light" },
      { label: "Recommended Use", value: "Emergency, Outdoor Trekking, Security & Industrial" },
    ],
    category: { _id: "cat-led-torch", name: "LED Torch", slug: "led-torch" },
    categories: [
      { _id: "cat-led-torch", name: "LED Torch", slug: "led-torch" },
      { _id: "cat-search-light", name: "Search Light", slug: "search-light" },
      { _id: "cat-rechargeable", name: "Rechargeable", slug: "rechargeable" },
    ],
    price: 1999,
    discountPrice: null,
    stockQuantity: 20,
<<<<<<< HEAD
    status: "active",
=======
    status: "published",
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
    isFeatured: true,
    badge: "New",
    warrantyEnabled: true,
    warrantyPrice: 500,
    warrantyLabel: "1-Year Warranty",
    heroImage: { url: "/images/evmain.webp", publicId: "" },
    images: [
      { url: "/images/everest.webp", publicId: "", isPrimary: true },
      { url: "/images/evmain.webp", publicId: "", isPrimary: false },
      { url: "/images/ev1.webp", publicId: "", isPrimary: false },
      { url: "/images/ev2.webp", publicId: "", isPrimary: false },
      { url: "/images/ev3.webp", publicId: "", isPrimary: false },
      { url: "/images/ev4.webp", publicId: "", isPrimary: false },
    ],
  },
  {
    _id: "tiger",
    name: "Tiger Pro-1 GunLite",
    slug: "tiger",
    sku: "GL-TIGER-P1",
    brand: "GunLite",
    description:
      "High-quality rechargeable aluminium flashlight designed for everyday carry, emergency lighting, and professional duties. Equipped with authentic USA-made CREE LED.",
    shortSpec: "500 Lm · 4000mAh",
    specs: [
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
    ],
    category: { _id: "cat-rechargeable", name: "Rechargeable", slug: "rechargeable" },
    categories: [
      { _id: "cat-rechargeable", name: "Rechargeable", slug: "rechargeable" },
      { _id: "cat-led-torch", name: "LED Torch", slug: "led-torch" },
    ],
    price: 1499,
    discountPrice: null,
    stockQuantity: 30,
<<<<<<< HEAD
    status: "active",
=======
    status: "published",
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
    isFeatured: true,
    badge: "",
    warrantyEnabled: true,
    warrantyPrice: 500,
    warrantyLabel: "1-Year Warranty",
    heroImage: { url: "/images/timain.webp", publicId: "" },
    images: [
      { url: "/images/tigerpro.webp", publicId: "", isPrimary: true },
      { url: "/images/timain.webp", publicId: "", isPrimary: false },
    ],
  },
  {
    _id: "sniper",
    name: "Sniper X2 GunLite",
    slug: "sniper",
    sku: "GL-SNIPER-X2",
    brand: "GunLite",
    description:
      "High-power rechargeable aluminium torch designed for long-range focus, outdoor usage, emergency lighting and professional needs. Features dual 18650 battery power.",
    shortSpec: "1000 Lm · Zoom",
    specs: [
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
    ],
    category: { _id: "cat-led-torch", name: "LED Torch", slug: "led-torch" },
    categories: [
      { _id: "cat-led-torch", name: "LED Torch", slug: "led-torch" },
      { _id: "cat-rechargeable", name: "Rechargeable", slug: "rechargeable" },
    ],
    price: 999,
    discountPrice: null,
    stockQuantity: 35,
<<<<<<< HEAD
    status: "active",
=======
    status: "published",
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
    isFeatured: true,
    badge: "",
    warrantyEnabled: true,
    warrantyPrice: 500,
    warrantyLabel: "1-Year Warranty",
    heroImage: { url: "/images/simain.webp", publicId: "" },
    images: [
      { url: "/images/sniper.webp", publicId: "", isPrimary: true },
      { url: "/images/simain.webp", publicId: "", isPrimary: false },
    ],
  },
];

export const FALLBACK_PRODUCTS = FALLBACK_RAW_PRODUCTS.map(adaptProduct);
