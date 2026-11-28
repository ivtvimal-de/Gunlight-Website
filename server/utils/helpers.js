import { AdminActivity } from "../storage/models.js";

/**
 * Convert text into a clean URL-safe lowercase slug.
 */
export function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Check whether a persisted media URL uses an allowed scheme (http/https/relative) and is not a data: URL.
 */
export function isSafeMediaUrl(url, { allowEmpty = true } = {}) {
  if (url === undefined || url === null) return allowEmpty;
  if (typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed) return allowEmpty;
  if (/^data:/i.test(trimmed)) return false;
  return /^(https?:\/\/|\/)/i.test(trimmed);
}

/**
 * Reject Base64 data: URLs and unsafe protocols for persisted media URLs.
 */
export function validateNonDataMediaUrl(
  url,
  label = "media",
  mediaKind = "media"
) {
  if (url === undefined || url === null) return "";
  if (typeof url !== "string") {
    const err = new Error(`Invalid ${label} URL format.`);
    err.statusCode = 400;
    throw err;
  }
  const trimmed = url.trim();
  if (!trimmed) return "";

  if (/^data:/i.test(trimmed)) {
    const err = new Error(
      `Base64 data: URLs are not allowed for ${label}. Upload ${mediaKind} through Cloudinary.`
    );
    err.statusCode = 400;
    throw err;
  }

  if (!/^(https?:\/\/|\/)/i.test(trimmed)) {
    const err = new Error(
      `Unsupported URL scheme for ${label}. Expected https://, http://, or relative path.`
    );
    err.statusCode = 400;
    throw err;
  }

  return trimmed;
}

/**
 * Reject Base64 data: URLs and unsafe protocols for persisted image URLs.
 */
export function validateNonDataImageUrl(url, label = "image") {
  return validateNonDataMediaUrl(url, label, "images");
}

/**
 * Normalize an image list so every entry has { url, publicId, isPrimary },
 * reject any Base64 data: URLs, and mark exactly one entry isPrimary when non-empty.
 */
export function normalizeProductImages(images = []) {
  if (!Array.isArray(images) || images.length === 0) return [];

  const cleaned = [];
  for (const img of images) {
    if (!img || typeof img !== "object") continue;
    if (img.url !== undefined && img.url !== null && String(img.url).trim() !== "") {
      const safeUrl = validateNonDataImageUrl(img.url, "product image");
      const rawPid =
        typeof img.publicId === "string"
          ? img.publicId
          : typeof img.public_id === "string"
          ? img.public_id
          : "";
      cleaned.push({
        url: safeUrl,
        publicId: rawPid.trim(),
        isPrimary: Boolean(img.isPrimary),
      });
    }
  }

  if (cleaned.length === 0) return [];

  const firstPrimaryIdx = cleaned.findIndex((img) => img.isPrimary);
  const primaryIdx = firstPrimaryIdx >= 0 ? firstPrimaryIdx : 0;

  return cleaned.map((img, idx) => ({
    ...img,
    isPrimary: idx === primaryIdx,
  }));
}

/**
 * Persist an admin audit activity record without interrupting the primary request if logging fails.
 */
export async function logAdminActivity({
  admin,
  action,
  entityType,
  entityId = "",
  summary,
}) {
  try {
    await AdminActivity.create({
      admin: admin?._id || null,
      adminEmail: admin?.email || "",
      action,
      entityType,
      entityId: entityId ? String(entityId) : "",
      summary,
    });
  } catch (err) {
    console.error("Admin activity logging failed:", err.message);
  }
}

/**
 * Safely parse JSON arrays/objects when sent via FormData fields.
 */
export function parseMaybeJSON(val, fallback) {
  if (val === undefined || val === null || val === "") return fallback;
  if (typeof val !== "string") return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}
