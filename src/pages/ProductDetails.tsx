import React, { useState, useEffect } from "react";
import { useStore } from "../context/StoreContext";
import { useCart } from "../context/CartContext";
import { Star, Heart, ShoppingCart, ArrowLeft, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { getAdjustedPrice } from "../utils/price";

export const ProductDetails: React.FC = () => {
  const { selectedProductId, products, categories, setCurrentView, setActiveCategorySlug } = useStore();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const product = products.find((p) => p.id === selectedProductId);

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
      setActiveImage(product.images[0]);
      setQuantity(1);
      
      const defaults: Record<string, string> = {};
      product.attributes.forEach((attr) => {
        if (attr.options.length > 0) {
          defaults[attr.name] = attr.options[0];
        }
      });
      setSelectedAttrs(defaults);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="container section-padding flex-center" style={{ flexDirection: "column", gap: "20px" }}>
        <h3>Fragrance Not Found</h3>
        <button onClick={() => setCurrentView("shop")} className="btn btn-primary">
          Back to Shop Catalog
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
    const missing = product.attributes.filter((attr) => !selectedAttrs[attr.name]);
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

  return (
    <div className="container section-padding">
      {/* Back link */}
      <button
        onClick={() => setCurrentView("shop")}
        className="flex-center"
        style={{ gap: "6px", color: "var(--secondary-color)", fontSize: "14px", marginBottom: "30px" }}
      >
        <ArrowLeft size={16} style={{ marginLeft: "6px" }} />
        <span>العودة للمتجر</span>
      </button>

      {/* Main Details Wrapper */}
      <div className="details-wrapper">
        {/* Left Column: Gallery */}
        <div className="gallery-container">
          <div className="gallery-main">
            <img src={activeImage} alt={product.name} className="gallery-main-img" />
          </div>
          {product.images.length > 1 && (
            <div className="gallery-thumbs">
              {product.images.map((img, idx) => (
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
              {Array.from({ length: Math.round(product.rating) }).map((_, i) => (
                <Star key={i} size={15} fill="#fbbf24" stroke="#fbbf24" />
              ))}
            </div>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-color)" }}>
              {product.rating.toFixed(1)}
            </span>
            <span style={{ fontSize: "13px", color: "var(--secondary-color)" }}>
              ({product.reviewsCount} تقييمات العملاء)
            </span>
          </div>

          {/* Price */}
          <div className="details-price">
            <span>{getAdjustedPrice(product, selectedAttrs).toFixed(2)} EGP</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="original-price" style={{ fontSize: "20px" }}>
                {(product.originalPrice + (getAdjustedPrice(product, selectedAttrs) - product.price)).toFixed(2)} EGP
              </span>
            )}
          </div>

          {/* Long Description */}
          <p className="details-desc">{product.description}</p>

          {/* Dynamic Attributes Editor */}
          {product.attributes.map((attr) => (
            <div key={attr.name} className="attribute-selector">
              <span className="attribute-label">اختر {attr.name}:</span>
              <div className="attribute-options">
                {attr.options.map((opt) => (
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
                borderRadius: "8px",
                padding: "12px 16px",
                fontWeight: "600",
                fontSize: "14px",
                marginBottom: "30px"
              }}
            >
              {notification}
            </div>
          )}

          {/* Trust badges */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
              paddingTop: "24px",
              borderTop: "1px solid var(--border-color)",
              marginTop: "20px"
            }}
          >
            <div style={{ textAlign: "center", fontSize: "12px" }}>
              <Truck size={20} style={{ color: "var(--accent-color)", margin: "0 auto 8px" }} />
              <div style={{ fontWeight: "600" }}>توصيل سريع</div>
              <div style={{ color: "var(--secondary-color)", scale: "0.95" }}>شحن لجميع المحافظات</div>
            </div>
            <div style={{ textAlign: "center", fontSize: "12px" }}>
              <ShieldCheck size={20} style={{ color: "var(--accent-color)", margin: "0 auto 8px" }} />
              <div style={{ fontWeight: "600" }}>أصلي 100%</div>
              <div style={{ color: "var(--secondary-color)", scale: "0.95" }}>استيراد مباشر</div>
            </div>
            <div style={{ textAlign: "center", fontSize: "12px" }}>
              <RefreshCw size={20} style={{ color: "var(--accent-color)", margin: "0 auto 8px" }} />
              <div style={{ fontWeight: "600" }}>دعم عبر واتس آب</div>
              <div style={{ color: "var(--secondary-color)", scale: "0.95" }}>رد خلال ساعتين</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
