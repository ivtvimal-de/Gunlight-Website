import { useEffect, useState, useCallback, useRef } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Award,
  X,
  Check,
  Package,
  Upload,
  Star,
  Image as ImageIcon,
  Clock,
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import { api, uploadImagesWithProgress } from "../../services/api";
import { formatPrice } from "../../context/CartContext";
import { useCatalog } from "../../context/CatalogContext";
import { useToast } from "../../context/ToastContext";
import { resolveMediaUrl } from "../../utils/productAdapter";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
]);
const MAX_FILE_SIZE = 1 * 1024 * 1024;

function makeSlug(str) {
  return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function emptyMedia() {
  return { url: "", publicId: "" };
}

export default function AdminBrands() {
  const toast = useToast();
  const { refreshCatalog } = useCatalog();

  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const [brands, setBrands] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add / Edit modal state
  const [formOpen, setFormOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [tagline, setTagline] = useState("");
  const [taglineHi, setTaglineHi] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionHi, setDescriptionHi] = useState("");
  const [logo, setLogo] = useState(emptyMedia());
  const [bannerImage, setBannerImage] = useState(emptyMedia());
  const [displayOrder, setDisplayOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);
  const [isFlagship, setIsFlagship] = useState(false);
  const [isComingSoon, setIsComingSoon] = useState(false);
  const [assignedProductIds, setAssignedProductIds] = useState([]);
  const [sessionUploadedPublicIds, setSessionUploadedPublicIds] = useState([]);
  const [uploadingTarget, setUploadingTarget] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);

  // Brand-wise products viewer modal
  const [viewingBrand, setViewingBrand] = useState(null);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [reassignToId, setReassignToId] = useState("");
  const [deleting, setDeleting] = useState(false);

  const loadBrands = useCallback(async () => {
    try {
      setLoading(true);
      const [brandRes, prodRes] = await Promise.all([
        api.getAdminBrands(),
        api.getAdminProducts({ limit: 100 }),
      ]);
      setBrands(brandRes?.brands || []);
      setAllProducts(prodRes?.products || []);
    } catch (err) {
      toast.error(err.message || "Failed to load brands.");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadBrands();
  }, [loadBrands]);

  const cleanupSessionUploads = (ids = sessionUploadedPublicIds) => {
    ids.forEach((pid) => {
      if (pid) api.deleteUploadedImage(pid).catch(() => {});
    });
  };

  const openCreateModal = () => {
    setEditingBrand(null);
    setName("");
    setSlug("");
    setSlugManuallyEdited(false);
    setTagline("");
    setTaglineHi("");
    setDescription("");
    setDescriptionHi("");
    setLogo(emptyMedia());
    setBannerImage(emptyMedia());
    setDisplayOrder(String(brands.length + 1));
    setIsActive(true);
    setIsFlagship(false);
    setIsComingSoon(false);
    setAssignedProductIds([]);
    setSessionUploadedPublicIds([]);
    setUploadProgress(0);
    setUploadingTarget("");
    setFormOpen(true);
  };

  const openEditModal = (brand) => {
    setEditingBrand(brand);
    setName(brand.name || "");
    setSlug(brand.slug || "");
    setSlugManuallyEdited(true);
    setTagline(brand.tagline || "");
    setTaglineHi(brand.taglineHi || "");
    setDescription(brand.description || "");
    setDescriptionHi(brand.descriptionHi || "");
    setLogo(
      brand.logo?.url
        ? { url: brand.logo.url, publicId: brand.logo.publicId || "" }
        : emptyMedia()
    );
    setBannerImage(
      brand.bannerImage?.url
        ? {
            url: brand.bannerImage.url,
            publicId: brand.bannerImage.publicId || "",
          }
        : emptyMedia()
    );
    setDisplayOrder(String(brand.displayOrder ?? 0));
    setIsActive(brand.isActive !== false);
    setIsFlagship(Boolean(brand.isFlagship));
    setIsComingSoon(Boolean(brand.isComingSoon));
    setAssignedProductIds((brand.products || []).map((p) => String(p._id)));
    setSessionUploadedPublicIds([]);
    setUploadProgress(0);
    setUploadingTarget("");
    setFormOpen(true);
  };

  const handleCloseModal = () => {
    if (saving || uploadingTarget) return;
    cleanupSessionUploads();
    setSessionUploadedPublicIds([]);
    setFormOpen(false);
  };

  const handleUploadAsset = async (fileList, targetField) => {
    const file = fileList?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.has(file.type)) {
      toast.error("Unsupported format. Use JPG, PNG, WebP, or AVIF.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image exceeds the 1 MB file size limit.");
      return;
    }

    try {
      setUploadingTarget(targetField);
      setUploadProgress(5);
      const res = await uploadImagesWithProgress(
        [file],
        "gunlite/brands",
        (pct) => setUploadProgress(pct)
      );
      const uploaded = res?.files?.[0];
      if (uploaded) {
        const nextMedia = {
          url: uploaded.url,
          publicId: uploaded.publicId || "",
        };
        const currentMedia = targetField === "logo" ? logo : bannerImage;
        if (
          currentMedia?.publicId &&
          sessionUploadedPublicIds.includes(currentMedia.publicId)
        ) {
          api.deleteUploadedImage(currentMedia.publicId).catch(() => {});
        }
        if (targetField === "logo") {
          setLogo(nextMedia);
        } else {
          setBannerImage(nextMedia);
        }
        if (nextMedia.publicId) {
          setSessionUploadedPublicIds((prev) => [...prev, nextMedia.publicId]);
        }
        toast.success(
          targetField === "logo"
            ? "Brand logo uploaded."
            : "Showcase banner uploaded."
        );
      }
    } catch (err) {
      toast.error(err.message || "Failed to upload brand image.");
    } finally {
      setUploadingTarget("");
      setUploadProgress(0);
      if (targetField === "logo" && logoInputRef.current) {
        logoInputRef.current.value = "";
      }
      if (targetField === "banner" && bannerInputRef.current) {
        bannerInputRef.current.value = "";
      }
    }
  };

  const handleRemoveAsset = (targetField) => {
    const currentMedia = targetField === "logo" ? logo : bannerImage;
    if (
      currentMedia?.publicId &&
      sessionUploadedPublicIds.includes(currentMedia.publicId)
    ) {
      api.deleteUploadedImage(currentMedia.publicId).catch(() => {});
    }
    if (targetField === "logo") {
      setLogo(emptyMedia());
    } else {
      setBannerImage(emptyMedia());
    }
  };

  const toggleProductAssignment = (pid) => {
    setAssignedProductIds((prev) =>
      prev.includes(pid) ? prev.filter((id) => id !== pid) : [...prev, pid]
    );
  };

  const handleSaveBrand = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Brand name is required.");
      return;
    }

    const payload = {
      name: name.trim(),
      slug: makeSlug(slug || name),
      tagline: tagline.trim(),
      taglineHi: taglineHi.trim(),
      description: description.trim(),
      descriptionHi: descriptionHi.trim(),
      logo,
      bannerImage,
      displayOrder: Number(displayOrder) || 0,
      isActive,
      isFlagship,
      isComingSoon,
      productIds: assignedProductIds,
    };

    try {
      setSaving(true);
      if (editingBrand) {
        await api.updateAdminBrand(editingBrand._id, payload);
        toast.success(`Brand "${payload.name}" updated.`);
      } else {
        await api.createAdminBrand(payload);
        toast.success(`Brand "${payload.name}" created.`);
      }
      setSessionUploadedPublicIds([]);
      setFormOpen(false);
      loadBrands();
      refreshCatalog();
    } catch (err) {
      toast.error(err.message || "Failed to save brand.");
    } finally {
      setSaving(false);
    }
  };

  const openDeleteModal = (brand) => {
    const others = brands.filter((b) => b._id !== brand._id);
    const gunliteDefault = others.find((b) => b.slug === "gunlite") || others[0];
    setReassignToId(gunliteDefault?._id || "");
    setDeleteTarget(brand);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await api.deleteAdminBrand(deleteTarget._id, reassignToId || undefined);
      toast.success(`Brand "${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
      loadBrands();
      refreshCatalog();
    } catch (err) {
      toast.error(err.message || "Failed to delete brand.");
    } finally {
      setDeleting(false);
    }
  };

  const replacementOptions = deleteTarget
    ? brands.filter((b) => b._id !== deleteTarget._id)
    : [];

  return (
    <AdminLayout
      title="Brands"
      subtitle="Manage GunLite flagship showcase, partner brands, logos, and brand-wise products"
      actions={
        <button
          type="button"
          onClick={openCreateModal}
          className="h-9 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-3.5 text-xs font-semibold text-white inline-flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Brand</span>
        </button>
      }
    >
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-48 rounded-2xl bg-white border border-[#E6E6E1] animate-pulse"
            />
          ))}
        </div>
      ) : brands.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#E6E6E1] p-12 text-center">
          <Award className="w-10 h-10 text-[#8B97A8] mx-auto mb-3" />
          <p className="font-['Outfit'] text-lg font-bold text-[#14161A]">
            No brands added yet
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="mt-4 h-10 rounded-xl bg-[var(--accent)] px-5 text-xs font-semibold text-white"
          >
            Create First Brand
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map((brand) => {
            const logoUrl = resolveMediaUrl(brand.logo?.url || "");
            return (
              <div
                key={brand._id}
                className="rounded-2xl bg-white border border-[#E6E6E1] p-5 flex flex-col justify-between shadow-[0_2px_12px_rgba(20,22,26,0.03)]"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {logoUrl ? (
                        <div className="h-11 w-14 rounded-xl bg-[#FAFAF8] border border-[#E6E6E1] p-1.5 flex items-center justify-center shrink-0">
                          <img
                            src={logoUrl}
                            alt={brand.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="h-11 w-11 rounded-xl bg-[#14161A] text-white font-['Outfit'] font-bold text-base flex items-center justify-center shrink-0">
                          {brand.name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h2 className="font-['Outfit'] text-lg font-bold text-[#14161A] truncate">
                            {brand.name}
                          </h2>
                          {brand.isFlagship && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                              Flagship
                            </span>
                          )}
                          {brand.isComingSoon && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-[#F4F4F1] px-2 py-0.5 text-[10px] font-semibold text-[#6B727C]">
                              <Clock className="w-2.5 h-2.5" />
                              Coming Soon
                            </span>
                          )}
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                              brand.isActive !== false
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {brand.isActive !== false ? "Active" : "Hidden"}
                          </span>
                        </div>
                        <p className="font-mono text-[11px] text-[#8B97A8] mt-0.5 truncate">
                          /shop?brand={brand.slug}
                        </p>
                      </div>
                    </div>

                    <span className="rounded-lg bg-[#F4F4F1] px-2.5 py-1 text-xs font-semibold text-[#14161A] tabular-nums shrink-0">
                      {brand.productCount} product
                      {brand.productCount !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {(brand.tagline || brand.description) && (
                    <p className="mt-3 text-xs text-[#4A5058] leading-relaxed line-clamp-2">
                      {brand.tagline || brand.description}
                    </p>
                  )}

                  {brand.products && brand.products.length > 0 && (
                    <div className="mt-3 flex items-center gap-1.5">
                      {brand.products.slice(0, 4).map((p) => {
                        const img = resolveMediaUrl(
                          p.images?.find((i) => i.isPrimary)?.url ||
                            p.images?.[0]?.url ||
                            "/images/eagle.webp"
                        );
                        return (
                          <img
                            key={p._id}
                            src={img}
                            alt={p.name}
                            title={p.name}
                            className="h-8 w-11 rounded-md object-cover bg-[#14161A] border border-[#E6E6E1]"
                          />
                        );
                      })}
                      {brand.products.length > 4 && (
                        <span className="text-[11px] font-medium text-[#6B727C] ml-1">
                          +{brand.products.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3.5 border-t border-[#F1F1ED] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setViewingBrand(brand)}
                    className="text-xs font-semibold text-[var(--accent)] hover:underline inline-flex items-center gap-1"
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>View Products</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditModal(brand)}
                      className="h-8 rounded-lg border border-[#E6E6E1] px-3 text-xs font-semibold text-[#14161A] hover:bg-[#F4F4F1] inline-flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => openDeleteModal(brand)}
                      className="h-8 w-8 rounded-lg border border-[#E6E6E1] flex items-center justify-center text-red-500 hover:bg-red-50"
                      aria-label={`Delete ${brand.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Brand Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-['Inter']">
          <div
            className="fixed inset-0 bg-black/55 backdrop-blur-xs"
            onClick={handleCloseModal}
          />
          <div className="relative z-10 w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl bg-white border border-[#E6E6E1] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E6E6E1] bg-[#FAFAF8]">
              <div>
                <h3 className="font-['Outfit'] text-lg font-bold text-[#14161A]">
                  {editingBrand
                    ? `Edit Brand — ${editingBrand.name}`
                    : "Add New Brand"}
                </h3>
                <p className="text-xs text-[#6B727C]">
                  Updates sync immediately across the Brands page, brand strip,
                  and Shop filter.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1 rounded-lg text-[#6B727C] hover:text-[#14161A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSaveBrand}
              className="flex-1 overflow-y-auto p-5 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#14161A] mb-1.5">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!slugManuallyEdited) setSlug(makeSlug(e.target.value));
                    }}
                    placeholder="e.g. GunLite or Philips"
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
                    placeholder="gunlite"
                    className="w-full h-10 rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] px-3.5 text-sm font-mono focus:border-[var(--accent)] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#14161A] mb-1.5">
                    Brand Tagline (English)
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Professional LED torches and search lights from Coimbatore."
                    className="w-full h-10 rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] px-3.5 text-sm focus:border-[var(--accent)] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#14161A] mb-1.5">
                    Brand Tagline (Hindi — हिन्दी)
                  </label>
                  <input
                    type="text"
                    value={taglineHi}
                    onChange={(e) => setTaglineHi(e.target.value)}
                    placeholder="ब्रांड की हिन्दी टैगलाइन..."
                    className="w-full h-10 rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] px-3.5 text-sm focus:border-[var(--accent)] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#14161A] mb-1.5">
                    Description (English)
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional overview shown under partner or brand cards..."
                    className="w-full rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] p-3 text-sm focus:border-[var(--accent)] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#14161A] mb-1.5">
                    Description (Hindi — हिन्दी)
                  </label>
                  <textarea
                    rows={2}
                    value={descriptionHi}
                    onChange={(e) => setDescriptionHi(e.target.value)}
                    placeholder="ब्रांड का वैकल्पिक हिन्दी विवरण..."
                    className="w-full rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] p-3 text-sm focus:border-[var(--accent)] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Brand Logo & Showcase Banner Upload */}
              {uploadingTarget && (
                <div className="rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] p-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium text-[#14161A]">
                    <span>
                      Uploading {uploadingTarget === "logo" ? "Logo" : "Banner"}...
                    </span>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Brand Logo */}
                <div className="rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#14161A]">
                      Brand Logo
                    </span>
                    <button
                      type="button"
                      disabled={Boolean(uploadingTarget)}
                      onClick={() => logoInputRef.current?.click()}
                      className="text-[11px] font-semibold text-[var(--accent)] hover:underline inline-flex items-center gap-1"
                    >
                      <Upload className="w-3 h-3" />
                      <span>{logo.url ? "Replace" : "Upload"}</span>
                    </button>
                  </div>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={(e) => handleUploadAsset(e.target.files, "logo")}
                    className="hidden"
                  />

                  {logo.url ? (
                    <div className="flex items-center justify-between gap-2 rounded-lg bg-white border border-[#E6E6E1] p-2">
                      <img
                        src={resolveMediaUrl(logo.url)}
                        alt="Logo preview"
                        className="h-10 max-w-[140px] object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveAsset("logo")}
                        className="h-7 w-7 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center"
                        aria-label="Remove logo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="w-full h-16 rounded-lg border border-dashed border-[#D5D5CF] bg-white hover:border-[var(--accent)] flex items-center justify-center gap-2 text-xs text-[#6B727C]"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>Optional logo (falls back to monogram)</span>
                    </button>
                  )}
                </div>

                {/* Flagship Showcase Banner */}
                <div className="rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#14161A]">
                      Showcase Banner (3:2)
                    </span>
                    <button
                      type="button"
                      disabled={Boolean(uploadingTarget)}
                      onClick={() => bannerInputRef.current?.click()}
                      className="text-[11px] font-semibold text-[var(--accent)] hover:underline inline-flex items-center gap-1"
                    >
                      <Upload className="w-3 h-3" />
                      <span>{bannerImage.url ? "Replace" : "Upload"}</span>
                    </button>
                  </div>
                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={(e) => handleUploadAsset(e.target.files, "banner")}
                    className="hidden"
                  />

                  {bannerImage.url ? (
                    <div className="relative rounded-lg overflow-hidden bg-[#14161A] border border-[#E6E6E1] h-16 flex items-center justify-between">
                      <img
                        src={resolveMediaUrl(bannerImage.url)}
                        alt="Banner preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveAsset("banner")}
                        className="absolute top-1.5 right-1.5 h-7 w-7 rounded-lg bg-white/95 text-red-500 hover:bg-red-50 flex items-center justify-center shadow-xs"
                        aria-label="Remove banner image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => bannerInputRef.current?.click()}
                      className="w-full h-16 rounded-lg border border-dashed border-[#D5D5CF] bg-white hover:border-[var(--accent)] flex items-center justify-center gap-2 text-xs text-[#6B727C]"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>Used for flagship dark hero banner</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Order & Visibility Flags */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                <div>
                  <label className="block text-xs font-semibold text-[#14161A] mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    className="w-full h-10 rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] px-3 text-sm tabular-nums focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>

                <label className="flex items-center gap-2 h-10 px-3 rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 accent-[var(--accent)] rounded"
                  />
                  <span className="text-xs font-semibold text-[#14161A]">
                    Visible
                  </span>
                </label>

                <label className="flex items-center gap-2 h-10 px-3 rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFlagship}
                    onChange={(e) => {
                      const next = e.target.checked;
                      setIsFlagship(next);
                      if (next) setIsComingSoon(false);
                    }}
                    className="h-4 w-4 accent-[var(--accent)] rounded"
                  />
                  <span className="text-xs font-semibold text-[#14161A]">
                    Flagship Hero
                  </span>
                </label>

                <label className="flex items-center gap-2 h-10 px-3 rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isComingSoon}
                    onChange={(e) => {
                      const next = e.target.checked;
                      setIsComingSoon(next);
                      if (next) setIsFlagship(false);
                    }}
                    className="h-4 w-4 accent-[var(--accent)] rounded"
                  />
                  <span className="text-xs font-semibold text-[#14161A]">
                    Coming Soon
                  </span>
                </label>
              </div>

              {/* Assign Products to this Brand */}
              {allProducts.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-[#14161A] mb-2">
                    Assign Products to {name.trim() || "this Brand"}
                  </label>
                  <div className="max-h-48 overflow-y-auto rounded-xl border border-[#E6E6E1] divide-y divide-[#F1F1ED]">
                    {allProducts.map((p) => {
                      const pid = String(p._id);
                      const checked = assignedProductIds.includes(pid);
                      return (
                        <button
                          key={pid}
                          type="button"
                          onClick={() => toggleProductAssignment(pid)}
                          className="w-full px-3 py-2 flex items-center justify-between gap-2 text-left hover:bg-[#FAFAF8] text-xs"
                        >
                          <div className="min-w-0">
                            <p className="font-semibold text-[#14161A] truncate">
                              {p.name}
                            </p>
                            <p className="text-[11px] text-[#6B727C]">
                              {p.sku} · Current brand: {p.brand || "GunLite"}
                            </p>
                          </div>
                          <span
                            className={`h-4.5 w-4.5 rounded-[5px] border flex items-center justify-center shrink-0 ${
                              checked
                                ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                                : "border-[#B8B8B0] bg-white"
                            }`}
                          >
                            {checked && <Check className="w-3 h-3 stroke-[3]" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </form>

            <div className="flex items-center justify-end gap-2.5 px-5 py-4 border-t border-[#E6E6E1] bg-[#FAFAF8]">
              <button
                type="button"
                disabled={saving || Boolean(uploadingTarget)}
                onClick={handleCloseModal}
                className="h-10 rounded-xl border border-[#E6E6E1] bg-white px-4 text-xs font-semibold text-[#14161A]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving || Boolean(uploadingTarget)}
                onClick={handleSaveBrand}
                className="h-10 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-5 text-xs font-semibold text-white"
              >
                {saving
                  ? "Saving..."
                  : editingBrand
                  ? "Save Changes"
                  : "Create Brand"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Brand-Wise Products Modal */}
      {viewingBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-['Inter']">
          <div
            className="fixed inset-0 bg-black/55 backdrop-blur-xs"
            onClick={() => setViewingBrand(null)}
          />
          <div className="relative z-10 w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl bg-white border border-[#E6E6E1] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E6E6E1] bg-[#FAFAF8]">
              <div>
                <h3 className="font-['Outfit'] text-lg font-bold text-[#14161A]">
                  {viewingBrand.name} Products
                </h3>
                <p className="text-xs text-[#6B727C]">
                  {viewingBrand.products?.length || 0} assigned product(s)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewingBrand(null)}
                className="p-1 rounded-lg text-[#6B727C] hover:text-[#14161A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {!viewingBrand.products || viewingBrand.products.length === 0 ? (
                <p className="text-xs text-[#6B727C] text-center py-8">
                  No products are assigned to {viewingBrand.name} yet.
                </p>
              ) : (
                <div className="divide-y divide-[#F1F1ED]">
                  {viewingBrand.products.map((p) => {
                    const thumb = resolveMediaUrl(
                      p.images?.find((i) => i.isPrimary)?.url ||
                        p.images?.[0]?.url ||
                        "/images/eagle.webp"
                    );
                    return (
                      <div
                        key={p._id}
                        className="py-3 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={thumb}
                            alt={p.name}
                            className="h-10 w-14 rounded-lg object-cover bg-[#14161A] shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#14161A] truncate">
                              {p.name}
                            </p>
                            <p className="text-[11px] text-[#6B727C]">
                              {p.sku} · {p.stockQuantity} in stock
                            </p>
                          </div>
                        </div>
                        <span className="font-['Outfit'] text-sm font-bold text-[#14161A] tabular-nums shrink-0">
                          {formatPrice(p.discountPrice ?? p.price)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Brand?"
        description={`Are you sure you want to delete "${deleteTarget?.name || ""}"? Any uploaded logo/banner will also be removed.`}
        confirmLabel="Delete Brand"
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      >
        {replacementOptions.length > 0 && (deleteTarget?.productCount || 0) > 0 && (
          <div className="rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] p-3">
            <label className="block text-xs font-semibold text-[#14161A] mb-1.5">
              Reassign {deleteTarget.productCount} product(s) to:
            </label>
            <select
              value={reassignToId}
              onChange={(e) => setReassignToId(e.target.value)}
              className="w-full h-9 rounded-lg border border-[#E6E6E1] bg-white px-2.5 text-xs focus:outline-none"
            >
              {replacementOptions.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </ConfirmDialog>
    </AdminLayout>
  );
}
