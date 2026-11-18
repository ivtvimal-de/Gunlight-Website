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
      const { id, title, price, img } = action.payload;
      const priceNum = parsePriceNum(price);
      const existing = state.find((i) => i.id === id);
      if (existing) {
        return state.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + (action.payload.quantity ?? 1) } : i
        );
      }
      return [...state, { id, title, price, priceNum, img, quantity: action.payload.quantity ?? 1 }];
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

  const addItem    = useCallback((item) => dispatch({ type: "ADD_ITEM",        payload: item }), []);
  const removeItem = useCallback((id)   => dispatch({ type: "REMOVE_ITEM",     payload: id   }), []);
  const updateQuantity = useCallback((id, quantity) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } }), []);
  const clearCart  = useCallback(()     => dispatch({ type: "CLEAR_CART" }), []);
  const openCart   = useCallback(()     => setIsCartOpen(true),  []);
  const closeCart  = useCallback(()     => setIsCartOpen(false), []);

  // Derived values
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = items.reduce((sum, i) => sum + i.priceNum * i.quantity, 0);
  const cartTotalStr = cartTotal > 0 ? formatPrice(cartTotal) : null;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
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

