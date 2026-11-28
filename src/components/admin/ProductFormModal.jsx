import { useState, useEffect, useRef } from "react";
import {
  X,
  Upload,
  Star,
  Trash2,
  RefreshCw,
  Plus,
  Image as ImageIcon,
  Check,
} from "lucide-react";
import { api, uploadImagesWithProgress } from "../../services/api";
import { useToast } from "../../context/ToastContext";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
]);
<<<<<<< HEAD
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
=======
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)

function makeSlug(str) {
  return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ProductFormModal({
  open,
  initialProduct = null,
  categories = [],
  brands = [],
  onClose,
  onSaved,
}) {
  const isEditing = Boolean(initialProduct?._id);
  const toast = useToast();
  const fileInputRef = useRef(null);
  const replaceInputRef = useRef(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [sku, setSku] = useState("");
  const [brand, setBrand] = useState("GunLite");
  const [categoryId, setCategoryId] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("10");
<<<<<<< HEAD
  const [status, setStatus] = useState("active");
=======
  const [status, setStatus] = useState("draft");
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
  const [isFeatured, setIsFeatured] = useState(false);
  const [badge, setBadge] = useState("");
  const [shortSpec, setShortSpec] = useState("");
  const [description, setDescription] = useState("");
  const [specs, setSpecs] = useState([{ label: "", value: "" }]);
  const [warrantyEnabled, setWarrantyEnabled] = useState(true);
  const [warrantyPrice, setWarrantyPrice] = useState("500");
  const [warrantyLabel, setWarrantyLabel] = useState("1-Year Warranty");

  const [images, setImages] = useState([]);
  const [sessionUploadedPublicIds, setSessionUploadedPublicIds] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [replaceIndex, setReplaceIndex] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!open) return;
    setFormError("");
    setUploadProgress(0);
    setSessionUploadedPublicIds([]);

    if (initialProduct) {
      setName(initialProduct.name || "");
      setSlug(initialProduct.slug || "");
      setSlugManuallyEdited(true);
      setSku(initialProduct.sku || "");
      setBrand(initialProduct.brand || "GunLite");
      const primaryCatId =
        initialProduct.category?._id || initialProduct.category || "";
      setCategoryId(String(primaryCatId));
      const catIds = (initialProduct.categories || []).map((c) =>
        String(c?._id || c)
      );
      if (primaryCatId && !catIds.includes(String(primaryCatId))) {
        catIds.unshift(String(primaryCatId));
      }
      setSelectedCategories(catIds);
      setPrice(
        initialProduct.price !== undefined ? String(initialProduct.price) : ""
      );
      setDiscountPrice(
        initialProduct.discountPrice !== null &&
          initialProduct.discountPrice !== undefined
          ? String(initialProduct.discountPrice)
          : ""
      );
      setStockQuantity(
        initialProduct.stockQuantity !== undefined
          ? String(initialProduct.stockQuantity)
          : "0"
      );
<<<<<<< HEAD
      setStatus(initialProduct.status || "active");
=======
      setStatus(initialProduct.status || "draft");
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
      setIsFeatured(Boolean(initialProduct.isFeatured));
      setBadge(initialProduct.badge || "");
      setShortSpec(initialProduct.shortSpec || "");
      setDescription(initialProduct.description || "");
      setSpecs(
        Array.isArray(initialProduct.specs) && initialProduct.specs.length > 0
          ? initialProduct.specs.map((s) => ({
              label: s.label || "",
              value: s.value || "",
            }))
          : [{ label: "", value: "" }]
      );
      setWarrantyEnabled(
        initialProduct.warrantyEnabled !== undefined
          ? Boolean(initialProduct.warrantyEnabled)
          : true
      );
      setWarrantyPrice(
        initialProduct.warrantyPrice !== undefined
          ? String(initialProduct.warrantyPrice)
          : "500"
      );
      setWarrantyLabel(initialProduct.warrantyLabel || "1-Year Warranty");
      setImages(
        Array.isArray(initialProduct.images)
          ? initialProduct.images.map((img) => ({
              url: img.url,
              publicId: img.publicId || "",
              isPrimary: Boolean(img.isPrimary),
            }))
          : []
      );
    } else {
      const firstCat = categories[0]?._id ? String(categories[0]._id) : "";
      setName("");
      setSlug("");
      setSlugManuallyEdited(false);
      setSku("");
      setBrand("GunLite");
      setCategoryId(firstCat);
      setSelectedCategories(firstCat ? [firstCat] : []);
      setPrice("");
      setDiscountPrice("");
      setStockQuantity("15");
<<<<<<< HEAD
      setStatus("active");
=======
      setStatus("draft");
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
      setIsFeatured(false);
      setBadge("");
      setShortSpec("");
      setDescription("");
      setSpecs([{ label: "", value: "" }]);
      setWarrantyEnabled(true);
      setWarrantyPrice("500");
      setWarrantyLabel("1-Year Warranty");
      setImages([]);
    }
  }, [open, initialProduct, categories]);

  if (!open) return null;

  const validateFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return null;

    if (images.length + files.length > 10) {
      return "A product can have up to 10 images.";
    }

    for (const file of files) {
      if (!ALLOWED_TYPES.has(file.type)) {
        return `"${file.name}" is not a supported image format (use JPG, PNG, WebP, or AVIF).`;
      }
      if (file.size > MAX_FILE_SIZE) {
<<<<<<< HEAD
        return `"${file.name}" exceeds the 5 MB file size limit.`;
=======
        return `"${file.name}" exceeds the 1 MB file size limit.`;
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
      }
    }
    return files;
  };

  const handleUploadNewFiles = async (fileList) => {
    const validated = validateFiles(fileList);
    if (!validated) return;
    if (typeof validated === "string") {
      toast.error(validated);
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(5);
      const res = await uploadImagesWithProgress(
        validated,
        "gunlite/products",
        (pct) => setUploadProgress(pct)
      );
      const uploaded = res?.files || [];
      if (uploaded.length > 0) {
        setImages((prev) => {
          const hasPrimary = prev.some((i) => i.isPrimary);
          const next = uploaded.map((u, idx) => ({
            url: u.url,
            publicId: u.publicId || "",
            isPrimary: !hasPrimary && idx === 0,
          }));
          return [...prev, ...next];
        });
        setSessionUploadedPublicIds((prev) => [
          ...prev,
          ...uploaded.map((u) => u.publicId).filter(Boolean),
        ]);
        toast.success(`Uploaded ${uploaded.length} image(s) to Cloudinary.`);
      }
    } catch (err) {
      toast.error(err.message || "Image upload failed.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleReplaceFileSelected = async (fileList) => {
    const file = fileList?.[0];
    if (!file || replaceIndex === null) return;

    if (!ALLOWED_TYPES.has(file.type)) {
      toast.error("Unsupported format. Please select JPG, PNG, WebP, or AVIF.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
<<<<<<< HEAD
      toast.error("Image exceeds 5 MB limit.");
=======
      toast.error("Image exceeds 1 MB limit.");
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(5);
      const res = await uploadImagesWithProgress(
        [file],
        "gunlite/products",
        (pct) => setUploadProgress(pct)
      );
      const replacement = res?.files?.[0];
      if (!replacement) return;

      const targetOld = images[replaceIndex];
      if (
        targetOld?.publicId &&
        sessionUploadedPublicIds.includes(targetOld.publicId)
      ) {
        api.deleteUploadedImage(targetOld.publicId).catch(() => {});
      }

      setImages((prev) =>
        prev.map((img, idx) =>
          idx === replaceIndex
            ? {
                url: replacement.url,
                publicId: replacement.publicId || "",
                isPrimary: img.isPrimary,
              }
            : img
        )
      );

      if (replacement.publicId) {
        setSessionUploadedPublicIds((prev) => [...prev, replacement.publicId]);
      }
      toast.success("Image replaced successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to replace image.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setReplaceIndex(null);
      if (replaceInputRef.current) replaceInputRef.current.value = "";
    }
  };

  const handleSetPrimary = (idx) => {
    setImages((prev) =>
      prev.map((img, i) => ({ ...img, isPrimary: i === idx }))
    );
  };

  const handleRemoveImage = async (idx) => {
    const target = images[idx];
    if (!target) return;

    // Clean up right away if this image was freshly uploaded in this unsaved form session
    if (target.publicId && sessionUploadedPublicIds.includes(target.publicId)) {
      api.deleteUploadedImage(target.publicId).catch(() => {});
    }

    setImages((prev) => {
      const remaining = prev.filter((_, i) => i !== idx);
      if (remaining.length > 0 && !remaining.some((i) => i.isPrimary)) {
        remaining[0] = { ...remaining[0], isPrimary: true };
      }
      return remaining;
    });
  };

  const handleToggleMultiCategory = (cid) => {
    setSelectedCategories((prev) => {
      if (prev.includes(cid)) {
        if (cid === categoryId) return prev; // Keep primary category always included
        return prev.filter((id) => id !== cid);
      }
      return [...prev, cid];
    });
  };

  const handlePrimaryCategoryChange = (nextCid) => {
    setCategoryId(nextCid);
    if (nextCid && !selectedCategories.includes(nextCid)) {
      setSelectedCategories((prev) => [nextCid, ...prev]);
    }
  };

  const handleSpecChange = (index, field, val) => {
    setSpecs((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: val } : row))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!name.trim()) return setFormError("Product name is required.");
    if (!sku.trim()) return setFormError("SKU / Product code is required.");
    if (!categoryId) return setFormError("Please select a product category.");
    if (!description.trim()) return setFormError("Product description is required.");

    const numPrice = Number(price);
    if (price === "" || Number.isNaN(numPrice) || numPrice < 0) {
      return setFormError("Please enter a valid product price.");
    }

    let numDiscount = null;
    if (discountPrice !== "") {
      numDiscount = Number(discountPrice);
      if (Number.isNaN(numDiscount) || numDiscount < 0 || numDiscount > numPrice) {
        return setFormError("Discount price must be between 0 and regular price.");
      }
    }

    const numStock = Math.max(0, Math.floor(Number(stockQuantity)));
    if (Number.isNaN(numStock)) {
      return setFormError("Stock quantity must be a valid number.");
    }

    const payload = {
      name: name.trim(),
      slug: makeSlug(slug || name),
      sku: sku.trim().toUpperCase(),
      brand: brand.trim() || "GunLite",
      category: categoryId,
      categories: selectedCategories.includes(categoryId)
        ? selectedCategories
        : [categoryId, ...selectedCategories],
      price: numPrice,
      discountPrice: numDiscount,
      stockQuantity: numStock,
      status,
      isFeatured,
      badge: badge.trim(),
      shortSpec: shortSpec.trim(),
      description: description.trim(),
      specs: specs
        .filter((s) => s.label.trim() && s.value.trim())
        .map((s) => ({ label: s.label.trim(), value: s.value.trim() })),
      warrantyEnabled,
      warrantyPrice: Math.max(0, Number(warrantyPrice) || 0),
      warrantyLabel: warrantyLabel.trim() || "1-Year Warranty",
      images,
    };

    try {
      setSaving(true);
      if (isEditing) {
        await api.updateAdminProduct(initialProduct._id, payload);
        toast.success(`"${payload.name}" updated successfully.`);
      } else {
        await api.createAdminProduct(payload);
        toast.success(`"${payload.name}" added to store.`);
      }
      onSaved?.();
      onClose?.();
    } catch (err) {
      setFormError(err.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 font-['Inter']">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        onClick={!saving && !uploading ? onClose : undefined}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-4xl max-h-[94vh] flex flex-col rounded-2xl bg-white border border-[#E6E6E1] shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#E6E6E1] bg-[#FAFAF8] shrink-0">
          <div>
            <h2 className="font-['Outfit'] text-lg sm:text-xl font-bold text-[#14161A]">
              {isEditing ? `Edit Product — ${initialProduct.name}` : "Add New Product"}
            </h2>
            <p className="text-xs text-[#6B727C]">
              Changes sync immediately to MongoDB and the live GunLite storefront.
            </p>
          </div>
          <button
            type="button"
            disabled={saving || uploading}
            onClick={onClose}
            className="h-9 w-9 rounded-xl border border-[#E6E6E1] bg-white flex items-center justify-center text-[#6B727C] hover:text-[#14161A]"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {formError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
              {formError}
            </div>
          )}

          {/* Section A: Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#14161A] mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slugManuallyEdited) setSlug(makeSlug(e.target.value));
                }}
                placeholder="e.g. Eagle 3.1 GunLite"
                className="w-full h-10 rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] px-3.5 text-sm focus:border-[var(--accent)] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#14161A] mb-1.5">
                URL Slug *
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlugManuallyEdited(true);
                  setSlug(makeSlug(e.target.value));
                }}
                placeholder="eagle-3-1"
                className="w-full h-10 rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] px-3.5 text-sm font-mono focus:border-[var(--accent)] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#14161A] mb-1.5">
                SKU / Product Code *
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value.toUpperCase())}
                placeholder="GL-EAGLE-31"
                className="w-full h-10 rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] px-3.5 text-sm font-mono uppercase focus:border-[var(--accent)] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#14161A] mb-1.5">
                Primary Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => handlePrimaryCategoryChange(e.target.value)}
                className="w-full h-10 rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] px-3 text-sm focus:border-[var(--accent)] focus:bg-white focus:outline-none"
              >
                <option value="">Select category...</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#14161A] mb-1.5">
                Brand *
              </label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full h-10 rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] px-3 text-sm focus:border-[var(--accent)] focus:bg-white focus:outline-none"
              >
                {Array.from(
                  new Set([
                    "GunLite",
                    ...brands.map((b) => b.name).filter(Boolean),
                    ...(brand ? [brand] : []),
                  ])
                ).map((brandName) => (
                  <option key={brandName} value={brandName}>
                    {brandName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Multi-category assignment pills */}
          {categories.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-[#14161A] mb-2">
                Assigned Categories (also appear under these filters)
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const cid = String(cat._id);
                  const active = selectedCategories.includes(cid);
                  return (
                    <button
                      key={cid}
                      type="button"
                      onClick={() => handleToggleMultiCategory(cid)}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                        active
                          ? "border-[var(--accent)] bg-[var(--accent-tint)] text-[var(--accent)]"
                          : "border-[#E6E6E1] bg-white text-[#4A5058] hover:border-[#CFCFC8]"
                      }`}
                    >
                      {active && <Check className="w-3 h-3" />}
                      <span>{cat.name}</span>
                      {cid === categoryId && (
                        <span className="text-[10px] opacity-70">(Primary)</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section B: Pricing, Stock & Flags */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#14161A] mb-1.5">
                Regular Price (₹) *
              </label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="2499"
                className="w-full h-10 rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] px-3 text-sm tabular-nums focus:border-[var(--accent)] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#14161A] mb-1.5">
                Discount Price (₹)
              </label>
              <input
                type="number"
                min="0"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="Optional"
                className="w-full h-10 rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] px-3 text-sm tabular-nums focus:border-[var(--accent)] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#14161A] mb-1.5">
                Stock Quantity *
              </label>
              <input
                type="number"
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="w-full h-10 rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] px-3 text-sm tabular-nums focus:border-[var(--accent)] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#14161A] mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full h-10 rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] px-3 text-sm focus:border-[var(--accent)] focus:bg-white focus:outline-none"
              >
<<<<<<< HEAD
                <option value="active">Active (Visible)</option>
                <option value="inactive">Inactive (Hidden)</option>
=======
                <option value="published">Published (Visible)</option>
                <option value="draft">Draft (Hidden)</option>
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
              </select>
            </div>
          </div>

          {/* Short Spec, Badge, Featured, Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-[#14161A] mb-1.5">
                Card Short Spec Line
              </label>
              <input
                type="text"
                value={shortSpec}
                onChange={(e) => setShortSpec(e.target.value)}
                placeholder="e.g. 50W LED · Type-C"
                className="w-full h-10 rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] px-3.5 text-sm focus:border-[var(--accent)] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#14161A] mb-1.5">
                Badge Label (optional)
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Best Seller or New"
                className="w-full h-10 rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] px-3.5 text-sm focus:border-[var(--accent)] focus:bg-white focus:outline-none"
              />
            </div>

            <label className="flex items-center gap-2.5 h-10 px-3.5 rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 accent-[var(--accent)] rounded"
              />
              <span className="text-xs font-semibold text-[#14161A]">
                Mark as Featured Product
              </span>
            </label>
          </div>

          {/* Optional Per-Product Warranty Add-On Settings */}
          <div className="rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-[#14161A]">
                  Optional Hardware Warranty Add-On
                </p>
                <p className="text-[11px] text-[#6B727C]">
                  Shown as an optional tick box on the product page and tallied in cart totals.
                </p>
              </div>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={warrantyEnabled}
                  onChange={(e) => setWarrantyEnabled(e.target.checked)}
                  className="h-4 w-4 accent-[var(--accent)] rounded"
                />
                <span className="text-xs font-semibold text-[#14161A]">Enabled</span>
              </label>
            </div>

            {warrantyEnabled && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-medium text-[#4A5058] mb-1">
                    Warranty Label
                  </label>
                  <input
                    type="text"
                    value={warrantyLabel}
                    onChange={(e) => setWarrantyLabel(e.target.value)}
                    className="w-full h-9 rounded-lg border border-[#E6E6E1] bg-white px-3 text-xs focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#4A5058] mb-1">
                    Warranty Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={warrantyPrice}
                    onChange={(e) => setWarrantyPrice(e.target.value)}
                    className="w-full h-9 rounded-lg border border-[#E6E6E1] bg-white px-3 text-xs tabular-nums focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#14161A] mb-1.5">
              Product Description *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description shown on the product page..."
              className="w-full rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] p-3.5 text-sm focus:border-[var(--accent)] focus:bg-white focus:outline-none"
            />
          </div>

          {/* Multiple Image Upload & Cloudinary Manager */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-semibold text-[#14161A]">
                  Product Images (Cloudinary)
                </label>
                <p className="text-[11px] text-[#6B727C]">
<<<<<<< HEAD
                  Upload up to 10 images (JPG, PNG, WebP, AVIF · max 5 MB each). Mark one as primary.
=======
                  Upload up to 10 images (JPG, PNG, WebP, AVIF · max 1 MB each). Mark one as primary.
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
                </p>
              </div>
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="h-9 rounded-xl bg-[#14161A] hover:bg-[var(--accent)] px-3.5 text-xs font-semibold text-white inline-flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Images</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={(e) => handleUploadNewFiles(e.target.files)}
                className="hidden"
              />
              <input
                ref={replaceInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={(e) => handleReplaceFileSelected(e.target.files)}
                className="hidden"
              />
            </div>

            {uploading && (
              <div className="rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] p-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium text-[#14161A]">
                  <span>Uploading to Cloudinary...</span>
                  <span className="tabular-nums">{uploadProgress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#E6E6E1] overflow-hidden">
                  <div
                    className="h-full bg-[var(--accent)] transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {images.length === 0 ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full rounded-2xl border-2 border-dashed border-[#D5D5CF] bg-[#FAFAF8] hover:border-[var(--accent)] p-8 text-center transition-colors"
              >
                <ImageIcon className="w-8 h-8 text-[#8B97A8] mx-auto mb-2" />
                <p className="text-xs font-semibold text-[#14161A]">
                  Click to select multiple product photos
                </p>
                <p className="text-[11px] text-[#6B727C] mt-0.5">
                  First uploaded photo becomes the primary storefront image
                </p>
              </button>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <div
                    key={`${img.url}-${idx}`}
                    className={`group relative rounded-xl overflow-hidden border bg-[#14161A] ${
                      img.isPrimary
                        ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/30"
                        : "border-[#E6E6E1]"
                    }`}
                  >
                    <div className="aspect-[3/2] w-full overflow-hidden">
                      <img
                        src={img.url}
                        alt={`Product preview ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {img.isPrimary && (
                      <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-[var(--accent)] px-2 py-0.5 text-[10px] font-semibold text-white shadow-xs">
                        <Star className="w-2.5 h-2.5 fill-white" />
                        Primary
                      </span>
                    )}

                    <div className="flex items-center justify-between gap-1 bg-white p-1.5 border-t border-[#E6E6E1]">
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(idx)}
                        disabled={img.isPrimary}
                        className="flex-1 h-7 rounded-lg text-[10.5px] font-semibold px-1.5 bg-[#F4F4F1] hover:bg-[var(--accent-tint)] hover:text-[var(--accent)] text-[#14161A] disabled:opacity-50 truncate"
                      >
                        {img.isPrimary ? "Primary" : "Set Primary"}
                      </button>

                      <button
                        type="button"
                        title="Replace image"
                        onClick={() => {
                          setReplaceIndex(idx);
                          replaceInputRef.current?.click();
                        }}
                        className="h-7 w-7 rounded-lg border border-[#E6E6E1] flex items-center justify-center text-[#4A5058] hover:text-[#14161A] hover:bg-[#F4F4F1]"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>

                      <button
                        type="button"
                        title="Remove image"
                        onClick={() => handleRemoveImage(idx)}
                        className="h-7 w-7 rounded-lg border border-[#E6E6E1] flex items-center justify-center text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Technical Specifications Builder */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#14161A]">
                Technical Specifications
              </label>
              <button
                type="button"
                onClick={() => setSpecs((prev) => [...prev, { label: "", value: "" }])}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Spec Row</span>
              </button>
            </div>

            <div className="space-y-2">
              {specs.map((spec, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={spec.label}
                    onChange={(e) => handleSpecChange(idx, "label", e.target.value)}
                    placeholder="Label (e.g. LED Emitter)"
                    className="w-2/5 h-9 rounded-lg border border-[#E6E6E1] bg-[#FAFAF8] px-3 text-xs focus:border-[var(--accent)] focus:bg-white focus:outline-none"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(idx, "value", e.target.value)}
                    placeholder="Value (e.g. 50W High Power LED)"
                    className="flex-1 h-9 rounded-lg border border-[#E6E6E1] bg-[#FAFAF8] px-3 text-xs focus:border-[var(--accent)] focus:bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setSpecs((prev) =>
                        prev.length > 1 ? prev.filter((_, i) => i !== idx) : [{ label: "", value: "" }]
                      )
                    }
                    className="h-9 w-9 shrink-0 rounded-lg border border-[#E6E6E1] flex items-center justify-center text-[#6B727C] hover:text-red-500 hover:bg-red-50"
                    aria-label="Remove specification row"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-5 sm:px-6 py-4 border-t border-[#E6E6E1] bg-[#FAFAF8] shrink-0">
          <button
            type="button"
            disabled={saving || uploading}
            onClick={onClose}
            className="h-10 rounded-xl border border-[#E6E6E1] bg-white px-4 text-xs font-semibold text-[#14161A] hover:bg-[#F4F4F1] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={saving || uploading}
            onClick={handleSubmit}
            className="h-10 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-6 text-xs font-semibold text-white shadow-xs disabled:opacity-50"
          >
            {saving ? "Saving..." : isEditing ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
