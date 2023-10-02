import { Cart, User } from "../models";
import { CartItemType, CartType } from "../types/types";
import { updateCartSchema } from "../helpers/validations";

/**
 * Service function to create a user cart.
 * @param userId The ID of the user for whom the cart is created.
 * @returns The created cart.
 */
export async function createUserCart(
  userId: string,
  items: CartItemType[]
): Promise<CartType> {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const newCart = new Cart({ user });

    if (items && items.length > 0) {
      for (const item of items) {
        const { product, count } = item;

        newCart.items.push({ product, count });
      }
    }

    await newCart.save();

    return newCart;
  } catch (error) {
    console.error("Error creating cart:", error);
    throw new Error("Error creating cart");
  }
}

/**
 * Service function to get a user cart.
 * @param userId The ID of the user for whom the cart is created.
 * @returns The existed or newly created cart.
 */
export async function getUserCart(userId: string): Promise<CartType> {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const userCart = await Cart.findOne({ user, isDeleted: false });

  if (userCart) {
    return userCart;
  } else {
    const newCart = new Cart({ user, items: [] });
    await newCart.save();

    return newCart;
  }
}

export async function updateUserCart(
  userId: string,
  cartItems: CartItemType[]
): Promise<CartType> {
  try {
    const userCart = await Cart.findOne({
      user: userId,
      isDeleted: false,
    });

    if (!userCart) {
      throw new Error("Cart not found");
    }

    for (const item of cartItems) {
      const { product, count } = item;
      await updateCartSchema.validateAsync({
        user: userId,
        isDeleted: userCart.isDeleted,
        items: cartItems,
      });
      const existingItemIndex = userCart.items.findIndex((cartItem) => {
        return cartItem.product?.toString() === product?._id.toString();
      });

      if (existingItemIndex !== -1) {
        count === 0
          ? userCart.items.splice(existingItemIndex, 1)
          : (userCart.items[existingItemIndex].count += count);
      } else {
        userCart.items.push({ product, count });
      }
    }

    await userCart.save();

    return userCart;
  } catch (error) {
    console.error("Error updating user cart:", error);
    throw new Error("Error updating user cart");
  }
}
