import {
  FALLBACK_CATEGORIES,
  FALLBACK_RAW_PRODUCTS,
} from "../utils/productAdapter";

const DEMO_FLAG_KEY = "gunlite_admin_demo";
const DEMO_STATE_KEY = "gunlite_demo_catalog_v1";

export const DEMO_ADMIN = {
  _id: "demo-admin",
  name: "Sample Admin (Preview)",
  email: "admin@gunlite.in",
  role: "admin",
  isDemo: true,
};

function clone(val) {
  return JSON.parse(JSON.stringify(val));
}

function makeSlug(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function makeId(prefix = "id") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

function createInitialState() {
  const now = new Date().toISOString();

  const categories = FALLBACK_CATEGORIES.map((c, idx) => ({
    _id: c._id,
    name: c.name,
    slug: c.slug,
    description: c.description || "",
    image: { url: c.previewImage || "", publicId: "" },
    isActive: true,
    displayOrder: idx + 1,
    createdAt: now,
    updatedAt: now,
  }));

  const brands = [
    {
      _id: "brand-gunlite",
      name: "GunLite",
      slug: "gunlite",
      tagline: "Professional LED torches and search lights from Coimbatore.",
      description:
        "Flagship high-power rechargeable LED torches and industrial searchlights.",
      logo: { url: "/images/logo.png", publicId: "" },
      bannerImage: { url: "/images/eaglemain.webp", publicId: "" },
      isFlagship: true,
      isComingSoon: false,
      isActive: true,
      displayOrder: 1,
      createdAt: now,
    },
    {
      _id: "brand-philips",
      name: "Philips",
      slug: "philips",
      tagline: "Global lighting innovation & rechargeable illumination.",
      description: "Upcoming illumination hardware partner.",
      logo: { url: "", publicId: "" },
      bannerImage: { url: "", publicId: "" },
      isFlagship: false,
      isComingSoon: true,
      isActive: true,
      displayOrder: 2,
      createdAt: now,
    },
    {
      _id: "brand-eveready",
      name: "Eveready",
      slug: "eveready",
      tagline: "Trusted everyday portable flashlights.",
      description: "Upcoming illumination hardware partner.",
      logo: { url: "", publicId: "" },
      bannerImage: { url: "", publicId: "" },
      isFlagship: false,
      isComingSoon: true,
      isActive: true,
      displayOrder: 3,
      createdAt: now,
    },
    {
      _id: "brand-wipro",
      name: "Wipro",
      slug: "wipro",
      tagline: "Durable emergency rechargeable torches.",
      description: "Upcoming illumination hardware partner.",
      logo: { url: "", publicId: "" },
      bannerImage: { url: "", publicId: "" },
      isFlagship: false,
      isComingSoon: true,
      isActive: true,
      displayOrder: 4,
      createdAt: now,
    },
    {
      _id: "brand-bajaj",
      name: "Bajaj",
      slug: "bajaj",
      tagline: "Reliable Indian household LED & emergency lighting.",
      description: "Upcoming illumination hardware partner.",
      logo: { url: "", publicId: "" },
      bannerImage: { url: "", publicId: "" },
      isFlagship: false,
      isComingSoon: true,
      isActive: true,
      displayOrder: 5,
      createdAt: now,
    },
    {
      _id: "brand-mi",
      name: "Mi",
      slug: "mi",
      tagline: "Compact smart rechargeable utility lights.",
      description: "Upcoming illumination hardware partner.",
      logo: { url: "", publicId: "" },
      bannerImage: { url: "", publicId: "" },
      isFlagship: false,
      isComingSoon: true,
      isActive: true,
      displayOrder: 6,
      createdAt: now,
    },
  ];

  const products = FALLBACK_RAW_PRODUCTS.map((p, idx) => ({
    ...clone(p),
    category: p.category?._id || p.category,
    categories: (p.categories || []).map((c) => c?._id || c),
    createdAt: new Date(Date.now() - idx * 3600 * 1000).toISOString(),
    updatedAt: now,
  }));

  const activities = [
    {
      _id: "act-1",
      action: "LOGIN",
      entityType: "auth",
      summary: "Opened Admin Panel in Sample Preview Mode",
      adminEmail: DEMO_ADMIN.email,
      createdAt: now,
    },
    {
      _id: "act-2",
      action: "CREATE_BRAND",
      entityType: "brand",
      summary: 'Loaded 6 catalog brands ("GunLite" flagship & partners)',
      adminEmail: DEMO_ADMIN.email,
      createdAt: new Date(Date.now() - 1800 * 1000).toISOString(),
    },
    {
      _id: "act-3",
      action: "CREATE_PRODUCT",
      entityType: "product",
      summary: "Loaded 4 GunLite flagship torch models",
      adminEmail: DEMO_ADMIN.email,
      createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
    },
  ];

  return { products, categories, brands, activities };
}

let memoryState = null;

function readDemoState() {
  if (memoryState) return memoryState;
  try {
    const raw = sessionStorage.getItem(DEMO_STATE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.products)) {
        memoryState = parsed;
        return memoryState;
      }
    }
  } catch {
    // Ignore storage issues in restricted browsers
  }
  memoryState = createInitialState();
  saveDemoState(memoryState);
  return memoryState;
}

