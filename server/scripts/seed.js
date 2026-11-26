import "dotenv/config";
import { connectDB, disconnectDB } from "../config/db.js";
import { seedInitialData } from "../utils/seedInitialData.js";

async function seed() {
  await connectDB();
  await seedInitialData({ forceUpdateAdmin: true, strictEnv: true, silent: false });
  console.log("Seed completed successfully.");
}

seed()
  .catch((err) => {
    console.error("Seed error:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDB();
  });
