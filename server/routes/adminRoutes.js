import express from "express";
import {
  getCsrfToken,
  loginAdmin,
  logoutAdmin,
  getMe,
} from "../controllers/authController.js";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { uploadImages, removeUploadedImage } from "../controllers/uploadController.js";
import {
  requireCsrf,
  requireAuth,
  requireAdmin,
  loginRateLimiter,
} from "../middleware/auth.js";
import {
  uploadImagesMiddleware,
  validateUploadedImages,
} from "../middleware/upload.js";

const router = express.Router();

// CSRF token bootstrap endpoint
router.get("/csrf-token", getCsrfToken);

// Auth endpoints (no public registration)
router.post("/login", loginRateLimiter, requireCsrf, loginAdmin);
router.post("/logout", requireCsrf, logoutAdmin);
router.get("/me", requireAuth, requireAdmin, getMe);

// Dashboard analytics
router.get("/dashboard", requireAuth, requireAdmin, getDashboardStats);

// Cloudinary media upload & cleanup
router.post(
  "/upload",
  requireAuth,
  requireAdmin,
  requireCsrf,
  uploadImagesMiddleware.array("images", 10),
  validateUploadedImages,
  uploadImages
);
router.delete(
  "/upload",
  requireAuth,
  requireAdmin,
  requireCsrf,
  removeUploadedImage
);

export default router;
