import * as dotenv from "dotenv";
import express from "express";
import net from "net";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import morgan from "morgan";
import debug from "debug";
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
import logger from "./logs/logger";
import {
  RESPONSE_CODE_OK,
  RESPONSE_CODE_SERVER_ERROR,
} from "./constants/responseCodes";

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
const server = app.listen(port);

const debugLogger = debug("node-app");

let connections: net.Socket[] = [];

server.on("connection", (connection) => {
  // register connections
  connections.push(connection);

  // remove/filter closed connections
  connection.on("close", () => {
    connections = connections.filter(
      (currentConnection) => currentConnection !== connection,
    );
  });
});

server.on("connection", (connection) => {
  // register connections
  connections.push(connection);

  // remove/filter closed connections
  connection.on("close", () => {
    connections = connections.filter(
      (currentConnection) => currentConnection !== connection,
    );
  });
});

server.on("listening", () => {
  console.log(`Server is listening on port ${port}`);
});

function shutdown() {
  console.log("Received kill signal, shutting down gracefully");

  server.close(() => {
    console.log("Closed out remaining connections");
    process.exit(0);
  });

  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down",
    );
    process.exit(1);
  }, 20000);

  // end current connections
  connections.forEach((connection) => connection.end());

  // then destroy connections
  setTimeout(() => {
    connections.forEach((connection) => connection.destroy());
  }, 10000);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

async function main() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/nodejs";

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    heartbeatFrequencyMS: 1000,
  };

  await mongoose.connect(uri, options);

  app.use(
    morgan("combined", {
      stream: {
        write: (message) => {
          logger.info(message.trim());
        },
      },
    }),
  );

  app.use(bodyParser.json());

  app.get("/health", async (req, res) => {
    try {
      // Check database connection
      await mongoose.connection.db.admin().ping();

      // Return success response
      res.status(RESPONSE_CODE_OK).json({
        message: "Application is healthy",
        database: "connected",
      });

      debugLogger("Health check succeeded");
    } catch (error) {
      // Return error response
      res.status(RESPONSE_CODE_SERVER_ERROR).json({
        message: "Application is unhealthy",
        database: "disconnected",
      });

      debugLogger("Health check failed: %O", error);
    }
  });

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
}

main().catch((error) => {
  console.error(error);
});
