import { Request, Response } from "express";
import { CartItem, User } from "../types/types";
import { updateCartSchema } from "../helpers/validations";
import {
  RESPONSE_CODE_BAD_REQUEST,
  RESPONSE_CODE_OK,
  RESPONSE_CODE_SERVER_ERROR,
} from "../constants/responseCodes";
import { Cart } from "../entities/Cart";
import { createUserCart, getUserCart } from "../services/cart";

export async function createCart(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const em = (req as any).orm.em.fork();

    const cart = await createUserCart(em, userId);

    res.status(201).json({
      data: { cart, totalPrice: 0 },
      error: null,
    });
  } catch (error) {
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      data: null,
      error: { message: "Error creating user cart" },
    });
  }
}

export async function getCart(req: Request, res: Response) {
  try {
    const userId = ((req as any).user as User).id;
    const em = (req as any).orm.em.fork();

    const cart = await getUserCart(em, userId);

    const totalPrice = cart.items.reduce(
      (total: number, item: CartItem) =>
        total + item.product.price * item.count,
      0
    );

    res.status(RESPONSE_CODE_OK).json({
      data: { cart, totalPrice },
      error: null,
    });
  } catch (error) {
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      data: null,
      error: { message: "Error getting user cart" },
    });
  }
}

export async function updateCart(req: Request, res: Response) {
  const userId = ((req as any).user as User).id;
  const updatedCart = req.body.cart as Cart;

  const { error } = updateCartSchema.validate(updatedCart, {
    context: { userId },
  });

  if (error) {
    return res.status(RESPONSE_CODE_BAD_REQUEST).json({
      data: null,
      error: {
        message: "Invalid cart data",
        details: error.details.map((detail) => detail.message),
      },
    });
  }

  try {
    const em = (req as any).orm.em.fork();

    const userCart = await em.findOne(Cart, {
      userId,
      isDeleted: false,
    });

    if (!userCart) {
      throw new Error("Cart not found");
    }

    userCart.items = updatedCart.items;

    await em.persistAndFlush(userCart);

    const totalPrice = userCart.items.reduce(
      (total: number, item: CartItem) =>
        total + item.product.price * item.count,
      0
    );

    res.status(RESPONSE_CODE_OK).json({
      data: { cart: userCart, totalPrice },
      error: null,
    });
  } catch (error) {
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      data: null,
      error: { message: "Error updating user cart" },
    });
  }
}

export async function deleteCart(req: Request, res: Response) {
  const userId = ((req as any).user as User).id;

  try {
    const em = (req as any).orm.em.fork();
    const userCart = await em.findOne(Cart, {
      userId: userId,
      isDeleted: false,
    });

    if (!userCart) {
      throw new Error("Cart not found");
    }

    userCart.isDeleted = true;

    await em.persistAndFlush(userCart);

    res.status(RESPONSE_CODE_OK).json({
      data: { success: true },
      error: null,
    });
  } catch (error) {
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      data: null,
      error: { message: "Error deleting user cart" },
    });
  }
}
