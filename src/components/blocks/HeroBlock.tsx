import React from "react";
import { useStore } from "../../context/StoreContext";

export const HeroBlock: React.FC = () => {
  const { homepage, theme, setCurrentView } = useStore();
  const { hero } = homepage;
  const layoutStyle = theme.layoutStyle || "luxury";

  if (!hero.enabled) return null;

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hero.ctaLink.startsWith("#")) {
      const section = hero.ctaLink.substring(1);
      if (section === "shop") {
        setCurrentView("shop");
      }
    }
  };

  const getAlignClass = () => {
    switch (hero.align) {
      case "left":
        return { justify: "flex-start", text: "left" };
      case "right":
        return { justify: "flex-end", text: "right" };
      case "center":
      default:
        return { justify: "center", text: "center" };
    }
  };

  const alignStyles = getAlignClass();

  // --- 1. MODERN SPLIT-GRID HERO LAYOUT (Theme 2) ---
  if (layoutStyle === "modern") {
    return (
      <section style={{ 
        backgroundColor: "var(--background-color)", 
        padding: "80px 0", 
        borderBottom: "1px solid var(--border-color)",
        overflow: "hidden"
      }}>
        <div className="container modern-hero-grid">
          {/* Column 1: Typography Contents */}
          <div className="modern-hero-text-col" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <span style={{ 
              textTransform: "uppercase", 
              fontSize: "13px", 
              fontWeight: "800", 
              letterSpacing: "2px", 
              color: "var(--accent-color)" 
            }}>
              وصلنا حديثاً ✨
            </span>
            <h1 style={{ 
              fontSize: "52px", 
              fontWeight: "900", 
              lineHeight: "1.2", 
              color: "var(--primary-color)",
              margin: 0
            }}>
              {hero.title}
            </h1>
            <p style={{ 
              fontSize: "18px", 
              lineHeight: "1.7", 
              color: "var(--secondary-color)",
              margin: 0
            }}>
              {hero.subtitle}
            </p>
            <div>
              {hero.ctaText && (
                <a 
                  href={hero.ctaLink} 
                  onClick={handleCtaClick} 
                  className="btn btn-accent btn-large"
                  style={{ padding: "16px 40px", fontSize: "15px", fontWeight: "700" }}
                >
                  {hero.ctaText}
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Large Lifestyle Fashion Photo */}
          <div style={{ position: "relative" }}>
            <div className="modern-hero-image-box" style={{
              width: "100%",
              height: "500px",
              borderRadius: "var(--border-radius)",
              overflow: "hidden",
              boxShadow: "0 20px 40px -15px rgba(0,0,0,0.15)"
            }}>
              <img 
                src={hero.bgImage} 
                alt={hero.title} 
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
            </div>
            {/* Decorative colored badge behind */}
            <div style={{
              position: "absolute",
              top: "-20px",
              left: "-20px",
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              backgroundColor: "var(--accent-color)",
              opacity: 0.15,
              zIndex: -1
            }} />
          </div>
        </div>
      </section>
    );
  }

  // --- 2. EDITORIAL MINIMALIST COLLAGE HERO LAYOUT (Theme 3) ---
  if (layoutStyle === "editorial") {
    return (
      <section style={{ 
        backgroundColor: "var(--background-color)", 
        padding: "100px 0 60px 0", 
        textAlign: "center",
        borderBottom: "1px solid var(--border-color)"
      }}>
        <div className="container" style={{ display: "flex", flexDirection: "column", gap: "30px", alignItems: "center" }}>
          {/* Headline editorial */}
          <div style={{ maxWidth: "800px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <h1 style={{ 
              fontSize: "46px", 
              fontWeight: "700", 
              color: "var(--primary-color)", 
              fontFamily: "var(--font-heading)",
              margin: 0
            }}>
              {hero.title}
            </h1>
            <p style={{ 
              fontSize: "16px", 
              lineHeight: "1.8", 
              color: "var(--secondary-color)", 
              maxWidth: "600px", 
              margin: "0 auto" 
            }}>
              {hero.subtitle}
            </p>
            <div style={{ marginTop: "10px" }}>
              {hero.ctaText && (
                <a 
                  href={hero.ctaLink} 
                  onClick={handleCtaClick} 
                  className="btn btn-primary btn-large"
                  style={{ 
                    borderBottom: "2px solid var(--accent-color)",
                    backgroundColor: "transparent",
                    color: "var(--primary-color)",
                    borderRadius: 0,
                    padding: "12px 30px",
                    fontWeight: "600"
                  }}
                >
                  {hero.ctaText}
                </a>
              )}
            </div>
          </div>

          {/* Collage Images Grid */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1.5fr 1fr", 
            gap: "20px", 
            width: "100%", 
            marginTop: "40px" 
          }}>
            <div style={{ height: "300px", borderRadius: "var(--border-radius)", overflow: "hidden", marginTop: "40px" }}>
              <img 
                src={hero.bgImage2 || "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80"} 
                alt="Cosmetics detail 1" 
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
            </div>
            <div style={{ height: "380px", borderRadius: "var(--border-radius)", overflow: "hidden" }}>
              <img 
                src={hero.bgImage} 
                alt={hero.title} 
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
            </div>
            <div style={{ height: "300px", borderRadius: "var(--border-radius)", overflow: "hidden", marginTop: "40px" }}>
              <img 
                src={hero.bgImage3 || "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=400&q=80"} 
                alt="Cosmetics detail 2" 
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // --- 3. CLASSIC LUXURY OVERLAY HERO LAYOUT (Theme 1 - Default) ---
  return (
    <section
      className="hero-section"
      style={{ backgroundImage: `url(${hero.bgImage})` }}
    >
      <div className="hero-overlay"></div>
      <div className="container" style={{ display: "flex", justifyContent: alignStyles.justify, width: "100%" }}>
        <div
          className="hero-content"
          style={{ textAlign: alignStyles.text as any }}
        >
          <h1 className="hero-title">{hero.title}</h1>
          <p className="hero-subtitle">{hero.subtitle}</p>
          {hero.ctaText && (
            <a href={hero.ctaLink} onClick={handleCtaClick} className="btn btn-accent btn-large">
              {hero.ctaText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
};
