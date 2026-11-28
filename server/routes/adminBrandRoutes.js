import express from "express";
import {
  getAdminBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../controllers/brandController.js";
<<<<<<< HEAD
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth, requireAdmin);
=======
import { requireAuth, requireAdmin, requireCsrf } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth, requireAdmin, requireCsrf);
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)

router.get("/", getAdminBrands);
router.post("/", createBrand);
router.put("/:id", updateBrand);
router.delete("/:id", deleteBrand);

export default router;
