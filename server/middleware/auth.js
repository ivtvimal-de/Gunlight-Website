import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { Admin } from "../storage/models.js";

export const COOKIE_NAME = "gunlite_admin_token";

export function getCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
}

export function signAdminToken(admin) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is missing in environment variables.");
  }
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
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in as an administrator.",
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({
        success: false,
        message: "Server authentication is not configured.",
      });
    }

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
  } catch (err) {
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
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts from this IP. Please try again in 15 minutes.",
  },
});
