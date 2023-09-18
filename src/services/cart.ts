import { writeFile, readFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { CARTS_FILE_PATH } from "../constants/filePaths";
import { Cart } from "../types/types";

/**
 * Service function to create a user cart.
 * @param userId The ID of the user for whom the cart is created.
 * @returns The created cart.
 */
export async function createUserCart(userId: string): Promise<Cart> {
  try {
    const cartId = uuidv4();

    const cartData = await readFile(CARTS_FILE_PATH, "utf8");
    const allCarts: Cart[] = JSON.parse(cartData);

    const userCartIndex = allCarts.findIndex(
      (cart) => cart.userId === userId && !cart.isDeleted
    );

    if (userCartIndex === -1) {
      const newCart: Cart = {
        id: cartId,
        userId: userId,
        isDeleted: false,
        items: [],
      };
      allCarts.push(newCart);

      await writeFile(
        CARTS_FILE_PATH,
        JSON.stringify(allCarts, null, 2),
        "utf8"
      );

      return newCart;
    } else {
      return allCarts[userCartIndex];
    }
  } catch (error) {
    throw new Error("Error creating cart");
  }
}

export async function getUserCart(userId: string): Promise<Cart> {
  try {
    const cartData = await readFile(CARTS_FILE_PATH, "utf8");
    const carts: Cart[] = JSON.parse(cartData);

    const userCart = carts.find(
      (cart) => cart.userId === userId && !cart.isDeleted
    );

    if (userCart) {
      return userCart;
    } else {
      const cartId = uuidv4();

      const newCart: Cart = {
        id: cartId,
        userId: userId,
        isDeleted: false,
        items: [],
      };
      carts.push(newCart);

      return newCart;
    }
  } catch (error) {
    throw new Error("Error fetching user cart");
  }
}

/**
 * Service function to update a user's cart.
 * @param userId The ID of the user whose cart is being updated.
 * @param updatedCart The updated cart object.
 * @returns The updated cart.
 */
export async function updateUserCart(
  userId: string,
  updatedCart: Cart
): Promise<Cart> {
  try {
    const cartData = await readFile(CARTS_FILE_PATH, "utf8");
    const carts: Cart[] = JSON.parse(cartData);

    const userCartIndex = carts.findIndex(
      (cart) => cart.userId === userId && !cart.isDeleted
    );

    if (userCartIndex !== -1) {
      carts[userCartIndex].items = updatedCart.items;
    } else {
      const cartId = uuidv4();
      const newCart: Cart = {
        id: cartId,
        userId: userId,
        isDeleted: false,
        items: updatedCart.items,
      };
      carts.push(newCart);
    }

    await writeFile(CARTS_FILE_PATH, JSON.stringify(carts, null, 2), "utf8");

    return updatedCart;
  } catch (error) {
    throw new Error("Error updating user cart");
  }
}

/**
 * Service function to delete a user's cart.
 * @param userId The ID of the user whose cart should be marked as deleted.
 * @returns A Promise that resolves when the cart is marked as deleted.
 */
export async function deleteUserCart(userId: string): Promise<void> {
  try {
    const cartData = await readFile(CARTS_FILE_PATH, "utf8");
    const carts: Cart[] = JSON.parse(cartData);

    const userCartIndex = carts.findIndex(
      (cart) => cart.userId === userId && !cart.isDeleted
    );

    if (userCartIndex !== -1) {
      carts[userCartIndex].isDeleted = true;
      await writeFile(CARTS_FILE_PATH, JSON.stringify(carts, null, 2), "utf8");
    }
  } catch (error) {
    throw new Error("Error marking user cart as deleted");
  }
}