function saveDemoState(state) {
  memoryState = state;
  try {
    sessionStorage.setItem(DEMO_STATE_KEY, JSON.stringify(state));
  } catch {
    // Fallback to in-memory only if sessionStorage quota exceeded
  }
}

function recordActivity(state, action, entityType, summary) {
  state.activities.unshift({
    _id: makeId("act"),
    action,
    entityType,
    summary,
    adminEmail: DEMO_ADMIN.email,
    createdAt: new Date().toISOString(),
  });
  state.activities = state.activities.slice(0, 20);
}

function populateProduct(product, categories) {
  const catMap = new Map(categories.map((c) => [String(c._id), c]));
  const primary = catMap.get(String(product.category));
  const multi = (product.categories || [])
    .map((id) => catMap.get(String(id)))
    .filter(Boolean);

  return {
    ...clone(product),
    category: primary
      ? { _id: primary._id, name: primary.name, slug: primary.slug }
      : null,
    categories: multi.map((c) => ({
      _id: c._id,
      name: c.name,
      slug: c.slug,
    })),
  };
}

function productMatchesBrand(productBrand, brand) {
  const pb = String(productBrand || "").trim().toLowerCase();
  const nameLower = String(brand?.name || "").trim().toLowerCase();
  const slugLower = String(brand?.slug || "").trim().toLowerCase();
  if (!pb) return slugLower === "gunlite" || Boolean(brand?.isFlagship);
  return pb === nameLower || pb === slugLower;
}

export function isDemoModeEnabled() {
  try {
    return sessionStorage.getItem(DEMO_FLAG_KEY) === "1";
  } catch {
    return Boolean(memoryState?.__enabled);
  }
}

export function enableDemoMode(email = DEMO_ADMIN.email) {
  const state = readDemoState();
  state.__enabled = true;
  if (email) {
    DEMO_ADMIN.email = String(email).trim() || "admin@gunlite.in";
  }
  try {
    sessionStorage.setItem(DEMO_FLAG_KEY, "1");
  } catch {
    // Ignore storage error
  }
  saveDemoState(state);
  return clone(DEMO_ADMIN);
}

export function disableDemoMode() {
  try {
    sessionStorage.removeItem(DEMO_FLAG_KEY);
  } catch {
    // Ignore storage error
  }
  if (memoryState) memoryState.__enabled = false;
}

export function uploadImagesDemo(files, onProgress) {
  const fileList = Array.from(files || []);
  return Promise.all(
    fileList.map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () =>
            resolve({
              url: String(reader.result || ""),
              publicId: makeId("demo-img"),
            });
          reader.onerror = () =>
            reject(new Error(`Could not read "${file.name}".`));
          reader.readAsDataURL(file);
        })
    )
  ).then((uploaded) => {
    if (typeof onProgress === "function") onProgress(100);
    return { success: true, files: uploaded };
  });
}

function parseQuery(pathWithQuery) {
  const [pathname, qs = ""] = String(pathWithQuery).split("?");
  const params = Object.fromEntries(new URLSearchParams(qs).entries());
  return { pathname, params };
}

