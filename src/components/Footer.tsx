import React from "react";
import { useStore } from "../context/StoreContext";
import type { ViewType } from "../context/StoreContext";
import { useLanguage } from "../context/LanguageContext";
import { MessageSquare, Phone, Mail, MapPin } from "lucide-react";

export const Footer: React.FC = () => {
  const { storeInfo, setCurrentView } = useStore();
  const { t } = useLanguage();

  const navigateTo = (view: ViewType) => {
    setCurrentView(view);
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
          </svg>
        );
      case "instagram":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
          </svg>
        );
      case "twitter":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
          </svg>
        );
      case "tiktok":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
          </svg>
        );
      default:
        return <MessageSquare size={18} />;
    }
  };

  const activeSocials = Object.entries(storeInfo.socials).filter(([_, url]) => !!url);

  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info Widget */}
          <div>
            <h3 className="footer-widget-title" style={{ fontSize: "18px", color: "var(--accent-color)" }}>
              {storeInfo.seo.title.split("|")[0].trim()}
            </h3>
            <p className="footer-text" style={{ marginTop: "12px", opacity: "0.8" }}>
              {storeInfo.seo.description}
            </p>
            {activeSocials.length > 0 && (
              <div className="footer-socials">
                {activeSocials.map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-btn"
                    title={platform}
                  >
                    {getSocialIcon(platform)}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick links widget */}
          <div>
            <h4 className="footer-widget-title">{t("footer_quick_links")}</h4>
            <ul className="footer-links">
              <li className="footer-link-item">
                <a href="#shop" onClick={() => navigateTo("shop")} className="footer-link">
                  {t("nav_shop")}
                </a>
              </li>
              <li className="footer-link-item">
                <a href="#about" onClick={() => navigateTo("about")} className="footer-link">
                  {t("nav_about")}
                </a>
              </li>
              <li className="footer-link-item">
                <a href="#contact" onClick={() => navigateTo("contact")} className="footer-link">
                  {t("nav_contact")}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal links widget */}
          <div>
            <h4 className="footer-widget-title">{t("footer_legal")}</h4>
            <ul className="footer-links">
              <li className="footer-link-item">
                <a href="#faq" onClick={() => navigateTo("faq")} className="footer-link">
                  FAQ
                </a>
              </li>
              <li className="footer-link-item">
                <a href="#privacy" onClick={() => navigateTo("privacy")} className="footer-link">
                  Privacy Policy
                </a>
              </li>
              <li className="footer-link-item">
                <a href="#terms" onClick={() => navigateTo("terms")} className="footer-link">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details Widget */}
          <div>
            <h4 className="footer-widget-title">{t("footer_contact_info")}</h4>
            <ul className="footer-links" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {storeInfo.address && (
                <li style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "14px" }}>
                  <MapPin size={18} style={{ color: "var(--accent-color)", flexShrink: 0, marginTop: "2px" }} />
                  <span>{storeInfo.address}</span>
                </li>
              )}
              {storeInfo.phone && (
                <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px" }}>
                  <Phone size={16} style={{ color: "var(--accent-color)", flexShrink: 0 }} />
                  <span>{storeInfo.phone}</span>
                </li>
              )}
              {storeInfo.email && (
                <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px" }}>
                  <Mail size={16} style={{ color: "var(--accent-color)", flexShrink: 0 }} />
                  <span style={{ wordBreak: "break-all" }}>{storeInfo.email}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom footer text */}
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {storeInfo.seo.title.split("|")[0].trim()}. {t("footer_rights")}.
          </span>
          <span style={{ opacity: "0.6" }}>
            {t("footer_made_with")}
          </span>
        </div>
      </div>
    </footer>
  );
};
