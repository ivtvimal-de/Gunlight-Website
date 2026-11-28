import mongoose from "mongoose";

function isPlaceholderUri(uri = "") {
  const trimmed = String(uri).trim();
  if (!trimmed) return true;
  const lower = trimmed.toLowerCase();
  return (
    lower === "local" ||
    trimmed.includes("<username>") ||
    trimmed.includes("<password>") ||
    trimmed.includes("<cluster>")
  );
}

/**
 * Mask user:password credentials in any MongoDB URI appearing in log/error text.
 */
export function maskMongoCredentials(text = "") {
  return String(text).replace(
    /(mongodb(?:\+srv)?:\/\/)([^:@\s]+):([^@\s]+)@/gi,
    "$1***:***@"
  );
}

/**
 * Connect strictly to MongoDB Atlas / MongoDB via Mongoose.
 * Local JSON persistence is disabled so all catalog and auth data lives in MongoDB.
 */
export async function connectDB() {
  if (process.env.USE_LOCAL_STORE === "true") {
    throw new Error(
      "USE_LOCAL_STORE=true is no longer supported. Set USE_LOCAL_STORE=false and configure MONGODB_URI for MongoDB Atlas."
    );
  }

  const uri = process.env.MONGODB_URI;
  if (isPlaceholderUri(uri)) {
    throw new Error(
      "MONGODB_URI is missing or still contains placeholder values in server/.env."
    );
  }

  if (!/^mongodb(\+srv)?:\/\//i.test(uri.trim())) {
    throw new Error(
      "MONGODB_URI must start with mongodb:// or mongodb+srv://."
    );
  }

  mongoose.set("strictQuery", true);

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB runtime error:", maskMongoCredentials(err.message));
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected.");
  });

  try {
    const conn = await mongoose.connect(uri.trim(), {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    throw new Error(maskMongoCredentials(err.message));
  }
}

export function getDatabaseStatus() {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  const readyState = mongoose.connection.readyState;
  return {
    connected: readyState === 1,
    state: states[readyState] || "unknown",
  };
}

export async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
