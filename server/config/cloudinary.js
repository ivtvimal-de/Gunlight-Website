import { v2 as cloudinary } from "cloudinary";
<<<<<<< HEAD
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const LOCAL_UPLOADS_DIR = path.resolve(__dirname, "..", "uploads");
=======
import fs from "node:fs";
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)

let isConfigured = false;

function isPlaceholder(val) {
  if (!val || typeof val !== "string") return true;
  const trimmed = val.trim();
  return (
    !trimmed ||
    trimmed.startsWith("your_") ||
    trimmed.includes("<") ||
    trimmed === "replace_me"
  );
}

/**
<<<<<<< HEAD
 * Returns true if real Cloudinary credentials are configured in environment variables.
 * When false, image uploads automatically save locally into server/uploads/.
 */
export function ensureCloudinaryConfigured() {
=======
 * Validate Cloudinary environment credentials and configure the SDK.
 * Throws if credentials are missing or placeholders so uploads never silently fall back to disk.
 */
export function ensureCloudinaryConfigured({ throwOnMissing = true } = {}) {
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (
    isPlaceholder(cloudName) ||
    isPlaceholder(apiKey) ||
    isPlaceholder(apiSecret)
  ) {
<<<<<<< HEAD
=======
    if (throwOnMissing) {
      throw new Error(
        "Cloudinary credentials (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are missing or placeholders in server/.env."
      );
    }
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
    return false;
  }

  if (!isConfigured) {
    cloudinary.config({
<<<<<<< HEAD
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
=======
      cloud_name: cloudName.trim(),
      api_key: apiKey.trim(),
      api_secret: apiSecret.trim(),
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
      secure: true,
    });
    isConfigured = true;
  }

  return true;
}

<<<<<<< HEAD
function extFromMimetype(mimetype = "") {
  if (mimetype.includes("png")) return ".png";
  if (mimetype.includes("webp")) return ".webp";
  if (mimetype.includes("avif")) return ".avif";
  return ".jpg";
}

/**
 * Upload an in-memory image buffer to Cloudinary, or save locally in server/uploads/
 * when Cloudinary credentials are not yet configured.
 */
export async function uploadBufferToCloudinary(
  buffer,
  folder = "gunlite/products",
  mimetype = "image/webp"
) {
  if (!ensureCloudinaryConfigured()) {
    await fs.mkdir(LOCAL_UPLOADS_DIR, { recursive: true });
    const ext = extFromMimetype(mimetype);
    const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
    const fullPath = path.join(LOCAL_UPLOADS_DIR, filename);
    await fs.writeFile(fullPath, buffer);

    return {
      url: `/uploads/${filename}`,
      publicId: `local:${filename}`,
      width: null,
      height: null,
    };
=======
/**
 * Verify live connectivity and authentication against the Cloudinary Admin API.
 */
export async function verifyCloudinaryConnection() {
  ensureCloudinaryConfigured({ throwOnMissing: true });
  try {
    const result = await cloudinary.api.ping();
    return {
      ok: result?.status === "ok",
      status: result?.status || "unknown",
    };
  } catch (err) {
    const msg =
      err?.message ||
      err?.error?.message ||
      "Unable to authenticate or connect to Cloudinary.";
    const wrapped = new Error(`Cloudinary connection failed: ${msg}`);
    wrapped.statusCode = err?.http_code || err?.error?.http_code || 502;
    throw wrapped;
  }
}

/**
 * Upload an in-memory image buffer directly to Cloudinary.
 */
export async function uploadBufferToCloudinary(
  buffer,
  folder = "gunlite/products"
) {
  ensureCloudinaryConfigured({ throwOnMissing: true });

  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    const err = new Error("Uploaded image buffer is empty or invalid.");
    err.statusCode = 400;
    throw err;
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
        });
      }
    );

    stream.end(buffer);
  });
}

/**
<<<<<<< HEAD
 * Delete an uploaded image asset (either from local server/uploads/ or Cloudinary).
 */
