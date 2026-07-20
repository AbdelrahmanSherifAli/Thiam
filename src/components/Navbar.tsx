import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import type { ViewType } from "../context/StoreContext";
import { useCart } from "../context/CartContext";
import { getCartItemPrice } from "../utils/price";
import { ShoppingBag, Heart, Search, Menu, X, Plus, Minus, Trash2, Settings } from "lucide-react";

export const Navbar: React.FC = () => {
  const {
    theme,
    storeInfo,
    currentView,
    setCurrentView,
    searchQuery,
    setSearchQuery
  } = useStore();

  const {
    cart,
    wishlist,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount
  } = useCart();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigateTo = (view: ViewType) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchOpen(false);
    navigateTo("shop");
  };

  const layoutStyle = theme.layoutStyle || "luxury";

  return (
    <>
      {layoutStyle === "editorial" && theme.announcementEnabled !== false && (
        <div style={{
          backgroundColor: "var(--primary-color)",
          color: "#ffffff",
          textAlign: "center",
          padding: "6px 0",
          fontSize: "12px",
          fontWeight: "600",
          letterSpacing: "0.5px"
        }}>
          {theme.announcementText || "✨ شحن مجاني لجميع الطلبات فوق 500 جنيه بمناسبة الافتتاح! خصم 10% بكود: START ✨"}
        </div>
      )}
      <header className="navbar-header" style={{
        height: layoutStyle === "editorial" ? "auto" : "var(--header-height)",
        padding: layoutStyle === "editorial" ? "12px 0" : "0"
      }}>
        <div className="container navbar-container" style={{
          display: "flex",
          flexDirection: layoutStyle === "editorial" ? "column" : "row",
          alignItems: "center",
          gap: layoutStyle === "editorial" ? "12px" : "0",
          justifyContent: "space-between",
          height: "100%"
        }}>
          
          {layoutStyle === "editorial" ? (
            // --- EDITORIAL LAYOUT ---
            <>
              {/* Top Row: Actions (Left) | Logo (Center) | Icons & Mobile (Right) */}
              <div style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between" }}>
                {/* Logo (Center - Pushed right in RTL menu design) */}
                <a href="#home" onClick={() => navigateTo("home")} className="logo-link" style={{ flex: "none", display: "flex", alignItems: "center", gap: "10px" }}>
                  {theme.logo ? (
                    <img src={theme.logo} alt={storeInfo.seo.title} className="logo-img" style={{ height: "45px" }} />
                  ) : (
                    <span style={{ fontSize: "24px", fontWeight: "700" }}>{storeInfo.seo.title.split("|")[0].trim()}</span>
                  )}
                </a>

                {/* Right side Actions */}
                <div className="nav-actions" style={{ flex: "none" }}>
                  <button onClick={() => setIsSearchOpen(true)} className="btn-icon">
                    <Search size={18} />
                  </button>
                  <button onClick={() => navigateTo("shop")} className="btn-icon action-btn-badge">
                    <Heart size={18} />
                    {wishlist.length > 0 && <span className="badge-count">{wishlist.length}</span>}
                  </button>
                  <button onClick={() => setIsCartOpen(true)} className="btn-icon action-btn-badge cart-nav-btn" style={{ borderColor: cartCount > 0 ? "var(--accent-color)" : "var(--border-color)" }}>
                    <ShoppingBag size={18} />
                    {cartCount > 0 && <span className="badge-count" style={{ backgroundColor: "var(--accent-color)" }}>{cartCount}</span>}
                  </button>
                  <button onClick={() => navigateTo("admin")} className="btn-icon" style={{ backgroundColor: "var(--primary-color)", color: "#ffffff" }}>
                    <Settings size={18} />
                  </button>
                  <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="btn-icon mobile-menu-btn">
                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                  </button>
                </div>
              </div>

              {/* Bottom Row: Centered Navigation Menu */}
              <ul className="nav-menu" style={{ 
                gap: "40px", 
                margin: "10px 0 0 0", 
                borderTop: "1px solid var(--border-color)", 
                width: "100%", 
                justifyContent: "center", 
                paddingTop: "12px",
                listStyle: "none"
              }}>
                <li>
                  <a href="#home" onClick={() => navigateTo("home")} className={`nav-link ${currentView === "home" ? "active" : ""}`}>
                    الرئيسية
                  </a>
                </li>
                <li>
                  <a href="#shop" onClick={() => navigateTo("shop")} className={`nav-link ${currentView === "shop" ? "active" : ""}`}>
                    المتجر
                  </a>
                </li>
                <li>
                  <a href="#about" onClick={() => navigateTo("about")} className={`nav-link ${currentView === "about" ? "active" : ""}`}>
                    قصتنا
                  </a>
                </li>
                <li>
                  <a href="#contact" onClick={() => navigateTo("contact")} className={`nav-link ${currentView === "contact" ? "active" : ""}`}>
                    اتصل بنا
                  </a>
                </li>
              </ul>
            </>
          ) : (
            // --- CLASSIC LUXURY & MODERN FASHION LAYOUTS ---
            <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              {/* Logo Link */}
              <a 
                href="#home" 
                onClick={() => navigateTo("home")} 
                className="logo-link" 
                style={{ 
                  flex: layoutStyle === "modern" ? "0 0 auto" : "1",
                  marginLeft: layoutStyle === "modern" ? "40px" : "0" 
                }}
              >
                {theme.logo ? (
                  <img src={theme.logo} alt={storeInfo.seo.title} className="logo-img" />
                ) : (
                  <span>{storeInfo.seo.title.split("|")[0].trim()}</span>
                )}
              </a>

              {/* Navigation Links */}
              <ul 
                className="nav-menu animate-fade-in" 
                style={{ 
                  flex: layoutStyle === "modern" ? "1" : "0 0 auto",
                  justifyContent: layoutStyle === "modern" ? "flex-start" : "center",
                  gap: layoutStyle === "modern" ? "40px" : "32px",
                  listStyle: "none"
                }}
              >
                <li>
                  <a href="#home" onClick={() => navigateTo("home")} className={`nav-link ${currentView === "home" ? "active" : ""}`}>
                    الرئيسية
                  </a>
                </li>
                <li>
                  <a href="#shop" onClick={() => navigateTo("shop")} className={`nav-link ${currentView === "shop" ? "active" : ""}`}>
                    المتجر
                  </a>
                </li>
                <li>
                  <a href="#about" onClick={() => navigateTo("about")} className={`nav-link ${currentView === "about" ? "active" : ""}`}>
                    قصتنا
                  </a>
                </li>
                <li>
                  <a href="#contact" onClick={() => navigateTo("contact")} className={`nav-link ${currentView === "contact" ? "active" : ""}`}>
                    اتصل بنا
                  </a>
                </li>
              </ul>

              {/* Action Icons */}
              <div className="nav-actions" style={{ flex: layoutStyle === "modern" ? "0 0 auto" : "1" }}>
                <button onClick={() => setIsSearchOpen(true)} className="btn-icon">
                  <Search size={18} />
                </button>

                <button onClick={() => navigateTo("shop")} className="btn-icon action-btn-badge">
                  <Heart size={18} />
                  {wishlist.length > 0 && <span className="badge-count">{wishlist.length}</span>}
                </button>

                <button onClick={() => setIsCartOpen(true)} className="btn-icon action-btn-badge cart-nav-btn" style={{ borderColor: cartCount > 0 ? "var(--accent-color)" : "var(--border-color)" }}>
                  <ShoppingBag size={18} />
                  {cartCount > 0 && <span className="badge-count" style={{ backgroundColor: "var(--accent-color)" }}>{cartCount}</span>}
                </button>

                <button onClick={() => navigateTo("admin")} className="btn-icon" style={{ backgroundColor: "var(--primary-color)", color: "#ffffff" }}>
                  <Settings size={18} />
                </button>

                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="btn-icon mobile-menu-btn">
                  {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>
          )}

        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div
          className="cart-drawer-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ justifyContent: "flex-start", zIndex: 150 }}
        >
          <div
            className="cart-drawer"
            onClick={(e) => e.stopPropagation()}
            style={{ animationName: "slideLeft", maxWidth: "300px" }}
          >
            <div className="drawer-header">
              <span className="drawer-title">قائمة التنقل</span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "20px", marginTop: "20px" }}>
              <li>
                <a
                  href="#home"
                  onClick={() => navigateTo("home")}
                  style={{ display: "block", fontSize: "16px", fontWeight: "600" }}
                >
                  الرئيسية
                </a>
              </li>
              <li>
                <a
                  href="#shop"
                  onClick={() => navigateTo("shop")}
                  style={{ display: "block", fontSize: "16px", fontWeight: "600" }}
                >
                  المتجر
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  onClick={() => navigateTo("about")}
                  style={{ display: "block", fontSize: "16px", fontWeight: "600" }}
                >
                  قصتنا
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={() => navigateTo("contact")}
                  style={{ display: "block", fontSize: "16px", fontWeight: "600" }}
                >
                  اتصل بنا
                </a>
              </li>
              
              <li style={{ borderTop: "1px solid var(--border-color)", margin: "10px 0" }}></li>
              
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsSearchOpen(true);
                  }}
                  style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", fontWeight: "600", color: "var(--primary-color)", background: "none", border: "none", padding: 0, cursor: "pointer", width: "100%", textAlign: "right" }}
                >
                  <Search size={18} style={{ color: "var(--accent-color)" }} />
                  <span>البحث في المتجر</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigateTo("shop");
                  }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "15px", fontWeight: "600", color: "var(--primary-color)", background: "none", border: "none", padding: 0, cursor: "pointer", width: "100%", textAlign: "right" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Heart size={18} style={{ color: "var(--accent-color)" }} />
                    <span>قائمة المفضلة</span>
                  </div>
                  {wishlist.length > 0 && (
                    <span style={{ backgroundColor: "var(--primary-color)", color: "var(--bg-color)", fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "10px", marginRight: "auto" }}>
                      {wishlist.length}
                    </span>
                  )}
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigateTo("admin");
                  }}
                  style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", fontWeight: "600", color: "var(--primary-color)", background: "none", border: "none", padding: 0, cursor: "pointer", width: "100%", textAlign: "right" }}
                >
                  <Settings size={18} style={{ color: "var(--accent-color)" }} />
                  <span>لوحة التحكم (الإدارة)</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Global Search Modal Overlay */}
      {isSearchOpen && (
        <div className="search-modal-backdrop" onClick={() => setIsSearchOpen(false)}>
          <div className="search-modal" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSearchSubmit} className="search-input-wrapper">
              <input
                type="text"
                placeholder="ابحث عن المنتجات بالاسم أو الوصف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-box-input"
                autoFocus
              />
              <button type="submit" className="btn btn-primary" style={{ padding: "8px 20px" }}>
                بحث
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setIsSearchOpen(false);
                }}
                style={{ marginRight: "12px", marginLeft: "12px", color: "var(--secondary-color)" }}
              >
                <X size={20} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Cart Drawer Slide-out Panel */}
      {isCartOpen && (
        <div className="cart-drawer-backdrop" onClick={() => setIsCartOpen(false)}>
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <span className="drawer-title">سلة المشتريات ({cartCount})</span>
              <button onClick={() => setIsCartOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="drawer-items-list">
              {cart.length === 0 ? (
                <div className="flex-center" style={{ flexDirection: "column", height: "100%", gap: "12px", color: "var(--secondary-color)" }}>
                  <ShoppingBag size={48} strokeWidth={1} />
                  <span>سلة مشترياتك فارغة تماماً.</span>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigateTo("shop");
                    }}
                    className="btn btn-secondary"
                    style={{ fontSize: "12px", padding: "8px 16px", marginTop: "10px" }}
                  >
                    اذهب للمتجر
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.uniqueKey} className="drawer-item">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="drawer-item-img"
                    />
                    <div className="drawer-item-details">
                      <h4 className="drawer-item-name">{item.product.name}</h4>
                      
                      {/* Serialized attributes badges */}
                      {Object.entries(item.selectedAttributes).length > 0 && (
                        <div className="drawer-item-meta">
                          {Object.entries(item.selectedAttributes).map(([k, v]) => (
                            <span key={k} style={{ marginRight: "10px", display: "inline-block" }}>
                              <strong>{k}:</strong> {v}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="drawer-item-price">
                        {(getCartItemPrice(item) * item.quantity).toFixed(2)} EGP
                      </div>

                      <div className="drawer-item-actions">
                        <div className="drawer-qty">
                          <button
                            onClick={() => updateQuantity(item.uniqueKey, item.quantity - 1)}
                            className="drawer-qty-btn"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="drawer-qty-val">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.uniqueKey, item.quantity + 1)}
                            className="drawer-qty-btn"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.uniqueKey)}
                          className="drawer-item-remove"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="drawer-footer animate-fade-in">
                 <div className="drawer-subtotal">
                   <span>المجموع الفرعي:</span>
                   <span>{cartTotal.toFixed(2)} EGP</span>
                 </div>
                <div className="drawer-buttons">
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigateTo("cart");
                    }}
                    className="btn btn-secondary"
                    style={{ width: "100%" }}
                  >
                    عرض سلة المشتريات
                  </button>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigateTo("checkout");
                    }}
                    className="btn btn-primary"
                    style={{ width: "100%" }}
                  >
                    إتمام الطلب
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
