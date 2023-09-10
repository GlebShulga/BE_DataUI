import { CartItem } from "../types/types";

export function calculateTotalPrice(cartItems: CartItem[]): number {
  return cartItems.reduce((totalPrice, cartItem) => {
    const { product, count } = cartItem;
    const subtotal = product.price * count;
    return totalPrice + subtotal;
  }, 0);
}
