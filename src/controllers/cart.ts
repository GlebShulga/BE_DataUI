import { Request, Response } from "express";
import { CartItemType } from "../types/types";
import {
  RESPONSE_CODE_OK,
  RESPONSE_CODE_SERVER_ERROR,
} from "../constants/responseCodes";
import { createUserCart, getUserCart, updateUserCart } from "../services/cart";
import { Cart } from "../models";

export async function createCart(req: Request, res: Response) {
  try {
    const userId = (req as any).user._id;
    const { items } = req.body;
    const cart = await createUserCart(userId, items);

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
    const { user_id } = (req as any).user;
    const cart = await getUserCart(user_id);

    const totalPrice = cart.items.reduce(
      (total: number, item: CartItemType) =>
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
  const userId = (req as any).user._id;
  const updatedCart = req.body;

  try {
    const cart = await updateUserCart(userId, updatedCart.items);

    const totalPrice = cart.items.reduce(
      (total: number, item: CartItemType) => {
        if (item.product) {
          return total + item.product.price * item.count;
        }
        return total;
      },
      0
    );

    res.status(RESPONSE_CODE_OK).json({
      data: { cart: cart, totalPrice },
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
  const userId = (req as any).user._id;

  try {
    const userCart = await Cart.findOne({
      user: userId,
      isDeleted: false,
    });

    if (!userCart) {
      throw new Error("Cart not found");
    }

    userCart.isDeleted = true;

    await userCart.save();

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
