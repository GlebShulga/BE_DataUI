import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  cart: { type: Schema.Types.ObjectId, ref: "Cart" },
  orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
});

export const User = model("User", userSchema);
