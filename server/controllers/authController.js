import jwt from "jsonwebtoken";
import { Admin } from "../storage/models.js";
import {
  COOKIE_NAME,
  CSRF_COOKIE_NAME,
  getCookieOptions,
  getCsrfCookieOptions,
  getJwtSecret,
  signAdminToken,
  ensureCsrfCookie,
} from "../middleware/auth.js";
import { logAdminActivity } from "../utils/helpers.js";

/**
 * GET /api/admin/csrf-token
 * Issues (or returns existing valid) signed HttpOnly CSRF cookie + matching JSON token.
 */
export function getCsrfToken(req, res, next) {
  try {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    const csrfToken = ensureCsrfCookie(req, res);
    res.status(200).json({
      success: true,
      csrfToken,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/login
 */
export async function loginAdmin(req, res, next) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid admin email address.",
      });
    }

    const admin = await Admin.findOne({ email: normalizedEmail }).select("+passwordHash");
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    admin.lastLoginAt = new Date();
    await admin.save();

    const token = signAdminToken(admin);
    res.cookie(COOKIE_NAME, token, getCookieOptions(req));
    const csrfToken = ensureCsrfCookie(req, res, { rotate: true });

    await logAdminActivity({
      admin,
      action: "LOGIN",
      entityType: "auth",
      entityId: admin._id,
      summary: `Admin ${admin.email} signed in`,
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      csrfToken,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLoginAt: admin.lastLoginAt,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/logout
 */
export async function logoutAdmin(req, res, next) {
  try {
    let authedAdmin = req.admin || null;
    if (!authedAdmin && req.cookies?.[COOKIE_NAME]) {
      try {
        const decoded = jwt.verify(req.cookies[COOKIE_NAME], getJwtSecret());
        authedAdmin = await Admin.findById(decoded.id).select("-passwordHash");
      } catch {
        authedAdmin = null;
      }
    }

    const authCookieOpts = getCookieOptions(req);
    delete authCookieOpts.maxAge;
    res.clearCookie(COOKIE_NAME, authCookieOpts);

    const csrfCookieOpts = getCsrfCookieOptions(req);
    delete csrfCookieOpts.maxAge;
    res.clearCookie(CSRF_COOKIE_NAME, csrfCookieOpts);

    if (authedAdmin) {
      await logAdminActivity({
        admin: authedAdmin,
        action: "LOGOUT",
        entityType: "auth",
        entityId: authedAdmin._id,
        summary: `Admin ${authedAdmin.email} signed out`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/me
 */
export async function getMe(req, res, next) {
  try {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    const csrfToken = ensureCsrfCookie(req, res);
    res.status(200).json({
      success: true,
      csrfToken,
      admin: req.admin,
    });
  } catch (err) {
    next(err);
  }
}
