import express from "express";
import { getPublicBrands } from "../controllers/brandController.js";

const router = express.Router();

router.get("/", getPublicBrands);

export default router;
