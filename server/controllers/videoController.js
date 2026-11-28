import mongoose from "mongoose";
import { Product, Video } from "../storage/models.js";
import {
  deleteFromCloudinary,
  uploadVideoFileToCloudinary,
} from "../config/cloudinary.js";
import { logAdminActivity } from "../utils/helpers.js";
import { validateNonDataVideoUrl } from "../utils/videoValidation.js";
import {
  removeTempVideoFile,
  validateTempVideoFile,
} from "../middleware/videoUpload.js";

async function cleanupCloudinaryVideo(publicId, context) {
  if (!publicId) return;
  try {
    await deleteFromCloudinary(publicId, "video");
  } catch (cleanupErr) {
    console.error(
      `Cloudinary video cleanup failed (${context}, publicId=${publicId}):`,
      cleanupErr?.message || cleanupErr
    );
  }
}

async function resolveAssignedProduct(productInput) {
  if (!productInput || !mongoose.Types.ObjectId.isValid(String(productInput))) {
    const err = new Error("Please select a valid product.");
    err.statusCode = 400;
    throw err;
  }
  const prod = await Product.findById(productInput).select("_id name slug").lean();
  if (!prod) {
    const err = new Error("Selected product does not exist.");
    err.statusCode = 400;
    throw err;
  }
  return prod._id;
}

function validateVideoStatus(rawStatus, fallback = "draft") {
  if (rawStatus === undefined || rawStatus === null || rawStatus === "") {
    return fallback;
  }
  if (rawStatus !== "draft" && rawStatus !== "published") {
    const err = new Error('Video status must be either "draft" or "published".');
    err.statusCode = 400;
    throw err;
  }
  return rawStatus;
}

function validateTitleAndDescription(title, description) {
  if (!title) {
    const err = new Error("Video title is required.");
    err.statusCode = 400;
    throw err;
  }
  if (title.length > 140) {
    const err = new Error("Video title cannot exceed 140 characters.");
    err.statusCode = 400;
    throw err;
  }
  if (description.length > 2000) {
    const err = new Error("Video description cannot exceed 2000 characters.");
    err.statusCode = 400;
    throw err;
  }
}

/**
 * GET /api/admin/videos (Protected)
 */
export async function getAdminVideos(req, res, next) {
  try {
    const { product = "", status = "", search = "" } = req.query;
    const filter = {};

    if (product && mongoose.Types.ObjectId.isValid(String(product))) {
      filter.product = product;
    }
    if (status === "draft" || status === "published") {
      filter.status = status;
    }
    if (search && String(search).trim()) {
      const term = String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(term, "i");
      filter.$or = [{ title: regex }, { description: regex }];
    }

    const videos = await Video.find(filter)
      .populate("product", "name slug sku")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      videos,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/videos/:id (Protected)
 */
export async function getAdminVideoById(req, res, next) {
  try {
    const video = await Video.findById(req.params.id)
      .populate("product", "name slug sku")
      .lean();

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found.",
      });
    }

    res.status(200).json({
      success: true,
      video,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/videos (Protected)
 */
export async function createVideo(req, res, next) {
  let uploadedPublicId = "";
  let saved = false;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an MP4 or WebM video file to upload.",
      });
    }

    const body = req.body || {};
    const title = String(body.title || "").trim();
    const description = String(body.description || "").trim();

    validateTitleAndDescription(title, description);
    const productId = await resolveAssignedProduct(body.product);
    const status = validateVideoStatus(body.status, "draft");

    // Enforce size and magic bytes completely BEFORE opening any Cloudinary upload
    const detectedFormat = await validateTempVideoFile(req.file);

    const cloudMedia = await uploadVideoFileToCloudinary(req.file.path, {
      folder: "gunlite/videos",
      fileSize: req.file.size,
    });
    uploadedPublicId = cloudMedia.publicId;

    const videoUrl = validateNonDataVideoUrl(cloudMedia.videoUrl, "video");
    const thumbnailUrl = validateNonDataVideoUrl(
      cloudMedia.thumbnailUrl || "",
      "video thumbnail"
    );

    const created = await Video.create({
      title,
      description,
      product: productId,
      videoUrl,
      publicId: cloudMedia.publicId,
      thumbnailUrl,
      format: detectedFormat,
      fileSize: req.file.size,
      status,
    });
    saved = true;
    uploadedPublicId = "";

    const populated = await Video.findById(created._id)
      .populate("product", "name slug sku")
      .lean();

    await logAdminActivity({
      admin: req.admin,
      action: "CREATE_VIDEO",
      entityType: "video",
      entityId: created._id,
      summary: `Uploaded video "${created.title}" (${created.format}, ${created.status})`,
    });

    res.status(201).json({
      success: true,
      message: "Video uploaded successfully.",
      video: populated,
    });
  } catch (err) {
    if (!saved && uploadedPublicId) {
      await cleanupCloudinaryVideo(uploadedPublicId, "createVideo rollback");
    }
    next(err);
  } finally {
    await removeTempVideoFile(req.file?.path);
  }
}

