import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Star,
  ChevronLeft,
  ChevronRight,
  Package,
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import ProductFormModal from "../../components/admin/ProductFormModal";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import { api } from "../../services/api";
import { formatPrice } from "../../context/CartContext";
import { useCatalog } from "../../context/CatalogContext";
import { useToast } from "../../context/ToastContext";

export default function AdminProducts() {
  const location = useLocation();
  const toast = useToast();
  const { refreshCatalog } = useCatalog();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const [modalOpen, setModalOpen] = useState(Boolean(location.state?.openCreate));
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        api.getAdminProducts({
          search: search.trim(),
          category: categoryFilter !== "All" ? categoryFilter : "",
          status: statusFilter,
          stock: stockFilter,
          page,
          limit: 12,
        }),
        api.getAdminCategories(),
      ]);
      setProducts(prodRes?.products || []);
      setPagination(prodRes?.pagination || { total: 0, page: 1, pages: 1 });
      setCategories(catRes?.categories || []);
    } catch (err) {
      toast.error(err.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, statusFilter, stockFilter, page, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleStatus = async (product) => {
    const nextStatus = product.status === "active" ? "inactive" : "active";
    try {
      await api.updateAdminProduct(product._id, { status: nextStatus });
      toast.success(`"${product.name}" marked ${nextStatus}.`);
      loadData();
      refreshCatalog();
    } catch (err) {
      toast.error(err.message || "Failed to update status.");
    }
  };

  const handleToggleFeatured = async (product) => {
    try {
      await api.updateAdminProduct(product._id, {
        isFeatured: !product.isFeatured,
      });
      toast.success(
        `"${product.name}" ${!product.isFeatured ? "marked as featured" : "removed from featured"}.`
      );
      loadData();
      refreshCatalog();
    } catch (err) {
      toast.error(err.message || "Failed to update featured flag.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await api.deleteAdminProduct(deleteTarget._id);
      toast.success(`Deleted "${deleteTarget.name}" permanently.`);
      setDeleteTarget(null);
      loadData();
      refreshCatalog();
    } catch (err) {
      toast.error(err.message || "Failed to delete product.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout
      title="Products"
      subtitle={`${pagination.total} product${pagination.total !== 1 ? "s" : ""} in catalog`}
      actions={
        <button
          type="button"
          onClick={() => {
            setEditingProduct(null);
            setModalOpen(true);
          }}
          className="h-9 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-3.5 text-xs font-semibold text-white inline-flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Product</span>
        </button>
      }
    >
      {/* Filters Bar */}
      <div className="rounded-2xl bg-white border border-[#E6E6E1] p-4 mb-5 shadow-[0_2px_10px_rgba(20,22,26,0.03)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-2 relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B97A8]" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by product name, SKU, or spec..."
              className="w-full h-10 rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] pl-9 pr-3 text-xs sm:text-sm focus:border-[var(--accent)] focus:bg-white focus:outline-none"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] px-3 text-xs font-medium text-[#14161A] focus:border-[var(--accent)] focus:outline-none"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] px-3 text-xs font-medium text-[#14161A] focus:border-[var(--accent)] focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={stockFilter}
            onChange={(e) => {
              setStockFilter(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-xl border border-[#E6E6E1] bg-[#FAFAF8] px-3 text-xs font-medium text-[#14161A] focus:border-[var(--accent)] focus:outline-none"
          >
            <option value="">All Stock</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock (1–5)</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Product Table (Desktop) / Card List (Mobile) */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-2xl bg-white border border-[#E6E6E1] animate-pulse"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#E6E6E1] p-12 text-center">
          <Package className="w-10 h-10 text-[#8B97A8] mx-auto mb-3" />
          <p className="font-['Outfit'] text-lg font-bold text-[#14161A]">
            No matching products
          </p>
          <p className="text-xs text-[#6B727C] mt-1">
            Try clearing your filters or add a new product.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block rounded-2xl bg-white border border-[#E6E6E1] overflow-hidden shadow-[0_2px_12px_rgba(20,22,26,0.03)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E6E6E1] bg-[#FAFAF8] text-[11px] font-semibold uppercase tracking-wider text-[#6B727C]">
                    <th className="py-3.5 px-4">Product</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Stock</th>
                    <th className="py-3.5 px-4">Featured</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F1ED] text-sm">
                  {products.map((product) => {
                    const thumb =
                      product.images?.find((i) => i.isPrimary)?.url ||
                      product.images?.[0]?.url ||
                      "/images/eagle.webp";
                    const hasDiscount =
                      product.discountPrice !== null &&
                      product.discountPrice !== undefined &&
                      product.discountPrice < product.price;

                    return (
                      <tr key={product._id} className="hover:bg-[#FAFAF8]/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={thumb}
                              alt={product.name}
                              className="h-11 w-16 rounded-lg object-cover bg-[#14161A] shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-semibold text-[#14161A] truncate max-w-[220px]">
                                {product.name}
                              </p>
                              <p className="font-mono text-[11px] text-[#6B727C]">
                                {product.sku}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-[#4A5058]">
                          {product.category?.name || "—"}
                        </td>
                        <td className="py-3.5 px-4 tabular-nums">
                          {hasDiscount ? (
                            <div>
                              <span className="font-['Outfit'] font-bold text-[#14161A]">
                                {formatPrice(product.discountPrice)}
                              </span>
                              <span className="ml-1.5 text-xs text-[#8B97A8] line-through">
                                {formatPrice(product.price)}
                              </span>
                            </div>
                          ) : (
                            <span className="font-['Outfit'] font-bold text-[#14161A]">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tabular-nums ${
                              product.stockQuantity <= 0
                                ? "bg-red-50 text-red-700"
                                : product.stockQuantity <= 5
                                ? "bg-amber-50 text-amber-700"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {product.stockQuantity <= 0
                              ? "Out of stock"
                              : `${product.stockQuantity} units`}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(product)}
                            className={`h-8 w-8 rounded-lg border flex items-center justify-center transition-colors ${
                              product.isFeatured
                                ? "border-amber-200 bg-amber-50 text-amber-500"
                                : "border-[#E6E6E1] bg-white text-[#8B97A8] hover:text-amber-500"
                            }`}
                            title="Toggle Featured"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                product.isFeatured ? "fill-amber-500" : ""
                              }`}
                            />
                          </button>
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(product)}
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase transition-colors ${
                              product.status === "active"
                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                : "bg-[#F4F4F1] text-[#6B727C] hover:bg-[#E6E6E1]"
                            }`}
                          >
                            {product.status}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProduct(product);
                                setModalOpen(true);
                              }}
                              className="h-8 rounded-lg border border-[#E6E6E1] bg-white px-2.5 text-xs font-semibold text-[#14161A] hover:bg-[#F4F4F1] inline-flex items-center gap-1"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(product)}
                              className="h-8 w-8 rounded-lg border border-[#E6E6E1] bg-white flex items-center justify-center text-red-500 hover:bg-red-50"
                              aria-label={`Delete ${product.name}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {products.map((product) => {
              const thumb =
                product.images?.find((i) => i.isPrimary)?.url ||
                product.images?.[0]?.url ||
                "/images/eagle.webp";
              const effectivePrice =
                product.discountPrice !== null &&
                product.discountPrice !== undefined &&
                product.discountPrice < product.price
                  ? product.discountPrice
                  : product.price;

              return (
                <div
                  key={product._id}
                  className="rounded-2xl bg-white border border-[#E6E6E1] p-3.5 space-y-3 shadow-2xs"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={thumb}
                      alt={product.name}
                      className="h-14 w-20 rounded-xl object-cover bg-[#14161A] shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-['Outfit'] font-bold text-sm text-[#14161A] truncate">
                          {product.name}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(product)}
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase shrink-0 ${
                            product.status === "active"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-[#F4F4F1] text-[#6B727C]"
                          }`}
                        >
                          {product.status}
                        </button>
                      </div>
                      <p className="text-[11px] text-[#6B727C] mt-0.5">
                        {product.category?.name} · {product.sku}
                      </p>
                      <div className="mt-1.5 flex items-center gap-3">
                        <span className="font-['Outfit'] font-bold text-sm text-[#14161A]">
                          {formatPrice(effectivePrice)}
                        </span>
                        <span
                          className={`text-[11px] font-medium ${
                            product.stockQuantity <= 0
                              ? "text-red-600"
                              : "text-emerald-600"
                          }`}
                        >
                          {product.stockQuantity <= 0
                            ? "Out of stock"
                            : `${product.stockQuantity} in stock`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-[#F1F1ED] flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(product)}
                      className={`h-8 rounded-lg border px-2.5 text-xs font-medium inline-flex items-center gap-1 ${
                        product.isFeatured
                          ? "border-amber-200 bg-amber-50 text-amber-700"
                          : "border-[#E6E6E1] text-[#6B727C]"
                      }`}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          product.isFeatured ? "fill-amber-500 text-amber-500" : ""
                        }`}
                      />
                      <span>Featured</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct(product);
                          setModalOpen(true);
                        }}
                        className="h-8 rounded-lg border border-[#E6E6E1] px-3 text-xs font-semibold text-[#14161A] inline-flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(product)}
                        className="h-8 w-8 rounded-lg border border-[#E6E6E1] flex items-center justify-center text-red-500"
                        aria-label={`Delete ${product.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-5 flex items-center justify-between">
              <p className="text-xs text-[#6B727C]">
                Page {pagination.page} of {pagination.pages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="h-9 w-9 rounded-xl border border-[#E6E6E1] bg-white flex items-center justify-center disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={page >= pagination.pages}
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  className="h-9 w-9 rounded-xl border border-[#E6E6E1] bg-white flex items-center justify-center disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add / Edit Product Modal */}
      <ProductFormModal
        open={modalOpen}
        initialProduct={editingProduct}
        categories={categories}
        onClose={() => setModalOpen(false)}
        onSaved={() => {
          loadData();
          refreshCatalog();
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Product Permanently?"
        description={`This will remove "${deleteTarget?.name || ""}" from the database, storefront, and permanently delete its Cloudinary image assets.`}
        confirmLabel="Delete Product"
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}
