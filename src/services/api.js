import {
  isDemoModeEnabled,
  handleDemoRequest,
  uploadImagesDemo,
} from "./demoStore";

const RAW_API_URL = import.meta.env.VITE_API_URL || "";
export const API_BASE_URL = RAW_API_URL.replace(/\/$/, "");

function buildUrl(path, params) {
  const base = `${API_BASE_URL}${path}`;
  if (!params) return base;
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  });
  const qs = search.toString();
  return qs ? `${base}?${qs}` : base;
}

async function request(path, { method = "GET", body, params, headers = {} } = {}) {
  if (isDemoModeEnabled() && path.startsWith("/api/")) {
    return handleDemoRequest(path, { method, body, params });
  }

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  let response;
  try {
    response = await fetch(buildUrl(path, params), {
      method,
      credentials: "include",
      headers: isFormData
        ? headers
        : {
            "Content-Type": "application/json",
            ...headers,
          },
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });
  } catch (networkErr) {
    const err = new Error(networkErr?.message || "Unable to reach backend server.");
    err.isBackendUnavailable = true;
    throw err;
  }

  let data = null;
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  if (isJson) {
    data = await response.json();
  } else {
    const text = await response.text();
    data = { message: text || response.statusText };
  }

  const backendMissing =
    response.status === 404 ||
    response.status === 405 ||
    response.status >= 502 ||
    !isJson;

  if (!response.ok || !isJson) {
    const err = new Error(
      !isJson && response.ok
        ? "Backend API server is not connected."
        : data?.message || `Request failed (${response.status})`
    );
    err.status = response.status;
    err.data = data;
    err.isBackendUnavailable = backendMissing;
    throw err;
  }

  return data;
}

/**
 * Upload 1..10 image files to Cloudinary via backend with real progress tracking.
 */
export function uploadImagesWithProgress(files, folder = "gunlite/products", onProgress) {
  if (isDemoModeEnabled()) {
    return uploadImagesDemo(files, onProgress);
  }

  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("folder", folder);
    Array.from(files).forEach((file) => {
      formData.append("images", file);
    });

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE_URL}/api/admin/upload`);
    xhr.withCredentials = true;

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && typeof onProgress === "function") {
        const pct = Math.round((event.loaded / event.total) * 100);
        onProgress(pct);
      }
    };

    xhr.onload = () => {
      try {
        const res = JSON.parse(xhr.responseText || "{}");
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(res);
        } else {
          reject(new Error(res.message || `Upload failed (${xhr.status})`));
        }
      } catch {
        reject(new Error("Invalid server response during image upload."));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error occurred while uploading images."));
    };

    xhr.send(formData);
  });
}

export const api = {
  // Public endpoints
  getPublicProducts: (params) => request("/api/products", { params }),
  getPublicProductById: (idOrSlug) => request(`/api/products/${encodeURIComponent(idOrSlug)}`),
  getPublicCategories: () => request("/api/categories"),
  getPublicBrands: () => request("/api/brands"),

  // Admin auth
  adminLogin: (credentials) =>
    request("/api/admin/login", { method: "POST", body: credentials }),
  adminLogout: () => request("/api/admin/logout", { method: "POST" }),
  getAdminMe: () => request("/api/admin/me"),

  // Admin dashboard
  getAdminDashboard: () => request("/api/admin/dashboard"),

  // Admin products
  getAdminProducts: (params) => request("/api/admin/products", { params }),
  getAdminProductById: (id) => request(`/api/admin/products/${id}`),
  createAdminProduct: (payload) =>
    request("/api/admin/products", { method: "POST", body: payload }),
  updateAdminProduct: (id, payload) =>
    request(`/api/admin/products/${id}`, { method: "PUT", body: payload }),
  deleteAdminProduct: (id) =>
    request(`/api/admin/products/${id}`, { method: "DELETE" }),

  // Admin categories
  getAdminCategories: () => request("/api/admin/categories"),
  createAdminCategory: (payload) =>
    request("/api/admin/categories", { method: "POST", body: payload }),
  updateAdminCategory: (id, payload) =>
    request(`/api/admin/categories/${id}`, { method: "PUT", body: payload }),
  deleteAdminCategory: (id, reassignTo) =>
    request(`/api/admin/categories/${id}`, {
      method: "DELETE",
      params: reassignTo ? { reassignTo } : undefined,
    }),

  // Admin brands
  getAdminBrands: () => request("/api/admin/brands"),
  createAdminBrand: (payload) =>
    request("/api/admin/brands", { method: "POST", body: payload }),
  updateAdminBrand: (id, payload) =>
    request(`/api/admin/brands/${id}`, { method: "PUT", body: payload }),
  deleteAdminBrand: (id, reassignTo) =>
    request(`/api/admin/brands/${id}`, {
      method: "DELETE",
      params: reassignTo ? { reassignTo } : undefined,
    }),

  // Admin media cleanup
  deleteUploadedImage: (publicId) =>
    request("/api/admin/upload", { method: "DELETE", body: { publicId } }),
};
