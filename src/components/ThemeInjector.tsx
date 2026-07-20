import React, { useEffect } from "react";
import { useStore } from "../context/StoreContext";

export const ThemeInjector: React.FC = () => {
  const { theme } = useStore();

  useEffect(() => {
    if (!theme) return;

    // 1. Inject custom colors on document root
    const root = document.documentElement;
    root.style.setProperty("--primary-color", theme.colors.primary);
    root.style.setProperty("--secondary-color", theme.colors.secondary);
    root.style.setProperty("--accent-color", theme.colors.accent);
    root.style.setProperty("--bg-color", theme.colors.background);
    root.style.setProperty("--text-color", theme.colors.text);
    root.style.setProperty("--card-bg", theme.colors.cardBg);
    root.style.setProperty("--border-color", theme.colors.border);
    root.style.setProperty("--border-radius", theme.ui.borderRadius);
    
    // Convert accent color to hex with alpha for subtle backgrounds
    root.style.setProperty("--accent-alpha-10", `${theme.colors.accent}1a`);
    root.style.setProperty("--accent-alpha-20", `${theme.colors.accent}33`);
    root.style.setProperty("--primary-alpha-10", `${theme.colors.primary}1a`);
    root.style.setProperty("--primary-alpha-80", `${theme.colors.primary}cc`);

    // 2. Load Google Fonts dynamically
    const loadFont = (fontName: string) => {
      if (!fontName) return;
      const formattedName = fontName.replace(/\s+/g, "+");
      const linkId = `gfont-${formattedName.toLowerCase()}`;
      
      // Check if already loaded
      if (!document.getElementById(linkId)) {
        const link = document.createElement("link");
        link.id = linkId;
        link.rel = "stylesheet";
        link.href = `https://fonts.googleapis.com/css2?family=${formattedName}:wght@300;400;500;600;700;800&display=swap`;
        document.head.appendChild(link);
      }
    };

    loadFont(theme.fonts.heading);
    loadFont(theme.fonts.body);

    // Set font family variables
    root.style.setProperty("--font-heading", `'${theme.fonts.heading}', sans-serif`);
    root.style.setProperty("--font-body", `'${theme.fonts.body}', sans-serif`);

    // Update favicon
    if (theme.favicon) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = theme.favicon;
    }
    
    // Update Document Title based on store SEO details
    // (This is updated in App.tsx or inside StoreContext dynamically too)
  }, [theme]);

  return null;
};
