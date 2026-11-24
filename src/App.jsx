import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { CartProvider } from "./context/CartContext";

import CartDrawer from "./components/CartDrawer";
import Navbar from "./components/Navbar";
import BottomTabBar from "./components/BottomTabBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Brands from "./pages/Brands";
import EagleDetails from "./pages/EagleDetails";
import EverestDetails from "./pages/EverestDetails";
import TigerDetails from "./pages/TigerDetails";
import SniperDetails from "./pages/SniperDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import DataProtection from "./pages/DataProtection";
import ShippingPolicy from "./pages/ShippingPolicy";
import ReturnRefundPolicy from "./pages/ReturnRefundPolicy";
import TermsConditions from "./pages/TermsConditions";

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen flex flex-col justify-between pb-[calc(60px+env(safe-area-inset-bottom))] md:pb-0">
          <div>
            <Navbar />
            <CartDrawer />

            <Routes>
              <Route path="/"        element={<Home />} />
              <Route path="/shop"    element={<Shop />} />
              <Route path="/brands"  element={<Brands />} />
              <Route path="/eagle"   element={<EagleDetails />} />
              <Route path="/everest" element={<EverestDetails />} />
              <Route path="/tiger"   element={<TigerDetails />} />
              <Route path="/sniper"  element={<SniperDetails />} />
              <Route path="/about"   element={<About />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Legal / Policy Routes */}
              <Route path="/privacy"  element={<DataProtection />} />
              <Route path="/shipping" element={<ShippingPolicy />} />
              <Route path="/returns"  element={<ReturnRefundPolicy />} />
              <Route path="/terms"    element={<TermsConditions />} />
            </Routes>
          </div>

          <Footer />
        </div>

        {/* Sticky Mobile Bottom Tab Bar (60px high, white, 1px top border) */}
        <BottomTabBar />
      </Router>
    </CartProvider>
  );
}

export default App;
