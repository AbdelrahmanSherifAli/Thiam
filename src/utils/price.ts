import type { Product } from "../services/storageService";

export const getAdjustedPrice = (product: Product, selectedAttributes: Record<string, string>): number => {
  let additionalPrice = 0;
  Object.values(selectedAttributes).forEach((optVal) => {
    const match = optVal.match(/\(\+(\d+)(?:\s*EGP)?\)/);
    if (match) {
      additionalPrice += parseFloat(match[1]);
    }
  });
  return product.price + additionalPrice;
};

export const getCartItemPrice = (item: { product: Product; selectedAttributes: Record<string, string> }): number => {
  return getAdjustedPrice(item.product, item.selectedAttributes);
};
