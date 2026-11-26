import express from "express";
import {
  getAdminBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../controllers/brandController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/", getAdminBrands);
router.post("/", createBrand);
router.put("/:id", updateBrand);
router.delete("/:id", deleteBrand);

export default router;
