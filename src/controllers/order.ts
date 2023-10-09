import { Request, Response } from "express";
import {
  RESPONSE_CODE_BAD_REQUEST,
  RESPONSE_CODE_OK,
  RESPONSE_CODE_SERVER_ERROR,
} from "../constants/responseCodes";
import { getUserCart } from "../services/cart";
import { createOrder } from "../services/order";

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
    const {
      paymentType,
      paymentAddress,
      paymentCreditCard,
      deliveryType,
      deliveryAddress,
    } = req.body;
    const newOrder = await createOrder(
      userId,
      userCart,
      paymentType,
      paymentAddress,
      paymentCreditCard,
      deliveryType,
      deliveryAddress
    );

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
