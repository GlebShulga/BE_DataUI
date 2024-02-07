var cors = require("cors");
import * as dotenv from "dotenv";
import express from "express";
import net from "net";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import morgan from "morgan";
import debug from "debug";
import { authenticateUser, CurrentUser } from "./auth";
import { userLogin, userRegistration } from "./controllers/user";
import logger from "./logs/logger";
import {
  RESPONSE_CODE_OK,
  RESPONSE_CODE_SERVER_ERROR,
} from "./constants/responseCodes";
import {
  amazonSearchPromo,
  amazonGetPromoById,
  amazonSavePromo,
  iHerbGetPromoById,
  iHerbSavePromo,
  iHerbSearchPromo,
  amazonGetVoucherById,
  amazonSaveVoucher,
  amazonSearchVoucher,
  amazonGetPriceById,
  amazonSavePrice,
  amazonSearchPrices,
  iHerbGetPriceById,
  iHerbSavePrice,
  iHerbSearchPrices,
  amazonGetProductById,
  amazonSearchProductOrCategory,
  amazonSearchPromoVoucherCode,
} from "./controllers";

declare global {
  namespace Express {
    interface Request {
      user: CurrentUser;
    }
  }
}

dotenv.config();
export const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

const port = process.env.PORT || 8000;
export const server = app.listen(port);

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

  mongoose.connect(uri, options);

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

  // Fetch products or categories
  app.post("/ccv2/v2/AM/dataUi/search", amazonSearchProductOrCategory);
  app.get("/am/v1/products/:productId", amazonGetProductById);

  app.get("/am/v1/promotions/:promotionId", amazonGetPromoById);
  app.post("/am/v1/promotions/save", amazonSavePromo);
  app.post("/am/v1/promotions/search", amazonSearchPromo);

  app.post("/am/v1/vouchers/serial/search", amazonSearchPromoVoucherCode);

  app.get("/ih/v1/promotions/:promotionId", iHerbGetPromoById);
  app.post("/ih/v1/promotions/save", iHerbSavePromo);
  app.post("/ih/v1/promotions/search", iHerbSearchPromo);

  app.get("/am/v1/vouchers/:voucherId", amazonGetVoucherById);
  app.post("/am/v1/vouchers/search", amazonSearchVoucher);
  app.put("/am/v1/vouchers", amazonSaveVoucher);

  app.get("/am/v1/prices/:priceId", amazonGetPriceById);
  app.post("/am/v1/prices/search", amazonSearchPrices);
  app.put("/am/v1/prices", amazonSavePrice);

  app.get("/ih/v1/prices/:priceId", iHerbGetPriceById);
  app.post("/ih/v1/prices/search", iHerbSearchPrices);
  app.post("/ih/v1/prices/updateDescription", iHerbSavePrice);
}

main().catch((error) => {
  console.error(error);
});
