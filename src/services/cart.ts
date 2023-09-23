import { EntityManager } from "@mikro-orm/core";
import { User, Cart } from "../entities";

/**
 * Service function to create a user cart.
 * @param em The EntityManager instance.
 * @param userId The ID of the user for whom the cart is created.
 * @returns The created cart.
 */
export async function createUserCart(
  em: EntityManager,
  userId: string
): Promise<Cart> {
  try {
    const user = await em.findOneOrFail(User, userId);
    const newCart = new Cart(user);
    await em.persistAndFlush(newCart);

    return newCart;
  } catch (error) {
    console.error("Error creating cart:", error);
    throw new Error("Error creating cart");
  }
}

/**
 * Service function to get a user cart.
 * @param em The EntityManager instance.
 * @param userId The ID of the user for whom the cart is created.
 * @returns The existed or newly created cart.
 */
export async function getUserCart(
  em: EntityManager,
  userId: string
): Promise<Cart> {
  const user = await em.findOneOrFail(User, userId);
  const userCart = await em.findOne(Cart, { user, isDeleted: false });

  if (userCart) {
    return userCart;
  } else {
    const newCart: Cart = new Cart(user);
    em.persist(newCart);

    return newCart;
  }
}
