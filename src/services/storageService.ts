// Storage Service for single-tenant ThemeForest-style E-Commerce Template
// This service abstracts all localStorage operations.
import { CLOUD_CONFIG } from "../config";

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
    facebook: string;
    instagram: string;
    tiktok: string;
    twitter: string;
  };
  seo: {
    title: string;
    description: string;
  };
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  role: string;
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
  blockOrder: string[]; // e.g. ["hero", "featured", "promo", "testimonials", "newsletter"]
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
// Seed default configurations (Luxury Perfume Maison style)
// -------------------------------------------------------------
const DEFAULT_THEME: ThemeConfig = {
  logo: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=120&q=80",
  favicon: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=32&q=80",
  colors: {
    primary: "#0b0f19",      // Premium slate black
    secondary: "#64748b",    // Muted slate gray
    accent: "#c5a880",       // Luxury gold/champagne accent
    background: "#faf9f6",   // Warm off-white
    text: "#1e293b",         // Charcoal text
    cardBg: "#ffffff",       // Pure white cards
    border: "#e2e8f0"        // Soft slate gray borders
  },
  fonts: {
    heading: "Cairo",
    body: "Cairo"
  },
  ui: {
    borderRadius: "12px",
    buttonStyle: "solid"
  },
  layoutStyle: "luxury",
  announcementText: "✨ شحن مجاني لجميع الطلبات فوق 500 جنيه بمناسبة الافتتاح! خصم 10% بكود: START ✨",
  announcementEnabled: true
};

const DEFAULT_CATEGORIES: Category[] = [
  { id: "cat-1", name: "العود والروائح الخشبية", slug: "oud-woody", image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=400&q=80" },
  { id: "cat-2", name: "الزهور والورود", slug: "floral-rose", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=400&q=80" },
  { id: "cat-3", name: "الحمضيات والانتعاش", slug: "fresh-citrus", image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=400&q=80" },
  { id: "cat-4", name: "المسك والروائح الحلوة", slug: "musk-sweet", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=400&q=80" }
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    code: "101",
    name: "صندل رويال إيليت",
    price: 185.00,
    originalPrice: 220.00,
    description: "عطر ساحر يحتفي بخلاصة خشب الصندل العريقة. يوازن ببراعة بين النغمات الخشبية الداكنة والجلود الفاخرة، مع لمسات دافئة من العود النقي والورد الطبيعي المثير.",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80"
    ],
    categoryId: "cat-1",
    attributes: [
      { name: "الحجم", options: ["50 مل", "100 مل", "200 مل"] },
      { name: "التركيز", options: ["أو دو برفان", "إكستريت دو برفان"] }
    ],
    featured: true,
    rating: 4.8,
    reviewsCount: 42
  },
  {
    id: "prod-2",
    code: "102",
    name: "عود سيلك فلفيت",
    price: 195.00,
    description: "رائحة حريرية ناعمة تمتزج فيها نفحات الورد البلغاري الفاخر والبابونج الأزرق، منسوجة بمهارة مع قاعدة عطرية دافئة من خشب العود اللاوسي الطبيعي ونسمات البردي الغنية.",
    images: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80"
    ],
    categoryId: "cat-1",
    attributes: [
      { name: "الحجم", options: ["100 مل"] }
    ],
    featured: true,
    rating: 4.9,
    reviewsCount: 29
  },
  {
    id: "prod-3",
    code: "103",
    name: "إمبيريال روز آند بيوني",
    price: 145.00,
    originalPrice: 165.00,
    description: "باقة زهرية منعشة ومشرقة تجسد بتلات الورد الدمشقي المخملية الممزوجة بنقاء المسك الأبيض والماندرين الفوار وزهور الفاوانيا الوردية المنعشة.",
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80"
    ],
    categoryId: "cat-2",
    attributes: [
      { name: "الحجم", options: ["50 مل", "100 مل"] },
      { name: "نوع العلبة", options: ["علبة قياسية", "علبة هدايا فاخرة"] }
    ],
    featured: true,
    rating: 4.6,
    reviewsCount: 18
  },
  {
    id: "prod-4",
    code: "104",
    name: "سيتروس نيرولي إنفيوجن",
    price: 130.00,
    description: "نسيم حيوي مشبع بأشعة الشمس من زهر البرتقال والبرغموت وخشب البرتقال المر. يجسد نزهة ساحلية منعشة على شواطئ الريفييرا الإيطالية.",
    images: [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80"
    ],
    categoryId: "cat-3",
    attributes: [
      { name: "الحجم", options: ["100 مل", "150 مل"] }
    ],
    featured: false,
    rating: 4.7,
    reviewsCount: 35
  },
  {
    id: "prod-5",
    code: "105",
    name: "جولدن مسك إنتنس",
    price: 160.00,
    description: "رائحة مخملية حسية يهيمن عليها المسك الأبيض الفاخر، خشب الأرز الدافئ، فانيليا مدغشقر الحلوة، ونسمات بودرة العنبر الناعمة.",
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80"
    ],
    categoryId: "cat-4",
    attributes: [
      { name: "الحجم", options: ["50 مل", "100-مل"] }
    ],
    featured: true,
    rating: 4.9,
    reviewsCount: 57
  }
];

