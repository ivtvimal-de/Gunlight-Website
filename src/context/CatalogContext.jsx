import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import {
  adaptProduct,
  FALLBACK_CATEGORIES,
  FALLBACK_PRODUCTS,
} from "../utils/productAdapter";

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  const refreshCatalog = useCallback(async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        api.getPublicProducts({ limit: 100 }),
        api.getPublicCategories(),
      ]);

      if (Array.isArray(prodRes?.products)) {
        setProducts(prodRes.products.map(adaptProduct));
      }
      if (Array.isArray(catRes?.categories)) {
        setCategories(catRes.categories);
      }
      setIsLive(true);
    } catch {
      // Keep fallback data when backend is unavailable so public site never breaks
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCatalog();
  }, [refreshCatalog]);

  const getProductBySlugOrId = useCallback(
    (idOrSlug) => {
      if (!idOrSlug) return null;
      const needle = String(idOrSlug).toLowerCase();
      return (
        products.find(
          (p) =>
            String(p._id).toLowerCase() === needle ||
            String(p.slug).toLowerCase() === needle ||
            String(p.id).toLowerCase() === needle
        ) || null
      );
    },
    [products]
  );

  return (
    <CatalogContext.Provider
      value={{
        products,
        categories,
        loading,
        isLive,
        refreshCatalog,
        getProductBySlugOrId,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used inside <CatalogProvider>");
  return ctx;
}
