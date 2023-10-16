import { Schema, model } from "mongoose";
import { ICartItem, ICart } from "../types/types";

export const cartItemSchema = new Schema<ICartItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product" },
  count: { type: Number, required: true },
});

const cartSchema = new Schema<ICart>({
  isDeleted: { type: Boolean, default: false },
  items: { type: [cartItemSchema], default: [] },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export const Cart = model("Cart", cartSchema);
