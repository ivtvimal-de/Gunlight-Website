import express from "express";
import {
  getAdminProducts,
  getAdminProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
<<<<<<< HEAD
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { uploadImagesMiddleware } from "../middleware/upload.js";

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/", getAdminProducts);
router.get("/:id", getAdminProductById);
router.post("/", uploadImagesMiddleware.array("images", 10), createProduct);
router.put("/:id", uploadImagesMiddleware.array("images", 10), updateProduct);
=======
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
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
router.delete("/:id", deleteProduct);

export default router;
