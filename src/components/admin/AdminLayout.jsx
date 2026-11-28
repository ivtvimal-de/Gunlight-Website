import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Layers,
  Award,
  Video,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCatalog } from "../../context/CatalogContext";
import { useToast } from "../../context/ToastContext";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Layers },
  { to: "/admin/brands", label: "Brands", icon: Award },
  { to: "/admin/videos", label: "Videos", icon: Video },
];

export default function AdminLayout({ title = "Dashboard", subtitle = "", actions = null, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { admin, isDemoMode, logout } = useAuth();
  const { refreshCatalog } = useCatalog();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      refreshCatalog();
      toast.success("Logged out of Admin Console.");
      navigate("/admin/login", { replace: true });
    } catch (err) {
      toast.error(err.message || "Logout failed");
    } finally {
      setLoggingOut(false);
    }
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-[#111317] text-white">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-white/10 shrink-0">
        <Link to="/admin" className="flex items-center gap-2.5" onClick={() => setSidebarOpen(false)}>
          <div className="rounded-lg bg-white px-2.5 py-1 shadow-xs">
            <img src="/images/logo.png" alt="GunLite" className="h-5 w-auto object-contain" />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-white/60">
            Admin
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
          Store Management
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--accent)] text-white shadow-sm"
                    : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <div className="pt-5 mt-5 border-t border-white/10">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
            Storefront
          </div>
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors"
          >
            <span>Open Public Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-white/40" />
          </Link>
        </div>
      </nav>

      {/* Admin Profile & Logout */}
      <div className="border-t border-white/10 p-4 space-y-3 shrink-0">
        <div className="flex items-center gap-2.5 px-1">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[var(--accent)]">
            <Shield className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              {admin?.name || "GunLite Admin"}
            </p>
            <p className="text-[11px] text-white/50 truncate">{admin?.email}</p>
          </div>
        </div>

        <button
          type="button"
          disabled={loggingOut}
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] hover:bg-red-500/20 hover:border-red-500/40 px-3 py-2 text-xs font-semibold text-white/85 hover:text-white transition-colors disabled:opacity-50"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{loggingOut ? "Signing out..." : "Sign Out"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#14161A] font-['Inter'] flex">
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Slide-Over Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/55 backdrop-blur-xs"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 max-w-[85%] z-10 shadow-2xl">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-[#E6E6E1] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden h-9 w-9 rounded-xl border border-[#E6E6E1] bg-white flex items-center justify-center text-[#14161A] hover:bg-[#F4F4F1]"
              aria-label="Open admin navigation"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <h1 className="font-['Outfit'] text-lg sm:text-xl font-bold text-[#14161A] truncate leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="hidden sm:block text-xs text-[#6B727C] truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </header>

        {/* Sample UI Preview Notice Banner */}
        {isDemoMode && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-900">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>
                <strong>Sample UI Preview Mode:</strong> Backend API is not connected, so changes are saved temporarily in this browser session.
              </span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="font-semibold text-amber-800 hover:underline shrink-0"
            >
              Exit Preview
            </button>
          </div>
        )}

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
