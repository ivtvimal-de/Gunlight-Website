import MongooseAdmin from "../models/Admin.js";
import MongooseCategory from "../models/Category.js";
import MongooseProduct from "../models/Product.js";
import MongooseAdminActivity from "../models/AdminActivity.js";
import {
  LocalAdmin,
  LocalCategory,
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
export const Product = createModelProxy(() =>
  isLocalStoreMode() ? LocalProduct : MongooseProduct
);
export const AdminActivity = createModelProxy(() =>
  isLocalStoreMode() ? LocalAdminActivity : MongooseAdminActivity
);
