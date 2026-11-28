import express from "express";
import mongoose from "mongoose";
import { Video } from "../storage/models.js";
import {
  getAdminVideos,
  getAdminVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
} from "../controllers/videoController.js";
import { requireAuth, requireAdmin, requireCsrf } from "../middleware/auth.js";
import {
  uploadVideoMiddleware,
  maybeUploadVideoMiddleware,
} from "../middleware/videoUpload.js";

const router = express.Router();

router.use(requireAuth, requireAdmin, requireCsrf);

/**
 * Validate video target before reading/uploading any replacement file.
 */
async function ensureTargetVideoExists(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid identifier format for _id.",
      });
    }
    const exists = await Video.exists({ _id: req.params.id });
    if (!exists) {
      return res.status(404).json({
        success: false,
        message: "Video not found.",
      });
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

router.get("/", getAdminVideos);
router.get("/:id", getAdminVideoById);
router.post("/", uploadVideoMiddleware, createVideo);
router.put(
  "/:id",
  ensureTargetVideoExists,
  maybeUploadVideoMiddleware,
  updateVideo
);
router.delete("/:id", deleteVideo);

export default router;
