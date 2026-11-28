import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import {
  connectDB,
  disconnectDB,
  getDatabaseStatus,
  maskMongoCredentials,
} from "./config/db.js";
import {
  ensureCloudinaryConfigured,
  verifyCloudinaryConnection,
} from "./config/cloudinary.js";
import { sanitizeInput } from "./middleware/sanitize.js";
import { getJwtSecret } from "./middleware/auth.js";
import { getMaxVideoSizeConfig } from "./utils/videoValidation.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import adminProductRoutes from "./routes/adminProductRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import adminCategoryRoutes from "./routes/adminCategoryRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import adminBrandRoutes from "./routes/adminBrandRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import adminVideoRoutes from "./routes/adminVideoRoutes.js";

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const isProduction = process.env.NODE_ENV === "production";

app.disable("x-powered-by");

// Trust reverse proxy (Render, Railway, Vercel, Nginx) so secure cookies & rate limits work accurately
app.set("trust proxy", 1);

// Strict CORS origin allow-list
const allowedOrigins = [
  "http://localhost:5173",
  "https://gunlite.in",
  "https://www.gunlite.in",
];

// Security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'none'"],
        frameAncestors: ["'none'"],
        baseUri: ["'none'"],
        formAction: ["'none'"],
      },
    },
    crossOriginResourcePolicy: { policy: "same-site" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    hsts: isProduction
      ? { maxAge: 31536000, includeSubDomains: true }
      : false,
  })
);

// Strict CORS limited to allowed frontend origins with credentials & CSRF header support
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    optionsSuccessStatus: 204,
  })
);

// General API rate limit to guard against abuse
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests from this IP. Please try again later.",
    },
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());
app.use(sanitizeInput);

// Root status endpoint for Render health checks and direct browser visits
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Gunlight Backend API is running",
    status: "OK",
  });
});

// Health check (verifies DB state and Cloudinary readiness without exposing secrets)
app.get("/api/health", async (req, res, next) => {
  try {
    const dbStatus = getDatabaseStatus();
    const cloudinaryConfigured = ensureCloudinaryConfigured({
      throwOnMissing: false,
    });

    let cloudinaryStatus = cloudinaryConfigured ? "configured" : "not_configured";
    if (req.query.check === "cloudinary" && cloudinaryConfigured) {
      const ping = await verifyCloudinaryConnection();
      cloudinaryStatus = ping.ok ? "connected" : ping.status;
    }

    const healthy = dbStatus.connected && cloudinaryConfigured;
    res.status(healthy ? 200 : 503).json({
      success: healthy,
      service: "gunlite-api",
      database: dbStatus.state,
      cloudinary: cloudinaryStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// Public & Admin API routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/categories", adminCategoryRoutes);
app.use("/api/admin/brands", adminBrandRoutes);
app.use("/api/admin/videos", adminVideoRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

async function startServer() {
  getJwtSecret();
  const { maxMb } = getMaxVideoSizeConfig();
  await connectDB();

  const cloudinaryCheck = await verifyCloudinaryConnection();
  console.log(`Cloudinary connected: ${cloudinaryCheck.status}`);

  const server = app.listen(PORT, () => {
    console.log(
      `GunLite API server running on port ${PORT} (max video upload: ${maxMb} MB, CORS allowed: ${allowedOrigins.join(", ")})`
    );
  });

  const shutdown = async (signal) => {
    console.log(`${signal} received, shutting down GunLite API server...`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

startServer().catch((err) => {
  const rawMsg = err?.message || err?.error?.message || String(err);
  console.error("Failed to start server:", maskMongoCredentials(rawMsg));
  process.exit(1);
});
