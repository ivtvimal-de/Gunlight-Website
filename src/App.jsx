import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import { CartProvider } from "./context/CartContext";
import { CatalogProvider } from "./context/CatalogContext";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

import CartDrawer from "./components/CartDrawer";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/admin/ProtectedRoute";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Brands from "./pages/Brands";
import EagleDetails from "./pages/EagleDetails";
import EverestDetails from "./pages/EverestDetails";
import TigerDetails from "./pages/TigerDetails";
import SniperDetails from "./pages/SniperDetails";
import ProductDetailsDynamic from "./pages/ProductDetailsDynamic";
import About from "./pages/About";
import Contact from "./pages/Contact";
import DataProtection from "./pages/DataProtection";
import ShippingPolicy from "./pages/ShippingPolicy";
import ReturnRefundPolicy from "./pages/ReturnRefundPolicy";
import TermsConditions from "./pages/TermsConditions";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminBrands from "./pages/admin/AdminBrands";
<<<<<<< HEAD
=======
import AdminVideos from "./pages/admin/AdminVideos";
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)

function AppRoutesShell() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute>
              <AdminProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute>
              <AdminCategories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/brands"
          element={
            <ProtectedRoute>
              <AdminBrands />
            </ProtectedRoute>
          }
        />
<<<<<<< HEAD
=======
        <Route
          path="/admin/videos"
          element={
            <ProtectedRoute>
              <AdminVideos />
            </ProtectedRoute>
          }
        />
>>>>>>> 526e98c (Update GunLite store, video management, 1 MB image limit, and gallery video viewer)
      </Routes>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />
        <CartDrawer />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/eagle" element={<EagleDetails />} />
          <Route path="/everest" element={<EverestDetails />} />
          <Route path="/tiger" element={<TigerDetails />} />
          <Route path="/sniper" element={<SniperDetails />} />
          <Route path="/product/:slug" element={<ProductDetailsDynamic />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Legal / Policy Routes */}
          <Route path="/privacy" element={<DataProtection />} />
          <Route path="/shipping" element={<ShippingPolicy />} />
          <Route path="/returns" element={<ReturnRefundPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CatalogProvider>
          <CartProvider>
            <Router>
              <AppRoutesShell />
            </Router>
          </CartProvider>
        </CatalogProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