export async function handleDemoRequest(
  path,
  { method = "GET", body, params = {} } = {}
) {
  const { pathname, params: pathParams } = parseQuery(path);
  const query = { ...pathParams, ...params };
  const state = readDemoState();
  const upperMethod = String(method).toUpperCase();

  // Auth endpoints
  if (pathname === "/api/admin/me") {
    return { success: true, admin: clone(DEMO_ADMIN) };
  }
  if (pathname === "/api/admin/login" && upperMethod === "POST") {
    const admin = enableDemoMode(body?.email || DEMO_ADMIN.email);
    return { success: true, admin, demo: true };
  }
  if (pathname === "/api/admin/logout" && upperMethod === "POST") {
    disableDemoMode();
    return { success: true };
  }

  // Upload cleanup
  if (pathname === "/api/admin/upload" && upperMethod === "DELETE") {
    return { success: true, message: "Image removed in sample mode." };
  }

  // Dashboard
  if (pathname === "/api/admin/dashboard") {
    const totalProducts = state.products.length;
    const publishedProducts = state.products.filter((p) => p.status === "published").length;
    const draftProducts = totalProducts - publishedProducts;
    const outOfStockProducts = state.products.filter(
      (p) => Number(p.stockQuantity) <= 0
    ).length;
    const lowStockProducts = state.products.filter(
      (p) => Number(p.stockQuantity) > 0 && Number(p.stockQuantity) <= 5
    ).length;
    const featuredProducts = state.products.filter((p) => p.isFeatured).length;
    const inStockHealthy = Math.max(
      0,
      totalProducts - outOfStockProducts - lowStockProducts
    );
    const totalStockUnits = state.products.reduce(
      (s, p) => s + (Number(p.stockQuantity) || 0),
      0
    );

    const categoryBreakdown = state.categories.map((cat) => {
      const cid = String(cat._id);
      const matched = state.products.filter(
        (p) =>
          String(p.category) === cid ||
          (p.categories || []).some((id) => String(id) === cid)
      );
      return {
        _id: cat._id,
        name: cat.name,
        slug: cat.slug,
        count: matched.length,
        publishedCount: matched.filter((m) => m.status === "published").length,
        totalStock: matched.reduce(
          (s, m) => s + (Number(m.stockQuantity) || 0),
          0
        ),
      };
    });

    const brandBreakdown = state.brands.map((b) => {
      const matched = state.products.filter((p) => productMatchesBrand(p.brand, b));
      return {
        _id: b._id,
        name: b.name,
        slug: b.slug,
        isComingSoon: Boolean(b.isComingSoon),
        count: matched.length,
        publishedCount: matched.filter((m) => m.status === "published").length,
        totalStock: matched.reduce(
          (s, m) => s + (Number(m.stockQuantity) || 0),
          0
        ),
      };
    });

    return {
      success: true,
      stats: {
        totalProducts,
        publishedProducts,
        draftProducts,
        outOfStockProducts,
        lowStockProducts,
        inStockHealthy,
        featuredProducts,
        totalCategories: state.categories.length,
        totalBrands: state.brands.length,
        activeBrands: state.brands.filter((b) => b.isActive && !b.isComingSoon)
          .length,
        totalStockUnits,
      },
      categoryBreakdown,
      brandBreakdown,
      stockDistribution: [
        { label: "In Stock (>5)", value: inStockHealthy, color: "#10B981" },
        { label: "Low Stock (1-5)", value: lowStockProducts, color: "#F59E0B" },
        { label: "Out of Stock", value: outOfStockProducts, color: "#EF4444" },
      ],
      recentProducts: state.products
        .slice(0, 6)
        .map((p) => populateProduct(p, state.categories)),
      recentActivities: clone(state.activities),
    };
  }

  // Public & Admin Products
  if (pathname === "/api/products" || pathname === "/api/admin/products") {
    if (pathname === "/api/admin/products" && upperMethod === "POST") {
      const created = {
        ...clone(body),
        _id: makeId("prod"),
        slug: makeSlug(body.slug || body.name) || makeId("item"),
        sku: String(body.sku || makeId("SKU")).toUpperCase(),
        brand: String(body.brand || "GunLite").trim(),
        status: body.status || "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.products.unshift(created);
      recordActivity(
        state,
        "CREATE_PRODUCT",
        "product",
        `Created product "${created.name}" (${created.sku})`
      );
      saveDemoState(state);
      return {
        success: true,
        product: populateProduct(created, state.categories),
      };
    }

    const isPublic = pathname === "/api/products";
    let list = state.products.filter((p) =>
      isPublic ? p.status === "published" : true
    );

    if (query.status === "published" || query.status === "draft") {
      list = list.filter((p) => p.status === query.status);
    }
    if (query.category && query.category !== "All") {
      const needle = String(query.category).toLowerCase();
      const cat = state.categories.find(
        (c) =>
          String(c._id).toLowerCase() === needle ||
          c.slug.toLowerCase() === needle ||
          c.name.toLowerCase() === needle
      );
      list = cat
        ? list.filter(
            (p) =>
              String(p.category) === String(cat._id) ||
              (p.categories || []).some((id) => String(id) === String(cat._id))
          )
        : [];
    }
    if (query.brand && query.brand !== "All") {
      const bNeedle = String(query.brand).toLowerCase();
      list = list.filter(
        (p) => String(p.brand || "GunLite").toLowerCase() === bNeedle
      );
    }
    if (query.stock === "out_of_stock") {
      list = list.filter((p) => Number(p.stockQuantity) <= 0);
    } else if (query.stock === "low_stock") {
      list = list.filter(
        (p) => Number(p.stockQuantity) > 0 && Number(p.stockQuantity) <= 5
      );
    } else if (query.stock === "in_stock") {
      list = list.filter((p) => Number(p.stockQuantity) > 0);
    }
    if (query.search && String(query.search).trim()) {
      const q = String(query.search).trim().toLowerCase();
      list = list.filter((p) =>
        `${p.name} ${p.sku} ${p.brand} ${p.shortSpec} ${p.description}`
          .toLowerCase()
          .includes(q)
      );
    }

    const pageNum = Math.max(1, parseInt(query.page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
    const total = list.length;
    const paged = list.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    return {
      success: true,
      products: paged.map((p) => populateProduct(p, state.categories)),
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.max(1, Math.ceil(total / limitNum)),
      },
    };
  }

  // Single Product (GET/PUT/DELETE)
  if (
    pathname.startsWith("/api/products/") ||
    pathname.startsWith("/api/admin/products/")
  ) {
    const idOrSlug = decodeURIComponent(pathname.split("/").pop());
    const idx = state.products.findIndex(
      (p) => String(p._id) === idOrSlug || String(p.slug) === idOrSlug
    );
    if (idx < 0) {
      const err = new Error("Product not found.");
      err.status = 404;
      throw err;
    }

    if (upperMethod === "PUT") {
      state.products[idx] = {
        ...state.products[idx],
        ...clone(body),
        updatedAt: new Date().toISOString(),
      };
      recordActivity(
        state,
        "UPDATE_PRODUCT",
        "product",
        `Updated product "${state.products[idx].name}"`
      );
      saveDemoState(state);
      return {
        success: true,
        product: populateProduct(state.products[idx], state.categories),
      };
    }

    if (upperMethod === "DELETE") {
      const removed = state.products.splice(idx, 1)[0];
      recordActivity(
        state,
        "DELETE_PRODUCT",
        "product",
        `Deleted product "${removed.name}"`
      );
      saveDemoState(state);
      return { success: true, message: "Product deleted." };
    }

    return {
      success: true,
      product: populateProduct(state.products[idx], state.categories),
    };
  }

  // Public & Admin Categories
  if (pathname === "/api/categories" || pathname === "/api/admin/categories") {
    if (pathname === "/api/admin/categories" && upperMethod === "POST") {
      const created = {
        _id: makeId("cat"),
        name: String(body.name || "").trim(),
        slug: makeSlug(body.slug || body.name),
        description: String(body.description || "").trim(),
        image: body.image || { url: "", publicId: "" },
        isActive: body.isActive !== false,
        displayOrder: Number(body.displayOrder) || state.categories.length + 1,
        createdAt: new Date().toISOString(),
      };
      state.categories.push(created);
      if (Array.isArray(body.productIds)) {
        state.products.forEach((p) => {
          if (body.productIds.includes(String(p._id))) {
            p.categories = Array.from(
              new Set([...(p.categories || []).map(String), String(created._id)])
            );
          }
        });
      }
      recordActivity(
        state,
        "CREATE_CATEGORY",
        "category",
        `Created category "${created.name}"`
      );
      saveDemoState(state);
      return { success: true, category: clone(created) };
    }

    const isPublic = pathname === "/api/categories";
    const list = state.categories
      .filter((c) => (isPublic ? c.isActive !== false : true))
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    return {
      success: true,
      categories: list.map((cat) => {
        const cid = String(cat._id);
        const matching = state.products.filter(
          (p) =>
            (!isPublic || p.status === "published") &&
            (String(p.category) === cid ||
              (p.categories || []).some((id) => String(id) === cid))
        );
        return {
          ...clone(cat),
          productCount: matching.length,
          products: clone(matching),
          previewImage:
            cat.image?.url ||
            matching[0]?.images?.find((i) => i.isPrimary)?.url ||
            matching[0]?.images?.[0]?.url ||
            "",
        };
      }),
    };
  }

  if (pathname.startsWith("/api/admin/categories/")) {
    const id = decodeURIComponent(pathname.split("/").pop());
    const idx = state.categories.findIndex((c) => String(c._id) === id);
    if (idx < 0) {
      const err = new Error("Category not found.");
      err.status = 404;
      throw err;
    }

    if (upperMethod === "PUT") {
      const next = {
        ...state.categories[idx],
        name: body.name !== undefined ? String(body.name).trim() : state.categories[idx].name,
        slug:
          body.slug !== undefined
            ? makeSlug(body.slug)
            : makeSlug(body.name || state.categories[idx].name),
        description:
          body.description !== undefined
            ? String(body.description).trim()
            : state.categories[idx].description,
        isActive:
          body.isActive !== undefined
            ? Boolean(body.isActive)
            : state.categories[idx].isActive,
        displayOrder:
          body.displayOrder !== undefined
            ? Number(body.displayOrder) || 0
            : state.categories[idx].displayOrder,
      };
      state.categories[idx] = next;

      if (Array.isArray(body.productIds)) {
        const selected = new Set(body.productIds.map(String));
        state.products.forEach((p) => {
          const cid = String(next._id);
          const pid = String(p._id);
          const current = (p.categories || []).map(String);
          if (selected.has(pid)) {
            p.categories = Array.from(new Set([...current, cid]));
          } else if (String(p.category) !== cid) {
            p.categories = current.filter((x) => x !== cid);
          }
        });
      }

      recordActivity(
        state,
        "UPDATE_CATEGORY",
        "category",
        `Updated category "${next.name}"`
      );
      saveDemoState(state);
      return { success: true, category: clone(next) };
    }

    if (upperMethod === "DELETE") {
      const targetCat = state.categories[idx];
      const cid = String(targetCat._id);
      const primaryUsers = state.products.filter(
        (p) => String(p.category) === cid
      );
      if (primaryUsers.length > 0) {
        const reassignTo = query.reassignTo;
        const replacement = state.categories.find(
          (c) => String(c._id) === String(reassignTo) && String(c._id) !== cid
        );
        if (!replacement) {
          const err = new Error(
            `Cannot delete "${targetCat.name}" while ${primaryUsers.length} product(s) use it as primary category.`
          );
          err.status = 409;
          throw err;
        }
        primaryUsers.forEach((p) => {
          p.category = replacement._id;
          p.categories = Array.from(
            new Set([...(p.categories || []).map(String), String(replacement._id)])
          );
        });
      }
      state.products.forEach((p) => {
        p.categories = (p.categories || []).filter((x) => String(x) !== cid);
      });
      state.categories.splice(idx, 1);
      recordActivity(
        state,
        "DELETE_CATEGORY",
        "category",
        `Deleted category "${targetCat.name}"`
      );
      saveDemoState(state);
      return { success: true };
    }
  }

  // Public & Admin Brands
  if (pathname === "/api/brands" || pathname === "/api/admin/brands") {
    if (pathname === "/api/admin/brands" && upperMethod === "POST") {
      const created = {
        _id: makeId("brand"),
        name: String(body.name || "").trim(),
        slug: makeSlug(body.slug || body.name),
        tagline: String(body.tagline || "").trim(),
        description: String(body.description || "").trim(),
        logo: body.logo || { url: "", publicId: "" },
        bannerImage: body.bannerImage || { url: "", publicId: "" },
        isFlagship: Boolean(body.isFlagship),
        isComingSoon: Boolean(body.isComingSoon),
        isActive: body.isActive !== false,
        displayOrder: Number(body.displayOrder) || state.brands.length + 1,
        createdAt: new Date().toISOString(),
      };
      state.brands.push(created);
      if (Array.isArray(body.productIds)) {
        const selected = new Set(body.productIds.map(String));
        state.products.forEach((p) => {
          if (selected.has(String(p._id))) p.brand = created.name;
        });
      }
      recordActivity(
        state,
        "CREATE_BRAND",
        "brand",
        `Created brand "${created.name}"`
      );
      saveDemoState(state);
      return { success: true, brand: clone(created) };
    }

    const isPublic = pathname === "/api/brands";
    const list = state.brands
      .filter((b) => (isPublic ? b.isActive !== false : true))
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    return {
      success: true,
      brands: list.map((brand) => {
        const matching = state.products.filter(
          (p) =>
            (!isPublic || p.status === "published") &&
            productMatchesBrand(p.brand, brand)
        );
        return {
          ...clone(brand),
          productCount: matching.length,
          publishedProductCount: matching.filter((m) => m.status === "published")
            .length,
          products: clone(matching),
          previewBanner:
            brand.bannerImage?.url ||
            matching[0]?.heroImage?.url ||
            matching[0]?.images?.find((i) => i.isPrimary)?.url ||
            matching[0]?.images?.[0]?.url ||
            "",
        };
      }),
    };
  }

  if (pathname.startsWith("/api/admin/brands/")) {
    const id = decodeURIComponent(pathname.split("/").pop());
    const idx = state.brands.findIndex((b) => String(b._id) === id);
    if (idx < 0) {
      const err = new Error("Brand not found.");
      err.status = 404;
      throw err;
    }

    if (upperMethod === "PUT") {
      const prevName = state.brands[idx].name;
      const next = {
        ...state.brands[idx],
        ...clone(body),
        name: body.name !== undefined ? String(body.name).trim() : prevName,
        slug:
          body.slug !== undefined
            ? makeSlug(body.slug)
            : makeSlug(body.name || prevName),
      };
      delete next.productIds;
      state.brands[idx] = next;

      if (prevName && prevName !== next.name) {
        state.products.forEach((p) => {
          if (String(p.brand || "").toLowerCase() === prevName.toLowerCase()) {
            p.brand = next.name;
          }
        });
      }
      if (Array.isArray(body.productIds)) {
        const selected = new Set(body.productIds.map(String));
        state.products.forEach((p) => {
          if (selected.has(String(p._id))) {
            p.brand = next.name;
          } else if (
            next.slug !== "gunlite" &&
            String(p.brand || "").toLowerCase() === next.name.toLowerCase()
          ) {
            p.brand = "GunLite";
          }
        });
      }

      recordActivity(
        state,
        "UPDATE_BRAND",
        "brand",
        `Updated brand "${next.name}"`
      );
      saveDemoState(state);
      return { success: true, brand: clone(next) };
    }

    if (upperMethod === "DELETE") {
      const targetBrand = state.brands[idx];
      const assigned = state.products.filter((p) =>
        productMatchesBrand(p.brand, targetBrand)
      );
      if (assigned.length > 0) {
        const reassignTo = query.reassignTo;
        const replacement = state.brands.find(
          (b) =>
            String(b._id) === String(reassignTo) &&
            String(b._id) !== String(targetBrand._id)
        );
        if (!replacement) {
          const err = new Error(
            `Cannot delete "${targetBrand.name}" while ${assigned.length} product(s) belong to it.`
          );
          err.status = 409;
          throw err;
        }
        assigned.forEach((p) => {
          p.brand = replacement.name;
        });
      }
      state.brands.splice(idx, 1);
      recordActivity(
        state,
        "DELETE_BRAND",
        "brand",
        `Deleted brand "${targetBrand.name}"`
      );
      saveDemoState(state);
      return { success: true };
    }
  }

  return { success: true };
}
