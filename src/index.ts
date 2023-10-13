import * as dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import {
  createCart,
  deleteCart,
  getCart,
  updateCart,
  checkoutOrder,
  getProductById,
  getProductsList,
} from "./controllers";
import { authenticateUser, CurrentUser } from "./auth";
import { userLogin, userRegistration } from "./controllers/user";
import { isAdmin } from "./middleware/isAdmin";

declare global {
  namespace Express {
    interface Request {
      user: CurrentUser;
    }
  }
}

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

async function main() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/nodejs";

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    heartbeatFrequencyMS: 1000,
  };

  await mongoose.connect(uri, options);

  app.use(bodyParser.json());

  // Create user
  app.post("/api/register", userRegistration);

  // Login user
  app.post("/api/login", userLogin);

  app.use("/api", authenticateUser);

  // Create user cart
  app.post("/api/profile/cart", createCart);

  // Get user cart
  app.get("/api/profile/cart", getCart);

  // Update user cart
  app.put("/api/profile/cart", updateCart);

  // Empty user cart
  app.delete("/api/profile/cart", isAdmin, deleteCart);

  // Create an order
  app.post("/api/profile/cart/checkout", checkoutOrder);

  // Returns a list of products
  app.get("/api/products", getProductsList);

  // Returns a single product
  app.get("/api/products/:productId", getProductById);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

main().catch((error) => {
  console.error(error);
});
