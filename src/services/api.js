import {
  isDemoModeEnabled,
  handleDemoRequest,
  uploadImagesDemo,
} from "./demoStore";

const RAW_API_URL = import.meta.env.VITE_API_URL || "";
export const API_BASE_URL = RAW_API_URL.replace(/\/$/, "");

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

// Stored strictly in memory so cross-domain setups never rely on reading document.cookie
let csrfTokenMemory = "";
let csrfInFlight = null;

export function clearCsrfToken() {
  csrfTokenMemory = "";
}

async function fetchCsrfToken() {
  if (csrfInFlight) return csrfInFlight;
  csrfInFlight = (async () => {
    const res = await fetch(`${API_BASE_URL}/api/admin/csrf-token`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.csrfToken) {
      throw new Error(data?.message || "Failed to initialize security token.");
    }
    csrfTokenMemory = data.csrfToken;
    return csrfTokenMemory;
  })();

  try {
    return await csrfInFlight;
  } finally {
    csrfInFlight = null;
  }
}

async function ensureCsrfToken() {
  if (csrfTokenMemory) return csrfTokenMemory;
  return fetchCsrfToken();
}

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

async function request(path, { method = "GET", body, params, headers = {}, _retriedCsrf = false } = {}) {
  if (isDemoModeEnabled() && path.startsWith("/api/")) {
    return handleDemoRequest(path, { method, body, params });
  }

  const upperMethod = String(method).toUpperCase();
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const needsCsrf = !SAFE_METHODS.has(upperMethod) && path.startsWith("/api/admin");

  let activeCsrf = "";
  if (needsCsrf) {
    try {
      activeCsrf = await ensureCsrfToken();
    } catch (csrfErr) {
      csrfErr.isBackendUnavailable = true;
      throw csrfErr;
    }
  }

  const finalHeaders = isFormData
    ? { ...headers }
    : {
        "Content-Type": "application/json",
        ...headers,
      };

  if (needsCsrf && activeCsrf) {
    finalHeaders["X-CSRF-Token"] = activeCsrf;
  }

  let response;
  try {
    response = await fetch(buildUrl(path, params), {
      method: upperMethod,
      credentials: "include",
      headers: finalHeaders,
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

  // Retry once automatically if CSRF cookie expired/rotated on the backend
  if (
    needsCsrf &&
    !_retriedCsrf &&
    response.status === 403 &&
    data?.code === "CSRF_INVALID"
  ) {
    csrfTokenMemory = "";
    return request(path, { method, body, params, headers, _retriedCsrf: true });
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

  if (data?.csrfToken) {
    csrfTokenMemory = data.csrfToken;
  }

  return data;
}

/**
 * Send multipart FormData with XHR upload progress, credentials, and automatic CSRF retry.
 */
async function sendMultipartXhr({
  method = "POST",
  path,
  buildFormData,
  onProgress,
  invalidResponseMessage = "Invalid server response during upload.",
  networkErrorMessage = "Network error occurred while uploading.",
  fallbackErrorPrefix = "Upload failed",
  _retriedCsrf = false,
}) {
  const token = await ensureCsrfToken();

  const sendAttempt = () =>
    new Promise((resolve, reject) => {
      const formData = buildFormData();
      const xhr = new XMLHttpRequest();
      xhr.open(String(method).toUpperCase(), `${API_BASE_URL}${path}`);
      xhr.withCredentials = true;
      if (token) {
        xhr.setRequestHeader("X-CSRF-Token", token);
      }

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
            const err = new Error(
              res.message || `${fallbackErrorPrefix} (${xhr.status})`
            );
            err.status = xhr.status;
            err.code = res?.code;
            reject(err);
          }
        } catch {
          reject(new Error(invalidResponseMessage));
        }
      };

      xhr.onerror = () => {
        reject(new Error(networkErrorMessage));
      };

      xhr.send(formData);
    });

  try {
    return await sendAttempt();
  } catch (err) {
    if (!_retriedCsrf && err?.status === 403 && err?.code === "CSRF_INVALID") {
      csrfTokenMemory = "";
      return sendMultipartXhr({
        method,
        path,
        buildFormData,
        onProgress,
        invalidResponseMessage,
        networkErrorMessage,
        fallbackErrorPrefix,
        _retriedCsrf: true,
      });
    }
    throw err;
  }
}

/**
 * Upload 1..10 image files to Cloudinary via backend with real progress tracking.
 */
export async function uploadImagesWithProgress(
  files,
  folder = "gunlite/products",
  onProgress,
  _retriedCsrf = false
) {
  const fileArray = Array.from(files || []);
  if (isDemoModeEnabled()) {
    return uploadImagesDemo(fileArray, onProgress);
  }

  return sendMultipartXhr({
    method: "POST",
    path: "/api/admin/upload",
    onProgress,
    invalidResponseMessage: "Invalid server response during image upload.",
    networkErrorMessage: "Network error occurred while uploading images.",
    fallbackErrorPrefix: "Upload failed",
    _retriedCsrf,
    buildFormData: () => {
      const formData = new FormData();
      formData.append("folder", folder);
      fileArray.forEach((file) => {
        formData.append("images", file);
      });
      return formData;
    },
  });
}

/**
 * Upload or replace a product video (MP4/WebM) via backend with real upload progress.
 */
export async function uploadVideoWithProgress({
  method = "POST",
  path = "/api/admin/videos",
  file = null,
  fields = {},
  onProgress,
}) {
  return sendMultipartXhr({
    method,
    path,
    onProgress,
    invalidResponseMessage: "Invalid server response during video upload.",
    networkErrorMessage: "Network error occurred while uploading video.",
    fallbackErrorPrefix: "Video upload failed",
    buildFormData: () => {
      const formData = new FormData();
      Object.entries(fields || {}).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          formData.append(key, String(val));
        }
      });
      if (file) {
        formData.append("video", file);
      }
      return formData;
    },
  });
}

export const api = {
  // Public endpoints
  getPublicProducts: (params) => request("/api/products", { params }),
  getPublicProductById: (idOrSlug) => request(`/api/products/${encodeURIComponent(idOrSlug)}`),
  getPublicCategories: () => request("/api/categories"),
  getPublicBrands: () => request("/api/brands"),
  getPublicVideos: (params) => request("/api/videos", { params }),
  getPublicVideoById: (id) => request(`/api/videos/${encodeURIComponent(id)}`),

  // Admin auth & CSRF
  getCsrfToken: () => fetchCsrfToken(),
  adminLogin: (credentials) =>
    request("/api/admin/login", { method: "POST", body: credentials }),
  adminLogout: async () => {
    try {
      return await request("/api/admin/logout", { method: "POST" });
    } finally {
      clearCsrfToken();
    }
  },
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

  // Admin product videos
  getAdminVideos: (params) => request("/api/admin/videos", { params }),
  getAdminVideoById: (id) => request(`/api/admin/videos/${id}`),
  createAdminVideo: ({ file, fields, onProgress }) =>
    uploadVideoWithProgress({
      method: "POST",
      path: "/api/admin/videos",
      file,
      fields,
      onProgress,
    }),
  replaceAdminVideo: (id, { file, fields, onProgress }) =>
    uploadVideoWithProgress({
      method: "PUT",
      path: `/api/admin/videos/${id}`,
      file,
      fields,
      onProgress,
    }),
  updateAdminVideo: (id, payload) =>
    request(`/api/admin/videos/${id}`, { method: "PUT", body: payload }),
  deleteAdminVideo: (id) =>
    request(`/api/admin/videos/${id}`, { method: "DELETE" }),
};
