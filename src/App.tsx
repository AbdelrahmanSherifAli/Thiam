import React from "react";
import { StoreProvider, useStore } from "./context/StoreContext";
import { CartProvider } from "./context/CartContext";
import { ThemeInjector } from "./components/ThemeInjector";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

// Storefront Pages
import { Home } from "./pages/Home";
import { Shop } from "./pages/Shop";
import { ProductDetails } from "./pages/ProductDetails";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { LegalPage } from "./pages/LegalPage";

// Administration Dashboard
import { AdminDashboard } from "./pages/admin/AdminDashboard";

// Core styling import
import "./styles/store.css";

const MainAppContent: React.FC = () => {
  const { currentView, isLoading } = useStore();

  if (isLoading) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#faf9f6",
        color: "#0b0f19",
        fontFamily: "'Cairo', sans-serif",
        direction: "rtl"
      }}>
        <div style={{
          width: "50px",
          height: "50px",
          border: "3px solid #e2e8f0",
          borderTopColor: "#c5a880",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          marginBottom: "20px"
        }} />
        <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#0b0f19", margin: 0 }}>جاري تحميل المتجر...</h3>
        <p style={{ fontSize: "13px", color: "#64748b", marginTop: "8px", margin: 0 }}>نحن نقوم بجلب أحدث المنتجات والتصاميم</p>
        
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}} />
      </div>
    );
  }

  const renderActiveView = () => {
    switch (currentView) {
      case "home":
        return <Home />;
      case "shop":
        return <Shop />;
      case "product-details":
        return <ProductDetails />;
      case "cart":
        return <Cart />;
      case "checkout":
        return <Checkout />;
      case "about":
        return <About />;
      case "contact":
        return <Contact />;
      case "faq":
      case "privacy":
      case "terms":
        return <LegalPage />;
      case "admin":
        return <AdminDashboard />;
      default:
        return <Home />;
    }
  };

  // If we are in the admin dashboard panel, do not render storefront navbar/footers
  const isAdminView = currentView === "admin";

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Dynamically injects Google Fonts and theme variables */}
      <ThemeInjector />

      {!isAdminView && <Navbar />}
      
      <main style={{ flexGrow: 1 }}>
        {renderActiveView()}
      </main>

      {!isAdminView && <Footer />}
    </div>
  );
};

function App() {
  return (
    <StoreProvider>
      <CartProvider>
        <MainAppContent />
      </CartProvider>
    </StoreProvider>
  );
}

export default App;
