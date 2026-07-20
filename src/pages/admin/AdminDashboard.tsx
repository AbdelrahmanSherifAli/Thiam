import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";
import { StorageService } from "../../services/storageService";
import type { Product, Category } from "../../services/storageService";
import { ADMIN_CREDENTIALS } from "../../config";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Home as HomeIcon,
  Palette,
  Info,
  FileText,
  RotateCcw,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Eye,
  Settings,
  Tag
} from "lucide-react";
import "../../styles/admin.css";

export const AdminDashboard: React.FC = () => {
  const {
    theme,
    products,
    categories,
    storeInfo,
    homepage,
    pages,
    coupons,
    setCurrentView,
    updateTheme,
    updateProducts,
    updateCategories,
    updateStoreInfo,
    updateHomepage,
    updatePages,
    updateCoupons,
    resetAll
  } = useStore();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("admin_auth") === "true";
  });
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput === ADMIN_CREDENTIALS.email && passwordInput === ADMIN_CREDENTIALS.password) {
      sessionStorage.setItem("admin_auth", "true");
      setIsAuthenticated(true);
      setAuthError(null);
    } else {
      setAuthError("خطأ في البريد الإلكتروني أو كلمة المرور!");
    }
  };

  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedSection, setSelectedSection] = useState<"hero" | "featured" | "promo" | "testimonials" | "newsletter">("hero");

  // --- CRUD Modals State ---
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // --- Form State: Products ---
  const [prodName, setProdName] = useState("");
  const [prodCode, setProdCode] = useState("");
  const [prodPrice, setProdPrice] = useState(0);
  const [prodOriginalPrice, setProdOriginalPrice] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodImagesList, setProdImagesList] = useState<string[]>([]);
  const [manualImageUrl, setManualImageUrl] = useState("");
  const [prodCategoryId, setProdCategoryId] = useState("");
  const [prodFeatured, setProdFeatured] = useState(false);
  const [prodIsSoldOut, setProdIsSoldOut] = useState(false);
  const [prodRating, setProdRating] = useState(4.5);
  const [prodReviews, setProdReviews] = useState(10);
  // Dynamic Attributes builder
  const [prodAttrs, setProdAttrs] = useState<{ name: string; options: string[]; tempOption?: string; tempOptionPrice?: string }[]>([]);

  // --- Form State: Categories ---
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catImage, setCatImage] = useState("");

  // --- Form State: Coupons ---
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponType, setCouponType] = useState<"percentage" | "fixed">("percentage");
  const [couponValue, setCouponValue] = useState(0);
  const [couponMinOrder, setCouponMinOrder] = useState(0);
  const [couponActive, setCouponActive] = useState(true);

  // Compress image file or upload it to Cloud Storage (ImgBB) if configured
  const compressImage = async (file: File): Promise<string> => {
    const settings = StorageService.getCloudSettings();
    if (settings.imgbbApiKey) {
      try {
        const url = await StorageService.uploadImageToCloud(file);
        return url;
      } catch (err: any) {
        console.warn("Cloud image upload failed or blocked by AdBlocker/Shields, falling back to compressed base64:", err);
      }
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxWidth = 800;
          const maxHeight = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        };
        img.onerror = () => resolve(event.target?.result as string);
      };
      reader.onerror = () => resolve("");
    });
  };

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const compressed = await compressImage(files[i]);
      if (compressed) {
        newImages.push(compressed);
      }
    }
    setProdImagesList((prev) => [...prev, ...newImages]);
    // Clear input
    e.target.value = "";
  };

  const handleCategoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const compressed = await compressImage(files[0]);
    setCatImage(compressed);
    e.target.value = "";
  };

  const addManualImageUrl = () => {
    if (manualImageUrl.trim()) {
      setProdImagesList((prev) => [...prev, manualImageUrl.trim()]);
      setManualImageUrl("");
    }
  };

  const removeProductImage = (idx: number) => {
    setProdImagesList((prev) => prev.filter((_, i) => i !== idx));
  };

  // --- Form Actions: Products ---
  const openAddProduct = () => {
    setEditingProduct(null);
    setProdName("");
    setProdCode("");
    setProdPrice(0);
    setProdOriginalPrice("");
    setProdDesc("");
    setProdImagesList([]);
    setManualImageUrl("");
    setProdCategoryId(categories[0]?.id || "");
    setProdFeatured(false);
    setProdIsSoldOut(false);
    setProdRating(5.0);
    setProdReviews(5);
    setProdAttrs([]);
    setIsProductModalOpen(true);
  };

  const openEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProdName(prod.name || "");
    setProdCode(prod.code || "");
    setProdPrice(prod.price || 0);
    setProdOriginalPrice(prod.originalPrice ? prod.originalPrice.toString() : "");
    setProdDesc(prod.description || "");
    setProdImagesList(Array.isArray(prod.images) ? prod.images : []);
    setManualImageUrl("");
    setProdCategoryId(prod.categoryId || "");
    setProdFeatured(!!prod.featured);
    setProdIsSoldOut(!!prod.isSoldOut);
    setProdRating(prod.rating || 5);
    setProdReviews(prod.reviewsCount || 0);
    
    const attrs = Array.isArray(prod.attributes) ? prod.attributes : [];
    setProdAttrs(
      attrs.map((attr) => ({
        name: attr.name || "",
        options: Array.isArray(attr.options) ? attr.options : [],
        tempOption: ""
      }))
    );
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || prodPrice <= 0 || !prodCategoryId) {
      alert("الاسم، السعر الصالح، والقسم مطلوبة.");
      return;
    }

    const imagesArray = [...prodImagesList];
    
    // If no images provided, use a default placeholder
    if (imagesArray.length === 0) {
      imagesArray.push("https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80");
    }

    // Filter out rows with no options or no names
    const formattedAttrs = prodAttrs
      .filter((attr) => attr.name.trim().length > 0 && attr.options.length > 0)
      .map((attr) => ({
        name: attr.name.trim(),
        options: attr.options.map((opt) => opt.trim()).filter((opt) => opt.length > 0)
      }));

    if (editingProduct) {
      // Modify existing product
      const updated = products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: prodName,
              code: prodCode.trim() || undefined,
              price: prodPrice,
              originalPrice: prodOriginalPrice ? Number(prodOriginalPrice) : undefined,
              description: prodDesc,
              images: imagesArray,
              categoryId: prodCategoryId,
              featured: prodFeatured,
              isSoldOut: prodIsSoldOut,
              rating: prodRating,
              reviewsCount: prodReviews,
              attributes: formattedAttrs
            }
          : p
      );
      updateProducts(updated);
    } else {
      // Create new product
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        name: prodName,
        code: prodCode.trim() || undefined,
        price: prodPrice,
        originalPrice: prodOriginalPrice ? Number(prodOriginalPrice) : undefined,
        description: prodDesc,
        images: imagesArray,
        categoryId: prodCategoryId,
        featured: prodFeatured,
        isSoldOut: prodIsSoldOut,
        rating: prodRating,
        reviewsCount: prodReviews,
        attributes: formattedAttrs
      };
      updateProducts([...products, newProd]);
    }

    setIsProductModalOpen(false);
  };

  const handleProductDelete = (id: string) => {
    if (window.confirm("هل أنت متأكد من رغبتك في حذف هذا المنتج؟")) {
      updateProducts(products.filter((p) => p.id !== id));
    }
  };

  const addAttrRow = () => {
    setProdAttrs([...prodAttrs, { name: "", options: [], tempOption: "", tempOptionPrice: "" }]);
  };

  const removeAttrRow = (idx: number) => {
    setProdAttrs(prodAttrs.filter((_, i) => i !== idx));
  };

  const handleAttrRowNameChange = (idx: number, name: string) => {
    const updated = [...prodAttrs];
    updated[idx].name = name;
    setProdAttrs(updated);
  };

  const handleAttrRowTempOptionChange = (idx: number, val: string) => {
    const updated = [...prodAttrs];
    updated[idx].tempOption = val;
    setProdAttrs(updated);
  };

  const handleAttrRowTempOptionPriceChange = (idx: number, val: string) => {
    const updated = [...prodAttrs];
    updated[idx].tempOptionPrice = val;
    setProdAttrs(updated);
  };

  const addAttrOption = (idx: number) => {
    const row = prodAttrs[idx];
    const opt = row.tempOption?.trim();
    if (!opt) return;

    const priceAdjust = parseFloat(row.tempOptionPrice || "0");
    const optionText = priceAdjust > 0 ? `${opt} (+${priceAdjust} EGP)` : opt;

    if (row.options.includes(optionText)) return;

    const updated = [...prodAttrs];
    updated[idx].options = [...row.options, optionText];
    updated[idx].tempOption = "";
    updated[idx].tempOptionPrice = "";
    setProdAttrs(updated);
  };

  const removeAttrOption = (idx: number, optIdx: number) => {
    const updated = [...prodAttrs];
    updated[idx].options = updated[idx].options.filter((_, i) => i !== optIdx);
    setProdAttrs(updated);
  };

  // --- Form Actions: Categories ---
  const openAddCategory = () => {
    setEditingCategory(null);
    setCatName("");
    setCatSlug("");
    setCatImage("");
    setIsCategoryModalOpen(true);
  };

  const openEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatImage(cat.image || "");
    setIsCategoryModalOpen(true);
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName || !catSlug) {
      alert("الاسم والرابط اللطيف مطلوبان.");
      return;
    }

    const cleanSlug = catSlug.toLowerCase().replace(/\s+/g, "-");

    if (editingCategory) {
      const updated = categories.map((c) =>
        c.id === editingCategory.id
          ? { ...c, name: catName, slug: cleanSlug, image: catImage || undefined }
          : c
      );
      updateCategories(updated);
    } else {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: catName,
        slug: cleanSlug,
        image: catImage || undefined
      };
      updateCategories([...categories, newCat]);
    }
    setIsCategoryModalOpen(false);
  };

  const handleCategoryDelete = (id: string) => {
    // Check if category is used by products
    const inUse = products.some((p) => p.categoryId === id);
    if (inUse) {
      alert("لا يمكن حذف القسم لأنه مرتبط بمنتجات حالية. يرجى إعادة تعيين منتجات هذا القسم أولاً.");
      return;
    }
    if (window.confirm("هل أنت متأكد من رغبتك في حذف هذا القسم؟")) {
      updateCategories(categories.filter((c) => c.id !== id));
    }
  };

  // --- Form Actions: Coupons ---
  const openAddCoupon = () => {
    setEditingCoupon(null);
    setCouponCode("");
    setCouponType("percentage");
    setCouponValue(0);
    setCouponMinOrder(0);
    setCouponActive(true);
    setIsCouponModalOpen(true);
  };

  const openEditCoupon = (coupon: any) => {
    setEditingCoupon(coupon);
    setCouponCode(coupon.code);
    setCouponType(coupon.type);
    setCouponValue(coupon.value);
    setCouponMinOrder(coupon.minOrderValue || 0);
    setCouponActive(coupon.isActive);
    setIsCouponModalOpen(true);
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) {
      alert("يرجى كتابة رمز الكوبون.");
      return;
    }
    if (couponValue <= 0) {
      alert("قيمة الخصم يجب أن تكون أكبر من الصفر.");
      return;
    }
    if (couponType === "percentage" && couponValue > 100) {
      alert("نسبة الخصم لا يمكن أن تتعدى 100%.");
      return;
    }

    const uppercaseCode = couponCode.trim().toUpperCase();

    // Check duplicate code
    const isDuplicate = coupons.some(
      (c) => c.code === uppercaseCode && (!editingCoupon || c.id !== editingCoupon.id)
    );
    if (isDuplicate) {
      alert("كود الخصم هذا موجود بالفعل.");
      return;
    }

    if (editingCoupon) {
      const updated = coupons.map((c) =>
        c.id === editingCoupon.id
          ? {
              ...c,
              code: uppercaseCode,
              type: couponType,
              value: Number(couponValue),
              minOrderValue: couponMinOrder ? Number(couponMinOrder) : undefined,
              isActive: couponActive
            }
          : c
      );
      updateCoupons(updated);
    } else {
      const newCoupon = {
        id: `coupon-${Date.now()}`,
        code: uppercaseCode,
        type: couponType,
        value: Number(couponValue),
        minOrderValue: couponMinOrder ? Number(couponMinOrder) : undefined,
        isActive: couponActive
      };
      updateCoupons([...coupons, newCoupon]);
    }
    setIsCouponModalOpen(false);
  };

  const handleCouponDelete = (id: string) => {
    if (window.confirm("هل أنت متأكد من رغبتك في حذف كوبون الخصم هذا؟")) {
      updateCoupons(coupons.filter((c) => c.id !== id));
    }
  };

  // --- Block Reordering Actions ---
  const moveBlock = (index: number, direction: "up" | "down") => {
    const order = [...homepage.blockOrder];
    if (direction === "up" && index > 0) {
      [order[index], order[index - 1]] = [order[index - 1], order[index]];
    } else if (direction === "down" && index < order.length - 1) {
      [order[index], order[index + 1]] = [order[index + 1], order[index]];
    }
    updateHomepage({
      ...homepage,
      blockOrder: order
    });
  };

  // --- Reset database triggers ---
  const handleDatabaseReset = () => {
    if (window.confirm("تنبيه: سيؤدي هذا إلى مسح جميع التعديلات واستعادة قالب العطور الفاخرة الافتراضي. هل تريد المتابعة؟")) {
      resetAll();
      alert("تم إعادة ضبط المتجر إلى الإعدادات الافتراضية بنجاح!");
    }
  };

  const applyThemePreset = (presetId: number) => {
    if (presetId === 1) {
      // Preset 1: Luxury Perfumes
      const newTheme = {
        logo: "",
        favicon: "",
        colors: {
          primary: "#0f172a",
          secondary: "#64748b",
          accent: "#d4a359",
          background: "#faf9f6",
          text: "#1e293b",
          cardBg: "#ffffff",
          border: "#e2e8f0"
        },
        fonts: {
          heading: "Cairo",
          body: "Cairo"
        },
        ui: {
          borderRadius: "8px",
          buttonStyle: "solid" as const
        },
        layoutStyle: "luxury" as const
      };

      const newHomepage = {
        hero: {
          enabled: true,
          title: "فن العطور الراقية والفاخرة",
          subtitle: "اكتشف مجموعتنا الخاصة والحصرية من العطور الفاخرة المستخلصة من أندر المكونات الطبيعية في العالم.",
          bgImage: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1600&q=80",
          ctaText: "اكتشف المجموعة",
          ctaLink: "#",
          align: "center" as const
        },
        featured: {
          enabled: true,
          title: "المنتجات الأكثر مبيعاً",
          subtitle: "اخترنا لك بعناية فائقة العطور الأكثر تميزاً وطلباً",
          limit: 4,
          layout: "grid" as const
        },
        promo: {
          enabled: true,
          title: "عروض الموسم",
          banners: [
            {
              id: "b-1",
              title: "عطور رجالية فاخرة",
              subtitle: "جاذبية وقوة لا تقاوم مع خصم 15%",
              image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80",
              link: "#",
              size: "half" as const
            },
            {
              id: "b-2",
              title: "مجموعات الهدايا",
              subtitle: "صناديق هدايا فاخرة لمن تحب",
              image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
              link: "#",
              size: "half" as const
            }
          ]
        },
        testimonials: {
          enabled: true,
          title: "آراء عملائنا النخبة",
          list: [
            {
              id: "t-1",
              name: "أحمد منصور",
              role: "مشتري مؤكد",
              text: "العطور رائعة جداً وثباتها يدوم لأيام! التوصيل كان سريعاً والتعامل قمة في الرقي.",
              rating: 5,
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
            }
          ]
        },
        newsletter: {
          enabled: false,
          title: "انضم إلى نادي النخبة",
          description: "اشترك لتصلك عروضنا الحصرية وإصداراتنا المحدودة قبل الجميع.",
          placeholder: "أدخل بريدك الإلكتروني هنا...",
          buttonText: "اشترك الآن"
        },
        blockOrder: ["hero", "featured", "promo", "testimonials"]
      };

      updateTheme(newTheme);
      updateHomepage(newHomepage);
    } else if (presetId === 2) {
      // Preset 2: Premium Men's Clothing
      const newTheme = {
        logo: "",
        favicon: "",
        colors: {
          primary: "#1e293b",
          secondary: "#4b5563",
          accent: "#b45309",
          background: "#f8fafc",
          text: "#0f172a",
          cardBg: "#ffffff",
          border: "#e2e8f0"
        },
        fonts: {
          heading: "Cairo",
          body: "Cairo"
        },
        ui: {
          borderRadius: "12px",
          buttonStyle: "solid" as const
        },
        layoutStyle: "modern" as const
      };

      const newHomepage = {
        hero: {
          enabled: true,
          title: "مجموعة الأزياء الرجالية الفاخرة",
          subtitle: "أناقة، تميز وقوة. اكتشف تشكيلتنا الجديدة من الملابس الرجالية الرسمية والكاجوال المصممة خصيصاً للرجل العصري.",
          bgImage: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1600&q=80",
          ctaText: "تسوق التشكيلة الجديدة",
          ctaLink: "#",
          align: "right" as const
        },
        featured: {
          enabled: true,
          title: "الأكثر طلباً ومبيعاً",
          subtitle: "تصاميم كلاسيكية وعصرية تناسب ذوقك الرفيع",
          limit: 4,
          layout: "carousel" as const
        },
        promo: {
          enabled: true,
          title: "عروض الموسم الحصرية",
          banners: [
            {
              id: "b-fashion-1",
              title: "بدل ومعاطف رسمية",
              subtitle: "أناقة لا غنى عنها في المناسبات والعمل",
              image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
              link: "#",
              size: "half" as const
            },
            {
              id: "b-fashion-2",
              title: "الملابس الكاجوال اليومية",
              subtitle: "مريحة، عملية، وعصرية",
              image: "https://images.unsplash.com/photo-1618886614638-80e3c103d31a?auto=format&fit=crop&w=800&q=80",
              link: "#",
              size: "half" as const
            }
          ]
        },
        testimonials: {
          enabled: true,
          title: "شهادات عملائنا الكرام",
          list: [
            {
              id: "t-fashion-1",
              name: "خالد عبد الرحمن",
              role: "عميل دائم",
              text: "الخامات فخمة جداً والمقاسات دقيقة للغاية. أفضل متجر لشراء الملابس الرسمية والبدل الرجالية!",
              rating: 5,
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
            }
          ]
        },
        newsletter: {
          enabled: false,
          title: "كن أول من يعلم بالصيحات الجديدة",
          description: "سجل الآن للحصول على خصم 10% على طلبك الأول وتنبيهات بأحدث الصيحات.",
          placeholder: "بريدك الإلكتروني...",
          buttonText: "سجل الخصم"
        },
        blockOrder: ["hero", "featured", "promo", "testimonials"]
      };

      updateTheme(newTheme);
      updateHomepage(newHomepage);
    } else if (presetId === 3) {
      // Preset 3: Organic Cosmetics
      const newTheme = {
        logo: "",
        favicon: "",
        colors: {
          primary: "#1b4332",
          secondary: "#52b788",
          accent: "#c89f5c",
          background: "#f4f9f4",
          text: "#1b4332",
          cardBg: "#ffffff",
          border: "#d8ebd8"
        },
        fonts: {
          heading: "Cairo",
          body: "Cairo"
        },
        ui: {
          borderRadius: "4px",
          buttonStyle: "solid" as const
        },
        layoutStyle: "editorial" as const
      };

      const newHomepage = {
        hero: {
          enabled: true,
          title: "العناية العضوية والجمال الطبيعي",
          subtitle: "منتجات عناية بالبشرة طبيعية 100% مستخلصة من الأعشاب والزيوت النباتية النقية لتمنحك نضارة وصحة دائمة.",
          bgImage: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=1600&q=80",
          bgImage2: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80",
          bgImage3: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=400&q=80",
          ctaText: "عرض منتجات النضارة",
          ctaLink: "#",
          align: "right" as const
        },
        featured: {
          enabled: true,
          title: "مجموعات النضارة والصحة",
          subtitle: "منتجات خالية من الكيماويات والبارابين",
          limit: 4,
          layout: "grid" as const
        },
        promo: {
          enabled: true,
          title: "باقات النضارة اليومية",
          banners: [
            {
              id: "b-organic-1",
              title: "زيوت الوجه والمصل الطبيعي",
              subtitle: "تغذية عميقة ونضارة فورية",
              image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80",
              link: "#",
              size: "half" as const
            },
            {
              id: "b-organic-2",
              title: "أقنعة الطين العضوي",
              subtitle: "تنقية المسام وشد البشرة الفوري",
              image: "https://images.unsplash.com/photo-1567894340315-735d7c361db0?auto=format&fit=crop&w=800&q=80",
              link: "#",
              size: "half" as const
            }
          ]
        },
        testimonials: {
          enabled: true,
          title: "تجارب عملائنا مع الطبيعة",
          list: [
            {
              id: "t-organic-1",
              name: "يارا سعيد",
              role: "أخصائية بشرة",
              text: "المنتجات غيرت مظهر بشرتي تماماً وقللت من الجفاف بشكل ملحوظ. أنصح بها بشدة لكل من تبحث عن بدائل طبيعية!",
              rating: 5,
              avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
            }
          ]
        },
        newsletter: {
          enabled: false,
          title: "انضم لعائلة الجمال العضوي",
          description: "اشترك للحصول على نصائح أسبوعية للعناية بالبشرة وخصومات حصرية على المنتجات العضوية.",
          placeholder: "بريدك الإلكتروني للحصول على النصائح...",
          buttonText: "سجل الآن"
        },
        blockOrder: ["hero", "featured", "promo", "testimonials"]
      };

      updateTheme(newTheme);
      updateHomepage(newHomepage);
    }
    alert("تم تطبيق الثيم وتعديل المظهر ومحتوى الصفحة الرئيسية بنجاح! تم الحفاظ على قاعدة بيانات المنتجات والأقسام كما هي.");
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        padding: "20px",
        fontFamily: "'Cairo', sans-serif",
        direction: "rtl"
      }}>
        <div style={{
          backgroundColor: "rgba(30, 41, 59, 0.7)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "420px",
          padding: "40px 30px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 10px 10px -5px rgba(0, 0, 0, 0.15)",
          display: "flex",
          flexDirection: "column",
          gap: "24px"
        }}>
          {/* Header */}
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: "56px",
              height: "56px",
              borderRadius: "12px",
              backgroundColor: "var(--accent-color, #c5a880)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px auto",
              color: "#ffffff"
            }}>
              <Settings size={28} />
            </div>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#ffffff", margin: 0 }}>تسجيل الدخول للإدارة</h2>
            <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "6px", margin: 0 }}>يرجى إدخال البريد الإلكتروني وكلمة المرور للتحكم بالمتجر</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {authError && (
              <div style={{
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                color: "#f87171",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                borderRadius: "8px",
                padding: "10px 14px",
                fontSize: "13px",
                fontWeight: "600",
                textAlign: "center"
              }}>
                {authError}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "#cbd5e1" }}>البريد الإلكتروني</label>
              <input
                type="email"
                placeholder="أدخل البريد الإلكتروني"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                style={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  padding: "12px 14px",
                  fontSize: "14px",
                  color: "#ffffff",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                  textAlign: "right"
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "#cbd5e1" }}>كلمة المرور</label>
              <input
                type="password"
                placeholder="أدخل كلمة المرور"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
                style={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  padding: "12px 14px",
                  fontSize: "14px",
                  color: "#ffffff",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                  textAlign: "left"
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: "var(--accent-color, #c5a880)",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "14px",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "background-color 0.2s ease",
                marginTop: "10px"
              }}
            >
              تسجيل الدخول
            </button>
          </form>

          {/* Footer Back Link */}
          <button
            onClick={() => setCurrentView("home")}
            style={{
              background: "none",
              border: "none",
              color: "#94a3b8",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              alignSelf: "center",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <span>العودة للمتجر الرئيسي</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* 1. Sidebar Nav */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="btn-icon" style={{ backgroundColor: "var(--accent-color)", color: "#ffffff", marginLeft: "10px" }}>
            <Settings size={18} />
          </div>
          <span className="admin-logo-text">لوحة تحكم القالب</span>
        </div>

        <ul className="admin-nav-menu">
          <li>
            <button
              onClick={() => setActiveTab("overview")}
              className={`admin-nav-item-btn ${activeTab === "overview" ? "active" : ""}`}
            >
              <LayoutDashboard size={16} style={{ marginLeft: "8px" }} />
              <span>نظرة عامة</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("products")}
              className={`admin-nav-item-btn ${activeTab === "products" ? "active" : ""}`}
            >
              <Package size={16} style={{ marginLeft: "8px" }} />
              <span>إدارة المنتجات</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("categories")}
              className={`admin-nav-item-btn ${activeTab === "categories" ? "active" : ""}`}
            >
              <FolderTree size={16} style={{ marginLeft: "8px" }} />
              <span>إدارة الأقسام</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("homepage")}
              className={`admin-nav-item-btn ${activeTab === "homepage" ? "active" : ""}`}
            >
              <HomeIcon size={16} style={{ marginLeft: "8px" }} />
              <span>مخطط الرئيسية</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("theme")}
              className={`admin-nav-item-btn ${activeTab === "theme" ? "active" : ""}`}
            >
              <Palette size={16} style={{ marginLeft: "8px" }} />
              <span>مخصص المظهر</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("info")}
              className={`admin-nav-item-btn ${activeTab === "info" ? "active" : ""}`}
            >
              <Info size={16} style={{ marginLeft: "8px" }} />
              <span>السيو والاتصال</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("pages")}
              className={`admin-nav-item-btn ${activeTab === "pages" ? "active" : ""}`}
            >
              <FileText size={16} style={{ marginLeft: "8px" }} />
              <span>محتوى الصفحات</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("coupons")}
              className={`admin-nav-item-btn ${activeTab === "coupons" ? "active" : ""}`}
            >
              <Tag size={16} style={{ marginLeft: "8px" }} />
              <span>أكواد الخصم</span>
            </button>
          </li>
          <li style={{ marginTop: "30px", borderTop: "1px dashed #1e293b", paddingTop: "15px" }}>
            <button
              onClick={handleDatabaseReset}
              className="admin-nav-item-btn"
              style={{ color: "#ef4444" }}
            >
              <RotateCcw size={16} style={{ marginLeft: "8px" }} />
              <span>إعادة ضبط المصنع</span>
            </button>
          </li>
        </ul>

        <div className="admin-sidebar-footer" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <button
            onClick={() => setCurrentView("home")}
            className="btn btn-primary"
            style={{ width: "100%", textTransform: "uppercase", fontSize: "12px", display: "flex", gap: "8px", justifyContent: "center" }}
          >
            <Eye size={14} style={{ marginLeft: "6px" }} />
            <span>معاينة المتجر 👁️</span>
          </button>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="btn"
            style={{ 
              width: "100%", 
              fontSize: "12px", 
              display: "flex", 
              gap: "8px", 
              justifyContent: "center", 
              backgroundColor: "rgba(239, 68, 68, 0.1)", 
              color: "#f87171", 
              border: "1px solid rgba(239, 68, 68, 0.2)",
              borderRadius: "var(--border-radius)",
              padding: "10px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            <span>تسجيل الخروج 🚪</span>
          </button>
        </div>
      </aside>

      {/* 2. Main content panels */}
      <main className="admin-main">
        {/* Active Tab rendering */}
        {activeTab === "overview" && (
          <div className="animate-fade-in">
            <div className="admin-header">
              <div>
                <h2>نظرة عامة على لوحة التحكم</h2>
                <div className="admin-title-desc">التحكم في المتغيرات ومعاينة أعداد البيانات.</div>
              </div>
            </div>

            <div className="admin-overview-grid">
              <div className="admin-card-widget">
                <div>
                  <span style={{ color: "#64748b", fontSize: "14px", fontWeight: "500" }}>المنتجات النشطة</span>
                  <div className="widget-info-num">{products.length}</div>
                </div>
                <div className="widget-icon-box">
                  <Package size={22} style={{ color: "var(--accent-color)" }} />
                </div>
              </div>

              <div className="admin-card-widget">
                <div>
                  <span style={{ color: "#64748b", fontSize: "14px", fontWeight: "500" }}>إجمالي الأقسام</span>
                  <div className="widget-info-num">{categories.length}</div>
                </div>
                <div className="widget-icon-box">
                  <FolderTree size={22} style={{ color: "var(--accent-color)" }} />
                </div>
              </div>

              <div className="admin-card-widget">
                <div>
                  <span style={{ color: "#64748b", fontSize: "14px", fontWeight: "500" }}>أقسام الصفحة الرئيسية</span>
                  <div className="widget-info-num">
                    {homepage.blockOrder.length}
                  </div>
                </div>
                <div className="widget-icon-box">
                  <HomeIcon size={22} style={{ color: "var(--accent-color)" }} />
                </div>
              </div>
            </div>

             {/* Presets Theme Switcher Section */}
             <div className="form-card" style={{ padding: "30px", backgroundColor: "#ffffff", marginTop: "30px" }}>
               <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px", color: "var(--primary-color)" }}>
                 🎨 تبديل وتجربة القوالب والبراندات الجاهزة
               </h3>
               <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "24px" }}>
                 اختر ثيم جاهز لتغيير مظهر وتنسيق ومحتويات الصفحة الرئيسية فوراً وتجربتها. **سيتم الحفاظ بالكامل على المنتجات والأقسام التي قمت برفعها.**
               </p>

               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
                 {/* Preset 1 Card */}
                 <div 
                   onClick={() => applyThemePreset(1)}
                   style={{
                     border: "1px solid var(--border-color)",
                     borderRadius: "12px",
                     padding: "20px",
                     cursor: "pointer",
                     transition: "all 0.3s ease",
                     backgroundColor: "#f8fafc",
                     display: "flex",
                     flexDirection: "column",
                     justifyContent: "space-between",
                     minHeight: "120px",
                     boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
                   }}
                   onMouseEnter={(e) => {
                     e.currentTarget.style.transform = "translateY(-4px)";
                     e.currentTarget.style.borderColor = "#d4a359";
                     e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(212,163,89,0.1), 0 4px 6px -4px rgba(212,163,89,0.1)";
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.transform = "translateY(0)";
                     e.currentTarget.style.borderColor = "var(--border-color)";
                     e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.02)";
                   }}
                 >
                   <div>
                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                       <span style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>ثيم 1</span>
                       <div style={{ display: "flex", gap: "4px" }}>
                         <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#0f172a" }} />
                         <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#d4a359" }} />
                       </div>
                     </div>
                   </div>
                   <button className="btn btn-secondary" style={{ width: "100%", height: "32px", fontSize: "11px", marginTop: "15px", padding: 0 }}>تطبيق الثيم</button>
                 </div>

                 {/* Preset 2 Card */}
                 <div 
                   onClick={() => applyThemePreset(2)}
                   style={{
                     border: "1px solid var(--border-color)",
                     borderRadius: "12px",
                     padding: "20px",
                     cursor: "pointer",
                     transition: "all 0.3s ease",
                     backgroundColor: "#f8fafc",
                     display: "flex",
                     flexDirection: "column",
                     justifyContent: "space-between",
                     minHeight: "120px",
                     boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
                   }}
                   onMouseEnter={(e) => {
                     e.currentTarget.style.transform = "translateY(-4px)";
                     e.currentTarget.style.borderColor = "#ec4899";
                     e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(236,72,153,0.1), 0 4px 6px -4px rgba(236,72,153,0.1)";
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.transform = "translateY(0)";
                     e.currentTarget.style.borderColor = "var(--border-color)";
                     e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.02)";
                   }}
                 >
                   <div>
                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                       <span style={{ fontSize: "16px", fontWeight: "700", color: "#0c0a09" }}>ثيم 2</span>
                       <div style={{ display: "flex", gap: "4px" }}>
                         <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#0c0a09" }} />
                         <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ec4899" }} />
                       </div>
                     </div>
                   </div>
                   <button className="btn btn-secondary" style={{ width: "100%", height: "32px", fontSize: "11px", marginTop: "15px", padding: 0 }}>تطبيق الثيم</button>
                 </div>

                 {/* Preset 3 Card */}
                 <div 
                   onClick={() => applyThemePreset(3)}
                   style={{
                     border: "1px solid var(--border-color)",
                     borderRadius: "12px",
                     padding: "20px",
                     cursor: "pointer",
                     transition: "all 0.3s ease",
                     backgroundColor: "#f8fafc",
                     display: "flex",
                     flexDirection: "column",
                     justifyContent: "space-between",
                     minHeight: "120px",
                     boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
                   }}
                   onMouseEnter={(e) => {
                     e.currentTarget.style.transform = "translateY(-4px)";
                     e.currentTarget.style.borderColor = "#1b4332";
                     e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(27,67,50,0.1), 0 4px 6px -4px rgba(27,67,50,0.1)";
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.transform = "translateY(0)";
                     e.currentTarget.style.borderColor = "var(--border-color)";
                     e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.02)";
                   }}
                 >
                   <div>
                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                       <span style={{ fontSize: "16px", fontWeight: "700", color: "#1b4332" }}>ثيم 3</span>
                       <div style={{ display: "flex", gap: "4px" }}>
                         <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#1b4332" }} />
                         <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#c89f5c" }} />
                       </div>
                     </div>
                   </div>
                   <button className="btn btn-secondary" style={{ width: "100%", height: "32px", fontSize: "11px", marginTop: "15px", padding: 0 }}>تطبيق الثيم</button>
                 </div>
               </div>
             </div>
          </div>
        )}

        {/* PRODUCTS CRUD */}
        {activeTab === "products" && (
          <div className="animate-fade-in">
            <div className="admin-header">
              <div>
                <h2>إدارة منتجات المتجر</h2>
                <div className="admin-title-desc">إضافة وتعديل وحذف منتجات الكتالوج وتعيين خيارات الخصائص الديناميكية.</div>
              </div>
              <button onClick={openAddProduct} className="btn btn-primary" style={{ padding: "8px 18px", fontSize: "13px" }}>
                <Plus size={16} style={{ marginLeft: "6px" }} />
                <span>إضافة منتج جديد</span>
              </button>
            </div>

            <div className="admin-table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: "80px" }}>الصورة</th>
                    <th>الاسم</th>
                    <th>القسم</th>
                    <th>السعر</th>
                    <th>المواصفات</th>
                    <th>الحالة</th>
                    <th>مميز</th>
                    <th style={{ width: "160px" }}>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => {
                    const cat = categories.find((c) => c.id === prod.categoryId);
                    const prodImg = prod.images && prod.images.length > 0 ? prod.images[0] : "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80";
                    const prodPrice = typeof prod.price === "number" ? prod.price : 0;
                    const prodAttributes = Array.isArray(prod.attributes) ? prod.attributes : [];
                    return (
                      <tr key={prod.id}>
                        <td>
                          <img src={prodImg} alt={prod.name || "منتج"} className="admin-table-img" />
                        </td>
                        <td style={{ fontWeight: "600" }}>
                          {prod.name || "منتج بدون اسم"}
                          {prod.code && (
                            <span style={{ fontSize: "11px", color: "#b45309", backgroundColor: "#fef3c7", padding: "1px 6px", borderRadius: "4px", marginRight: "6px" }}>
                              #{prod.code}
                            </span>
                          )}
                        </td>
                        <td>{cat ? cat.name : "غير مصنف"}</td>
                        <td style={{ fontWeight: "700" }}>{prodPrice.toFixed(2)} EGP</td>
                        <td>
                          {prodAttributes.map((attr) => (
                            <span
                              key={attr.name || Math.random()}
                              style={{
                                display: "inline-block",
                                fontSize: "11px",
                                backgroundColor: "#f1f5f9",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                margin: "2px"
                              }}
                            >
                              {attr.name} ({Array.isArray(attr.options) ? attr.options.length : 0})
                            </span>
                          ))}
                        </td>
                        <td>
                          <span
                            className="badge"
                            style={{
                              backgroundColor: prod.isSoldOut ? "#fee2e2" : "#d1fae5",
                              color: prod.isSoldOut ? "#991b1b" : "#065f46"
                            }}
                          >
                            {prod.isSoldOut ? "نفذت الكمية" : "متوفر"}
                          </span>
                        </td>
                        <td>
                          <span
                            className="badge"
                            style={{
                              backgroundColor: prod.featured ? "#d1fae5" : "#f1f5f9",
                              color: prod.featured ? "#065f46" : "#64748b"
                            }}
                          >
                            {prod.featured ? "نعم" : "لا"}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              onClick={() => openEditProduct(prod)}
                              className="action-btn action-btn-edit"
                              title="تعديل المنتج"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              onClick={() => handleProductDelete(prod.id)}
                              className="action-btn action-btn-delete"
                              title="حذف المنتج"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CATEGORIES CRUD */}
        {activeTab === "categories" && (
          <div className="animate-fade-in">
            <div className="admin-header">
              <div>
                <h2>إدارة الأقسام</h2>
                <div className="admin-title-desc">تكوين وتصنيف أقسام المتجر المختلفة.</div>
              </div>
              <button onClick={openAddCategory} className="btn btn-primary" style={{ padding: "8px 18px", fontSize: "13px" }}>
                <Plus size={16} style={{ marginLeft: "6px" }} />
                <span>إضافة قسم جديد</span>
              </button>
            </div>

            <div className="admin-table-card" style={{ maxWidth: "800px" }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: "80px" }}>الصورة</th>
                    <th>الاسم</th>
                    <th>الرابط اللطيف</th>
                    <th style={{ width: "160px" }}>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id}>
                      <td>
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} className="admin-table-img" />
                        ) : (
                          <div
                            className="admin-table-img flex-center"
                            style={{ backgroundColor: "#f1f5f9", fontSize: "10px", color: "#94a3b8" }}
                          >
                            لا توجد صورة
                          </div>
                        )}
                      </td>
                      <td style={{ fontWeight: "600" }}>{cat.name}</td>
                      <td style={{ fontFamily: "monospace" }}>{cat.slug}</td>
                      <td>
                        <div className="table-actions">
                          <button
                            onClick={() => openEditCategory(cat)}
                            className="action-btn action-btn-edit"
                            title="تعديل القسم"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleCategoryDelete(cat.id)}
                            className="action-btn action-btn-delete"
                            title="حذف القسم"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* HOMEPAGE BUILDER */}
        {activeTab === "homepage" && (
          <div className="animate-fade-in">
            <div className="admin-header">
              <div>
                <h2>مخطط الصفحة الرئيسية</h2>
                <div className="admin-title-desc">إعادة ترتيب أقسام المتجر الرئيسية وتعديل إعدادات نصوصها.</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "30px" }}>
              {/* Left Side: Order sections list */}
              <div className="form-card">
                <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>
                  ترتيب أقسام المخطط
                </h3>
                <div className="homepage-builder-list">
                  {homepage.blockOrder.map((blockName, index) => {
                    let blockTitle = "";
                    let isEnabled = false;

                    if (blockName === "hero") {
                      blockTitle = "واجهة البانر الرئيسي";
                      isEnabled = homepage.hero.enabled;
                    } else if (blockName === "featured") {
                      blockTitle = "كتالوج المنتجات المميزة";
                      isEnabled = homepage.featured.enabled;
                    } else if (blockName === "promo") {
                      blockTitle = "شبكة العروض الترويجية";
                      isEnabled = homepage.promo.enabled;
                    } else if (blockName === "testimonials") {
                      blockTitle = "آراء وتوصيات العملاء";
                      isEnabled = homepage.testimonials.enabled;
                    } else if (blockName === "newsletter") {
                      blockTitle = "الاشتراك في النشرة البريدية";
                      isEnabled = homepage.newsletter.enabled;
                    }

                    const handleToggle = (checked: boolean) => {
                      const updated = { ...homepage };
                      if (blockName === "hero") updated.hero.enabled = checked;
                      else if (blockName === "featured") updated.featured.enabled = checked;
                      else if (blockName === "promo") updated.promo.enabled = checked;
                      else if (blockName === "testimonials") updated.testimonials.enabled = checked;
                      else if (blockName === "newsletter") updated.newsletter.enabled = checked;
                      updateHomepage(updated);
                    };

                    return (
                      <div
                        key={blockName}
                        onClick={() => setSelectedSection(blockName as any)}
                        className={`homepage-builder-card ${selectedSection === blockName ? "active" : ""}`}
                        style={{
                          cursor: "pointer",
                          border: selectedSection === blockName ? "2px solid var(--accent-color)" : "1px solid var(--border-color)",
                          backgroundColor: selectedSection === blockName ? "rgba(212, 163, 89, 0.08)" : "transparent",
                          transition: "all 0.2s ease"
                        }}
                      >
                        <div className="section-builder-details">
                          <div className="section-order-arrows" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveBlock(index, "up");
                              }}
                              disabled={index === 0}
                              className="order-arrow-btn"
                              title="تحريك لأعلى"
                            >
                              <ArrowUp size={12} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveBlock(index, "down");
                              }}
                              disabled={index === homepage.blockOrder.length - 1}
                              className="order-arrow-btn"
                              title="تحريك لأسفل"
                            >
                              <ArrowDown size={12} />
                            </button>
                          </div>
                          <div>
                            <span className="section-builder-title" style={{ fontWeight: selectedSection === blockName ? "700" : "500" }}>{blockTitle}</span>
                            <div className="section-builder-meta">الترتيب: {index + 1}</div>
                          </div>
                        </div>

                        {/* Toggle switch */}
                        <div className="section-toggle-switch" onClick={(e) => e.stopPropagation()}>
                          <span>{isEnabled ? "نشط" : "مخفي"}</span>
                          <label className="switch" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isEnabled}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleToggle(e.target.checked);
                              }}
                            />
                            <span className="slider"></span>
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Side: Dynamic section editor */}
              <div className="form-card" style={{ height: "fit-content" }}>
                {selectedSection === "hero" && (
                  <>
                    <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>
                      إعدادات محتوى البانر الرئيسي
                    </h3>

                    <div className="admin-form-group">
                      <label className="admin-label">العنوان الرئيسي</label>
                      <input
                        type="text"
                        value={homepage.hero.title}
                        onChange={(e) =>
                          updateHomepage({
                            ...homepage,
                            hero: { ...homepage.hero, title: e.target.value }
                          })
                        }
                        className="admin-input"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-label">العنوان الفرعي للبانر</label>
                      <textarea
                        value={homepage.hero.subtitle}
                        onChange={(e) =>
                          updateHomepage({
                            ...homepage,
                            hero: { ...homepage.hero, subtitle: e.target.value }
                          })
                        }
                        className="admin-textarea"
                        style={{ height: "60px" }}
                      />
                    </div>

                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label className="admin-label">عنوان زر الانتقال (CTA)</label>
                        <input
                          type="text"
                          value={homepage.hero.ctaText}
                          onChange={(e) =>
                            updateHomepage({
                              ...homepage,
                              hero: { ...homepage.hero, ctaText: e.target.value }
                            })
                          }
                          className="admin-input"
                        />
                      </div>
                      <div className="admin-form-group">
                        <label className="admin-label">محاذاة المحتوى</label>
                        <select
                          value={homepage.hero.align}
                          onChange={(e) =>
                            updateHomepage({
                              ...homepage,
                              hero: { ...homepage.hero, align: e.target.value as any }
                            })
                          }
                          className="admin-select"
                        >
                          <option value="left">محاذاة لليمين</option>
                          <option value="center">توسيط</option>
                          <option value="right">محاذاة لليسار</option>
                        </select>
                      </div>
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-label">صورة الخلفية للبانر الرئيسي</label>
                      <div style={{ display: "flex", gap: "20px", alignItems: "center", marginBottom: "12px" }}>
                        {/* Image Preview */}
                        <div style={{
                          width: "120px",
                          height: "80px",
                          border: "1px dashed var(--border-color)",
                          borderRadius: "var(--border-radius)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#f8fafc",
                          overflow: "hidden",
                          padding: "4px"
                        }}>
                          {homepage.hero.bgImage ? (
                            <img src={homepage.hero.bgImage} alt="Banner Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <span style={{ fontSize: "11px", color: "#94a3b8", textAlign: "center" }}>لا توجد صورة</span>
                          )}
                        </div>

                        {/* Upload Controls */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                          <div style={{ position: "relative", cursor: "pointer", display: "inline-block" }}>
                            <button type="button" className="btn btn-secondary" style={{ width: "100%", height: "36px", fontSize: "12px" }}>
                              رفع صورة من الجهاز
                            </button>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const files = e.target.files;
                                if (files && files.length > 0) {
                                  const base64 = await compressImage(files[0]);
                                  updateHomepage({
                                    ...homepage,
                                    hero: { ...homepage.hero, bgImage: base64 }
                                  });
                                }
                              }}
                              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
                            />
                          </div>

                          {homepage.hero.bgImage && (
                            <button
                              type="button"
                              onClick={() => updateHomepage({
                                ...homepage,
                                hero: { ...homepage.hero, bgImage: "" }
                              })}
                              className="btn"
                              style={{
                                width: "100%",
                                height: "36px",
                                fontSize: "12px",
                                backgroundColor: "#fee2e2",
                                color: "#ef4444",
                                border: "1px solid #fecaca"
                              }}
                            >
                              إزالة الصورة
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Manual Link Input */}
                      <div>
                        <span style={{ fontSize: "11px", color: "var(--secondary-color)", display: "block", marginBottom: "4px" }}>أو ضع رابط الصورة مباشرة:</span>
                        <input
                          type="text"
                          value={homepage.hero.bgImage}
                          onChange={(e) =>
                            updateHomepage({
                              ...homepage,
                              hero: { ...homepage.hero, bgImage: e.target.value }
                            })
                          }
                          className="admin-input"
                          placeholder="https://example.com/banner.jpg"
                          style={{ height: "36px", fontSize: "12px" }}
                        />
                      </div>
                    </div>

                    {theme.layoutStyle === "editorial" && (
                      <>
                        {/* Image 2 Collage Input */}
                        <div className="admin-form-group" style={{ marginTop: "20px", borderTop: "1px solid var(--border-color)", paddingTop: "20px" }}>
                          <label className="admin-label">صورة الكولاج الجانبية الأولى (اليمين)</label>
                          <div style={{ display: "flex", gap: "20px", alignItems: "center", marginBottom: "12px" }}>
                            {/* Image Preview */}
                            <div style={{
                              width: "120px",
                              height: "80px",
                              border: "1px dashed var(--border-color)",
                              borderRadius: "var(--border-radius)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#f8fafc",
                              overflow: "hidden",
                              padding: "4px"
                            }}>
                              {homepage.hero.bgImage2 ? (
                                <img src={homepage.hero.bgImage2} alt="Collage 1 Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              ) : (
                                <span style={{ fontSize: "11px", color: "#94a3b8", textAlign: "center" }}>لا توجد صورة</span>
                              )}
                            </div>

                            {/* Upload Controls */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                              <div style={{ position: "relative", cursor: "pointer", display: "inline-block" }}>
                                <button type="button" className="btn btn-secondary" style={{ width: "100%", height: "36px", fontSize: "12px" }}>
                                  رفع صورة من الجهاز
                                </button>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={async (e) => {
                                    const files = e.target.files;
                                    if (files && files.length > 0) {
                                      const base64 = await compressImage(files[0]);
                                      updateHomepage({
                                        ...homepage,
                                        hero: { ...homepage.hero, bgImage2: base64 }
                                      });
                                    }
                                  }}
                                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
                                />
                              </div>

                              {homepage.hero.bgImage2 && (
                                <button
                                  type="button"
                                  onClick={() => updateHomepage({
                                    ...homepage,
                                    hero: { ...homepage.hero, bgImage2: "" }
                                  })}
                                  className="btn"
                                  style={{
                                    width: "100%",
                                    height: "36px",
                                    fontSize: "12px",
                                    backgroundColor: "#fee2e2",
                                    color: "#ef4444",
                                    border: "1px solid #fecaca"
                                  }}
                                >
                                  إزالة الصورة
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Manual Link Input */}
                          <div>
                            <span style={{ fontSize: "11px", color: "var(--secondary-color)", display: "block", marginBottom: "4px" }}>أو ضع رابط الصورة مباشرة:</span>
                            <input
                              type="text"
                              value={homepage.hero.bgImage2 || ""}
                              onChange={(e) =>
                                updateHomepage({
                                  ...homepage,
                                  hero: { ...homepage.hero, bgImage2: e.target.value }
                                })
                              }
                              className="admin-input"
                              placeholder="https://example.com/collage1.jpg"
                              style={{ height: "36px", fontSize: "12px" }}
                            />
                          </div>
                        </div>

                        {/* Image 3 Collage Input */}
                        <div className="admin-form-group" style={{ marginTop: "20px", borderTop: "1px solid var(--border-color)", paddingTop: "20px" }}>
                          <label className="admin-label">صورة الكولاج الجانبية الثانية (اليسار)</label>
                          <div style={{ display: "flex", gap: "20px", alignItems: "center", marginBottom: "12px" }}>
                            {/* Image Preview */}
                            <div style={{
                              width: "120px",
                              height: "80px",
                              border: "1px dashed var(--border-color)",
                              borderRadius: "var(--border-radius)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#f8fafc",
                              overflow: "hidden",
                              padding: "4px"
                            }}>
                              {homepage.hero.bgImage3 ? (
                                <img src={homepage.hero.bgImage3} alt="Collage 2 Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              ) : (
                                <span style={{ fontSize: "11px", color: "#94a3b8", textAlign: "center" }}>لا توجد صورة</span>
                              )}
                            </div>

                            {/* Upload Controls */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                              <div style={{ position: "relative", cursor: "pointer", display: "inline-block" }}>
                                <button type="button" className="btn btn-secondary" style={{ width: "100%", height: "36px", fontSize: "12px" }}>
                                  رفع صورة من الجهاز
                                </button>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={async (e) => {
                                    const files = e.target.files;
                                    if (files && files.length > 0) {
                                      const base64 = await compressImage(files[0]);
                                      updateHomepage({
                                        ...homepage,
                                        hero: { ...homepage.hero, bgImage3: base64 }
                                      });
                                    }
                                  }}
                                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
                                />
                              </div>

                              {homepage.hero.bgImage3 && (
                                <button
                                  type="button"
                                  onClick={() => updateHomepage({
                                    ...homepage,
                                    hero: { ...homepage.hero, bgImage3: "" }
                                  })}
                                  className="btn"
                                  style={{
                                    width: "100%",
                                    height: "36px",
                                    fontSize: "12px",
                                    backgroundColor: "#fee2e2",
                                    color: "#ef4444",
                                    border: "1px solid #fecaca"
                                  }}
                                >
                                  إزالة الصورة
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Manual Link Input */}
                          <div>
                            <span style={{ fontSize: "11px", color: "var(--secondary-color)", display: "block", marginBottom: "4px" }}>أو ضع رابط الصورة مباشرة:</span>
                            <input
                              type="text"
                              value={homepage.hero.bgImage3 || ""}
                              onChange={(e) =>
                                updateHomepage({
                                  ...homepage,
                                  hero: { ...homepage.hero, bgImage3: e.target.value }
                                })
                              }
                              className="admin-input"
                              placeholder="https://example.com/collage2.jpg"
                              style={{ height: "36px", fontSize: "12px" }}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}

                {selectedSection === "featured" && (
                  <>
                    <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>
                      إعدادات كتالوج المنتجات المميزة
                    </h3>

                    <div className="admin-form-group">
                      <label className="admin-label">العنوان الرئيسي للقسم</label>
                      <input
                        type="text"
                        value={homepage.featured.title}
                        onChange={(e) =>
                          updateHomepage({
                            ...homepage,
                            featured: { ...homepage.featured, title: e.target.value }
                          })
                        }
                        className="admin-input"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-label">العنوان الفرعي للقسم</label>
                      <input
                        type="text"
                        value={homepage.featured.subtitle}
                        onChange={(e) =>
                          updateHomepage({
                            ...homepage,
                            featured: { ...homepage.featured, subtitle: e.target.value }
                          })
                        }
                        className="admin-input"
                      />
                    </div>

                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label className="admin-label">الحد الأقصى للمنتجات المعروضة</label>
                        <input
                          type="number"
                          value={homepage.featured.limit}
                          onChange={(e) =>
                            updateHomepage({
                              ...homepage,
                              featured: { ...homepage.featured, limit: parseInt(e.target.value) || 4 }
                            })
                          }
                          className="admin-input"
                          min="1"
                          max="24"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">طريقة عرض المنتجات</label>
                        <select
                          value={homepage.featured.layout}
                          onChange={(e) =>
                            updateHomepage({
                              ...homepage,
                              featured: { ...homepage.featured, layout: e.target.value as any }
                            })
                          }
                          className="admin-select"
                        >
                          <option value="grid">شبكة منتجات (Grid Layout)</option>
                          <option value="carousel">شريط متحرك (Carousel Slider)</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {selectedSection === "promo" && (
                  <>
                    <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>
                      إعدادات العروض الترويجية
                    </h3>

                    <div className="admin-form-group">
                      <label className="admin-label">عنوان قسم العروض</label>
                      <input
                        type="text"
                        value={homepage.promo.title || ""}
                        onChange={(e) =>
                          updateHomepage({
                            ...homepage,
                            promo: { ...homepage.promo, title: e.target.value }
                          })
                        }
                        className="admin-input"
                      />
                    </div>

                    {/* Banners Builder List */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", borderTop: "1px solid var(--border-color)", paddingTop: "15px" }}>
                        <span className="admin-label" style={{ marginBottom: "0", fontWeight: "bold" }}>البانرات الإعلانية ({homepage.promo.banners.length})</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newBanner = {
                              id: `banner-${Date.now()}`,
                              title: "عرض جديد",
                              subtitle: "اكتشف العروض الحصرية",
                              image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
                              link: "#",
                              size: "half" as const
                            };
                            updateHomepage({
                              ...homepage,
                              promo: {
                                ...homepage.promo,
                                banners: [...homepage.promo.banners, newBanner]
                              }
                            });
                          }}
                          className="btn btn-secondary"
                          style={{ padding: "4px 12px", fontSize: "11px", height: "auto" }}
                        >
                          + إضافة بانر جديد
                        </button>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "15px", maxHeight: "400px", overflowY: "auto", paddingLeft: "4px" }}>
                        {homepage.promo.banners.length === 0 ? (
                          <span style={{ fontSize: "12px", color: "#64748b", fontStyle: "italic" }}>لم يتم إضافة أي بانرات إعلانية بعد.</span>
                        ) : (
                          homepage.promo.banners.map((banner, index) => {
                            const handleBannerChange = (field: keyof typeof banner, value: any) => {
                              const updatedBanners = [...homepage.promo.banners];
                              updatedBanners[index] = { ...updatedBanners[index], [field]: value };
                              updateHomepage({
                                ...homepage,
                                promo: { ...homepage.promo, banners: updatedBanners }
                              });
                            };

                            const deleteBanner = () => {
                              updateHomepage({
                                ...homepage,
                                promo: {
                                  ...homepage.promo,
                                  banners: homepage.promo.banners.filter((b) => b.id !== banner.id)
                                }
                              });
                            };

                            const handleBannerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
                              const files = e.target.files;
                              if (files && files.length > 0) {
                                const compressed = await compressImage(files[0]);
                                handleBannerChange("image", compressed);
                              }
                            };

                            return (
                              <div key={banner.id} style={{
                                border: "1px solid var(--border-color)",
                                borderRadius: "var(--border-radius)",
                                padding: "12px",
                                backgroundColor: "#f8fafc"
                              }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                                  <span style={{ fontSize: "12px", fontWeight: "bold", color: "var(--primary-color)" }}>بانر إعلاني #{index + 1}</span>
                                  <button
                                    type="button"
                                    onClick={deleteBanner}
                                    style={{
                                      backgroundColor: "transparent",
                                      border: "none",
                                      color: "#ef4444",
                                      cursor: "pointer",
                                      fontSize: "12px"
                                    }}
                                  >
                                    حذف البانر
                                  </button>
                                </div>

                                <div className="admin-form-group" style={{ marginBottom: "8px" }}>
                                  <label className="admin-label" style={{ fontSize: "11px", marginBottom: "4px" }}>العنوان الرئيسي للبانر</label>
                                  <input
                                    type="text"
                                    value={banner.title}
                                    onChange={(e) => handleBannerChange("title", e.target.value)}
                                    className="admin-input"
                                    style={{ height: "32px", fontSize: "12px" }}
                                  />
                                </div>

                                <div className="admin-form-group" style={{ marginBottom: "8px" }}>
                                  <label className="admin-label" style={{ fontSize: "11px", marginBottom: "4px" }}>العنوان الفرعي</label>
                                  <input
                                    type="text"
                                    value={banner.subtitle}
                                    onChange={(e) => handleBannerChange("subtitle", e.target.value)}
                                    className="admin-input"
                                    style={{ height: "32px", fontSize: "12px" }}
                                  />
                                </div>

                                <div className="admin-form-row" style={{ marginBottom: "8px" }}>
                                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                                    <label className="admin-label" style={{ fontSize: "11px", marginBottom: "4px" }}>رابط التوجيه (Link)</label>
                                    <input
                                      type="text"
                                      value={banner.link}
                                      onChange={(e) => handleBannerChange("link", e.target.value)}
                                      className="admin-input"
                                      style={{ height: "32px", fontSize: "12px" }}
                                    />
                                  </div>
                                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                                    <label className="admin-label" style={{ fontSize: "11px", marginBottom: "4px" }}>حجم البانر في الصفحة</label>
                                    <select
                                      value={banner.size}
                                      onChange={(e) => handleBannerChange("size", e.target.value as any)}
                                      className="admin-select"
                                      style={{ height: "32px", fontSize: "12px", padding: "0 8px" }}
                                    >
                                      <option value="half">نصف عرض الصفحة (1/2)</option>
                                      <option value="full">عرض الصفحة بالكامل (100%)</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                                  <label className="admin-label" style={{ fontSize: "11px", marginBottom: "4px" }}>صورة البانر</label>
                                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                    <input
                                      type="text"
                                      value={banner.image}
                                      onChange={(e) => handleBannerChange("image", e.target.value)}
                                      className="admin-input"
                                      style={{ height: "32px", fontSize: "11px", flex: 1 }}
                                      placeholder="أدخل رابط صورة..."
                                    />
                                    <div style={{ position: "relative", cursor: "pointer" }}>
                                      <button type="button" className="btn btn-secondary" style={{ height: "32px", padding: "0 10px", fontSize: "11px" }}>رفع ملف</button>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleBannerImageUpload}
                                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
                                      />
                                    </div>
                                  </div>
                                  {banner.image && (
                                    <img src={banner.image} alt="Preview" style={{ width: "100%", height: "60px", objectFit: "cover", borderRadius: "4px", marginTop: "6px" }} />
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </>
                )}

                {selectedSection === "testimonials" && (
                  <>
                    <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>
                      إعدادات آراء وتوصيات العملاء
                    </h3>

                    <div className="admin-form-group">
                      <label className="admin-label">عنوان قسم الآراء</label>
                      <input
                        type="text"
                        value={homepage.testimonials.title || ""}
                        onChange={(e) =>
                          updateHomepage({
                            ...homepage,
                            testimonials: { ...homepage.testimonials, title: e.target.value }
                          })
                        }
                        className="admin-input"
                      />
                    </div>

                    {/* Testimonials List */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", borderTop: "1px solid var(--border-color)", paddingTop: "15px" }}>
                        <span className="admin-label" style={{ marginBottom: "0", fontWeight: "bold" }}>قائمة الآراء ({homepage.testimonials.list.length})</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newTestimonial = {
                              id: `testi-${Date.now()}`,
                              name: "عميل جديد",
                              text: "الخدمة ممتازة والمنتجات فائقة الجودة!",
                              rating: 5,
                              role: "مشتري مؤكد",
                              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                            };
                            updateHomepage({
                              ...homepage,
                              testimonials: {
                                ...homepage.testimonials,
                                list: [...homepage.testimonials.list, newTestimonial]
                              }
                            });
                          }}
                          className="btn btn-secondary"
                          style={{ padding: "4px 12px", fontSize: "11px", height: "auto" }}
                        >
                          + إضافة رأي جديد
                        </button>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "15px", maxHeight: "400px", overflowY: "auto", paddingLeft: "4px" }}>
                        {homepage.testimonials.list.length === 0 ? (
                          <span style={{ fontSize: "12px", color: "#64748b", fontStyle: "italic" }}>لم يتم إضافة أي آراء بعد.</span>
                        ) : (
                          homepage.testimonials.list.map((testimonial, index) => {
                            const handleTestimonialChange = (field: keyof typeof testimonial, value: any) => {
                              const updatedList = [...homepage.testimonials.list];
                              updatedList[index] = { ...updatedList[index], [field]: value };
                              updateHomepage({
                                ...homepage,
                                testimonials: { ...homepage.testimonials, list: updatedList }
                              });
                            };

                            const deleteTestimonial = () => {
                              updateHomepage({
                                ...homepage,
                                testimonials: {
                                  ...homepage.testimonials,
                                  list: homepage.testimonials.list.filter((t) => t.id !== testimonial.id)
                                }
                              });
                            };

                            const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
                              const files = e.target.files;
                              if (files && files.length > 0) {
                                const compressed = await compressImage(files[0]);
                                handleTestimonialChange("avatar", compressed);
                              }
                            };

                            return (
                              <div key={testimonial.id} style={{
                                border: "1px solid var(--border-color)",
                                borderRadius: "var(--border-radius)",
                                padding: "12px",
                                backgroundColor: "#f8fafc"
                              }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                                  <span style={{ fontSize: "12px", fontWeight: "bold", color: "var(--primary-color)" }}>رأي عميل #{index + 1}</span>
                                  <button
                                    type="button"
                                    onClick={deleteTestimonial}
                                    style={{
                                      backgroundColor: "transparent",
                                      border: "none",
                                      color: "#ef4444",
                                      cursor: "pointer",
                                      fontSize: "12px"
                                    }}
                                  >
                                    حذف التقييم
                                  </button>
                                </div>

                                <div className="admin-form-row" style={{ marginBottom: "8px" }}>
                                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                                    <label className="admin-label" style={{ fontSize: "11px", marginBottom: "4px" }}>اسم العميل</label>
                                    <input
                                      type="text"
                                      value={testimonial.name}
                                      onChange={(e) => handleTestimonialChange("name", e.target.value)}
                                      className="admin-input"
                                      style={{ height: "32px", fontSize: "12px" }}
                                    />
                                  </div>
                                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                                    <label className="admin-label" style={{ fontSize: "11px", marginBottom: "4px" }}>الوصف/الصفة (مثال: مشتري مؤكد)</label>
                                    <input
                                      type="text"
                                      value={testimonial.role}
                                      onChange={(e) => handleTestimonialChange("role", e.target.value)}
                                      className="admin-input"
                                      style={{ height: "32px", fontSize: "12px" }}
                                    />
                                  </div>
                                </div>

                                <div className="admin-form-row" style={{ marginBottom: "8px" }}>
                                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                                    <label className="admin-label" style={{ fontSize: "11px", marginBottom: "4px" }}>التقييم (النجوم)</label>
                                    <select
                                      value={testimonial.rating}
                                      onChange={(e) => handleTestimonialChange("rating", parseInt(e.target.value) || 5)}
                                      className="admin-select"
                                      style={{ height: "32px", fontSize: "12px", padding: "0 8px" }}
                                    >
                                      <option value="5">5 نجوم</option>
                                      <option value="4">4 نجوم</option>
                                      <option value="3">3 نجوم</option>
                                      <option value="2">2 نجوم</option>
                                      <option value="1">نجمة واحدة</option>
                                    </select>
                                  </div>
                                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                                    <label className="admin-label" style={{ fontSize: "11px", marginBottom: "4px" }}>صورة العميل (Avatar)</label>
                                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                      <input
                                        type="text"
                                        value={testimonial.avatar}
                                        onChange={(e) => handleTestimonialChange("avatar", e.target.value)}
                                        className="admin-input"
                                        style={{ height: "32px", fontSize: "11px", flex: 1 }}
                                      />
                                      <div style={{ position: "relative", cursor: "pointer" }}>
                                        <button type="button" className="btn btn-secondary" style={{ height: "32px", padding: "0 10px", fontSize: "11px" }}>رفع ملف</button>
                                        <input
                                          type="file"
                                          accept="image/*"
                                          onChange={handleAvatarUpload}
                                          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                                  <label className="admin-label" style={{ fontSize: "11px", marginBottom: "4px" }}>نص التقييم</label>
                                  <textarea
                                    value={testimonial.text}
                                    onChange={(e) => handleTestimonialChange("text", e.target.value)}
                                    className="admin-textarea"
                                    style={{ height: "50px", fontSize: "12px" }}
                                  />
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </>
                )}

                {selectedSection === "newsletter" && (
                  <>
                    <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>
                      إعدادات النشرة البريدية
                    </h3>

                    <div className="admin-form-group">
                      <label className="admin-label">العنوان الرئيسي</label>
                      <input
                        type="text"
                        value={homepage.newsletter.title}
                        onChange={(e) =>
                          updateHomepage({
                            ...homepage,
                            newsletter: { ...homepage.newsletter, title: e.target.value }
                          })
                        }
                        className="admin-input"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-label">الوصف الفرعي</label>
                      <textarea
                        value={homepage.newsletter.description}
                        onChange={(e) =>
                          updateHomepage({
                            ...homepage,
                            newsletter: { ...homepage.newsletter, description: e.target.value }
                          })
                        }
                        className="admin-textarea"
                        style={{ height: "60px" }}
                      />
                    </div>

                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label className="admin-label">النص المؤقت لخانة الإدخال (Placeholder)</label>
                        <input
                          type="text"
                          value={homepage.newsletter.placeholder}
                          onChange={(e) =>
                            updateHomepage({
                              ...homepage,
                              newsletter: { ...homepage.newsletter, placeholder: e.target.value }
                            })
                          }
                          className="admin-input"
                        />
                      </div>
                      <div className="admin-form-group">
                        <label className="admin-label">نص زر الاشتراك</label>
                        <input
                          type="text"
                          value={homepage.newsletter.buttonText}
                          onChange={(e) =>
                            updateHomepage({
                              ...homepage,
                              newsletter: { ...homepage.newsletter, buttonText: e.target.value }
                            })
                          }
                          className="admin-input"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* THEME CUSTOMIZER */}
        {activeTab === "theme" && (
          <div className="animate-fade-in">
            <div className="admin-header">
              <div>
                <h2>تخصيص مظهر المتجر</h2>
                <div className="admin-title-desc">تعديل لوحة ألوان الهوية البصرية، الخطوط المستخدمة، وحواف الأزرار والبطاقات.</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "30px" }}>
              {/* Colors editing panel */}
              <div className="form-card">
                <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>
                  لوحة ألوان المتجر
                </h3>

                <div className="color-picker-grid">
                  {/* Primary */}
                  <div className="color-input-wrapper">
                    <label className="admin-label">اللون الأساسي</label>
                    <div className="color-input-control">
                      <div
                        className="color-dot-preview"
                        style={{ backgroundColor: theme.colors.primary }}
                      >
                        <input
                          type="color"
                          value={theme.colors.primary}
                          onChange={(e) =>
                            updateTheme({
                              ...theme,
                              colors: { ...theme.colors, primary: e.target.value }
                            })
                          }
                          className="color-dot-preview color-picker-native"
                        />
                      </div>
                      <input
                        type="text"
                        value={theme.colors.primary}
                        onChange={(e) =>
                          updateTheme({
                            ...theme,
                            colors: { ...theme.colors, primary: e.target.value }
                          })
                        }
                        className="color-text-input"
                      />
                    </div>
                  </div>

                  {/* Secondary */}
                  <div className="color-input-wrapper">
                    <label className="admin-label">اللون الثانوي</label>
                    <div className="color-input-control">
                      <div
                        className="color-dot-preview"
                        style={{ backgroundColor: theme.colors.secondary }}
                      >
                        <input
                          type="color"
                          value={theme.colors.secondary}
                          onChange={(e) =>
                            updateTheme({
                              ...theme,
                              colors: { ...theme.colors, secondary: e.target.value }
                            })
                          }
                          className="color-dot-preview color-picker-native"
                        />
                      </div>
                      <input
                        type="text"
                        value={theme.colors.secondary}
                        onChange={(e) =>
                          updateTheme({
                            ...theme,
                            colors: { ...theme.colors, secondary: e.target.value }
                          })
                        }
                        className="color-text-input"
                      />
                    </div>
                  </div>

                  {/* Accent */}
                  <div className="color-input-wrapper">
                    <label className="admin-label">لون التمييز (الذهبي)</label>
                    <div className="color-input-control">
                      <div
                        className="color-dot-preview"
                        style={{ backgroundColor: theme.colors.accent }}
                      >
                        <input
                          type="color"
                          value={theme.colors.accent}
                          onChange={(e) =>
                            updateTheme({
                              ...theme,
                              colors: { ...theme.colors, accent: e.target.value }
                            })
                          }
                          className="color-dot-preview color-picker-native"
                        />
                      </div>
                      <input
                        type="text"
                        value={theme.colors.accent}
                        onChange={(e) =>
                          updateTheme({
                            ...theme,
                            colors: { ...theme.colors, accent: e.target.value }
                          })
                        }
                        className="color-text-input"
                      />
                    </div>
                  </div>

                  {/* Background */}
                  <div className="color-input-wrapper">
                    <label className="admin-label">خلفية الصفحات</label>
                    <div className="color-input-control">
                      <div
                        className="color-dot-preview"
                        style={{ backgroundColor: theme.colors.background }}
                      >
                        <input
                          type="color"
                          value={theme.colors.background}
                          onChange={(e) =>
                            updateTheme({
                              ...theme,
                              colors: { ...theme.colors, background: e.target.value }
                            })
                          }
                          className="color-dot-preview color-picker-native"
                        />
                      </div>
                      <input
                        type="text"
                        value={theme.colors.background}
                        onChange={(e) =>
                          updateTheme({
                            ...theme,
                            colors: { ...theme.colors, background: e.target.value }
                          })
                        }
                        className="color-text-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Typography & styling configs */}
              <div className="form-card">
                <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>
                  الخطوط والنمط البصري
                </h3>

                <div className="admin-form-group">
                  <label className="admin-label">خط العناوين الرئيسي</label>
                  <select
                    value={theme.fonts.heading}
                    onChange={(e) =>
                      updateTheme({
                        ...theme,
                        fonts: { ...theme.fonts, heading: e.target.value }
                      })
                    }
                    className="admin-select"
                  >
                    <option value="Outfit">Outfit (أجنبي متميز)</option>
                    <option value="Cairo">Cairo (عربي عصري)</option>
                    <option value="Amiri">Amiri (عربي كلاسيكي)</option>
                    <option value="Playfair Display">Playfair Display (أجنبي سيريف كلاسيك)</option>
                    <option value="Inter">Inter (أجنبي تقني نظيف)</option>
                    <option value="Montserrat">Montserrat (أجنبي هندسي عريض)</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">خط نصوص الفقرات والمحتوى</label>
                  <select
                    value={theme.fonts.body}
                    onChange={(e) =>
                      updateTheme({
                        ...theme,
                        fonts: { ...theme.fonts, body: e.target.value }
                      })
                    }
                    className="admin-select"
                  >
                    <option value="Inter">Inter (أجنبي مقروء جداً)</option>
                    <option value="Cairo">Cairo (عربي دائري مريح)</option>
                    <option value="Roboto">Roboto (أجنبي افتراضي)</option>
                    <option value="Open Sans">Open Sans (أجنبي مريح)</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">مخطط تصميم المتجر (Layout Theme)</label>
                  <select
                    value={theme.layoutStyle || "luxury"}
                    onChange={(e) =>
                      updateTheme({
                        ...theme,
                        layoutStyle: e.target.value as any
                      })
                    }
                    className="admin-select"
                  >
                    <option value="luxury">كلاسيك فاخر (Classic Luxury / عطور)</option>
                    <option value="modern">أزياء عصري (Modern Split-Grid / ملابس)</option>
                    <option value="editorial">طبيعي هادئ (Editorial Collage / مستحضرات)</option>
                  </select>
                </div>

                {theme.layoutStyle === "editorial" && (
                  <div className="admin-form-group" style={{ backgroundColor: "#f8fafc", padding: "15px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <label className="admin-label" style={{ margin: 0 }}>شريط الإعلانات العلوي</label>
                      <label style={{ display: "inline-flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>
                        <input
                          type="checkbox"
                          checked={theme.announcementEnabled !== false}
                          onChange={(e) =>
                            updateTheme({
                              ...theme,
                              announcementEnabled: e.target.checked
                            })
                          }
                          style={{ width: "16px", height: "16px", accentColor: "var(--accent-color)" }}
                        />
                        تفعيل شريط الإعلانات
                      </label>
                    </div>

                    <input
                      type="text"
                      value={theme.announcementText || ""}
                      onChange={(e) =>
                        updateTheme({
                          ...theme,
                          announcementText: e.target.value
                        })
                      }
                      className="admin-input"
                      placeholder="مثال: ✨ شحن مجاني لجميع الطلبات فوق 500 جنيه بمناسبة الافتتاح! ✨"
                      style={{ height: "36px", fontSize: "12px", backgroundColor: "#fff" }}
                      disabled={theme.announcementEnabled === false}
                    />
                    <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
                      يظهر هذا الشريط في أعلى الموقع للثيم الطبيعي/مستحضرات التجميل للإعلان عن عروض التوصيل أو أكواد الخصم.
                    </div>
                  </div>
                )}

                <div className="admin-form-group">
                  <label className="admin-label">استدارة حواف البطاقات والأزرار</label>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    value={parseInt(theme.ui.borderRadius)}
                    onChange={(e) =>
                      updateTheme({
                        ...theme,
                        ui: { ...theme.ui, borderRadius: `${e.target.value}px` }
                      })
                    }
                    style={{ width: "100%", accentColor: "var(--accent-color)" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "600", marginTop: "6px" }}>
                    <span>0 بكسل (حواف حادة)</span>
                    <span style={{ color: "var(--accent-color)" }}>{theme.ui.borderRadius}</span>
                    <span>24 بكسل (حواف مستديرة)</span>
                  </div>
                </div>
              </div>

              {/* Logo & Favicon Customizer Card */}
              <div className="form-card" style={{ gridColumn: "span 2", marginTop: "10px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>
                  شعار وأيقونة الموقع (Logo & Favicon)
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
                  {/* Website Logo Box */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <label className="admin-label" style={{ fontWeight: "700" }}>شعار المتجر (Logo)</label>
                    <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                      {/* Logo Preview Container */}
                      <div style={{
                        width: "120px",
                        height: "80px",
                        border: "1px dashed var(--border-color)",
                        borderRadius: "var(--border-radius)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f8fafc",
                        overflow: "hidden",
                        padding: "10px"
                      }}>
                        {theme.logo ? (
                          <img src={theme.logo} alt="Logo Preview" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                        ) : (
                          <span style={{ fontSize: "11px", color: "#94a3b8", textAlign: "center" }}>لا يوجد شعار (نص فقط)</span>
                        )}
                      </div>

                      {/* Upload and input buttons */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                        <div style={{ position: "relative", cursor: "pointer", display: "inline-block" }}>
                          <button type="button" className="btn btn-secondary" style={{ width: "100%", height: "36px", fontSize: "12px" }}>
                            رفع شعار من الجهاز
                          </button>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const files = e.target.files;
                              if (files && files.length > 0) {
                                const base64 = await compressImage(files[0]);
                                updateTheme({ ...theme, logo: base64 });
                              }
                            }}
                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
                          />
                        </div>

                        {theme.logo && (
                          <button
                            type="button"
                            onClick={() => updateTheme({ ...theme, logo: "" })}
                            className="btn"
                            style={{
                              width: "100%",
                              height: "36px",
                              fontSize: "12px",
                              backgroundColor: "#fee2e2",
                              color: "#ef4444",
                              border: "1px solid #fecaca"
                            }}
                          >
                            إزالة الشعار
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Manual Link Input */}
                    <div style={{ marginTop: "6px" }}>
                      <span style={{ fontSize: "11px", color: "var(--secondary-color)", display: "block", marginBottom: "4px" }}>أو أدخل رابط الشعار مباشرة:</span>
                      <input
                        type="text"
                        value={theme.logo}
                        onChange={(e) => updateTheme({ ...theme, logo: e.target.value })}
                        className="admin-input"
                        placeholder="https://example.com/logo.png"
                        style={{ height: "36px", fontSize: "12px" }}
                      />
                    </div>
                  </div>

                  {/* Browser Favicon Box */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <label className="admin-label" style={{ fontWeight: "700" }}>أيقونة المتصفح (Favicon)</label>
                    <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                      {/* Favicon Preview Container */}
                      <div style={{
                        width: "80px",
                        height: "80px",
                        border: "1px dashed var(--border-color)",
                        borderRadius: "var(--border-radius)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f8fafc",
                        overflow: "hidden",
                        padding: "10px"
                      }}>
                        {theme.favicon ? (
                          <img src={theme.favicon} alt="Favicon Preview" style={{ width: "32px", height: "32px", objectFit: "contain" }} />
                        ) : (
                          <span style={{ fontSize: "11px", color: "#94a3b8", textAlign: "center" }}>لا توجد أيقونة</span>
                        )}
                      </div>

                      {/* Upload and input buttons */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                        <div style={{ position: "relative", cursor: "pointer", display: "inline-block" }}>
                          <button type="button" className="btn btn-secondary" style={{ width: "100%", height: "36px", fontSize: "12px" }}>
                            رفع أيقونة من الجهاز
                          </button>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const files = e.target.files;
                              if (files && files.length > 0) {
                                const base64 = await compressImage(files[0]);
                                updateTheme({ ...theme, favicon: base64 });
                              }
                            }}
                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
                          />
                        </div>

                        {theme.favicon && (
                          <button
                            type="button"
                            onClick={() => updateTheme({ ...theme, favicon: "" })}
                            className="btn"
                            style={{
                              width: "100%",
                              height: "36px",
                              fontSize: "12px",
                              backgroundColor: "#fee2e2",
                              color: "#ef4444",
                              border: "1px solid #fecaca"
                            }}
                          >
                            إزالة الأيقونة
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Manual Link Input */}
                    <div style={{ marginTop: "6px" }}>
                      <span style={{ fontSize: "11px", color: "var(--secondary-color)", display: "block", marginBottom: "4px" }}>أو أدخل رابط الأيقونة مباشرة:</span>
                      <input
                        type="text"
                        value={theme.favicon}
                        onChange={(e) => updateTheme({ ...theme, favicon: e.target.value })}
                        className="admin-input"
                        placeholder="https://example.com/favicon.ico"
                        style={{ height: "36px", fontSize: "12px" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEO & CONTACT INFO */}
        {activeTab === "info" && (
          <div className="animate-fade-in">
            <div className="admin-header">
              <div>
                <h2>معلومات المتجر الأساسية</h2>
                <div className="admin-title-desc">إعداد أرقام واتساب لتلقي الطلبات، البريد الإلكتروني الرسمي، وعنوان السيو والوصف.</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "30px" }}>
              {/* Left Side: Contact fields */}
              <div className="form-card">
                <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>
                  قنوات الاتصال الرسمية للمتجر
                </h3>

                <div className="admin-form-group">
                  <label className="admin-label">رقم واتس آب لتلقي الطلبات *</label>
                  <input
                    type="text"
                    value={storeInfo.whatsapp}
                    onChange={(e) =>
                      updateStoreInfo({
                        ...storeInfo,
                        whatsapp: e.target.value
                      })
                    }
                    className="admin-input"
                    placeholder="مثال: 201001234567+"
                    required
                  />
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
                    يرجى تضمين رمز الدولة (مثل 20+ لمصر). هذا هو الرقم الذي سيتلقى رسائل وتنبيهات الفواتير من العملاء.
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">الخط الساخن للهاتف</label>
                  <input
                    type="text"
                    value={storeInfo.phone}
                    onChange={(e) =>
                      updateStoreInfo({
                        ...storeInfo,
                        phone: e.target.value
                      })
                    }
                    className="admin-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">البريد الإلكتروني للمتجر</label>
                  <input
                    type="email"
                    value={storeInfo.email}
                    onChange={(e) =>
                      updateStoreInfo({
                        ...storeInfo,
                        email: e.target.value
                      })
                    }
                    className="admin-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">العنوان الجغرافي المعرض</label>
                  <input
                    type="text"
                    value={storeInfo.address}
                    onChange={(e) =>
                      updateStoreInfo({
                        ...storeInfo,
                        address: e.target.value
                      })
                    }
                    className="admin-input"
                  />
                </div>
              </div>

              {/* Right Side: SEO & Socials */}
              <div className="form-card">
                <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>
                  تحسين محركات البحث (SEO)
                </h3>

                <div className="admin-form-group">
                  <label className="admin-label">عنوان المتجر الرئيسي (SEO Title)</label>
                  <input
                    type="text"
                    value={storeInfo.seo.title}
                    onChange={(e) =>
                      updateStoreInfo({
                        ...storeInfo,
                        seo: { ...storeInfo.seo, title: e.target.value }
                      })
                    }
                    className="admin-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">وصف المتجر التعريفي (Meta Description)</label>
                  <textarea
                    value={storeInfo.seo.description}
                    onChange={(e) =>
                      updateStoreInfo({
                        ...storeInfo,
                        seo: { ...storeInfo.seo, description: e.target.value }
                      })
                    }
                    className="admin-textarea"
                    style={{ height: "80px" }}
                  />
                </div>
              </div>

              {/* Right Side Column 2: Social Media Links */}
              <div className="form-card" style={{ gridColumn: "span 2", marginTop: "20px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>
                  روابط التواصل الاجتماعي (السوشيال ميديا)
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div className="admin-form-group">
                    <label className="admin-label">رابط فيسبوك (Facebook)</label>
                    <input
                      type="text"
                      value={storeInfo.socials.facebook}
                      onChange={(e) =>
                        updateStoreInfo({
                          ...storeInfo,
                          socials: { ...storeInfo.socials, facebook: e.target.value }
                        })
                      }
                      className="admin-input"
                      placeholder="https://facebook.com/username"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">رابط إنستغرام (Instagram)</label>
                    <input
                      type="text"
                      value={storeInfo.socials.instagram}
                      onChange={(e) =>
                        updateStoreInfo({
                          ...storeInfo,
                          socials: { ...storeInfo.socials, instagram: e.target.value }
                        })
                      }
                      className="admin-input"
                      placeholder="https://instagram.com/username"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">رابط تيك توك (TikTok)</label>
                    <input
                      type="text"
                      value={storeInfo.socials.tiktok}
                      onChange={(e) =>
                        updateStoreInfo({
                          ...storeInfo,
                          socials: { ...storeInfo.socials, tiktok: e.target.value }
                        })
                      }
                      className="admin-input"
                      placeholder="https://tiktok.com/@username"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">رابط إكس / تويتر (X / Twitter)</label>
                    <input
                      type="text"
                      value={storeInfo.socials.twitter}
                      onChange={(e) =>
                        updateStoreInfo({
                          ...storeInfo,
                          socials: { ...storeInfo.socials, twitter: e.target.value }
                        })
                      }
                      className="admin-input"
                      placeholder="https://x.com/username"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PAGE CONTENT EDITORS */}
        {activeTab === "pages" && (
          <div className="animate-fade-in">
            <div className="admin-header">
              <div>
                <h2>محتوى الصفحات التعريفية</h2>
                <div className="admin-title-desc">تعديل نصوص صفحات (من نحن، الشروط والأحكام، سياسة الخصوصية).</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "30px" }}>
              {/* About Content Editor */}
              <div className="form-card">
                <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>
                  قصتنا (صفحة من نحن)
                </h3>

                <div className="admin-form-group">
                  <label className="admin-label">عنوان الصفحة</label>
                  <input
                    type="text"
                    value={pages.about.title}
                    onChange={(e) =>
                      updatePages({
                        ...pages,
                        about: { ...pages.about, title: e.target.value }
                      })
                    }
                    className="admin-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">نص القصة والتعريف</label>
                  <textarea
                    value={pages.about.content}
                    onChange={(e) =>
                      updatePages({
                        ...pages,
                        about: { ...pages.about, content: e.target.value }
                      })
                    }
                    className="admin-textarea"
                    style={{ height: "200px" }}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">رابط صورة صفحة من نحن</label>
                  <input
                    type="text"
                    value={pages.about.image}
                    onChange={(e) =>
                      updatePages({
                        ...pages,
                        about: { ...pages.about, image: e.target.value }
                      })
                    }
                    className="admin-input"
                  />
                </div>
              </div>

              {/* Privacy and Terms Editors */}
              <div className="form-card">
                <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>
                  صفحات السياسات القانونية
                </h3>

                <div className="admin-form-group">
                  <label className="admin-label">محتوى سياسة الخصوصية</label>
                  <textarea
                    value={pages.privacy.content}
                    onChange={(e) =>
                      updatePages({
                        ...pages,
                        privacy: { ...pages.privacy, content: e.target.value }
                      })
                    }
                    className="admin-textarea"
                    style={{ height: "130px" }}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">محتوى الشروط والأحكام</label>
                  <textarea
                    value={pages.terms.content}
                    onChange={(e) =>
                      updatePages({
                        ...pages,
                        terms: { ...pages.terms, content: e.target.value }
                      })
                    }
                    className="admin-textarea"
                    style={{ height: "130px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COUPONS CRUD */}
        {activeTab === "coupons" && (
          <div className="animate-fade-in">
            <div className="admin-header">
              <div>
                <h2>إدارة أكواد الخصم (Promo Codes)</h2>
                <div className="admin-title-desc">إنشاء وتعديل وتفعيل كوبونات الخصم للمتجر (خصم قيمة ثابتة أو نسبة مئوية).</div>
              </div>
              <button onClick={openAddCoupon} className="btn btn-primary" style={{ display: "flex", gap: "8px", alignItems: "center", height: "40px" }}>
                <Plus size={16} />
                <span>إضافة كود خصم</span>
              </button>
            </div>

            <div className="form-card" style={{ padding: "20px" }}>
              {coupons.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                  لا توجد أكواد خصم حالية. اضغط على زر "إضافة كود خصم" لإنشاء أول كود.
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", direction: "rtl", textAlign: "right" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid var(--border-color)", color: "#475569" }}>
                        <th style={{ padding: "12px", fontSize: "14px", fontWeight: "700" }}>الكود</th>
                        <th style={{ padding: "12px", fontSize: "14px", fontWeight: "700" }}>نوع الخصم</th>
                        <th style={{ padding: "12px", fontSize: "14px", fontWeight: "700" }}>قيمة الخصم</th>
                        <th style={{ padding: "12px", fontSize: "14px", fontWeight: "700" }}>الحد الأدنى للطلب</th>
                        <th style={{ padding: "12px", fontSize: "14px", fontWeight: "700" }}>الحالة</th>
                        <th style={{ padding: "12px", fontSize: "14px", fontWeight: "700", textAlign: "center" }}>إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coupons.map((coupon) => (
                        <tr key={coupon.id} style={{ borderBottom: "1px solid var(--border-color)", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                          <td style={{ padding: "14px 12px", fontSize: "14px", fontWeight: "700", color: "var(--primary-color)" }}>
                            <span style={{ backgroundColor: "#f1f5f9", padding: "4px 10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
                              {coupon.code}
                            </span>
                          </td>
                          <td style={{ padding: "14px 12px", fontSize: "13px" }}>
                            {coupon.type === "percentage" ? "نسبة مئوية (%)" : "قيمة ثابتة"}
                          </td>
                          <td style={{ padding: "14px 12px", fontSize: "14px", fontWeight: "600" }}>
                            {coupon.type === "percentage" ? `${coupon.value}%` : `${coupon.value} ج.م`}
                          </td>
                          <td style={{ padding: "14px 12px", fontSize: "13px", color: "#64748b" }}>
                            {coupon.minOrderValue ? `${coupon.minOrderValue} ج.م` : "بدون حد أدنى"}
                          </td>
                          <td style={{ padding: "14px 12px", fontSize: "13px" }}>
                            <span style={{
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "11px",
                              fontWeight: "600",
                              backgroundColor: coupon.isActive ? "#d1fae5" : "#fee2e2",
                              color: coupon.isActive ? "#065f46" : "#991b1b"
                            }}>
                              {coupon.isActive ? "نشط" : "معطل"}
                            </span>
                          </td>
                          <td style={{ padding: "14px 12px", textAlign: "center" }}>
                            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                              <button onClick={() => openEditCoupon(coupon)} className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "11px", display: "flex", gap: "4px", alignItems: "center", height: "30px" }}>
                                <Edit2 size={12} />
                                <span>تعديل</span>
                              </button>
                              <button onClick={() => handleCouponDelete(coupon.id)} className="btn" style={{ padding: "6px 12px", fontSize: "11px", display: "flex", gap: "4px", alignItems: "center", backgroundColor: "#fee2e2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: "var(--border-radius)", height: "30px" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fecaca"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#fee2e2"}>
                                <Trash2 size={12} />
                                <span>حذف</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ========================================================== */}
      {/* PRODUCTS CRUD DIALOG MODAL */}
      {/* ========================================================== */}
      {isProductModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsProductModalOpen(false)}>
          <div className="admin-modal animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal-title">
              {editingProduct ? `تعديل المنتج: ${editingProduct.name}` : "إنشاء منتج جديد"}
            </h3>

            <form onSubmit={handleProductSubmit}>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">اسم المنتج *</label>
                  <input
                    type="text"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    className="admin-input"
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">كود / رمز المنتج في الرابط (اختياري)</label>
                  <input
                    type="text"
                    placeholder="مثال: 103 أو sandal-royal"
                    value={prodCode}
                    onChange={(e) => setProdCode(e.target.value)}
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="admin-form-row">
                 <div className="admin-form-group">
                    <label className="admin-label">السعر (جنيه مصري) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(Number(e.target.value))}
                      className="admin-input"
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">السعر الأصلي قبل الخصم (اختياري)</label>
                   <input
                     type="number"
                     step="0.01"
                     value={prodOriginalPrice}
                     onChange={(e) => setProdOriginalPrice(e.target.value)}
                     className="admin-input"
                     placeholder="لإظهار نسبة الخصم للعملاء"
                   />
                 </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">القسم *</label>
                  <select
                    value={prodCategoryId}
                    onChange={(e) => setProdCategoryId(e.target.value)}
                    className="admin-select"
                    required
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="admin-form-group" style={{ display: "flex", gap: "20px", alignItems: "center", paddingTop: "25px" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <label className="switch" style={{ marginLeft: "8px" }}>
                      <input
                        type="checkbox"
                        checked={prodFeatured}
                        onChange={(e) => setProdFeatured(e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                    <span className="admin-label" style={{ marginBottom: "0", fontSize: "13px" }}>منتج مميز</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center" }}>
                    <label className="switch" style={{ marginLeft: "8px" }}>
                      <input
                        type="checkbox"
                        checked={prodIsSoldOut}
                        onChange={(e) => setProdIsSoldOut(e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                    <span className="admin-label" style={{ marginBottom: "0", fontSize: "13px", color: prodIsSoldOut ? "#ef4444" : "inherit" }}>
                      نفذت الكمية (Sold Out)
                    </span>
                  </div>
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">صور المنتج *</label>
                
                {/* 1. Upload box & Manual URL inputs */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                  {/* File Upload Box */}
                  <div style={{
                    border: "2px dashed var(--border-color)",
                    borderRadius: "var(--border-radius)",
                    padding: "15px",
                    textAlign: "center",
                    cursor: "pointer",
                    position: "relative",
                    backgroundColor: "#f8fafc",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100px"
                  }}>
                    <Plus size={24} style={{ color: "var(--secondary-color)", marginBottom: "6px" }} />
                    <span style={{ fontSize: "12px", color: "var(--secondary-color)", fontWeight: "600" }}>
                      اضغط لرفع صور من جهازك
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleProductImageUpload}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        opacity: 0,
                        cursor: "pointer"
                      }}
                    />
                  </div>

                  {/* Manual URL Input */}
                  <div style={{
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--border-radius)",
                    padding: "15px",
                    backgroundColor: "#ffffff",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}>
                    <span style={{ fontSize: "12px", color: "var(--secondary-color)", fontWeight: "600", marginBottom: "8px", display: "block" }}>
                      أو أضف رابط صورة خارجي:
                    </span>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input
                        type="text"
                        placeholder="https://example.com/image.jpg"
                        value={manualImageUrl}
                        onChange={(e) => setManualImageUrl(e.target.value)}
                        className="admin-input"
                        style={{ height: "38px", fontSize: "12px", flexGrow: 1 }}
                      />
                      <button
                        type="button"
                        onClick={addManualImageUrl}
                        className="btn btn-primary"
                        style={{ height: "38px", padding: "0 14px", fontSize: "12px" }}
                      >
                        إضافة
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Image Previews Grid */}
                {prodImagesList.length > 0 && (
                  <div style={{ marginBottom: "15px" }}>
                    <span style={{ fontSize: "12px", color: "var(--secondary-color)", fontWeight: "600", marginBottom: "8px", display: "block" }}>
                      الصور المحددة ({prodImagesList.length}):
                    </span>
                    <div style={{
                      display: "flex",
                      gap: "10px",
                      overflowX: "auto",
                      padding: "8px 2px",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--border-radius)",
                      backgroundColor: "#f8fafc"
                    }}>
                      {prodImagesList.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          style={{
                            position: "relative",
                            width: "70px",
                            height: "70px",
                            flexShrink: 0,
                            borderRadius: "6px",
                            border: "1px solid var(--border-color)",
                            overflow: "hidden",
                            backgroundColor: "#ffffff"
                          }}
                        >
                          <img
                            src={imgUrl}
                            alt={`Preview ${idx}`}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                          <button
                            type="button"
                            onClick={() => removeProductImage(idx)}
                            style={{
                              position: "absolute",
                              top: "2px",
                              right: "2px",
                              backgroundColor: "rgba(239, 68, 68, 0.9)",
                              color: "#ffffff",
                              border: "none",
                              borderRadius: "50%",
                              width: "18px",
                              height: "18px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              fontSize: "10px",
                              padding: 0
                            }}
                            title="حذف الصورة"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="admin-form-group">
                <label className="admin-label">الوصف التفصيلي</label>
                <textarea
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="admin-textarea"
                />
              </div>

              {/* Attributes Builder */}
              <div className="admin-form-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span className="admin-label" style={{ marginBottom: "0" }}>مواصفات المنتج الديناميكية</span>
                  <button
                    type="button"
                    onClick={addAttrRow}
                    className="btn btn-secondary"
                    style={{ padding: "4px 12px", fontSize: "11px", height: "auto" }}
                  >
                    + إضافة مواصفة
                  </button>
                </div>

                <div className="admin-attributes-list" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  {prodAttrs.length === 0 ? (
                    <span style={{ fontSize: "12px", color: "#64748b", fontStyle: "italic" }}>
                      لم يتم تكوين أي مواصفات. (مثال: الحجم، التركيز، اللون)
                    </span>
                  ) : (
                    prodAttrs.map((attr, idx) => (
                      <div key={idx} style={{
                        border: "1px solid var(--border-color)",
                        borderRadius: "var(--border-radius)",
                        padding: "15px",
                        backgroundColor: "#f8fafc"
                      }}>
                        <div style={{ display: "flex", gap: "10px", marginBottom: "12px", alignItems: "center" }}>
                          {/* Attribute Name Input */}
                          <div style={{ flex: 1 }}>
                            <label className="admin-label" style={{ fontSize: "11px", marginBottom: "4px" }}>اسم المواصفة (مثال: الحجم أو التركيز):</label>
                            <input
                              type="text"
                              placeholder="مثال: الحجم"
                              value={attr.name}
                              onChange={(e) => handleAttrRowNameChange(idx, e.target.value)}
                              className="admin-input"
                              style={{ height: "36px" }}
                            />
                          </div>

                          {/* Delete Attribute Row Button */}
                          <button
                            type="button"
                            onClick={() => removeAttrRow(idx)}
                            className="btn-icon"
                            style={{ width: "32px", height: "32px", marginTop: "18px", backgroundColor: "#fee2e2", border: "1px solid #fecaca" }}
                            title="حذف المواصفة بالكامل"
                          >
                            <Trash2 size={12} style={{ color: "#ef4444" }} />
                          </button>
                        </div>

                        {/* Attribute Option Chips Input */}
                        <div>
                          <label className="admin-label" style={{ fontSize: "11px", marginBottom: "4px" }}>القيم المضافة للمواصفة:</label>
                          
                          {/* Tags Preview List */}
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
                            {attr.options.length === 0 ? (
                              <span style={{ fontSize: "11px", color: "#94a3b8", fontStyle: "italic" }}>لا توجد قيم مضافة بعد. اكتب قيمة بالأسفل واضغط إضافة.</span>
                            ) : (
                              attr.options.map((opt, optIdx) => (
                                <div
                                  key={optIdx}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    backgroundColor: "var(--accent-alpha-10)",
                                    border: "1px solid var(--accent-color)",
                                    color: "var(--primary-color)",
                                    padding: "3px 10px",
                                    borderRadius: "15px",
                                    fontSize: "12px",
                                    fontWeight: "600"
                                  }}
                                >
                                  <span>{opt}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeAttrOption(idx, optIdx)}
                                    style={{
                                      backgroundColor: "transparent",
                                      border: "none",
                                      color: "var(--secondary-color)",
                                      cursor: "pointer",
                                      fontSize: "10px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      padding: 0
                                    }}
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))
                            )}
                          </div>

                          {/* Temp tag text input and append button */}
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <input
                              type="text"
                              placeholder="القيمة (مثال: 100 مل)"
                              value={attr.tempOption || ""}
                              onChange={(e) => handleAttrRowTempOptionChange(idx, e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  addAttrOption(idx);
                                }
                              }}
                              className="admin-input"
                              style={{ height: "38px", fontSize: "13px", flex: 2 }}
                            />
                            <input
                              type="number"
                              placeholder="فارق السعر (اختياري) + EGP"
                              value={attr.tempOptionPrice || ""}
                              onChange={(e) => handleAttrRowTempOptionPriceChange(idx, e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  addAttrOption(idx);
                                }
                              }}
                              className="admin-input"
                              style={{ height: "38px", fontSize: "13px", flex: 1, minWidth: "120px" }}
                            />
                            <button
                              type="button"
                              onClick={() => addAttrOption(idx)}
                              className="btn btn-secondary"
                              style={{ 
                                height: "38px", 
                                padding: "0 20px", 
                                fontSize: "12px", 
                                fontWeight: "600",
                                whiteSpace: "nowrap", 
                                flexShrink: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                            >
                              إضافة قيمة
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "30px", paddingTop: "15px", borderTop: "1px solid #e2e8f0" }}>
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ padding: "8px 20px" }}
                >
                  إلغاء
                </button>
                <button type="submit" className="btn btn-primary" style={{ padding: "8px 20px" }}>
                  {editingProduct ? "حفظ التغييرات" : "إنشاء المنتج"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* CATEGORIES CRUD DIALOG MODAL */}
      {/* ========================================================== */}
      {isCategoryModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsCategoryModalOpen(false)}>
          <div className="admin-modal animate-slide-up" style={{ maxWidth: "500px" }} onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal-title">
              {editingCategory ? `تعديل القسم: ${editingCategory.name}` : "إنشاء قسم جديد"}
            </h3>

            <form onSubmit={handleCategorySubmit}>
              <div className="admin-form-group">
                <label className="admin-label">اسم القسم *</label>
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => {
                    setCatName(e.target.value);
                    if (!editingCategory) {
                      setCatSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                    }
                  }}
                  className="admin-input"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">رابط القسم اللطيف (slug) *</label>
                <input
                  type="text"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  className="admin-input"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">صورة غلاف القسم</label>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                  {/* File Upload Box */}
                  <div style={{
                    border: "2px dashed var(--border-color)",
                    borderRadius: "var(--border-radius)",
                    padding: "15px",
                    textAlign: "center",
                    cursor: "pointer",
                    position: "relative",
                    backgroundColor: "#f8fafc",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100px"
                  }}>
                    <Plus size={24} style={{ color: "var(--secondary-color)", marginBottom: "6px" }} />
                    <span style={{ fontSize: "12px", color: "var(--secondary-color)", fontWeight: "600" }}>
                      تحميل صورة من جهازك
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCategoryImageUpload}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        opacity: 0,
                        cursor: "pointer"
                      }}
                    />
                  </div>

                  {/* Manual URL input */}
                  <div style={{
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--border-radius)",
                    padding: "15px",
                    backgroundColor: "#ffffff",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                  }}>
                    <span style={{ fontSize: "12px", color: "var(--secondary-color)", fontWeight: "600", marginBottom: "8px", display: "block" }}>
                      أو أدخل رابط الصورة مباشرة:
                    </span>
                    <input
                      type="text"
                      placeholder="https://example.com/banner.jpg"
                      value={catImage}
                      onChange={(e) => setCatImage(e.target.value)}
                      className="admin-input"
                      style={{ height: "38px", fontSize: "12px" }}
                    />
                  </div>
                </div>

                {/* Banner image preview */}
                {catImage && (
                  <div>
                    <span style={{ fontSize: "12px", color: "var(--secondary-color)", fontWeight: "600", marginBottom: "6px", display: "block" }}>
                      معاينة الصورة المحددة:
                    </span>
                    <div style={{
                      position: "relative",
                      width: "100%",
                      height: "120px",
                      borderRadius: "6px",
                      border: "1px solid var(--border-color)",
                      overflow: "hidden",
                      backgroundColor: "#f8fafc"
                    }}>
                      <img src={catImage} alt="Category Banner Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <button
                        type="button"
                        onClick={() => setCatImage("")}
                        style={{
                          position: "absolute",
                          top: "6px",
                          right: "6px",
                          backgroundColor: "rgba(239, 68, 68, 0.9)",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "50%",
                          width: "22px",
                          height: "22px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer"
                        }}
                        title="حذف الصورة"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "30px", paddingTop: "15px", borderTop: "1px solid #e2e8f0" }}>
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ padding: "8px 20px" }}
                >
                  إلغاء
                </button>
                <button type="submit" className="btn btn-primary" style={{ padding: "8px 20px" }}>
                  {editingCategory ? "حفظ التغييرات" : "إنشاء القسم"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COUPONS DIALOG MODAL */}
      {isCouponModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsCouponModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "500px", direction: "rtl", textAlign: "right" }}>
            <div className="admin-modal-header">
              <h3>{editingCoupon ? "تعديل كود الخصم" : "إضافة كود خصم جديد"}</h3>
              <button onClick={() => setIsCouponModalOpen(false)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#64748b" }}>✕</button>
            </div>
            
            <form onSubmit={handleCouponSubmit}>
              <div className="admin-form-group">
                <label className="admin-label">رمز الكوبون (الرمز الترويجي) *</label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="admin-input"
                  style={{ textTransform: "uppercase", fontWeight: "700", letterSpacing: "1px" }}
                  placeholder="مثال: SAVE10"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">نوع الخصم *</label>
                <div style={{ display: "flex", gap: "20px", marginTop: "8px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="couponType"
                      checked={couponType === "percentage"}
                      onChange={() => setCouponType("percentage")}
                    />
                    <span>نسبة مئوية (%)</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="couponType"
                      checked={couponType === "fixed"}
                      onChange={() => setCouponType("fixed")}
                    />
                    <span>قيمة مالية ثابتة</span>
                  </label>
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">
                  {couponType === "percentage" ? "نسبة الخصم (%) *" : "قيمة الخصم الثابتة *"}
                </label>
                <input
                  type="number"
                  min="1"
                  max={couponType === "percentage" ? "100" : undefined}
                  value={couponValue || ""}
                  onChange={(e) => setCouponValue(Number(e.target.value))}
                  className="admin-input"
                  placeholder={couponType === "percentage" ? "مثال: 10" : "مثال: 50"}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">الحد الأدنى لقيمة الطلب لتطبيق الخصم (اختياري)</label>
                <input
                  type="number"
                  min="0"
                  value={couponMinOrder || ""}
                  onChange={(e) => setCouponMinOrder(Number(e.target.value))}
                  className="admin-input"
                  placeholder="مثال: 200 (اتركها فارغة لعدم التحديد)"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label" style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", marginTop: "15px" }}>
                  <input
                    type="checkbox"
                    checked={couponActive}
                    onChange={(e) => setCouponActive(e.target.checked)}
                    style={{ width: "16px", height: "16px" }}
                  />
                  <span style={{ fontSize: "14px", fontWeight: "600" }}>تفعيل هذا الكوبون فوراً</span>
                </label>
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "30px", paddingTop: "15px", borderTop: "1px solid #e2e8f0" }}>
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ padding: "8px 20px" }}
                >
                  إلغاء
                </button>
                <button type="submit" className="btn btn-primary" style={{ padding: "8px 20px" }}>
                  {editingCoupon ? "حفظ التعديلات" : "إنشاء الكوبون"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          onClick={() => setShowLogoutModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(6px)",
            animation: "fadeIn 0.25s ease",
            padding: "20px"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#1e293b",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "380px",
              padding: "32px 28px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              textAlign: "center",
              fontFamily: "'Cairo', sans-serif",
              direction: "rtl",
              animation: "scaleIn 0.25s ease"
            }}
          >
            {/* Icon */}
            <div style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "rgba(239, 68, 68, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 18px auto",
              border: "1px solid rgba(239, 68, 68, 0.2)"
            }}>
              <span style={{ fontSize: "26px" }}>🚪</span>
            </div>

            {/* Title */}
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#ffffff", margin: "0 0 8px 0" }}>تسجيل الخروج</h3>
            <p style={{ fontSize: "13px", color: "#94a3b8", margin: "0 0 24px 0", lineHeight: "1.6" }}>هل أنت متأكد من رغبتك في تسجيل الخروج من لوحة التحكم؟</p>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                onClick={() => setShowLogoutModal(false)}
                style={{
                  flex: 1,
                  padding: "11px 16px",
                  borderRadius: "8px",
                  border: "1px solid #334155",
                  backgroundColor: "transparent",
                  color: "#cbd5e1",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  sessionStorage.removeItem("admin_auth");
                  setIsAuthenticated(false);
                  setShowLogoutModal(false);
                  setEmailInput("");
                  setPasswordInput("");
                }}
                style={{
                  flex: 1,
                  padding: "11px 16px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#ef4444",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                تسجيل الخروج
              </button>
            </div>
          </div>

          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes scaleIn {
              from { opacity: 0; transform: scale(0.92); }
              to { opacity: 1; transform: scale(1); }
            }
          `}} />
        </div>
      )}
    </div>
  );
};
