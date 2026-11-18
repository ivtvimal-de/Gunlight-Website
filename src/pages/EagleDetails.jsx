import { useState } from "react";
import {
  Zap,
  Ruler,
  ZoomIn,
  Eye,
  Palette,
  AlertTriangle,
  Battery,
  BatteryCharging,
  Layers,
  Check,
} from "lucide-react";
import { WHATSAPP_URL } from "../config";
import { useCart } from "../context/CartContext";
import SEO from "../components/SEO";

const PRODUCT = {
  id: "eagle",
  title: "Eagle 3.1 GunLite",
  price: "₹2,499",
  img: "/images/egmain.webp",
};

export default function EagleDetails() {
  const images = [
    "/images/egmain.webp",
    "/images/eg1.webp",
    "/images/eg2.webp",
    "/images/eg3.webp",
    "/images/eg4.webp",
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
        title="Eagle 3.1 GunLite | 50W High-Power LED Search Light"
        description="Eagle 3.1 GunLite: 50W High Power LED chip, long-range focused beam, zoom-in/out, multi-color lenses, and Type-C rechargeable battery. Order directly on WhatsApp."
        path="/eagle"
        image="/images/egmain.webp"
        type="product"
      />
      <main className="pt-20 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* LEFT – SPECIFICATIONS */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Eagle 3.1 GunLite
            </h1>
            <p className="text-2xl font-bold text-blue-600 mb-4">{PRODUCT.price}</p>

            <p className="text-gray-600 mb-6">
              High-power professional rechargeable search light designed for
              long-range focus, emergency usage and industrial applications.
            </p>

            <ul className="space-y-3 text-gray-700 text-sm mb-8">
              <li className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#00e5ff]/10 text-[#00e5ff]">
                  <Zap className="w-3.5 h-3.5" />
                </span>
                <span><b>LED Power:</b> 50W High Power LED Chip</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#00e5ff]/10 text-[#00e5ff]">
                  <Ruler className="w-3.5 h-3.5" />
                </span>
                <span><b>Beam Range:</b> Long-range focused beam</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#00e5ff]/10 text-[#00e5ff]">
                  <ZoomIn className="w-3.5 h-3.5" />
                </span>
                <span><b>Zoom:</b> Zoom-in / Zoom-out (Flood &amp; Focus light)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#00e5ff]/10 text-[#00e5ff]">
                  <Eye className="w-3.5 h-3.5" />
                </span>
                <span><b>Lens:</b> Highly transparent Fresnel lens</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#00e5ff]/10 text-[#00e5ff]">
                  <Palette className="w-3.5 h-3.5" />
                </span>
                <span><b>Light Colors:</b> White, Blue, Green, Red</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#00e5ff]/10 text-[#00e5ff]">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                </span>
                <span><b>Emergency:</b> Emergency ignition / SOS function</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#00e5ff]/10 text-[#00e5ff]">
                  <Battery className="w-3.5 h-3.5" />
                </span>
                <span><b>Battery:</b> Rechargeable lithium-ion battery</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#00e5ff]/10 text-[#00e5ff]">
                  <BatteryCharging className="w-3.5 h-3.5" />
                </span>
                <span><b>Charging:</b> Type-C input with power bank output</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#00e5ff]/10 text-[#00e5ff]">
                  <Layers className="w-3.5 h-3.5" />
                </span>
                <span><b>Body:</b> Strong aluminum alloy body</span>
              </li>
            </ul>

            {/* ── Add to Cart ── */}
            <div className="flex flex-col gap-3">
              {/* Quantity stepper */}
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

              {/* Buttons row */}
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

          {/* RIGHT – IMAGES */}
          <div>
            <div className="bg-white rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] transition-all duration-300 mb-3 flex items-center justify-center min-h-[360px]">
              <img
                src={activeImg}
                alt="Eagle 3.1 GunLite 50W high-power searchlight with aluminium body"
                width={500}
                height={350}
                className="w-full h-[350px] object-contain rounded-xl"
              />
            </div>

            <div className="flex gap-3 flex-wrap">
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
                    alt={`Eagle 3.1 GunLite angle view ${index + 1}`}
                    width={64}
                    height={64}
                    className="h-16 w-16 object-contain"
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
