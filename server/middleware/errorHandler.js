import multer from "multer";

export function notFound(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  if (err instanceof multer.MulterError) {
    statusCode = 400;
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "Image file size exceeds the 5 MB limit.";
    } else if (err.code === "LIMIT_FILE_COUNT") {
      message = "You can upload up to 10 images at once.";
    }
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    const messages = Object.values(err.errors || {}).map((e) => e.message);
    message = messages.join(". ") || "Validation failed";
  } else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    message = `Duplicate value for "${field}". Please use a unique value.`;
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid identifier format for ${err.path || "resource"}.`;
  }

  if (process.env.NODE_ENV !== "production" && statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}