const DEFAULT_STORE_INFO: StoreInfo = {
  whatsapp: "+201007890123",
  phone: "+201007890123",
  email: "contact@maisonoud.com",
  address: "12 شارع مونتين، باريس، فرنسا / التجمع الخامس، القاهرة، مصر",
  socials: {
    facebook: "https://facebook.com/maisonoud",
    instagram: "https://instagram.com/maisonoud",
    tiktok: "https://tiktok.com/@maisonoud",
    twitter: "https://twitter.com/maisonoud"
  },
  seo: {
    title: "ميزون عود | عطور فاخرة ونادرة",
    description: "اختبر الفخامة المطلقة مع ميزون عود. عطور حصرية مستخلصة يدوياً من زيت العود النقي وخشب الصندل والورد الدمشقي الأصيل."
  }
};

const DEFAULT_HOMEPAGE: HomepageBlocks = {
  hero: {
    enabled: true,
    title: "فن العطور الراقية والفاخرة",
    subtitle: "اكتشف مجموعتنا الخاصة والحصرية من العطور الفاخرة المستخلصة من أندر المكونات الطبيعية في العالم.",
    bgImage: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1600&q=80",
    bgImage2: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80",
    bgImage3: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=400&q=80",
    ctaText: "اكتشف المجموعة",
    ctaLink: "#shop",
    align: "center"
  },
  featured: {
    enabled: true,
    title: "روائع عطرية مختارة",
    subtitle: "مجموعة من العطور المميزة والفريدة المختارة بعناية لأصحاب الذوق العطري الرفيع.",
    limit: 4,
    layout: "grid"
  },
  promo: {
    enabled: true,
    title: "العروض الحصرية الخاصة",
    banners: [
      {
        id: "promo-1",
        title: "مجموعة العود الخاصة والفاخرة",
        subtitle: "احصل على علبة قطيفة ملكية فاخرة مجاناً مع كل عملية شراء لعطر عود بحجم 100 مل.",
        image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
        link: "#category/oud-woody",
        size: "half"
      },
      {
        id: "promo-2",
        title: "صناديق الهدايا المميزة والتذكارية",
        subtitle: "صمم صندوق هداياك الخاص بـ 3 عبوات صغيرة بحجم 15 مل لتجربة عطورنا الأكثر مبيعاً.",
        image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
        link: "#shop",
        size: "half"
      }
    ]
  },
  testimonials: {
    enabled: true,
    title: "حكايات عطرية من عملائنا",
    list: [
      {
        id: "t-1",
        name: "أميرة حسن",
        role: "عميل مؤكد",
        text: "صندل رويال إيليت أصبح عطري المفضل والمميز بلا منافس. ثبات خشب الصندل والورد يدوم لأكثر من 24 ساعة، والتغليف فاخر وجذاب للغاية.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
      },
      {
        id: "t-2",
        name: "يوسف المنصوري",
        role: "خبير عطور",
        text: "عطر عود سيلك فلفيت هو تحفة فنية حقيقية. دمج خشب العود مع نسمات البابونج يضفي رقياً ونعومة غير مسبوقة تختلف تماماً عن باقي عطور العود الثقيلة.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
      }
    ]
  },
  newsletter: {
    enabled: false,
    title: "انضم إلى نادينا الخاص والمغلق",
    description: "اشترك لتكون أول من يعلم بإطلاق مجموعات العطور الخاصة والمحدودة، والحفلات الخاصة والخصومات الحصرية لأعضاء النادي.",
    placeholder: "أدخل بريدك الإلكتروني هنا",
    buttonText: "اشترك الآن"
  },
  blockOrder: ["hero", "featured", "promo", "testimonials"]
};

