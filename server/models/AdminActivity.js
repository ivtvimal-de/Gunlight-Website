import mongoose from "mongoose";

const adminActivitySchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    adminEmail: {
      type: String,
      default: "",
      trim: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "LOGIN",
        "LOGOUT",
        "CREATE_PRODUCT",
        "UPDATE_PRODUCT",
        "DELETE_PRODUCT",
        "TOGGLE_PRODUCT_STATUS",
        "CREATE_CATEGORY",
        "UPDATE_CATEGORY",
        "DELETE_CATEGORY",
        "CREATE_BRAND",
        "UPDATE_BRAND",
        "DELETE_BRAND",
        "CREATE_VIDEO",
        "UPDATE_VIDEO",
        "DELETE_VIDEO",
        "UPLOAD_IMAGE",
        "DELETE_IMAGE",
      ],
    },
    entityType: {
      type: String,
      required: true,
      enum: ["auth", "product", "category", "brand", "video", "media"],
    },
    entityId: {
      type: String,
      default: "",
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

adminActivitySchema.index({ createdAt: -1 });

export default mongoose.model("AdminActivity", adminActivitySchema);
