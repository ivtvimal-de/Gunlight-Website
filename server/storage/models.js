import MongooseAdmin from "../models/Admin.js";
import MongooseCategory from "../models/Category.js";
import MongooseBrand from "../models/Brand.js";
import MongooseProduct from "../models/Product.js";
import MongooseVideo from "../models/Video.js";
import MongooseAdminActivity from "../models/AdminActivity.js";

/**
 * Local JSON store mode is disabled; always expose Mongoose models backed by MongoDB.
 */
export function isLocalStoreMode() {
  return false;
}

export const Admin = MongooseAdmin;
export const Category = MongooseCategory;
export const Brand = MongooseBrand;
export const Product = MongooseProduct;
export const Video = MongooseVideo;
export const AdminActivity = MongooseAdminActivity;
