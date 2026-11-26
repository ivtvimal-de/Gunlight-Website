import mongoose from "mongoose";
import { isLocalStoreMode } from "../storage/models.js";
import { initLocalStore, hasLocalBrandsKey } from "../storage/localStore.js";
import { ensureLocalSeedIfEmpty } from "../utils/seedInitialData.js";

/**
 * Connect to MongoDB Atlas / local MongoDB, or initialize local persistent JSON storage
 * when USE_LOCAL_STORE=true.
 */
export async function connectDB() {
  if (isLocalStoreMode()) {
    const hadBrandsKey = await hasLocalBrandsKey();
    await initLocalStore();
    await ensureLocalSeedIfEmpty({ seedMissingBrandsKey: !hadBrandsKey });
    return null;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is missing in server environment variables.");
  }

  mongoose.set("strictQuery", true);

  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });

  console.log(`MongoDB connected: ${conn.connection.host}`);
  return conn;
}

export async function disconnectDB() {
  if (!isLocalStoreMode() && mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
