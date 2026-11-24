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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const mobileSearchInputRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, openCart } = useCart();

  // Lock body scroll when left drawer is open
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

  // Handle escape key to close menu or mobile search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setMobileSearchOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close mobile drawer and search bar on route change
  useEffect(() => {
    setMenuOpen(false);
    setMobileSearchOpen(false);
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
      setMobileSearchOpen(false);
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (location.pathname.startsWith("/shop") || val.trim()) {
      navigate(`/shop?q=${encodeURIComponent(val.trim())}`, { replace: true });
    }
  };

  const toggleMobileSearch = () => {
    setMobileSearchOpen((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => mobileSearchInputRef.current?.focus(), 150);
      }
      return next;
    });
  };

  const searchParams = new URLSearchParams(location.search);
  const hasBrandParam = Boolean(searchParams.get("brand"));
  const isBrandsActive = location.pathname.startsWith("/brands") || hasBrandParam;

  return (
    <>
      {/* ── STICKY HEADER (Desktop: 72px / Mobile: 64px, white, 1px #E6E6E1 border) ── */}
      <header className="sticky top-0 z-50 w-full h-[64px] md:h-[72px] bg-white border-b border-[#E6E6E1] font-['Inter']">
        <div className="mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* ── MOBILE LEFT (under 768px): Hamburger 40px outline circle + GunLite Logo 36px ── */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              className="h-10 w-10 shrink-0 rounded-full border border-[#E6E6E1] bg-white flex items-center justify-center text-[#14161A] hover:bg-[#F4F4F1] transition-colors"
            >
              <Menu className="h-5 w-5 text-[#14161A]" />
            </button>

            <Link to="/" className="shrink-0 flex items-center" aria-label="GunLite Home">
              <picture>
                <source srcSet="/images/logo.webp" type="image/webp" />
                <img
                  src="/images/logo.png"
                  alt="GunLite"
                  width={130}
                  height={36}
                  className="h-9 w-auto object-contain"
                />
              </picture>
            </Link>
          </div>

          {/* ── DESKTOP LEFT (768px and above): Logo (about 44px high) ── */}
          <Link to="/" className="shrink-0 hidden md:flex items-center" aria-label="GunLite Home">
            <picture>
              <source srcSet="/images/logo.webp" type="image/webp" />
              <img
                src="/images/logo.png"
                alt="GunLite"
                width={160}
                height={44}
                className="h-[44px] w-auto object-contain"
              />
            </picture>
          </Link>

          {/* Desktop Search Bar (flex-1, max-width 420px, light grey #F4F4F1 background, desktop only) */}
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

          {/* ── DESKTOP RIGHT GROUP (768px and above): Nav Links, WhatsApp, Cart ── */}
          <div className="hidden md:flex items-center gap-6 ml-auto">
            <nav className="flex items-center gap-6" aria-label="Main Navigation">
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

            {/* WhatsApp icon button (40px) */}
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

            {/* Cart icon button (40px) with red count badge */}
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

          {/* ── MOBILE RIGHT (under 768px): Search, WhatsApp, and Cart (40px outline circles, 8px gaps) ── */}
          <div className="flex items-center gap-2 md:hidden">
            
            {/* Search Icon Button (40px outline circle) */}
            <button
              type="button"
              onClick={toggleMobileSearch}
              aria-label="Toggle search bar"
              className={`h-10 w-10 shrink-0 rounded-full border flex items-center justify-center transition-colors ${
                mobileSearchOpen
                  ? "border-[var(--accent)] bg-[var(--accent-tint)] text-[var(--accent)]"
                  : "border-[#E6E6E1] bg-white text-[#14161A] hover:bg-[#F4F4F1]"
              }`}
            >
              <Search className="h-4 w-4" />
            </button>

            {/* WhatsApp Icon Button (40px outline circle) */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Order on WhatsApp"
              title="Order on WhatsApp"
              className="h-10 w-10 shrink-0 rounded-full border border-[#E6E6E1] bg-white flex items-center justify-center text-[var(--accent)] hover:bg-[#F4F4F1] transition-colors"
            >
              <MessageCircle className="h-5 w-5 text-[var(--accent)]" />
            </a>

            {/* Cart Icon Button (40px outline circle with red count badge) */}
            <button
              onClick={openCart}
              aria-label="Open shopping cart"
              className="relative h-10 w-10 shrink-0 rounded-full border border-[#E6E6E1] bg-white flex items-center justify-center text-[#14161A] hover:bg-[#F4F4F1] transition-colors"
            >
              <ShoppingBag className="h-5 w-5 text-[#14161A]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-bold text-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

          </div>

        </div>
      </header>

      {/* ── MOBILE TOGGLEABLE SEARCH BAR (Directly under sticky header) ── */}
      {mobileSearchOpen && (
        <div className="md:hidden bg-white border-b border-[#E6E6E1] px-4 py-2.5 font-['Inter'] animate-in fade-in slide-in-from-top-1 duration-150">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B97A8]" />
            <input
              ref={mobileSearchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search torch lights..."
              className="w-full h-[44px] rounded-[12px] bg-[#F4F4F1] border border-[#E6E6E1] pl-10 pr-9 text-xs sm:text-sm text-[#14161A] placeholder-[#8B97A8] focus:border-[var(--accent)] focus:bg-white focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  navigate("/shop", { replace: true });
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B97A8] hover:text-[#14161A]"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>
        </div>
      )}

      {/* ── MOBILE SLIDE-IN PANEL FROM THE LEFT (300px, max 85% width, 50% dark backdrop, 250ms slide) ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden font-['Inter']">
          
          {/* 50% dark backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-250 motion-reduce:transition-none"
            onClick={() => setMenuOpen(false)}
          />

          {/* Slide-in Panel from the LEFT (300px wide, max 85% width) */}
          <div className="fixed top-0 left-0 h-full w-[300px] max-w-[85%] bg-white shadow-2xl p-5 flex flex-col z-10 animate-in slide-in-from-left duration-250 motion-reduce:transition-none overflow-y-auto">
            
            {/* Top Bar with Logo and Close Button */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E6E6E1]">
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
                className="h-9 w-9 rounded-full border border-[#E6E6E1] flex items-center justify-center text-[#14161A] hover:bg-[#F4F4F1] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav links: 18px rows (52px high, 1px dividers): Home, Shop, Brands, About, Contact */}
            <nav className="flex flex-col mt-2 divide-y divide-[#E6E6E1]">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between h-[52px] text-[18px] font-medium transition-colors ${
                  location.pathname === "/" && !hasBrandParam
                    ? "text-[var(--accent)] font-semibold"
                    : "text-[#14161A] hover:text-[var(--accent)]"
                }`}
              >
                <span>Home</span>
                <ChevronRight className="h-4 w-4 text-[#8B97A8]" />
              </Link>

              <Link
                to="/shop"
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between h-[52px] text-[18px] font-medium transition-colors ${
                  location.pathname.startsWith("/shop") && !hasBrandParam
                    ? "text-[var(--accent)] font-semibold"
                    : "text-[#14161A] hover:text-[var(--accent)]"
                }`}
              >
                <span>Shop</span>
                <ChevronRight className="h-4 w-4 text-[#8B97A8]" />
              </Link>

              <Link
                to="/brands"
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between h-[52px] text-[18px] font-medium transition-colors ${
                  isBrandsActive
                    ? "text-[var(--accent)] font-semibold"
                    : "text-[#14161A] hover:text-[var(--accent)]"
                }`}
              >
                <span>Brands</span>
                <ChevronRight className="h-4 w-4 text-[#8B97A8]" />
              </Link>

              <Link
                to="/about"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between h-[52px] text-[18px] font-medium text-[#14161A] hover:text-[var(--accent)] transition-colors"
              >
                <span>About</span>
                <ChevronRight className="h-4 w-4 text-[#8B97A8]" />
              </Link>

              <Link
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between h-[52px] text-[18px] font-medium text-[#14161A] hover:text-[var(--accent)] transition-colors"
              >
                <span>Contact</span>
                <ChevronRight className="h-4 w-4 text-[#8B97A8]" />
              </Link>
            </nav>

            {/* Small heading "Policies" with Shipping, Returns and Warranty, Privacy, Terms */}
            <div className="mt-6 pt-4 border-t border-[#E6E6E1]">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-[#8B97A8] mb-2 px-1">
                Policies
              </div>
              <div className="flex flex-col space-y-2">
                <Link
                  to="/shipping"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm text-[#4A5058] hover:text-[#14161A] py-1 transition-colors px-1"
                >
                  Shipping
                </Link>
                <Link
                  to="/returns"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm text-[#4A5058] hover:text-[#14161A] py-1 transition-colors px-1"
                >
                  Returns and Warranty
                </Link>
                <Link
                  to="/privacy"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm text-[#4A5058] hover:text-[#14161A] py-1 transition-colors px-1"
                >
                  Privacy
                </Link>
                <Link
                  to="/terms"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm text-[#4A5058] hover:text-[#14161A] py-1 transition-colors px-1"
                >
                  Terms
                </Link>
              </div>
            </div>

            {/* Bottom Actions: Red full-width "Order on WhatsApp" button */}
            <div className="mt-auto pt-6 border-t border-[#E6E6E1] space-y-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-4 py-3 text-sm font-semibold text-white shadow-xs transition-colors w-full"
              >
                <MessageCircle className="h-4 w-4 text-white" />
                <span>Order on WhatsApp</span>
              </a>

              <p className="text-[11px] text-[#8B97A8] text-center">
                Jerone Enterprises • {COMPANY.phone}
              </p>
            </div>

          </div>

        </div>
      )}
    </>
  );
}
