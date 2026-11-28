import express from "express";
<<<<<<< HEAD
import { loginAdmin, logoutAdmin, getMe } from "../controllers/authController.js";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { uploadImages, removeUploadedImage } from "../controllers/uploadController.js";
import {
=======
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
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
  requireAuth,
  requireAdmin,
  loginRateLimiter,
} from "../middleware/auth.js";
<<<<<<< HEAD
import { uploadImagesMiddleware } from "../middleware/upload.js";

const router = express.Router();

// Auth endpoints
router.post("/login", loginRateLimiter, loginAdmin);
router.post("/logout", logoutAdmin);
=======
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
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
router.get("/me", requireAuth, requireAdmin, getMe);

// Dashboard analytics
router.get("/dashboard", requireAuth, requireAdmin, getDashboardStats);

// Cloudinary media upload & cleanup
router.post(
  "/upload",
  requireAuth,
  requireAdmin,
<<<<<<< HEAD
  uploadImagesMiddleware.array("images", 10),
  uploadImages
);
router.delete("/upload", requireAuth, requireAdmin, removeUploadedImage);
=======
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
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)

export default router;
