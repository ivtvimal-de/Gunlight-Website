import multer from "multer";

export function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

export function errorHandler(err, req, res, _next) {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Internal server error";

  if (err instanceof SyntaxError && statusCode === 400 && "body" in err) {
    statusCode = 400;
    message = "Malformed JSON request body.";
  } else if (err instanceof multer.MulterError) {
    statusCode = 400;
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "Image file size exceeds the 1 MB limit.";
    } else if (err.code === "LIMIT_FILE_COUNT") {
      message = "You can upload up to 10 images at once.";
    } else {
      message = err.message || "File upload error.";
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
  } else if (
    err.name === "JsonWebTokenError" ||
    err.name === "TokenExpiredError"
  ) {
    statusCode = 401;
    message = "Invalid or expired authentication session.";
  }

  if (statusCode >= 500) {
    if (process.env.NODE_ENV !== "production") {
      console.error(err);
    } else {
      console.error(`[${req.method} ${req.originalUrl}] ${err.message}`);
      message = "Internal server error";
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}
