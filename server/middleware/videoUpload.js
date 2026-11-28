import fs from "node:fs/promises";
import multer from "multer";
import {
  ALLOWED_VIDEO_MIME_TYPES,
  VIDEO_MAGIC_PEEK_BYTES,
  getMaxVideoSizeConfig,
  validateVideoFileSize,
  validateVideoHeader,
} from "../utils/videoValidation.js";

const MULTIPART_OVERHEAD_ALLOWANCE = 256 * 1024; // 256 KB tolerance for form fields & boundaries

const videoDiskStorage = multer.diskStorage({});

function videoFileFilter(_req, file, cb) {
  const mime = String(file.mimetype || "").trim().toLowerCase();
  if (!ALLOWED_VIDEO_MIME_TYPES.has(mime)) {
    const err = new Error(
      `Unsupported video format "${file.mimetype}". Allowed formats: MP4 (video/mp4) and WebM (video/webm).`
    );
    err.statusCode = 400;
    return cb(err, false);
  }
  return cb(null, true);
}

/**
 * Unlink a temporary uploaded video file quietly.
 */
export async function removeTempVideoFile(filePath) {
  if (!filePath || typeof filePath !== "string") return;
  try {
    await fs.unlink(filePath);
  } catch (err) {
    if (err?.code !== "ENOENT") {
      console.error(
        `Failed to remove temporary video file ${filePath}:`,
        err.message
      );
    }
  }
}

/**
 * Inspect leading header bytes from a temp file and enforce size, magic bytes, and MIME match
 * completely before opening any Cloudinary upload.
 */
export async function validateTempVideoFile(file) {
  validateVideoFileSize(file.size);

  const peekBuffer = Buffer.alloc(VIDEO_MAGIC_PEEK_BYTES);
  const handle = await fs.open(file.path, "r");
  let bytesRead = 0;
  try {
    const res = await handle.read(peekBuffer, 0, VIDEO_MAGIC_PEEK_BYTES, 0);
    bytesRead = res.bytesRead;
  } finally {
    await handle.close();
  }

  return validateVideoHeader(peekBuffer.subarray(0, bytesRead), file.mimetype);
}

/**
 * Route-scoped single-video Multer middleware using os.tmpdir() (no memoryStorage)
 * with pre-Multer Content-Length check and route-specific MulterError messages.
 */
export function uploadVideoMiddleware(req, res, next) {
  let maxMb;
  let maxBytes;
  try {
    ({ maxMb, maxBytes } = getMaxVideoSizeConfig());
  } catch (err) {
    return next(err);
  }

  const contentLengthHeader = req.headers["content-length"];
  if (contentLengthHeader !== undefined) {
    const contentLength = Number(contentLengthHeader);
    if (
      Number.isFinite(contentLength) &&
      contentLength > maxBytes + MULTIPART_OVERHEAD_ALLOWANCE
    ) {
      const err = new Error(
        `Video file size exceeds the ${maxMb} MB maximum limit.`
      );
      err.statusCode = 400;
      return next(err);
    }
  }

  const uploader = multer({
    storage: videoDiskStorage,
    fileFilter: videoFileFilter,
    limits: {
      fileSize: maxBytes,
      files: 1,
    },
  }).single("video");

  return uploader(req, res, (err) => {
    if (!err) return next();

    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        const sizeErr = new Error(
          `Video file size exceeds the ${maxMb} MB maximum limit.`
        );
        sizeErr.statusCode = 400;
        return next(sizeErr);
      }
      if (
        err.code === "LIMIT_FILE_COUNT" ||
        err.code === "LIMIT_UNEXPECTED_FILE"
      ) {
        const countErr = new Error(
          err.code === "LIMIT_UNEXPECTED_FILE"
            ? 'Unexpected file field. Upload video using field name "video".'
            : "You can upload only 1 video file per request."
        );
        countErr.statusCode = 400;
        return next(countErr);
      }
    }

    return next(err);
  });
}

/**
 * Run video upload middleware only on multipart replacement requests; pass JSON updates through.
 */
export function maybeUploadVideoMiddleware(req, res, next) {
  if (req.is("multipart/form-data")) {
    return uploadVideoMiddleware(req, res, next);
  }
  return next();
}
