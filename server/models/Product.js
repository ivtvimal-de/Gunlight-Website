import mongoose from "mongoose";

function rejectDataUrl(val) {
  if (!val) return true;
  return !/^data:/i.test(String(val).trim());
}

const productImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: rejectDataUrl,
        message: "Base64 data: URLs are not allowed for product images",
      },
    },
    publicId: { type: String, default: "", trim: true },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: true }
);

const productSpecSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [140, "Product name cannot exceed 140 characters"],
    },
    slug: {
      type: String,
      required: [true, "Product slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    sku: {
      type: String,
      required: [true, "SKU / Product code is required"],
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: [40, "SKU cannot exceed 40 characters"],
    },
    brand: {
      type: String,
      trim: true,
      default: "GunLite",
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    shortSpec: {
      type: String,
      trim: true,
      default: "",
      maxlength: [80, "Short spec cannot exceed 80 characters"],
    },
    specs: {
      type: [productSpecSchema],
      default: [],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [function () { return this.isNew; }, "Primary category is required"],
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price must be zero or greater"],
    },
    discountPrice: {
      type: Number,
      default: null,
      validate: {
        validator(val) {
          if (val === null || val === undefined || val === "") return true;
          return Number(val) >= 0 && Number(val) <= Number(this.price);
        },
        message: "Discount price must be between 0 and regular price",
      },
    },
    stockQuantity: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock quantity cannot be negative"],
      default: 0,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    badge: {
      type: String,
      trim: true,
      default: "",
      maxlength: [32, "Badge text cannot exceed 32 characters"],
    },
    warrantyEnabled: {
      type: Boolean,
      default: true,
    },
    warrantyPrice: {
      type: Number,
      min: [0, "Warranty price cannot be negative"],
      default: 500,
    },
    warrantyLabel: {
      type: String,
      trim: true,
      default: "1-Year Warranty",
    },
    images: {
      type: [productImageSchema],
      default: [],
    },
    heroImage: {
      url: {
        type: String,
        default: "",
        validate: {
          validator: rejectDataUrl,
          message: "Base64 data: URLs are not allowed for hero image",
        },
      },
      publicId: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", sku: "text", shortSpec: "text" });
productSchema.index({ status: 1, isFeatured: -1, createdAt: -1 });
productSchema.index({ category: 1, status: 1 });

export default mongoose.model("Product", productSchema);
