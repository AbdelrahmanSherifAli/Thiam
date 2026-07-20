import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { useCart } from "../context/CartContext";
import { ProductCard } from "../components/ProductCard";
import { Filter, RotateCcw, Heart, Search, X, SlidersHorizontal } from "lucide-react";

export const Shop: React.FC = () => {
  const {
    products,
    categories,
    searchQuery,
    setSearchQuery,
    activeCategorySlug,
    setActiveCategorySlug
  } = useStore();

  const { wishlist } = useCart();
  
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter products based on Category, Search Query, Price and Wishlist
  const filteredProducts = products.filter((prod) => {
    // 1. Category Filter
    if (activeCategorySlug) {
      const activeCat = categories.find((cat) => cat.slug === activeCategorySlug);
      if (activeCat && prod.categoryId !== activeCat.id) {
        return false;
      }
    }

    // 2. Search Query Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchName = prod.name.toLowerCase().includes(query);
      const matchDesc = prod.description.toLowerCase().includes(query);
      if (!matchName && !matchDesc) {
        return false;
      }
    }

    // 3. Wishlist Filter
    if (showWishlistOnly && !wishlist.includes(prod.id)) {
      return false;
    }

    // 4. Max Price Filter
    if (prod.price > maxPrice) {
      return false;
    }

    return true;
  });

  const handleResetFilters = () => {
    setActiveCategorySlug(null);
    setSearchQuery("");
    setShowWishlistOnly(false);
    setMaxPrice(2000);
    setIsMobileFilterOpen(false);
  };

  return (
    <div className="container section-padding">
      {/* Horizontal Category Chips Bar (Scrollable on Mobile & Desktop) */}
      <div className="category-pills-bar">
        <button
          onClick={() => setActiveCategorySlug(null)}
          className={`category-pill ${activeCategorySlug === null ? "active" : ""}`}
        >
          <span>جميع المنتجات</span>
          <span style={{ opacity: 0.8, fontSize: "11px", marginRight: "4px" }}>({products.length})</span>
        </button>
        {categories.map((cat) => {
          const count = products.filter((p) => p.categoryId === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategorySlug(cat.slug)}
              className={`category-pill ${activeCategorySlug === cat.slug ? "active" : ""}`}
            >
              <span>{cat.name}</span>
              <span style={{ opacity: 0.8, fontSize: "11px", marginRight: "4px" }}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* Mobile Filter Toggle Trigger Button */}
      <div className="mobile-filter-bar">
        <button
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          className="btn btn-secondary mobile-filter-toggle-btn"
        >
          <SlidersHorizontal size={16} />
          <span>تصفية وتصفح المنتجات</span>
          {(searchQuery || showWishlistOnly || maxPrice < 2000) && (
            <span className="filter-active-dot" />
          )}
        </button>
      </div>

      <div className="shop-page-wrapper">
        {/* Sidebar Filters (Desktop & Collapsible Mobile Drawer) */}
        <aside className={`shop-sidebar ${isMobileFilterOpen ? "mobile-open" : ""}`}>
          <div className="mobile-sidebar-header">
            <h3>خيارات التصفية</h3>
            <button onClick={() => setIsMobileFilterOpen(false)} className="close-mobile-filter">
              <X size={20} />
            </button>
          </div>

          {/* Search Widget */}
          <div className="sidebar-widget">
            <h3 className="widget-title">البحث</h3>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                type="text"
                placeholder="ابحث عن منتج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ paddingRight: "12px", paddingLeft: "40px", height: "42px" }}
              />
              <Search size={16} style={{ position: "absolute", left: "12px", color: "var(--secondary-color)" }} />
            </div>
          </div>

          {/* Categories Widget */}
          <div className="sidebar-widget desktop-only-widget">
            <h3 className="widget-title">الأقسام</h3>
            <ul className="category-list">
              <li className="category-item">
                <button
                  onClick={() => setActiveCategorySlug(null)}
                  className={`category-filter-btn ${activeCategorySlug === null ? "active" : ""}`}
                >
                  <span>جميع المنتجات</span>
                  <span>({products.length})</span>
                </button>
              </li>
              {categories.map((cat) => {
                const count = products.filter((p) => p.categoryId === cat.id).length;
                return (
                  <li key={cat.id} className="category-item">
                    <button
                      onClick={() => setActiveCategorySlug(cat.slug)}
                      className={`category-filter-btn ${activeCategorySlug === cat.slug ? "active" : ""}`}
                    >
                      <span>{cat.name}</span>
                      <span>({count})</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Price Filter Widget */}
          <div className="sidebar-widget">
            <h3 className="widget-title">السعر الأقصى</h3>
            <div style={{ marginTop: "10px" }}>
              <input
                type="range"
                min="50"
                max="2000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent-color)" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "600", marginTop: "6px" }}>
                <span>50 EGP</span>
                <span style={{ color: "var(--accent-color)" }}>{maxPrice} EGP</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Widget */}
          <div className="sidebar-widget" style={{ borderTop: "1px solid var(--border-color)", paddingTop: "20px" }}>
            <button
              onClick={() => setShowWishlistOnly(!showWishlistOnly)}
              className="btn btn-secondary"
              style={{
                width: "100%",
                padding: "8px 12px",
                fontSize: "12px",
                justifyContent: "flex-start",
                borderColor: showWishlistOnly ? "#ef4444" : "var(--primary-color)",
                color: showWishlistOnly ? "#ef4444" : "var(--primary-color)"
              }}
            >
              <Heart size={14} fill={showWishlistOnly ? "#ef4444" : "none"} style={{ marginLeft: "6px" }} />
              <span>{showWishlistOnly ? "عرض جميع المنتجات" : "عرض المفضلة فقط"}</span>
            </button>

            <button
              onClick={handleResetFilters}
              className="btn btn-secondary"
              style={{
                width: "100%",
                padding: "8px 12px",
                fontSize: "12px",
                marginTop: "10px",
                justifyContent: "flex-start",
                borderColor: "var(--border-color)"
              }}
            >
              <RotateCcw size={14} style={{ marginLeft: "6px" }} />
              <span>إعادة تعيين الفلاتر</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main style={{ minWidth: 0 }}>
          {/* Shop Header Bar */}
          <div className="shop-main-header">
            <div>
              <h2 style={{ fontSize: "22px", color: "var(--primary-color)", margin: 0 }}>
                {showWishlistOnly ? "قائمة مفضلاتي" : activeCategorySlug ? categories.find(c => c.slug === activeCategorySlug)?.name : "استكشف جميع المنتجات"}
              </h2>
              {searchQuery && (
                <p className="results-count" style={{ marginTop: "4px", margin: 0 }}>
                  البحث عن: "<strong>{searchQuery}</strong>"
                </p>
              )}
            </div>
            <div className="results-count">
              عرض {filteredProducts.length} نتائج
            </div>
          </div>

          {/* Products Catalog Display Grid */}
          {filteredProducts.length === 0 ? (
            <div
              className="flex-center"
              style={{
                flexDirection: "column",
                minHeight: "300px",
                gap: "16px",
                backgroundColor: "var(--card-bg)",
                borderRadius: "var(--border-radius)",
                border: "1px solid var(--border-color)",
                padding: "30px 20px"
              }}
            >
              <Filter size={40} strokeWidth={1} style={{ color: "var(--secondary-color)" }} />
              <h3 style={{ fontSize: "18px", margin: 0 }}>لم يتم العثور على منتجات</h3>
              <p style={{ color: "var(--secondary-color)", fontSize: "13px", textAlign: "center", maxWidth: "400px", margin: 0 }}>
                لم نتمكن من العثور على أي منتج يطابق خيارات الفرز المحددة. جرب إعادة تعيين الفلاتر أو تغيير كلمة البحث.
              </p>
              <button onClick={handleResetFilters} className="btn btn-primary" style={{ padding: "8px 20px" }}>
                مسح الفلاتر
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
