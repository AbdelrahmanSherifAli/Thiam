import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { useCart } from "../context/CartContext";
import { WhatsAppService } from "../services/whatsappService";
import type { OrderItem } from "../services/whatsappService";
import { MessageSquare, ArrowLeft, ShoppingBag } from "lucide-react";
import { getCartItemPrice } from "../utils/price";

export const Checkout: React.FC = () => {
  const { storeInfo, setCurrentView } = useStore();
  const {
    cart,
    cartTotal,
    clearCart,
    appliedCoupon,
    discountAmount,
    cartFinalTotal
  } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="container section-padding flex-center" style={{ flexDirection: "column", minHeight: "450px", gap: "20px" }}>
        <ShoppingBag size={64} strokeWidth={1} style={{ color: "var(--accent-color)" }} />
        <h2 style={{ fontSize: "28px" }}>سلة المشتريات فارغة</h2>
        <button onClick={() => setCurrentView("shop")} className="btn btn-primary">
          استكشف المتجر
        </button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      alert("يرجى كتابة كافة البيانات المطلوبة للشحن.");
      return;
    }

    setIsSubmitting(true);

    // Format cart items to OrderItems type
    const orderItems: OrderItem[] = cart.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      price: getCartItemPrice(item),
      quantity: item.quantity,
      selectedAttributes: item.selectedAttributes
    }));

    // Trigger WhatsApp Redirection
    const storeName = storeInfo.seo.title.split("|")[0].trim();
    
    setTimeout(() => {
      WhatsAppService.redirectToWhatsApp(
        storeInfo.whatsapp,
        storeName,
        { name, phone, address, notes },
        orderItems,
        cartTotal,
        appliedCoupon?.code,
        appliedCoupon ? discountAmount : undefined,
        appliedCoupon ? cartFinalTotal : undefined
      );
      
      // Optionally clear the cart after redirecting, or keep it.
      // Usually, clearing it prevents double orders when the user navigates back.
      clearCart();
      setIsSubmitting(false);
      setCurrentView("home");
    }, 800);
  };

  return (
    <div className="container section-padding">
      {/* Back to Cart link */}
      <button
        onClick={() => setCurrentView("cart")}
        className="flex-center"
        style={{ gap: "6px", color: "var(--secondary-color)", fontSize: "14px", marginBottom: "30px" }}
      >
        <ArrowLeft size={16} style={{ marginLeft: "6px" }} />
        <span>العودة لسلة المشتريات</span>
      </button>

      <h1 className="details-title" style={{ marginBottom: "35px" }}>إتمام الطلب</h1>

      <div className="checkout-wrapper">
        {/* Left Column: Customer details form */}
        <form onSubmit={handleSubmit}>
          <div className="form-card">
            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px" }}>
              بيانات الشحن والتوصيل
            </h3>

            {/* Name */}
            <div className="form-group">
              <label className="form-label">الاسم بالكامل *</label>
              <input
                type="text"
                placeholder="أدخل اسمك الثلاثي"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                required
              />
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label">رقم الهاتف للتواصل *</label>
              <input
                type="tel"
                placeholder="مثال: 01001234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input"
                required
              />
            </div>

            {/* Address */}
            <div className="form-group">
              <label className="form-label">عنوان الشحن بالتفصيل *</label>
              <textarea
                placeholder="المحافظة، المدينة، اسم الشارع، رقم المنزل / الدور / الشقة"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="form-textarea"
                required
              />
            </div>

            {/* Notes */}
            <div className="form-group" style={{ marginBottom: "0" }}>
              <label className="form-label">ملاحظات أو تعليمات خاصة (اختياري)</label>
              <textarea
                placeholder="ملاحظات حول موعد التوصيل، معالم مميزة بالقرب من العنوان، إلخ."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="form-textarea"
                style={{ height: "80px" }}
              />
            </div>
          </div>
        </form>

        {/* Right Column: Order items listing and WhatsApp submit */}
        <div>
          <div className="checkout-summary-card" style={{ position: "relative", top: "0" }}>
            <h3 className="summary-title">ملخص الطلب</h3>

            {/* Items display list */}
            <div
              style={{
                maxHeight: "220px",
                overflowY: "auto",
                marginBottom: "20px",
                paddingRight: "6px"
              }}
            >
              {cart.map((item) => (
                <div
                  key={item.uniqueKey}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "14px",
                    paddingBottom: "12px",
                    borderBottom: "1px solid var(--border-color)",
                    marginBottom: "12px"
                  }}
                >
                  <div style={{ maxWidth: "75%" }}>
                    <div style={{ fontWeight: "600" }}>
                      {item.product.name} <span style={{ color: "var(--accent-color)" }}>x{item.quantity}</span>
                    </div>
                    {Object.entries(item.selectedAttributes).map(([k, v]) => (
                      <div key={k} style={{ fontSize: "11px", color: "var(--secondary-color)" }}>
                        {k}: {v}
                      </div>
                    ))}
                  </div>
                  <div style={{ fontWeight: "700" }}>
                    {(getCartItemPrice(item) * item.quantity).toFixed(2)} ج.م
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-row">
              <span>إجمالي المنتجات:</span>
              <span>{cartTotal.toFixed(2)} ج.م</span>
            </div>

            {appliedCoupon && (
              <div className="summary-row" style={{ color: "#10b981", fontWeight: "600" }}>
                <span>الخصم ({appliedCoupon.code}):</span>
                <span>-{discountAmount.toFixed(2)} ج.م</span>
              </div>
            )}

            <div className="summary-row">
              <span>تكلفة التوصيل:</span>
              <span style={{ color: "#10b981", fontWeight: "600" }}>مجاني</span>
            </div>

            <div className="summary-total" style={{ borderTop: "1px dashed var(--border-color)" }}>
              <span>الإجمالي الكلي:</span>
              <span>{cartFinalTotal.toFixed(2)} ج.م</span>
            </div>

            {/* Direct Warning notice */}
            <div
              style={{
                backgroundColor: "rgba(245, 158, 11, 0.08)",
                border: "1px solid rgba(245, 158, 11, 0.3)",
                color: "#d97706",
                fontSize: "12px",
                padding: "12px",
                borderRadius: "8px",
                marginTop: "20px",
                lineHeight: "1.5"
              }}
            >
              💡 <strong>تأكيد الطلب الفوري عبر واتس آب:</strong> النقر على الزر بالأسفل يقوم تلقائياً بتجميع مواصفات طلبك وإعداد رسالة منسقة ويفتح تطبيق واتساب لإرسالها مباشرة وتأكيد عملية الشحن.
            </div>

            <button
              onClick={handleSubmit}
              className="btn btn-primary"
              style={{
                width: "100%",
                marginTop: "24px",
                height: "50px",
                backgroundColor: "#25d366", /* WhatsApp Brand Green */
                borderColor: "#25d366"
              }}
              disabled={isSubmitting}
            >
              <MessageSquare size={18} fill="#ffffff" stroke="none" style={{ marginLeft: "6px" }} />
              <span>{isSubmitting ? "جاري إعداد الطلب..." : "تأكيد الطلب عبر واتس آب"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
