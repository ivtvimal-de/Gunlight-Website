import multer from "multer";

export const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export const MAX_IMAGE_SIZE_BYTES = 1 * 1024 * 1024; // 1 MB
export const MAX_IMAGE_FILES = 10;

const MIME_TO_FORMAT = {
  "image/jpeg": "jpeg",
  "image/jpg": "jpeg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

/**
 * Inspect actual binary magic bytes to determine real image format.
 */
export function detectImageFormatFromBuffer(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 12) {
    return null;
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "jpeg";
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (PNG_SIGNATURE.every((byte, idx) => buffer[idx] === byte)) {
    return "png";
  }

  // WebP: RIFF....WEBP
  if (
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "webp";
  }

  // AVIF: ISO BMFF ftyp box with avif/avis major or compatible brand
  if (buffer.subarray(4, 8).toString("ascii") === "ftyp") {
    const boxSize = buffer.readUInt32BE(0);
    if (boxSize >= 16) {
      const majorBrand = buffer.subarray(8, 12).toString("ascii");
      if (majorBrand === "avif" || majorBrand === "avis") {
        return "avif";
      }
      const limit = Math.min(buffer.length, boxSize);
      for (let offset = 16; offset + 4 <= limit; offset += 4) {
        const brand = buffer.subarray(offset, offset + 4).toString("ascii");
        if (brand === "avif" || brand === "avis") {
          return "avif";
        }
      }
    }
  }

  return null;
}

/**
 * Verify an uploaded buffer has valid image magic bytes and matches its declared MIME type.
 */
export function validateImageBuffer(buffer, declaredMime = "") {
  const detected = detectImageFormatFromBuffer(buffer);
  if (!detected) {
    const err = new Error(
      "Invalid or unrecognized image file content. Upload a valid JPG, PNG, WebP, or AVIF image."
    );
    err.statusCode = 400;
    throw err;
  }

  const expected = MIME_TO_FORMAT[String(declaredMime).toLowerCase()];
  if (expected && detected !== expected) {
    const err = new Error(
      `Image file content (${detected}) does not match declared MIME type (${declaredMime}).`
    );
    err.statusCode = 400;
    throw err;
  }

  return detected;
}

const storage = multer.memoryStorage();

function fileFilter(_req, file, cb) {
  if (!ALLOWED_IMAGE_MIME_TYPES.has(String(file.mimetype || "").toLowerCase())) {
    const err = new Error(
      `Unsupported image format "${file.mimetype}". Allowed formats: JPG, PNG, WebP, AVIF.`
    );
    err.statusCode = 400;
    return cb(err, false);
  }
  cb(null, true);
}

export const uploadImagesMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_IMAGE_SIZE_BYTES,
    files: MAX_IMAGE_FILES,
  },
});

/**
 * Express middleware run immediately after Multer to enforce magic-byte verification
 * before any controller or Cloudinary upload runs.
 */
export function validateUploadedImages(req, _res, next) {
  try {
    const files = Array.isArray(req.files)
      ? req.files
      : req.file
      ? [req.file]
      : [];

    for (const file of files) {
      validateImageBuffer(file.buffer, file.mimetype);
    }
    next();
  } catch (err) {
    next(err);
  }
}
