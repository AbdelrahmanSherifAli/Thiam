import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { useCart } from "../context/CartContext";
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, ArrowLeft } from "lucide-react";
import { getCartItemPrice } from "../utils/price";

export const Cart: React.FC = () => {
  const { setCurrentView, coupons } = useStore();
  const {
    cart,
    updateQuantity,
    removeFromCart,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
    cartFinalTotal
  } = useCart();
  
  const [promoCode, setPromoCode] = useState(appliedCoupon ? appliedCoupon.code : "");
  const [promoError, setPromoError] = useState<string | null>(null);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode) return;

    const res = applyCoupon(promoCode, coupons);
    if (res.success) {
      setPromoError(null);
    } else {
      setPromoError(res.error);
    }
  };

  const handleRemovePromo = () => {
    removeCoupon();
    setPromoCode("");
    setPromoError(null);
  };

  if (cart.length === 0) {
    return (
      <div className="container section-padding flex-center" style={{ flexDirection: "column", minHeight: "450px", gap: "20px" }}>
        <ShoppingBag size={64} strokeWidth={1} style={{ color: "var(--accent-color)" }} />
        <h2 style={{ fontSize: "28px" }}>سلة المشتريات فارغة</h2>
        <p style={{ color: "var(--secondary-color)", maxWidth: "450px", textAlign: "center" }}>
          لم تقم بإضافة أي منتجات إلى سلة المشتريات بعد. تفضل بزيارة صفحة المتجر لاستكشاف تشكيلة منتجاتنا الفاخرة.
        </p>
        <button onClick={() => setCurrentView("shop")} className="btn btn-primary">
          استكشف المتجر
        </button>
      </div>
    );
  }

  return (
    <div className="container section-padding">
      <h1 className="details-title" style={{ marginBottom: "35px" }}>سلة المشتريات</h1>

      <div className="checkout-wrapper">
        {/* Left Column: Cart items table */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--border-radius)",
              overflow: "hidden"
            }}
          >
            {cart.map((item) => (
              <div
                key={item.uniqueKey}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "24px",
                  borderBottom: "1px solid var(--border-color)",
                  gap: "20px"
                }}
              >
                {/* Product Image */}
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  style={{ width: "90px", height: "90px", objectFit: "cover", borderRadius: "8px", border: "1px solid var(--border-color)" }}
                />

                {/* Info */}
                <div style={{ flexGrow: 1 }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "600" }}>{item.product.name}</h3>
                  {/* Selected Variants display */}
                  {Object.entries(item.selectedAttributes).length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "6px" }}>
                      {Object.entries(item.selectedAttributes).map(([k, v]) => (
                        <span key={k} style={{ fontSize: "12px", color: "var(--secondary-color)", backgroundColor: "var(--bg-color)", padding: "2px 8px", borderRadius: "4px" }}>
                          <strong>{k}:</strong> {v}
                        </span>
                      ))}
                    </div>
                  )}
                  <div style={{ marginTop: "8px", fontSize: "14px", fontWeight: "600", color: "var(--accent-color)" }}>
                    {getCartItemPrice(item).toFixed(2)} EGP للقطعة
                  </div>
                </div>

                {/* Quantity */}
                <div className="drawer-qty" style={{ height: "38px" }}>
                  <button onClick={() => updateQuantity(item.uniqueKey, item.quantity - 1)} className="drawer-qty-btn">
                    <Minus size={12} />
                  </button>
                  <span className="drawer-qty-val" style={{ width: "30px", textAlign: "center" }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.uniqueKey, item.quantity + 1)} className="drawer-qty-btn">
                    <Plus size={12} />
                  </button>
                </div>

                {/* Subtotal */}
                <div style={{ fontSize: "16px", fontWeight: "700", width: "100px", textAlign: "right" }}>
                  {(getCartItemPrice(item) * item.quantity).toFixed(2)} EGP
                </div>

                {/* Delete */}
                <button
                  onClick={() => removeFromCart(item.uniqueKey)}
                  style={{ color: "var(--secondary-color)" }}
                  className="btn-icon"
                  title="حذف المنتج"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Action Links */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              onClick={() => setCurrentView("shop")}
              className="flex-center"
              style={{ gap: "6px", color: "var(--secondary-color)", fontSize: "14px" }}
            >
              <ArrowLeft size={16} style={{ marginLeft: "6px" }} />
              <span>العودة للتسوق</span>
            </button>
          </div>
        </div>

        {/* Right Column: Totals Summary & Promo Codes */}
        <div>
          {/* Summary Card */}
          <div className="checkout-summary-card" style={{ position: "relative", top: "0" }}>
            <h3 className="summary-title">ملخص الطلب</h3>
            
            <div className="summary-row">
              <span>مجموع المنتجات:</span>
              <span>{cartTotal.toFixed(2)} ج.م</span>
            </div>

            {appliedCoupon && (
              <div className="summary-row" style={{ color: "#10b981", fontWeight: "600" }}>
                <span>خصم الكوبون ({appliedCoupon.code}):</span>
                <span>-{discountAmount.toFixed(2)} ج.م</span>
              </div>
            )}

            <div className="summary-row">
              <span>تكلفة الشحن:</span>
              <span style={{ fontStyle: "italic", fontSize: "12px", color: "var(--secondary-color)" }}>
                تُحتسب عند الشحن
              </span>
            </div>

            <div className="summary-total">
              <span>الإجمالي الكلي:</span>
              <span>{cartFinalTotal.toFixed(2)} ج.م</span>
            </div>

            <button
              onClick={() => setCurrentView("checkout")}
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "24px", height: "48px" }}
            >
              <span>الانتقال لإتمام الطلب</span>
              <ArrowRight size={16} style={{ marginRight: "6px" }} />
            </button>
          </div>

          {/* Promo code wrapper */}
          <div
            className="form-card"
            style={{
              padding: "20px",
              marginTop: "20px",
              boxShadow: "none"
            }}
          >
            <h4 style={{ fontSize: "14px", fontWeight: "600", textTransform: "uppercase", marginBottom: "12px" }}>
              هل لديك كوبون خصم؟
            </h4>
            <form onSubmit={handleApplyPromo} style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                placeholder="مثال: MAISON10"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                className="form-input"
                style={{ height: "38px", fontSize: "13px", textTransform: "uppercase" }}
                disabled={!!appliedCoupon}
              />
              {appliedCoupon ? (
                <button
                  type="button"
                  onClick={handleRemovePromo}
                  className="btn"
                  style={{ padding: "0 16px", height: "38px", fontSize: "12px", backgroundColor: "#fee2e2", color: "#ef4444", border: "1px solid #fecaca" }}
                >
                  إزالة
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-secondary"
                  style={{ padding: "0 16px", height: "38px", fontSize: "12px" }}
                >
                  تطبيق
                </button>
              )}
            </form>
            {appliedCoupon && (
              <div style={{ color: "#10b981", fontSize: "12px", marginTop: "8px", fontWeight: "600" }}>
                ✓ تم تطبيق كوبون الخصم ({appliedCoupon.code}) بنجاح!
                <br />
                {appliedCoupon.type === "percentage" ? `خصم بقيمة ${appliedCoupon.value}%` : `خصم بقيمة ${appliedCoupon.value} ج.م`}
              </div>
            )}
            {promoError && (
              <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "8px" }}>
                {promoError}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