export async function deleteFromCloudinary(publicId) {
=======
 * Generate a Cloudinary-derived JPG frame thumbnail URL for a stored video asset.
 */
export function buildVideoThumbnailUrl(publicId, version) {
  ensureCloudinaryConfigured({ throwOnMissing: true });
  return cloudinary.url(publicId, {
    resource_type: "video",
    secure: true,
    format: "jpg",
    ...(version ? { version } : {}),
    transformation: [
      { start_offset: "auto", width: 800, crop: "limit", quality: "auto" },
    ],
  });
}

const CHUNKED_VIDEO_THRESHOLD_BYTES = 20 * 1024 * 1024;
const DEFAULT_VIDEO_CHUNK_SIZE_BYTES = 20 * 1024 * 1024;

/**
 * Upload a validated temporary video file from disk to Cloudinary via stream or chunked stream (V2b).
 */
export async function uploadVideoFileToCloudinary(
  filePath,
  { folder = "gunlite/videos", fileSize = 0, timeout = 300000 } = {}
) {
  ensureCloudinaryConfigured({ throwOnMissing: true });

  if (!filePath || typeof filePath !== "string") {
    const err = new Error("Video file path is required.");
    err.statusCode = 400;
    throw err;
  }

  return new Promise((resolve, reject) => {
    let settled = false;
    let readStream = null;

    const settleReject = (err) => {
      if (settled) return;
      settled = true;
      if (readStream && !readStream.destroyed) {
        readStream.destroy();
      }
      reject(err);
    };
    const settleResolve = (val) => {
      if (settled) return;
      settled = true;
      resolve(val);
    };

    const useChunked = Number(fileSize) > CHUNKED_VIDEO_THRESHOLD_BYTES;
    const uploadOptions = {
      folder,
      resource_type: "video",
      timeout,
      ...(useChunked ? { chunk_size: DEFAULT_VIDEO_CHUNK_SIZE_BYTES } : {}),
    };

    const onUploadComplete = (error, result) => {
      if (error) return settleReject(error);
      if (!result?.secure_url || !result?.public_id) {
        return settleReject(
          new Error("Cloudinary did not return a valid video result.")
        );
      }
      return settleResolve({
        videoUrl: result.secure_url,
        publicId: result.public_id,
        thumbnailUrl: buildVideoThumbnailUrl(result.public_id, result.version),
      });
    };

    const uploadStream = useChunked
      ? cloudinary.uploader.upload_chunked_stream(uploadOptions, onUploadComplete)
      : cloudinary.uploader.upload_stream(uploadOptions, onUploadComplete);

    readStream = fs.createReadStream(filePath);
    readStream.on("error", (readErr) => {
      if (typeof uploadStream.destroy === "function") {
        uploadStream.destroy(readErr);
      }
      settleReject(readErr);
    });
    uploadStream.on("error", settleReject);
    readStream.pipe(uploadStream);
  });
}

/**
 * Delete a Cloudinary asset by its publicId ("image" or "video").
 */
export async function deleteFromCloudinary(publicId, resourceType = "image") {
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
  if (!publicId || typeof publicId !== "string" || !publicId.trim()) {
    return null;
  }

  const trimmed = publicId.trim();
<<<<<<< HEAD

  // Delete locally saved upload
  if (trimmed.startsWith("local:")) {
    const filename = path.basename(trimmed.slice("local:".length));
    if (!filename) return null;
    try {
      await fs.unlink(path.join(LOCAL_UPLOADS_DIR, filename));
    } catch {
      /* Ignore missing local file */
    }
    return { result: "ok" };
  }

  if (!ensureCloudinaryConfigured()) {
    return null;
  }

  try {
    return await cloudinary.uploader.destroy(trimmed, {
      resource_type: "image",
    });
  } catch (err) {
    console.error(`Failed to delete Cloudinary asset ${trimmed}:`, err.message);
=======
  if (trimmed.startsWith("local:")) {
    return null;
  }

  ensureCloudinaryConfigured({ throwOnMissing: true });

  try {
    return await cloudinary.uploader.destroy(trimmed, {
      resource_type: resourceType,
      invalidate: true,
    });
  } catch (err) {
    console.error(
      `Failed to delete Cloudinary ${resourceType} asset ${trimmed}:`,
      err.message
    );
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
    return null;
  }
}

export { cloudinary };
