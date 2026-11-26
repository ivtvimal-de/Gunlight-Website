import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const LOCAL_UPLOADS_DIR = path.resolve(__dirname, "..", "uploads");

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
 * Returns true if real Cloudinary credentials are configured in environment variables.
 * When false, image uploads automatically save locally into server/uploads/.
 */
export function ensureCloudinaryConfigured() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (
    isPlaceholder(cloudName) ||
    isPlaceholder(apiKey) ||
    isPlaceholder(apiSecret)
  ) {
    return false;
  }

  if (!isConfigured) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    isConfigured = true;
  }

  return true;
}

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
 * Delete an uploaded image asset (either from local server/uploads/ or Cloudinary).
 */
export async function deleteFromCloudinary(publicId) {
  if (!publicId || typeof publicId !== "string" || !publicId.trim()) {
    return null;
  }

  const trimmed = publicId.trim();

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
    return null;
  }
}

export { cloudinary };
