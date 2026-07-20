import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Language = "ar" | "en" | "fr" | "pt";
export type Direction = "rtl" | "ltr";

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  dir: Direction;
}

export const LANGUAGES: LanguageInfo[] = [
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇪🇬", dir: "rtl" },
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", dir: "ltr" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", dir: "ltr" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹", dir: "ltr" }
];

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  ar: {
    // Nav & Header
    nav_home: "الرئيسية",
    nav_shop: "المتجر",
    nav_about: "قصتنا",
    nav_contact: "اتصل بنا",
    nav_admin: "لوحة التحكم (الإدارة)",
    nav_search: "البحث في المتجر",
    nav_wishlist: "قائمة المفضلة",
    nav_cart: "سلة المشتريات",
    nav_menu: "قائمة التنقل",

    // Shop Page
    shop_title: "استكشف جميع المنتجات",
    shop_all_categories: "جميع المنتجات",
    shop_search_placeholder: "ابحث عن منتج...",
    shop_filter_btn: "تصفية وتصفح المنتجات",
    shop_price_max: "السعر الأقصى",
    shop_categories: "الأقسام",
    shop_search_widget: "البحث",
    shop_results_count: "عرض المنتجات",
    shop_no_products: "لم يتم العثور على منتجات",
    shop_no_products_desc: "لم نتمكن من العثور على أي منتج يطابق خيارات الفرز المحددة.",
    shop_reset_filters: "إعادة تعيين الفلاتر",
    shop_wishlist_only: "عرض المفضلة فقط",
    shop_show_all: "عرض جميع المنتجات",

    // Product Card & Details
    product_sold_out: "نفذت الكمية",
    product_out_of_stock: "غير متوفر حالياً (نفذت الكمية)",
    product_discount: "خصم",
    product_featured: "مميز",
    product_video_badge: "فيديو",
    product_add_to_cart: "إضافة للسلة",
    product_buy_now: "شراء الآن (إتمام الطلب مباشرة)",
    product_back_to_shop: "العودة للمتجر",
    product_not_found: "المنتج غير موجود",
    product_choose: "اختر",
    product_reviews: "تقييمات العملاء",
    product_added_msg: "✓ تم إضافة المنتج إلى السلة بنجاح!",
    product_select_required: "يرجى اختيار الخيارات المحددة قبل الإضافة",

    // Cart & Checkout
    cart_title: "سلة المشتريات",
    cart_empty: "سلة مشترياتك فارغة تماماً.",
    cart_go_shop: "اذهب للمتجر",
    cart_subtotal: "المجموع الفرعي:",
    cart_total: "إجمالي الطلب:",
    cart_view_cart: "عرض سلة المشتريات",
    cart_checkout: "إتمام الطلب",
    cart_remove: "حذف المنتج",
    
    checkout_title: "إتمام الشحن والطلب",
    checkout_customer_info: "بيانات المشتري والشحن",
    checkout_full_name: "الاسم بالكامل",
    checkout_phone: "رقم الهاتف (للتواصل وتأكيد الشحن)",
    checkout_city: "المحافظة / المدينة",
    checkout_address: "العنوان التفصيلي (الشارع / رقم المبنى / الشقة)",
    checkout_notes: "ملاحظات إضافية للتوصيل (اختياري)",
    checkout_summary: "ملخص الطلب",
    checkout_payment_method: "طريقة الدفع",
    checkout_cod: "الدفع نقداً عند الاستلام (COD)",
    checkout_place_order: "تأكيد وإرسال الطلب الآن",
    checkout_order_success: "🎉 تم إرسال طلبك بنجاح!",
    checkout_thanks: "شكراً لثقتك بنا. سنتواصل معك هاتفياً أو عبر الواتساب لتأكيد شحن الطلب.",
    checkout_new_order: "إنشاء طلب جديد",

    // Footer
    footer_quick_links: "روابط سريعة",
    footer_legal: "تفاصيل قانونية",
    footer_contact_info: "عنوان المتجر والتواصل",
    footer_rights: "جميع الحقوق محفوظة",
    footer_made_with: "صنع بحب لتجربة تسوق راقية ومتميزة."
  },

  en: {
    // Nav & Header
    nav_home: "Home",
    nav_shop: "Shop",
    nav_about: "Our Story",
    nav_contact: "Contact Us",
    nav_admin: "Admin Dashboard",
    nav_search: "Search Store",
    nav_wishlist: "Wishlist",
    nav_cart: "Shopping Cart",
    nav_menu: "Navigation Menu",

    // Shop Page
    shop_title: "Explore All Products",
    shop_all_categories: "All Products",
    shop_search_placeholder: "Search products...",
    shop_filter_btn: "Filter & Browse Products",
    shop_price_max: "Max Price",
    shop_categories: "Categories",
    shop_search_widget: "Search",
    shop_results_count: "Showing Results",
    shop_no_products: "No Products Found",
    shop_no_products_desc: "We couldn't find any products matching your selected filter options.",
    shop_reset_filters: "Reset Filters",
    shop_wishlist_only: "Show Wishlist Only",
    shop_show_all: "Show All Products",

    // Product Card & Details
    product_sold_out: "Sold Out",
    product_out_of_stock: "Out of Stock",
    product_discount: "OFF",
    product_featured: "Featured",
    product_video_badge: "Video",
    product_add_to_cart: "Add to Cart",
    product_buy_now: "Buy Now (Direct Checkout)",
    product_back_to_shop: "Back to Shop",
    product_not_found: "Product Not Found",
    product_choose: "Choose",
    product_reviews: "customer reviews",
    product_added_msg: "✓ Item added to cart successfully!",
    product_select_required: "Please select all required options first",

    // Cart & Checkout
    cart_title: "Shopping Cart",
    cart_empty: "Your shopping cart is currently empty.",
    cart_go_shop: "Go to Shop",
    cart_subtotal: "Subtotal:",
    cart_total: "Order Total:",
    cart_view_cart: "View Shopping Cart",
    cart_checkout: "Checkout",
    cart_remove: "Remove Item",
    
    checkout_title: "Checkout & Shipping",
    checkout_customer_info: "Customer & Shipping Details",
    checkout_full_name: "Full Name",
    checkout_phone: "Phone Number",
    checkout_city: "City / Region",
    checkout_address: "Detailed Shipping Address",
    checkout_notes: "Delivery Notes (Optional)",
    checkout_summary: "Order Summary",
    checkout_payment_method: "Payment Method",
    checkout_cod: "Cash on Delivery (COD)",
    checkout_place_order: "Confirm & Place Order Now",
    checkout_order_success: "🎉 Order Placed Successfully!",
    checkout_thanks: "Thank you for your trust. We will contact you soon to confirm shipment.",
    checkout_new_order: "Place New Order",

    // Footer
    footer_quick_links: "Quick Links",
    footer_legal: "Legal Details",
    footer_contact_info: "Store Location & Contact",
    footer_rights: "All Rights Reserved",
    footer_made_with: "Crafted with love for an elegant shopping experience."
  },

  fr: {
    // Nav & Header
    nav_home: "Accueil",
    nav_shop: "Boutique",
    nav_about: "Notre Histoire",
    nav_contact: "Contactez-nous",
    nav_admin: "Panneau d'administration",
    nav_search: "Rechercher dans la boutique",
    nav_wishlist: "Favoris",
    nav_cart: "Panier",
    nav_menu: "Menu de Navigation",

    // Shop Page
    shop_title: "Explorer tous les produits",
    shop_all_categories: "Tous les produits",
    shop_search_placeholder: "Rechercher des produits...",
    shop_filter_btn: "Filtrer les produits",
    shop_price_max: "Prix maximum",
    shop_categories: "Catégories",
    shop_search_widget: "Recherche",
    shop_results_count: "Résultats affichés",
    shop_no_products: "Aucun produit trouvé",
    shop_no_products_desc: "Aucun produit ne correspond à vos filtres de recherche.",
    shop_reset_filters: "Réinitialiser les filtres",
    shop_wishlist_only: "Favoris uniquement",
    shop_show_all: "Afficher tous les produits",

    // Product Card & Details
    product_sold_out: "Épuisé",
    product_out_of_stock: "Rupture de stock",
    product_discount: "Remise",
    product_featured: "En Vedette",
    product_video_badge: "Vidéo",
    product_add_to_cart: "Ajouter au Panier",
    product_buy_now: "Acheter Maintenant (Commande Directe)",
    product_back_to_shop: "Retour à la boutique",
    product_not_found: "Produit non trouvé",
    product_choose: "Choisir",
    product_reviews: "avis clients",
    product_added_msg: "✓ Produit ajouté au panier avec succès !",
    product_select_required: "Veuillez sélectionner toutes les options requises",

    // Cart & Checkout
    cart_title: "Votre Panier",
    cart_empty: "Votre panier est actuellement vide.",
    cart_go_shop: "Aller à la boutique",
    cart_subtotal: "Sous-total :",
    cart_total: "Total Commande :",
    cart_view_cart: "Voir le panier",
    cart_checkout: "Passer la commande",
    cart_remove: "Supprimer",

    checkout_title: "Finaliser la Commande",
    checkout_customer_info: "Informations Client & Livraison",
    checkout_full_name: "Nom Complet",
    checkout_phone: "Numéro de Téléphone",
    checkout_city: "Ville / Région",
    checkout_address: "Adresse de Livraison Détaillée",
    checkout_notes: "Notes de Livraison (Optionnel)",
    checkout_summary: "Résumé de la Commande",
    checkout_payment_method: "Mode de Paiement",
    checkout_cod: "Paiement à la Livraison (COD)",
    checkout_place_order: "Confirmer la Commande Maintenant",
    checkout_order_success: "🎉 Commande Enregistrée avec Succès !",
    checkout_thanks: "Merci de votre confiance. Nous vous contacterons rapidement.",
    checkout_new_order: "Nouvelle Commande",

    // Footer
    footer_quick_links: "Liens Rapides",
    footer_legal: "Mentions Légales",
    footer_contact_info: "Contact & Adresse",
    footer_rights: "Tous Droits Réservés",
    footer_made_with: "Conçu avec soin pour une expérience d'achat élégante."
  },

  pt: {
    // Nav & Header
    nav_home: "Início",
    nav_shop: "Loja",
    nav_about: "Nossa História",
    nav_contact: "Fale Conosco",
    nav_admin: "Painel Admin",
    nav_search: "Pesquisar na Loja",
    nav_wishlist: "Favoritos",
    nav_cart: "Carrinho",
    nav_menu: "Menu de Navegação",

    // Shop Page
    shop_title: "Explorar Todos os Produtos",
    shop_all_categories: "Todos os Produtos",
    shop_search_placeholder: "Pesquisar produtos...",
    shop_filter_btn: "Filtrar Produtos",
    shop_price_max: "Preço Máximo",
    shop_categories: "Categorias",
    shop_search_widget: "Pesquisa",
    shop_results_count: "Resultados Exibidos",
    shop_no_products: "Nenhum Produto Encontrado",
    shop_no_products_desc: "Não encontramos produtos correspondentes aos seus filtros.",
    shop_reset_filters: "Redefinir Filtros",
    shop_wishlist_only: "Apenas Favoritos",
    shop_show_all: "Mostrar Todos os Produtos",

    // Product Card & Details
    product_sold_out: "Esgotado",
    product_out_of_stock: "Fora de Estoque",
    product_discount: "OFF",
    product_featured: "Destaque",
    product_video_badge: "Vídeo",
    product_add_to_cart: "Adicionar ao Carrinho",
    product_buy_now: "Comprar Agora (Checkout Direto)",
    product_back_to_shop: "Voltar à Loja",
    product_not_found: "Produto Não Encontrado",
    product_choose: "Escolher",
    product_reviews: "avaliações de clientes",
    product_added_msg: "✓ Item adicionado ao carrinho com sucesso!",
    product_select_required: "Selecione todas as opções necessárias primeiro",

    // Cart & Checkout
    cart_title: "Carrinho de Compras",
    cart_empty: "Seu carrinho de compras está vazio.",
    cart_go_shop: "Ir para a Loja",
    cart_subtotal: "Subtotal:",
    cart_total: "Total do Pedido:",
    cart_view_cart: "Ver Carrinho",
    cart_checkout: "Finalizar Compra",
    cart_remove: "Remover Item",

    checkout_title: "Finalizar Pedido",
    checkout_customer_info: "Dados do Cliente e Entrega",
    checkout_full_name: "Nome Completo",
    checkout_phone: "Número de Telefone",
    checkout_city: "Cidade / Região",
    checkout_address: "Endereço Completo de Entrega",
    checkout_notes: "Observações de Entrega (Opcional)",
    checkout_summary: "Resumo do Pedido",
    checkout_payment_method: "Forma de Pagamento",
    checkout_cod: "Pagamento na Entrega (COD)",
    checkout_place_order: "Confirmar Pedido Agora",
    checkout_order_success: "🎉 Pedido Realizado com Sucesso!",
    checkout_thanks: "Obrigado pela sua compra. Entraremos em contato em breve.",
    checkout_new_order: "Fazer Novo Pedido",

    // Footer
    footer_quick_links: "Links Rápidos",
    footer_legal: "Informações Legais",
    footer_contact_info: "Contato e Localização",
    footer_rights: "Todos os Direitos Reservados",
    footer_made_with: "Feito com carinho para uma experiência de compra elegante."
  }
};

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("app_storefront_lang");
    if (saved && ["ar", "en", "fr", "pt"].includes(saved)) {
      return saved as Language;
    }
    return "ar"; // Default: Arabic
  });

  const activeLangInfo = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];
  const direction = activeLangInfo.dir;

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app_storefront_lang", lang);
  };

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [language, direction]);

  const t = (key: string): string => {
    const langDict = TRANSLATIONS[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to Arabic dictionary or key name
    return TRANSLATIONS["ar"][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
