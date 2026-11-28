<<<<<<< HEAD
=======
import crypto from "node:crypto";
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { Admin } from "../storage/models.js";

export const COOKIE_NAME = "gunlite_admin_token";
<<<<<<< HEAD

export function getCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
=======
export const CSRF_COOKIE_NAME = "gunlite_csrf";
export const CSRF_HEADER_NAME = "x-csrf-token";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function isPlaceholderSecret(val) {
  if (!val || typeof val !== "string") return true;
  const trimmed = val.trim();
  return (
    !trimmed ||
    trimmed.startsWith("replace_with_") ||
    trimmed.startsWith("your_") ||
    trimmed.includes("<") ||
    trimmed === "replace_me"
  );
}

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (isPlaceholderSecret(secret)) {
    throw new Error(
      "JWT_SECRET is missing or still a placeholder in server/.env."
    );
  }
  return secret.trim();
}

function getCsrfSigningSecret() {
  const dedicated = process.env.CSRF_SECRET;
  if (!isPlaceholderSecret(dedicated)) {
    return dedicated.trim();
  }
  return getJwtSecret();
}

function resolveCookieSameSite(isProduction) {
  const configured = (process.env.COOKIE_SAME_SITE || "").trim().toLowerCase();
  if (configured === "lax" || configured === "strict" || configured === "none") {
    return configured;
  }
  return isProduction ? "none" : "lax";
}

export function getCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";
  const sameSite = resolveCookieSameSite(isProduction);
  return {
    httpOnly: true,
    secure: sameSite === "none" ? true : isProduction,
    sameSite,
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
}

<<<<<<< HEAD
export function signAdminToken(admin) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is missing in environment variables.");
  }
=======
export function getCsrfCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";
  const sameSite = resolveCookieSameSite(isProduction);
  return {
    httpOnly: true,
    secure: sameSite === "none" ? true : isProduction,
    sameSite,
    path: "/",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  };
}

export function generateSignedCsrfToken() {
  const nonce = crypto.randomBytes(32).toString("hex");
  const sig = crypto
    .createHmac("sha256", getCsrfSigningSecret())
    .update(nonce)
    .digest("hex");
  return `${nonce}.${sig}`;
}

export function verifySignedCsrfToken(token) {
  if (typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [nonce, sig] = parts;
  if (!/^[a-f0-9]{64}$/i.test(nonce) || !/^[a-f0-9]{64}$/i.test(sig)) {
    return false;
  }
  const expectedSig = crypto
    .createHmac("sha256", getCsrfSigningSecret())
    .update(nonce)
    .digest("hex");

  const sigBuf = Buffer.from(sig, "utf8");
  const expectedBuf = Buffer.from(expectedSig, "utf8");
  if (sigBuf.length !== expectedBuf.length) return false;
  return crypto.timingSafeEqual(sigBuf, expectedBuf);
}

/**
 * Ensure an HttpOnly signed CSRF cookie exists on the response and return its token
 * so cross-domain frontends receive it via JSON without reading document.cookie.
 */
export function ensureCsrfCookie(req, res, { rotate = false } = {}) {
  const existing = req.cookies?.[CSRF_COOKIE_NAME];
  if (!rotate && existing && verifySignedCsrfToken(existing)) {
    return existing;
  }
  const fresh = generateSignedCsrfToken();
  res.cookie(CSRF_COOKIE_NAME, fresh, getCsrfCookieOptions());
  return fresh;
}

/**
 * Verify signed double-submit CSRF token (HttpOnly cookie + X-CSRF-Token header).
 * Works both same-origin (proxied) and cross-domain without reading document.cookie.
 */
export function requireCsrf(req, res, next) {
  if (SAFE_METHODS.has(req.method)) {
    return next();
  }

  try {
    const cookieToken = req.cookies?.[CSRF_COOKIE_NAME];
    const headerToken = req.get(CSRF_HEADER_NAME);

    if (
      !cookieToken ||
      !headerToken ||
      typeof cookieToken !== "string" ||
      typeof headerToken !== "string"
    ) {
      return res.status(403).json({
        success: false,
        code: "CSRF_INVALID",
        message: "Missing CSRF token. Please refresh and try again.",
      });
    }

    if (!verifySignedCsrfToken(cookieToken)) {
      return res.status(403).json({
        success: false,
        code: "CSRF_INVALID",
        message: "Invalid CSRF cookie signature. Please refresh and try again.",
      });
    }

    const cookieBuf = Buffer.from(cookieToken, "utf8");
    const headerBuf = Buffer.from(headerToken.trim(), "utf8");
    if (
      cookieBuf.length !== headerBuf.length ||
      !crypto.timingSafeEqual(cookieBuf, headerBuf)
    ) {
      return res.status(403).json({
        success: false,
        code: "CSRF_INVALID",
        message: "CSRF token mismatch. Please refresh and try again.",
      });
    }

    return next();
  } catch (err) {
    return next(err);
  }
}

export function signAdminToken(admin) {
  const secret = getJwtSecret();
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
  return jwt.sign(
    { id: admin._id.toString(), role: admin.role },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

/**
 * Verify JWT stored in HTTP-only cookie and load the authenticated admin record.
 */
export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[COOKIE_NAME];
<<<<<<< HEAD
    if (!token) {
=======
    if (!token || typeof token !== "string") {
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in as an administrator.",
      });
    }

<<<<<<< HEAD
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({
        success: false,
        message: "Server authentication is not configured.",
      });
    }

=======
    const secret = getJwtSecret();
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
    const decoded = jwt.verify(token, secret);
    const admin = await Admin.findById(decoded.id).select("-passwordHash");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin session is no longer valid.",
      });
    }

    req.admin = admin;
    next();
<<<<<<< HEAD
  } catch (err) {
=======
  } catch {
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication session.",
    });
  }
}

/**
 * Restrict route access strictly to authenticated administrators.
 */
export function requireAdmin(req, res, next) {
  if (!req.admin || req.admin.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Forbidden: administrator privileges required.",
    });
  }
  next();
}

/**
 * Rate limiter for admin login endpoint to protect against brute-force attempts.
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
<<<<<<< HEAD
  max: 15,
=======
  max: 10,
  skipSuccessfulRequests: true,
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
<<<<<<< HEAD
    message: "Too many login attempts from this IP. Please try again in 15 minutes.",
=======
    message: "Too many failed login attempts from this IP. Please try again in 15 minutes.",
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
  },
});
