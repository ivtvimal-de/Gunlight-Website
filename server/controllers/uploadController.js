import {
  uploadBufferToCloudinary,
  deleteFromCloudinary,
} from "../config/cloudinary.js";
import { logAdminActivity } from "../utils/helpers.js";

/**
 * POST /api/admin/upload
 * Uploads 1..10 validated images to Cloudinary and returns their secure URLs & public IDs.
 */
export async function uploadImages(req, res, next) {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one image file to upload.",
      });
    }

    const folder =
      typeof req.body?.folder === "string" && req.body.folder.startsWith("gunlite/")
        ? req.body.folder
        : "gunlite/products";

    const uploaded = await Promise.all(
      files.map((file) => uploadBufferToCloudinary(file.buffer, folder, file.mimetype))
    );

    await logAdminActivity({
      admin: req.admin,
      action: "UPLOAD_IMAGE",
      entityType: "media",
      summary: `Uploaded ${uploaded.length} image${uploaded.length > 1 ? "s" : ""} to Cloudinary`,
    });

    res.status(201).json({
      success: true,
      files: uploaded,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/admin/upload
 * Removes a single Cloudinary asset by publicId.
 */
export async function removeUploadedImage(req, res, next) {
  try {
    const publicId = req.body?.publicId || req.query?.publicId;
    if (!publicId || typeof publicId !== "string") {
      return res.status(400).json({
        success: false,
        message: "publicId is required to delete an uploaded image.",
      });
    }

    await deleteFromCloudinary(publicId);

    await logAdminActivity({
      admin: req.admin,
      action: "DELETE_IMAGE",
      entityType: "media",
      entityId: publicId,
      summary: `Removed Cloudinary asset ${publicId}`,
    });

    res.status(200).json({
      success: true,
      message: "Image removed successfully.",
    });
  } catch (err) {
    next(err);
  }
}
