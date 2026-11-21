import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  MessageCircle,
  X,
  Truck,
  ShieldCheck,
  Headphones,
  User,
  ChevronRight,
  Menu,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { WHATSAPP_URL, COMPANY, CLAIMS } from "../config";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [announcementIdx, setAnnouncementIdx] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, openCart } = useCart();

  const announcements = [
    {
      icon: <Truck className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />,
      text: CLAIMS.shipping || "Pan-India Safe Transit on all orders",
    },
    {
      icon: <MessageCircle className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />,
      text: "Direct WhatsApp Orders & Instant Stock Confirmation",
    },
    {
      icon: <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />,
      text: CLAIMS.warranty || "1-Year Hardware Warranty on LED & switches",
    },
  ];

  // Rotate announcement for mobile
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIdx((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

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
      setOpen(false);
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (location.pathname.startsWith("/shop") || val.trim()) {
      navigate(`/shop?q=${encodeURIComponent(val.trim())}`, { replace: true });
    }
  };

  const categoryNav = [
    { label: "All Products", href: "/shop" },
    { label: "LED Torches", href: "/shop?category=LED+Torch" },
    { label: "Search Lights", href: "/shop?category=Search+Light" },
    { label: "Rechargeable", href: "/shop?category=Rechargeable" },
    { label: "About GunLite", href: "/about" },
    { label: "Contact & Support", href: "/contact" },
  ];

  return (
    <>
      <header className="fixed top-0 z-50 w-full font-['Inter']">
        
        {/* ── 1. Top Announcement Bar (Thin, Dark) ── */}
        <div className="bg-[#14161A] text-[#94A3B8] border-b border-[#232730] text-[11px] py-1.5 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* Desktop View: Multi-column strip */}
            <div className="hidden md:flex items-center justify-between">
              <div className="flex items-center gap-8">
                <span className="flex items-center gap-1.5 text-[#F8FAFC]">
                  <Truck className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                  <span>{CLAIMS.shipping || "Pan-India Safe Transit"}</span>
                </span>
                <span className="text-[#384050]">|</span>
                <span className="flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                  <span>Direct WhatsApp Ordering: {COMPANY.phone}</span>
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-[#F8FAFC]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                  <span>{CLAIMS.warranty || "1-Year Hardware Warranty"}</span>
                </span>
                <span className="text-[#384050]">|</span>
                <Link to="/contact" className="hover:text-[var(--accent)] transition-colors">
                  Wholesale Enquiry
                </Link>
              </div>
            </div>

            {/* Mobile View: Rotating Single Announcement */}
            <div className="md:hidden flex items-center justify-center text-center">
              <div className="flex items-center gap-2 transition-opacity duration-300">
                {announcements[announcementIdx].icon}
                <span className="truncate font-medium text-[#F8FAFC]">
                  {announcements[announcementIdx].text}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. Main Store Header (White Background, Wide Search) ── */}
        <div
          className={`border-b border-[var(--border-subtle)] bg-white transition-all duration-200 ${
            scrolled ? "shadow-sm" : ""
          }`}
        >
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            
            {/* Logo */}
            <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="GunLite Home">
              <picture>
                <source srcSet="/images/logo.webp" type="image/webp" />
                <img
                  src="/images/logo.png"
                  alt="GunLite Logo"
                  width={130}
                  height={34}
                  className="h-8 sm:h-9 w-auto object-contain"
                />
              </picture>
            </Link>

            {/* Wide Search Bar - Center (Desktop & Tablet) */}
            <div className="hidden sm:flex flex-1 max-w-2xl mx-2 lg:mx-6">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search LED searchlights, rechargeable torches, lumens, specs..."
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] py-2.5 pl-10 pr-9 text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-colors focus:border-[var(--accent)] focus:bg-white focus:outline-none shadow-xs"
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

            {/* Right Action Icons & CTAs */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* WhatsApp Quick Order Desk */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Order Desk"
                className="hidden lg:flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] hover:border-[var(--accent)] hover:bg-white px-3.5 py-2 text-xs font-semibold text-[var(--text-primary)] transition-all shadow-xs"
              >
                <MessageCircle className="h-4 w-4 text-[var(--accent)]" />
                <div className="text-left leading-tight">
                  <p className="text-[10px] text-[var(--text-muted)]">Order Desk</p>
                  <p className="font-bold">WhatsApp</p>
                </div>
              </a>

              {/* Account / Support Help Icon */}
              <Link
                to="/contact"
                aria-label="Customer Support & Contact"
                className="hidden sm:flex items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-white p-2.5 text-[var(--text-primary)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface-2)] transition-colors"
                title="Support & Wholesale Enquiry"
              >
                <User className="h-5 w-5 text-[var(--text-secondary)]" />
              </Link>

              {/* Cart Drawer Trigger with Badge */}
              <button
                onClick={openCart}
                aria-label={`Open shopping cart with ${cartCount} items`}
                className="relative flex items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-white p-2.5 text-[var(--text-primary)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface-2)] transition-colors"
              >
                <ShoppingBag className="h-5 w-5 text-[var(--text-primary)]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-bold text-white shadow-xs">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setOpen(!open)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                className="flex items-center justify-center rounded-xl border border-[var(--border-subtle)] p-2 text-[var(--text-primary)] sm:hidden hover:bg-[var(--bg-surface-2)] transition-colors"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar (Directly below header on small mobile screens) */}
          <div className="px-4 pb-3 sm:hidden">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search torch models & specs..."
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] py-2 pl-9 pr-8 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent)] focus:bg-white focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    navigate("/shop", { replace: true });
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </form>
          </div>
        </div>

        {/* ── 3. Category Navigation Row (All Products, Categories from Shop, About, Contact) ── */}
        <nav className="hidden sm:block border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)] py-2 px-4 sm:px-6 lg:px-8 shadow-2xs">
          <div className="mx-auto flex max-w-7xl items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-6 overflow-x-auto py-0.5">
              {categoryNav.map((item) => {
                const isActive =
                  item.href === "/shop"
                    ? location.pathname === "/shop" && !location.search
                    : item.href.includes("?")
                    ? location.search.includes(item.href.split("?")[1])
                    : location.pathname === item.href;

                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`whitespace-nowrap transition-colors py-1 ${
                      isActive
                        ? "text-[var(--accent)] font-bold border-b-2 border-[var(--accent)]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="hidden lg:flex items-center gap-4 text-[11px] text-[var(--text-muted)] font-medium">
              <span>GST Registered: <strong className="text-[var(--text-primary)] font-mono">{COMPANY.gst}</strong></span>
              <span>•</span>
              <span className="text-[var(--accent)] font-semibold">Fast Dispatch</span>
            </div>
          </div>
        </nav>

        {/* ── 4. Mobile Menu Drawer ── */}
        {open && (
          <div className="border-b border-[var(--border-subtle)] bg-white px-4 py-6 sm:hidden shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">
              Store Catalogue
            </p>
            <nav className="space-y-1.5 mb-6">
              {categoryNav.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)] transition-colors border border-transparent hover:border-[var(--border-subtle)]"
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                </Link>
              ))}
            </nav>

            <div className="pt-4 border-t border-[var(--border-subtle)] space-y-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-3 text-xs font-semibold text-white shadow-xs hover:bg-[var(--accent-hover)] transition-colors"
              >
                <MessageCircle className="h-4 w-4 text-white" />
                <span>Order on WhatsApp ({COMPANY.phone})</span>
              </a>

              <div className="rounded-xl bg-[var(--bg-surface-2)] p-3 text-[11px] text-[var(--text-muted)] text-center">
                <p className="font-semibold text-[var(--text-primary)]">Jerone Enterprises</p>
                <p>Coimbatore, Tamil Nadu • Pan-India Delivery</p>
              </div>
            </div>
          </div>
        )}

      </header>
    </>
  );
}
