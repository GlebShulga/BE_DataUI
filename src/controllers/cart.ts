import { Request, Response } from "express";
import { ICartItem } from "../types/types";
import {
  RESPONSE_CODE_OK,
  RESPONSE_CODE_SERVER_ERROR,
} from "../constants/responseCodes";
import { createUserCart, getUserCart, updateUserCart } from "../services/cart";
import { Cart } from "../models";
import { CurrentUser } from "../auth";

export async function createCart(req: Request, res: Response) {
  try {
    const { id: userId } = req.user as CurrentUser;
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
    const { id: userId } = req.user as CurrentUser;
    const cart = await getUserCart(userId);

    const totalPrice = cart.items.reduce(
      (total: number, item: ICartItem) =>
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
  const { id: userId } = req.user as CurrentUser;
  const updatedCart = req.body;

  try {
    const cart = await updateUserCart(userId, updatedCart.items);

    const totalPrice = cart.items.reduce((total: number, item: ICartItem) => {
      if (item.product) {
        return total + item.product.price * item.count;
      }
      return total;
    }, 0);

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
  const { id: userId } = req.user as CurrentUser;

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
