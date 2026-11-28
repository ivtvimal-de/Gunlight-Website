import express from "express";
import {
  getAdminBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../controllers/brandController.js";
import { requireAuth, requireAdmin, requireCsrf } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth, requireAdmin, requireCsrf);

router.get("/", getAdminBrands);
router.post("/", createBrand);
router.put("/:id", updateBrand);
router.delete("/:id", deleteBrand);

export default router;
