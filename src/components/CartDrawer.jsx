/**
 * CartDrawer — slide-in cart panel from the right side.
 *
 * Shows:
 *  - Each item: image, name, price, qty stepper, remove button, line total
 *  - Subtotal
 *  - "Send Order on WhatsApp" button (pre-filled message)
 *  - "Clear Cart" link
 *  - Empty-cart state
 */

import { Flashlight, AlertTriangle, MessageCircle, X } from "lucide-react";
import { useCart, formatPrice } from "../context/CartContext";
import { WHATSAPP_NUMBER } from "../config";

function buildWhatsAppMessage(items, cartTotal) {
  const lines = items.map((item, i) => {
    const lineTotal = item.priceNum > 0
      ? formatPrice(item.priceNum * item.quantity)
      : "On Request";
    return `${i + 1}. ${item.title} × ${item.quantity} — ${lineTotal}`;
  });

  const hasOnRequest = items.some((i) => i.priceNum === 0);

  const totalLine = cartTotal > 0
    ? `*Order Total: ${formatPrice(cartTotal)}*${hasOnRequest ? " _(+ items on request)_" : ""}`
    : `*Total: To be quoted (items are on request)*`;

  return [
    `*Order Enquiry — GunLite*`,
    ``,
    ...lines,
    ``,
    totalLine,
    ``,
    `Please reply with:`,
    `• Your Name`,
    `• Delivery Address`,
    `• Preferred Payment Method`,
    ``,
    `Thank you for choosing GunLite!`,
  ].join("\n");
}

export default function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
    cartTotalStr,
    isCartOpen,
    closeCart,
  } = useCart();

  const handleSendWhatsApp = () => {
    const message = buildWhatsAppMessage(items, cartTotal);
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  return (
    <>
      {/* ── Backdrop ── */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* ── Drawer panel ── */}
      <aside
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-bold text-gray-900">
            Your Cart{" "}
            {cartCount > 0 && (
              <span className="ml-2 rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="rounded-lg p-1.5 text-gray-400 hover:bg-white/[0.06] hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        {items.length === 0 ? (
          /* ── Empty state ── */
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#00e5ff]/10 border border-[#00e5ff]/20">
              <Flashlight className="h-10 w-10 text-[#00e5ff]" />
            </div>
            <p className="text-lg font-semibold text-gray-800">Your cart is empty</p>
            <p className="text-sm text-gray-500">
              Browse our collection and add a torch to your cart.
            </p>
            <button
              onClick={closeCart}
              className="mt-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
            >
              Shop Now →
            </button>
          </div>
        ) : (
          <>
            {/* ── Item list ── */}
            <ul className="flex-1 divide-y divide-gray-100 overflow-y-auto px-5 py-2">
              {items.map((item) => {
                const lineTotal = item.priceNum > 0
                  ? formatPrice(item.priceNum * item.quantity)
                  : "On Request";

                return (
                  <li key={item.id} className="flex gap-4 py-4">
                    {/* Image */}
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-50 p-1 border border-gray-100">
                      <img
                        src={item.img}
                        alt={`${item.title} - GunLite cart item`}
                        width={64}
                        height={64}
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex flex-1 flex-col gap-1 min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.price}</p>

                      {/* Quantity stepper */}
                      <div className="mt-1 flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 transition text-sm font-bold"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600 transition text-sm font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Line total + Remove */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <p className="text-sm font-bold text-blue-700">{lineTotal}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.title}`}
                        className="mt-auto text-xs text-red-500 hover:text-red-700 hover:underline transition"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* ── Footer: totals + actions ── */}
            <div className="border-t border-gray-200 bg-gray-50 px-5 py-5 space-y-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Subtotal ({cartCount} item{cartCount !== 1 ? "s" : ""})</span>
                <span className="text-lg font-bold text-gray-900">
                  {cartTotalStr ?? "To be quoted"}
                </span>
              </div>

              {/* On-request notice */}
              {items.some((i) => i.priceNum === 0) && (
                <p className="flex items-start gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2 text-xs text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>One or more items are priced <strong>On Request</strong>. We will confirm the final price on WhatsApp.</span>
                </p>
              )}

              {/* Send on WhatsApp */}
              <button
                onClick={handleSendWhatsApp}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-500 py-3.5 text-sm font-bold text-white shadow hover:bg-green-600 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>Send Order on WhatsApp</span>
              </button>

              {/* Clear cart */}
              <div className="flex items-center justify-between">
                <button
                  onClick={closeCart}
                  className="text-xs text-gray-500 hover:text-gray-700 hover:underline transition"
                >
                  ← Continue Shopping
                </button>
                <button
                  onClick={clearCart}
                  className="text-xs text-red-500 hover:text-red-700 hover:underline transition"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

