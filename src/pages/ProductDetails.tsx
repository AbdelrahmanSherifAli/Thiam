import React, { useState, useEffect } from "react";
import { useStore } from "../context/StoreContext";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { Star, Heart, ShoppingCart, ArrowLeft, Zap, Video } from "lucide-react";
import { getAdjustedPrice } from "../utils/price";

const getFallbackColorHex = (colorName: string): string => {
  const colors: Record<string, string> = {
    "أسود": "#000000",
    "أبيض": "#ffffff",
    "أحمر": "#dc2626",
    "أزرق": "#2563eb",
    "أخضر": "#16a34a",
    "أصفر": "#facc15",
    "بني": "#78350f",
    "رمادي": "#4b5563",
    "كحلي": "#1e3a8a",
    "زيتي": "#3f6212",
    "بيج": "#f5f5dc",
    "وردي": "#db2777",
    "بنفسجي": "#7c3aed",
    "برتقالي": "#f97316",
    "ذهبي": "#d97706",
    "فضي": "#cbd5e1"
  };
  for (const key of Object.keys(colors)) {
    if (colorName.includes(key)) {
      return colors[key];
    }
  }
  return "#e2e8f0"; // slate-200 default fallback
};

export const ProductDetails: React.FC = () => {
  const { selectedProductId, products, categories, setCurrentView, setActiveCategorySlug, theme } = useStore();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { t } = useLanguage();

  const product = products.find((p) => p.id === selectedProductId);

  // Fallback safe values for product fields
  const prodImages = product && Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ["https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80"];
  
  const prodAttributes = product && Array.isArray(product.attributes) ? product.attributes : [];
  const prodRating = product && typeof product.rating === "number" && !isNaN(product.rating) ? product.rating : 5;
  const prodReviewsCount = product && typeof product.reviewsCount === "number" ? product.reviewsCount : 0;
  const prodPrice = product && typeof product.price === "number" ? product.price : 0;

  // Active image / media displaying in gallery
  const [activeImage, setActiveImage] = useState<string>("");
  const [activeMedia, setActiveMedia] = useState<"image" | "video">("image");
  
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
      setActiveMedia("image");
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
    setNotification(t("product_added_msg"));
    setTimeout(() => setNotification(null), 4000);
  };

  const handleBuyNow = () => {
    if (product.isSoldOut) return;
    const missing = prodAttributes.filter((attr) => attr.name && !selectedAttrs[attr.name]);
    if (missing.length > 0) {
      alert(`${t("product_select_required")}: ${missing.map((m) => m.name).join(", ")}`);
      return;
    }

    addToCart(product, quantity, selectedAttrs);
    setCurrentView("checkout");
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
        <ArrowLeft size={16} style={{ marginInlineEnd: "6px" }} />
        <span>{t("product_back_to_shop")}</span>
      </button>

      {/* Main Details Wrapper */}
      <div className="details-wrapper">
        {/* Left Column: Gallery */}
        <div className="gallery-container">
          <div className="gallery-main">
            {activeMedia === "video" && product.videoUrl ? (() => {
              const url = product.videoUrl;
              if (url.includes("youtube.com/watch?v=")) {
                const videoId = url.split("v=")[1]?.split("&")[0];
                return (
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
                    title={product.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ width: "100%", height: "100%", border: "none", backgroundColor: "#000" }}
                  />
                );
              }
              if (url.includes("youtu.be/")) {
                const videoId = url.split("youtu.be/")[1]?.split("?")[0];
                return (
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
                    title={product.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ width: "100%", height: "100%", border: "none", backgroundColor: "#000" }}
                  />
                );
              }
              if (url.includes("vimeo.com/")) {
                const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
                return (
                  <iframe
                    src={`https://player.vimeo.com/video/${videoId}?autoplay=1`}
                    title={product.name}
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    style={{ width: "100%", height: "100%", border: "none", backgroundColor: "#000" }}
                  />
                );
              }
              return (
                <video
                  src={product.videoUrl}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ width: "100%", height: "100%", objectFit: "contain", backgroundColor: "#000000" }}
                />
              );
            })() : (
              <img src={activeImage || prodImages[0]} alt={product.name || "منتج"} className="gallery-main-img" />
            )}
          </div>
          
          <div className="gallery-thumbs">
            {/* Video Thumbnail if product video exists */}
            {product.videoUrl && (
              <div
                onClick={() => setActiveMedia("video")}
                className={`gallery-thumb ${activeMedia === "video" ? "active" : ""}`}
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#0f172a",
                  color: "#ffffff"
                }}
                title="مشاهدة فيديو المنتج"
              >
                <Video size={22} style={{ color: "var(--accent-color)" }} />
                <span style={{ fontSize: "9px", fontWeight: "700", marginTop: "2px" }}>فيديو</span>
              </div>
            )}

            {/* Images Thumbnails */}
            {prodImages.map((img, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setActiveImage(img);
                  setActiveMedia("image");
                }}
                className={`gallery-thumb ${activeMedia === "image" && activeImage === img ? "active" : ""}`}
              >
                <img src={img} alt={`${product.name} preview ${idx}`} className="gallery-thumb-img" />
              </div>
            ))}
          </div>
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
          {prodAttributes.map((attr) => {
            const isColorAttr = attr.name === "اللون" || attr.name.toLowerCase() === "color";
            return (
              <div key={attr.name || Math.random()} className="attribute-selector">
                <span className="attribute-label">
                  اختر {attr.name}: <span style={{ fontWeight: "700", color: "var(--primary-color)" }}>{selectedAttrs[attr.name] || ""}</span>
                </span>
                <div className="attribute-options" style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
                  {Array.isArray(attr.options) && attr.options.map((opt) => {
                    if (isColorAttr) {
                      const hex = (theme.colorSwatches && theme.colorSwatches[opt]) || getFallbackColorHex(opt);
                      const isSelected = selectedAttrs[attr.name] === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleAttrClick(attr.name, opt)}
                          className={`color-swatch-btn ${isSelected ? "selected" : ""}`}
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            backgroundColor: hex,
                            border: isSelected ? "2.5px solid var(--primary-color)" : "1px solid var(--border-color)",
                            outline: isSelected ? "2px solid #ffffff" : "none",
                            outlineOffset: "-4px",
                            cursor: "pointer",
                            boxShadow: isSelected ? "0 4px 10px rgba(0,0,0,0.3)" : "0 2px 4px rgba(0,0,0,0.05)",
                            transform: isSelected ? "scale(1.1)" : "scale(1)",
                            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                            position: "relative"
                          }}
                          title={opt}
                        >
                          {/* Visual checkmark or white indicator for selected color */}
                          {isSelected && (
                            <span style={{
                              position: "absolute",
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              backgroundColor: opt === "أبيض" || hex === "#ffffff" ? "#000000" : "#ffffff",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)"
                            }} />
                          )}
                        </button>
                      );
                    }
                    return (
                      <button
                        key={opt}
                        onClick={() => handleAttrClick(attr.name, opt)}
                        className={`attr-btn ${selectedAttrs[attr.name] === opt ? "selected" : ""}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

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
              <ShoppingCart size={16} style={{ marginInlineEnd: "6px" }} />
              <span>{product.isSoldOut ? t("product_sold_out") : t("product_add_to_cart")}</span>
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
              title={inWishlist ? t("cart_remove") : t("nav_wishlist")}
            >
              <Heart size={18} fill={inWishlist ? "#ef4444" : "none"} />
            </button>
          </div>

          {/* Direct Buy Now Button */}
          <button 
            onClick={handleBuyNow} 
            className="btn buy-now-btn"
            disabled={product.isSoldOut}
            style={{
              width: "100%",
              marginTop: "12px",
              padding: "14px 20px",
              fontSize: "15px",
              fontWeight: "700",
              backgroundColor: product.isSoldOut ? "#94a3b8" : "var(--accent-color, #c5a880)",
              color: "#ffffff",
              border: "none",
              borderRadius: "var(--border-radius)",
              cursor: product.isSoldOut ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxShadow: product.isSoldOut ? "none" : "0 4px 14px rgba(197, 168, 128, 0.35)",
              transition: "all 0.2s ease"
            }}
          >
            <Zap size={18} />
            <span>{product.isSoldOut ? t("product_out_of_stock") : t("product_buy_now")}</span>
          </button>

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