const DEFAULT_PAGES: StaticPagesContent = {
  about: {
    title: "تراثنا وقصتنا العريقة",
    content: `تأسست ميزون عود برؤية واضحة تهدف لإعادة تعريف الترف العطري وصياغة تجارب حسية غير مسبوقة تدوم طويلاً. يستخلص خبراؤنا زيت العود الهندي النقي من آسام، وبتلات الورد الدمشقي العطرية من مرتفعات سوريا، وخلاصة خشب الصندل العضوي من سريلانكا.\n\nكل زجاجة تمثل شهوراً من التعتيق والمطابقة الدقيقة، وتُصب يدوياً في زجاجات مصممة خصيصاً لحجب الأشعة فوق البنفسجية وحفظ جودة الزيوت العطرية. التزامنا بمصادر الاستدامة يضمن حماية المكونات الطبيعية وإعادة زراعتها.`,
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80"
  },
  contact: {
    title: "تواصل معنا مباشرة",
    content: "يسعدنا دائماً استقبالكم في معارضنا أو مساعدتكم عبر الإنترنت. للاستفسارات العامة، أو لحجز جلسات استشارية خاصة باختيار العطور، يرجى ملء النموذج وسنتواصل معكم في غضون ساعتين."
  },
  faq: {
    title: "الأسئلة الشائعة",
    list: [
      {
        q: "ما الفرق بين أو دو برفان وإكستريت دو برفان؟",
        a: "يحتوي أو دو برفان (EDP) عادة على تركيز عطري يتراوح بين 15% و20%، ويدوم من 6 إلى 8 ساعات. بينما يمثل إكستريت دو برفان أعلى تركيز عطري بنسبة 20% إلى 40%، مما يمنحه ثباتاً وفواحاً فائقاً يدوم من 12 إلى 24 ساعة فأكثر."
      },
      {
        q: "كيف تعمل عملية الشراء عبر واتس آب؟",
        a: "بعد مراجعة المنتجات وإدخال عنوانك في صفحة الدفع، سيقوم النظام تلقائياً بتجميع تفاصيل طلبك وإعداد فاتورة منسقة باللغة العربية، ثم يفتح محادثة واتس آب مباشرة مع خدمة العملاء لإرسالها وتأكيد الشحن والطلب في ثوانٍ!"
      },
      {
        q: "هل يتوفر الشحن الدولي لمختلف الدول؟",
        a: "نعم، نشحن لجميع دول العالم عن طريق DHL Express، وتُعبأ جميع العطور في صناديق معزولة حرارياً لضمان الحفاظ على ثبات الزيوت العطرية أثناء الشحن."
      }
    ]
  },
  privacy: {
    title: "سياسة الخصوصية وسرية البيانات",
    content: "خصوصيتك تهمنا للغاية. نظراً لأن هذا المتجر يعمل بالكامل في الواجهة الأمامية (Frontend) وبدون خوادم تخزين، فنحن لا نحفظ بياناتك الشخصية في قواعد بيانات خارجية. تُخزن بيانات السلة محلياً في متصفحك (localStorage). البيانات الوحيدة التي تخرج هي التي تختار إرسالها بنفسك كرسالة واتساب."
  },
  terms: {
    title: "الشروط والأحكام وسياسات البيع",
    content: "بإرسال طلبك عبر واتساب، فإنك تبدأ استفساراً مباشراً حول توفر المنتجات. الأسعار المعروضة هي قيم استرشادية، ويتم تأكيد الطلب النهائي وتكاليف التوصيل من خلال التواصل المباشر مع ممثل المبيعات في محادثة الواتساب."
  }
};

// -------------------------------------------------------------
// Storage Keys Helper
// -------------------------------------------------------------
const KEYS = {
  THEME: "ecommerce_theme_config",
  PRODUCTS: "ecommerce_products",
  CATEGORIES: "ecommerce_categories",
  STORE_INFO: "ecommerce_store_info",
  HOMEPAGE: "ecommerce_homepage_blocks",
  PAGES: "ecommerce_pages_content",
  CART: "ecommerce_cart_items",
  WISHLIST: "ecommerce_wishlist_items",
  COUPONS: "ecommerce_coupons"
};

const DEFAULT_COUPONS = [
  { id: "1", code: "MAISON10", type: "percentage", value: 10, minOrderValue: 0, isActive: true },
  { id: "2", code: "WELCOME50", type: "fixed", value: 50, minOrderValue: 200, isActive: true }
];

// -------------------------------------------------------------
// Service Implementation
// -------------------------------------------------------------
export const StorageService = {
  // Central init function to seed defaults if missing
  init() {
    // Auto-migration: check if existing localStorage seeds are using the old English configs (Outfit font)
    const existingTheme = localStorage.getItem(KEYS.THEME);
    if (existingTheme && existingTheme.includes("Outfit")) {
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

  // Reset database back to default luxury seed values
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
      const stored = localStorage.getItem("ecommerce_cloud_settings");
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
    localStorage.setItem("ecommerce_cloud_settings", JSON.stringify(settings));
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
        if (cloudData.categories) localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(cloudData.categories));
        if (cloudData.products) localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(cloudData.products));
        if (cloudData.storeInfo) localStorage.setItem(KEYS.STORE_INFO, JSON.stringify(cloudData.storeInfo));
        if (cloudData.homepage) localStorage.setItem(KEYS.HOMEPAGE, JSON.stringify(cloudData.homepage));
        if (cloudData.pages) localStorage.setItem(KEYS.PAGES, JSON.stringify(cloudData.pages));
        if (cloudData.coupons) localStorage.setItem(KEYS.COUPONS, JSON.stringify(cloudData.coupons));
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
    return JSON.parse(localStorage.getItem(KEYS.CATEGORIES)!);
  },
  saveCategories(categories: Category[]): void {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
    this.syncToCloud();
  },

  // Products
  getProducts(): Product[] {
    this.init();
    return JSON.parse(localStorage.getItem(KEYS.PRODUCTS)!);
  },
  saveProducts(products: Product[]): void {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
    this.syncToCloud();
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
    return JSON.parse(localStorage.getItem(KEYS.CART)!);
  },
  saveCart(cart: any[]): void {
    localStorage.setItem(KEYS.CART, JSON.stringify(cart));
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
