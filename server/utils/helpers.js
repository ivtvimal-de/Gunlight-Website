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
 * Normalize an image list so every entry has { url, publicId, isPrimary }
 * and exactly one entry is marked isPrimary when non-empty.
 */
export function normalizeProductImages(images = []) {
  if (!Array.isArray(images) || images.length === 0) return [];

  const cleaned = images
    .filter((img) => img && typeof img.url === "string" && img.url.trim())
    .map((img) => ({
      url: img.url.trim(),
      publicId: typeof img.publicId === "string" ? img.publicId.trim() : "",
      isPrimary: Boolean(img.isPrimary),
    }));

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
