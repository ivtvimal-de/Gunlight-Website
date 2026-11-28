import "dotenv/config";
import { connectDB, disconnectDB } from "../config/db.js";
import Product from "../models/Product.js";

const isApplyMode = process.argv.includes("--apply");

async function getStatusCounts() {
  const rows = await Product.collection
    .aggregate([
      {
        $group: {
          _id: { $ifNull: ["$status", "__missing__"] },
          count: { $sum: 1 },
        },
      },
    ])
    .toArray();

  const breakdown = {};
  let total = 0;
  for (const row of rows) {
    breakdown[row._id] = row.count;
    total += row.count;
  }

  return {
    total,
    active: breakdown.active || 0,
    inactive: breakdown.inactive || 0,
    published: breakdown.published || 0,
    draft: breakdown.draft || 0,
    breakdown,
  };
}

async function run() {
  await connectDB();

  const before = await getStatusCounts();
  console.log(`Mode: ${isApplyMode ? "APPLY (writing to MongoDB)" : "DRY RUN (read-only)"}`);
  console.log("Current product counts:", {
    totalProducts: before.total,
    activeToPublished: before.active,
    inactiveToDraft: before.inactive,
    alreadyPublished: before.published,
    alreadyDraft: before.draft,
  });

  if (!isApplyMode) {
    console.log(
      "Dry run complete. No database records were modified. Re-run with --apply to migrate."
    );
    return;
  }

  const [publishedRes, draftRes] = await Promise.all([
    Product.collection.updateMany(
      { status: "active" },
      { $set: { status: "published" } }
    ),
    Product.collection.updateMany(
      { status: "inactive" },
      { $set: { status: "draft" } }
    ),
  ]);

  const after = await getStatusCounts();
  console.log("Migration applied:", {
    activeMigratedToPublished: publishedRes.modifiedCount,
    inactiveMigratedToDraft: draftRes.modifiedCount,
  });
  console.log("Post-migration product counts:", {
    totalProducts: after.total,
    published: after.published,
    draft: after.draft,
    activeRemaining: after.active,
    inactiveRemaining: after.inactive,
  });
}

run()
  .catch((err) => {
    console.error("Status migration error:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDB();
  });
