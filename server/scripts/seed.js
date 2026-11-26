import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB, disconnectDB } from "../config/db.js";
import { Admin, Category, Product } from "../storage/models.js";

const INITIAL_CATEGORIES = [
  {
    name: "LED Torch",
    slug: "led-torch",
    description: "Handheld high-beam LED torches for everyday, industrial, and outdoor tasks.",
    image: { url: "/images/everest.webp", publicId: "" },
    isActive: true,
    displayOrder: 1,
  },
  {
    name: "Search Light",
    slug: "search-light",
    description: "Long-range focused optics for security, agriculture, and night patrol.",
    image: { url: "/images/eagle.webp", publicId: "" },
    isActive: true,
    displayOrder: 2,
  },
  {
    name: "Rechargeable",
    slug: "rechargeable",
    description: "High-capacity lithium backup lighting with Type-C and USB fast charging.",
    image: { url: "/images/tigerpro.webp", publicId: "" },
    isActive: true,
    displayOrder: 3,
  },
];

function buildInitialProducts(categoryBySlug) {
  const ledTorchId = categoryBySlug["led-torch"]._id;
  const searchLightId = categoryBySlug["search-light"]._id;
  const rechargeableId = categoryBySlug["rechargeable"]._id;

  return [
    {
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
      category: searchLightId,
      categories: [searchLightId, rechargeableId, ledTorchId],
      price: 2499,
      discountPrice: null,
      stockQuantity: 25,
      status: "active",
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
      category: ledTorchId,
      categories: [ledTorchId, searchLightId, rechargeableId],
      price: 1999,
      discountPrice: null,
      stockQuantity: 20,
      status: "active",
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
      category: rechargeableId,
      categories: [rechargeableId, ledTorchId],
      price: 1499,
      discountPrice: null,
      stockQuantity: 30,
      status: "active",
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
      category: ledTorchId,
      categories: [ledTorchId, rechargeableId],
      price: 999,
      discountPrice: null,
      stockQuantity: 35,
      status: "active",
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
}

async function seed() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || "GunLite Administrator";

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD must be configured in server/.env before running the seed script."
    );
  }

  if (adminPassword.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters long.");
  }

  await connectDB();

  // 1. Seed initial admin account idempotently
  const normalizedEmail = adminEmail.toLowerCase().trim();
  const existingAdmin = await Admin.findOne({ email: normalizedEmail });
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  if (existingAdmin) {
    existingAdmin.name = adminName;
    existingAdmin.passwordHash = passwordHash;
    await existingAdmin.save();
    console.log(`Updated admin account: ${normalizedEmail}`);
  } else {
    await Admin.create({
      name: adminName,
      email: normalizedEmail,
      passwordHash,
      role: "admin",
    });
    console.log(`Created initial admin account: ${normalizedEmail}`);
  }

  // 2. Seed initial categories idempotently
  const categoryBySlug = {};
  for (const catData of INITIAL_CATEGORIES) {
    let cat = await Category.findOne({ slug: catData.slug });
    if (!cat) {
      cat = await Category.create(catData);
      console.log(`Seeded category: ${cat.name}`);
    } else {
      console.log(`Category already exists: ${cat.name}`);
    }
    categoryBySlug[catData.slug] = cat;
  }

  // 3. Seed the 4 flagship products if not already present
  const products = buildInitialProducts(categoryBySlug);
  for (const prodData of products) {
    const existing = await Product.findOne({ slug: prodData.slug });
    if (!existing) {
      await Product.create(prodData);
      console.log(`Seeded product: ${prodData.name}`);
    } else {
      console.log(`Product already exists: ${existing.name}`);
    }
  }

  console.log("Seed completed successfully.");
}

seed()
  .catch((err) => {
    console.error("Seed error:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDB();
  });
