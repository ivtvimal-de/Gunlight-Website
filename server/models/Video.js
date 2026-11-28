import mongoose from "mongoose";
import { isSafeMediaUrl } from "../utils/helpers.js";
import { getMaxVideoSizeConfig } from "../utils/videoValidation.js";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Video title is required"],
      trim: true,
      maxlength: [140, "Video title cannot exceed 140 characters"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [2000, "Video description cannot exceed 2000 characters"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Assigned product is required"],
    },
    videoUrl: {
      type: String,
      required: [true, "Video URL is required"],
      trim: true,
      validate: {
        validator(val) {
          return isSafeMediaUrl(val, { allowEmpty: false });
        },
        message:
          "Video URL must be a valid http(s) or relative path; Base64 data: URLs and binary blobs are not allowed",
      },
    },
    publicId: {
      type: String,
      required: [true, "Cloudinary public ID is required"],
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      trim: true,
      default: "",
      validate: {
        validator(val) {
          return isSafeMediaUrl(val, { allowEmpty: true });
        },
        message:
          "Thumbnail URL must be a valid http(s) or relative path; Base64 data: URLs are not allowed",
      },
    },
    format: {
      type: String,
      required: [true, "Video format is required"],
      lowercase: true,
      trim: true,
      enum: {
        values: ["mp4", "webm"],
        message: 'Video format must be either "mp4" or "webm"',
      },
    },
    fileSize: {
      type: Number,
      required: [true, "Video file size is required"],
      validate: {
        validator(val) {
          const { maxBytes } = getMaxVideoSizeConfig();
          return (
            typeof val === "number" &&
            Number.isFinite(val) &&
            val > 0 &&
            val <= maxBytes
          );
        },
        message() {
          const { maxMb } = getMaxVideoSizeConfig();
          return `Video file size must be greater than 0 and at most ${maxMb} MB`;
        },
      },
    },
    status: {
      type: String,
      enum: {
        values: ["draft", "published"],
        message: 'Video status must be either "draft" or "published"',
      },
      default: "draft",
    },
  },
  { timestamps: true }
);

videoSchema.index({ product: 1, status: 1, createdAt: -1 });
videoSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("Video", videoSchema);
