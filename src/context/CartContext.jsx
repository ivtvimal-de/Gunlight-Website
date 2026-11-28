/**
 * CartContext — GunLite shopping cart
 *
 * Provides: items, addItem, removeItem, updateQuantity, clearCart,
 *           cartCount, cartTotal, cartTotalStr,
 *           isCartOpen, openCart, closeCart
 *
 * Persistence: localStorage key "gunlite_cart"
 * Edge-cases handled:
 *   - localStorage unavailable (private/incognito) → silent no-op
 *   - Price "On Request" or non-numeric → priceNum = 0, excluded from total
 *   - quantity clamp: never goes below 1
 */

import { createContext, useContext, useReducer, useEffect, useState, useCallback } from "react";

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Extract a numeric rupee value from strings like "₹2,499".
 *  Returns 0 for "On Request", null, undefined, or any non-numeric string. */
export function parsePriceNum(priceStr) {
  if (!priceStr || typeof priceStr !== "string") return 0;
  const digits = priceStr.replace(/[₹,\s]/g, "");
  const n = parseFloat(digits);
  return isNaN(n) ? 0 : n;
}

/** Format a numeric value back to "₹X,XXX" */
export function formatPrice(num) {
  if (!num || num === 0) return "On Request";
  return "₹" + num.toLocaleString("en-IN");
}

const LS_KEY = "gunlite_cart";

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  } catch {
    /* localStorage unavailable — silent no-op */
  }
}

// ── Reducer ──────────────────────────────────────────────────────────────────

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const { title, img } = action.payload;
      const titleHi = action.payload.titleHi || action.payload.nameHi || "";
      const warrantyLabel = action.payload.warrantyLabel || "";
      const warrantyLabelHi = action.payload.warrantyLabelHi || "";
      const baseId = action.payload.baseId || action.payload.id;
      const hasWarranty = Boolean(action.payload.hasWarranty);
      const warrantyFee = hasWarranty ? (action.payload.warrantyFee ?? 500) : 0;
      const cartId = hasWarranty ? `${baseId}__warranty` : baseId;
      const basePriceNum =
        action.payload.basePriceNum ?? parsePriceNum(action.payload.price);
      const priceNum = basePriceNum > 0 ? basePriceNum + warrantyFee : 0;
      const price = priceNum > 0 ? formatPrice(priceNum) : action.payload.price;
      const quantityToAdd = action.payload.quantity ?? 1;

      const existing = state.find((i) => i.id === cartId);
      if (existing) {
        return state.map((i) =>
          i.id === cartId
            ? {
                ...i,
                title,
                titleHi: titleHi || i.titleHi || "",
                warrantyLabel: warrantyLabel || i.warrantyLabel || "",
                warrantyLabelHi: warrantyLabelHi || i.warrantyLabelHi || "",
                quantity: i.quantity + quantityToAdd,
              }
            : i
        );
      }
      return [
        ...state,
        {
          id: cartId,
          baseId,
          title,
          titleHi,
          warrantyLabel,
          warrantyLabelHi,
          price,
          priceNum,
          basePriceNum,
          hasWarranty,
          warrantyFee,
          img,
          quantity: quantityToAdd,
        },
      ];
    }

    case "TOGGLE_WARRANTY": {
      const { id, warrantyFee = 500 } = action.payload;
      const target = state.find((i) => i.id === id);
      if (!target) return state;

      const nextWarranty = !target.hasWarranty;
      const baseId = target.baseId || String(target.id).replace(/__warranty$/, "");
      const nextId = nextWarranty ? `${baseId}__warranty` : baseId;
      const basePriceNum =
        target.basePriceNum ??
        (target.hasWarranty
          ? Math.max(0, target.priceNum - (target.warrantyFee ?? warrantyFee))
          : target.priceNum);
      const nextWarrantyFee = nextWarranty ? warrantyFee : 0;
      const nextPriceNum = basePriceNum > 0 ? basePriceNum + nextWarrantyFee : 0;
      const nextPrice = nextPriceNum > 0 ? formatPrice(nextPriceNum) : target.price;

      const duplicate = state.find((i) => i.id === nextId && i.id !== id);
      if (duplicate) {
        return state
          .filter((i) => i.id !== id)
          .map((i) =>
            i.id === nextId ? { ...i, quantity: i.quantity + target.quantity } : i
          );
      }

      return state.map((i) =>
        i.id === id
          ? {
              ...i,
              id: nextId,
              baseId,
              basePriceNum,
              hasWarranty: nextWarranty,
              warrantyFee: nextWarrantyFee,
              priceNum: nextPriceNum,
              price: nextPrice,
            }
          : i
      );
    }

    case "REMOVE_ITEM":
      return state.filter((i) => i.id !== action.payload);

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      const clamped = Math.max(1, Math.round(quantity)); // never below 1
      return state.map((i) => (i.id === id ? { ...i, quantity: clamped } : i));
    }

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
}

// ── Context ──────────────────────────────────────────────────────────────────

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadFromStorage);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Persist every time items change
  useEffect(() => {
    saveToStorage(items);
  }, [items]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isCartOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isCartOpen]);

  const addItem = useCallback((item) => dispatch({ type: "ADD_ITEM", payload: item }), []);
  const toggleWarranty = useCallback(
    (id, warrantyFee = 500) =>
      dispatch({ type: "TOGGLE_WARRANTY", payload: { id, warrantyFee } }),
    []
  );
  const removeItem = useCallback((id) => dispatch({ type: "REMOVE_ITEM", payload: id }), []);
  const updateQuantity = useCallback(
    (id, quantity) => dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } }),
    []
  );
  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  // Derived values
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = items.reduce((sum, i) => sum + i.priceNum * i.quantity, 0);
  const cartTotalStr = cartTotal > 0 ? formatPrice(cartTotal) : null;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        toggleWarranty,
        removeItem,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        cartTotalStr,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/** Convenience hook — throws if used outside <CartProvider> */
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

