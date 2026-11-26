import multer from "multer";

export const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_IMAGE_FILES = 10;

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (!ALLOWED_IMAGE_MIME_TYPES.has(file.mimetype)) {
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
