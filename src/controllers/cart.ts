import { Request, Response } from "express";
import {
  createUserCart,
  deleteUserCart,
  getUserCart,
  updateUserCart,
} from "../services/cart";
import { Cart, User } from "../types/types";
import { updateCartSchema } from "../helpers/validations";
import {
  RESPONSE_CODE_BAD_REQUEST,
  RESPONSE_CODE_OK,
  RESPONSE_CODE_SERVER_ERROR,
} from "../constants/responseCodes";

export async function createCart(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;

    const cart = await createUserCart(userId);

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

    const cart = await getUserCart(userId);

    const totalPrice = cart.items.reduce(
      (total, item) => total + item.product.price * item.count,
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
    const updatedUserCart = await updateUserCart(userId, updatedCart);

    const totalPrice = updatedUserCart.items.reduce(
      (total, item) => total + item.product.price * item.count,
      0
    );

    res.status(RESPONSE_CODE_OK).json({
      data: { cart: updatedUserCart, totalPrice },
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
    await deleteUserCart(userId);

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
