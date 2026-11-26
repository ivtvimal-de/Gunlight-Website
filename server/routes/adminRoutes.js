import express from "express";
import { loginAdmin, logoutAdmin, getMe } from "../controllers/authController.js";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { uploadImages, removeUploadedImage } from "../controllers/uploadController.js";
import {
  requireAuth,
  requireAdmin,
  loginRateLimiter,
} from "../middleware/auth.js";
import { uploadImagesMiddleware } from "../middleware/upload.js";

const router = express.Router();

// Auth endpoints
router.post("/login", loginRateLimiter, loginAdmin);
router.post("/logout", logoutAdmin);
router.get("/me", requireAuth, requireAdmin, getMe);

// Dashboard analytics
router.get("/dashboard", requireAuth, requireAdmin, getDashboardStats);

// Cloudinary media upload & cleanup
router.post(
  "/upload",
  requireAuth,
  requireAdmin,
  uploadImagesMiddleware.array("images", 10),
  uploadImages
);
router.delete("/upload", requireAuth, requireAdmin, removeUploadedImage);

export default router;
