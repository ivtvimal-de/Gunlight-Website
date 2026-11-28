import { Product, Category, Brand, AdminActivity } from "../storage/models.js";

/**
 * GET /api/admin/dashboard
 * Returns store statistics, category/brand/stock charts data, recent products, and recent admin activities.
 */
export async function getDashboardStats(req, res, next) {
  try {
    const [
      totalProducts,
      publishedProducts,
      draftProducts,
      outOfStockProducts,
      lowStockProducts,
      featuredProducts,
      totalCategories,
      totalBrands,
      activeBrands,
      allProductsForTotals,
      categories,
      brands,
      recentProducts,
      recentActivities,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ status: "published" }),
      Product.countDocuments({ status: "draft" }),
      Product.countDocuments({ stockQuantity: { $lte: 0 } }),
      Product.countDocuments({ stockQuantity: { $gt: 0, $lte: 5 } }),
      Product.countDocuments({ isFeatured: true }),
      Category.countDocuments(),
      Brand.countDocuments(),
      Brand.countDocuments({ isActive: true, isComingSoon: false }),
      Product.find().select("category categories brand stockQuantity status").lean(),
      Category.find().sort({ displayOrder: 1, name: 1 }).lean(),
      Brand.find().sort({ displayOrder: 1, name: 1 }).lean(),
      Product.find()
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),
      AdminActivity.find()
        .sort({ createdAt: -1 })
        .limit(12)
        .lean(),
    ]);

    const totalStockUnits = allProductsForTotals.reduce(
      (sum, p) => sum + (Number(p.stockQuantity) || 0),
      0
    );

    const inStockHealthy = Math.max(
      0,
      totalProducts - outOfStockProducts - lowStockProducts
    );

    const categoryBreakdown = categories.map((cat) => {
      const catId = String(cat._id);
      const matched = allProductsForTotals.filter((p) => {
        const primaryMatch = p.category && String(p.category) === catId;
        const listMatch =
          Array.isArray(p.categories) &&
          p.categories.some((cid) => String(cid) === catId);
        return primaryMatch || listMatch;
      });
      return {
        _id: cat._id,
        name: cat.name,
        slug: cat.slug,
        count: matched.length,
        publishedCount: matched.filter((m) => m.status === "published").length,
        totalStock: matched.reduce((s, m) => s + (Number(m.stockQuantity) || 0), 0),
      };
    });

    const brandBreakdown = brands.map((b) => {
      const nameLower = String(b.name || "").trim().toLowerCase();
      const slugLower = String(b.slug || "").trim().toLowerCase();
      const matched = allProductsForTotals.filter((p) => {
        const pb = String(p.brand || "").trim().toLowerCase();
        if (!pb) return slugLower === "gunlite" || Boolean(b.isFlagship);
        return pb === nameLower || pb === slugLower;
      });
      return {
        _id: b._id,
        name: b.name,
        slug: b.slug,
        isComingSoon: Boolean(b.isComingSoon),
        count: matched.length,
        publishedCount: matched.filter((m) => m.status === "published").length,
        totalStock: matched.reduce((s, m) => s + (Number(m.stockQuantity) || 0), 0),
      };
    });

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        publishedProducts,
        draftProducts,
        outOfStockProducts,
        lowStockProducts,
        inStockHealthy,
        featuredProducts,
        totalCategories,
        totalBrands,
        activeBrands,
        totalStockUnits,
      },
      categoryBreakdown,
      brandBreakdown,
      stockDistribution: [
        { label: "In Stock (>5)", value: inStockHealthy, color: "#10B981" },
        { label: "Low Stock (1-5)", value: lowStockProducts, color: "#F59E0B" },
        { label: "Out of Stock", value: outOfStockProducts, color: "#EF4444" },
      ],
      recentProducts,
      recentActivities,
    });
  } catch (err) {
    next(err);
  }
}
