import mongoose from "mongoose";

const FORBIDDEN_KEYS = new Set(["__proto__", "constructor", "prototype"]);

/**
 * Recursively strip MongoDB operator keys ($...) and dotted keys from user input
 * in-place to guard against NoSQL query injection and prototype pollution.
 */
export function sanitizeValue(value) {
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i += 1) {
      value[i] = sanitizeValue(value[i]);
    }
    return value;
  }

  if (
    value &&
    typeof value === "object" &&
    !(value instanceof Date) &&
    !Buffer.isBuffer(value)
  ) {
    for (const key of Object.keys(value)) {
      if (FORBIDDEN_KEYS.has(key) || key.startsWith("$") || key.includes(".")) {
        delete value[key];
      } else {
        value[key] = sanitizeValue(value[key]);
      }
    }
  }

  return value;
}

/**
 * Express middleware that sanitizes req.body, req.query, and req.params.
 */
export function sanitizeInput(req, _res, next) {
  if (req.body && typeof req.body === "object") {
    sanitizeValue(req.body);
  }
  if (req.query && typeof req.query === "object") {
    sanitizeValue(req.query);
  }
  if (req.params && typeof req.params === "object") {
    sanitizeValue(req.params);
  }
  next();
}

export function isValidObjectId(id) {
  return typeof id === "string" && mongoose.Types.ObjectId.isValid(id);
}
