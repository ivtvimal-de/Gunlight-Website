import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Admin name is required"],
      trim: true,
<<<<<<< HEAD
=======
      maxlength: [80, "Admin name cannot exceed 80 characters"],
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
      default: "GunLite Administrator",
    },
    email: {
      type: String,
      required: [true, "Admin email is required"],
      unique: true,
      lowercase: true,
      trim: true,
<<<<<<< HEAD
=======
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid admin email"],
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
<<<<<<< HEAD
  { timestamps: true }
=======
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.passwordHash;
        return ret;
      },
    },
    toObject: {
      transform(_doc, ret) {
        delete ret.passwordHash;
        return ret;
      },
    },
  }
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
);

adminSchema.methods.comparePassword = function comparePassword(plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

export default mongoose.model("Admin", adminSchema);
