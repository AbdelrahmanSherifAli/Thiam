import React, { useState, useEffect } from "react";
import { useStore } from "../context/StoreContext";
import { useCart } from "../context/CartContext";
import { Star, Heart, ShoppingCart, ArrowLeft } from "lucide-react";
import { getAdjustedPrice } from "../utils/price";

export const ProductDetails: React.FC = () => {
  const { selectedProductId, products, categories, setCurrentView, setActiveCategorySlug } = useStore();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const product = products.find((p) => p.id === selectedProductId);

  // Fallback safe values for product fields
  const prodImages = product && Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ["https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80"];
  
  const prodAttributes = product && Array.isArray(product.attributes) ? product.attributes : [];
  const prodRating = product && typeof product.rating === "number" && !isNaN(product.rating) ? product.rating : 5;
  const prodReviewsCount = product && typeof product.reviewsCount === "number" ? product.reviewsCount : 0;
  const prodPrice = product && typeof product.price === "number" ? product.price : 0;

  // Active image displaying in gallery
  const [activeImage, setActiveImage] = useState<string>("");
  
  // Selected variant state
  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>({});
  
  // Order quantity
  const [quantity, setQuantity] = useState<number>(1);
  
  // Submission message notification
  const [notification, setNotification] = useState<string | null>(null);

  // Seed default selections when product loads
  useEffect(() => {
    if (product) {
      setActiveImage(prodImages[0]);
      setQuantity(1);
      
      const defaults: Record<string, string> = {};
      prodAttributes.forEach((attr) => {
        if (attr && attr.name && Array.isArray(attr.options) && attr.options.length > 0) {
          defaults[attr.name] = attr.options[0];
        }
      });
      setSelectedAttrs(defaults);
    }
  }, [selectedProductId, product]);

  if (!product) {
    return (
      <div className="container section-padding flex-center" style={{ flexDirection: "column", gap: "20px" }}>
        <h3 style={{ fontSize: "18px", color: "var(--primary-color)" }}>المنتج غير موجود</h3>
        <button onClick={() => setCurrentView("shop")} className="btn btn-primary">
          العودة لكتالوج المنتجات
        </button>
      </div>
    );
  }

  const category = categories.find((c) => c.id === product.categoryId);

  const handleAttrClick = (name: string, val: string) => {
    setSelectedAttrs((prev) => ({
      ...prev,
      [name]: val
    }));
  };

  const handleAddToCart = () => {
    if (product.isSoldOut) return;
    // Verify all attributes are selected
    const missing = prodAttributes.filter((attr) => attr.name && !selectedAttrs[attr.name]);
    if (missing.length > 0) {
      alert(`يرجى اختيار الخيارات لـ: ${missing.map((m) => m.name).join(", ")}`);
      return;
    }

    addToCart(product, quantity, selectedAttrs);
    setNotification("✓ تم إضافة المنتج إلى السلة بنجاح!");
    setTimeout(() => setNotification(null), 4000);
  };

  const navigateToCategory = () => {
    if (category) {
      setActiveCategorySlug(category.slug);
      setCurrentView("shop");
    }
  };

  const inWishlist = isInWishlist(product.id);
  const starsCount = Math.max(1, Math.min(5, Math.round(prodRating)));

  return (
    <div className="container section-padding">
      {/* Back link */}
      <button
        onClick={() => setCurrentView("shop")}
        className="flex-center"
        style={{ gap: "6px", color: "var(--secondary-color)", fontSize: "14px", marginBottom: "30px", background: "none", border: "none", cursor: "pointer" }}
      >
        <ArrowLeft size={16} style={{ marginLeft: "6px" }} />
        <span>العودة للمتجر</span>
      </button>

      {/* Main Details Wrapper */}
      <div className="details-wrapper">
        {/* Left Column: Gallery */}
        <div className="gallery-container">
          <div className="gallery-main">
            <img src={activeImage || prodImages[0]} alt={product.name || "منتج"} className="gallery-main-img" />
          </div>
          {prodImages.length > 1 && (
            <div className="gallery-thumbs">
              {prodImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`gallery-thumb ${activeImage === img ? "active" : ""}`}
                >
                  <img src={img} alt={`${product.name} preview ${idx}`} className="gallery-thumb-img" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Info Details */}
        <div className="details-info">
          {category && (
            <button
              onClick={navigateToCategory}
              className="product-card-category"
              style={{ alignSelf: "flex-start", marginBottom: "10px" }}
            >
              {category.name}
            </button>
          )}

          <h1 className="details-title">{product.name}</h1>

          {product.isSoldOut && (
            <div style={{
              backgroundColor: "#fee2e2",
              color: "#991b1b",
              border: "1px solid #fca5a5",
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: "700",
              display: "inline-flex",
              alignItems: "center",
              width: "fit-content",
              marginBottom: "15px"
            }}>
              <span>غير متوفر حالياً (نفذت الكمية)</span>
            </div>
          )}

          {/* Rating */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#fbbf24", marginBottom: "20px" }}>
            <div style={{ display: "flex", gap: "2px" }}>
              {Array.from({ length: starsCount }).map((_, i) => (
                <Star key={i} size={15} fill="#fbbf24" stroke="#fbbf24" />
              ))}
            </div>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-color)" }}>
              {prodRating.toFixed(1)}
            </span>
            <span style={{ fontSize: "13px", color: "var(--secondary-color)" }}>
              ({prodReviewsCount} تقييمات العملاء)
            </span>
          </div>

          {/* Price */}
          <div className="details-price">
            <span>{getAdjustedPrice(product, selectedAttrs).toFixed(2)} EGP</span>
            {product.originalPrice && product.originalPrice > prodPrice && (
              <span className="original-price" style={{ fontSize: "20px" }}>
                {(product.originalPrice + (getAdjustedPrice(product, selectedAttrs) - prodPrice)).toFixed(2)} EGP
              </span>
            )}
          </div>

          {/* Long Description */}
          <p className="details-desc">{product.description || "لا يوجد وصف متوفر لهذا المنتج حالياً."}</p>

          {/* Dynamic Attributes Selector */}
          {prodAttributes.map((attr) => (
            <div key={attr.name || Math.random()} className="attribute-selector">
              <span className="attribute-label">اختر {attr.name}:</span>
              <div className="attribute-options">
                {Array.isArray(attr.options) && attr.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleAttrClick(attr.name, opt)}
                    className={`attr-btn ${selectedAttrs[attr.name] === opt ? "selected" : ""}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity and Actions */}
          <div className="quantity-add-wrapper">
            <div className="quantity-selector" style={{ opacity: product.isSoldOut ? 0.5 : 1, pointerEvents: product.isSoldOut ? "none" : "auto" }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="qty-btn"
                disabled={product.isSoldOut}
              >
                -
              </button>
              <span className="qty-val">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="qty-btn"
                disabled={product.isSoldOut}
              >
                +
              </button>
            </div>

            <button 
              onClick={handleAddToCart} 
              className="btn btn-primary add-cart-btn"
              disabled={product.isSoldOut}
              style={{
                backgroundColor: product.isSoldOut ? "#94a3b8" : undefined,
                borderColor: product.isSoldOut ? "#94a3b8" : undefined,
                cursor: product.isSoldOut ? "not-allowed" : "pointer"
              }}
            >
              <ShoppingCart size={16} style={{ marginLeft: "6px" }} />
              <span>{product.isSoldOut ? "نفذت الكمية" : "إضافة للسلة"}</span>
            </button>

            <button
              onClick={() => toggleWishlist(product.id)}
              className={`btn btn-secondary ${inWishlist ? "active" : ""}`}
              style={{
                width: "48px",
                padding: "0",
                color: inWishlist ? "#ef4444" : "var(--primary-color)",
                borderColor: inWishlist ? "#ef4444" : "var(--primary-color)"
              }}
              title={inWishlist ? "حذف من المفضلة" : "إضافة للمفضلة"}
            >
              <Heart size={18} fill={inWishlist ? "#ef4444" : "none"} />
            </button>
          </div>

          {/* Add-to-cart confirmation notification */}
          {notification && (
            <div
              className="animate-fade-in"
              style={{
                backgroundColor: "var(--accent-alpha-10)",
                color: "var(--primary-color)",
                border: "1px solid var(--accent-color)",
                borderRadius: "var(--border-radius)",
                padding: "12px 16px",
                marginTop: "20px",
                fontSize: "14px",
                fontWeight: "600"
              }}
            >
              {notification}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
