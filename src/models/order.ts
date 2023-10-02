import { Schema, model } from "mongoose";
import { cartItemSchema } from "./cart";

const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  cartId: { type: Schema.Types.ObjectId, ref: "Cart", required: true },
  items: { type: [cartItemSchema], required: true },
  payment: {
    type: { type: String, required: true },
    address: { type: String, required: true },
    creditCard: { type: String, required: true },
  },
  delivery: {
    type: { type: String, required: true },
    address: { type: String, required: true },
  },
  comments: { type: String },
  status: { type: String, required: true },
  totalPrice: { type: Number, required: true },
});

export const Order = model("Order", orderSchema);
