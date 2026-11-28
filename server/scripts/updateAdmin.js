import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB, disconnectDB } from "../config/db.js";
import { Admin } from "../storage/models.js";

const PLACEHOLDER_PASSWORDS = new Set([
  "ChangeThisStrongPassword123!",
  "changeme",
  "replace_me",
]);

/**
 * Update (or create) the primary Admin credentials from environment variables
 * (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, optional `ADMIN_NAME`) in MongoDB.
 */
async function updateAdminCredentials() {
  const rawName = String(process.env.ADMIN_NAME || "GunLite Administrator").trim();
  const normalizedEmail = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = String(process.env.ADMIN_PASSWORD || "");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error("A valid ADMIN_EMAIL must be configured in server/.env.");
  }

  if (!password || password.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters long in server/.env.");
  }

  if (PLACEHOLDER_PASSWORDS.has(password)) {
    throw new Error("ADMIN_PASSWORD still uses a placeholder value. Please choose a real password.");
  }

  await connectDB();

  const passwordHash = await bcrypt.hash(password, 12);
  let admin = await Admin.findOne({ email: normalizedEmail });

  if (admin) {
    admin.name = rawName || admin.name;
    admin.passwordHash = passwordHash;
    await admin.save();
    console.log(`Updated password for existing admin account: ${normalizedEmail}`);
    return;
  }

  const primaryAdmin = await Admin.findOne().sort({ createdAt: 1 });
  if (primaryAdmin) {
    const previousEmail = primaryAdmin.email;
    primaryAdmin.name = rawName || primaryAdmin.name;
    primaryAdmin.email = normalizedEmail;
    primaryAdmin.passwordHash = passwordHash;
    await primaryAdmin.save();
    console.log(
      `Updated admin account email (${previousEmail} -> ${normalizedEmail}) and password.`
    );
    return;
  }

  await Admin.create({
    name: rawName || "GunLite Administrator",
    email: normalizedEmail,
    passwordHash,
    role: "admin",
  });
  console.log(`Created admin account: ${normalizedEmail}`);
}

updateAdminCredentials()
  .catch((err) => {
    console.error("Failed to update admin credentials:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDB();
  });
