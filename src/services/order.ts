import { Order } from "../models";
import { ICart } from "../types/types";

export async function createOrder(
  userId: string,
  userCart: ICart,
  paymentType: string,
  paymentAddress: string,
  paymentCreditCard: string,
  deliveryType: string,
  deliveryAddress: string,
) {
  const newOrder = new Order({
    user: userId,
    cartId: userCart._id,
    items: userCart.items,
    payment: {
      type: paymentType,
      address: paymentAddress,
      creditCard: paymentCreditCard,
    },
    delivery: { type: deliveryType, address: deliveryAddress },
    status: "pending",
    totalPrice: 0,
  });
  await newOrder.save();

  return newOrder;
}
