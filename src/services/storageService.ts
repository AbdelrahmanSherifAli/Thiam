// Storage Service for single-tenant ThemeForest-style E-Commerce Template
// This service abstracts all localStorage operations.
import { CLOUD_CONFIG, APP_VERSION } from "../config";

export interface CloudSettings {
  databaseUrl: string;
  imgbbApiKey: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrderValue?: number;
  isActive: boolean;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  cardBg: string;
  border: string;
}

export interface ThemeFonts {
  heading: string;
  body: string;
}

export interface ThemeUi {
  borderRadius: string; // e.g. "8px"
  buttonStyle: "solid" | "outline" | "pill";
}

export interface ThemeConfig {
  logo: string; // base64 or URL
  favicon: string; // URL
  colors: ThemeColors;
  fonts: ThemeFonts;
  ui: ThemeUi;
  layoutStyle?: "luxury" | "modern" | "editorial";
  announcementText?: string;
  announcementEnabled?: boolean;
}

export interface ProductAttribute {
  name: string;
  options: string[];
}

export interface Product {
  id: string;
  code?: string; // Product code / custom URL slug (e.g. "101", "103")
  name: string;
  price: number;
  originalPrice?: number; // for discounts
  description: string;
  images: string[];
  videoUrl?: string; // Product preview video
  categoryId: string;
  attributes: ProductAttribute[];
  featured: boolean;
  isSoldOut?: boolean; // Out of stock indicator
  rating: number;
  reviewsCount: number;
  colorImages?: Record<string, string>; // Optional map of color names to specific images
  colorCodes?: Record<string, string>; // Optional map of color names to HEX codes
  colors?: string[]; // Optional list of available colors
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface StoreInfo {
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
  socials: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    twitter?: string;
  };
  seo: {
    title: string;
    description: string;
  };
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  avatar: string;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  size: "half" | "full";
}

export interface HomepageBlocks {
  hero: {
    enabled: boolean;
    title: string;
    subtitle: string;
    bgImage: string;
    bgImage2?: string;
    bgImage3?: string;
    ctaText: string;
    ctaLink: string;
    align: "left" | "center" | "right";
  };
  featured: {
    enabled: boolean;
    title: string;
    subtitle: string;
    limit: number;
    layout: "grid" | "carousel";
  };
  promo: {
    enabled: boolean;
    title: string;
    banners: PromoBanner[];
  };
  testimonials: {
    enabled: boolean;
    title: string;
    list: Testimonial[];
  };
  newsletter: {
    enabled: boolean;
    title: string;
    description: string;
    placeholder: string;
    buttonText: string;
  };
  blockOrder: string[];
}

export interface StaticPagesContent {
  about: {
    title: string;
    content: string;
    image: string;
  };
  contact: {
    title: string;
    content: string;
  };
  faq: {
    title: string;
    list: { q: string; a: string }[];
  };
  privacy: {
    title: string;
    content: string;
  };
  terms: {
    title: string;
    content: string;
  };
}

// -------------------------------------------------------------
// Seed default configurations (THIAM GYM & FITNESS STYLE)
// -------------------------------------------------------------
const DEFAULT_THEME: ThemeConfig = {
  logo: "",
  favicon: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=32&q=80",
  colors: {
    primary: "#0b0f19",      // Obsidian Stealth Black
    secondary: "#64748b",    // Steel Gray
    accent: "#22c55e",       // Electric Nitro Green
    background: "#090d16",   // Dark Gym Ambiance
    text: "#f8fafc",         // Crisp Light Text
    cardBg: "#1e293b",       // Dark Slate Card
    border: "#334155"        // Slate Border
  },
  fonts: {
    heading: "Cairo",
    body: "Cairo"
  },
  ui: {
    borderRadius: "14px",
    buttonStyle: "solid"
  },
  layoutStyle: "modern",
  announcementText: "⚡ خصم 15% على جميع المكملات وأدوات الجيم بمناسبة الموسم الرياضي! استخدم كود الخصم: GYM15 ⚡",
  announcementEnabled: true
};

