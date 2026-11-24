import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  MessageCircle,
  X,
  Menu,
  ChevronRight,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { WHATSAPP_URL, COMPANY } from "../config";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, openCart } = useCart();

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.search]);

  // Keep search bar in sync with URL
  useEffect(() => {
    if (!location.pathname.startsWith("/shop")) {
      setSearchQuery("");
    }
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setMenuOpen(false);
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (location.pathname.startsWith("/shop") || val.trim()) {
      navigate(`/shop?q=${encodeURIComponent(val.trim())}`, { replace: true });
    }
  };

  const searchParams = new URLSearchParams(location.search);
  const hasBrandParam = Boolean(searchParams.get("brand"));
  const isBrandsActive = location.pathname.startsWith("/brands") || hasBrandParam;

  return (
    <>
      {/* ── SINGLE STICKY NAVBAR (72px height on desktop, white, 1px #E6E6E1 border) ── */}
      <header className="sticky top-0 z-50 w-full h-[72px] bg-white border-b border-[#E6E6E1] font-['Inter']">
        <div className="mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* 1. Logo (left, links to /) */}
          <Link to="/" className="shrink-0 flex items-center" aria-label="GunLite Home">
            <picture>
              <source srcSet="/images/logo.webp" type="image/webp" />
              <img
                src="/images/logo.png"
                alt="GunLite"
                width={130}
                height={34}
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </picture>
          </Link>

          {/* 2. Search Bar (flex-1, max-width 420px, light grey #F4F4F1 background, desktop only) */}
          <div className="hidden lg:flex flex-1 max-w-[420px] mx-6">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search torch lights..."
                className="w-full rounded-xl bg-[#F4F4F1] border border-[#E6E6E1] py-2 pl-10 pr-9 text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-white focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    navigate("/shop", { replace: true });
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </form>
          </div>

          {/* Right Group: Nav Links, WhatsApp, Cart (Desktop: aligned right with 24px gaps) */}
          <div className="hidden md:flex items-center gap-6 ml-auto">
            
            {/* Nav links: Home, Shop, BRANDS, About, Contact (plain links, uppercase 14px, weight 500) */}
            <nav className="flex items-center gap-6" aria-label="Main Navigation">
              
              {/* Home Link */}
              <Link
                to="/"
                className={`relative py-2 text-[14px] uppercase font-medium tracking-wider transition-colors outline-none focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] ${
                  location.pathname === "/" && !hasBrandParam
                    ? "text-[var(--accent)] font-semibold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-[var(--accent)] after:rounded-full"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                Home
              </Link>

              {/* Shop Link */}
              <Link
                to="/shop"
                className={`relative py-2 text-[14px] uppercase font-medium tracking-wider transition-colors outline-none focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] ${
                  location.pathname.startsWith("/shop") && !hasBrandParam
                    ? "text-[var(--accent)] font-semibold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-[var(--accent)] after:rounded-full"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                Shop
              </Link>

              {/* BRANDS Link (plain link to /brands, red + 2px underline on /brands and when ?brand= is present) */}
              <Link
                to="/brands"
                className={`relative py-2 text-[14px] uppercase font-medium tracking-wider transition-colors outline-none focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] ${
                  isBrandsActive
                    ? "text-[var(--accent)] font-semibold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-[var(--accent)] after:rounded-full"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                Brands
              </Link>

              {/* About Link */}
              <Link
                to="/about"
                className={`relative py-2 text-[14px] uppercase font-medium tracking-wider transition-colors outline-none focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] ${
                  location.pathname.startsWith("/about")
                    ? "text-[var(--accent)] font-semibold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-[var(--accent)] after:rounded-full"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                About
              </Link>

              {/* Contact Link */}
              <Link
                to="/contact"
                className={`relative py-2 text-[14px] uppercase font-medium tracking-wider transition-colors outline-none focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] ${
                  location.pathname.startsWith("/contact")
                    ? "text-[var(--accent)] font-semibold after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-[var(--accent)] after:rounded-full"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                Contact
              </Link>
            </nav>

            {/* 4. WhatsApp icon button (outline circle, 40px) */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Order on WhatsApp"
              title="Order on WhatsApp"
              className="h-10 w-10 shrink-0 rounded-full border border-[#E6E6E1] bg-white flex items-center justify-center text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--bg-surface-2)] transition-colors shadow-2xs outline-none focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
            >
              <MessageCircle className="h-5 w-5 text-[var(--accent)]" />
            </a>

            {/* 5. Cart icon button (outline circle, 40px with small red count badge) */}
            <button
              onClick={openCart}
              aria-label="Open shopping cart"
              className="relative h-10 w-10 shrink-0 rounded-full border border-[#E6E6E1] bg-white flex items-center justify-center text-[var(--text-primary)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface-2)] transition-colors shadow-2xs outline-none focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
            >
              <ShoppingBag className="h-5 w-5 text-[var(--text-primary)]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-bold text-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

          </div>

          {/* ── MOBILE ROW (Under 768px): Search, WhatsApp, Cart, Menu ── */}
          <div className="flex items-center gap-2 sm:gap-3 md:hidden">
            
            {/* Search Icon Button (opens menu with search focus) */}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(true);
                setTimeout(() => searchInputRef.current?.focus(), 150);
              }}
              aria-label="Open search"
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-[#E6E6E1] bg-white flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)] transition-colors"
            >
              <Search className="h-4 w-4 text-[var(--text-primary)]" />
            </button>

            {/* WhatsApp Icon Button */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Order on WhatsApp"
              title="Order on WhatsApp"
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-[#E6E6E1] bg-white flex items-center justify-center text-[var(--accent)] hover:bg-[var(--bg-surface-2)] transition-colors"
            >
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--accent)]" />
            </a>

            {/* Cart Icon Button with Badge */}
            <button
              onClick={openCart}
              aria-label="Open shopping cart"
              className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-[#E6E6E1] bg-white flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)] transition-colors"
            >
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--text-primary)]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-bold text-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Menu Hamburger Button */}
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-[#E6E6E1] bg-white flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)] transition-colors"
            >
              <Menu className="h-5 w-5 text-[var(--text-primary)]" />
            </button>

          </div>

        </div>
      </header>

      {/* ── MOBILE SLIDE-IN PANEL (DRAWER) ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden font-['Inter']">
          
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMenuOpen(false)}
          />

          {/* Slide-in Panel */}
          <div className="fixed top-0 right-0 h-full w-[85%] max-w-[340px] bg-white shadow-2xl p-6 flex flex-col z-10 animate-in slide-in-from-right duration-300">
            
            {/* Top Bar with Logo and Close Button */}
            <div className="flex items-center justify-between pb-5 border-b border-[#E6E6E1]">
              <img
                src="/images/logo.png"
                alt="GunLite"
                width={110}
                height={28}
                className="h-7 w-auto object-contain"
              />
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="h-9 w-9 rounded-full border border-[#E6E6E1] flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search Input in Slide-in Panel */}
            <form onSubmit={handleSearchSubmit} className="relative mt-6 mb-6">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search torch lights..."
                className="w-full rounded-xl bg-[#F4F4F1] border border-[#E6E6E1] py-2.5 pl-10 pr-9 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-white focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    navigate("/shop", { replace: true });
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </form>

            {/* Nav Links: Home, Shop, Brands, About, Contact */}
            <nav className="flex flex-col space-y-1">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-[14px] uppercase font-medium tracking-wider transition-colors ${
                  location.pathname === "/" && !hasBrandParam
                    ? "bg-[var(--accent-tint)] text-[var(--accent)] font-semibold border-l-4 border-[var(--accent)]"
                    : "text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)]"
                }`}
              >
                <span>Home</span>
                <ChevronRight className="h-4 w-4 text-[var(--text-muted)]" />
              </Link>

              <Link
                to="/shop"
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-[14px] uppercase font-medium tracking-wider transition-colors ${
                  location.pathname.startsWith("/shop") && !hasBrandParam
                    ? "bg-[var(--accent-tint)] text-[var(--accent)] font-semibold border-l-4 border-[var(--accent)]"
                    : "text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)]"
                }`}
              >
                <span>Shop</span>
                <ChevronRight className="h-4 w-4 text-[var(--text-muted)]" />
              </Link>

              <Link
                to="/brands"
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-[14px] uppercase font-medium tracking-wider transition-colors ${
                  isBrandsActive
                    ? "bg-[var(--accent-tint)] text-[var(--accent)] font-semibold border-l-4 border-[var(--accent)]"
                    : "text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)]"
                }`}
              >
                <span>Brands</span>
                <ChevronRight className="h-4 w-4 text-[var(--text-muted)]" />
              </Link>

              <Link
                to="/about"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-[14px] uppercase font-medium tracking-wider text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)] transition-colors"
              >
                <span>About</span>
                <ChevronRight className="h-4 w-4 text-[var(--text-muted)]" />
              </Link>

              <Link
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-[14px] uppercase font-medium tracking-wider text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)] transition-colors"
              >
                <span>Contact</span>
                <ChevronRight className="h-4 w-4 text-[var(--text-muted)]" />
              </Link>
            </nav>

            {/* Bottom Actions: WhatsApp Order */}
            <div className="mt-auto pt-6 border-t border-[#E6E6E1] space-y-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-4 py-3 text-xs font-semibold text-white shadow-xs transition-colors"
              >
                <MessageCircle className="h-4 w-4 text-white" />
                <span>Order on WhatsApp</span>
              </a>

              <p className="text-[11px] text-[var(--text-muted)] text-center">
                Jerone Enterprises • {COMPANY.phone}
              </p>
            </div>

          </div>

        </div>
      )}
    </>
  );
}
