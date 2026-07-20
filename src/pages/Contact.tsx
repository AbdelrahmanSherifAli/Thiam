import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export const Contact: React.FC = () => {
  const { storeInfo, pages } = useStore();
  const { contact } = pages;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    // Simulate successful message submission
    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="container section-padding animate-fade-in">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "50px" }}>
        
        {/* Contact Info and Details */}
        <div>
          <h1 className="details-title" style={{ marginBottom: "20px" }}>
            {contact.title}
          </h1>
          <p style={{ color: "var(--secondary-color)", marginBottom: "35px", lineHeight: "1.7" }}>
            {contact.content}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {storeInfo.address && (
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div className="btn-icon" style={{ flexShrink: 0, backgroundColor: "var(--accent-alpha-10)", color: "var(--accent-color)" }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 style={{ fontWeight: "600", fontSize: "14px" }}>موقع المعرض</h4>
                  <p style={{ color: "var(--secondary-color)", fontSize: "14px", marginTop: "4px" }}>{storeInfo.address}</p>
                </div>
              </div>
            )}

            {storeInfo.phone && (
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div className="btn-icon" style={{ flexShrink: 0, backgroundColor: "var(--accent-alpha-10)", color: "var(--accent-color)" }}>
                  <Phone size={16} />
                </div>
                <div>
                  <h4 style={{ fontWeight: "600", fontSize: "14px" }}>الخط الساخن للهاتف</h4>
                  <p style={{ color: "var(--secondary-color)", fontSize: "14px", marginTop: "4px" }}>{storeInfo.phone}</p>
                </div>
              </div>
            )}

            {storeInfo.email && (
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div className="btn-icon" style={{ flexShrink: 0, backgroundColor: "var(--accent-alpha-10)", color: "var(--accent-color)" }}>
                  <Mail size={16} />
                </div>
                <div>
                  <h4 style={{ fontWeight: "600", fontSize: "14px" }}>البريد الإلكتروني</h4>
                  <p style={{ color: "var(--secondary-color)", fontSize: "14px", marginTop: "4px" }}>{storeInfo.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Form Box */}
        <div className="form-card" style={{ marginBottom: "0" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px" }}>
            أرسل استفسارك
          </h3>
          
          {submitted ? (
            <div
              className="animate-fade-in"
              style={{
                backgroundColor: "var(--accent-alpha-10)",
                color: "var(--primary-color)",
                border: "1px solid var(--accent-color)",
                borderRadius: "var(--border-radius)",
                padding: "20px",
                textAlign: "center",
                fontWeight: "600"
              }}
            >
              ✓ شكراً لك! تم إرسال رسالتك بنجاح. وسنتواصل معك قريباً.
            </div>
          ) : (
            <form onSubmit={handleContactSubmit}>
              <div className="form-group">
                <label className="form-label">الاسم بالكامل</label>
                <input
                  type="text"
                  placeholder="أدخل اسمك"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">البريد الإلكتروني</label>
                <input
                  type="email"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">مضمون الرسالة</label>
                <textarea
                  placeholder="اكتب تفاصيل استفسارك هنا..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="form-textarea"
                  style={{ height: "130px" }}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%", height: "46px" }}>
                <Send size={16} style={{ marginLeft: "6px" }} />
                <span>إرسال الرسالة</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
