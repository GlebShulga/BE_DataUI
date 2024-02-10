"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
var cors = require("cors");
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const debug_1 = __importDefault(require("debug"));
const auth_1 = require("./auth");
const user_1 = require("./controllers/user");
const responseCodes_1 = require("./constants/responseCodes");
const controllers_1 = require("./controllers");
dotenv.config();
exports.app = (0, express_1.default)();
exports.app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
const port = process.env.PORT || 8000;
exports.server = exports.app.listen(port);
const debugLogger = (0, debug_1.default)("node-app");
let connections = [];
exports.server.on("connection", (connection) => {
    // register connections
    connections.push(connection);
    // remove/filter closed connections
    connection.on("close", () => {
        connections = connections.filter((currentConnection) => currentConnection !== connection);
    });
});
exports.server.on("connection", (connection) => {
    // register connections
    connections.push(connection);
    // remove/filter closed connections
    connection.on("close", () => {
        connections = connections.filter((currentConnection) => currentConnection !== connection);
    });
});
exports.server.on("listening", () => {
    console.log(`Server is listening on port ${port}`);
});
function shutdown() {
    console.log("Received kill signal, shutting down gracefully");
    exports.server.close(() => {
        console.log("Closed out remaining connections");
        process.exit(0);
    });
    setTimeout(() => {
        console.error("Could not close connections in time, forcefully shutting down");
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
    mongoose_1.default.connect(uri, options);
    exports.app.use(body_parser_1.default.json());
    exports.app.get("/health", async (req, res) => {
        try {
            // Check database connection
            await mongoose_1.default.connection.db.admin().ping();
            // Return success response
            res.status(responseCodes_1.RESPONSE_CODE_OK).json({
                message: "Application is healthy",
                database: "connected",
            });
            debugLogger("Health check succeeded");
        }
        catch (error) {
            // Return error response
            res.status(responseCodes_1.RESPONSE_CODE_SERVER_ERROR).json({
                message: "Application is unhealthy",
                database: "disconnected",
            });
            debugLogger("Health check failed: %O", error);
        }
    });
    // Create user
    exports.app.post("/api/register", user_1.userRegistration);
    // Login user
    exports.app.post("/api/login", user_1.userLogin);
    exports.app.use("/api", auth_1.authenticateUser);
    // Fetch products or categories
    exports.app.post("/ccv2/v2/AM/dataUi/search", controllers_1.amazonSearchProductOrCategory);
    exports.app.get("/am/v1/products/:productId", controllers_1.amazonGetProductById);
    exports.app.get("/am/v1/promotions/:promotionId", controllers_1.amazonGetPromoById);
    exports.app.post("/am/v1/promotions/save", controllers_1.amazonSavePromo);
    exports.app.post("/am/v1/promotions/search", controllers_1.amazonSearchPromo);
    exports.app.post("/am/v1/vouchers/serial/search", controllers_1.amazonSearchPromoVoucherCode);
    exports.app.get("/ih/v1/promotions/:promotionId", controllers_1.iHerbGetPromoById);
    exports.app.post("/ih/v1/promotions/save", controllers_1.iHerbSavePromo);
    exports.app.post("/ih/v1/promotions/search", controllers_1.iHerbSearchPromo);
    exports.app.get("/am/v1/vouchers/:voucherId", controllers_1.amazonGetVoucherById);
    exports.app.post("/am/v1/vouchers/search", controllers_1.amazonSearchVoucher);
    exports.app.put("/am/v1/vouchers", controllers_1.amazonSaveVoucher);
    exports.app.get("/am/v1/prices/:priceId", controllers_1.amazonGetPriceById);
    exports.app.post("/am/v1/prices/search", controllers_1.amazonSearchPrices);
    exports.app.put("/am/v1/prices", controllers_1.amazonSavePrice);
    exports.app.get("/ih/v1/prices/:priceId", controllers_1.iHerbGetPriceById);
    exports.app.post("/ih/v1/prices/search", controllers_1.iHerbSearchPrices);
    exports.app.post("/ih/v1/prices/updateDescription", controllers_1.iHerbSavePrice);
}
main().catch((error) => {
    console.error(error);
});
