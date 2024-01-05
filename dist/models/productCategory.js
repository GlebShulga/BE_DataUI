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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = exports.Product = exports.createSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const createSchema = (collectionName) => new mongoose_1.Schema({
    brandName: { type: String, required: true },
    catalogVersion: { type: String, required: true },
    code: { type: String, required: true },
    description: { type: String, required: true },
    name: { type: String, required: true },
    priceRange: { type: Object, required: false },
    styleCode: { type: String, required: true },
    url: { type: String, required: true },
    hierarchyLevel: { type: Number, enum: [1, 2], required: true },
}, { collection: collectionName });
exports.createSchema = createSchema;
const amazonDBName = process.env.PRODUCT_MONGODB_DB_NAME || "test";
const db = mongoose_1.default.connection.useDb(amazonDBName);
exports.Product = db.model("Product", (0, exports.createSchema)("products"));
exports.Category = db.model("Category", (0, exports.createSchema)("category"));
