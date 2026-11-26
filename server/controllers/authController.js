import { Admin } from "../storage/models.js";
import {
  COOKIE_NAME,
  getCookieOptions,
  signAdminToken,
} from "../middleware/auth.js";
import { logAdminActivity } from "../utils/helpers.js";

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

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select("+passwordHash");
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
export async function getMe(req, res) {
  res.status(200).json({
    success: true,
    admin: req.admin,
  });
}
