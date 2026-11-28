import express from "express";
import {
  getPublicVideos,
  getPublicVideoById,
} from "../controllers/videoController.js";

const router = express.Router();

router.get("/", getPublicVideos);
router.get("/:id", getPublicVideoById);

export default router;
