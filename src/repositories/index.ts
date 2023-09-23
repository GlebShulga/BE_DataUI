import * as dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import { MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import {
  createCart,
  deleteCart,
  getCart,
  updateCart,
  checkoutOrder,
  getProductById,
  getProductsList,
} from "../controllers";
import { authenticateUser } from "../auth";
import config from "../config/orm.config";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

async function main() {
  const orm = await MikroORM.init<PostgreSqlDriver>(config);

  app.use((req, res, next) => {
    (req as any).orm = orm;
    next();
  });

  app.use(bodyParser.json());

  // Create user cart
  app.post("/api/profile/cart", authenticateUser, createCart);

  // Get user cart
  app.get("/api/profile/cart", authenticateUser, getCart);

  // Update user cart
  app.put("/api/profile/cart", authenticateUser, updateCart);

  // Empty user cart
  app.delete("/api/profile/cart", authenticateUser, deleteCart);

  // Create an order
  app.post("/api/profile/cart/checkout", authenticateUser, checkoutOrder);

  // Returns a list of products
  app.get("/api/products", authenticateUser, getProductsList);

  // Returns a single product
  app.get("/api/products/:productId", authenticateUser, getProductById);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

main().catch((error) => {
  console.error(error);
});
