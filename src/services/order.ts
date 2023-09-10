import { writeFile, readFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { ORDERS_FILE_PATH } from "../constants/filePaths";
import { calculateTotalPrice } from "../helpers/calculateTotalPrice";
import { Cart, Order } from "../types/types";

async function createOrder(userId: string, userCart: Cart): Promise<Order> {
  const orderId = uuidv4();

  const orderedItems = userCart.items.map((cartItem) => {
    return {
      product: { ...cartItem.product },
      count: cartItem.count,
    };
  });

  const order: Order = {
    id: orderId,
    userId: userId,
    cartId: userCart.id,
    items: orderedItems,
    payment: {
      type: "paypal", // TODO: Update with payment details
      address: "London", // TODO: Update with payment details
      creditCard: "1234-1234-1234-1234", // TODO: Update with payment details
    },
    delivery: {
      type: "post", // TODO: Update with delivery details
      address: "London", // TODO: Update with delivery details
    },
    status: "created",
    totalPrice: calculateTotalPrice(userCart.items),
  };

  try {
    const existingOrdersData = await readFile(ORDERS_FILE_PATH, "utf8");
    const existingOrders: Order[] = JSON.parse(existingOrdersData);

    existingOrders.push(order);

    await writeFile(
      ORDERS_FILE_PATH,
      JSON.stringify(existingOrders, null, 2),
      "utf8"
    );

    return order;
  } catch (error) {
    const errorMessage =
      "Error creating order: " +
      (error instanceof Error ? error.message : "Unknown error");
    throw new Error(errorMessage);
  }
}

export { createOrder };