/**
 * PUT /api/admin/videos/:id (Protected)
 */
export async function updateVideo(req, res, next) {
  let newPublicId = "";
  let saved = false;

  try {
    const existing = await Video.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Video not found.",
      });
    }

    const oldPublicId = existing.publicId;
    const body = req.body || {};

    const title =
      body.title !== undefined ? String(body.title).trim() : existing.title;
    const description =
      body.description !== undefined
        ? String(body.description).trim()
        : existing.description;

    validateTitleAndDescription(title, description);

    const productId =
      body.product !== undefined
        ? await resolveAssignedProduct(body.product)
        : existing.product;

    const status = validateVideoStatus(body.status, existing.status);

    existing.title = title;
    existing.description = description;
    existing.product = productId;
    existing.status = status;

    const replacedFile = Boolean(req.file);
    if (req.file) {
      const detectedFormat = await validateTempVideoFile(req.file);

      const cloudMedia = await uploadVideoFileToCloudinary(req.file.path, {
        folder: "gunlite/videos",
        fileSize: req.file.size,
      });
      newPublicId = cloudMedia.publicId;

      existing.videoUrl = validateNonDataVideoUrl(cloudMedia.videoUrl, "video");
      existing.publicId = cloudMedia.publicId;
      existing.thumbnailUrl = validateNonDataVideoUrl(
        cloudMedia.thumbnailUrl || "",
        "video thumbnail"
      );
      existing.format = detectedFormat;
      existing.fileSize = req.file.size;
    }

    await existing.save();
    saved = true;
    newPublicId = "";

    if (replacedFile && oldPublicId && oldPublicId !== existing.publicId) {
      await cleanupCloudinaryVideo(
        oldPublicId,
        "updateVideo replaced old asset"
      );
    }

    const populated = await Video.findById(existing._id)
      .populate("product", "name slug sku")
      .lean();

    await logAdminActivity({
      admin: req.admin,
      action: "UPDATE_VIDEO",
      entityType: "video",
      entityId: existing._id,
      summary: `Updated video "${existing.title}"${replacedFile ? " (file replaced)" : ""}`,
    });

    res.status(200).json({
      success: true,
      message: "Video updated successfully.",
      video: populated,
    });
  } catch (err) {
    if (!saved && newPublicId) {
      await cleanupCloudinaryVideo(newPublicId, "updateVideo rollback");
    }
    next(err);
  } finally {
    await removeTempVideoFile(req.file?.path);
  }
}

/**
 * DELETE /api/admin/videos/:id (Protected)
 */
export async function deleteVideo(req, res, next) {
  try {
    const existing = await Video.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Video not found.",
      });
    }

    const oldPublicId = existing.publicId;
    const deletedTitle = existing.title;
    const deletedId = existing._id;

    await existing.deleteOne();

    if (oldPublicId) {
      await cleanupCloudinaryVideo(oldPublicId, "deleteVideo cleanup");
    }

    await logAdminActivity({
      admin: req.admin,
      action: "DELETE_VIDEO",
      entityType: "video",
      entityId: deletedId,
      summary: `Deleted video "${deletedTitle}"`,
    });

    res.status(200).json({
      success: true,
      message: "Video deleted permanently.",
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/videos (Public — published videos only, optional ?product=<idOrSlug>)
 */
export async function getPublicVideos(req, res, next) {
  try {
    const productParam = String(req.query.product || "").trim();
    const filter = { status: "published" };

    if (productParam) {
      const productQuery = mongoose.Types.ObjectId.isValid(productParam)
        ? { _id: productParam, status: "published" }
        : { slug: productParam.toLowerCase(), status: "published" };

      const targetProduct = await Product.findOne(productQuery)
        .select("_id")
        .lean();

      if (!targetProduct) {
        return res.status(200).json({
          success: true,
          videos: [],
        });
      }
      filter.product = targetProduct._id;
    }

    const videos = await Video.find(filter)
      .populate({
        path: "product",
        match: { status: "published" },
        select: "name slug sku",
      })
      .select(
        "title description product videoUrl thumbnailUrl format fileSize status createdAt updatedAt"
      )
      .sort({ createdAt: -1 })
      .lean();

    const visibleVideos = videos.filter((v) => Boolean(v.product));

    return res.status(200).json({
      success: true,
      videos: visibleVideos,
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/videos/:id (Public — published video only)
 */
export async function getPublicVideoById(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "Video not found or currently unavailable.",
      });
    }

    const video = await Video.findOne({ _id: id, status: "published" })
      .populate({
        path: "product",
        match: { status: "published" },
        select: "name slug sku",
      })
      .select(
        "title description product videoUrl thumbnailUrl format fileSize status createdAt updatedAt"
      )
      .lean();

    if (!video || !video.product) {
      return res.status(404).json({
        success: false,
        message: "Video not found or currently unavailable.",
      });
    }

    return res.status(200).json({
      success: true,
      video,
    });
  } catch (err) {
    return next(err);
  }
}
