import mongoose from "mongoose";
import { Product, Category } from "../storage/models.js";
import {
  uploadBufferToCloudinary,
  deleteFromCloudinary,
} from "../config/cloudinary.js";
import {
  slugify,
  normalizeProductImages,
  logAdminActivity,
  parseMaybeJSON,
} from "../utils/helpers.js";

/**
 * Resolve category identifier (ObjectId, slug, or name) to a Category document.
 */
async function resolveCategoryFilter(categoryParam) {
  if (!categoryParam || categoryParam === "All") return null;
  if (mongoose.Types.ObjectId.isValid(categoryParam)) {
    return await Category.findById(categoryParam).lean();
  }
  const normalized = String(categoryParam).trim();
  return await Category.findOne({
    $or: [
      { slug: normalized.toLowerCase() },
      { slug: slugify(normalized) },
      { name: new RegExp(`^${normalized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
    ],
  }).lean();
}

/**
 * Build a unique slug so duplicate product names never fail awkwardly.
 */
async function ensureUniqueSlug(desiredSlug, excludeId = null) {
  const base = slugify(desiredSlug) || `product-${Date.now()}`;
  let candidate = base;
  let counter = 2;

  while (true) {
    const query = { slug: candidate };
    if (excludeId) query._id = { $ne: excludeId };
    const exists = await Product.exists(query);
    if (!exists) return candidate;
    candidate = `${base}-${counter}`;
    counter += 1;
  }
}

function buildSortOption(sortParam) {
  switch (sortParam) {
    case "price_asc":
      return { price: 1, createdAt: -1 };
    case "price_desc":
      return { price: -1, createdAt: -1 };
    case "oldest":
      return { createdAt: 1 };
    case "featured":
      return { isFeatured: -1, createdAt: -1 };
    case "newest":
    default:
      return { createdAt: -1 };
  }
}

/**
 * GET /api/products (Public)
 */
export async function getPublicProducts(req, res, next) {
  try {
    const {
      search = "",
      category = "",
      brand = "",
      featured,
      inStock,
      page = 1,
      limit = 50,
      sort = "featured",
    } = req.query;

    const filter = { status: "active" };

    if (featured === "true") {
      filter.isFeatured = true;
    }
    if (inStock === "true") {
      filter.stockQuantity = { $gt: 0 };
    }
    if (brand && brand !== "All") {
      const cleanBrand = String(brand).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.brand = new RegExp(`^${cleanBrand}$`, "i");
    }

    if (category && category !== "All") {
      const catDoc = await resolveCategoryFilter(category);
      if (!catDoc) {
        return res.status(200).json({
          success: true,
          products: [],
          pagination: { total: 0, page: 1, limit: Number(limit), pages: 0 },
        });
      }
      filter.$or = [{ category: catDoc._id }, { categories: catDoc._id }];
    }

    if (search && String(search).trim()) {
      const term = String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(term, "i");
      const searchCond = [
        { name: regex },
        { description: regex },
        { shortSpec: regex },
        { sku: regex },
        { brand: regex },
      ];
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchCond }];
        delete filter.$or;
      } else {
        filter.$or = searchCond;
      }
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .populate("categories", "name slug")
        .sort(buildSortOption(sort))
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/products/:id (Public: matches ObjectId or slug, active only)
 */
export async function getPublicProductById(req, res, next) {
  try {
    const { id } = req.params;
    const query = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id, status: "active" }
      : { slug: String(id).toLowerCase().trim(), status: "active" };

    const product = await Product.findOne(query)
      .populate("category", "name slug")
      .populate("categories", "name slug")
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or currently unavailable.",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/products (Protected)
 */
export async function getAdminProducts(req, res, next) {
  try {
    const {
      search = "",
      category = "",
      brand = "",
      status = "",
      stock = "",
      featured = "",
      page = 1,
      limit = 20,
      sort = "newest",
    } = req.query;

    const filter = {};

    if (status === "active" || status === "inactive") {
      filter.status = status;
    }
    if (featured === "true") filter.isFeatured = true;
    if (featured === "false") filter.isFeatured = false;
    if (brand && brand !== "All") {
      const cleanBrand = String(brand).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.brand = new RegExp(`^${cleanBrand}$`, "i");
    }

    if (stock === "out_of_stock") {
      filter.stockQuantity = { $lte: 0 };
    } else if (stock === "low_stock") {
      filter.stockQuantity = { $gt: 0, $lte: 5 };
    } else if (stock === "in_stock") {
      filter.stockQuantity = { $gt: 0 };
    }

    if (category && category !== "All") {
      const catDoc = await resolveCategoryFilter(category);
      if (catDoc) {
        filter.$or = [{ category: catDoc._id }, { categories: catDoc._id }];
      } else {
        return res.status(200).json({
          success: true,
          products: [],
          pagination: { total: 0, page: 1, limit: Number(limit), pages: 0 },
        });
      }
    }

    if (search && String(search).trim()) {
      const term = String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(term, "i");
      const searchCond = [
        { name: regex },
        { sku: regex },
        { brand: regex },
        { shortSpec: regex },
        { description: regex },
      ];
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchCond }];
        delete filter.$or;
      } else {
        filter.$or = searchCond;
      }
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .populate("categories", "name slug")
        .sort(buildSortOption(sort))
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/products/:id (Protected)
 */
export async function getAdminProductById(req, res, next) {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name slug")
      .populate("categories", "name slug")
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Extract and validate product body fields cleanly.
 */
async function buildProductPayload(req, existingProduct = null) {
  const body = req.body || {};

  const name = body.name !== undefined ? String(body.name).trim() : existingProduct?.name;
  const description =
    body.description !== undefined
      ? String(body.description).trim()
      : existingProduct?.description;
  const sku =
    body.sku !== undefined
      ? String(body.sku).trim().toUpperCase()
      : existingProduct?.sku;

  if (!name) {
    const err = new Error("Product name is required.");
    err.statusCode = 400;
    throw err;
  }
  if (!description) {
    const err = new Error("Product description is required.");
    err.statusCode = 400;
    throw err;
  }
  if (!sku) {
    const err = new Error("SKU / Product code is required.");
    err.statusCode = 400;
    throw err;
  }

  const price = body.price !== undefined ? Number(body.price) : existingProduct?.price;
  if (Number.isNaN(price) || price < 0) {
    const err = new Error("Please enter a valid non-negative product price.");
    err.statusCode = 400;
    throw err;
  }

  let discountPrice = existingProduct?.discountPrice ?? null;
  if (body.discountPrice !== undefined) {
    if (body.discountPrice === "" || body.discountPrice === null) {
      discountPrice = null;
    } else {
      const parsedDiscount = Number(body.discountPrice);
      if (Number.isNaN(parsedDiscount) || parsedDiscount < 0 || parsedDiscount > price) {
        const err = new Error("Discount price must be between 0 and regular price.");
        err.statusCode = 400;
        throw err;
      }
      discountPrice = parsedDiscount;
    }
  }

  const stockQuantity =
    body.stockQuantity !== undefined
      ? Math.max(0, Math.floor(Number(body.stockQuantity)))
      : existingProduct?.stockQuantity ?? 0;

  if (Number.isNaN(stockQuantity)) {
    const err = new Error("Stock quantity must be a valid number.");
    err.statusCode = 400;
    throw err;
  }

  // Primary category & optional multi-category list
  const primaryCatInput = body.category ?? existingProduct?.category;
  const primaryCatDoc = await Category.findById(primaryCatInput);
  if (!primaryCatDoc) {
    const err = new Error("Selected product category does not exist.");
    err.statusCode = 400;
    throw err;
  }

  const parsedCategories = parseMaybeJSON(body.categories, null);
  let categoryIds = Array.isArray(parsedCategories)
    ? parsedCategories.map(String)
    : existingProduct?.categories?.map((c) => String(c)) || [];

  if (!categoryIds.includes(String(primaryCatDoc._id))) {
    categoryIds.unshift(String(primaryCatDoc._id));
  }
  categoryIds = [...new Set(categoryIds)].filter((id) =>
    mongoose.Types.ObjectId.isValid(id)
  );

  // Images: combine existing/client-provided list + any freshly attached files
  let images = parseMaybeJSON(body.images, existingProduct?.images || []);
  if (!Array.isArray(images)) images = [];

  if (req.files && req.files.length > 0) {
    const uploaded = await Promise.all(
      req.files.map((file) =>
        uploadBufferToCloudinary(file.buffer, "gunlite/products", file.mimetype)
      )
    );
    images = [
      ...images,
      ...uploaded.map((u) => ({
        url: u.url,
        publicId: u.publicId,
        isPrimary: false,
      })),
    ];
  }

  const normalizedImages = normalizeProductImages(images);

  // Specs parsing
  const parsedSpecs = parseMaybeJSON(body.specs, existingProduct?.specs || []);
  const cleanSpecs = Array.isArray(parsedSpecs)
    ? parsedSpecs
        .filter((s) => s && String(s.label || "").trim() && String(s.value || "").trim())
        .map((s) => ({
          label: String(s.label).trim(),
          value: String(s.value).trim(),
        }))
    : [];

  const desiredSlug = body.slug || (existingProduct ? existingProduct.slug : name);
  const slug = await ensureUniqueSlug(desiredSlug, existingProduct?._id);

  const status =
    body.status === "inactive" || body.status === "active"
      ? body.status
      : existingProduct?.status || "active";

  const isFeatured =
    body.isFeatured !== undefined
      ? body.isFeatured === true || body.isFeatured === "true"
      : Boolean(existingProduct?.isFeatured);

  const warrantyEnabled =
    body.warrantyEnabled !== undefined
      ? body.warrantyEnabled === true || body.warrantyEnabled === "true"
      : existingProduct?.warrantyEnabled ?? true;

  const warrantyPrice =
    body.warrantyPrice !== undefined
      ? Math.max(0, Number(body.warrantyPrice) || 0)
      : existingProduct?.warrantyPrice ?? 500;

  return {
    name,
    slug,
    sku,
    brand: body.brand !== undefined ? String(body.brand).trim() || "GunLite" : existingProduct?.brand || "GunLite",
    description,
    shortSpec:
      body.shortSpec !== undefined
        ? String(body.shortSpec).trim()
        : existingProduct?.shortSpec || "",
    specs: cleanSpecs,
    category: primaryCatDoc._id,
    categories: categoryIds,
    price,
    discountPrice,
    stockQuantity,
    status,
    isFeatured,
    badge:
      body.badge !== undefined
        ? String(body.badge).trim()
        : existingProduct?.badge || "",
    warrantyEnabled,
    warrantyPrice,
    warrantyLabel:
      body.warrantyLabel !== undefined
        ? String(body.warrantyLabel).trim() || "1-Year Warranty"
        : existingProduct?.warrantyLabel || "1-Year Warranty",
    images: normalizedImages,
  };
}

/**
 * POST /api/admin/products
 */
export async function createProduct(req, res, next) {
  try {
    const payload = await buildProductPayload(req, null);
    const created = await Product.create(payload);
    const populated = await Product.findById(created._id)
      .populate("category", "name slug")
      .populate("categories", "name slug")
      .lean();

    await logAdminActivity({
      admin: req.admin,
      action: "CREATE_PRODUCT",
      entityType: "product",
      entityId: created._id,
      summary: `Created product "${created.name}" (${created.sku})`,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product: populated,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/admin/products/:id
 */
export async function updateProduct(req, res, next) {
  try {
    const existing = await Product.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const oldPublicIds = (existing.images || [])
      .map((img) => img.publicId)
      .filter(Boolean);

    const payload = await buildProductPayload(req, existing);
    const newPublicIdSet = new Set(
      (payload.images || []).map((img) => img.publicId).filter(Boolean)
    );

    const removedPublicIds = oldPublicIds.filter((pid) => !newPublicIdSet.has(pid));

    Object.assign(existing, payload);
    await existing.save();

    if (removedPublicIds.length > 0) {
      await Promise.all(removedPublicIds.map((pid) => deleteFromCloudinary(pid)));
    }

    const populated = await Product.findById(existing._id)
      .populate("category", "name slug")
      .populate("categories", "name slug")
      .lean();

    await logAdminActivity({
      admin: req.admin,
      action: "UPDATE_PRODUCT",
      entityType: "product",
      entityId: existing._id,
      summary: `Updated product "${existing.name}"`,
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product: populated,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/admin/products/:id
 */
export async function deleteProduct(req, res, next) {
  try {
    const existing = await Product.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const publicIdsToDelete = [
      ...(existing.images || []).map((img) => img.publicId),
      existing.heroImage?.publicId,
    ].filter(Boolean);

    const deletedName = existing.name;
    const deletedId = existing._id;

    await existing.deleteOne();

    if (publicIdsToDelete.length > 0) {
      await Promise.all(publicIdsToDelete.map((pid) => deleteFromCloudinary(pid)));
    }

    await logAdminActivity({
      admin: req.admin,
      action: "DELETE_PRODUCT",
      entityType: "product",
      entityId: deletedId,
      summary: `Deleted product "${deletedName}" and cleaned up ${publicIdsToDelete.length} Cloudinary image(s)`,
    });

    res.status(200).json({
      success: true,
      message: "Product deleted permanently.",
    });
  } catch (err) {
    next(err);
  }
}
