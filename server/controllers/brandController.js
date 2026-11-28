import mongoose from "mongoose";
import { Brand, Product } from "../storage/models.js";
import { deleteFromCloudinary } from "../config/cloudinary.js";
import { slugify, logAdminActivity } from "../utils/helpers.js";

function escapeRegex(value = "") {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function productMatchesBrand(productBrand, brand) {
  const cleanBrand = String(productBrand || "").trim().toLowerCase();
  const nameLower = String(brand?.name || "").trim().toLowerCase();
  const slugLower = String(brand?.slug || "").trim().toLowerCase();

  if (!cleanBrand) {
    return slugLower === "gunlite" || Boolean(brand?.isFlagship);
  }
  return cleanBrand === nameLower || cleanBrand === slugLower;
}

function sanitizeMediaObject(media) {
  if (!media || !media.url || !String(media.url).trim()) {
    return { url: "", publicId: "" };
  }
  return {
    url: String(media.url).trim(),
    publicId: String(media.publicId || "").trim(),
  };
}

/**
 * Assign selected products to a brand cleanly.
 */
async function syncProductsToBrand(brand, productIds) {
  if (!Array.isArray(productIds)) return;

  const validIds = productIds
    .map((id) => String(id || "").trim())
    .filter((id) => mongoose.Types.ObjectId.isValid(id));

  if (validIds.length > 0) {
    await Product.updateMany(
      { _id: { $in: validIds } },
      { $set: { brand: brand.name } }
    );
  }

  // Reassign any unchecked products that used to carry this brand back to GunLite (unless editing GunLite itself)
  if (brand.slug !== "gunlite") {
    const nameRegex = new RegExp(`^${escapeRegex(brand.name)}$`, "i");
    await Product.updateMany(
      { _id: { $nin: validIds }, brand: nameRegex },
      { $set: { brand: "GunLite" } }
    );
  }
}

/**
 * GET /api/brands (Public)
<<<<<<< HEAD
 * Returns active brands with live active product counts.
 */
export async function getPublicBrands(req, res, next) {
  try {
    const [brands, activeProducts] = await Promise.all([
      Brand.find({ isActive: true })
        .sort({ displayOrder: 1, name: 1 })
        .lean(),
      Product.find({ status: "active" })
=======
 * Returns active brands with live published product counts.
 */
export async function getPublicBrands(req, res, next) {
  try {
    const [brands, publishedProducts] = await Promise.all([
      Brand.find({ isActive: true })
        .sort({ displayOrder: 1, name: 1 })
        .lean(),
      Product.find({ status: "published" })
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
        .select("brand images heroImage")
        .lean(),
    ]);

    const enriched = brands.map((brand) => {
<<<<<<< HEAD
      const matching = activeProducts.filter((p) =>
=======
      const matching = publishedProducts.filter((p) =>
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
        productMatchesBrand(p.brand, brand)
      );

      const primaryProductImage =
        matching[0]?.heroImage?.url ||
        matching[0]?.images?.find((img) => img.isPrimary)?.url ||
        matching[0]?.images?.[0]?.url ||
        "";

      return {
        ...brand,
        productCount: matching.length,
        previewBanner: brand.bannerImage?.url || primaryProductImage,
      };
    });

    res.status(200).json({
      success: true,
      brands: enriched,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/brands (Protected)
 * Returns all brands with matched products for brand-wise inventory view & management.
 */
export async function getAdminBrands(req, res, next) {
  try {
    const [brands, products] = await Promise.all([
      Brand.find().sort({ displayOrder: 1, name: 1 }).lean(),
      Product.find()
        .select("name slug sku brand price discountPrice stockQuantity status images")
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    const enriched = brands.map((brand) => {
      const assignedProducts = products.filter((p) =>
        productMatchesBrand(p.brand, brand)
      );

      return {
        ...brand,
        productCount: assignedProducts.length,
<<<<<<< HEAD
        activeProductCount: assignedProducts.filter((p) => p.status === "active").length,
=======
        publishedProductCount: assignedProducts.filter((p) => p.status === "published").length,
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
        products: assignedProducts,
      };
    });

    res.status(200).json({
      success: true,
      brands: enriched,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/brands
 */
export async function createBrand(req, res, next) {
  try {
    const {
      name,
      slug,
      tagline = "",
      description = "",
      logo,
      bannerImage,
      isFlagship = false,
      isComingSoon = false,
      isActive = true,
      displayOrder = 0,
      productIds,
    } = req.body || {};

    if (!name || !String(name).trim()) {
      return res.status(400).json({
        success: false,
        message: "Brand name is required.",
      });
    }

    const cleanName = String(name).trim();
    const cleanSlug = slugify(slug || cleanName);
    if (!cleanSlug) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid brand name or slug.",
      });
    }

    const brand = await Brand.create({
      name: cleanName,
      slug: cleanSlug,
      tagline: String(tagline || "").trim(),
      description: String(description || "").trim(),
      logo: sanitizeMediaObject(logo),
      bannerImage: sanitizeMediaObject(bannerImage),
      isFlagship: Boolean(isFlagship),
      isComingSoon: Boolean(isComingSoon),
      isActive: Boolean(isActive),
      displayOrder: Number(displayOrder) || 0,
    });

    if (Array.isArray(productIds)) {
      await syncProductsToBrand(brand, productIds);
    }

    await logAdminActivity({
      admin: req.admin,
      action: "CREATE_BRAND",
      entityType: "brand",
      entityId: brand._id,
      summary: `Created brand "${brand.name}"`,
    });

    res.status(201).json({
      success: true,
      message: "Brand created successfully.",
      brand,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/admin/brands/:id
 */
export async function updateBrand(req, res, next) {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found.",
      });
    }

    const {
      name,
      slug,
      tagline,
      description,
      logo,
      bannerImage,
      isFlagship,
      isComingSoon,
      isActive,
      displayOrder,
      productIds,
    } = req.body || {};

    const previousName = brand.name;

    if (name !== undefined) {
      if (!String(name).trim()) {
        return res.status(400).json({
          success: false,
          message: "Brand name cannot be empty.",
        });
      }
      brand.name = String(name).trim();
    }

    if (slug !== undefined) {
      brand.slug = slugify(slug || brand.name);
    } else if (name !== undefined && !slug && brand.slug !== "gunlite") {
      brand.slug = slugify(brand.name);
    }

    if (tagline !== undefined) brand.tagline = String(tagline).trim();
    if (description !== undefined) brand.description = String(description).trim();
    if (isFlagship !== undefined) brand.isFlagship = Boolean(isFlagship);
    if (isComingSoon !== undefined) brand.isComingSoon = Boolean(isComingSoon);
    if (isActive !== undefined) brand.isActive = Boolean(isActive);
    if (displayOrder !== undefined) brand.displayOrder = Number(displayOrder) || 0;

    if (logo !== undefined) {
      const nextLogo = sanitizeMediaObject(logo);
      const oldPublicId = brand.logo?.publicId;
      if (oldPublicId && oldPublicId !== nextLogo.publicId) {
        await deleteFromCloudinary(oldPublicId);
      }
      brand.logo = nextLogo;
    }

    if (bannerImage !== undefined) {
      const nextBanner = sanitizeMediaObject(bannerImage);
      const oldPublicId = brand.bannerImage?.publicId;
      if (oldPublicId && oldPublicId !== nextBanner.publicId) {
        await deleteFromCloudinary(oldPublicId);
      }
      brand.bannerImage = nextBanner;
    }

    await brand.save();

    if (previousName && previousName !== brand.name) {
      await Product.updateMany(
        { brand: new RegExp(`^${escapeRegex(previousName)}$`, "i") },
        { $set: { brand: brand.name } }
      );
    }

    if (Array.isArray(productIds)) {
      await syncProductsToBrand(brand, productIds);
    }

    await logAdminActivity({
      admin: req.admin,
      action: "UPDATE_BRAND",
      entityType: "brand",
      entityId: brand._id,
      summary: `Updated brand "${brand.name}"`,
    });

    res.status(200).json({
      success: true,
      message: "Brand updated successfully.",
      brand,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/admin/brands/:id
 */
export async function deleteBrand(req, res, next) {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found.",
      });
    }

    const nameRegex = new RegExp(`^${escapeRegex(brand.name)}$`, "i");
    const productCount = await Product.countDocuments({ brand: nameRegex });

    if (productCount > 0) {
      const reassignTo = req.query?.reassignTo || req.body?.reassignTo;
      if (reassignTo && mongoose.Types.ObjectId.isValid(reassignTo) && reassignTo !== String(brand._id)) {
        const targetBrand = await Brand.findById(reassignTo);
        if (!targetBrand) {
          return res.status(400).json({
            success: false,
            message: "Target replacement brand not found.",
          });
        }
        await Product.updateMany(
          { brand: nameRegex },
          { $set: { brand: targetBrand.name } }
        );
      } else {
        return res.status(409).json({
          success: false,
          message: `Cannot delete "${brand.name}" because ${productCount} product(s) are assigned to it. Select a replacement brand first.`,
        });
      }
    }

    if (brand.logo?.publicId) {
      await deleteFromCloudinary(brand.logo.publicId);
    }
    if (brand.bannerImage?.publicId) {
      await deleteFromCloudinary(brand.bannerImage.publicId);
    }

    const deletedName = brand.name;
    const deletedId = brand._id;
    await brand.deleteOne();

    await logAdminActivity({
      admin: req.admin,
      action: "DELETE_BRAND",
      entityType: "brand",
      entityId: deletedId,
      summary: `Deleted brand "${deletedName}"`,
    });

    res.status(200).json({
      success: true,
      message: "Brand deleted successfully.",
    });
  } catch (err) {
    next(err);
  }
}
