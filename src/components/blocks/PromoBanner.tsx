import React from "react";
import { useStore } from "../../context/StoreContext";

export const PromoBanner: React.FC = () => {
  const { homepage, setCurrentView, setActiveCategorySlug } = useStore();
  const { promo } = homepage;

  if (!promo.enabled) return null;

  const handleBannerClick = (link: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (link.startsWith("#category/")) {
      const slug = link.replace("#category/", "");
      setActiveCategorySlug(slug);
      setCurrentView("shop");
    } else if (link === "#shop") {
      setActiveCategorySlug(null);
      setCurrentView("shop");
    }
  };

  return (
    <section className="section-padding" style={{ paddingBottom: "40px" }}>
      <div className="container">
        {promo.title && (
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2 style={{ fontSize: "28px", color: "var(--primary-color)" }}>{promo.title}</h2>
          </div>
        )}
        
        <div className="promo-grid-block">
          {promo.banners.map((banner) => {
            const isFull = banner.size === "full";
            return (
              <div
                key={banner.id}
                className="promo-banner-card"
                style={{
                  backgroundImage: `url(${banner.image})`,
                  gridColumn: isFull ? "1 / -1" : "auto",
                  height: isFull ? "400px" : "350px"
                }}
              >
                <div className="promo-banner-content">
                  <h3 className="promo-banner-title">{banner.title}</h3>
                  <p className="promo-banner-subtitle">{banner.subtitle}</p>
                  <a
                    href={banner.link}
                    onClick={(e) => handleBannerClick(banner.link, e)}
                    className="btn btn-primary"
                    style={{
                      padding: "8px 24px",
                      fontSize: "12px",
                      backgroundColor: "var(--primary-color)",
                      borderColor: "var(--primary-color)",
                      color: "var(--bg-color)"
                    }}
                  >
                    اكتشف المزيد
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
