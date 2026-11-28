<<<<<<< HEAD
import { Admin } from "../storage/models.js";
import {
  COOKIE_NAME,
  getCookieOptions,
  signAdminToken,
=======
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
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
} from "../middleware/auth.js";
import { logAdminActivity } from "../utils/helpers.js";

/**
<<<<<<< HEAD
=======
 * GET /api/admin/csrf-token
 * Issues (or returns existing valid) signed HttpOnly CSRF cookie + matching JSON token.
 */
export function getCsrfToken(req, res, next) {
  try {
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
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
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

<<<<<<< HEAD
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select("+passwordHash");
=======
    const normalizedEmail = email.toLowerCase().trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid admin email address.",
      });
    }

    const admin = await Admin.findOne({ email: normalizedEmail }).select("+passwordHash");
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
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
    res.cookie(COOKIE_NAME, token, getCookieOptions());
<<<<<<< HEAD
=======
    const csrfToken = ensureCsrfCookie(req, res, { rotate: true });
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)

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
<<<<<<< HEAD
=======
      csrfToken,
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
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
<<<<<<< HEAD
    const cookieOpts = getCookieOptions();
    delete cookieOpts.maxAge;
    res.clearCookie(COOKIE_NAME, cookieOpts);

    if (req.admin) {
      await logAdminActivity({
        admin: req.admin,
        action: "LOGOUT",
        entityType: "auth",
        entityId: req.admin._id,
        summary: `Admin ${req.admin.email} signed out`,
=======
    let authedAdmin = req.admin || null;
    if (!authedAdmin && req.cookies?.[COOKIE_NAME]) {
      try {
        const decoded = jwt.verify(req.cookies[COOKIE_NAME], getJwtSecret());
        authedAdmin = await Admin.findById(decoded.id).select("-passwordHash");
      } catch {
        authedAdmin = null;
      }
    }

    const authCookieOpts = getCookieOptions();
    delete authCookieOpts.maxAge;
    res.clearCookie(COOKIE_NAME, authCookieOpts);

    const csrfCookieOpts = getCsrfCookieOptions();
    delete csrfCookieOpts.maxAge;
    res.clearCookie(CSRF_COOKIE_NAME, csrfCookieOpts);

    if (authedAdmin) {
      await logAdminActivity({
        admin: authedAdmin,
        action: "LOGOUT",
        entityType: "auth",
        entityId: authedAdmin._id,
        summary: `Admin ${authedAdmin.email} signed out`,
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
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
<<<<<<< HEAD
export async function getMe(req, res) {
  res.status(200).json({
    success: true,
    admin: req.admin,
  });
=======
export async function getMe(req, res, next) {
  try {
    const csrfToken = ensureCsrfCookie(req, res);
    res.status(200).json({
      success: true,
      csrfToken,
      admin: req.admin,
    });
  } catch (err) {
    next(err);
  }
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
}
