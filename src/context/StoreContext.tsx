import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { StorageService } from "../services/storageService";
import type {
  ThemeConfig,
  Product,
  Category,
  StoreInfo,
  HomepageBlocks,
  StaticPagesContent,
  Coupon
} from "../services/storageService";

export type ViewType =
  | "home"
  | "shop"
  | "product-details"
  | "cart"
  | "checkout"
  | "about"
  | "contact"
  | "faq"
  | "privacy"
  | "terms"
  | "admin";

interface StoreContextProps {
  theme: ThemeConfig;
  products: Product[];
  categories: Category[];
  storeInfo: StoreInfo;
  homepage: HomepageBlocks;
  pages: StaticPagesContent;
  coupons: Coupon[];
  currentView: ViewType;
  selectedProductId: string | null;
  searchQuery: string;
  activeCategorySlug: string | null;
  isLoading: boolean;
  setCurrentView: (view: ViewType, productId?: string | null) => void;
  setSelectedProductId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setActiveCategorySlug: (slug: string | null) => void;
  updateTheme: (newTheme: ThemeConfig) => void;
  updateProducts: (newProducts: Product[]) => void;
  updateCategories: (newCategories: Category[]) => void;
  updateStoreInfo: (newInfo: StoreInfo) => void;
  updateHomepage: (newHomepage: HomepageBlocks) => void;
  updatePages: (newPages: StaticPagesContent) => void;
  updateCoupons: (newCoupons: Coupon[]) => void;
  resetAll: () => void;
  triggerCloudSync: () => Promise<boolean>;
}

const StoreContext = createContext<StoreContextProps | undefined>(undefined);

// --- HELPER: Resolve product by ID, Code, Slug or Numeric Code ---
const resolveProduct = (identifier: string, productsList: Product[]): Product | undefined => {
  if (!identifier) return undefined;
  const lower = identifier.toLowerCase().trim();
  return productsList.find((p) => {
    if (p.id.toLowerCase() === lower) return true;
    if (p.code && p.code.toLowerCase() === lower) return true;
    if (p.id.toLowerCase() === `prod-${lower}`) return true;
    return false;
  });
};

