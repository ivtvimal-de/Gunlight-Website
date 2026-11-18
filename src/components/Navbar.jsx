import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, MessageCircle, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { WHATSAPP_URL, COMPANY } from "../config";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, openCart } = useCart();

  // Clear search input when navigating away from /shop
  useEffect(() => {
    if (!location.pathname.startsWith("/shop")) {
      setSearchQuery("");
      setSearchExpanded(false);
    }
  }, [location.pathname]);

  // Track scroll for deeper dark backdrop
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${
          scrolled
            ? "bg-[#020617]/90 backdrop-blur-md border-b border-white/[0.08] shadow-lg shadow-black/40"
            : "bg-[#020617]/75 backdrop-blur-sm border-b border-white/[0.05]"
        }`}
      >
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* ── Brand Logo ── */}
          <Link
            to="/"
            className="flex items-center gap-2 group transition-opacity hover:opacity-90 shrink-0"
            aria-label="GunLite Home"
          >
            <picture>
              <source srcSet="/images/logo.webp" type="image/webp" />
              <img
                src="/images/logo.png"
                alt="GunLite Professional Search Lights"
                width={124}
                height={32}
                className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </picture>
          </Link>

          {/* ── Desktop Navigation ── */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-slate-300">
            {navLinks.map((item) => {
              const isActive =
                item.href === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`relative py-2 transition-colors duration-200 font-display text-sm tracking-wider ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {item.label}
                  {/* Subtle Cyan Underline */}
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full transition-all duration-300 ${
                      isActive
                        ? "bg-[#00e5ff] shadow-[0_0_8px_#00e5ff]"
                        : "bg-transparent hover:bg-[#00e5ff]/50"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* ── Action Group: Expanding Search & Cart ── */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Desktop Expanding Search */}
            <div className="hidden sm:flex items-center relative">
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center"
              >
                <div
                  className={`flex items-center rounded-full transition-all duration-300 ease-out border ${
                    searchExpanded || searchQuery
                      ? "w-60 md:w-72 bg-[#090e1a] border-[#00e5ff]/50 shadow-[0_0_15px_-3px_rgba(0,229,255,0.25)] px-3 py-1.5"
                      : "w-9 h-9 bg-transparent border-transparent justify-center"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSearchExpanded(true);
                      setTimeout(() => searchInputRef.current?.focus(), 100);
                    }}
                    aria-label="Search"
                    className="text-slate-400 hover:text-[#00e5ff] transition-colors p-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>

                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onFocus={() => setSearchExpanded(true)}
                    onBlur={() => {
                      if (!searchQuery) setSearchExpanded(false);
                    }}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      navigate(`/shop?q=${encodeURIComponent(e.target.value.trim())}`, { replace: true });
                    }}
                    placeholder="Search torches, specs..."
                    className={`bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none ml-2 transition-all duration-300 ${
                      searchExpanded || searchQuery ? "w-full opacity-100" : "w-0 opacity-0 pointer-events-none"
                    }`}
                  />

                  {(searchExpanded || searchQuery) && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setSearchExpanded(false);
                        if (location.pathname.startsWith("/shop")) {
                          navigate("/shop");
                        }
                      }}
                      className="text-slate-400 hover:text-white p-1 transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="w-3.5 h-3.5 text-slate-400 hover:text-[#00e5ff]" />
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Cart Button */}
            <button
              onClick={openCart}
              aria-label={`Open cart with ${cartCount} items`}
              className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors duration-200"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#00e5ff] px-1 text-[10px] font-bold font-display text-[#020617] shadow-[0_0_8px_#00e5ff]">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setOpen(true)}
              aria-label="Open mobile menu"
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Full-Height Slide-In Panel ── */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="fixed inset-y-0 right-0 w-[280px] sm:w-[320px] bg-[#090e1a] border-l border-white/[0.08] shadow-2xl flex flex-col justify-between p-6">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
                <span className="font-display text-lg font-bold tracking-wider uppercase text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#00e5ff] shadow-[0_0_6px_#00e5ff]" />
                  GunLite
                </span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="p-1.5 text-slate-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="mt-5">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      navigate(`/shop?q=${encodeURIComponent(e.target.value.trim())}`, { replace: true });
                    }}
                    placeholder="Search torches..."
                    className="w-full bg-[#020617] border border-white/[0.12] rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00e5ff]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <Search className="w-3.5 h-3.5 text-[#00e5ff]" />
                  </span>
                </div>
              </form>

              {/* Navigation Links */}
              <nav className="mt-6 flex flex-col gap-1">
                {navLinks.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? location.pathname === "/"
                      : location.pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-3 rounded-lg font-display text-sm font-semibold tracking-wider uppercase transition-colors ${
                        isActive
                          ? "bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30"
                          : "text-slate-300 hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      {item.label}
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#00e5ff]" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Footer in Drawer */}
            <div className="pt-6 border-t border-white/[0.08] space-y-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-green-500 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>WhatsApp Orders</span>
              </a>
              <p className="text-[11px] text-slate-500 text-center">
                © {new Date().getFullYear()} {COMPANY.name}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