const DEFAULT_CATEGORIES: Category[] = [
  { id: "cat-1", name: "المكملات والبروتينات", slug: "supplements", image: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=400&q=80" },
  { id: "cat-2", name: "معدات وأدوات الجيم", slug: "equipment", image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=400&q=80" },
  { id: "cat-3", name: "الملابس الرياضية", slug: "apparel", image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80" },
  { id: "cat-4", name: "الفيتامينات والاستشفاء", slug: "vitamins", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80" }
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "prod-101",
    code: "GYM-101",
    name: "واي بروتين آيزوليت نقي 100% NITRO WHEY",
    price: 2450.00,
    originalPrice: 2800.00,
    description: "واي بروتين آيزوليت سريع الامتصاص وخالي من الجلوتين والدهون. يمنحك 27 جرام بروتين نقي في كل جرعة لبناء واستشفاء الكتلة العضلية بفعالية قصوى.",
    images: [
      "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=600&q=80"
    ],
    categoryId: "cat-1",
    attributes: [
      { name: "النكهة", options: ["شوكولاتة بلجيكية", "فانيليا آيس كريم", "فراولة كليفلاند", "كوكيز وكريم"] },
      { name: "الحجم", options: ["2 كيلو (5 باوند)", "4.5 كيلو"] }
    ],
    featured: true,
    rating: 4.9,
    reviewsCount: 84
  },
  {
    id: "prod-102",
    code: "GYM-102",
    name: "كراتين مونوهيدرات مايكرونايزد 500g PURE CREATINE",
    price: 1150.00,
    description: "كراتين مونوهيدرات نقي بحجم جزيئات ناعم جداً لزيادة الطاقة والقوة الانفجارية والحجم العضلي أثناء التمرين الشديد.",
    images: [
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=600&q=80"
    ],
    categoryId: "cat-1",
    attributes: [
      { name: "الوزن", options: ["250 جرام (50 جرعة)", "500 جرام (100 جرعة)"] },
      { name: "النكهة", options: ["بدون نكهة (سادة)", "تفاح أخضر", "توت أزرق"] }
    ],
    featured: true,
    rating: 5.0,
    reviewsCount: 120
  },
  {
    id: "prod-103",
    code: "GYM-103",
    name: "طقم دامبلز هكس مطاطي احترافي HEX DUMBBELLS",
    price: 3200.00,
    originalPrice: 3600.00,
    description: "دامبلز سداسية الشكل مغطاة بمطاط عالي الجودة لحماية الأرضيات ومزودة بمقبض حديدي مضلع لمنع الانزلاق أثناء الأوزان الثقيلة.",
    images: [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80"
    ],
    categoryId: "cat-2",
    attributes: [
      { name: "الوزن الزوجي", options: ["10 كيلو (5x2)", "20 كيلو (10x2)", "30 كيلو (15x2)"] }
    ],
    featured: true,
    rating: 4.8,
    reviewsCount: 45
  },
  {
    id: "prod-104",
    code: "GYM-104",
    name: "تيشيرت ضاغط احترافي للتمرين PRO COMPRESSION T-SHIRT",
    price: 650.00,
    originalPrice: 790.00,
    description: "تيشيرت ضاغط مرن بخامة مسامية طاردة للعرق تحافظ على برودة وصحة العضلات وتدعم الحركة الحرة أثناء التدريب المكثف.",
    images: [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
    ],
    categoryId: "cat-3",
    attributes: [
      { name: "اللون", options: ["أسود ستيلث", "أزرق نيون", "رمادي تيتانيوم"] },
      { name: "المقاس", options: ["M", "L", "XL", "2XL"] }
    ],
    featured: false,
    rating: 4.9,
    reviewsCount: 67
  },
  {
    id: "prod-105",
    code: "GYM-105",
    name: "حزام رفع أثقال جلدي طبيعي PRO LIFTING BELT",
    price: 1450.00,
    description: "حزام ضهر احترافي مصمم من الجلد الطبيعي المدعم بإبزيم صلب مزدوج لحماية الظهر وتوفير أقصى ثبات أثناء تمارين السكوات والديدليفت.",
    images: [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
    ],
    categoryId: "cat-2",
    attributes: [
      { name: "المقاس", options: ["S", "M", "L", "XL"] },
      { name: "اللون", options: ["أسود ملكي", "بني جلد طبيعي"] }
    ],
    featured: true,
    rating: 4.9,
    reviewsCount: 38
  },
  {
    id: "prod-106",
    code: "GYM-106",
    name: "باك فيتامينات واستشفاء المفاصل ULTRA GYM VITAMINS",
    price: 890.00,
    description: "تركيبة متكاملة من أوميجا 3 عالية التركيز، فيتامين D3، المغنيسيوم، ومحفزات استشفاء المفاصل والأنسجة الرياضية.",
    images: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80"
    ],
    categoryId: "cat-4",
    attributes: [
      { name: "العبوة", options: ["90 كبسولة", "180 كبسولة"] }
    ],
    featured: true,
    rating: 4.8,
    reviewsCount: 92
  }
];

const DEFAULT_STORE_INFO: StoreInfo = {
  whatsapp: "+201007890123",
  phone: "+201007890123",
  email: "support@thiamgym.com",
  address: "فرع التجمع الخامس / الشيخ زايد / المعادي، القاهرة، مصر",
  socials: {
    facebook: "https://facebook.com/thiamgym",
    instagram: "https://instagram.com/thiamgym",
    tiktok: "https://tiktok.com/@thiamgym",
    twitter: "https://twitter.com/thiamgym"
  },
  seo: {
    title: "ثيام جيم | THIAM GYM & FITNESS",
    description: "المصدر الأول للأدوات الرياضية، المكملات الغذائية الأصلية 100%، الواي بروتين، الكراتين، والملابس الاحترافية للتمرين."
  }
};

const DEFAULT_HOMEPAGE: HomepageBlocks = {
  hero: {
    enabled: true,
    title: "تحدى حدودك وابنِ جسدك القوي ⚡",
    subtitle: "المصدر الأول والأوثق للمكملات الغذائية الأصلية 100% ومعدات الجيم الاحترافية بأفضل الأسعار وتوصيل سريع.",
    bgImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80",
    bgImage2: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80",
    bgImage3: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=400&q=80",
    ctaText: "تصفح المنتجات والمكملات",
    ctaLink: "#shop",
    align: "center"
  },
  featured: {
    enabled: true,
    title: "أفضل مبيعات الجيم والمكملات 💥",
    subtitle: "المكملات والأدوات الرياضية الأعلى تقييماً وطلباً من أبطال اللياقة والتمرين.",
    limit: 6,
    layout: "grid"
  },
  promo: {
    enabled: true,
    title: "عروض اللياقة والتمرين الحصرية",
    banners: [
      {
        id: "promo-1",
        title: "باك بناء العضلات والضخامة",
        subtitle: "احصل على شيكر احترافي مجاناً عند شراء واي بروتين آيزوليت + كراتين مونوهيدرات.",
        image: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=800&q=80",
        link: "#category/supplements",
        size: "half"
      },
      {
        id: "promo-2",
        title: "تجهيز الجيم المنزلي والتدريب",
        subtitle: "خصم خاص على الدامبلز، أحزام الظهر، وحبال المقاومة الاحترافية.",
        image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
        link: "#category/equipment",
        size: "half"
      }
    ]
  },
  testimonials: {
    enabled: true,
    title: "آراء أبطال الجيم والمتدربين",
    list: [
      {
        id: "t-1",
        name: "كابتن أحمد سامي",
        role: "مدرب لياقة بدنية",
        text: "الواي بروتين آيزوليت والكراتين أصلية 100% وسريعة الامتصاص بدون أي مشاكل في الهضم. سرعة التوصيل والتغليف ممتازة جداً.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
      },
      {
        id: "t-2",
        name: "عمر الشريف",
        role: "لاعب كمال أجسام",
        text: "خامة الدامبلز وحزام الظهر متينة جداً وتتحمل الأوزان الثقيلة في التمرين. أفضل متجر رياضي جربته بلا منازع.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
      }
    ]
  },
  newsletter: {
    enabled: false,
    title: "انضم إلى فريق الأبطال",
    description: "اشترك لتصلك نصائح التغذية، برامج التمرين المجانية، والخصومات الحصرية.",
    placeholder: "أدخل بريدك الإلكتروني",
    buttonText: "اشترك الآن"
  },
  blockOrder: ["hero", "featured", "promo", "testimonials"]
};

const DEFAULT_PAGES: StaticPagesContent = {
  about: {
    title: "عن ثيام جيم ورسالتنا الرياضية",
    content: `تأسست ثيام جيم لتكون الواجهة الأولى والأشمل لأبطال اللياقة البدنية والرياضة في الوطن العربي. نحن نوفر مكملات غذائية أصلية 100% مأخوذة مباشرة من المصانع المعتمدة دولياً، بجانب معدات الجيم وملابس التمرين المصممة باحترافية.\n\nهدفنا مساعدتك على الوصول لأقصى أداء بدني وتجاوز أهدافك العضلية بأمان وجودة لا تضاهى.`,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80"
  },
  contact: {
    title: "تواصل مع فريق الدعم الرياضي",
    content: "فريقنا الرياضي ومتخصصو التغذية جاهزون للرد على استفساراتك واختيار المكملات والمعدات المناسبة لنوع تمرينك."
  },
  faq: {
    title: "الأسئلة الشائعة عن المنتجات والتوصيل",
    list: [
      {
        q: "هل المكملات الغذائية أصلية ومضمونة 100%؟",
        a: "نعم جميع المكملات بروتينات وكراتين وفيتامينات أصلية ومستوردة من الموزعين المعتمدين مع باركود الأصالة والتاريخ."
      },
      {
        q: "كيف يتم طلب الشراء والتوصيل؟",
        a: "اختر منتجاتك واضغط إتمام الطلب ليقوم النظام بتجهيز الفاتورة فتح الواتساب للتأكيد والتوصيل خلال 24 إلى 48 ساعة."
      }
    ]
  },
  privacy: {
    title: "سياسة الخصوصية والأمان",
    content: "نحن نلتزم بحماية بياناتك الشخصية وعنوانك، ولن يتم مشاركتها إلا لغرض توصيل الطلب بنجاح."
  },
  terms: {
    title: "الشروط والأحكام",
    content: "جميع المنتجات المعروضة هي للبالغين وممارسي الرياضة، وتخضع لضمان الجودة والاسترجاع في حال التلف."
  }
};

// -------------------------------------------------------------
// IndexedDB Video Store for bypassing localStorage limits
// -------------------------------------------------------------
const DB_NAME = "ThiamMediaDB";
const STORE_NAME = "videos";
const DB_VERSION = 1;

let dbInstance: IDBDatabase | null = null;

const getDB = (): Promise<IDBDatabase> => {
  if (dbInstance) return Promise.resolve(dbInstance);
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};

export const VideoDb = {
  async get(id: string): Promise<string | null> {
    try {
      const db = await getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.error("IndexedDB get error:", e);
      return null;
    }
  },
  async set(id: string, base64Data: string): Promise<void> {
    try {
      const db = await getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(base64Data, id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.error("IndexedDB set error:", e);
    }
  },
  async delete(id: string): Promise<void> {
    try {
      const db = await getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.error("IndexedDB delete error:", e);
    }
  }
};

const KEYS = {
  THEME: "thiam_theme_config",
  CATEGORIES: "thiam_categories",
  STORE_INFO: "thiam_store_info",
  HOMEPAGE: "thiam_homepage_blocks",
  PAGES: "thiam_pages_content",
  CART: "thiam_cart_items",
  WISHLIST: "thiam_wishlist_items",
  COUPONS: "thiam_coupons",
  PRODUCTS: "thiam_products"
};

const DEFAULT_COUPONS = [
  { id: "1", code: "GYM15", type: "percentage", value: 15, minOrderValue: 0, isActive: true },
  { id: "2", code: "PRO500", type: "fixed", value: 100, minOrderValue: 1000, isActive: true }
];

// -------------------------------------------------------------
// Service Implementation
// -------------------------------------------------------------
export const StorageService = {
  // Central init function to seed defaults if missing
  init() {
    // Check version and clear old local caches if mismatched to force database re-sync
    const storedVersion = localStorage.getItem("thiam_store_version");
    if (storedVersion !== APP_VERSION) {
      localStorage.removeItem(KEYS.THEME);
      localStorage.removeItem(KEYS.CATEGORIES);
      localStorage.removeItem(KEYS.PRODUCTS);
      localStorage.removeItem(KEYS.STORE_INFO);
      localStorage.removeItem(KEYS.HOMEPAGE);
      localStorage.removeItem(KEYS.PAGES);
      localStorage.removeItem(KEYS.COUPONS);
      localStorage.removeItem(KEYS.CART);
      localStorage.removeItem(KEYS.WISHLIST);
      localStorage.removeItem("thiam_cloud_settings");
      
      localStorage.setItem("thiam_store_version", APP_VERSION);
    }

    // Check if localStorage has old perfume data, migrate to Gym theme
    const existingTheme = localStorage.getItem(KEYS.THEME);
    if (existingTheme && (existingTheme.includes("maisonoud") || existingTheme.includes("عود") || existingTheme.includes("Outfit"))) {
      localStorage.removeItem(KEYS.THEME);
      localStorage.removeItem(KEYS.CATEGORIES);
      localStorage.removeItem(KEYS.PRODUCTS);
      localStorage.removeItem(KEYS.STORE_INFO);
      localStorage.removeItem(KEYS.HOMEPAGE);
      localStorage.removeItem(KEYS.PAGES);
    }

    if (!localStorage.getItem(KEYS.THEME)) {
      localStorage.setItem(KEYS.THEME, JSON.stringify(DEFAULT_THEME));
    }
    if (!localStorage.getItem(KEYS.CATEGORIES)) {
      localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    }
    if (!localStorage.getItem(KEYS.PRODUCTS)) {
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    }
    if (!localStorage.getItem(KEYS.STORE_INFO)) {
      localStorage.setItem(KEYS.STORE_INFO, JSON.stringify(DEFAULT_STORE_INFO));
    }
    if (!localStorage.getItem(KEYS.HOMEPAGE)) {
      localStorage.setItem(KEYS.HOMEPAGE, JSON.stringify(DEFAULT_HOMEPAGE));
    }
    if (!localStorage.getItem(KEYS.PAGES)) {
      localStorage.setItem(KEYS.PAGES, JSON.stringify(DEFAULT_PAGES));
    }
    if (!localStorage.getItem(KEYS.CART)) {
      localStorage.setItem(KEYS.CART, JSON.stringify([]));
    }
    if (!localStorage.getItem(KEYS.WISHLIST)) {
      localStorage.setItem(KEYS.WISHLIST, JSON.stringify([]));
    }
    if (!localStorage.getItem(KEYS.COUPONS)) {
      localStorage.setItem(KEYS.COUPONS, JSON.stringify(DEFAULT_COUPONS));
    }
  },

  // Reset database back to default gym seed values
  resetToDefaults() {
    localStorage.setItem(KEYS.THEME, JSON.stringify(DEFAULT_THEME));
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    localStorage.setItem(KEYS.STORE_INFO, JSON.stringify(DEFAULT_STORE_INFO));
    localStorage.setItem(KEYS.HOMEPAGE, JSON.stringify(DEFAULT_HOMEPAGE));
    localStorage.setItem(KEYS.COUPONS, JSON.stringify(DEFAULT_COUPONS));
    localStorage.setItem(KEYS.PAGES, JSON.stringify(DEFAULT_PAGES));
    localStorage.setItem(KEYS.CART, JSON.stringify([]));
    localStorage.setItem(KEYS.WISHLIST, JSON.stringify([]));
  },

  // Cloud Settings & Sync Utilities
  getCloudSettings(): CloudSettings {
    const defaultSettings = {
      databaseUrl: CLOUD_CONFIG.databaseUrl || "",
      imgbbApiKey: CLOUD_CONFIG.imgbbApiKey || ""
    };
    try {
      const stored = localStorage.getItem("thiam_cloud_settings");
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          databaseUrl: parsed.databaseUrl || defaultSettings.databaseUrl,
          imgbbApiKey: parsed.imgbbApiKey || defaultSettings.imgbbApiKey
        };
      }
    } catch (e) {
      console.error("Error reading cloud settings:", e);
    }
    return defaultSettings;
  },

  saveCloudSettings(settings: CloudSettings): void {
    localStorage.setItem("thiam_cloud_settings", JSON.stringify(settings));
  },

  async syncFromCloud(): Promise<boolean> {
    const settings = this.getCloudSettings();
    if (!settings.databaseUrl) {
      return false; // No cloud database URL configured
    }

    try {
      let url = settings.databaseUrl.trim();
      if (url.endsWith("/")) {
        url = url.slice(0, -1);
      }
      if (!url.endsWith(".json")) {
        url = `${url}/store.json`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const cloudData = await response.json();
      if (cloudData && typeof cloudData === "object" && Object.keys(cloudData).length > 0) {
        if (cloudData.theme) localStorage.setItem(KEYS.THEME, JSON.stringify(cloudData.theme));
        if (cloudData.categories) {
          const cats = Array.isArray(cloudData.categories) ? cloudData.categories : Object.values(cloudData.categories);
          localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(cats));
        }
        if (cloudData.products) {
          const prods = Array.isArray(cloudData.products) ? cloudData.products : Object.values(cloudData.products);
          localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(prods));
        }
        if (cloudData.storeInfo) localStorage.setItem(KEYS.STORE_INFO, JSON.stringify(cloudData.storeInfo));
        if (cloudData.homepage) localStorage.setItem(KEYS.HOMEPAGE, JSON.stringify(cloudData.homepage));
        if (cloudData.pages) localStorage.setItem(KEYS.PAGES, JSON.stringify(cloudData.pages));
        if (cloudData.coupons) {
          const c = Array.isArray(cloudData.coupons) ? cloudData.coupons : Object.values(cloudData.coupons);
          localStorage.setItem(KEYS.COUPONS, JSON.stringify(c));
        }
        return true;
      } else {
        // Cloud database is empty (null). Seed it with default store data!
        console.log("Cloud database is empty. Seeding initial store data to cloud database...");
        await this.syncToCloud();
        return true;
      }
    } catch (err) {
      console.error("Error fetching from cloud database:", err);
    }
    return false;
  },

  async syncToCloud(): Promise<boolean> {
    const settings = this.getCloudSettings();
    if (!settings.databaseUrl) {
      return false;
    }

    try {
      let url = settings.databaseUrl.trim();
      if (url.endsWith("/")) {
        url = url.slice(0, -1);
      }
      if (!url.endsWith(".json")) {
        url = `${url}/store.json`;
      }

      const payload = {
        theme: this.getTheme(),
        categories: this.getCategories(),
        products: this.getProducts(),
        storeInfo: this.getStoreInfo(),
        homepage: this.getHomepage(),
        pages: this.getPages(),
        coupons: this.getCoupons()
      };

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return true;
    } catch (err) {
      console.error("Error syncing to cloud database:", err);
      return false;
    }
  },

  async uploadImageToCloud(file: File): Promise<string> {
    const settings = this.getCloudSettings();
    if (!settings.imgbbApiKey) {
      throw new Error("لم يتم تكوين مفتاح API لـ ImgBB.");
    }

    // Convert file to Base64 string for ImgBB payload compatibility
    const base64String = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

    const formData = new FormData();
    formData.append("image", base64String);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${settings.imgbbApiKey.trim()}`, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `HTTP error! status: ${response.status}`);
    }

    const resData = await response.json();
    if (resData && resData.data && (resData.data.url || resData.data.display_url)) {
      return resData.data.display_url || resData.data.url;
    } else {
      throw new Error("فشل الحصول على رابط الصورة من ImgBB.");
    }
  },

  // Theme Config
  getTheme(): ThemeConfig {
    this.init();
    return JSON.parse(localStorage.getItem(KEYS.THEME)!);
  },
  saveTheme(theme: ThemeConfig): void {
    localStorage.setItem(KEYS.THEME, JSON.stringify(theme));
    this.syncToCloud();
  },

  // Categories
  getCategories(): Category[] {
    this.init();
    try {
      const data = localStorage.getItem(KEYS.CATEGORIES);
      if (!data) return DEFAULT_CATEGORIES;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : Object.values(parsed);
    } catch (e) {
      return DEFAULT_CATEGORIES;
    }
  },
  saveCategories(categories: Category[]): void {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
    this.syncToCloud();
  },

  // Products
  getProducts(): Product[] {
    this.init();
    try {
      const data = localStorage.getItem(KEYS.PRODUCTS);
      if (!data) return DEFAULT_PRODUCTS;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : Object.values(parsed);
    } catch (e) {
      return DEFAULT_PRODUCTS;
    }
  },
  saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error("Failed to save products to localStorage directly:", e);
    }
    this.syncToCloud();
  },

  async saveMedia(productId: string, base64Data: string): Promise<string> {
    const mediaId = `video-${productId}`;
    await VideoDb.set(mediaId, base64Data);

    const settings = this.getCloudSettings();
    if (settings.databaseUrl) {
      try {
        let dbUrl = settings.databaseUrl.trim();
        if (dbUrl.endsWith("/")) dbUrl = dbUrl.slice(0, -1);
        await fetch(`${dbUrl}/videos/${productId}.json`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ data: base64Data })
        });
      } catch (err) {
        console.error("Error saving video to cloud:", err);
      }
    }
    return `db-media://${mediaId}`;
  },

  async resolveMediaUrl(url: string, productId: string): Promise<string> {
    if (!url) return "";
    if (!url.startsWith("db-media://")) return url;

    const mediaId = url.replace("db-media://", "");
    try {
      const cached = await VideoDb.get(mediaId);
      if (cached) return cached;
    } catch (e) {
      console.error("Error reading from local DB:", e);
    }

    const settings = this.getCloudSettings();
    if (settings.databaseUrl) {
      try {
        let dbUrl = settings.databaseUrl.trim();
        if (dbUrl.endsWith("/")) dbUrl = dbUrl.slice(0, -1);
        const response = await fetch(`${dbUrl}/videos/${productId}.json`);
        if (response.ok) {
          const json = await response.json();
          if (json && json.data) {
            await VideoDb.set(mediaId, json.data);
            return json.data;
          }
        }
      } catch (err) {
        console.error("Error fetching video from cloud:", err);
      }
    }

    return "";
  },

  async deleteMedia(productId: string): Promise<void> {
    const mediaId = `video-${productId}`;
    await VideoDb.delete(mediaId);

    const settings = this.getCloudSettings();
    if (settings.databaseUrl) {
      try {
        let dbUrl = settings.databaseUrl.trim();
        if (dbUrl.endsWith("/")) dbUrl = dbUrl.slice(0, -1);
        await fetch(`${dbUrl}/videos/${productId}.json`, { method: "DELETE" });
      } catch (err) {
        console.error("Error deleting video from cloud:", err);
      }
    }
  },

  // Store Info
  getStoreInfo(): StoreInfo {
    this.init();
    return JSON.parse(localStorage.getItem(KEYS.STORE_INFO)!);
  },
  saveStoreInfo(info: StoreInfo): void {
    localStorage.setItem(KEYS.STORE_INFO, JSON.stringify(info));
    this.syncToCloud();
  },

  // Homepage Blocks
  getHomepage(): HomepageBlocks {
    this.init();
    return JSON.parse(localStorage.getItem(KEYS.HOMEPAGE)!);
  },
  saveHomepage(homepage: HomepageBlocks): void {
    localStorage.setItem(KEYS.HOMEPAGE, JSON.stringify(homepage));
    this.syncToCloud();
  },

  // Static Pages
  getPages(): StaticPagesContent {
    this.init();
    return JSON.parse(localStorage.getItem(KEYS.PAGES)!);
  },
  savePages(pages: StaticPagesContent): void {
    localStorage.setItem(KEYS.PAGES, JSON.stringify(pages));
    this.syncToCloud();
  },

  // Cart Items
  getCart(): any[] {
    this.init();
    try {
      const data = localStorage.getItem(KEYS.CART);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error reading cart from localStorage:", e);
      return [];
    }
  },
  saveCart(cart: any[]): void {
    try {
      // Strip large videoUrl from products in the cart to avoid localStorage QuotaExceededError
      const cleanedCart = cart.map((item) => {
        if (item.product && typeof item.product === "object") {
          const { videoUrl, ...rest } = item.product;
          return { ...item, product: rest };
        }
        return item;
      });
      localStorage.setItem(KEYS.CART, JSON.stringify(cleanedCart));
    } catch (e) {
      console.error("Error saving cart to localStorage:", e);
    }
  },

  // Wishlist Items
  getWishlist(): string[] {
    this.init();
    return JSON.parse(localStorage.getItem(KEYS.WISHLIST)!);
  },
  saveWishlist(wishlist: string[]): void {
    localStorage.setItem(KEYS.WISHLIST, JSON.stringify(wishlist));
  },

  // Coupons / Promo Codes
  getCoupons(): Coupon[] {
    this.init();
    return JSON.parse(localStorage.getItem(KEYS.COUPONS)!);
  },
  saveCoupons(coupons: Coupon[]): void {
    localStorage.setItem(KEYS.COUPONS, JSON.stringify(coupons));
    this.syncToCloud();
  }
};
