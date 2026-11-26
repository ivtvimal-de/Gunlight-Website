import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Layers,
  X,
  Check,
  Package,
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import { api } from "../../services/api";
import { formatPrice } from "../../context/CartContext";
import { useCatalog } from "../../context/CatalogContext";
import { useToast } from "../../context/ToastContext";

export default function AdminCategories() {
  const toast = useToast();
  const { refreshCatalog } = useCatalog();

  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add / Edit modal state
  const [formOpen, setFormOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);
  const [assignedProductIds, setAssignedProductIds] = useState([]);
  const [saving, setSaving] = useState(false);

  // Category-wise products viewer modal
  const [viewingCat, setViewingCat] = useState(null);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [reassignToId, setReassignToId] = useState("");
  const [deleting, setDeleting] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const [catRes, prodRes] = await Promise.all([
        api.getAdminCategories(),
        api.getAdminProducts({ limit: 100 }),
      ]);
      setCategories(catRes?.categories || []);
      setAllProducts(prodRes?.products || []);
    } catch (err) {
      toast.error(err.message || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const openCreateModal = () => {
    setEditingCat(null);
    setName("");
    setDescription("");
    setDisplayOrder(String(categories.length + 1));
    setIsActive(true);
    setAssignedProductIds([]);
    setFormOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCat(cat);
    setName(cat.name || "");
    setDescription(cat.description || "");
    setDisplayOrder(String(cat.displayOrder ?? 0));
    setIsActive(cat.isActive !== false);
    setAssignedProductIds((cat.products || []).map((p) => String(p._id)));
    setFormOpen(true);
  };

  const toggleProductAssignment = (pid) => {
    setAssignedProductIds((prev) =>
      prev.includes(pid) ? prev.filter((id) => id !== pid) : [...prev, pid]
    );
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      displayOrder: Number(displayOrder) || 0,
      isActive,
      productIds: assignedProductIds,
    };

    try {
      setSaving(true);
      if (editingCat) {
        await api.updateAdminCategory(editingCat._id, payload);
        toast.success(`Category "${payload.name}" updated.`);
      } else {
        await api.createAdminCategory(payload);
        toast.success(`Category "${payload.name}" created.`);
      }
      setFormOpen(false);
      loadCategories();
      refreshCatalog();
    } catch (err) {
      toast.error(err.message || "Failed to save category.");
    } finally {
      setSaving(false);
    }
  };

  const openDeleteModal = (cat) => {
    const others = categories.filter((c) => c._id !== cat._id);
    setReassignToId(others[0]?._id || "");
    setDeleteTarget(cat);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await api.deleteAdminCategory(deleteTarget._id, reassignToId || undefined);
      toast.success(`Category "${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
      loadCategories();
      refreshCatalog();
    } catch (err) {
      toast.error(err.message || "Failed to delete category.");
    } finally {
      setDeleting(false);
    }
  };

  const replacementOptions = deleteTarget
    ? categories.filter((c) => c._id !== deleteTarget._id)
    : [];

  return (
    <AdminLayout
      title="Categories"
      subtitle="Organize products, assign categories, and view category-wise inventory"
      actions={
        <button
          type="button"
          onClick={openCreateModal}
          className="h-9 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-3.5 text-xs font-semibold text-white inline-flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Category</span>
        </button>
      }
    >
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-44 rounded-2xl bg-white border border-[#E6E6E1] animate-pulse"
            />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#E6E6E1] p-12 text-center">
          <Layers className="w-10 h-10 text-[#8B97A8] mx-auto mb-3" />
          <p className="font-['Outfit'] text-lg font-bold text-[#14161A]">
            No categories created yet
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="mt-4 h-10 rounded-xl bg-[var(--accent)] px-5 text-xs font-semibold text-white"
          >
            Create First Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="rounded-2xl bg-white border border-[#E6E6E1] p-5 flex flex-col justify-between shadow-[0_2px_12px_rgba(20,22,26,0.03)]"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-['Outfit'] text-lg font-bold text-[#14161A]">
                        {cat.name}
                      </h2>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                          cat.isActive !== false
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-[#F4F4F1] text-[#6B727C]"
                        }`}
                      >
                        {cat.isActive !== false ? "Active" : "Hidden"}
                      </span>
                    </div>
                    <p className="font-mono text-[11px] text-[#8B97A8] mt-0.5">
                      /{cat.slug}
                    </p>
                  </div>

                  <span className="rounded-lg bg-[#F4F4F1] px-2.5 py-1 text-xs font-semibold text-[#14161A] tabular-nums shrink-0">
                    {cat.productCount} product{cat.productCount !== 1 ? "s" : ""}
                  </span>
                </div>

                {cat.description && (
                  <p className="mt-2.5 text-xs text-[#4A5058] leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                )}

                {/* Product thumbnails preview */}
                {cat.products && cat.products.length > 0 && (
                  <div className="mt-3 flex items-center gap-1.5">
                    {cat.products.slice(0, 4).map((p) => {
                      const img =
                        p.images?.find((i) => i.isPrimary)?.url ||
                        p.images?.[0]?.url ||
                        "/images/eagle.webp";
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
                    {cat.products.length > 4 && (
                      <span className="text-[11px] font-medium text-[#6B727C] ml-1">
                        +{cat.products.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3.5 border-t border-[#F1F1ED] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setViewingCat(cat)}
                  className="text-xs font-semibold text-[var(--accent)] hover:underline inline-flex items-center gap-1"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>View Products</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEditModal(cat)}
                    className="h-8 rounded-lg border border-[#E6E6E1] px-3 text-xs font-semibold text-[#14161A] hover:bg-[#F4F4F1] inline-flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => openDeleteModal(cat)}
                    className="h-8 w-8 rounded-lg border border-[#E6E6E1] flex items-center justify-center text-red-500 hover:bg-red-50"
                    aria-label={`Delete ${cat.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-['Inter']">
          <div
            className="fixed inset-0 bg-black/55 backdrop-blur-xs"
            onClick={() => !saving && setFormOpen(false)}
          />
          <div className="relative z-10 w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl bg-white border border-[#E6E6E1] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E6E6E1] bg-[#FAFAF8]">
              <h3 className="font-['Outfit'] text-lg font-bold text-[#14161A]">
                {editingCat ? `Edit Category — ${editingCat.name}` : "Add Category"}
              </h3>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="p-1 rounded-lg text-[#6B727C] hover:text-[#14161A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="flex-1 overflow-y-auto p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#14161A] mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tactical Flashlights"
                  className="w-full h-10 rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] px-3.5 text-sm focus:border-[var(--accent)] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#14161A] mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description shown on category tiles..."
                  className="w-full rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] p-3 text-sm focus:border-[var(--accent)] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-end">
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
                    Visible on Store
                  </span>
                </label>
              </div>

              {/* Assign Products to this Category */}
              {allProducts.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-[#14161A] mb-2">
                    Assign Products to this Category
                  </label>
                  <div className="max-h-48 overflow-y-auto rounded-xl border border-[#E6E6E1] divide-y divide-[#F1F1ED]">
                    {allProducts.map((p) => {
                      const pid = String(p._id);
                      const checked = assignedProductIds.includes(pid);
                      const isPrimary =
                        editingCat && String(p.category?._id || p.category) === String(editingCat._id);
                      return (
                        <button
                          key={pid}
                          type="button"
                          onClick={() => !isPrimary && toggleProductAssignment(pid)}
                          className="w-full px-3 py-2 flex items-center justify-between gap-2 text-left hover:bg-[#FAFAF8] text-xs"
                        >
                          <div className="min-w-0">
                            <p className="font-semibold text-[#14161A] truncate">
                              {p.name}
                            </p>
                            <p className="text-[11px] text-[#6B727C]">
                              {p.sku}
                              {isPrimary ? " · Primary Category" : ""}
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
                disabled={saving}
                onClick={() => setFormOpen(false)}
                className="h-10 rounded-xl border border-[#E6E6E1] bg-white px-4 text-xs font-semibold text-[#14161A]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveCategory}
                className="h-10 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-5 text-xs font-semibold text-white"
              >
                {saving ? "Saving..." : editingCat ? "Save Changes" : "Create Category"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category-Wise Products Modal */}
      {viewingCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-['Inter']">
          <div
            className="fixed inset-0 bg-black/55 backdrop-blur-xs"
            onClick={() => setViewingCat(null)}
          />
          <div className="relative z-10 w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl bg-white border border-[#E6E6E1] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E6E6E1] bg-[#FAFAF8]">
              <div>
                <h3 className="font-['Outfit'] text-lg font-bold text-[#14161A]">
                  {viewingCat.name} Products
                </h3>
                <p className="text-xs text-[#6B727C]">
                  {viewingCat.products?.length || 0} assigned product(s)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewingCat(null)}
                className="p-1 rounded-lg text-[#6B727C] hover:text-[#14161A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {!viewingCat.products || viewingCat.products.length === 0 ? (
                <p className="text-xs text-[#6B727C] text-center py-8">
                  No products are assigned to this category yet.
                </p>
              ) : (
                <div className="divide-y divide-[#F1F1ED]">
                  {viewingCat.products.map((p) => {
                    const thumb =
                      p.images?.find((i) => i.isPrimary)?.url ||
                      p.images?.[0]?.url ||
                      "/images/eagle.webp";
                    return (
                      <div key={p._id} className="py-3 flex items-center justify-between gap-3">
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
        title="Delete Category?"
        description={`Are you sure you want to delete "${deleteTarget?.name || ""}"?`}
        confirmLabel="Delete Category"
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      >
        {replacementOptions.length > 0 && (deleteTarget?.productCount || 0) > 0 && (
          <div className="rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] p-3">
            <label className="block text-xs font-semibold text-[#14161A] mb-1.5">
              Reassign primary products (if any) to:
            </label>
            <select
              value={reassignToId}
              onChange={(e) => setReassignToId(e.target.value)}
              className="w-full h-9 rounded-lg border border-[#E6E6E1] bg-white px-2.5 text-xs focus:outline-none"
            >
              {replacementOptions.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </ConfirmDialog>
    </AdminLayout>
  );
}
