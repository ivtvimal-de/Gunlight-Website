import { useState } from "react";
import {
  Zap,
  Battery,
  BatteryCharging,
  RefreshCw,
  Sliders,
  Sun,
  ShieldCheck,
  Check,
} from "lucide-react";
import { WHATSAPP_URL } from "../config";
import { useCart } from "../context/CartContext";
import SEO from "../components/SEO";

const PRODUCT = {
  id: "everest",
  title: "Everest LED GunLite",
  price: "₹1,999",
  img: "/images/evmain.webp",
};

export default function EverestDetails() {
  const images = [
    "/images/evmain.webp",
    "/images/ev1.webp",
    "/images/ev2.webp",
    "/images/ev3.webp",
    "/images/ev4.webp",
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
        title="Everest LED GunLite | 55W Tri-Light Searchlight"
        description="Everest LED GunLite: 55 Watts high power output, 10000mAh battery with power bank function, main light, side light, and tail light. Order on WhatsApp with fast Pan-India shipping."
        path="/everest"
        image="/images/evmain.webp"
        type="product"
      />
      <main className="pt-20 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* LEFT SIDE – PRODUCT INFO */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Everest LED GunLite
            </h1>
            <p className="text-2xl font-bold text-blue-600 mb-4">{PRODUCT.price}</p>

            <p className="text-gray-600 mb-6">
              Multi-functional high-power rechargeable searchlight designed for
              long-range visibility, emergency situations, and professional use.
            </p>

            <ul className="space-y-3 text-sm text-gray-700 mb-8">
              <li className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#00e5ff]/10 text-[#00e5ff]">
                  <Zap className="w-3.5 h-3.5" />
                </span>
                <span><b>Power Output:</b> 55 Watts high power LED</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#00e5ff]/10 text-[#00e5ff]">
                  <Battery className="w-3.5 h-3.5" />
                </span>
                <span><b>Battery:</b> 10000 mAh Lithium-ion rechargeable battery</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#00e5ff]/10 text-[#00e5ff]">
                  <BatteryCharging className="w-3.5 h-3.5" />
                </span>
                <span><b>Charging:</b> Type-C input charging</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#00e5ff]/10 text-[#00e5ff]">
                  <RefreshCw className="w-3.5 h-3.5" />
                </span>
                <span><b>Power Bank:</b> Output function to charge other devices</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#00e5ff]/10 text-[#00e5ff]">
                  <Sliders className="w-3.5 h-3.5" />
                </span>
                <span><b>Switch Design:</b> Dual switch system</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#00e5ff]/10 text-[#00e5ff]">
                  <Sun className="w-3.5 h-3.5" />
                </span>
                <span><b>Lighting:</b> Main light + Side light + Tail light</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#00e5ff]/10 text-[#00e5ff]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </span>
                <span><b>Usage:</b> Emergency, outdoor, security &amp; industrial use</span>
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
            <div className="bg-white rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] transition-all duration-300 mb-3 flex items-center justify-center min-h-[360px]">
              <img
                src={activeImg}
                alt="Everest LED GunLite 55W tri-light searchlight with 10000mAh battery"
                width={500}
                height={350}
                className="w-full h-[350px] object-contain rounded-xl"
              />
            </div>

            <div className="grid grid-cols-5 gap-2 sm:gap-3">
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
                    alt={`Everest LED GunLite angle view ${index + 1}`}
                    width={64}
                    height={64}
                    className="h-14 sm:h-16 w-full object-contain"
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
