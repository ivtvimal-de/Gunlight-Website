import mongoose from "mongoose";
import { Category, Product } from "../storage/models.js";
import { deleteFromCloudinary } from "../config/cloudinary.js";
import { slugify, logAdminActivity } from "../utils/helpers.js";

/**
 * GET /api/categories (Public)
 * Returns active categories with live published product counts and fallback thumbnail images.
 */
export async function getPublicCategories(req, res, next) {
  try {
    const [categories, publishedProducts] = await Promise.all([
      Category.find({ isActive: true })
        .sort({ displayOrder: 1, name: 1 })
        .lean(),
      Product.find({ status: "published" })
        .select("category categories images heroImage")
        .lean(),
    ]);

    const enriched = categories.map((cat) => {
      const catId = String(cat._id);
      const matching = publishedProducts.filter((p) => {
        const primaryMatch = p.category && String(p.category) === catId;
        const listMatch =
          Array.isArray(p.categories) &&
          p.categories.some((cid) => String(cid) === catId);
        return primaryMatch || listMatch;
      });

      const primaryProductImage =
        matching[0]?.images?.find((img) => img.isPrimary)?.url ||
        matching[0]?.images?.[0]?.url ||
        "";

      return {
        ...cat,
        productCount: matching.length,
        previewImage: cat.image?.url || primaryProductImage,
      };
    });

    res.status(200).json({
      success: true,
      categories: enriched,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/categories (Protected)
 * Returns all categories along with assigned product details for category-wise viewing & assignment.
 */
export async function getAdminCategories(req, res, next) {
  try {
    const [categories, products] = await Promise.all([
      Category.find().sort({ displayOrder: 1, name: 1 }).lean(),
      Product.find()
        .select("name slug sku price discountPrice stockQuantity status images category categories")
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    const enriched = categories.map((cat) => {
      const catId = String(cat._id);
      const assignedProducts = products.filter((p) => {
        const primaryMatch = p.category && String(p.category) === catId;
        const listMatch =
          Array.isArray(p.categories) &&
          p.categories.some((cid) => String(cid) === catId);
        return primaryMatch || listMatch;
      });

      return {
        ...cat,
        productCount: assignedProducts.length,
        products: assignedProducts,
      };
    });

    res.status(200).json({
      success: true,
      categories: enriched,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Synchronize product assignments to a category cleanly without clearing any product's primary category.
 */
async function syncProductsToCategory(categoryId, productIds) {
  if (!Array.isArray(productIds)) return;

  const validIds = productIds
    .filter((id) => mongoose.Types.ObjectId.isValid(id))
    .map((id) => new mongoose.Types.ObjectId(id));

  // Add this category to all selected products' categories array
  if (validIds.length > 0) {
    await Product.updateMany(
      { _id: { $in: validIds } },
      { $addToSet: { categories: categoryId } }
    );
  }

  // Remove this category from unselected products' categories array (only if it is not their primary category)
  await Product.updateMany(
    {
      _id: { $nin: validIds },
      category: { $ne: categoryId },
      categories: categoryId,
    },
    { $pull: { categories: categoryId } }
  );
}

/**
 * POST /api/admin/categories
 */
export async function createCategory(req, res, next) {
  try {
    const {
      name,
      slug,
      description = "",
      image,
      isActive = true,
      displayOrder = 0,
      productIds,
    } = req.body || {};

    if (!name || !String(name).trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    const cleanName = String(name).trim();
    const cleanSlug = slugify(slug || cleanName);

    const category = await Category.create({
      name: cleanName,
      slug: cleanSlug,
      description: String(description || "").trim(),
      image: image?.url
        ? { url: String(image.url).trim(), publicId: String(image.publicId || "").trim() }
        : { url: "", publicId: "" },
      isActive: Boolean(isActive),
      displayOrder: Number(displayOrder) || 0,
    });

    if (Array.isArray(productIds)) {
      await syncProductsToCategory(category._id, productIds);
    }

    await logAdminActivity({
      admin: req.admin,
      action: "CREATE_CATEGORY",
      entityType: "category",
      entityId: category._id,
      summary: `Created category "${category.name}"`,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully.",
      category,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/admin/categories/:id
 */
export async function updateCategory(req, res, next) {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    const {
      name,
      slug,
      description,
      image,
      isActive,
      displayOrder,
      productIds,
    } = req.body || {};

    if (name !== undefined) {
      if (!String(name).trim()) {
        return res.status(400).json({
          success: false,
          message: "Category name cannot be empty.",
        });
      }
      category.name = String(name).trim();
    }

    if (slug !== undefined) {
      category.slug = slugify(slug || category.name);
    } else if (name !== undefined && !slug) {
      category.slug = slugify(category.name);
    }

    if (description !== undefined) {
      category.description = String(description).trim();
    }
    if (isActive !== undefined) {
      category.isActive = Boolean(isActive);
    }
    if (displayOrder !== undefined) {
      category.displayOrder = Number(displayOrder) || 0;
    }

    if (image !== undefined) {
      const oldPublicId = category.image?.publicId;
      const newPublicId = image?.publicId ? String(image.publicId).trim() : "";
      if (oldPublicId && oldPublicId !== newPublicId) {
        await deleteFromCloudinary(oldPublicId);
      }
      category.image = image?.url
        ? { url: String(image.url).trim(), publicId: newPublicId }
        : { url: "", publicId: "" };
    }

    await category.save();

    if (Array.isArray(productIds)) {
      await syncProductsToCategory(category._id, productIds);
    }

    await logAdminActivity({
      admin: req.admin,
      action: "UPDATE_CATEGORY",
      entityType: "category",
      entityId: category._id,
      summary: `Updated category "${category.name}"`,
    });

    res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      category,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/admin/categories/:id
 */
export async function deleteCategory(req, res, next) {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    const primaryCount = await Product.countDocuments({ category: category._id });
    if (primaryCount > 0) {
      const reassignTo = req.query?.reassignTo || req.body?.reassignTo;
      if (reassignTo && mongoose.Types.ObjectId.isValid(reassignTo) && reassignTo !== String(category._id)) {
        const targetCategory = await Category.findById(reassignTo);
        if (!targetCategory) {
          return res.status(400).json({
            success: false,
            message: "Target replacement category not found.",
          });
        }
        await Product.updateMany(
          { category: category._id },
          { $set: { category: targetCategory._id }, $addToSet: { categories: targetCategory._id } }
        );
      } else {
        return res.status(409).json({
          success: false,
          message: `Cannot delete "${category.name}" because ${primaryCount} product(s) use it as their primary category. Reassign those products first.`,
        });
      }
    }

    await Product.updateMany(
      { categories: category._id },
      { $pull: { categories: category._id } }
    );

    if (category.image?.publicId) {
      await deleteFromCloudinary(category.image.publicId);
    }

    const deletedName = category.name;
    const deletedId = category._id;
    await category.deleteOne();

    await logAdminActivity({
      admin: req.admin,
      action: "DELETE_CATEGORY",
      entityType: "category",
      entityId: deletedId,
      summary: `Deleted category "${deletedName}"`,
    });

    res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (err) {
    next(err);
  }
}
