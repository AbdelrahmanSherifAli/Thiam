import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import type { ViewType } from "../context/StoreContext";
import { useCart } from "../context/CartContext";
import { useLanguage, LANGUAGES } from "../context/LanguageContext";
import { getCartItemPrice } from "../utils/price";
import { ShoppingBag, Heart, Search, Menu, X, Plus, Minus, Trash2, Settings, Globe } from "lucide-react";

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

  const { language, setLanguage, t } = useLanguage();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const activeLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

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

  const renderLanguageSwitcher = () => (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
        className="btn-icon"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 10px",
          width: "auto",
          height: "36px",
          borderRadius: "18px",
          fontSize: "12px",
          fontWeight: "600",
          backgroundColor: "rgba(0,0,0,0.03)",
          border: "1px solid var(--border-color)",
          cursor: "pointer"
        }}
        title="تغيير اللغة / Change Language"
      >
        <Globe size={15} />
        <span>{activeLang.flag} {activeLang.code.toUpperCase()}</span>
      </button>

      {isLangMenuOpen && (
        <div
          className="animate-fade-in"
          style={{
            position: "absolute",
            top: "100%",
            marginTop: "6px",
            insetInlineEnd: 0,
            backgroundColor: "#ffffff",
            border: "1px solid var(--border-color)",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
            padding: "6px",
            zIndex: 1000,
            minWidth: "140px",
            display: "flex",
            flexDirection: "column",
            gap: "2px"
          }}
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsLangMenuOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: language === lang.code ? "var(--accent-alpha-10, #f5efe6)" : "transparent",
                color: language === lang.code ? "var(--primary-color)" : "var(--text-color)",
                fontWeight: language === lang.code ? "700" : "500",
                fontSize: "13px",
                cursor: "pointer",
                textAlign: "start",
                width: "100%"
              }}
            >
              <span>{lang.flag}</span>
              <span>{lang.nativeName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

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
                {/* Logo */}
                <a href="#home" onClick={() => navigateTo("home")} className="logo-link" style={{ flex: "none", display: "flex", alignItems: "center", gap: "10px" }}>
                  {theme.logo ? (
                    <img src={theme.logo} alt={storeInfo.seo.title} className="logo-img" style={{ height: "45px" }} />
                  ) : (
                    <span style={{ fontSize: "24px", fontWeight: "700" }}>{storeInfo.seo.title.split("|")[0].trim()}</span>
                  )}
                </a>

                {/* Right side Actions */}
                <div className="nav-actions" style={{ flex: "none" }}>
                  {renderLanguageSwitcher()}

                  <button onClick={() => setIsSearchOpen(true)} className="btn-icon" title={t("nav_search")}>
                    <Search size={18} />
                  </button>
                  <button onClick={() => navigateTo("shop")} className="btn-icon action-btn-badge" title={t("nav_wishlist")}>
                    <Heart size={18} />
                    {wishlist.length > 0 && <span className="badge-count">{wishlist.length}</span>}
                  </button>
                  <button onClick={() => setIsCartOpen(true)} className="btn-icon action-btn-badge cart-nav-btn" style={{ borderColor: cartCount > 0 ? "var(--accent-color)" : "var(--border-color)" }} title={t("nav_cart")}>
                    <ShoppingBag size={18} />
                    {cartCount > 0 && <span className="badge-count" style={{ backgroundColor: "var(--accent-color)" }}>{cartCount}</span>}
                  </button>
                  <button onClick={() => navigateTo("admin")} className="btn-icon" style={{ backgroundColor: "var(--primary-color)", color: "#ffffff" }} title={t("nav_admin")}>
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
                    {t("nav_home")}
                  </a>
                </li>
                <li>
                  <a href="#shop" onClick={() => navigateTo("shop")} className={`nav-link ${currentView === "shop" ? "active" : ""}`}>
                    {t("nav_shop")}
                  </a>
                </li>
                <li>
                  <a href="#about" onClick={() => navigateTo("about")} className={`nav-link ${currentView === "about" ? "active" : ""}`}>
                    {t("nav_about")}
                  </a>
                </li>
                <li>
                  <a href="#contact" onClick={() => navigateTo("contact")} className={`nav-link ${currentView === "contact" ? "active" : ""}`}>
                    {t("nav_contact")}
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
                    {t("nav_home")}
                  </a>
                </li>
                <li>
                  <a href="#shop" onClick={() => navigateTo("shop")} className={`nav-link ${currentView === "shop" ? "active" : ""}`}>
                    {t("nav_shop")}
                  </a>
                </li>
                <li>
                  <a href="#about" onClick={() => navigateTo("about")} className={`nav-link ${currentView === "about" ? "active" : ""}`}>
                    {t("nav_about")}
                  </a>
                </li>
                <li>
                  <a href="#contact" onClick={() => navigateTo("contact")} className={`nav-link ${currentView === "contact" ? "active" : ""}`}>
                    {t("nav_contact")}
                  </a>
                </li>
              </ul>

              {/* Action Icons */}
              <div className="nav-actions" style={{ flex: layoutStyle === "modern" ? "0 0 auto" : "1" }}>
                {renderLanguageSwitcher()}

                <button onClick={() => setIsSearchOpen(true)} className="btn-icon" title={t("nav_search")}>
                  <Search size={18} />
                </button>

                <button onClick={() => navigateTo("shop")} className="btn-icon action-btn-badge" title={t("nav_wishlist")}>
                  <Heart size={18} />
                  {wishlist.length > 0 && <span className="badge-count">{wishlist.length}</span>}
                </button>

                <button onClick={() => setIsCartOpen(true)} className="btn-icon action-btn-badge cart-nav-btn" style={{ borderColor: cartCount > 0 ? "var(--accent-color)" : "var(--border-color)" }} title={t("nav_cart")}>
                  <ShoppingBag size={18} />
                  {cartCount > 0 && <span className="badge-count" style={{ backgroundColor: "var(--accent-color)" }}>{cartCount}</span>}
                </button>

                <button onClick={() => navigateTo("admin")} className="btn-icon" style={{ backgroundColor: "var(--primary-color)", color: "#ffffff" }} title={t("nav_admin")}>
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
          style={{ justifyContent: "flex-end", zIndex: 150 }}
        >
          <div
            className="cart-drawer"
            onClick={(e) => e.stopPropagation()}
            style={{ 
              animationName: "slideRight", 
              maxWidth: "300px",
              borderLeft: "none",
              borderRight: "1px solid var(--border-color)",
              borderRadius: "var(--border-radius) 0 0 var(--border-radius)"
            }}
          >
            <div className="drawer-header">
              <span className="drawer-title">{t("nav_menu")}</span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Mobile Language Switcher Selector */}
            <div style={{ marginTop: "15px", paddingBottom: "15px", borderBottom: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "12px", color: "var(--secondary-color)", display: "block", marginBottom: "8px", fontWeight: "600" }}>
                Language / اللغة:
              </span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-color)",
                      backgroundColor: language === lang.code ? "var(--primary-color)" : "#ffffff",
                      color: language === lang.code ? "#ffffff" : "var(--text-color)",
                      fontWeight: language === lang.code ? "700" : "500",
                      fontSize: "12px",
                      cursor: "pointer"
                    }}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                  </button>
                ))}
              </div>
            </div>

            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "20px", marginTop: "20px" }}>
              <li>
                <a
                  href="#home"
                  onClick={() => navigateTo("home")}
                  style={{ display: "block", fontSize: "16px", fontWeight: "600" }}
                >
                  {t("nav_home")}
                </a>
              </li>
              <li>
                <a
                  href="#shop"
                  onClick={() => navigateTo("shop")}
                  style={{ display: "block", fontSize: "16px", fontWeight: "600" }}
                >
                  {t("nav_shop")}
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  onClick={() => navigateTo("about")}
                  style={{ display: "block", fontSize: "16px", fontWeight: "600" }}
                >
                  {t("nav_about")}
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={() => navigateTo("contact")}
                  style={{ display: "block", fontSize: "16px", fontWeight: "600" }}
                >
                  {t("nav_contact")}
                </a>
              </li>
              <li>
                <a
                  href="#admin"
                  onClick={() => navigateTo("admin")}
                  style={{ display: "block", fontSize: "16px", fontWeight: "600", color: "var(--accent-color)" }}
                >
                  {t("nav_admin")}
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="cart-drawer-backdrop" onClick={() => setIsCartOpen(false)}>
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <span className="drawer-title">{t("cart_title")} ({cartCount})</span>
              <button onClick={() => setIsCartOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="drawer-items-list">
              {cart.length === 0 ? (
                <div className="flex-center" style={{ flexDirection: "column", height: "100%", gap: "12px", color: "var(--secondary-color)" }}>
                  <ShoppingBag size={48} strokeWidth={1} />
                  <span>{t("cart_empty")}</span>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigateTo("shop");
                    }}
                    className="btn btn-secondary"
                    style={{ fontSize: "12px", padding: "8px 16px", marginTop: "10px" }}
                  >
                    {t("cart_go_shop")}
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
                          title={t("cart_remove")}
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
                  <span>{t("cart_subtotal")}</span>
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
                    {t("cart_view_cart")}
                  </button>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigateTo("checkout");
                    }}
                    className="btn btn-primary"
                    style={{ width: "100%" }}
                  >
                    {t("cart_checkout")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Global Search Overlay Modal */}
      {isSearchOpen && (
        <div
          className="cart-drawer-backdrop flex-center animate-fade-in"
          onClick={() => setIsSearchOpen(false)}
          style={{ zIndex: 300, backgroundColor: "rgba(15, 23, 42, 0.75)", backdropFilter: "blur(6px)" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#ffffff",
              padding: "30px",
              borderRadius: "var(--border-radius)",
              width: "90%",
              maxWidth: "600px",
              boxShadow: "var(--shadow-lg)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700" }}>{t("nav_search")}</h3>
              <button onClick={() => setIsSearchOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                placeholder={t("shop_search_placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: "var(--border-radius)",
                  border: "1px solid var(--border-color)",
                  outline: "none",
                  fontSize: "14px"
                }}
                autoFocus
              />
              <button type="submit" className="btn btn-primary" style={{ padding: "0 24px" }}>
                <Search size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
