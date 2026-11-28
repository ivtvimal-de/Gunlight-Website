import express from "express";
import {
  getAdminProducts,
  getAdminProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { requireAuth, requireAdmin, requireCsrf } from "../middleware/auth.js";
import {
  uploadImagesMiddleware,
  validateUploadedImages,
} from "../middleware/upload.js";

const router = express.Router();

router.use(requireAuth, requireAdmin, requireCsrf);

router.get("/", getAdminProducts);
router.get("/:id", getAdminProductById);
router.post(
  "/",
  uploadImagesMiddleware.array("images", 10),
  validateUploadedImages,
  createProduct
);
router.put(
  "/:id",
  uploadImagesMiddleware.array("images", 10),
  validateUploadedImages,
  updateProduct
);
router.delete("/:id", deleteProduct);

export default router;
