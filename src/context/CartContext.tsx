import React, { createContext, useContext, useState, useEffect } from "react";
import { StorageService } from "../services/storageService";
import type { Product, Coupon } from "../services/storageService";
import { getCartItemPrice } from "../utils/price";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedAttributes: Record<string, string>; // e.g. { "Volume": "100ml" }
  uniqueKey: string; // unique key combining product ID and serialized attributes
}

interface CartContextProps {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (product: Product, quantity: number, attributes: Record<string, string>) => void;
  removeFromCart: (uniqueKey: string) => void;
  updateQuantity: (uniqueKey: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  cartTotal: number;
  cartCount: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string, couponsList: Coupon[]) => { success: boolean; error: string | null };
  removeCoupon: () => void;
  discountAmount: number;
  cartFinalTotal: number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

// Helper to generate a unique key for cart items based on attributes
const generateItemKey = (productId: string, attributes: Record<string, string>): string => {
  const sortedAttrs = Object.entries(attributes)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join("|");
  return `${productId}#${sortedAttrs}`;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => StorageService.getCart());
  const [wishlist, setWishlist] = useState<string[]>(() => StorageService.getWishlist());

  // Save to StorageService whenever state changes
  useEffect(() => {
    StorageService.saveCart(cart);
  }, [cart]);

  useEffect(() => {
    StorageService.saveWishlist(wishlist);
  }, [wishlist]);

  const addToCart = (product: Product, quantity: number, attributes: Record<string, string>) => {
    if (product.isSoldOut) return;
    const key = generateItemKey(product.id, attributes);
    
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.uniqueKey === key);
      
      if (existingItemIndex > -1) {
        // Increment quantity of existing item
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity
        };
        return updatedCart;
      } else {
        // Add new item
        return [
          ...prevCart,
          {
            product,
            quantity,
            selectedAttributes: attributes,
            uniqueKey: key
          }
        ];
      }
    });
  };

  const removeFromCart = (uniqueKey: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.uniqueKey !== uniqueKey));
  };

  const updateQuantity = (uniqueKey: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(uniqueKey);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.uniqueKey === uniqueKey ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.includes(productId)) {
        return prevWishlist.filter((id) => id !== productId);
      } else {
        return [...prevWishlist, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const cartTotal = cart.reduce((total, item) => total + getCartItemPrice(item) * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Auto-validate coupon if cart total changes
  useEffect(() => {
    if (appliedCoupon) {
      if (appliedCoupon.minOrderValue && cartTotal < appliedCoupon.minOrderValue) {
        setAppliedCoupon(null);
      }
    }
  }, [cartTotal, appliedCoupon]);

  const applyCoupon = (code: string, couponsList: Coupon[]) => {
    const uppercaseCode = code.trim().toUpperCase();
    const coupon = couponsList.find((c) => c.code === uppercaseCode);

    if (!coupon) {
      return { success: false, error: "كوبون الخصم غير صحيح." };
    }
    if (!coupon.isActive) {
      return { success: false, error: "كوبون الخصم هذا معطل أو انتهت صلاحيته." };
    }
    if (coupon.minOrderValue && cartTotal < coupon.minOrderValue) {
      return { success: false, error: `الحد الأدنى لتطبيق هذا الكوبون هو ${coupon.minOrderValue} ج.م.` };
    }

    setAppliedCoupon(coupon);
    return { success: true, error: null };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const discountAmount = appliedCoupon
    ? appliedCoupon.type === "percentage"
      ? cartTotal * (appliedCoupon.value / 100)
      : appliedCoupon.value
    : 0;

  const cartFinalTotal = Math.max(0, cartTotal - discountAmount);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        cartTotal,
        cartCount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountAmount,
        cartFinalTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
