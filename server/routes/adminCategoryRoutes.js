import express from "express";
import {
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
<<<<<<< HEAD
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth, requireAdmin);
=======
import { requireAuth, requireAdmin, requireCsrf } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth, requireAdmin, requireCsrf);
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)

router.get("/", getAdminCategories);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
