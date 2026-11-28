import express from "express";
import {
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { requireAuth, requireAdmin, requireCsrf } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth, requireAdmin, requireCsrf);

router.get("/", getAdminCategories);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
