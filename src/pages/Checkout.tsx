import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
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
  
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="container section-padding flex-center" style={{ flexDirection: "column", minHeight: "450px", gap: "20px" }}>
        <ShoppingBag size={64} strokeWidth={1} style={{ color: "var(--accent-color)" }} />
        <h2 style={{ fontSize: "28px" }}>{t("cart_empty")}</h2>
        <button onClick={() => setCurrentView("shop")} className="btn btn-primary">
          {t("cart_go_shop")}
        </button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      alert(t("product_select_required"));
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

    // Redirect to WhatsApp checkout
    WhatsAppService.redirectToWhatsApp(
      storeInfo.whatsapp,
      storeInfo.seo.title.split("|")[0].trim(),
      { name, phone, address, notes },
      orderItems,
      cartTotal,
      appliedCoupon?.code,
      discountAmount,
      cartFinalTotal
    );

    // Clear local shopping cart upon dispatch
    clearCart();
    setIsSubmitting(false);

    // Redirect to shop catalog
    setCurrentView("shop");
  };

  return (
    <div className="container section-padding">
      <button
        onClick={() => setCurrentView("shop")}
        className="flex-center"
        style={{ gap: "6px", color: "var(--secondary-color)", fontSize: "14px", marginBottom: "30px", background: "none", border: "none", cursor: "pointer" }}
      >
        <ArrowLeft size={16} style={{ marginInlineEnd: "6px" }} />
        <span>{t("product_back_to_shop")}</span>
      </button>

      <h1 className="details-title" style={{ marginBottom: "35px" }}>{t("checkout_title")}</h1>

      <div className="checkout-wrapper">
        {/* Left Column: Customer details form */}
        <form onSubmit={handleSubmit}>
          <div className="form-card">
            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px" }}>
              {t("checkout_customer_info")}
            </h3>

            {/* Name */}
            <div className="form-group">
              <label className="form-label">{t("checkout_full_name")} *</label>
              <input
                type="text"
                placeholder={t("checkout_full_name")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                required
              />
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label">{t("checkout_phone")} *</label>
              <input
                type="tel"
                placeholder={t("checkout_phone")}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input"
                required
              />
            </div>

            {/* Address */}
            <div className="form-group">
              <label className="form-label">{t("checkout_address")} *</label>
              <textarea
                placeholder={t("checkout_address")}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="form-textarea"
                required
              />
            </div>

            {/* Notes */}
            <div className="form-group" style={{ marginBottom: "0" }}>
              <label className="form-label">{t("checkout_notes")}</label>
              <textarea
                placeholder={t("checkout_notes")}
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
            <h3 className="summary-title">{t("checkout_summary")}</h3>

            {/* Items display list */}
            <div
              style={{
                maxHeight: "220px",
                overflowY: "auto",
                marginBottom: "20px",
                paddingInlineEnd: "6px"
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
                    {(getCartItemPrice(item) * item.quantity).toFixed(2)} EGP
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-row">
              <span>{t("cart_subtotal")}</span>
              <span>{cartTotal.toFixed(2)} EGP</span>
            </div>

            {appliedCoupon && (
              <div className="summary-row" style={{ color: "#10b981", fontWeight: "600" }}>
                <span>{t("product_discount")} ({appliedCoupon.code}):</span>
                <span>-{discountAmount.toFixed(2)} EGP</span>
              </div>
            )}

            <div className="summary-total" style={{ borderTop: "1px dashed var(--border-color)" }}>
              <span>{t("cart_total")}</span>
              <span>{cartFinalTotal.toFixed(2)} EGP</span>
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
              <MessageSquare size={18} fill="#ffffff" stroke="none" style={{ marginInlineEnd: "6px" }} />
              <span>{t("checkout_place_order")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
