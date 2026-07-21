// WhatsApp Checkout Service
// Compiles customer cart items into a formatted order message and handles URL redirection.

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedAttributes: Record<string, string>; // e.g. { "Volume": "100ml", "Concentration": "Eau de Parfum" }
}

export const WhatsAppService = {
  formatMessage(
    storeName: string,
    customer: CustomerDetails,
    items: OrderItem[],
    totalPrice: number,
    couponCode?: string,
    discountAmount?: number,
    finalPrice?: number
  ): string {
    const divider = "----------------------------------------";
    
    // Header
    let msg = `🛍️ *طلب جديد من متجر: ${storeName}*\n`;
    msg += `${divider}\n\n`;
    
    // Customer Info
    msg += `👤 *بيانات العميل والشحن:*\n`;
    msg += `• *الاسم:* ${customer.name}\n`;
    msg += `• *الهاتف:* ${customer.phone}\n`;
    msg += `• *العنوان:* ${customer.address}\n`;
    if (customer.notes) {
      msg += `• *ملاحظات:* ${customer.notes}\n`;
    }
    msg += `\n`;
    
    // Items
    msg += `📦 *المنتجات المحددة:* (${items.length})\n`;
    items.forEach((item, index) => {
      let itemLines = `${index + 1}. *${item.name}*\n`;
      
      // Format attributes on new lines
      Object.entries(item.selectedAttributes).forEach(([key, val]) => {
        itemLines += `   - *${key}:* ${val}\n`;
      });
      
      itemLines += `   الكمية: ${item.quantity} × ${item.price.toFixed(2)} ج.م | الإجمالي: ${(item.price * item.quantity).toFixed(2)} ج.م\n`;
      msg += itemLines;
    });
    msg += `\n`;
    msg += `${divider}\n`;
    
    // Total & Coupon Info
    if (couponCode && discountAmount && finalPrice !== undefined) {
      msg += `💵 *المجموع:* ${totalPrice.toFixed(2)} ج.م\n`;
      msg += `🏷️ *كود الخصم:* ${couponCode} (-${discountAmount.toFixed(2)} ج.م)\n`;
      msg += `💰 *الإجمالي النهائي:* ${finalPrice.toFixed(2)} ج.م\n`;
    } else {
      msg += `💰 *الإجمالي النهائي:* ${totalPrice.toFixed(2)} ج.م\n`;
    }
    msg += `${divider}\n`;
    msg += `✨ _شكراً لتسوقكم معنا! يرجى تأكيد الطلب وتحديد موعد التوصيل._`;
    
    return msg;
  },

  redirectToWhatsApp(
    whatsappNumber: string,
    storeName: string,
    customer: CustomerDetails,
    items: OrderItem[],
    totalPrice: number,
    couponCode?: string,
    discountAmount?: number,
    finalPrice?: number
  ): void {
    const formattedText = this.formatMessage(storeName, customer, items, totalPrice, couponCode, discountAmount, finalPrice);
    const encodedText = encodeURIComponent(formattedText);
    
    // Remove any non-numeric characters from the WhatsApp number except the leading plus
    let cleanPhone = whatsappNumber.replace(/[^\d+]/g, "");
    // If it doesn't start with a plus or country code, add a default (e.g. +20 is typical, but we leave it to store configuration)
    if (!cleanPhone.startsWith("+") && !cleanPhone.startsWith("00")) {
      // Just keep numbers
      cleanPhone = cleanPhone.replace(/\D/g, "");
    } else if (cleanPhone.startsWith("00")) {
      cleanPhone = cleanPhone.substring(2);
    } else {
      cleanPhone = cleanPhone.replace("+", "");
    }
    
    const url = `https://wa.me/${cleanPhone}?text=${encodedText}`;
    window.open(url, "_blank");
  }
};
