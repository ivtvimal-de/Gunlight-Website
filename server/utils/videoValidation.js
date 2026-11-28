import { validateNonDataMediaUrl } from "./helpers.js";

export const DEFAULT_MAX_VIDEO_SIZE_MB = 100;
export const BYTES_PER_MB = 1024 * 1024;
export const VIDEO_MAGIC_PEEK_BYTES = 64;

export const ALLOWED_VIDEO_FORMATS = ["mp4", "webm"];

export const ALLOWED_VIDEO_MIME_TYPES = new Set([
  "video/mp4",
  "video/webm",
]);

const MIME_TO_VIDEO_FORMAT = {
  "video/mp4": "mp4",
  "video/webm": "webm",
};

// ISO-BMFF major brands that also place "ftyp" at bytes 4-7 but are image/audio containers, not MP4 video.
const NON_VIDEO_FTYP_BRANDS = new Set([
  "avif",
  "avis",
  "heic",
  "heix",
  "hevc",
  "hevx",
  "heim",
  "heis",
  "hevm",
  "hevs",
  "mif1",
  "msf1",
  "M4A ",
]);

/**
 * Resolve explicit video file size limit from MAX_VIDEO_SIZE_MB (never unlimited).
 */
export function getMaxVideoSizeConfig() {
  const raw = process.env.MAX_VIDEO_SIZE_MB;
  if (raw === undefined || raw === null || String(raw).trim() === "") {
    return {
      maxMb: DEFAULT_MAX_VIDEO_SIZE_MB,
      maxBytes: DEFAULT_MAX_VIDEO_SIZE_MB * BYTES_PER_MB,
    };
  }

  const parsed = Number(String(raw).trim());
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(
      `Invalid MAX_VIDEO_SIZE_MB="${raw}". Set a positive finite number in MB (explicit limit required, never unlimited).`
    );
  }

  const maxBytes = Math.floor(parsed * BYTES_PER_MB);
  if (!Number.isFinite(maxBytes) || maxBytes <= 0) {
    throw new Error(
      `Invalid MAX_VIDEO_SIZE_MB="${raw}". Computed byte limit must be a positive integer.`
    );
  }

  return { maxMb: parsed, maxBytes };
}

/**
 * Inspect leading binary magic bytes to detect MP4 or WebM container format.
 * MP4: bytes 4-7 === "ftyp". WebM: EBML header 1A 45 DF A3 at bytes 0-3.
 */
export function detectVideoFormatFromBuffer(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 4) {
    return null;
  }

  // WebM: EBML header 1A 45 DF A3
  if (
    buffer[0] === 0x1a &&
    buffer[1] === 0x45 &&
    buffer[2] === 0xdf &&
    buffer[3] === 0xa3
  ) {
    return "webm";
  }

  // MP4: ISO BMFF "ftyp" at bytes 4-7
  if (
    buffer.length >= 8 &&
    buffer.subarray(4, 8).toString("ascii") === "ftyp"
  ) {
    if (buffer.length >= 12) {
      const majorBrand = buffer.subarray(8, 12).toString("ascii");
      if (NON_VIDEO_FTYP_BRANDS.has(majorBrand)) {
        return null;
      }
    }
    return "mp4";
  }

  return null;
}

/**
 * Validate leading video header bytes and verify declared MIME type (if supplied) matches.
 */
export function validateVideoHeader(buffer, declaredMime = "") {
  const detected = detectVideoFormatFromBuffer(buffer);
  if (!detected) {
    const err = new Error(
      "Invalid or unsupported video file signature. Only valid MP4 and WebM videos are allowed."
    );
    err.statusCode = 400;
    throw err;
  }

  const cleanMime = String(declaredMime || "").trim().toLowerCase();
  if (cleanMime) {
    if (!ALLOWED_VIDEO_MIME_TYPES.has(cleanMime)) {
      const err = new Error(
        `Unsupported video MIME type "${declaredMime}". Allowed formats: MP4 (video/mp4) and WebM (video/webm).`
      );
      err.statusCode = 400;
      throw err;
    }

    const expectedFormat = MIME_TO_VIDEO_FORMAT[cleanMime];
    if (expectedFormat && expectedFormat !== detected) {
      const err = new Error(
        `Video file signature (${detected}) does not match declared MIME type (${declaredMime}).`
      );
      err.statusCode = 400;
      throw err;
    }
  }

  return detected;
}

/**
 * Enforce positive finite byte count within configured MAX_VIDEO_SIZE_MB.
 */
export function validateVideoFileSize(fileSizeBytes) {
  const { maxMb, maxBytes } = getMaxVideoSizeConfig();
  if (
    typeof fileSizeBytes !== "number" ||
    !Number.isFinite(fileSizeBytes) ||
    fileSizeBytes <= 0
  ) {
    const err = new Error("Video file size must be a positive number of bytes.");
    err.statusCode = 400;
    throw err;
  }

  if (fileSizeBytes > maxBytes) {
    const err = new Error(
      `Video file size exceeds the ${maxMb} MB maximum limit.`
    );
    err.statusCode = 400;
    throw err;
  }

  return fileSizeBytes;
}

/**
 * Validate persisted video/thumbnail URLs (reject Base64 data: URLs and unsafe protocols).
 */
export function validateNonDataVideoUrl(url, label = "video") {
  return validateNonDataMediaUrl(url, label, "videos");
}
