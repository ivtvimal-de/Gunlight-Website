import { useState } from "react";
import {
  Zap,
  Cpu,
  Sun,
  BatteryCharging,
  Battery,
  Clock,
  Layers,
  Ruler,
  Sliders,
  ShieldCheck,
  Check,
} from "lucide-react";
import { WHATSAPP_URL, COMPANY } from "../config";
import { useCart } from "../context/CartContext";
import SEO from "../components/SEO";

const PRODUCT = {
  id: "tiger",
  title: "Tiger Pro-1 GunLite",
  price: "₹1,499",
  img: "/images/timain.webp",
};

export default function TigerDetails() {
  const images = [
    "/images/timain.webp",
    "/images/tigerpro.webp",
  ];

  const [activeImg, setActiveImg] = useState(images[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem, openCart, items } = useCart();

  const inCart = items.find((i) => i.id === PRODUCT.id);

  const handleAddToCart = () => {
    addItem({ ...PRODUCT, quantity: qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <SEO
        title="Tiger Pro-1 GunLite | 500 Lumens Rechargeable Flashlight"
        description="Tiger Pro-1 GunLite: CREE LED emitter, 4000mAh lithium battery, 8-hour backup, Type-C charging, and solid aluminium construction. Buy directly over WhatsApp."
        path="/tiger"
        image="/images/timain.webp"
        type="product"
      />
      <main className="pt-20 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* LEFT SIDE – PRODUCT INFO */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Tiger Pro-1 GunLite
            </h1>
            <p className="text-2xl font-bold text-blue-600 mb-4">{PRODUCT.price}</p>

            <p className="text-gray-600 mb-6">
              High-quality rechargeable aluminium flashlight designed for everyday
              use, emergency lighting, and professional applications.
            </p>

            <ul className="space-y-3 text-sm text-gray-700 mb-8">
              <li className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#00e5ff]/10 text-[#00e5ff]">
                  <Zap className="w-3.5 h-3.5" />
                </span>
                <span><b>LED:</b> CREE LED (Made in USA)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#00e5ff]/10 text-[#00e5ff]">
                  <Cpu className="w-3.5 h-3.5" />
                </span>
                <span><b>Technology:</b> German Technology</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#00e5ff]/10 text-[#00e5ff]">
                  <Sun className="w-3.5 h-3.5" />
                </span>
                <span><b>Brightness:</b> 500 Lumens</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#00e5ff]/10 text-[#00e5ff]">
                  <BatteryCharging className="w-3.5 h-3.5" />
                </span>
                <span><b>Charging:</b> USB Type-C</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#00e5ff]/10 text-[#00e5ff]">
                  <Battery className="w-3.5 h-3.5" />
                </span>
                <span><b>Battery:</b> 4000 mAh Lithium-ion (3.7V)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#00e5ff]/10 text-[#00e5ff]">
                  <Clock className="w-3.5 h-3.5" />
                </span>
                <span><b>Backup:</b> Up to 8 hours (~300 min working time)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#00e5ff]/10 text-[#00e5ff]">
                  <Layers className="w-3.5 h-3.5" />
                </span>
                <span><b>Body:</b> Strong Aluminium Flashlight</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#00e5ff]/10 text-[#00e5ff]">
                  <Ruler className="w-3.5 h-3.5" />
                </span>
                <span><b>Length:</b> 10.5 inches</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#00e5ff]/10 text-[#00e5ff]">
                  <Sliders className="w-3.5 h-3.5" />
                </span>
                <span><b>Modes:</b> Low / Medium / Flickering / Off</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#00e5ff]/10 text-[#00e5ff]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </span>
                <span><b>Warranty:</b> 1 Year</span>
              </li>
            </ul>

            {/* ── Add to Cart ── */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Qty:</span>
                <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="text-lg font-bold text-gray-500 hover:text-blue-600 disabled:opacity-30 transition"
                    disabled={qty <= 1}
                  >−</button>
                  <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="text-lg font-bold text-gray-500 hover:text-blue-600 transition"
                  >+</button>
                </div>
                {inCart && (
                  <span className="text-xs text-blue-600 font-medium">
                    ({inCart.quantity} already in cart)
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 rounded-lg px-6 py-3 font-semibold text-sm transition-all ${
                    added
                      ? "bg-green-500 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {added ? (
                    <span className="inline-flex items-center gap-1.5 justify-center">
                      <Check className="w-4 h-4 text-white" /> Added to Cart!
                    </span>
                  ) : (
                    "Add to Cart"
                  )}
                </button>

                {inCart && (
                  <button
                    onClick={openCart}
                    className="rounded-lg border border-blue-600 px-5 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition"
                  >
                    View Cart
                  </button>
                )}
              </div>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg font-semibold text-sm text-center hover:bg-green-600 transition"
              >
                Enquire on WhatsApp
              </a>
            </div>
          </div>

          {/* RIGHT SIDE – IMAGES */}
          <div>
            {/* BIG IMAGE */}
            <div className="bg-white border rounded-xl p-4 mb-4 flex items-center justify-center min-h-[360px]">
              <img
                src={activeImg}
                alt="Tiger Pro-1 GunLite 500 lumens rechargeable aluminium torch"
                width={500}
                height={360}
                className="w-full h-[360px] object-contain"
              />
            </div>

            {/* THUMBNAILS */}
            <div className="grid grid-cols-2 gap-3">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImg(img)}
                  className={`border rounded-lg p-2 transition ${
                    activeImg === img ? "border-blue-500 bg-blue-50" : "border-gray-300"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Tiger Pro-1 GunLite angle view ${index + 1}`}
                    width={64}
                    height={64}
                    className="h-16 w-full object-contain"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
