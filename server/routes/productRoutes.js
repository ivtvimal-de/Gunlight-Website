import express from "express";
import {
  getPublicProducts,
  getPublicProductById,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getPublicProducts);
router.get("/:id", getPublicProductById);

export default router;