const getProductIdentifier = (product: Product): string => {
  if (product.code && product.code.trim()) {
    return product.code.trim();
  }
  // Fallback: strip "prod-" prefix if possible for cleaner URLs
  if (product.id.startsWith("prod-")) {
    return product.id.replace("prod-", "");
  }
  return product.id;
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    StorageService.init();
    const settings = StorageService.getCloudSettings();
    return !!settings.databaseUrl;
  });

  const [theme, setTheme] = useState<ThemeConfig>(() => StorageService.getTheme());
  const [products, setProducts] = useState<Product[]>(() => StorageService.getProducts());
  const [categories, setCategories] = useState<Category[]>(() => StorageService.getCategories());
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(() => StorageService.getStoreInfo());
  const [homepage, setHomepage] = useState<HomepageBlocks>(() => StorageService.getHomepage());
  const [pages, setPages] = useState<StaticPagesContent>(() => StorageService.getPages());
  const [coupons, setCoupons] = useState<Coupon[]>(() => StorageService.getCoupons());

  // Initialize storage and trigger cloud database fetching
  useEffect(() => {
    StorageService.init();
    const fetchCloud = async () => {
      const settings = StorageService.getCloudSettings();
      if (settings.databaseUrl) {
        try {
          const success = await StorageService.syncFromCloud();
          if (success) {
            setTheme(StorageService.getTheme());
            setProducts(StorageService.getProducts());
            setCategories(StorageService.getCategories());
            setStoreInfo(StorageService.getStoreInfo());
            setHomepage(StorageService.getHomepage());
            setPages(StorageService.getPages());
            setCoupons(StorageService.getCoupons());
          }
        } catch (e) {
          console.error("Cloud initialization sync failed:", e);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchCloud();

    const handleFocus = () => fetchCloud();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const getHashFromRoute = useCallback((view: ViewType, productId?: string | null): string => {
    if (view === "home") return "#home";
    if (view === "product-details" && productId) {
      const p = resolveProduct(productId, products);
      const ident = p ? getProductIdentifier(p) : productId;
      return `#product/${ident}`;
    }
    return `#${view}`;
  }, [products]);

  const getRouteFromHash = useCallback((): { view: ViewType; productId: string | null } => {
    const rawHash = window.location.hash.trim();
    if (!rawHash || rawHash === "#" || rawHash === "#/") {
      return { view: "shop", productId: null };
    }

    const cleanHash = rawHash.replace(/^#\/?/, "");

    if (cleanHash.startsWith("product/")) {
      const rawProdId = cleanHash.substring("product/".length).trim();
      if (rawProdId) {
        const matched = resolveProduct(rawProdId, products);
        return { view: "product-details", productId: matched ? matched.id : rawProdId };
      }
    }

    const validViews: ViewType[] = [
      "home",
      "shop",
      "product-details",
      "cart",
      "checkout",
      "about",
      "contact",
      "faq",
      "privacy",
      "terms",
      "admin"
    ];

    if (validViews.includes(cleanHash as ViewType)) {
      return { view: cleanHash as ViewType, productId: null };
    }

    return { view: "shop", productId: null };
  }, [products]);

  // Routing & URL Hash state
  const [currentView, setCurrentViewInternal] = useState<ViewType>(() => getRouteFromHash().view);
  const [selectedProductId, setSelectedProductIdInternal] = useState<string | null>(() => getRouteFromHash().productId);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(null);

  // Sync state with hash changes (Browser Back / Forward buttons & URL edits)
  useEffect(() => {
    const handleHashChange = () => {
      const route = getRouteFromHash();
      setCurrentViewInternal(route.view);
      if (route.productId !== null) {
        setSelectedProductIdInternal(route.productId);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!window.location.hash || window.location.hash === "#") {
      const initialRoute = getRouteFromHash();
      window.history.replaceState(null, "", getHashFromRoute(initialRoute.view, initialRoute.productId));
    } else {
      handleHashChange();
    }

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, [getHashFromRoute, getRouteFromHash]);

  // Custom view setter to update URL hash and scroll to top automatically
  const setCurrentView = (view: ViewType, productId?: string | null) => {
    const targetProdId = productId !== undefined ? productId : selectedProductId;
    const targetHash = getHashFromRoute(view, targetProdId);

    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    } else {
      setCurrentViewInternal(view);
      if (targetProdId !== undefined) {
        setSelectedProductIdInternal(targetProdId);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const setSelectedProductId = (id: string | null) => {
    setSelectedProductIdInternal(id);
    if (id && currentView === "product-details") {
      const p = resolveProduct(id, products);
      const ident = p ? getProductIdentifier(p) : id;
      const targetHash = `#product/${ident}`;
      if (window.location.hash !== targetHash) {
        window.location.hash = targetHash;
      }
    }
  };

  // Sync state changes with StorageService & Cloud Database
  const updateTheme = (newTheme: ThemeConfig) => {
    StorageService.saveTheme(newTheme);
    setTheme(newTheme);
    StorageService.syncToCloud().catch(err => console.error("Cloud sync error:", err));
  };

  const updateProducts = (newProducts: Product[]) => {
    StorageService.saveProducts(newProducts);
    setProducts(newProducts);
    StorageService.syncToCloud().catch(err => console.error("Cloud sync error:", err));
  };

  const updateCategories = (newCategories: Category[]) => {
    StorageService.saveCategories(newCategories);
    setCategories(newCategories);
    StorageService.syncToCloud().catch(err => console.error("Cloud sync error:", err));
  };

  const updateStoreInfo = (newInfo: StoreInfo) => {
    StorageService.saveStoreInfo(newInfo);
    setStoreInfo(newInfo);
    StorageService.syncToCloud().catch(err => console.error("Cloud sync error:", err));
  };

  const updateHomepage = (newHomepage: HomepageBlocks) => {
    StorageService.saveHomepage(newHomepage);
    setHomepage(newHomepage);
    StorageService.syncToCloud().catch(err => console.error("Cloud sync error:", err));
  };

  const updatePages = (newPages: StaticPagesContent) => {
    StorageService.savePages(newPages);
    setPages(newPages);
    StorageService.syncToCloud().catch(err => console.error("Cloud sync error:", err));
  };

  const updateCoupons = (newCoupons: Coupon[]) => {
    StorageService.saveCoupons(newCoupons);
    setCoupons(newCoupons);
    StorageService.syncToCloud().catch(err => console.error("Cloud sync error:", err));
  };

  const resetAll = () => {
    StorageService.resetToDefaults();
    setTheme(StorageService.getTheme());
    setProducts(StorageService.getProducts());
    setCategories(StorageService.getCategories());
    setStoreInfo(StorageService.getStoreInfo());
    setHomepage(StorageService.getHomepage());
    setPages(StorageService.getPages());
    setCoupons(StorageService.getCoupons());
    setCurrentView("home");
  };

  const triggerCloudSync = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await StorageService.syncFromCloud();
      if (success) {
        setTheme(StorageService.getTheme());
        setProducts(StorageService.getProducts());
        setCategories(StorageService.getCategories());
        setStoreInfo(StorageService.getStoreInfo());
        setHomepage(StorageService.getHomepage());
        setPages(StorageService.getPages());
        setCoupons(StorageService.getCoupons());
      }
      return success;
    } catch (e) {
      console.error("Manual cloud sync failed:", e);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        theme,
        products,
        categories,
        storeInfo,
        homepage,
        pages,
        coupons,
        currentView,
        selectedProductId,
        searchQuery,
        activeCategorySlug,
        isLoading,
        setCurrentView,
        setSelectedProductId,
        setSearchQuery,
        setActiveCategorySlug,
        updateTheme,
        updateProducts,
        updateCategories,
        updateStoreInfo,
        updateHomepage,
        updatePages,
        updateCoupons,
        resetAll,
        triggerCloudSync
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
