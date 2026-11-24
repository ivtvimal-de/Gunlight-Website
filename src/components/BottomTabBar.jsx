import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  Home,
  Store,
  Sparkles,
  ShoppingCart,
  MessageCircle,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { WHATSAPP_URL } from "../config";

export default function BottomTabBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cartCount, openCart } = useCart();

  const brandParam = searchParams.get("brand");
  const isHomeActive = location.pathname === "/" && !brandParam;
  const isShopActive = location.pathname.startsWith("/shop") && !brandParam;
  const isBrandsActive = location.pathname.startsWith("/brands") || Boolean(brandParam);

  const handleBrandsClick = (e) => {
    e.preventDefault();
    navigate("/brands");
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-[#E6E6E1] font-['Inter'] shadow-[0_-2px_12px_rgba(20,22,26,0.05)] pb-[env(safe-area-inset-bottom)]"
      aria-label="Mobile navigation bar"
    >
      <div className="grid grid-cols-5 h-[60px] items-center">
        
        {/* 1. Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center h-full transition-colors active:scale-95 ${
            isHomeActive
              ? "text-[var(--accent)] font-semibold"
              : "text-[#64748B] hover:text-[#14161A] font-medium"
          }`}
        >
          <Home className="w-[22px] h-[22px]" />
          <span className="text-[11px] mt-0.5 leading-none">Home</span>
        </Link>

        {/* 2. Shop */}
        <Link
          to="/shop"
          className={`flex flex-col items-center justify-center h-full transition-colors active:scale-95 ${
            isShopActive
              ? "text-[var(--accent)] font-semibold"
              : "text-[#64748B] hover:text-[#14161A] font-medium"
          }`}
        >
          <Store className="w-[22px] h-[22px]" />
          <span className="text-[11px] mt-0.5 leading-none">Shop</span>
        </Link>

        {/* 3. Brands */}
        <button
          onClick={handleBrandsClick}
          type="button"
          className={`flex flex-col items-center justify-center h-full transition-colors active:scale-95 ${
            isBrandsActive
              ? "text-[var(--accent)] font-semibold"
              : "text-[#64748B] hover:text-[#14161A] font-medium"
          }`}
        >
          <Sparkles className="w-[22px] h-[22px]" />
          <span className="text-[11px] mt-0.5 leading-none">Brands</span>
        </button>

        {/* 4. Cart */}
        <button
          onClick={openCart}
          type="button"
          aria-label="View Cart"
          className="relative flex flex-col items-center justify-center h-full text-[#64748B] hover:text-[#14161A] font-medium transition-colors active:scale-95"
        >
          <div className="relative">
            <ShoppingCart className="w-[22px] h-[22px]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-bold text-white shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-0.5 leading-none">Cart</span>
        </button>

        {/* 5. WhatsApp */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Order on WhatsApp"
          className="flex flex-col items-center justify-center h-full text-[#64748B] hover:text-[#14161A] font-medium transition-colors active:scale-95"
        >
          <MessageCircle className="w-[22px] h-[22px] text-[#25D366]" />
          <span className="text-[11px] mt-0.5 leading-none">WhatsApp</span>
        </a>

      </div>
    </nav>
  );
}

