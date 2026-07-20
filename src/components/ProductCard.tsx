import React from "react";
import type { Product } from "../services/storageService";
import { useStore } from "../context/StoreContext";
import { useCart } from "../context/CartContext";
import { Star, Heart, Eye, Video } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setCurrentView, setSelectedProductId, theme } = useStore();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const handleCardClick = () => {
    setSelectedProductId(product.id);
    setCurrentView("product-details", product.id);
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const handleCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (product.isSoldOut) {
      handleCardClick();
      return;
    }

    // If product has attributes (options), redirect to details view to choose variant.
    if (product.attributes && product.attributes.length > 0) {
      handleCardClick();
    } else {
      addToCart(product, 1, {});
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const inWishlist = isInWishlist(product.id);
  const layoutStyle = theme.layoutStyle || "luxury";

  // --- 1. MODERN FASHION CARD (Theme 2) ---
  if (layoutStyle === "modern") {
    return (
      <div 
        className="product-card animate-fade-in" 
        onClick={handleCardClick} 
        style={{ 
          cursor: "pointer",
          borderRadius: "var(--border-radius)",
          overflow: "hidden",
          border: "none",
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          position: "relative",
          opacity: product.isSoldOut ? 0.9 : 1
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-6px)";
          e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.05)";
        }}
      >
        {/* Product Image and badges */}
        <div className="product-img-wrapper" style={{ overflow: "hidden", position: "relative" }}>
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="product-card-img" 
            style={{ 
              transition: "transform 0.5s ease",
              filter: product.isSoldOut ? "grayscale(35%)" : "none"
            }} 
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.08)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          />
          
          {/* Badges */}
          <div className="card-badges" style={{ position: "absolute", top: "12px", right: "12px", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px", zIndex: 2 }}>
            {product.isSoldOut && (
              <span className="badge" style={{ backgroundColor: "#ef4444", color: "#ffffff", borderRadius: "100px", padding: "4px 10px", fontSize: "11px", fontWeight: "700", width: "fit-content" }}>نفذت الكمية</span>
            )}
            {hasDiscount && !product.isSoldOut && (
              <span className="badge" style={{ backgroundColor: "var(--accent-color)", color: "#ffffff", borderRadius: "100px", padding: "4px 10px", fontSize: "11px", fontWeight: "700", width: "fit-content" }}>خصم {discountPercent}%</span>
            )}
            {product.featured && (
              <span className="badge" style={{ backgroundColor: "var(--primary-color)", color: "#ffffff", borderRadius: "100px", padding: "4px 10px", fontSize: "11px", fontWeight: "700", width: "fit-content" }}>مميز</span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistClick}
            className={`wishlist-card-btn ${inWishlist ? "active" : ""}`}
            style={{ 
              position: "absolute", 
              top: "12px", 
              left: "12px", 
              backgroundColor: inWishlist ? "var(--accent-color)" : "rgba(255,255,255,0.9)",
              color: inWishlist ? "#ffffff" : "var(--primary-color)",
              zIndex: 2
            }}
          >
            <Heart size={16} fill={inWishlist ? "#ffffff" : "none"} />
          </button>
        </div>

        {/* Info details */}
        <div className="product-card-info" style={{ padding: "20px" }}>
          <span style={{ fontSize: "11px", color: "var(--secondary-color)", textTransform: "uppercase", fontWeight: "700", letterSpacing: "1px" }}>أزياء وملابس</span>
          <h3 className="product-card-title" style={{ fontSize: "16px", fontWeight: "700", marginTop: "4px", color: "var(--primary-color)" }}>{product.name}</h3>

          <div className="product-card-rating" style={{ margin: "8px 0" }}>
            <Star size={13} fill="#fbbf24" stroke="#fbbf24" />
            <span style={{ fontWeight: "700", marginRight: "4px" }}>{product.rating.toFixed(1)}</span>
            <span className="rating-count">({product.reviewsCount})</span>
          </div>

          {/* Card Footer */}
          <div className="product-card-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "15px" }}>
            <div className="product-card-price" style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "17px", fontWeight: "800", color: "var(--primary-color)" }}>{product.price.toFixed(2)} EGP</span>
              {hasDiscount && (
                <span className="original-price" style={{ textDecoration: "line-through", color: "#94a3b8", fontSize: "13px" }}>{product.originalPrice?.toFixed(2)} EGP</span>
              )}
            </div>

            <button
              onClick={handleCartClick}
              className="quick-add-btn"
              disabled={product.isSoldOut}
              style={{
                backgroundColor: product.isSoldOut ? "#cbd5e1" : "var(--accent-color)",
                color: "#ffffff",
                borderRadius: product.isSoldOut ? "20px" : "50%",
                width: product.isSoldOut ? "auto" : "40px",
                padding: product.isSoldOut ? "0 12px" : "0",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                boxShadow: product.isSoldOut ? "none" : "0 4px 10px rgba(236,72,153,0.2)",
                cursor: product.isSoldOut ? "not-allowed" : "pointer"
              }}
            >
              {product.isSoldOut ? (
                <span style={{ fontSize: "11px", fontWeight: "700" }}>غير متوفر</span>
              ) : product.attributes && product.attributes.length > 0 ? (
                <Eye size={16} />
              ) : (
                <span style={{ fontSize: "20px", fontWeight: "600" }}>+</span>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. EDITORIAL MINIMALIST CARD (Theme 3) ---
  if (layoutStyle === "editorial") {
    return (
      <div 
        className="product-card animate-fade-in" 
        onClick={handleCardClick} 
        style={{ 
          cursor: "pointer",
          borderRadius: "var(--border-radius)",
          backgroundColor: "transparent",
          border: "1px solid var(--border-color)",
          boxShadow: "none",
          transition: "border-color 0.3s ease",
          opacity: product.isSoldOut ? 0.85 : 1
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--primary-color)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border-color)";
        }}
      >
        {/* Product Image and badges */}
        <div className="product-img-wrapper" style={{ position: "relative", backgroundColor: "#f8fafc", padding: "15px" }}>
          <img src={product.images[0]} alt={product.name} className="product-card-img" style={{ height: "240px", objectFit: "contain", mixBlendMode: "multiply", filter: product.isSoldOut ? "grayscale(40%)" : "none" }} />
          
          {product.isSoldOut && (
            <span className="badge" style={{ position: "absolute", top: "15px", right: "15px", backgroundColor: "#ef4444", color: "#ffffff", borderRadius: "4px", padding: "4px 8px", fontSize: "10px", fontWeight: "700" }}>نفذت الكمية</span>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistClick}
            className={`wishlist-card-btn ${inWishlist ? "active" : ""}`}
            style={{ top: "15px", left: "15px", backgroundColor: "#ffffff" }}
          >
            <Heart size={16} fill={inWishlist ? "var(--primary-color)" : "none"} stroke="var(--primary-color)" />
          </button>
        </div>

        {/* Info details */}
        <div className="product-card-info" style={{ padding: "15px", textAlign: "center", borderTop: "1px solid var(--border-color)" }}>
          <h3 className="product-card-title" style={{ fontSize: "15px", fontWeight: "600", fontFamily: "var(--font-heading)" }}>{product.name}</h3>

          <div style={{ display: "flex", justifyContent: "center", gap: "2px", margin: "6px 0" }}>
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={11} 
                fill={i < Math.round(product.rating) ? "var(--primary-color)" : "none"} 
                stroke="var(--primary-color)" 
              />
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginTop: "10px" }}>
            <span style={{ fontSize: "15px", fontWeight: "700" }}>{product.price.toFixed(2)} EGP</span>
            {hasDiscount && (
              <span style={{ textDecoration: "line-through", color: "var(--secondary-color)", fontSize: "12px" }}>{product.originalPrice?.toFixed(2)} EGP</span>
            )}
          </div>

          <button
            onClick={handleCartClick}
            disabled={product.isSoldOut}
            style={{
              width: "100%",
              marginTop: "12px",
              padding: "8px 0",
              backgroundColor: product.isSoldOut ? "#f1f5f9" : "transparent",
              border: product.isSoldOut ? "1px solid #cbd5e1" : "1px solid var(--primary-color)",
              color: product.isSoldOut ? "#94a3b8" : "var(--primary-color)",
              fontSize: "12px",
              fontWeight: "600",
              cursor: product.isSoldOut ? "not-allowed" : "pointer",
              borderRadius: "var(--border-radius)",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              if (!product.isSoldOut) {
                e.currentTarget.style.backgroundColor = "var(--primary-color)";
                e.currentTarget.style.color = "#ffffff";
              }
            }}
            onMouseLeave={(e) => {
              if (!product.isSoldOut) {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--primary-color)";
              }
            }}
          >
            {product.isSoldOut ? "نفذت الكمية" : (product.attributes && product.attributes.length > 0 ? "عرض الخيارات" : "إضافة للسلة")}
          </button>
        </div>
      </div>
    );
  }

  // --- 3. CLASSIC LUXURY CARD (Theme 1 - Default) ---
  return (
    <div className="product-card animate-fade-in" onClick={handleCardClick} style={{ cursor: "pointer", opacity: product.isSoldOut ? 0.9 : 1 }}>
      {/* Product Image and badges */}
      <div className="product-img-wrapper">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="product-card-img" 
          style={{ filter: product.isSoldOut ? "grayscale(35%)" : "none" }} 
        />
        
        {/* Badges */}
        <div className="card-badges">
          {product.videoUrl && (
            <span className="badge" style={{ backgroundColor: "#0f172a", color: "#ffffff", display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <Video size={10} /> فيديو
            </span>
          )}
          {product.isSoldOut && (
            <span className="badge" style={{ backgroundColor: "#ef4444", color: "#ffffff" }}>نفذت الكمية</span>
          )}
          {hasDiscount && !product.isSoldOut && (
            <span className="badge badge-accent">خصم {discountPercent}%</span>
          )}
          {product.featured && (
            <span className="badge badge-primary">مميز</span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`wishlist-card-btn ${inWishlist ? "active" : ""}`}
          title={inWishlist ? "حذف من المفضلة" : "إضافة للمفضلة"}
        >
          <Heart size={16} fill={inWishlist ? "#ffffff" : "none"} />
        </button>
      </div>

      {/* Info details */}
      <div className="product-card-info">
        <h3 className="product-card-title">{product.name}</h3>

        <div className="product-card-rating">
          <Star size={13} fill="#fbbf24" stroke="#fbbf24" />
          <span>{product.rating.toFixed(1)}</span>
          <span className="rating-count">({product.reviewsCount})</span>
        </div>

        <p
          className="product-card-desc"
          style={{
            fontSize: "13px",
            color: "var(--secondary-color)",
            marginBottom: "16px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}
        >
          {product.description}
        </p>

        {/* Card Footer */}
        <div className="product-card-footer">
          <div className="product-card-price">
            <span>{product.price.toFixed(2)} EGP</span>
            {hasDiscount && (
              <span className="original-price">{product.originalPrice?.toFixed(2)} EGP</span>
            )}
          </div>

          <button
            onClick={handleCartClick}
            className="quick-add-btn"
            disabled={product.isSoldOut}
            style={{
              backgroundColor: product.isSoldOut ? "#e2e8f0" : undefined,
              color: product.isSoldOut ? "#64748b" : undefined,
              borderRadius: product.isSoldOut ? "20px" : undefined,
              width: product.isSoldOut ? "auto" : undefined,
              height: product.isSoldOut ? "30px" : undefined,
              padding: product.isSoldOut ? "0 10px" : undefined,
              cursor: product.isSoldOut ? "not-allowed" : "pointer",
              boxShadow: "none"
            }}
            title={product.isSoldOut ? "غير متوفر" : (product.attributes && product.attributes.length > 0 ? "اختر الخيارات" : "إضافة للسلة")}
          >
            {product.isSoldOut ? (
              <span style={{ fontSize: "11px", fontWeight: "700", whiteSpace: "nowrap" }}>غير متوفر</span>
            ) : product.attributes && product.attributes.length > 0 ? (
              <Eye size={16} />
            ) : (
              <span style={{ fontSize: "18px", lineHeight: "1", fontWeight: "600" }}>+</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
