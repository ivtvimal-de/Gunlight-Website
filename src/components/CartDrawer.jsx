/**
 * CartDrawer — slide-in cart panel from the right side.
 */

import { Flashlight, AlertTriangle, MessageCircle, X, Trash2 } from "lucide-react";
import { useCart, formatPrice } from "../context/CartContext";
import { WHATSAPP_NUMBER, WARRANTY_OPTION } from "../config";
import { useTranslation } from "../i18n/LanguageContext";
import { formatLocalizedPrice, translateWarrantyLabel } from "../i18n/catalogI18n";

function buildWhatsAppMessage(items, cartTotal, productsSubtotal, warrantyTotal) {
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

  const summaryLines = [];
  if (warrantyTotal > 0 && productsSubtotal > 0) {
    summaryLines.push(`Products Subtotal: ${formatPrice(productsSubtotal)}`);
    summaryLines.push(`${WARRANTY_OPTION.label}: +${formatPrice(warrantyTotal)}`);
  }

  const totalLine = cartTotal > 0
    ? `*Order Total: ${formatPrice(cartTotal)}*${hasOnRequest ? " _(+ items on request)_" : ""}`
    : `*Total: To be quoted (items are on request)*`;

  return [
    `*Order Enquiry — GunLite*`,
    ``,
    ...lines,
    ``,
    ...summaryLines,
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
  const { language, t } = useTranslation();

  // Compute tallied product subtotal and warranty add-on total
  const warrantyCount = items.reduce(
    (sum, item) => sum + (item.hasWarranty ? item.quantity : 0),
    0
  );
  const warrantyTotal = items.reduce((sum, item) => {
    if (!item.hasWarranty || item.priceNum <= 0) return sum;
    return sum + (item.warrantyFee ?? WARRANTY_OPTION.fee) * item.quantity;
  }, 0);
  const productsSubtotal = Math.max(0, cartTotal - warrantyTotal);

  const localizedWarrantyLabel = translateWarrantyLabel(WARRANTY_OPTION.label, language);
  const itemUnit = cartCount === 1 ? t("common.itemSingular") : t("common.itemPlural");

  const handleSendWhatsApp = () => {
    const message = buildWhatsAppMessage(items, cartTotal, productsSubtotal, warrantyTotal);
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
        aria-label={t("cart.ariaLabel")}
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white border-l border-[var(--border-subtle)] text-[var(--text-primary)] shadow-2xl transition-transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-5 py-4 bg-[var(--bg-canvas)]">
          <div className="flex items-center gap-2">
            <h2 className="font-['Outfit'] text-lg font-bold text-[var(--text-primary)]">
              {t("cart.title")}
            </h2>
            {cartCount > 0 && (
              <span className="rounded-full bg-[var(--accent-tint)] border border-[var(--border-subtle)] px-2 py-0.5 text-xs font-bold text-[var(--accent)]">
                {cartCount}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            aria-label={t("cart.closeAria")}
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
            <p className="font-['Outfit'] text-lg font-bold text-[var(--text-primary)]">
              {t("cart.emptyTitle")}
            </p>
            <p className="text-sm text-[var(--text-muted)]">
              {t("cart.emptyDesc")}
            </p>
            <button
              onClick={closeCart}
              className="mt-2 rounded-lg bg-[var(--accent)] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[var(--accent-hover)] transition-colors shadow-xs"
            >
              {t("cart.emptyCta")}
            </button>
          </div>
        ) : (
          <>
            {/* ── Item list ── */}
            <ul className="flex-1 divide-y divide-[var(--border-subtle)] overflow-y-auto px-5 py-2 bg-white">
              {items.map((item) => {
                const lineTotal = item.priceNum > 0
                  ? formatPrice(item.priceNum * item.quantity)
                  : t("common.onRequest");

                return (
                  <li key={item.id} className="flex gap-4 py-4">
                    {/* Image */}
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[var(--bg-surface-2)] p-1.5 border border-[var(--border-subtle)]">
                      <img
                        src={item.img}
                        alt={t("cart.itemAlt", { title: item.title })}
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
                        {item.hasWarranty && item.basePriceNum > 0
                          ? formatPrice(item.basePriceNum)
                          : formatLocalizedPrice(item.price, t)}
                      </p>

                      {item.hasWarranty && (
                        <span className="inline-flex items-center w-fit rounded-md bg-[var(--accent-tint)] px-2 py-0.5 text-[10.5px] font-semibold text-[var(--accent)]">
                          {localizedWarrantyLabel} (+₹{item.warrantyFee ?? WARRANTY_OPTION.fee})
                        </span>
                      )}

                      {/* Quantity stepper */}
                      <div className="mt-1 flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          aria-label={t("cart.decreaseQtyAria")}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-40 transition-colors text-sm font-bold"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-xs font-semibold text-[var(--text-primary)]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label={t("cart.increaseQtyAria")}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors text-sm font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Line total + Remove Icon */}
                    <div className="flex flex-col items-end justify-between gap-1 shrink-0">
                      <p className="font-['Outfit'] text-sm font-bold text-[var(--accent)] tabular-nums">{lineTotal}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        aria-label={t("cart.removeItemAria", { title: item.title })}
                        title={t("cart.removeItemAria", { title: item.title })}
                        className="h-7 w-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* ── Footer: totals + actions ── */}
            <div className="border-t border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-5 py-5 space-y-4">
              {/* Tallied Breakdown */}
              <div className="space-y-1.5">
                {warrantyTotal > 0 && (
                  <>
                    <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                      <span>{t("cart.productsSubtotal", { count: cartCount, unit: itemUnit })}</span>
                      <span className="font-medium tabular-nums">{formatPrice(productsSubtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[var(--accent)]">
                      <span>{localizedWarrantyLabel} (×{warrantyCount})</span>
                      <span className="font-semibold tabular-nums">+{formatPrice(warrantyTotal)}</span>
                    </div>
                    <div className="my-1.5 border-t border-[var(--border-subtle)]" />
                  </>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-[var(--text-primary)]">
                    {warrantyTotal > 0
                      ? t("cart.totalAmount")
                      : t("cart.subtotal", { count: cartCount, unit: itemUnit })}
                  </span>
                  <span className="font-['Outfit'] text-lg font-bold text-[var(--text-primary)] tabular-nums">
                    {cartTotalStr ?? t("common.toBeQuoted")}
                  </span>
                </div>
              </div>

              {/* On-request notice */}
              {items.some((i) => i.priceNum === 0) && (
                <p className="flex items-start gap-2 rounded-lg bg-[var(--accent-tint)] border border-[var(--border-subtle)] px-3 py-2 text-xs text-[var(--accent)] font-medium">
                  <AlertTriangle className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                  <span>
                    {t("cart.onRequestNoticeBefore")}
                    <strong>{t("cart.onRequestNoticeBold")}</strong>
                    {t("cart.onRequestNoticeAfter")}
                  </span>
                </p>
              )}

              {/* Send on WhatsApp */}
              <button
                onClick={handleSendWhatsApp}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[var(--accent)] py-3.5 text-xs font-semibold text-white shadow-xs hover:bg-[var(--accent-hover)] transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>{t("cart.sendOrderWhatsapp")}</span>
              </button>

              {/* Clear cart */}
              <div className="flex items-center justify-between">
                <button
                  onClick={closeCart}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:underline transition-colors"
                >
                  {t("cart.continueShopping")}
                </button>
                <button
                  onClick={clearCart}
                  className="text-xs text-[var(--text-muted)] hover:text-red-500 hover:underline transition-colors"
                >
                  {t("cart.clearCart")}
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
