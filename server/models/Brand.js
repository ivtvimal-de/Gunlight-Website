import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      unique: true,
      trim: true,
      maxlength: [80, "Brand name cannot exceed 80 characters"],
    },
    slug: {
      type: String,
      required: [true, "Brand slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    tagline: {
      type: String,
      trim: true,
      default: "",
      maxlength: [200, "Tagline cannot exceed 200 characters"],
    },
    taglineHi: {
      type: String,
      trim: true,
      default: "",
      maxlength: [260, "Hindi tagline cannot exceed 260 characters"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    descriptionHi: {
      type: String,
      trim: true,
      default: "",
      maxlength: [650, "Hindi description cannot exceed 650 characters"],
    },
    logo: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    bannerImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    isFlagship: {
      type: Boolean,
      default: false,
    },
    isComingSoon: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Brand", brandSchema);
