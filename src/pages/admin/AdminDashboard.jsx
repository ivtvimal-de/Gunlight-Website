import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Award,
  Plus,
  RefreshCw,
  ArrowRight,
  Clock,
  Star,
  Activity,
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { api } from "../../services/api";
import { formatPrice } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";

function formatDateTime(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getAdminDashboard();
      setData(res);
    } catch (err) {
      toast.error(err.message || "Failed to load dashboard metrics.");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const stats = data?.stats || {
    totalProducts: 0,
    activeProducts: 0,
    inactiveProducts: 0,
    outOfStockProducts: 0,
    lowStockProducts: 0,
    inStockHealthy: 0,
    featuredProducts: 0,
    totalCategories: 0,
    totalBrands: 0,
    activeBrands: 0,
    totalStockUnits: 0,
  };

  const categoryBreakdown = data?.categoryBreakdown || [];
  const brandBreakdown = data?.brandBreakdown || [];
  const stockDistribution = data?.stockDistribution || [];
  const recentProducts = data?.recentProducts || [];
  const recentActivities = data?.recentActivities || [];

  const maxCategoryCount = Math.max(
    1,
    ...categoryBreakdown.map((c) => c.count || 0)
  );

  const STAT_CARDS = [
    {
      label: "Total Products",
      value: stats.totalProducts,
      sub: `${stats.featuredProducts} featured · ${stats.totalStockUnits} units`,
      icon: Package,
      accent: "bg-[#14161A] text-white",
    },
    {
      label: "Active Products",
      value: stats.activeProducts,
      sub: `${stats.inactiveProducts} inactive hidden`,
      icon: CheckCircle2,
      accent: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    },
    {
      label: "Out-of-Stock",
      value: stats.outOfStockProducts,
      sub: `${stats.lowStockProducts} low-stock (1–5)`,
      icon: AlertTriangle,
      accent:
        stats.outOfStockProducts > 0
          ? "bg-red-50 text-red-600 border border-red-200"
          : "bg-[#F4F4F1] text-[#6B727C] border border-[#E6E6E1]",
    },
    {
      label: "Categories",
      value: stats.totalCategories,
      sub: "Active hardware groups",
      icon: Layers,
      accent: "bg-[var(--accent-tint)] text-[var(--accent)] border border-[var(--accent)]/20",
    },
    {
      label: "Brands",
      value: stats.totalBrands,
      sub: `${stats.activeBrands} live · ${Math.max(0, stats.totalBrands - stats.activeBrands)} coming soon`,
      icon: Award,
      accent: "bg-amber-50 text-amber-600 border border-amber-200",
    },
  ];

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Live overview of GunLite catalog, inventory health, and admin activity"
      actions={
        <>
          <button
            type="button"
            onClick={loadDashboard}
            disabled={loading}
            className="h-9 rounded-xl border border-[#E6E6E1] bg-white px-3 text-xs font-semibold text-[#14161A] hover:bg-[#F4F4F1] inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <Link
            to="/admin/products"
            state={{ openCreate: true }}
            className="h-9 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-3.5 text-xs font-semibold text-white inline-flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </Link>
        </>
      }
    >
      {/* 1. Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
        {loading && !data
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-2xl bg-white border border-[#E6E6E1] animate-pulse"
              />
            ))
          : STAT_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="rounded-2xl bg-white border border-[#E6E6E1] p-4 sm:p-5 shadow-[0_2px_12px_rgba(20,22,26,0.03)] flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-[#6B727C]">
                      {card.label}
                    </span>
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${card.accent}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="font-['Outfit'] text-2xl sm:text-3xl font-bold text-[#14161A] tabular-nums">
                      {card.value}
                    </div>
                    <p className="mt-1 text-[11px] text-[#6B727C] truncate">
                      {card.sub}
                    </p>
                  </div>
                </div>
              );
            })}
      </div>

      {/* 2. Charts Row: Category Breakdown & Inventory Stock Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
        {/* Category Distribution Bar Chart */}
        <div className="lg:col-span-7 rounded-2xl bg-white border border-[#E6E6E1] p-5 shadow-[0_2px_12px_rgba(20,22,26,0.03)]">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="font-['Outfit'] text-base font-bold text-[#14161A]">
                Products by Category
              </h2>
              <p className="text-xs text-[#6B727C]">
                Catalog distribution &amp; unit stock across categories
              </p>
            </div>
            <Link
              to="/admin/categories"
              className="text-xs font-semibold text-[var(--accent)] hover:underline inline-flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {categoryBreakdown.length === 0 ? (
            <p className="text-xs text-[#6B727C] py-8 text-center">
              No categories found yet.
            </p>
          ) : (
            <div className="space-y-4">
              {categoryBreakdown.map((cat) => {
                const pct = Math.round(((cat.count || 0) / maxCategoryCount) * 100);
                return (
                  <div key={cat._id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#14161A]">{cat.name}</span>
                      <span className="text-[#6B727C] tabular-nums">
                        {cat.count} product{cat.count !== 1 ? "s" : ""} · {cat.totalStock} units
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-[#F4F4F1] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#14161A] to-[var(--accent)] transition-all duration-500"
                        style={{ width: `${Math.max(pct, cat.count > 0 ? 8 : 0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {brandBreakdown.length > 0 && (
            <div className="mt-5 pt-4 border-t border-[#F1F1ED]">
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <h3 className="font-['Outfit'] text-xs font-bold uppercase tracking-wider text-[#6B727C]">
                  Brands Directory
                </h3>
                <Link
                  to="/admin/brands"
                  className="text-xs font-semibold text-[var(--accent)] hover:underline inline-flex items-center gap-1"
                >
                  <span>Manage Brands</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {brandBreakdown.map((b) => (
                  <span
                    key={b._id}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium ${
                      b.isComingSoon
                        ? "border-[#E6E6E1] bg-[#FAFAF8] text-[#6B727C]"
                        : "border-[#14161A]/15 bg-[#14161A] text-white"
                    }`}
                  >
                    <span>{b.name}</span>
                    <span className="opacity-70 text-[10px] tabular-nums">
                      {b.isComingSoon && b.count === 0 ? "Soon" : `${b.count}`}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Inventory Health Breakdown */}
        <div className="lg:col-span-5 rounded-2xl bg-white border border-[#E6E6E1] p-5 shadow-[0_2px_12px_rgba(20,22,26,0.03)] flex flex-col justify-between">
          <div>
            <h2 className="font-['Outfit'] text-base font-bold text-[#14161A]">
              Inventory Health
            </h2>
            <p className="text-xs text-[#6B727C] mb-5">
              Stock status split across all {stats.totalProducts} products
            </p>

            {/* Stacked Progress Bar */}
            <div className="h-4 w-full rounded-full bg-[#F4F4F1] overflow-hidden flex mb-5">
              {stats.totalProducts > 0 &&
                stockDistribution.map((segment) => {
                  const widthPct = (segment.value / stats.totalProducts) * 100;
                  if (widthPct <= 0) return null;
                  return (
                    <div
                      key={segment.label}
                      style={{
                        width: `${widthPct}%`,
                        backgroundColor: segment.color,
                      }}
                      title={`${segment.label}: ${segment.value}`}
                    />
                  );
                })}
            </div>

            <div className="space-y-3">
              {stockDistribution.map((segment) => {
                const pct =
                  stats.totalProducts > 0
                    ? Math.round((segment.value / stats.totalProducts) * 100)
                    : 0;
                return (
                  <div
                    key={segment.label}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: segment.color }}
                      />
                      <span className="font-medium text-[#4A5058]">{segment.label}</span>
                    </div>
                    <span className="font-semibold text-[#14161A] tabular-nums">
                      {segment.value} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#F1F1ED] flex items-center justify-between text-xs">
            <span className="text-[#6B727C]">Total Inventory Units</span>
            <span className="font-['Outfit'] font-bold text-base text-[#14161A] tabular-nums">
              {stats.totalStockUnits}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Recently Added Products + Recent Admin Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recently Added Products */}
        <div className="lg:col-span-7 rounded-2xl bg-white border border-[#E6E6E1] p-5 shadow-[0_2px_12px_rgba(20,22,26,0.03)]">
          <div className="flex items-center justify-between gap-2 mb-4">
            <h2 className="font-['Outfit'] text-base font-bold text-[#14161A]">
              Recently Added Products
            </h2>
            <Link
              to="/admin/products"
              className="text-xs font-semibold text-[var(--accent)] hover:underline inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentProducts.length === 0 ? (
            <p className="text-xs text-[#6B727C] py-8 text-center">
              No products added yet.
            </p>
          ) : (
            <div className="divide-y divide-[#F1F1ED]">
              {recentProducts.map((p) => {
                const thumb =
                  p.images?.find((i) => i.isPrimary)?.url ||
                  p.images?.[0]?.url ||
                  "/images/eagle.webp";
                const effectivePrice =
                  p.discountPrice !== null &&
                  p.discountPrice !== undefined &&
                  p.discountPrice < p.price
                    ? p.discountPrice
                    : p.price;

                return (
                  <div
                    key={p._id}
                    className="py-3 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={thumb}
                        alt={p.name}
                        className="h-11 w-14 rounded-lg object-cover bg-[#14161A] shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-semibold text-[#14161A] truncate">
                            {p.name}
                          </p>
                          {p.isFeatured && (
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-[#6B727C] truncate">
                          {p.category?.name || "Uncategorized"} · SKU: {p.sku}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="font-['Outfit'] text-sm font-bold text-[#14161A] tabular-nums">
                          {formatPrice(effectivePrice)}
                        </div>
                        <div
                          className={`text-[10.5px] font-medium ${
                            p.stockQuantity <= 0
                              ? "text-red-600"
                              : p.stockQuantity <= 5
                              ? "text-amber-600"
                              : "text-emerald-600"
                          }`}
                        >
                          {p.stockQuantity <= 0
                            ? "Out of stock"
                            : `${p.stockQuantity} in stock`}
                        </div>
                      </div>
                      <span
                        className={`hidden sm:inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                          p.status === "active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-[#F4F4F1] text-[#6B727C]"
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Admin Activities */}
        <div className="lg:col-span-5 rounded-2xl bg-white border border-[#E6E6E1] p-5 shadow-[0_2px_12px_rgba(20,22,26,0.03)]">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-[var(--accent)]" />
            <h2 className="font-['Outfit'] text-base font-bold text-[#14161A]">
              Recent Admin Activities
            </h2>
          </div>

          {recentActivities.length === 0 ? (
            <p className="text-xs text-[#6B727C] py-8 text-center">
              No recent activity recorded yet.
            </p>
          ) : (
            <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
              {recentActivities.map((act) => (
                <div
                  key={act._id}
                  className="flex items-start gap-2.5 text-xs pb-3 border-b border-[#F1F1ED] last:border-b-0 last:pb-0"
                >
                  <span className="mt-1 h-2 w-2 rounded-full bg-[var(--accent)] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[#14161A] leading-snug">
                      {act.summary}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-[#6B727C]">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>{formatDateTime(act.createdAt)}</span>
                      {act.adminEmail && (
                        <>
                          <span>·</span>
                          <span className="truncate">{act.adminEmail}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
