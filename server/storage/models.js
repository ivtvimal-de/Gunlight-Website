import MongooseAdmin from "../models/Admin.js";
import MongooseCategory from "../models/Category.js";
import MongooseBrand from "../models/Brand.js";
import MongooseProduct from "../models/Product.js";
<<<<<<< HEAD
import MongooseAdminActivity from "../models/AdminActivity.js";
import {
  LocalAdmin,
  LocalCategory,
  LocalBrand,
  LocalProduct,
  LocalAdminActivity,
} from "./localStore.js";

export function isLocalStoreMode() {
  if (process.env.USE_LOCAL_STORE === "true") return true;
  const uri = (process.env.MONGODB_URI || "").trim().toLowerCase();
  return !uri || uri === "local";
}

function createModelProxy(getTarget) {
  return new Proxy(
    {},
    {
      get(_target, prop) {
        const model = getTarget();
        const val = model[prop];
        return typeof val === "function" ? val.bind(model) : val;
      },
    }
  );
}

export const Admin = createModelProxy(() =>
  isLocalStoreMode() ? LocalAdmin : MongooseAdmin
);
export const Category = createModelProxy(() =>
  isLocalStoreMode() ? LocalCategory : MongooseCategory
);
export const Brand = createModelProxy(() =>
  isLocalStoreMode() ? LocalBrand : MongooseBrand
);
export const Product = createModelProxy(() =>
  isLocalStoreMode() ? LocalProduct : MongooseProduct
);
export const AdminActivity = createModelProxy(() =>
  isLocalStoreMode() ? LocalAdminActivity : MongooseAdminActivity
);
=======
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
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
