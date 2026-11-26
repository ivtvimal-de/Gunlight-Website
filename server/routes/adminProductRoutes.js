import express from "express";
import {
  getAdminProducts,
  getAdminProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { uploadImagesMiddleware } from "../middleware/upload.js";

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/", getAdminProducts);
router.get("/:id", getAdminProductById);
router.post("/", uploadImagesMiddleware.array("images", 10), createProduct);
router.put("/:id", uploadImagesMiddleware.array("images", 10), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
