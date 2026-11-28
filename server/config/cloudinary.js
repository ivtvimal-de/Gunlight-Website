import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs";

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
 * Validate Cloudinary environment credentials and configure the SDK.
 * Throws if credentials are missing or placeholders so uploads never silently fall back to disk.
 */
export function ensureCloudinaryConfigured({ throwOnMissing = true } = {}) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (
    isPlaceholder(cloudName) ||
    isPlaceholder(apiKey) ||
    isPlaceholder(apiSecret)
  ) {
    if (throwOnMissing) {
      throw new Error(
        "Cloudinary credentials (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are missing or placeholders in server/.env."
      );
    }
    return false;
  }

  if (!isConfigured) {
    cloudinary.config({
      cloud_name: cloudName.trim(),
      api_key: apiKey.trim(),
      api_secret: apiSecret.trim(),
      secure: true,
    });
    isConfigured = true;
  }

  return true;
}

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
  if (!publicId || typeof publicId !== "string" || !publicId.trim()) {
    return null;
  }

  const trimmed = publicId.trim();
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
    return null;
  }
}

export { cloudinary };
