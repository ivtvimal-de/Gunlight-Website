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

import { Flashlight, AlertTriangle, MessageCircle, X, Check } from "lucide-react";
import { useCart, formatPrice } from "../context/CartContext";
import { WHATSAPP_NUMBER, WARRANTY_OPTION } from "../config";

function buildWhatsAppMessage(items, cartTotal) {
  const lines = items.map((item, i) => {
    const lineTotal = item.priceNum > 0
      ? formatPrice(item.priceNum * item.quantity)
      : "On Request";
    const warrantySuffix = item.hasWarranty
      ? ` (with ${WARRANTY_OPTION.label} +₹${item.warrantyFee ?? WARRANTY_OPTION.fee})`
      : "";
    return `${i + 1}. ${item.title}${warrantySuffix} × ${item.quantity} — ${lineTotal}`;
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
    toggleWarranty,
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
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* ── Drawer panel ── */}
      <aside
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white border-l border-[var(--border-subtle)] text-[var(--text-primary)] shadow-2xl transition-transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-5 py-4 bg-[var(--bg-canvas)]">
          <div className="flex items-center gap-2">
            <h2 className="font-['Outfit'] text-lg font-bold text-[var(--text-primary)]">
              Your Cart
            </h2>
            {cartCount > 0 && (
              <span className="rounded-full bg-[var(--accent-tint)] border border-[var(--border-subtle)] px-2 py-0.5 text-xs font-bold text-[var(--accent)]">
                {cartCount}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-surface-2)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        {items.length === 0 ? (
          /* ── Empty state ── */
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center bg-white">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)]">
              <Flashlight className="h-10 w-10 text-[var(--accent)]" />
            </div>
            <p className="font-['Outfit'] text-lg font-bold text-[var(--text-primary)]">Your cart is empty</p>
            <p className="text-sm text-[var(--text-muted)]">
              Browse our collection and add a torch to your cart.
            </p>
            <button
              onClick={closeCart}
              className="mt-2 rounded-lg bg-[var(--accent)] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[var(--accent-hover)] transition-colors shadow-xs"
            >
              Shop Now →
            </button>
          </div>
        ) : (
          <>
            {/* ── Item list ── */}
            <ul className="flex-1 divide-y divide-[var(--border-subtle)] overflow-y-auto px-5 py-2 bg-white">
              {items.map((item) => {
                const lineTotal = item.priceNum > 0
                  ? formatPrice(item.priceNum * item.quantity)
                  : "On Request";

                return (
                  <li key={item.id} className="flex gap-4 py-4">
                    {/* Image */}
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[var(--bg-surface-2)] p-1.5 border border-[var(--border-subtle)]">
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
                      <p className="truncate font-['Outfit'] text-sm font-bold text-[var(--text-primary)]">{item.title}</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {item.price}
                        {item.hasWarranty ? ` (incl. ₹${item.warrantyFee ?? WARRANTY_OPTION.fee} warranty)` : ""}
                      </p>

                      {/* Optional 1-Year Warranty toggle inside cart */}
                      {item.priceNum > 0 && (
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={Boolean(item.hasWarranty)}
                          onClick={() => toggleWarranty(item.id, WARRANTY_OPTION.fee)}
                          className={`mt-0.5 inline-flex items-center gap-1.5 w-fit rounded-md border px-2 py-1 text-[11px] font-medium transition-colors ${
                            item.hasWarranty
                              ? "border-[var(--accent)]/40 bg-[var(--accent-tint)] text-[var(--accent)]"
                              : "border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
                          }`}
                        >
                          <span
                            className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[4px] border ${
                              item.hasWarranty
                                ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                                : "border-[#B8B8B0] bg-white"
                            }`}
                          >
                            {item.hasWarranty && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                          </span>
                          <span>{WARRANTY_OPTION.label} (+₹{WARRANTY_OPTION.fee})</span>
                        </button>
                      )}

                      {/* Quantity stepper */}
                      <div className="mt-1 flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-40 transition-colors text-sm font-bold"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-xs font-semibold text-[var(--text-primary)]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors text-sm font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Line total + Remove */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <p className="font-['Outfit'] text-sm font-bold text-[var(--accent)]">{lineTotal}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.title}`}
                        className="mt-auto text-xs text-[var(--text-muted)] hover:text-red-500 hover:underline transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* ── Footer: totals + actions ── */}
            <div className="border-t border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-5 py-5 space-y-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-muted)]">Subtotal ({cartCount} item{cartCount !== 1 ? "s" : ""})</span>
                <span className="font-['Outfit'] text-lg font-bold text-[var(--text-primary)]">
                  {cartTotalStr ?? "To be quoted"}
                </span>
              </div>

              {/* On-request notice */}
              {items.some((i) => i.priceNum === 0) && (
                <p className="flex items-start gap-2 rounded-lg bg-[var(--accent-tint)] border border-[var(--border-subtle)] px-3 py-2 text-xs text-[var(--accent)] font-medium">
                  <AlertTriangle className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                  <span>One or more items are priced <strong>On Request</strong>. We will confirm the final price on WhatsApp.</span>
                </p>
              )}

              {/* Send on WhatsApp */}
              <button
                onClick={handleSendWhatsApp}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[var(--accent)] py-3.5 text-xs font-semibold text-white shadow-xs hover:bg-[var(--accent-hover)] transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>Send Order on WhatsApp</span>
              </button>

              {/* Clear cart */}
              <div className="flex items-center justify-between">
                <button
                  onClick={closeCart}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:underline transition-colors"
                >
                  ← Continue Shopping
                </button>
                <button
                  onClick={clearCart}
                  className="text-xs text-[var(--text-muted)] hover:text-red-500 hover:underline transition-colors"
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
