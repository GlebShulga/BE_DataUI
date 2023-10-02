import { Request, Response } from "express";
import {
  RESPONSE_CODE_BAD_REQUEST,
  RESPONSE_CODE_OK,
  RESPONSE_CODE_SERVER_ERROR,
} from "../constants/responseCodes";
import { getUserCart } from "../services/cart";
import { Order } from "../models";

export async function checkoutOrder(req: Request, res: Response) {
  const userId = (req as any).user.id;
  const userCart = await getUserCart(userId);

  if (!userCart?.items || userCart.items.length === 0) {
    return res.status(RESPONSE_CODE_BAD_REQUEST).json({
      data: null,
      error: { message: "Cart is empty or missing" },
    });
  }

  try {
    const newOrder = new Order({
      user: userId,
      cartId: userCart._id,
      items: userCart.items,
      payment: {
        type: "credit card", // all hardcoded fields should be taken from the FE request
        address: "123 Main St",
        creditCard: "1234-5678-9012-3456",
      },
      delivery: { type: "standard", address: "123 Main St" },
      status: "pending",
      totalPrice: 0,
    });
    await newOrder.save();

    res.status(RESPONSE_CODE_OK).json({
      data: { order: newOrder },
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.status(RESPONSE_CODE_SERVER_ERROR).json({
      data: null,
      error: { message: "Internal server error" },
    });
  }
}
